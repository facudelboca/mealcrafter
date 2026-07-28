import prisma from '../prismaClient.js';

/**
 * Pure function to calculate shopping list items and non-convertible items from fetched entries
 * @param {Array} entries - Meal plan entries with their recipe and ingredients
 * @returns {Object} Shopping list containing items and no_convertibles
 */
const getGlobalConversionFactor = (recipeUnit, baseUnit) => {
  const ru = recipeUnit.trim().toLowerCase();
  const bu = baseUnit.trim().toLowerCase();

  if (ru === bu) return 1.0;

  if (bu === 'g') {
    if (ru === 'kg' || ru === 'kilo' || ru === 'kilos') {
      return 1000.0;
    }
    if (ru === 'g' || ru === 'gramo' || ru === 'gramos') {
      return 1.0;
    }
  }

  if (bu === 'ml') {
    if (ru === 'l' || ru === 'litro' || ru === 'litros') {
      return 1000.0;
    }
    if (ru === 'ml' || ru === 'mililitro' || ru === 'mililitros' || ru === 'cm3' || ru === 'cc') {
      return 1.0;
    }
  }

  if (bu === 'unidad') {
    if (ru === 'unidad' || ru === 'unidades' || ru === 'u') {
      return 1.0;
    }
  }

  return null;
};

/**
 * Pure function to calculate shopping list items and non-convertible items from fetched entries
 * @param {Array} entries - Meal plan entries with their recipe and ingredients
 * @returns {Object} Shopping list containing items and no_convertibles
 */
const calculateShoppingListFromEntries = (entries) => {
  const convertibles = {};
  const nonConvertibles = {};

  for (const entry of entries) {
    const recipe = entry.recipe;
    if (!recipe) continue;

    if (!recipe.porciones_base || recipe.porciones_base <= 0) {
      throw new Error(`La receta "${recipe.nombre}" tiene un número de porciones base inválido (${recipe.porciones_base})`);
    }

    const factor = entry.comensales / recipe.porciones_base;

    for (const ri of recipe.ingredients) {
      const ing = ri.ingredient;
      const qty = parseFloat(ri.cantidad);
      const unit = ri.unidad;

      const isBaseUnit = unit.trim().toLowerCase() === ing.unidad_base.trim().toLowerCase();

      const globalFactor = getGlobalConversionFactor(unit, ing.unidad_base);
      let conversion = null;

      if (globalFactor === null) {
        if (!isBaseUnit && ing.conversions) {
          conversion = ing.conversions.find(
            c => c.unidad_origen.trim().toLowerCase() === unit.trim().toLowerCase()
          );
        }
      }

      if (isBaseUnit || globalFactor !== null || conversion) {
        // Convertible to base unit
        let factorABase = 1.0;
        if (globalFactor !== null) {
          factorABase = globalFactor;
        } else if (conversion) {
          factorABase = parseFloat(conversion.factor_a_base);
        }
        
        const qtyInBase = qty * factorABase;
        const scaledQty = qtyInBase * factor;

        if (!convertibles[ing.id]) {
          convertibles[ing.id] = {
            ingredient: ing.nombre,
            cantidad: 0,
            unidad: ing.unidad_base,
          };
        }
        convertibles[ing.id].cantidad += scaledQty;
      } else {
        // Non-convertible
        const scaledQty = qty * factor;
        const key = `${ing.id}_${unit.trim().toLowerCase()}`;

        if (!nonConvertibles[key]) {
          nonConvertibles[key] = {
            ingredient: ing.nombre,
            cantidad: 0,
            unidad: unit.trim(),
          };
        }
        nonConvertibles[key].cantidad += scaledQty;
      }
    }
  }

  // Format quantities: round to 2 decimal places to prevent float precision issues
  const items = Object.values(convertibles).map(item => ({
    ingredient: item.ingredient,
    cantidad: Number(item.cantidad.toFixed(2)),
    unidad: item.unidad,
  }));

  const noConvertibles = Object.values(nonConvertibles).map(item => ({
    ingredient: item.ingredient,
    cantidad: Number(item.cantidad.toFixed(2)),
    unidad: item.unidad,
  }));

  return {
    items,
    no_convertibles: noConvertibles,
  };
};

/**
 * Service function to calculate the shopping list for a given meal plan ID
 * @param {number} mealPlanId - The ID of the meal plan
 * @returns {Promise<Object>} The shopping list object
 */
const calcularListaDeCompras = async (mealPlanId) => {
  const entries = await prisma.mealPlanEntry.findMany({
    where: {
      meal_plan_id: mealPlanId,
      recipe_id: { not: null },
    },
    include: {
      recipe: {
        include: {
          ingredients: {
            include: {
              ingredient: {
                include: {
                  conversions: true,
                },
              },
            },
          },
        },
      },
    },
  });

  return calculateShoppingListFromEntries(entries);
};

export {
  calcularListaDeCompras,
  calculateShoppingListFromEntries,
};
