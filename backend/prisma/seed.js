const prisma = require('../prismaClient');

async function main() {
  console.log('Seeding database...');

  // Clean existing data in reverse order of dependencies
  await prisma.mealPlanEntry.deleteMany({});
  await prisma.mealPlan.deleteMany({});
  await prisma.recipeIngredient.deleteMany({});
  await prisma.recipe.deleteMany({});
  await prisma.unitConversion.deleteMany({});
  await prisma.ingredient.deleteMany({});

  console.log('Cleared existing data.');

  // Create ingredients
  const ingredients = [
    { nombre: 'papa', unidad_base: 'g' },
    { nombre: 'cebolla', unidad_base: 'g' },
    { nombre: 'ajo', unidad_base: 'unidad' }, // 'unidad' represents 1 clove (diente)
    { nombre: 'carne vacuna', unidad_base: 'g' },
    { nombre: 'leche', unidad_base: 'ml' },
    { nombre: 'agua', unidad_base: 'ml' },
    { nombre: 'sal', unidad_base: 'g' },
    { nombre: 'arroz', unidad_base: 'g' },
    { nombre: 'huevo', unidad_base: 'unidad' },
  ];

  const createdIngredients = {};

  for (const ing of ingredients) {
    const created = await prisma.ingredient.create({
      data: ing,
    });
    createdIngredients[ing.nombre] = created;
    console.log(`Created ingredient: ${created.nombre}`);
  }

  // Create conversions
  const conversions = [
    // Papa
    {
      ingredient_id: createdIngredients['papa'].id,
      unidad_origen: 'unidad',
      factor_a_base: 150.0, // 1 papa = 150g
    },
    {
      ingredient_id: createdIngredients['papa'].id,
      unidad_origen: 'kg',
      factor_a_base: 1000.0, // 1 kg = 1000g
    },
    // Cebolla
    {
      ingredient_id: createdIngredients['cebolla'].id,
      unidad_origen: 'unidad',
      factor_a_base: 100.0, // 1 cebolla = 100g
    },
    {
      ingredient_id: createdIngredients['cebolla'].id,
      unidad_origen: 'kg',
      factor_a_base: 1000.0,
    },
    // Ajo (base = unidad (diente))
    {
      ingredient_id: createdIngredients['ajo'].id,
      unidad_origen: 'cabeza',
      factor_a_base: 10.0, // 1 cabeza = 10 dientes
    },
    // Carne vacuna
    {
      ingredient_id: createdIngredients['carne vacuna'].id,
      unidad_origen: 'kg',
      factor_a_base: 1000.0,
    },
    // Leche
    {
      ingredient_id: createdIngredients['leche'].id,
      unidad_origen: 'l',
      factor_a_base: 1000.0,
    },
    {
      ingredient_id: createdIngredients['leche'].id,
      unidad_origen: 'taza',
      factor_a_base: 250.0,
    },
    // Agua
    {
      ingredient_id: createdIngredients['agua'].id,
      unidad_origen: 'l',
      factor_a_base: 1000.0,
    },
    {
      ingredient_id: createdIngredients['agua'].id,
      unidad_origen: 'taza',
      factor_a_base: 250.0,
    },
    // Sal
    {
      ingredient_id: createdIngredients['sal'].id,
      unidad_origen: 'cucharadita',
      factor_a_base: 5.0,
    },
    {
      ingredient_id: createdIngredients['sal'].id,
      unidad_origen: 'cucharada',
      factor_a_base: 15.0,
    },
    // Arroz
    {
      ingredient_id: createdIngredients['arroz'].id,
      unidad_origen: 'taza',
      factor_a_base: 200.0,
    },
    {
      ingredient_id: createdIngredients['arroz'].id,
      unidad_origen: 'kg',
      factor_a_base: 1000.0,
    },
    // Huevo
    {
      ingredient_id: createdIngredients['huevo'].id,
      unidad_origen: 'docena',
      factor_a_base: 12.0,
    },
  ];

  for (const conv of conversions) {
    await prisma.unitConversion.create({
      data: conv,
    });
    console.log(`Created conversion: 1 ${conv.unidad_origen} = ${conv.factor_a_base} of ingredient ID ${conv.ingredient_id}`);
  }

  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
