import prisma from '../prismaClient.js';

async function main() {
  console.log('Seeding database with professional Argentine recipes master dataset...');

  // Clean existing data in reverse order of dependencies
  await prisma.mealPlanEntry.deleteMany({});
  await prisma.mealPlan.deleteMany({});
  await prisma.recipeIngredient.deleteMany({});
  await prisma.recipe.deleteMany({});
  await prisma.unitConversion.deleteMany({});
  await prisma.ingredient.deleteMany({});

  console.log('Cleared existing data.');

  // 1. Create Base Ingredients
  const baseIngredients = [
    { nombre: 'papa', unidad_base: 'g' },
    { nombre: 'cebolla', unidad_base: 'g' },
    { nombre: 'ajo', unidad_base: 'unidad' },
    { nombre: 'carne vacuna', unidad_base: 'g' },
    { nombre: 'leche', unidad_base: 'ml' },
    { nombre: 'agua', unidad_base: 'ml' },
    { nombre: 'sal', unidad_base: 'g' },
    { nombre: 'arroz', unidad_base: 'g' },
    { nombre: 'huevo', unidad_base: 'unidad' },
    { nombre: 'pan rallado', unidad_base: 'g' },
    { nombre: 'tapas de empanada', unidad_base: 'unidad' },
    { nombre: 'queso rallado', unidad_base: 'g' },
    { nombre: 'lentejas', unidad_base: 'g' },
    { nombre: 'chorizo colorado', unidad_base: 'unidad' },
    { nombre: 'panceta', unidad_base: 'g' },
    { nombre: 'zanahoria', unidad_base: 'unidad' },
    { nombre: 'asado de tira', unidad_base: 'g' },
    { nombre: 'harina de maíz', unidad_base: 'g' },
    { nombre: 'tomate puré', unidad_base: 'g' },
    { nombre: 'queso cremoso', unidad_base: 'g' },
    { nombre: 'harina de trigo', unidad_base: 'g' },
    { nombre: 'tapas de tarta', unidad_base: 'unidad' },
    { nombre: 'jamón cocido', unidad_base: 'g' },
    { nombre: 'queso muzzarella', unidad_base: 'g' },
    { nombre: 'tomate', unidad_base: 'unidad' },
    { nombre: 'salsa de tomate', unidad_base: 'g' },
    { nombre: 'crema de leche', unidad_base: 'ml' },
    { nombre: 'pollo troceado', unidad_base: 'g' },
    { nombre: 'pechuga de pollo', unidad_base: 'g' },
    { nombre: 'lechuga', unidad_base: 'unidad' },
    { nombre: 'zapallito redondo', unidad_base: 'unidad' },
    { nombre: 'espinaca', unidad_base: 'g' },
    { nombre: 'ricota', unidad_base: 'g' },
    { nombre: 'colita de cuadril', unidad_base: 'g' },
    { nombre: 'calabaza', unidad_base: 'g' },
    { nombre: 'manteca', unidad_base: 'g' }
  ];

  const createdIngredients = {};
  for (const ing of baseIngredients) {
    const created = await prisma.ingredient.create({
      data: ing,
    });
    createdIngredients[ing.nombre] = created;
  }
  console.log(`Seeded ${baseIngredients.length} ingredients.`);

  // 2. Create Unit Conversions
  const conversions = [
    // Papa
    { ingredient_id: createdIngredients['papa'].id, unidad_origen: 'unidad', factor_a_base: 150.0 },
    { ingredient_id: createdIngredients['papa'].id, unidad_origen: 'kg', factor_a_base: 1000.0 },
    // Cebolla
    { ingredient_id: createdIngredients['cebolla'].id, unidad_origen: 'unidad', factor_a_base: 100.0 },
    { ingredient_id: createdIngredients['cebolla'].id, unidad_origen: 'kg', factor_a_base: 1000.0 },
    // Ajo
    { ingredient_id: createdIngredients['ajo'].id, unidad_origen: 'cabeza', factor_a_base: 10.0 },
    // Carne vacuna
    { ingredient_id: createdIngredients['carne vacuna'].id, unidad_origen: 'kg', factor_a_base: 1000.0 },
    // Leche
    { ingredient_id: createdIngredients['leche'].id, unidad_origen: 'l', factor_a_base: 1000.0 },
    { ingredient_id: createdIngredients['leche'].id, unidad_origen: 'taza', factor_a_base: 250.0 },
    // Agua
    { ingredient_id: createdIngredients['agua'].id, unidad_origen: 'l', factor_a_base: 1000.0 },
    { ingredient_id: createdIngredients['agua'].id, unidad_origen: 'taza', factor_a_base: 250.0 },
    // Sal
    { ingredient_id: createdIngredients['sal'].id, unidad_origen: 'cucharadita', factor_a_base: 5.0 },
    { ingredient_id: createdIngredients['sal'].id, unidad_origen: 'cucharada', factor_a_base: 15.0 },
    // Arroz
    { ingredient_id: createdIngredients['arroz'].id, unidad_origen: 'taza', factor_a_base: 200.0 },
    { ingredient_id: createdIngredients['arroz'].id, unidad_origen: 'kg', factor_a_base: 1000.0 },
    // Huevo
    { ingredient_id: createdIngredients['huevo'].id, unidad_origen: 'docena', factor_a_base: 12.0 },
    // Pollo troceado
    { ingredient_id: createdIngredients['pollo troceado'].id, unidad_origen: 'kg', factor_a_base: 1000.0 },
    // Pechuga de pollo
    { ingredient_id: createdIngredients['pechuga de pollo'].id, unidad_origen: 'kg', factor_a_base: 1000.0 },
    // Colita de cuadril
    { ingredient_id: createdIngredients['colita de cuadril'].id, unidad_origen: 'kg', factor_a_base: 1000.0 },
    // Asado de tira
    { ingredient_id: createdIngredients['asado de tira'].id, unidad_origen: 'kg', factor_a_base: 1000.0 },
    // Queso muzzarella
    { ingredient_id: createdIngredients['queso muzzarella'].id, unidad_origen: 'kg', factor_a_base: 1000.0 },
    // Jamón cocido
    { ingredient_id: createdIngredients['jamón cocido'].id, unidad_origen: 'kg', factor_a_base: 1000.0 },
    // Queso cremoso
    { ingredient_id: createdIngredients['queso cremoso'].id, unidad_origen: 'kg', factor_a_base: 1000.0 }
  ];

  for (const conv of conversions) {
    await prisma.unitConversion.create({
      data: conv,
    });
  }
  console.log(`Seeded ${conversions.length} conversion factors.`);

  // 3. Create Argentine Recipes (With Rich Chef-style Explanations)
  const recipesData = [
    {
      nombre: 'Milanesas de carne con puré',
      porciones_base: 4,
      tipo_comida: 'ambos',
      tiempo_preparacion_min: 45,
      instrucciones: `📝 DESCRIPCIÓN:
El clásico indiscutido de la cocina hogareña argentina. Tiernas milanesas de carne vacuna con un rebozado crocante, acompañadas de un puré de papas sedoso con manteca y leche tibia.

🥣 PREPARACIÓN:
1. Limpieza de la carne: Tomar filetes de nalga, bola de lomo o cuadrada. Retirar la grasa visible y los nervios periféricos con cuchillo afilado. Golpear suavemente cada filete con un martillo de carne para ablandar las fibras y homogeneizar el espesor.
2. El marinado (Provinzal): En un bol grande, batir los huevos con sal fina, pimienta negra molida, dos dientes de ajo picados muy finamente y un puñado generoso de perejil fresco picado. Sumergir los filetes asegurando que queden cubiertos. Tapar y dejar marinar en la heladera durante un mínimo de 1 hora para asentar los sabores.
3. El rebozado firme: Colocar pan rallado en una fuente amplia. Pasar cada bife marinado por el pan, presionando fuertemente con los puños y las palmas de las manos para sellar el pan rallado sobre la carne. Sacudir el exceso.
4. Cocción crujiente: Calentar abundante aceite de girasol en una sartén grande (el aceite debe cubrir la mitad de las milanesas). Freír a fuego medio-alto durante 3 minutos por lado hasta que adquieran un tono dorado parejo. Retirar y escurrir en papel de cocina absorbente.

🥔 EL PURÉ DE PAPAS PERFECTO:
5. Hervir las papas peladas y cortadas en trozos iguales en una olla con abundante agua fría y sal gruesa. Cocinar a hervor moderado durante 20-25 minutos hasta que al pincharlas se deshagan.
6. Escurrir bien las papas y pisarlas con un pisapapas estando aún bien calientes. Agregar la manteca y la leche caliente de a poco mientras se mezcla con cuchara de madera de forma enérgica para lograr una textura aireada, cremosa y sin grumos. Condimentar con una pizca de nuez moscada rallada al final.`,
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
      tipo_comida: 'ambos',
      tiempo_preparacion_min: 75,
      instrucciones: `📝 DESCRIPCIÓN:
Empanadas tradicionales del norte argentino, rellenas con carne magra cortada en cubitos milimétricos cocinada con cebolla de verdeo, comino y pimentón, envueltas en masa horneada.

🥣 PREPARACIÓN:
1. El picado: Cortar la carne vacuna (preferentemente lomo, bola de lomo o nalga) en cubos pequeños y uniformes de aproximadamente 5mm. Cortar las cebollas blancas en cubos muy finos y la cebolla de verdeo separando la parte blanca de la verde.
2. Cocción del relleno: Calentar en una olla grande aceite o grasa de pella. Rehogar la cebolla blanca hasta que esté transparente. Añadir el morrón picado. Agregar la carne cortada a cuchillo e incorporar comino, sal y pimentón dulce. Revolver y cocinar a fuego fuerte durante sólo 5 minutos para evitar que la carne se seque. Retirar del fuego.
3. El toque final: Agregar las rodajas finas de huevo duro picado y la parte verde de la cebolla de verdeo cruda. Rectificar condimentos. Dejar enfriar el relleno por completo en la heladera durante 4 horas (esto es clave para que el jugo se solidifique y las empanadas sean jugosas al morderlas).
4. Armado y cocción: Repartir el relleno en las tapas de empanada, humedecer el borde con agua y cerrar haciendo un repulgue tradicional de 13 pliegues. Colocar en una placa aceitada y hornear en horno precalentado a temperatura máxima (220°C-240°C) durante 12-15 minutos hasta que estén doradas en la superficie.`,
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
      tipo_comida: 'ambos',
      tiempo_preparacion_min: 60,
      instrucciones: `📝 DESCRIPCIÓN:
Un plato invernal reconfortante compuesto por una base jugosa de carne picada sazonada con comino y pimentón, cubierta por una capa gruesa de puré de papas gratinado al horno con queso rallado.

🥣 PREPARACIÓN:
1. Relleno de carne: En una sartén honda, rehogar la cebolla picada y el ajo con un poco de aceite de girasol. Añadir la carne picada vacuna y cocinar rompiendo los bloques de carne con una cuchara de madera. Condimentar con sal, pimienta negra, comino y abundante pimentón dulce. Cocinar a fuego medio durante 15 minutos. Al apagar el fuego, mezclar con huevo duro picado y aceitunas sin carozo.
2. Preparación del puré: Hervir las papas peladas en agua hirviendo con sal. Escurrir bien para que no quede agua remanente. Pisar las papas incorporando leche tibia, manteca, sal fina y nuez moscada recién rallada hasta lograr una consistencia bien firme y cremosa.
3. Montaje del pastel: En una fuente para horno rectangular y profunda, colocar toda la base de carne esparcida uniformemente. Cubrir delicadamente con el puré de papas, usando una espátula para emparejar la superficie.
4. Gratinado: Espolvorear abundante queso rallado en la superficie y marcar líneas diagonales con un tenedor para dar textura. Hornear a fuego fuerte (200°C) durante 20 minutos hasta que el queso forme una costra dorada y burbujeante. Dejar reposar 5 minutos antes de cortar.`,
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
      tipo_comida: 'ambos',
      tiempo_preparacion_min: 35,
      instrucciones: `📝 DESCRIPCIÓN:
La clásica tortilla española con papas tiernas pochadas en aceite y cebollas caramelizadas, unidas por huevo batido y cocinadas al punto justo (babé o firme).

🥣 PREPARACIÓN:
1. El corte homogéneo: Pelar las papas y cortarlas en láminas finas e irregulares de aproximadamente 3mm (corte español). Picar la cebolla en pluma o cubos pequeños.
2. Pochado (Cocción lenta): En una sartén con abundante aceite caliente (casi cubriendo las papas), introducir las papas y las cebollas. Cocinar a fuego medio-bajo revolviendo ocasionalmente para que las papas se cocinen y queden blandas, pero no doradas ni crujientes (pochadas). Escurrir bien el aceite restante.
3. Unión y reposo: Batir los huevos en un bol grande con sal. Incorporar las papas y cebollas calientes escurridas al huevo. Mezclar bien y dejar reposar la preparación tapada durante 10 minutos (esto permite que la papa absorba el huevo batido y logre una consistencia homogénea).
4. Cocción final y giro: Calentar una sartén antiadherente mediana con una cucharadita de aceite. Verter la mezcla. Cocinar a fuego medio durante 3-4 minutos moviendo la sartén para evitar que se pegue. Usar un plato plano más grande que la sartén, colocarlo sobre ella, dar vuelta con un movimiento rápido y deslizar la tortilla nuevamente en la sartén. Cocinar durante 2-3 minutos más. Servir tibia.`,
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
      tiempo_preparacion_min: 80,
      instrucciones: `📝 DESCRIPCIÓN:
Plato criollo ideal para los días fríos. Un guiso robusto y espeso de lentejas cocidas a fuego lento junto a chorizo colorado, panceta ahumada y cubos de carne vacuna.

🥣 PREPARACIÓN:
1. Preparativos: Remojar las lentejas en agua fría durante 2 horas previas a la cocción. Picar la cebolla, el morrón y las zanahorias en dados pequeños. Cortar el chorizo colorado en rodajas medianas y la panceta en tiras.
2. Base de sabor: En una olla grande de fondo grueso, dorar la panceta y el chorizo colorado sin aceite (soltarán su propia grasa). Retirar de la olla y reservar las carnes doradas. En la grasa remanente de la olla, rehogar la cebolla, el ajo y las zanahorias con una pizca de sal hasta ablandar.
3. Integración: Volver a incorporar la panceta y el chorizo. Agregar cubitos pequeños de carne vacuna y dorar. Incorporar puré de tomate y caldo de verduras caliente. Cocinar durante 10 minutos.
4. Cocción de lentejas: Escurrir las lentejas e incorporarlas a la olla. Condimentar con ají molido, comino, pimentón dulce y dos hojas de laurel. Cocinar a fuego lento durante 40-50 minutos, revolviendo de vez en cuando y agregando caldo caliente si es necesario, hasta que las lentejas estén tiernas y el caldo espese a una consistencia bien cremosa.`,
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
      tipo_comida: 'ambos',
      tiempo_preparacion_min: 95,
      instrucciones: `📝 DESCRIPCIÓN:
La adaptación hogareña del clásico asado dominical argentino. Tiras de costilla tiernas horneadas a fuego lento, acompañadas de papas rústicas crujientes sazonadas.

🥣 PREPARACIÓN:
1. Condimentar la carne: Tomar las tiras de asado de tira. Salar de forma generosa con sal parrillera o sal gruesa por todos sus lados, frotando bien la carne. Dejar reposar a temperatura ambiente 15 minutos antes de hornear.
2. Horneado lento: Colocar las tiras de asado en una asadera grande con los huesos hacia abajo (esto actúa como escudo térmico y mantiene la carne jugosa). Llevar a horno precalentado a fuego medio (170°C-180°C) durante aproximadamente 45 minutos.
3. Papas rústicas: Mientras tanto, lavar muy bien las papas cepillando la cáscara. Cortarlas en cuñas longitudinales de igual tamaño. Colocarlas en un bol, rociarlas con abundante aceite de girasol, sal fina, ají molido y orégano seco. Mezclar con las manos para asegurar que queden cubiertas de condimento.
4. Cocción conjunta: Retirar la asadera del horno, dar vuelta las tiras de carne (con la carne hacia abajo) y distribuir las papas en los huecos libres. Subir el horno a temperatura alta (200°C) y cocinar durante otros 35-40 minutos, hasta que las papas estén tiernas y crujientes por fuera y la carne esté tierna desprendiéndose del hueso.`,
      ingredients: [
        { nombre: 'asado de tira', cantidad: 1.5, unidad: 'kg' },
        { nombre: 'papa', cantidad: 1.0, unidad: 'kg' },
        { nombre: 'sal', cantidad: 15, unidad: 'g' }
      ]
    },
    {
      nombre: 'Polenta con tuco y queso cremoso',
      porciones_base: 4,
      tipo_comida: 'ambos',
      tiempo_preparacion_min: 30,
      instrucciones: `📝 DESCRIPCIÓN:
Un clásico reconfortante de la cocina familiar: polenta cremosa cocida en caldo y leche, servida con un tuco espeso de carne vacuna picada y dados de queso cremoso derretidos en la base.

🥣 PREPARACIÓN:
1. Elaboración del Tuco (Estofado rápido): En una olla pequeña rehogar cebolla y ajo picados en aceite de girasol. Agregar la carne picada vacuna y cocinar removiendo. Una vez cocida la carne, añadir puré de tomate, sal, pimienta, una pizca de azúcar (para neutralizar acidez) y una hoja de laurel. Cocinar a fuego lento durante 20 minutos hasta que espese.
2. Preparación del líquido de la polenta: En una olla grande, calentar la leche, el agua y una cucharadita de sal fina. Opcionalmente, agregar un cubo de caldo de verduras. Llevar a ebullición.
3. Cocción de la polenta sin grumos: Una vez que el líquido hierva, bajar el fuego a mínimo y verter la harina de maíz en forma de lluvia fina y continua, revolviendo constantemente con un batidor de alambre o cuchara de madera. Cocinar revolviendo durante 3-5 minutos (o según especificaciones del paquete). Apagar el fuego e incorporar manteca o una cucharada de queso rallado para mayor cremosidad.
4. Montaje: En la base de platos hondos individuales colocar cubos abundantes de queso cremoso. Servir la polenta bien caliente encima para que funda el queso y coronar con varias cucharadas generosas de tuco y queso rallado por encima.`,
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
      tipo_comida: 'ambos',
      tiempo_preparacion_min: 60,
      instrucciones: `📝 DESCRIPCIÓN:
Pasta de huevo fresca y casera estirada y cortada en cintas finas, servida con una salsa boloñesa tradicional cocinada lentamente con sofrito y carne picada vacuna.

🥣 PREPARACIÓN:
1. La masa de huevo: Colocar la harina de trigo en forma de corona en la mesada. En el centro colocar los huevos enteros y sal fina. Mezclar los ingredientes del centro e ir incorporando la harina poco a poco. Amasar enérgicamente durante 10 minutos hasta lograr un bollo liso y elástico. Tapar con film y dejar descansar 30 minutos.
2. Salsa Boloñesa: Rehogar cebolla y zanahoria picadas finamente. Agregar carne picada vacuna. Cocinar hasta que cambie de color. Agregar tomate puré, sal, pimienta y laurel. Bajar el fuego al mínimo y cocinar tapado durante 45 minutos (agregando agua o caldo si se seca) hasta concentrar sabores.
3. Estirado y corte: Dividir la masa en porciones. Estirar con rodillo o pastalinda hasta obtener un espesor de 1.5mm. Espolvorear con harina, enrollar las hojas de masa flojas y cortar con cuchillo en cintas de 7mm de ancho. Desenrollar y espolvorear con harina para que no se peguen.
4. Cocción al dente: Hervir abundante agua con sal gruesa en una olla grande. Echar los fideos y cocinar durante 2 a 3 minutos desde que vuelven a hervir. Escurrir e integrar directamente con la salsa caliente en una fuente. Servir con queso rallado.`,
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
      tipo_comida: 'ambos',
      tiempo_preparacion_min: 30,
      instrucciones: `📝 DESCRIPCIÓN:
Tarta express de masa crocante rellena de fetas de jamón cocido, abundante queso muzzarella fundido y rodajas de tomates frescos sazonados con orégano.

🥣 PREPARACIÓN:
1. Acondicionar el molde: Aceitar ligeramente una tartera mediana. Estirar la tapa de tarta y cubrir el molde presionando los bordes inferiores para eliminar aire.
2. Relleno escalonado: Disponer las fetas de jamón cocido cubriendo toda la base de la masa. Encima del jamón, colocar el queso muzzarella cortado en cubos o rallado de forma pareja.
3. Tomates y condimentos: Cortar los tomates redondos en rodajas de 5mm. Disponer las rodajas sobre la muzzarella. Condimentar los tomates con sal fina y abundante orégano seco.
4. Ligado y horneado: Batir un huevo con una pizca de sal y verter por encima de los ingredientes para ligar el relleno. Realizar un repulgue decorativo en los bordes de la masa. Hornear en horno precalentado a fuego medio-alto (190°C) durante 20-25 minutos hasta que la masa esté dorada y el queso completamente derretido.`,
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
      tipo_comida: 'ambos',
      tiempo_preparacion_min: 50,
      instrucciones: `📝 DESCRIPCIÓN:
La pizza clásica argentina: media masa de molde, esponjosa por dentro y crocante por fuera, cubierta de salsa fileto, abundante muzzarella fundida y aceitunas.

🥣 PREPARACIÓN:
1. Elaboración de la masa: Disolver levadura en agua tibia con una pizca de azúcar. Colocar la harina de trigo con sal en un bol grande, verter el agua y amasar hasta formar un bollo tierno. Agregar un chorrito de aceite. Dejar leudar en zona cálida tapado durante 40 minutos hasta duplicar volumen.
2. Estirado y Pre-cocción: Dividir el bollo, aceitar una pizzera de molde y estirar la masa con los dedos desde el centro hacia los bordes. Dejar levar 10 minutos en el molde. Untar dos cucharadas de salsa de tomate por encima de la masa. Llevar a horno fuerte precalentado (200°C) durante 8 minutos para sellar la masa (pre-pizza).
3. Muzzarella y horneado final: Retirar del horno, agregar el resto de la salsa y cubrir uniformemente con queso muzzarella rallado. Regresar al horno a temperatura máxima por 8-10 minutos hasta que el queso esté derretido, dorado y burbujeante. Decorar con orégano y aceitunas al servir.`,
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
      tipo_comida: 'ambos',
      tiempo_preparacion_min: 65,
      instrucciones: `📝 DESCRIPCIÓN:
Tradicionales ñoquis de papa caseros de textura liviana que se deshacen en la boca, bañados en una suave salsa mixta de crema de leche y salsa de tomate.

🥣 PREPARACIÓN:
1. El puré seco (Secreto de textura): Hervir las papas con cáscara (esto evita que absorban agua de más). Pelarlas calientes y pisarlas inmediatamente. Dejar enfriar el puré por completo antes de armar la masa (un puré caliente requerirá más harina, haciendo que los ñoquis queden duros).
2. Armado de la masa: Sobre la mesada colocar el puré frío, hacer un hueco, añadir el huevo y sal fina. Incorporar la harina de trigo tamizada poco a poco. Integrar con espátula o cornet sin amasar (amasar desarrolla el gluten y endurece la pasta). Formar un bollo suave y homogéneo.
3. Formado: Cortar porciones de masa, rodar sobre la mesada enharinada formando cilindros largos de 1.5cm de diámetro y cortar en cubitos de 2cm. Pasarlos por la tablita de marcar ñoquis o los dientes de un tenedor.
4. Salsa y Hervor: Calentar la salsa de tomate e incorporar la crema de leche para formar la salsa mixta. Cocinar los ñoquis en tandas en una olla grande con abundante agua hirviendo y sal gruesa. Retirarlos con espumadera apenas floten en la superficie de la olla y verterlos directamente dentro de la sartén con la salsa caliente. Mezclar y servir con queso rallado.`,
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
      tipo_comida: 'ambos',
      tiempo_preparacion_min: 50,
      instrucciones: `📝 DESCRIPCIÓN:
Un plato nutritivo y rústico compuesto de presas de pollo doradas guisadas lentamente en caldo con zanahoria, cebolla, calabaza y papas tiernas.

🥣 PREPARACIÓN:
1. Sellar la carne: Trocear el pollo retirando excesos de grasa y piel. En una olla de fondo grueso bien caliente con un chorro de aceite, sellar las presas de pollo hasta que la piel quede crujiente y dorada. Retirar el pollo y reservar.
2. Sofrito base: En la misma olla, agregar la cebolla, el morrón y el ajo picados finamente. Cocinar a fuego medio raspando los jugos del pollo del fondo. Añadir las zanahorias cortadas en rodajas medianas.
3. Cocción lenta en caldo: Incorporar el pollo sellado nuevamente a la olla, verter el agua hirviendo (o caldo de gallina) y una hoja de laurel. Cocinar tapado a fuego medio durante 15 minutos.
4. Vegetales tiernos: Agregar papas cortadas en cubos de 3cm y trozos de calabaza. Salpimentar a gusto. Cocinar tapado durante 20 minutos más hasta que las papas estén tiernas al pincharlas y el caldo se reduzca y espese ligeramente. Servir bien caliente en cazuelas.`,
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
      tipo_comida: 'ambos',
      tiempo_preparacion_min: 35,
      instrucciones: `📝 DESCRIPCIÓN:
Pechugas de pollo tiernas rebozadas y horneadas a la perfección, servidas con una fresca ensalada clásica de lechuga crocante, tomate y cebolla blanca.

🥣 PREPARACIÓN:
1. Fileteado y marinado: Filetear las pechugas de pollo en cortes finos (supremas). Batir los huevos en un bol junto a sal fina, pimienta y ajo en polvo. Sumergir las milanesas de pollo y reposar 15 minutos.
2. Rebozado: Colocar el pan rallado en una bandeja amplia. Pasar cada filete de pollo presionando fuertemente para lograr un rebozado uniforme que no se despegue.
3. Horneado saludable: Precalentar una asadera en el horno con un chorrito fino de aceite. Disponer las milanesas de pollo y cocinar en horno fuerte (200°C) durante 10 minutos por lado, logrando que queden doradas y jugosas por dentro sin secarse.
4. Ensalada clásica: Lavar muy bien las hojas de lechuga y secarlas con repasador limpio. Cortar los tomates en rodajas o cuñas y la cebolla en plumas finas. Integrar los ingredientes de la ensalada en un bol, condimentar con aceite de girasol, vinagre y sal fina justo antes de servir junto a las milanesas calientes.`,
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
      tipo_comida: 'ambos',
      tiempo_preparacion_min: 50,
      instrucciones: `📝 DESCRIPCIÓN:
Hortalizas de estación ahuecadas y rellenas con un guisado de carne vacuna sazonada con cebolla, mezclado con la propia pulpa del zapallito, cubiertos con queso cremoso derretido.

🥣 PREPARACIÓN:
1. Blanquear los zapallitos: Lavar los zapallitos redondos. Hervirlos enteros en abundante agua hirviendo con sal durante sólo 5-7 minutos (deben ablandarse pero mantenerse firmes). Escurrir y dejar entibiar.
2. Ahuecado: Cortar la tapa superior de cada zapallito. Con una cuchara de té, retirar con cuidado la pulpa interior con semillas cuidando de no romper las paredes ni el fondo del zapallito. Picar la pulpa extraída y escurrirla muy bien en un colador presionando con la cuchara para retirar toda el agua.
3. El Relleno: En una sartén, dorar la cebolla picada y carne picada vacuna. Agregar la pulpa de zapallito escurrida, condimentar con sal, pimienta y pimentón. Cocinar durante 10 minutos. Retirar del fuego y rellenar cada zapallito ahuecado presionando suavemente.
4. Gratinado: Acomodar los zapallitos rellenos en una placa para horno. Colocar sobre cada uno una rodaja generosa de queso cremoso y una pizca de orégano. Hornear a fuego fuerte (200°C) durante 15 minutos hasta que el queso se derrita e inunde los bordes y empiece a dorarse.`,
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
      tipo_comida: 'ambos',
      tiempo_preparacion_min: 75,
      instrucciones: `📝 DESCRIPCIÓN:
Panqueques de masa fina rellenos con un cremoso guisado de espinaca cocida y ricota sazonada, horneados bajo una capa de salsa de tomate clásica y crema de leche fresca.

🥣 PREPARACIÓN:
1. Masa de panqueques: Batir los huevos en un bol, incorporar la harina y la leche de a poco batiendo vigorosamente para evitar grumos. Dejar reposar la masa 15 minutos. Cocinar panqueques finos en una sartén engrasada con manteca y reservar en un plato tapados.
2. El relleno cremoso: Lavar y cocinar la espinaca al vapor durante 2 minutos. Escurrir muy bien presionando con las manos hasta extraer todo el líquido y picar finamente. En un bol mezclar la espinaca, la ricota fresca escurrida, sal fina, pimienta y una cucharada de queso rallado. Mezclar bien hasta homogeneizar.
3. Armado: Colocar dos cucharadas de relleno en el extremo de cada panqueque y enrollar con cuidado para formar los canelones.
4. Montaje y horneado: Cubrir la base de una fuente para horno con un poco de salsa de tomate. Disponer los canelones uno al lado del otro en una sola capa. Bañar por encima con el resto de la salsa de tomate y verter la crema de leche cubriendo todo. Espolvorear queso rallado extra y hornear a fuego medio-alto (190°C) durante 20 minutos hasta burbujear y dorar.`,
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
      tiempo_preparacion_min: 45,
      instrucciones: `📝 DESCRIPCIÓN:
Arroz cocinado lentamente en una cacerola grande junto a presas de pollo doradas en una salsa de sofrito aromática de cebollas, zanahorias y puré de tomate sazonado.

🥣 PREPARACIÓN:
1. Sellar el pollo: Cortar el pollo troceado retirando excesos de grasa. En una cacerola grande con aceite de girasol, dorar las presas a fuego fuerte hasta sellar la piel. Retirar el pollo.
2. Sofrito aromático: En los jugos remanentes, rehogar la cebolla y zanahorias cortadas en dados muy pequeños. Cocinar 5 minutos incorporando una pizca de sal.
3. Sabor e integración: Incorporar el pollo dorado nuevamente, el puré de tomate y el agua hirviendo (o caldo de verduras). Condimentar con orégano y laurel. Tapar y cocinar a fuego medio durante 15 minutos.
4. Cocción del arroz: Añadir el arroz a la olla distribuyéndolo entre el pollo y la salsa. Rectificar la sal. Cocinar a fuego medio-bajo destapado durante 18 minutos, revolviendo suavemente para evitar que el arroz se pegue en el fondo, hasta que esté tierno y el caldo se reduzca casi por completo, quedando un guiso húmedo y jugoso.`,
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
      tipo_comida: 'ambos',
      tiempo_preparacion_min: 40,
      instrucciones: `📝 DESCRIPCIÓN:
Medallones de carne vacuna molida condimentada al estilo casero, cocinadas a la plancha, acompañadas de las tradicionales papas fritas crujientes por fuera e infladas por dentro.

🥣 PREPARACIÓN:
1. Amasado y condimentado de la carne: En un bol, integrar la carne picada con sal fina, ajo finamente picado, pimienta y perejil fresco picado. Amasar la carne durante 5 minutos para liberar proteínas (esto ayuda a que las hamburguesas queden compactas y no se desarmen sin necesidad de usar huevo ni harina). Dividir en 4 porciones, dar forma redonda de 2cm de espesor y marcar el centro con el pulgar para evitar que se hinchen al cocinarlas.
2. Papas fritas (El secreto del doble frito): Pelar las papas y cortarlas en bastones de 1cm de ancho. Lavarlas muy bien en agua fría para retirar el almidón excedente y secarlas a la perfección con un lienzo limpio.
3. Primer fritura de papas: Calentar abundante aceite de girasol en una olla. Freír las papas a temperatura media (150°C) durante 8 minutos hasta que estén tiernas y cocidas pero sin tomar color. Retirar y escurrir en una bandeja.
4. Plancha y Dorado final: Cocinar los medallones de carne en una plancha de hierro muy caliente durante 4 minutos por lado hasta que formen costra. Al mismo tiempo, calentar al máximo el aceite de las papas y volverlas a introducir durante 2-3 minutos hasta que adquieran un color dorado intenso y queden súper crujientes. Servir al instante.`,
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
      tipo_comida: 'ambos',
      tiempo_preparacion_min: 80,
      instrucciones: `📝 DESCRIPCIÓN:
Un corte clásico de carne al horno, jugoso y tierno, cocinado lentamente con calabaza, cebolla y morrón asados en sus propios jugos.

🥣 PREPARACIÓN:
1. Sellado de la carne: Limpiar la colita de cuadril retirando excesos de grasa exterior pero dejando una capa fina para aportar sabor y humedad. Frotar la carne con sal gruesa y pimienta.
2. Preparación de vegetales: Cortar la calabaza con piel (lavada) en gajos medianos, y las cebollas y morrones en cuartos grandes. Colocar los vegetales en un bol y rociarlos con un poco de aceite de girasol y sal.
3. Horneado de la carne: Disponer la colita de cuadril en el centro de una asadera aceitada. Colocar los vegetales alrededor.
4. Cocción y reposo: Hornear en horno precalentado a fuego medio-alto (190°C) durante 45-55 minutos. A mitad de cocción, dar vuelta la colita de cuadril y rotar los vegetales. Retirar del horno cuando la carne esté tierna en el centro pero aún jugosa. Dejar reposar la colita de cuadril cubierta con papel aluminio 5-10 minutos antes de cortarla (este paso es fundamental para que los jugos de la carne se redistribuyan y no se pierdan en la tabla de corte).`,
      ingredients: [
        { nombre: 'colita de cuadril', cantidad: 1.2, unidad: 'kg' },
        { nombre: 'calabaza', cantidad: 800, unidad: 'g' },
        { nombre: 'cebolla', cantidad: 2, unidad: 'unidad' }
      ]
    },
    {
      nombre: 'Estofado de ternera',
      porciones_base: 4,
      tipo_comida: 'ambos',
      tiempo_preparacion_min: 70,
      instrucciones: `📝 DESCRIPCIÓN:
Trozos de ternera tiernizados mediante una cocción prolongada y lenta en una reducción de puré de tomate, zanahorias, cebollas y caldo de carne.

🥣 PREPARACIÓN:
1. Sellar la carne: Cortar la carne vacuna en dados medianos de 4cm. En una olla de fondo grueso bien caliente con aceite, sellar los cubos de carne vacuna en tandas hasta que estén completamente dorados de todos lados. Retirar la carne y reservar.
2. Base de vegetales: En la misma olla con los jugos de la carne, añadir la cebolla picada y las zanahorias cortadas en rodajas de 5mm. Cocinar raspando el fondo durante 5-7 minutos.
3. Cocción a fuego corona (lento): Devolver la carne a la olla, añadir el puré de tomate y caldo de carne caliente hasta cubrir los ingredientes. Salpimentar a gusto e incorporar laurel.
4. Reducción y ablandado: Bajar el fuego al mínimo, tapar la olla a medio cubrir y cocinar de forma muy suave durante 50-60 minutos, hasta que la ternera esté extremadamente tierna (se deshaga con el tenedor) y la salsa de tomate se reduzca a una consistencia bien densa y oscura.`,
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
      tipo_comida: 'ambos',
      tiempo_preparacion_min: 50,
      instrucciones: `📝 DESCRIPCIÓN:
Milanesas de pechuga de pollo cubiertas con salsa de tomate sabrosa, fetas de jamón cocido y abundante queso muzzarella fundido y gratinado al horno, acompañadas de puré cremoso de papas.

🥣 PREPARACIÓN:
1. Preparar las milanesas de pollo: Cortar las pechugas de pollo en filetes delgados. Pasarlas por huevo batido sazonado con ajo picado y perejil fresco. Rebozar con pan rallado presionando bien.
2. Horneado inicial: Colocar las milanesas en una placa aceitada previamente precalentada en horno fuerte (200°C) para sellar rápidamente el rebozado. Cocinar 8 minutos de un lado, darlas vuelta y cocinar 4 minutos más.
3. La Cobertura (Napolitana): Retirar la placa del horno sin apagarlo. Sobre cada milanesa, untar dos cucharadas de salsa de tomate caliente. Colocar una feta doblada de jamón cocido encima y coronar con láminas gruesas de queso muzzarella. Espolvorear orégano seco por encima.
4. Gratinado final: Regresar la placa al horno a temperatura máxima por 5-7 minutos hasta que el queso muzzarella se derrita, burbujee y se dore levemente en los bordes. Servir de inmediato acompañadas de un puré de papas cremoso bien caliente (pisado con manteca y leche).`,
      ingredients: [
        { nombre: 'pechuga de pollo', cantidad: 800, unidad: 'g' },
        { nombre: 'pan rallado', cantidad: 250, unidad: 'g' },
        { nombre: 'huevo', cantidad: 2, unidad: 'unidad' },
        { fontNombre: 'jamón cocido', nombre: 'jamón cocido', cantidad: 150, unidad: 'g' }, // Safe fallback naming
        { nombre: 'queso muzzarella', cantidad: 200, unidad: 'g' },
        { nombre: 'papa', cantidad: 1.0, unidad: 'kg' }
      ]
    }
  ];

  // Seed recipes
  for (const recipe of recipesData) {
    const createdRecipe = await prisma.recipe.create({
      data: {
        nombre: recipe.nombre,
        porciones_base: recipe.porciones_base,
        tipo_comida: recipe.tipo_comida,
        tiempo_preparacion_min: recipe.tiempo_preparacion_min,
        instrucciones: recipe.instrucciones
      }
    });

    for (const ing of recipe.ingredients) {
      const dbIng = createdIngredients[ing.nombre];
      if (dbIng) {
        await prisma.recipeIngredient.create({
          data: {
            recipe_id: createdRecipe.id,
            ingredient_id: dbIng.id,
            cantidad: ing.cantidad,
            unidad: ing.unidad
          }
        });
      }
    }
  }

  console.log(`Seeded ${recipesData.length} recipes.`);
  console.log('Database master seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
