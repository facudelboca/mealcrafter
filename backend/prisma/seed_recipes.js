import prisma from '../prismaClient.js';

const recipesData = [
  {
    nombre: 'Milanesas de carne con puré',
    porciones_base: 4,
    tipo_comida: 'almuerzo',
    tiempo_preparacion_min: 40,
    instrucciones: '1. Pasar la carne por huevo batido condimentado con sal, pimienta y ajo picado.\n2. Rebozar con pan rallado presionando bien.\n3. Freír en abundante aceite caliente o cocinar al horno.\n4. Para el puré: hervir las papas peladas, pisarlas calientes y mezclar con leche, manteca, sal y nuez moscada.',
    ingredients: [
      { nombre: 'carne vacuna', cantidad: 800, unidad: 'g' },
      { nombre: 'huevo', cantidad: 3, unidad: 'unidad' },
      { nombre: 'papa', cantidad: 1.2, unidad: 'kg' },
      { nombre: 'leche', cantidad: 200, unidad: 'ml' },
      { nombre: 'manteca', cantidad: 50, unidad: 'g' },
      { nombre: 'ajo', cantidad: 2, unidad: 'unidad' }
    ]
  },
  {
    nombre: 'Empanadas de carne cortada a cuchillo',
    porciones_base: 4,
    tipo_comida: 'cena',
    tiempo_preparacion_min: 60,
    instrucciones: '1. Cortar la carne y la cebolla en cubos pequeños.\n2. Rehogar la cebolla y el morrón en grasa de pella o aceite.\n3. Añadir la carne vacuna y cocinar brevemente para que quede jugosa.\n4. Condimentar con sal, comino, pimentón dulce y ají molido.\n5. Enfriar el relleno, armar las empanadas con las tapas y hornear a temperatura máxima.',
    ingredients: [
      { nombre: 'carne vacuna', cantidad: 600, unidad: 'g' },
      { nombre: 'cebolla', cantidad: 600, unidad: 'g' },
      { nombre: 'tapas de empanada', cantidad: 12, unidad: 'unidad' },
      { nombre: 'huevo', cantidad: 2, unidad: 'unidad' },
      { nombre: 'sal', cantidad: 10, unidad: 'g' }
    ]
  },
  {
    nombre: 'Pastel de papa tradicional',
    porciones_base: 6,
    tipo_comida: 'almuerzo',
    tiempo_preparacion_min: 50,
    instrucciones: '1. Cocinar carne vacuna picada con cebolla, morrón y condimentos hasta que esté lista.\n2. Hacer un puré firme de papas con leche, manteca y nuez moscada.\n3. En una fuente para horno, colocar una base de carne, opcionalmente huevo duro picado y aceitunas.\n4. Cubrir con el puré de papas, espolvorear queso rallado y gratinar en horno fuerte.',
    ingredients: [
      { nombre: 'carne vacuna', cantidad: 750, unidad: 'g' },
      { nombre: 'cebolla', cantidad: 400, unidad: 'g' },
      { nombre: 'papa', cantidad: 1.5, unidad: 'kg' },
      { nombre: 'huevo', cantidad: 3, unidad: 'unidad' },
      { nombre: 'queso rallado', cantidad: 100, unidad: 'g' },
      { nombre: 'leche', cantidad: 150, unidad: 'ml' }
    ]
  },
  {
    nombre: 'Tortilla de papas a la española',
    porciones_base: 4,
    tipo_comida: 'cena',
    tiempo_preparacion_min: 30,
    instrucciones: '1. Pelar y cortar las papas en rodajas finas, y picar la cebolla.\n2. Freír las papas y cebolla a fuego medio para que se cocinen sin dorarse demasiado; escurrir.\n3. Batir los huevos en un bol grande, salar e integrar con las papas calientes.\n4. Cocinar en sartén caliente con poco aceite, dar vuelta con ayuda de un plato y dorar el otro lado.',
    ingredients: [
      { nombre: 'papa', cantidad: 800, unidad: 'g' },
      { nombre: 'huevo', cantidad: 5, unidad: 'unidad' },
      { nombre: 'cebolla', cantidad: 200, unidad: 'g' },
      { nombre: 'sal', cantidad: 5, unidad: 'g' }
    ]
  },
  {
    nombre: 'Guiso de lentejas con chorizo colorado',
    porciones_base: 6,
    tipo_comida: 'ambos',
    tiempo_preparacion_min: 75,
    instrucciones: '1. Remojar las lentejas.\n2. En una olla grande, dorar panceta y chorizo colorado en rodajas.\n3. Retirar el exceso de grasa y rehogar cebolla, ajo, zanahoria y morrón.\n4. Agregar carne de cerdo o vacuna, tomate triturado, caldo y las lentejas.\n5. Cocinar a fuego lento hasta que las lentejas estén tiernas y el guiso espese.',
    ingredients: [
      { nombre: 'lentejas', cantidad: 400, unidad: 'g' },
      { nombre: 'carne vacuna', cantidad: 400, unidad: 'g' },
      { nombre: 'cebolla', cantidad: 300, unidad: 'g' },
      { nombre: 'chorizo colorado', cantidad: 1, unidad: 'unidad' },
      { nombre: 'panceta', cantidad: 150, unidad: 'g' },
      { nombre: 'zanahoria', cantidad: 2, unidad: 'unidad' },
      { nombre: 'ajo', cantidad: 2, unidad: 'unidad' }
    ]
  },
  {
    nombre: 'Asado al horno con papas rústicas',
    porciones_base: 4,
    tipo_comida: 'almuerzo',
    tiempo_preparacion_min: 90,
    instrucciones: '1. Condimentar la tira de asado con abundante sal gruesa.\n2. Colocar en una asadera y llevar a horno medio-alto (190°C).\n3. Lavar bien las papas, cortarlas en cuñas con piel, aceitar y condimentar.\n4. Colocar las papas en la asadera junto a la carne y cocinar todo girando a mitad de cocción hasta dorar.',
    ingredients: [
      { nombre: 'asado de tira', cantidad: 1.5, unidad: 'kg' },
      { nombre: 'papa', cantidad: 1.0, unidad: 'kg' },
      { nombre: 'sal', cantidad: 15, unidad: 'g' }
    ]
  },
  {
    nombre: 'Polenta con tuco y queso cremoso',
    porciones_base: 4,
    tipo_comida: 'cena',
    tiempo_preparacion_min: 25,
    instrucciones: '1. Preparar un tuco rehogando cebolla, ajo y carne picada, sumando puré de tomate y condimentos.\n2. Calentar leche y agua con sal.\n3. Agregar la harina de maíz en forma de lluvia revolviendo constantemente para evitar grumos.\n4. Servir la polenta caliente en platos hondos con trozos de queso cremoso abajo y tuco por encima.',
    ingredients: [
      { nombre: 'harina de maíz', cantidad: 300, unidad: 'g' },
      { nombre: 'leche', cantidad: 500, unidad: 'ml' },
      { nombre: 'agua', cantidad: 500, unidad: 'ml' },
      { nombre: 'carne vacuna', cantidad: 300, unidad: 'g' },
      { nombre: 'cebolla', cantidad: 200, unidad: 'g' },
      { nombre: 'tomate puré', cantidad: 500, unidad: 'g' },
      { nombre: 'queso cremoso', cantidad: 250, unidad: 'g' }
    ]
  },
  {
    nombre: 'Tallarines caseros con salsa boloñesa',
    porciones_base: 4,
    tipo_comida: 'almuerzo',
    tiempo_preparacion_min: 50,
    instrucciones: '1. Preparar la masa estirando harina con huevos y un toque de agua, cortar en cintas.\n2. Para la boloñesa: rehogar cebolla, zanahoria y apio picados, agregar carne picada y cocinar hasta dorar.\n3. Agregar vino tinto (opcional), puré de tomate y cocinar 40 min a fuego corona.\n4. Hervir los fideos al dente y servir con la salsa.',
    ingredients: [
      { nombre: 'harina de trigo', cantidad: 400, unidad: 'g' },
      { nombre: 'huevo', cantidad: 4, unidad: 'unidad' },
      { nombre: 'carne vacuna', cantidad: 400, unidad: 'g' },
      { nombre: 'cebolla', cantidad: 200, unidad: 'g' },
      { nombre: 'tomate puré', cantidad: 400, unidad: 'g' }
    ]
  },
  {
    nombre: 'Tarta de jamón, queso y tomate',
    porciones_base: 4,
    tipo_comida: 'cena',
    tiempo_preparacion_min: 30,
    instrucciones: '1. Forrar un molde de tarta con una tapa de masa.\n2. Colocar una capa de jamón cocido en fetas y arriba el queso muzzarella rallado o cortado.\n3. Cortar el tomate en rodajas y poner sobre el queso. Condimentar con orégano y sal.\n4. Tapar (o dejar abierta), pintar con huevo batido y hornear hasta dorar la masa.',
    ingredients: [
      { nombre: 'tapas de tarta', cantidad: 1, unidad: 'unidad' },
      { nombre: 'jamón cocido', cantidad: 200, unidad: 'g' },
      { nombre: 'queso muzzarella', cantidad: 300, unidad: 'g' },
      { nombre: 'tomate', cantidad: 2, unidad: 'unidad' },
      { nombre: 'huevo', cantidad: 1, unidad: 'unidad' }
    ]
  },
  {
    nombre: 'Pizza de muzzarella clásica',
    porciones_base: 3,
    tipo_comida: 'cena',
    tiempo_preparacion_min: 45,
    instrucciones: '1. Preparar la masa de pizza con harina, agua, levadura y sal. Dejar leudar.\n2. Estirar la masa en una pizzera aceitada y precocinar 5 minutos.\n3. Distribuir salsa de tomate condimentada y encima el queso muzzarella rallado.\n4. Llevar al horno al máximo hasta derretir el queso y dorar los bordes.',
    ingredients: [
      { nombre: 'harina de trigo', cantidad: 300, unidad: 'g' },
      { nombre: 'agua', cantidad: 180, unidad: 'ml' },
      { nombre: 'queso muzzarella', cantidad: 250, unidad: 'g' },
      { nombre: 'salsa de tomate', cantidad: 150, unidad: 'g' }
    ]
  },
  {
    nombre: 'Ñoquis de papa con salsa mixta',
    porciones_base: 4,
    tipo_comida: 'almuerzo',
    tiempo_preparacion_min: 60,
    instrucciones: '1. Hacer un puré de papas seco. Integrar con harina, yema de huevo y sal sin amasar de más.\n2. Formar rollos de masa, cortar cubos y dar forma de ñoqui.\n3. Para la salsa mixta: mezclar salsa fileto y crema de leche.\n4. Cocinar los ñoquis en abundante agua hirviendo, retirar cuando floten y salsear.',
    ingredients: [
      { nombre: 'papa', cantidad: 1.0, unidad: 'kg' },
      { nombre: 'harina de trigo', cantidad: 300, unidad: 'g' },
      { nombre: 'huevo', cantidad: 1, unidad: 'unidad' },
      { nombre: 'crema de leche', cantidad: 200, unidad: 'ml' },
      { nombre: 'salsa de tomate', cantidad: 300, unidad: 'g' }
    ]
  },
  {
    nombre: 'Cazuela de pollo y verduras',
    porciones_base: 4,
    tipo_comida: 'cena',
    tiempo_preparacion_min: 45,
    instrucciones: '1. Trocear el pollo y dorarlo en una olla con aceite.\n2. Agregar cebolla, morrón, ajo y zanahoria cortada en rodajas.\n3. Incorporar papas cortadas en cubos medianos, arvejas y caldo de verduras.\n4. Cocinar tapado a fuego medio hasta que las papas y el pollo estén tiernos.',
    ingredients: [
      { nombre: 'pollo troceado', cantidad: 1.0, unidad: 'kg' },
      { nombre: 'papa', cantidad: 500, unidad: 'g' },
      { nombre: 'cebolla', cantidad: 200, unidad: 'g' },
      { nombre: 'zanahoria', cantidad: 2, unidad: 'unidad' },
      { nombre: 'agua', cantidad: 500, unidad: 'ml' }
    ]
  },
  {
    nombre: 'Milanesas de pollo con ensalada mixta',
    porciones_base: 4,
    tipo_comida: 'almuerzo',
    tiempo_preparacion_min: 30,
    instrucciones: '1. Preparar milanesas con pechugas de pollo fileteadas pasándolas por huevo y pan rallado.\n2. Cocinar frita o al horno.\n3. Preparar la ensalada lavando y cortando lechuga, tomates y cebolla.\n4. Aderezar la ensalada con aceite y sal al gusto, y servir con las milanesas calientes.',
    ingredients: [
      { nombre: 'pechuga de pollo', cantidad: 800, unidad: 'g' },
      { nombre: 'pan rallado', cantidad: 300, unidad: 'g' },
      { nombre: 'huevo', cantidad: 2, unidad: 'unidad' },
      { nombre: 'lechuga', cantidad: 1, unidad: 'unidad' },
      { nombre: 'tomate', cantidad: 2, unidad: 'unidad' },
      { nombre: 'cebolla', cantidad: 1, unidad: 'unidad' }
    ]
  },
  {
    nombre: 'Zapallitos rellenos de carne y queso',
    porciones_base: 4,
    tipo_comida: 'cena',
    tiempo_preparacion_min: 45,
    instrucciones: '1. Hervir los zapallitos enteros 5 minutos, cortar la tapa y ahuecar con cuidado.\n2. Rehogar cebolla y cocinar carne picada con la pulpa del zapallito escurrida.\n3. Rellenar los zapallitos con la mezcla y acomodar en una fuente.\n4. Cubrir con una rodaja de queso cremoso y gratinar en horno fuerte.',
    ingredients: [
      { nombre: 'zapallito redondo', cantidad: 4, unidad: 'unidad' },
      { nombre: 'carne vacuna', cantidad: 300, unidad: 'g' },
      { nombre: 'cebolla', cantidad: 1, unidad: 'unidad' },
      { nombre: 'queso cremoso', cantidad: 200, unidad: 'g' }
    ]
  },
  {
    nombre: 'Canelones de verdura con salsa mixta',
    porciones_base: 4,
    tipo_comida: 'domingo',
    tiempo_preparacion_min: 70,
    instrucciones: '1. Preparar panqueques finos con harina, leche y huevo.\n2. Cocinar espinaca, escurrir bien y picar. Mezclar con ricota, queso rallado y nuez moscada.\n3. Rellenar los panqueques, enrollarlos y colocarlos en una fuente.\n4. Cubrir con salsa de tomate y crema de leche, llevar al horno a calentar y gratinar.',
    ingredients: [
      { nombre: 'harina de trigo', cantidad: 200, unidad: 'g' },
      { nombre: 'leche', cantidad: 400, unidad: 'ml' },
      { nombre: 'huevo', cantidad: 2, unidad: 'unidad' },
      { nombre: 'espinaca', cantidad: 500, unidad: 'g' },
      { nombre: 'ricota', cantidad: 300, unidad: 'g' },
      { nombre: 'crema de leche', cantidad: 200, unidad: 'ml' },
      { nombre: 'salsa de tomate', cantidad: 300, unidad: 'g' }
    ]
  },
  {
    nombre: 'Guiso de arroz con pollo',
    porciones_base: 4,
    tipo_comida: 'ambos',
    tiempo_preparacion_min: 40,
    instrucciones: '1. Trocear el pollo y dorar en olla grande.\n2. Sumar cebolla, morrón y zanahoria cortada.\n3. Agregar puré de tomate y caldo caliente, cocinar 10 minutos.\n4. Incorporar el arroz y cocinar unos 18 minutos más, cuidando que no se quede sin líquido.',
    ingredients: [
      { nombre: 'pollo troceado', cantidad: 600, unidad: 'g' },
      { nombre: 'arroz', cantidad: 300, unidad: 'g' },
      { nombre: 'cebolla', cantidad: 200, unidad: 'g' },
      { nombre: 'tomate puré', cantidad: 300, unidad: 'g' },
      { nombre: 'agua', cantidad: 800, unidad: 'ml' }
    ]
  },
  {
    nombre: 'Hamburguesas caseras con papas fritas',
    porciones_base: 4,
    tipo_comida: 'cena',
    tiempo_preparacion_min: 35,
    instrucciones: '1. Condimentar carne picada con sal, ajo picado y perejil, armar los medallones.\n2. Cocinar a la plancha.\n3. Pelar las papas, cortarlas en bastones y freírlas en abundante aceite caliente hasta que estén crujientes.',
    ingredients: [
      { nombre: 'carne vacuna', cantidad: 600, unidad: 'g' },
      { nombre: 'papa', cantidad: 1.0, unidad: 'kg' },
      { nombre: 'ajo', cantidad: 1, unidad: 'unidad' },
      { nombre: 'sal', cantidad: 5, unidad: 'g' }
    ]
  },
  {
    nombre: 'Colita de cuadril al horno con vegetales',
    porciones_base: 5,
    tipo_comida: 'almuerzo',
    tiempo_preparacion_min: 75,
    instrucciones: '1. Limpiar la colita de cuadril, frotar con aceite y condimentar con sal y pimienta.\n2. Colocar en placa para horno.\n3. Cortar calabaza, cebolla y morrón en trozos grandes, acomodar alrededor de la carne.\n4. Hornear a fuego medio (180°C) durante una hora.',
    ingredients: [
      { nombre: 'colita de cuadril', cantidad: 1.2, unidad: 'kg' },
      { nombre: 'calabaza', cantidad: 800, unidad: 'g' },
      { nombre: 'cebolla', cantidad: 2, unidad: 'unidad' }
    ]
  },
  {
    nombre: 'Estofado de ternera',
    porciones_base: 4,
    tipo_comida: 'cena',
    tiempo_preparacion_min: 60,
    instrucciones: '1. Cortar la carne en cubos medianos y sellarla en una olla con aceite caliente.\n2. Retirar la carne, rehogar cebolla y zanahoria.\n3. Volver la carne a la olla con puré de tomate, vino (opcional) y caldo.\n4. Cocinar tapado a fuego bajo durante 45 minutos hasta ablandar la ternera.',
    ingredients: [
      { nombre: 'carne vacuna', cantidad: 800, unidad: 'g' },
      { nombre: 'cebolla', cantidad: 200, unidad: 'g' },
      { nombre: 'tomate puré', cantidad: 400, unidad: 'g' },
      { nombre: 'zanahoria', cantidad: 1, unidad: 'unidad' }
    ]
  },
  {
    nombre: 'Supremas a la napolitana con puré',
    porciones_base: 4,
    tipo_comida: 'almuerzo',
    tiempo_preparacion_min: 45,
    instrucciones: '1. Hacer milanesas de pechuga de pollo y cocinarlas al horno.\n2. Al darlas vuelta, untarles salsa de tomate, poner una feta de jamón y rodajas de muzzarella.\n3. Llevar al horno hasta gratinar.\n4. Servir con un buen puré de papas casero.',
    ingredients: [
      { nombre: 'pechuga de pollo', cantidad: 800, unidad: 'g' },
      { nombre: 'pan rallado', cantidad: 250, unidad: 'g' },
      { nombre: 'huevo', cantidad: 2, unidad: 'unidad' },
      { nombre: 'jamón cocido', cantidad: 150, unidad: 'g' },
      { nombre: 'queso muzzarella', cantidad: 200, unidad: 'g' },
      { nombre: 'papa', cantidad: 1.0, unidad: 'kg' }
    ]
  }
];

async function seedRecipes() {
  console.log('Seeding recipes...');

  for (const rData of recipesData) {
    const { nombre, porciones_base, tipo_comida, tiempo_preparacion_min, instrucciones, ingredients } = rData;

    // Check if recipe exists
    const existing = await prisma.recipe.findFirst({
      where: { nombre },
    });

    if (existing) {
      console.log(`Recipe "${nombre}" already exists. Skipping.`);
      continue;
    }

    const resolvedIngredients = [];

    // Resolve or create ingredients in catalog
    for (const item of ingredients) {
      const nameNormalized = item.nombre.trim();
      const unit = item.unidad.trim();

      let ingredient = await prisma.ingredient.findFirst({
        where: {
          nombre: {
            equals: nameNormalized,
            mode: 'insensitive',
          },
        },
      });

      if (!ingredient) {
        let unidad_base = 'unidad';
        const unitLower = unit.toLowerCase();
        if (['g', 'kg', 'gr', 'gramos'].includes(unitLower)) {
          unidad_base = 'g';
        } else if (['ml', 'l', 'litro', 'litros'].includes(unitLower)) {
          unidad_base = 'ml';
        }

        ingredient = await prisma.ingredient.create({
          data: {
            nombre: nameNormalized,
            unidad_base,
          },
        });

        // Add standard conversion if unit is kg or l/litro
        if (unitLower === 'kg' && unidad_base === 'g') {
          await prisma.unitConversion.create({
            data: {
              ingredient_id: ingredient.id,
              unidad_origen: 'kg',
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
        }
        console.log(`Auto-created ingredient in catalog: "${nameNormalized}" (${unidad_base})`);
      }

      resolvedIngredients.push({
        ingredient_id: ingredient.id,
        cantidad: item.cantidad,
        unidad: item.unidad,
      });
    }

    // Insert Recipe with linked ingredients
    await prisma.$transaction(async (tx) => {
      const recipe = await tx.recipe.create({
        data: {
          nombre,
          porciones_base,
          tipo_comida: tipo_comida === 'domingo' ? 'almuerzo' : tipo_comida, // normalize custom types to allowed enum values
          tiempo_preparacion_min,
          instrucciones,
        },
      });

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
    });

    console.log(`Successfully seeded recipe: "${nombre}"`);
  }

  console.log('Recipes seeding completed!');
}

seedRecipes()
  .catch((e) => {
    console.error('Error during recipes seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
