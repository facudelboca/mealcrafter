import prisma from '../prismaClient.js';
import { 
  searchExternalRecipes, 
  getExternalRecipeById, 
  translateSpanishToEnglish, 
  translateRecipeToSpanish 
} from '../services/externalRecipes.js';

// Re-adapted resolveIngredients helper for external imports
const resolveIngredients = async (ingredientsInput) => {
  const resolved = [];

  for (const item of ingredientsInput) {
    const nameNormalized = item.nombre.trim();
    const qty = parseFloat(item.cantidad);
    const unit = item.unidad.trim();

    // Check if ingredient exists (case-insensitive)
    let ingredient = await prisma.ingredient.findFirst({
      where: {
        nombre: {
          equals: nameNormalized,
          mode: 'insensitive',
        },
      },
    });
    if (ingredient) {
      const unitLower = unit.toLowerCase();
      // Upgrade base unit from 'unidad' if we are importing standard mass/volume units
      if (ingredient.unidad_base === 'unidad') {
        let newBase = null;
        if (['g', 'kg', 'gr', 'gramos', 'kilo', 'kilos'].includes(unitLower)) {
          newBase = 'g';
        } else if (['ml', 'l', 'litro', 'litros', 'taza', 'tazas', 'cucharada', 'cucharadas', 'cucharadita', 'cucharaditas'].includes(unitLower)) {
          newBase = 'ml';
        }

        if (newBase) {
          ingredient = await prisma.ingredient.update({
            where: { id: ingredient.id },
            data: { unidad_base: newBase }
          });
        }
      }

      // Check and create missing conversion
      const existingConversion = await prisma.unitConversion.findFirst({
        where: {
          ingredient_id: ingredient.id,
          unidad_origen: {
            equals: unit,
            mode: 'insensitive'
          }
        }
      });

      if (!existingConversion) {
        let factor = null;
        if (['taza', 'tazas'].includes(unitLower) && ingredient.unidad_base === 'ml') factor = 250.0;
        else if (['cucharada', 'cucharadas'].includes(unitLower) && ingredient.unidad_base === 'ml') factor = 15.0;
        else if (['cucharadita', 'cucharaditas'].includes(unitLower) && ingredient.unidad_base === 'ml') factor = 5.0;
        else if (['kg', 'kilo', 'kilos'].includes(unitLower) && ingredient.unidad_base === 'g') factor = 1000.0;
        else if (['l', 'litro', 'litros'].includes(unitLower) && ingredient.unidad_base === 'ml') factor = 1000.0;

        if (factor) {
          await prisma.unitConversion.create({
            data: {
              ingredient_id: ingredient.id,
              unidad_origen: unit,
              factor_a_base: factor,
            },
          });
        }
      }
    }

    if (!ingredient) {
      // Auto-create ingredient
      let unidad_base = 'unidad';
      const unitLower = unit.toLowerCase();

      if (['g', 'kg', 'gr', 'gramos', 'kilo', 'kilos'].includes(unitLower)) {
        unidad_base = 'g';
      } else if (['ml', 'l', 'litro', 'litros', 'taza', 'tazas', 'cucharada', 'cucharadas', 'cucharadita', 'cucharaditas'].includes(unitLower)) {
        unidad_base = 'ml';
      }

      ingredient = await prisma.ingredient.create({
        data: {
          nombre: nameNormalized,
          unidad_base,
        },
      });

      // Auto-create standard conversion if recipe unit requires it
      if (unitLower === 'kg' && unidad_base === 'g') {
        await prisma.unitConversion.create({
          data: {
            ingredient_id: ingredient.id,
            unidad_origen: unit,
            factor_a_base: 1000.0,
          },
        });
      } else if (['l', 'litro', 'litros'].includes(unitLower) && unidad_base === 'ml') {
        await prisma.unitConversion.create({
          data: {
            ingredient_id: ingredient.id,
            unidad_origen: unit,
            factor_a_base: 1000.0,
          },
        });
      } else if (['taza', 'tazas'].includes(unitLower) && unidad_base === 'ml') {
        await prisma.unitConversion.create({
          data: {
            ingredient_id: ingredient.id,
            unidad_origen: unit,
            factor_a_base: 250.0,
          },
        });
      } else if (['cucharada', 'cucharadas'].includes(unitLower) && unidad_base === 'ml') {
        await prisma.unitConversion.create({
          data: {
            ingredient_id: ingredient.id,
            unidad_origen: unit,
            factor_a_base: 15.0,
          },
        });
      } else if (['cucharadita', 'cucharaditas'].includes(unitLower) && unidad_base === 'ml') {
        await prisma.unitConversion.create({
          data: {
            ingredient_id: ingredient.id,
            unidad_origen: unit,
            factor_a_base: 5.0,
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

export const searchRecipes = async (req, res, next) => {
  try {
    const { q } = req.query;
    if (!q) {
      return res.status(400).json({ error: 'Parámetro de búsqueda "q" es requerido' });
    }

    const trimmed = q.trim();

    // 1. Search local public community recipes (userId: null)
    const localPublicRecipes = await prisma.recipe.findMany({
      where: {
        userId: null,
        nombre: {
          contains: trimmed,
          mode: 'insensitive'
        }
      }
    });

    const localResults = localPublicRecipes.map(recipe => ({
      id: `local-${recipe.id}`,
      nombre: recipe.nombre,
      imagen: '/p-mealcrafter.jpg', // Community placeholder image
      categoria: 'Comunidad',
      origen: 'Local',
      isLocal: true
    }));

    // 2. Search external TheMealDB API
    let externalResults = [];
    try {
      const englishQuery = await translateSpanishToEnglish(trimmed);
      externalResults = await searchExternalRecipes(englishQuery);
    } catch (err) {
      console.error('External search lookup failed, returning local-only results:', err);
    }

    // Merge public local and external recipe results
    const combinedResults = [...localResults, ...externalResults];
    res.json(combinedResults);
  } catch (err) {
    next(err);
  }
};

export const importRecipe = async (req, res, next) => {
  try {
    const { externalId } = req.body;
    if (!externalId) {
      return res.status(400).json({ error: 'Parámetro "externalId" es requerido' });
    }

    let recipeDataToImport = null;

    if (String(externalId).startsWith('local-')) {
      // 1. Local community recipe import
      const localId = parseInt(String(externalId).replace('local-', ''), 10);
      const localRecipe = await prisma.recipe.findUnique({
        where: { id: localId },
        include: {
          ingredients: {
            include: {
              ingredient: true
            }
          }
        }
      });

      if (!localRecipe) {
        return res.status(404).json({ error: 'Receta de la comunidad no encontrada' });
      }

      recipeDataToImport = {
        nombre: localRecipe.nombre,
        porciones_base: localRecipe.porciones_base,
        tipo_comida: localRecipe.tipo_comida,
        tiempo_preparacion_min: localRecipe.tiempo_preparacion_min,
        instrucciones: localRecipe.instrucciones,
        ingredients: localRecipe.ingredients.map(ri => ({
          nombre: ri.ingredient.nombre,
          cantidad: parseFloat(ri.cantidad),
          unidad: ri.unidad
        }))
      };
    } else {
      // 2. TheMealDB external recipe import (with translation)
      const extRecipe = await getExternalRecipeById(externalId);
      recipeDataToImport = await translateRecipeToSpanish(extRecipe);
    }

    // Resolve ingredients (create dynamic catalog records)
    const resolvedIngredients = await resolveIngredients(recipeDataToImport.ingredients);

    // Create the recipe in database linked to logged-in user
    const newRecipe = await prisma.$transaction(async (tx) => {
      const recipe = await tx.recipe.create({
        data: {
          nombre: recipeDataToImport.nombre.trim(),
          porciones_base: recipeDataToImport.porciones_base,
          tipo_comida: recipeDataToImport.tipo_comida,
          tiempo_preparacion_min: recipeDataToImport.tiempo_preparacion_min,
          instrucciones: recipeDataToImport.instrucciones.trim(),
          userId: req.user.id,
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
  } catch (err) {
    next(err);
  }
};

export const getExternalRecipeDetail = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ error: 'ID de receta es requerido' });
    }

    if (String(id).startsWith('local-')) {
      // 1. Local community recipe detail
      const localId = parseInt(String(id).replace('local-', ''), 10);
      const localRecipe = await prisma.recipe.findUnique({
        where: { id: localId },
        include: {
          ingredients: {
            include: {
              ingredient: true
            }
          }
        }
      });

      if (!localRecipe) {
        return res.status(404).json({ error: 'Receta de la comunidad no encontrada' });
      }

      const mappedDetail = {
        nombre: localRecipe.nombre,
        porciones_base: localRecipe.porciones_base,
        tipo_comida: localRecipe.tipo_comida,
        tiempo_preparacion_min: localRecipe.tiempo_preparacion_min,
        instrucciones: localRecipe.instrucciones,
        ingredients: localRecipe.ingredients.map(ri => ({
          nombre: ri.ingredient.nombre,
          cantidad: parseFloat(ri.cantidad),
          unidad: ri.unidad
        })),
        isLocal: true
      };

      return res.json(mappedDetail);
    } else {
      // 2. TheMealDB external recipe detail
      const extRecipe = await getExternalRecipeById(id);
      const translatedDetail = await translateRecipeToSpanish(extRecipe);
      return res.json(translatedDetail);
    }
  } catch (err) {
    next(err);
  }
};
