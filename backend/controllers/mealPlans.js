import prisma from '../prismaClient.js';
import { calcularListaDeCompras } from '../services/shoppingList.js';

// POST /api/meal-plans
// Create a new meal plan with 14 empty entries
const createMealPlan = async (req, res, next) => {
  try {
    const { nombre, fecha_inicio } = req.body;

    if (!fecha_inicio) {
      return res.status(400).json({ error: 'fecha_inicio is required' });
    }

    const startDate = new Date(fecha_inicio);
    if (isNaN(startDate.getTime())) {
      return res.status(400).json({ error: 'Invalid fecha_inicio date format' });
    }

    const days = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo'];
    const meals = ['almuerzo', 'cena'];

    const entriesData = [];
    for (const dia of days) {
      for (const tipo_comida of meals) {
        entriesData.push({
          dia,
          tipo_comida,
          comensales: 0,
          recipe_id: null,
        });
      }
    }

    const newPlan = await prisma.mealPlan.create({
      data: {
        nombre: nombre ? nombre.trim() : null,
        fecha_inicio: startDate,
        userId: req.user.id,
        entries: {
          create: entriesData,
        },
      },
      include: {
        entries: true,
      },
    });

    res.status(201).json(newPlan);
  } catch (error) {
    next(error);
  }
};

// GET /api/meal-plans/:id
// Get meal plan with entries and recipes
const getMealPlanById = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid meal plan ID' });
    }

    const plan = await prisma.mealPlan.findUnique({
      where: { id },
      include: {
        entries: {
          include: {
            recipe: true,
          },
        },
      },
    });

    if (!plan) {
      return res.status(404).json({ error: 'Meal plan not found' });
    }

    if (plan.userId !== req.user.id) {
      return res.status(403).json({ error: 'No tienes acceso a este plan semanal' });
    }

    // Sort entries logically: day of week order, then meal type (almuerzo first, then cena)
    const dayOrder = {
      lunes: 1,
      martes: 2,
      miercoles: 3,
      jueves: 4,
      viernes: 5,
      sabado: 6,
      domingo: 7,
    };

    plan.entries.sort((a, b) => {
      if (dayOrder[a.dia] !== dayOrder[b.dia]) {
        return dayOrder[a.dia] - dayOrder[b.dia];
      }
      return a.tipo_comida === 'almuerzo' ? -1 : 1;
    });

    res.json(plan);
  } catch (error) {
    next(error);
  }
};

// PUT /api/meal-plans/:id/entries/:entryId
// Assign recipe and comensales to an entry
const updateMealPlanEntry = async (req, res, next) => {
  try {
    const planId = parseInt(req.params.id, 10);
    const entryId = parseInt(req.params.entryId, 10);

    if (isNaN(planId) || isNaN(entryId)) {
      return res.status(400).json({ error: 'Invalid meal plan ID or entry ID' });
    }

    // Verify meal plan exists
    const plan = await prisma.mealPlan.findUnique({
      where: { id: planId },
    });
    if (!plan) {
      return res.status(404).json({ error: 'Meal plan not found' });
    }

    if (plan.userId !== req.user.id) {
      return res.status(403).json({ error: 'No tienes permisos para modificar este plan semanal' });
    }

    // Verify entry exists and belongs to this plan
    const entry = await prisma.mealPlanEntry.findUnique({
      where: { id: entryId },
    });
    if (!entry || entry.meal_plan_id !== planId) {
      return res.status(404).json({ error: 'Meal plan entry not found in this plan' });
    }

    const { recipe_id, comensales } = req.body;

    let targetRecipeId = null;
    let targetComensales = 0;

    if (recipe_id !== undefined && recipe_id !== null) {
      targetRecipeId = parseInt(recipe_id, 10);
      if (isNaN(targetRecipeId)) {
        return res.status(400).json({ error: 'Invalid recipe_id' });
      }

      // Verify recipe exists
      const recipe = await prisma.recipe.findUnique({
        where: { id: targetRecipeId },
      });
      if (!recipe) {
        return res.status(400).json({ error: 'Recipe not found' });
      }

      // Resolve comensales
      if (comensales !== undefined && comensales !== null) {
        targetComensales = parseInt(comensales, 10);
        if (isNaN(targetComensales) || targetComensales <= 0) {
          return res.status(400).json({ error: 'comensales must be a positive integer if a recipe is assigned' });
        }
      } else {
        // Default to recipe's porciones_base (Requirement 2.1, criterio 2)
        targetComensales = recipe.porciones_base;
      }
    } else {
      // If recipe_id is null/undefined, we unassign the recipe
      targetRecipeId = null;
      targetComensales = 0;
    }

    const updatedEntry = await prisma.mealPlanEntry.update({
      where: { id: entryId },
      data: {
        recipe_id: targetRecipeId,
        comensales: targetComensales,
      },
      include: {
        recipe: true,
      },
    });

    res.json(updatedEntry);
  } catch (error) {
    next(error);
  }
};

const getShoppingList = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid meal plan ID' });
    }

    // Verify meal plan exists
    const plan = await prisma.mealPlan.findUnique({
      where: { id },
    });
    if (!plan) {
      return res.status(404).json({ error: 'Meal plan not found' });
    }

    if (plan.userId !== req.user.id) {
      return res.status(403).json({ error: 'No tienes acceso a este plan semanal' });
    }

    const list = await calcularListaDeCompras(id);
    res.json(list);
  } catch (error) {
    next(error);
  }
};

// GET /api/meal-plans
const getAllMealPlans = async (req, res, next) => {
  try {
    const plans = await prisma.mealPlan.findMany({
      where: { userId: req.user.id },
      orderBy: { fecha_inicio: 'desc' },
      include: {
        entries: {
          select: {
            recipe_id: true,
          },
        },
      },
    });

    const response = plans.map(p => {
      const assignedCount = p.entries.filter(e => e.recipe_id !== null).length;
      return {
        id: p.id,
        nombre: p.nombre,
        fecha_inicio: p.fecha_inicio,
        assignedCount,
      };
    });

    res.json(response);
  } catch (error) {
    next(error);
  }
};

// POST /api/meal-plans/:id/clone
const cloneMealPlan = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid meal plan ID' });
    }

    const originalPlan = await prisma.mealPlan.findUnique({
      where: { id },
      include: { entries: true },
    });

    if (!originalPlan) {
      return res.status(404).json({ error: 'Meal plan not found' });
    }

    if (originalPlan.userId !== req.user.id) {
      return res.status(403).json({ error: 'No tienes acceso al plan original para clonarlo' });
    }

    const { nombre, fecha_inicio } = req.body;
    if (!fecha_inicio) {
      return res.status(400).json({ error: 'fecha_inicio is required for cloning' });
    }

    const startDate = new Date(fecha_inicio);
    if (isNaN(startDate.getTime())) {
      return res.status(400).json({ error: 'Invalid fecha_inicio date format' });
    }

    const newEntriesData = originalPlan.entries.map(e => ({
      dia: e.dia,
      tipo_comida: e.tipo_comida,
      recipe_id: e.recipe_id,
      comensales: e.comensales,
    }));

    const clonedPlan = await prisma.mealPlan.create({
      data: {
        nombre: nombre ? nombre.trim() : `${originalPlan.nombre || 'Plan'} - Copia`,
        fecha_inicio: startDate,
        userId: req.user.id,
        entries: {
          create: newEntriesData,
        },
      },
      include: {
        entries: true,
      },
    });

    res.status(201).json(clonedPlan);
  } catch (error) {
    next(error);
  }
};

// DELETE /api/meal-plans/:id
const deleteMealPlan = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid meal plan ID' });
    }

    const plan = await prisma.mealPlan.findUnique({
      where: { id },
    });

    if (!plan) {
      return res.status(404).json({ error: 'Meal plan not found' });
    }

    if (plan.userId !== req.user.id) {
      return res.status(403).json({ error: 'No tienes permisos para eliminar este plan semanal' });
    }

    await prisma.mealPlanEntry.deleteMany({
      where: { meal_plan_id: id },
    });

    await prisma.mealPlan.delete({
      where: { id },
    });

    res.json({ success: true });
  } catch (error) {
    next(error);
  }
};

export {
  createMealPlan,
  getMealPlanById,
  updateMealPlanEntry,
  getShoppingList,
  getAllMealPlans,
  cloneMealPlan,
  deleteMealPlan,
};
