import prisma from '../prismaClient.js';

// Helper to resolve and auto-create ingredients
const resolveIngredients = async (ingredientsInput) => {
  const resolved = [];

  for (const item of ingredientsInput) {
    if (!item.nombre || item.cantidad === undefined || !item.unidad) {
      throw new Error('Cada ingrediente debe tener nombre, cantidad y unidad');
    }

    const nameNormalized = item.nombre.trim();
    const qty = parseFloat(item.cantidad);
    const unit = item.unidad.trim();

    if (isNaN(qty) || qty <= 0) {
      throw new Error(`La cantidad de "${nameNormalized}" debe ser un número positivo`);
    }

    // Check if ingredient exists (case-insensitive)
    let ingredient = await prisma.ingredient.findFirst({
      where: {
        nombre: {
          equals: nameNormalized,
          mode: 'insensitive',
        },
      },
    });

    if (!ingredient) {
      // Auto-create ingredient
      // Determine default base unit
      let unidad_base = 'unidad';
      const unitLower = unit.toLowerCase();

      if (['g', 'kg', 'gr', 'gramos', 'kilo', 'kilos'].includes(unitLower)) {
        unidad_base = 'g';
      } else if (['ml', 'l', 'litro', 'litros', 'taza', 'tazas', 'cucharada', 'cucharadas'].includes(unitLower)) {
        if (['ml', 'l', 'litro', 'litros'].includes(unitLower)) {
          unidad_base = 'ml';
        } else {
          unidad_base = 'unidad';
        }
      }

      ingredient = await prisma.ingredient.create({
        data: {
          nombre: nameNormalized,
          unidad_base,
        },
      });

      // Auto-create standard conversion if recipe unit is kg/l/litro
      if (unitLower === 'kg' && unidad_base === 'g') {
        await prisma.unitConversion.create({
          data: {
            ingredient_id: ingredient.id,
            unidad_origen: 'kg',
            factor_a_base: 1000.0,
          },
        });
      } else if ((unitLower === 'l' || unitLower === 'litro' || unitLower === 'litros') && unidad_base === 'ml') {
        await prisma.unitConversion.create({
          data: {
            ingredient_id: ingredient.id,
            unidad_origen: unit,
            factor_a_base: 1000.0,
          },
        });
      }
    }

    resolved.push({
      ingredient_id: ingredient.id,
      cantidad: qty,
      unidad: unit,
    });
  }

  return resolved;
};

// POST /api/recipes
// Create recipe with nested ingredients
const createRecipe = async (req, res, next) => {
  try {
    const { nombre, porciones_base, tipo_comida, tiempo_preparacion_min, instrucciones, ingredients } = req.body;

    if (!nombre || porciones_base === undefined || !tipo_comida || !instrucciones) {
      return res.status(400).json({ error: 'nombre, porciones_base, tipo_comida, and instrucciones are required' });
    }

    const servings = parseInt(porciones_base, 10);
    if (isNaN(servings) || servings <= 0) {
      return res.status(400).json({ error: 'porciones_base must be a positive integer' });
    }

    const allowedTypes = ['almuerzo', 'cena', 'ambos'];
    if (!allowedTypes.includes(tipo_comida)) {
      return res.status(400).json({ error: `tipo_comida must be one of: ${allowedTypes.join(', ')}` });
    }

    const prepTime = tiempo_preparacion_min ? parseInt(tiempo_preparacion_min, 10) : null;
    if (prepTime !== null && (isNaN(prepTime) || prepTime <= 0)) {
      return res.status(400).json({ error: 'tiempo_preparacion_min must be a positive integer' });
    }

    if (!Array.isArray(ingredients) || ingredients.length === 0) {
      return res.status(400).json({ error: 'ingredients must be a non-empty array' });
    }

    // Resolve ingredients (and auto-create if necessary)
    let resolvedIngredients;
    try {
      resolvedIngredients = await resolveIngredients(ingredients);
    } catch (err) {
      return res.status(400).json({ error: err.message });
    }

    // Create recipe in a transaction
    const newRecipe = await prisma.$transaction(async (tx) => {
      const recipe = await tx.recipe.create({
        data: {
          nombre: nombre.trim(),
          porciones_base: servings,
          tipo_comida,
          tiempo_preparacion_min: prepTime,
          instrucciones: instrucciones.trim(),
        },
      });

      // Create recipe_ingredient links
      for (const ring of resolvedIngredients) {
        await tx.recipeIngredient.create({
          data: {
            recipe_id: recipe.id,
            ingredient_id: ring.ingredient_id,
            cantidad: ring.cantidad,
            unidad: ring.unidad,
          },
        });
      }

      return tx.recipe.findUnique({
        where: { id: recipe.id },
        include: {
          ingredients: {
            include: {
              ingredient: true,
            },
          },
        },
      });
    });

    res.status(201).json(newRecipe);
  } catch (error) {
    next(error);
  }
};

// GET /api/recipes/:id
// Get recipe detail
const getRecipeById = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid recipe ID' });
    }

    const recipe = await prisma.recipe.findUnique({
      where: { id },
      include: {
        ingredients: {
          include: {
            ingredient: true,
          },
        },
      },
    });

    if (!recipe) {
      return res.status(404).json({ error: 'Recipe not found' });
    }

    res.json(recipe);
  } catch (error) {
    next(error);
  }
};

// GET /api/recipes
// Search recipes by query
const searchRecipes = async (req, res, next) => {
  try {
    const q = req.query.q ? req.query.q.trim() : '';

    let recipes;
    if (q) {
      // Search by recipe name OR ingredient name
      recipes = await prisma.recipe.findMany({
        where: {
          OR: [
            {
              nombre: {
                contains: q,
                mode: 'insensitive',
              },
            },
            {
              ingredients: {
                some: {
                  ingredient: {
                    nombre: {
                      contains: q,
                      mode: 'insensitive',
                    },
                  },
                },
              },
            },
          ],
        },
        include: {
          ingredients: {
            include: {
              ingredient: true,
            },
          },
        },
        orderBy: {
          nombre: 'asc',
        },
      });
    } else {
      // If no query parameter, list all recipes
      recipes = await prisma.recipe.findMany({
        include: {
          ingredients: {
            include: {
              ingredient: true,
            },
          },
        },
        orderBy: {
          nombre: 'asc',
        },
      });
    }

    if (recipes.length === 0) {
      return res.json({
        results: [],
        message: q 
          ? `No se encontraron recetas que coincidan con la búsqueda "${q}".`
          : "No hay recetas cargadas en el catálogo."
      });
    }

    res.json({ results: recipes });
  } catch (error) {
    next(error);
  }
};

// PUT /api/recipes/:id
// Edit existing recipe
const updateRecipe = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid recipe ID' });
    }

    // Verify recipe exists
    const existingRecipe = await prisma.recipe.findUnique({
      where: { id },
    });

    if (!existingRecipe) {
      return res.status(404).json({ error: 'Recipe not found' });
    }

    const { nombre, porciones_base, tipo_comida, tiempo_preparacion_min, instrucciones, ingredients } = req.body;

    const dataToUpdate = {};
    if (nombre) dataToUpdate.nombre = nombre.trim();
    if (porciones_base !== undefined) {
      const servings = parseInt(porciones_base, 10);
      if (isNaN(servings) || servings <= 0) {
        return res.status(400).json({ error: 'porciones_base must be a positive integer' });
      }
      dataToUpdate.porciones_base = servings;
    }
    if (tipo_comida) {
      const allowedTypes = ['almuerzo', 'cena', 'ambos'];
      if (!allowedTypes.includes(tipo_comida)) {
        return res.status(400).json({ error: `tipo_comida must be one of: ${allowedTypes.join(', ')}` });
      }
      dataToUpdate.tipo_comida = tipo_comida;
    }
    if (tiempo_preparacion_min !== undefined) {
      const prepTime = tiempo_preparacion_min ? parseInt(tiempo_preparacion_min, 10) : null;
      if (prepTime !== null && (isNaN(prepTime) || prepTime <= 0)) {
        return res.status(400).json({ error: 'tiempo_preparacion_min must be a positive integer' });
      }
      dataToUpdate.tiempo_preparacion_min = prepTime;
    }
    if (instrucciones) dataToUpdate.instrucciones = instrucciones.trim();

    let resolvedIngredients = null;
    if (ingredients) {
      if (!Array.isArray(ingredients) || ingredients.length === 0) {
        return res.status(400).json({ error: 'ingredients must be a non-empty array' });
      }
      try {
        resolvedIngredients = await resolveIngredients(ingredients);
      } catch (err) {
        return res.status(400).json({ error: err.message });
      }
    }

    const updatedRecipe = await prisma.$transaction(async (tx) => {
      // Update basic fields
      const recipe = await tx.recipe.update({
        where: { id },
        data: dataToUpdate,
      });

      if (resolvedIngredients) {
        // Delete old ingredients
        await tx.recipeIngredient.deleteMany({
          where: { recipe_id: id },
        });

        // Insert new ingredients
        for (const ring of resolvedIngredients) {
          await tx.recipeIngredient.create({
            data: {
              recipe_id: id,
              ingredient_id: ring.ingredient_id,
              cantidad: ring.cantidad,
              unidad: ring.unidad,
            },
          });
        }
      }

      return tx.recipe.findUnique({
        where: { id },
        include: {
          ingredients: {
            include: {
              ingredient: true,
            },
          },
        },
      });
    });

    res.json(updatedRecipe);
  } catch (error) {
    next(error);
  }
};

export {
  createRecipe,
  getRecipeById,
  searchRecipes,
  updateRecipe,
};
