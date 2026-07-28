import prisma from '../prismaClient.js';

// GET /api/ingredients
// List all ingredients with their conversions
const getIngredients = async (req, res, next) => {
  try {
    const ingredients = await prisma.ingredient.findMany({
      include: {
        conversions: true,
      },
      orderBy: {
        nombre: 'asc',
      },
    });
    res.json(ingredients);
  } catch (error) {
    next(error);
  }
};

// POST /api/ingredients
// Create a new ingredient
const createIngredient = async (req, res, next) => {
  try {
    let { nombre, unidad_base } = req.body;

    if (!nombre || !unidad_base) {
      return res.status(400).json({ error: 'nombre and unidad_base are required' });
    }

    nombre = nombre.trim();
    unidad_base = unidad_base.trim();

    // Check base unit value
    const allowedUnits = ['g', 'ml', 'unidad'];
    if (!allowedUnits.includes(unidad_base)) {
      return res.status(400).json({ error: `unidad_base must be one of: ${allowedUnits.join(', ')}` });
    }

    // Validation (2.4): no two ingredients with the same name (case-insensitive)
    const existing = await prisma.ingredient.findFirst({
      where: {
        nombre: {
          equals: nombre,
          mode: 'insensitive',
        },
      },
    });

    if (existing) {
      return res.status(400).json({ error: `An ingredient with name "${nombre}" already exists` });
    }

    const newIngredient = await prisma.ingredient.create({
      data: {
        nombre,
        unidad_base,
      },
    });

    res.status(201).json(newIngredient);
  } catch (error) {
    next(error);
  }
};

// POST /api/ingredients/:id/conversions
// Add or update a conversion factor
const addConversion = async (req, res, next) => {
  try {
    const ingredientId = parseInt(req.params.id, 10);
    const { unidad_origen, factor_a_base } = req.body;

    if (isNaN(ingredientId)) {
      return res.status(400).json({ error: 'Invalid ingredient ID' });
    }

    if (!unidad_origen || factor_a_base === undefined) {
      return res.status(400).json({ error: 'unidad_origen and factor_a_base are required' });
    }

    const factor = parseFloat(factor_a_base);
    if (isNaN(factor) || factor <= 0) {
      return res.status(400).json({ error: 'factor_a_base must be a positive number' });
    }

    // Verify ingredient exists
    const ingredient = await prisma.ingredient.findUnique({
      where: { id: ingredientId },
    });

    if (!ingredient) {
      return res.status(404).json({ error: 'Ingredient not found' });
    }

    // If unit of origin is same as base unit, it is invalid/redundant
    if (unidad_origen.trim().toLowerCase() === ingredient.unidad_base.toLowerCase()) {
      return res.status(400).json({ error: 'Cannot add conversion to the base unit itself' });
    }

    // Check if conversion already exists for this unit_origen (case-insensitive)
    const existingConversion = await prisma.unitConversion.findFirst({
      where: {
        ingredient_id: ingredientId,
        unidad_origen: {
          equals: unidad_origen.trim(),
          mode: 'insensitive',
        },
      },
    });

    let conversion;
    if (existingConversion) {
      // Update existing conversion factor
      conversion = await prisma.unitConversion.update({
        where: { id: existingConversion.id },
        data: {
          factor_a_base: factor,
        },
      });
    } else {
      // Create new conversion
      conversion = await prisma.unitConversion.create({
        data: {
          ingredient_id: ingredientId,
          unidad_origen: unidad_origen.trim(),
          factor_a_base: factor,
        },
      });
    }

    res.status(201).json(conversion);
  } catch (error) {
    next(error);
  }
};

export {
  getIngredients,
  createIngredient,
  addConversion,
};
