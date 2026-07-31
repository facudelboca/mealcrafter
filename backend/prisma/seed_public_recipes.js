import prisma from '../prismaClient.js';

const publicRecipes = [
  {
    nombre: "Milanesa de carne con puré",
    porciones_base: 4,
    tipo_comida: "almuerzo",
    tiempo_preparacion_min: 40,
    instrucciones: "1. Condimentar la carne (bola de lomo o nalga) con sal, ajo y perejil picado.\n2. Pasar cada filete por huevo batido y luego por pan rallado, presionando bien.\n3. Cocinar al horno con un chorrito de aceite o freír en aceite caliente hasta dorar de ambos lados.\n4. Para el puré: Hervir las papas peladas en agua con sal. Una vez tiernas, colar y pisar caliente.\n5. Agregar manteca, leche tibia, sal y nuez moscada. Batir enérgicamente hasta lograr una textura cremosa.\n6. Servir caliente con rodajas de limón.",
    ingredients: [
      { nombre: "carne para milanesa", cantidad: 800, unidad: "g" },
      { nombre: "pan rallado", cantidad: 300, unidad: "g" },
      { nombre: "huevo", cantidad: 3, unidad: "unidad" },
      { nombre: "diente de ajo", cantidad: 2, unidad: "diente" },
      { nombre: "perejil fresco", cantidad: 1, unidad: "puñado" },
      { nombre: "papa", cantidad: 1000, unidad: "g" },
      { nombre: "leche", cantidad: 150, unidad: "ml" },
      { nombre: "manteca", cantidad: 50, unidad: "g" }
    ]
  },
  {
    nombre: "Empanadas de carne criollas",
    porciones_base: 4,
    tipo_comida: "almuerzo",
    tiempo_preparacion_min: 60,
    instrucciones: "1. Picar las cebollas y el morrón bien fino. Rehogar en grasa vacuna o aceite hasta transparentar.\n2. Agregar la carne picada y cocinar a fuego fuerte mezclando constantemente.\n3. Condimentar con sal, comino, pimentón dulce y ají molido. Retirar del fuego justo antes de que termine de cocinarse la carne para que queden jugosas.\n4. Enfriar el relleno en la heladera. Una vez frío, incorporar los huevos duros picados y la cebolla de verdeo cruda picada fina.\n5. Armar las empanadas colocando una cucharada de relleno en cada disco de masa, humedecer el borde y realizar el repulgue tradicional.\n6. Colocar en una placa enharinada y hornear a temperatura máxima (220°C) hasta que la masa esté dorada.",
    ingredients: [
      { nombre: "tapas de empanada", cantidad: 12, unidad: "unidad" },
      { nombre: "carne picada de res", cantidad: 500, unidad: "g" },
      { nombre: "cebolla", cantidad: 500, unidad: "g" },
      { nombre: "morron rojo", cantidad: 1, unidad: "unidad" },
      { nombre: "cebolla de verdeo", cantidad: 2, unidad: "unidad" },
      { nombre: "huevo duro", cantidad: 3, unidad: "unidad" },
      { nombre: "grasa vacuna", cantidad: 50, unidad: "g" },
      { nombre: "comino molido", cantidad: 1, unidad: "cucharadita" },
      { nombre: "pimenton dulce", cantidad: 1, unidad: "cucharada" }
    ]
  },
  {
    nombre: "Guiso de lentejas criollo",
    porciones_base: 6,
    tipo_comida: "cena",
    tiempo_preparacion_min: 50,
    instrucciones: "1. Remojar las lentejas previamente al menos 2 horas.\n2. Cortar la panceta y el chorizo colorado en rodajas. Dorarlos en una olla profunda sin aceite adicional.\n3. Retirar el exceso de grasa sobrante si es necesario. Agregar la cebolla, morrón y zanahoria cortados en cubos pequeños.\n4. Incorporar la carne vacuna en cubos y dorar bien.\n5. Añadir el puré de tomate, caldo de verduras hasta cubrir y las lentejas escurridas.\n6. Condimentar con laurel, pimentón y sal. Cocinar a fuego lento por 30 minutos.\n7. Agregar las papas cortadas en cubos medianos y continuar la cocción unos 15 minutos más hasta que todo esté tierno.",
    ingredients: [
      { nombre: "lentejas", cantidad: 400, unidad: "g" },
      { nombre: "carne de res para guiso", cantidad: 400, unidad: "g" },
      { nombre: "panceta ahumada", cantidad: 150, unidad: "g" },
      { nombre: "chorizo colorado", cantidad: 1, unidad: "unidad" },
      { nombre: "cebolla", cantidad: 2, unidad: "unidad" },
      { nombre: "morron verde", cantidad: 1, unidad: "unidad" },
      { nombre: "zanahoria", cantidad: 2, unidad: "unidad" },
      { nombre: "papa", cantidad: 2, unidad: "unidad" },
      { nombre: "pure de tomate", cantidad: 400, unidad: "g" },
      { nombre: "caldo de verduras", cantidad: 750, unidad: "ml" }
    ]
  },
  {
    nombre: "Tortilla de papas española",
    porciones_base: 3,
    tipo_comida: "almuerzo",
    tiempo_preparacion_min: 30,
    instrucciones: "1. Pelar las papas y cortarlas en rodajas finas (o dados).\n2. Picar la cebolla fina.\n3. Freír las papas y la cebolla juntas en abundante aceite a temperatura media, para que se confiten (deben quedar tiernas, no crocantes).\n4. Retirar y escurrir muy bien el aceite excedente.\n5. En un bowl, batir ligeramente los huevos con sal. Añadir las papas y la cebolla y dejar reposar 5 minutos para que absorban el huevo.\n6. En una sartén antiadherente caliente con unas gotas de aceite, verter la mezcla y cocinar a fuego medio.\n7. Dar vuelta con la ayuda de un plato llano y cocinar 2-3 minutos más para que quede jugosa en el centro.",
    ingredients: [
      { nombre: "papa", cantidad: 600, unidad: "g" },
      { nombre: "huevo", cantidad: 5, unidad: "unidad" },
      { nombre: "cebolla", cantidad: 1, unidad: "unidad" },
      { nombre: "aceite para freir", cantidad: 200, unidad: "ml" }
    ]
  },
  {
    nombre: "Pastel de papas",
    porciones_base: 6,
    tipo_comida: "cena",
    tiempo_preparacion_min: 45,
    instrucciones: "1. Hacer un puré firme hirviendo las papas y pisándolas con leche, manteca, sal y nuez moscada.\n2. Rehogar la cebolla y el morrón picados. Agregar la carne picada y cocinar bien.\n3. Retirar del fuego y condimentar con sal, pimienta, comino y pimentón. Agregar huevo duro picado y aceitunas descarozadas picadas.\n4. En una fuente para horno enmantecada, extender una capa de puré de papas en la base.\n5. Rellenar con toda la carne preparada de forma uniforme.\n6. Cubrir con el resto del puré y espolvorear abundante queso rallado encima.\n7. Hornear a 200°C durante 20 minutos hasta que la superficie esté dorada y gratinada.",
    ingredients: [
      { nombre: "carne picada de res", cantidad: 600, unidad: "g" },
      { nombre: "cebolla", cantidad: 300, unidad: "g" },
      { nombre: "morron rojo", cantidad: 1, unidad: "unidad" },
      { nombre: "huevo duro", cantidad: 2, unidad: "unidad" },
      { nombre: "aceitunas verdes", cantidad: 10, unidad: "unidad" },
      { nombre: "papa", cantidad: 1000, unidad: "g" },
      { nombre: "leche", cantidad: 100, unidad: "ml" },
      { nombre: "manteca", cantidad: 30, unidad: "g" },
      { nombre: "queso rallado", cantidad: 80, unidad: "g" }
    ]
  }
];

async function seed() {
  console.log('Iniciando carga de recetas públicas locales (argentinas)...');

  for (const recipeData of publicRecipes) {
    const existing = await prisma.recipe.findFirst({
      where: {
        nombre: recipeData.nombre,
        userId: null // public recipe
      }
    });

    if (existing) {
      console.log(`- Receta "${recipeData.nombre}" ya existe en el catálogo público.`);
      continue;
    }

    // Resolve and create ingredients catalog records
    const resolvedIngredients = [];
    for (const item of recipeData.ingredients) {
      const nameNormalized = item.nombre.trim().toLowerCase();
      const unitLower = item.unidad.toLowerCase();

      let ingredient = await prisma.ingredient.findFirst({
        where: {
          nombre: {
            equals: nameNormalized,
            mode: 'insensitive'
          }
        }
      });

      if (!ingredient) {
        let unidad_base = 'unidad';
        if (['g', 'kg', 'gr', 'gramos', 'kilo', 'kilos'].includes(unitLower)) {
          unidad_base = 'g';
        } else if (['ml', 'l', 'litro', 'litros', 'taza', 'tazas', 'cucharada', 'cucharadas', 'cucharadita', 'cucharaditas'].includes(unitLower)) {
          unidad_base = 'ml';
        }

        ingredient = await prisma.ingredient.create({
          data: {
            nombre: nameNormalized,
            unidad_base
          }
        });

        // Create standard conversions
        if (unitLower === 'kg' && unidad_base === 'g') {
          await prisma.unitConversion.create({
            data: { ingredient_id: ingredient.id, unidad_origen: item.unidad, factor_a_base: 1000.0 }
          });
        } else if (['l', 'litro', 'litros'].includes(unitLower) && unidad_base === 'ml') {
          await prisma.unitConversion.create({
            data: { ingredient_id: ingredient.id, unidad_origen: item.unidad, factor_a_base: 1000.0 }
          });
        } else if (['taza', 'tazas'].includes(unitLower) && unidad_base === 'ml') {
          await prisma.unitConversion.create({
            data: { ingredient_id: ingredient.id, unidad_origen: item.unidad, factor_a_base: 250.0 }
          });
        } else if (['cucharada', 'cucharadas'].includes(unitLower) && unidad_base === 'ml') {
          await prisma.unitConversion.create({
            data: { ingredient_id: ingredient.id, unidad_origen: item.unidad, factor_a_base: 15.0 }
          });
        } else if (['cucharadita', 'cucharaditas'].includes(unitLower) && unidad_base === 'ml') {
          await prisma.unitConversion.create({
            data: { ingredient_id: ingredient.id, unidad_origen: item.unidad, factor_a_base: 5.0 }
          });
        }
      }

      resolvedIngredients.push({
        ingredient_id: ingredient.id,
        cantidad: item.cantidad,
        unidad: item.unidad
      });
    }

    // Create public recipe linked to userId: null
    await prisma.$transaction(async (tx) => {
      const createdRecipe = await tx.recipe.create({
        data: {
          nombre: recipeData.nombre,
          porciones_base: recipeData.porciones_base,
          tipo_comida: recipeData.tipo_comida,
          tiempo_preparacion_min: recipeData.tiempo_preparacion_min,
          instrucciones: recipeData.instrucciones,
          userId: null // Public system recipe!
        }
      });

      for (const ring of resolvedIngredients) {
        await tx.recipeIngredient.create({
          data: {
            recipe_id: createdRecipe.id,
            ingredient_id: ring.ingredient_id,
            cantidad: ring.cantidad,
            unidad: ring.unidad
          }
        });
      }
    });

    console.log(`+ Receta "${recipeData.nombre}" creada con éxito.`);
  }

  console.log('Proceso de siembra finalizado.');
}

seed()
  .catch((e) => {
    console.error('Error durante la siembra:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
