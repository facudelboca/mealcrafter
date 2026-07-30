import 'dotenv/config';

/**
 * Translates a given text from English to Spanish using MyMemory Translation API
 * Splits longer text into chunks to respect API query limits.
 */
async function translateChunk(chunk) {
  if (!chunk || !chunk.trim()) return chunk;
  try {
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(chunk)}&langpair=en|es`;
    const res = await fetch(url);
    const data = await res.json();
    return data.responseData?.translatedText || chunk;
  } catch (err) {
    console.error('Chunk translation failed:', err);
    return chunk;
  }
}

export async function translateText(text) {
  if (!text || !text.trim()) return text;
  
  // MyMemory has a query length limit around 500 characters
  if (text.length > 400) {
    const sentences = text.split(/([.!?\n])/);
    let result = '';
    let currentChunk = '';
    
    for (const part of sentences) {
      if ((currentChunk + part).length > 400) {
        const translated = await translateChunk(currentChunk);
        result += translated;
        currentChunk = part;
      } else {
        currentChunk += part;
      }
    }
    if (currentChunk) {
      const translated = await translateChunk(currentChunk);
      result += translated;
    }
    return result;
  } else {
    return await translateChunk(text);
  }
}

const SPANISH_TO_ENGLISH_SEARCH = {
  'pollo': 'chicken',
  'carne': 'beef',
  'lentejas': 'lentil',
  'pescado': 'fish',
  'cerdo': 'pork',
  'pasta': 'pasta',
  'fideos': 'pasta',
  'arroz': 'rice',
  'sopa': 'soup',
  'ensalada': 'salad',
  'postre': 'dessert',
  'tarta': 'pie',
  'pastel': 'cake',
  'papas': 'potato',
  'patatas': 'potato',
  'verduras': 'vegetable',
  'vegetales': 'vegetable',
  'queso': 'cheese',
  'tomate': 'tomato',
  'huevo': 'egg',
  'huevos': 'egg',
  'pan': 'bread',
  'mariscos': 'seafood',
  'camarones': 'shrimp',
  'limon': 'lemon',
  'limón': 'lemon'
};

export async function translateSpanishToEnglish(text) {
  if (!text || !text.trim()) return text;
  const normalized = text.trim().toLowerCase();
  
  if (SPANISH_TO_ENGLISH_SEARCH[normalized]) {
    return SPANISH_TO_ENGLISH_SEARCH[normalized];
  }
  
  try {
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=es|en`;
    const res = await fetch(url);
    const data = await res.json();
    return data.responseData?.translatedText || text;
  } catch (err) {
    console.error('Spanish to English translation failed:', err);
    return text;
  }
}

export async function translateList(list) {
  if (!list || list.length === 0) return [];
  const joined = list.join('\n');
  const translated = await translateText(joined);
  const split = translated.split('\n');
  if (split.length === list.length) {
    return split.map(item => item.trim());
  } else {
    const result = [];
    for (const item of list) {
      result.push(await translateText(item));
    }
    return result;
  }
}

const UNIT_TRANSLATIONS = {
  'cups': 'tazas',
  'cup': 'taza',
  'tablespoons': 'cucharadas',
  'tablespoon': 'cucharada',
  'tbsp': 'cucharada',
  'tbsps': 'cucharadas',
  'tblsp': 'cucharada',
  'tblsps': 'cucharadas',
  'teaspoons': 'cucharaditas',
  'teaspoon': 'cucharadita',
  'tsp': 'cucharadita',
  'tsps': 'cucharaditas',
  'cloves': 'dientes',
  'clove': 'diente',
  'pinch': 'pizca',
  'pinches': 'pizcas',
  'sprinkling': 'pizca',
  'slices': 'rodajas',
  'slice': 'rodaja',
  'small': 'pequeño',
  'medium': 'mediano',
  'large': 'grande',
  'can': 'lata',
  'cans': 'latas',
  'bottle': 'botella',
  'bottles': 'botellas',
  'package': 'paquete',
  'packages': 'paquetes',
  'pack': 'paquete',
  'packs': 'paquetes',
  'whole': 'entero',
  'sprig': 'ramita',
  'sprigs': 'ramitas',
  'handful': 'puñado',
  'handfuls': 'puñados'
};

/**
 * Corrects common literal or bad translations from generic translation engines
 */
export function correctTranslation(text) {
  if (!text) return '';
  let cleaned = text;
  
  const replacements = [
    { regex: /pollo pegajoso/gi, replacement: 'Pollo Glaseado' },
    { regex: /baquetas de pollo/gi, replacement: 'patas de pollo' },
    { regex: /baqueta de pollo/gi, replacement: 'pata de pollo' },
    { regex: /baquetas/gi, replacement: 'patas de pollo' },
    { regex: /baqueta/gi, replacement: 'pata de pollo' },
    { regex: /muslos de pollo/gi, replacement: 'patas de pollo' },
    { regex: /muslo de pollo/gi, replacement: 'pata de pollo' },
    { regex: /salsa de soya/gi, replacement: 'salsa de soja' },
    { regex: /de harina/gi, replacement: 'harina' }, // Fix "de harina" from "flour"
    { regex: /mostaza de dijon/gi, replacement: 'mostaza Dijon' },
    { regex: /mostaza dijon/gi, replacement: 'mostaza Dijon' },
    { regex: /clavo de olor/gi, replacement: 'clavos de olor' },
    { regex: /clavo de ajo/gi, replacement: 'diente de ajo' },
    { regex: /clavos de ajo/gi, replacement: 'dientes de ajo' },
    { regex: /cebolla verde/gi, replacement: 'cebolla de verdeo' },
    { regex: /cebolla de verdeo/gi, replacement: 'cebolla de verdeo' }
  ];
  
  for (const item of replacements) {
    cleaned = cleaned.replace(item.regex, item.replacement);
  }
  return cleaned;
}

// Helper to parse strings like "1 1/2 kg", "250g", "1/2 tsp", "4" into { cantidad, unidad }
export function parseMeasure(measure) {
  if (!measure || !measure.trim()) {
    return { cantidad: 1, unidad: 'unidad' };
  }
  
  const trimmed = measure.trim().toLowerCase();
  
  // Regex to match integers, decimals (with dots or commas), fractions (e.g. 1/2), and mixed fractions (e.g. 1 1/2) at the start
  const numberRegex = /^(\d+\s+\d+\/\d+|\d+\/\d+|\d+[\.,]\d+|\d+)/;
  const match = trimmed.match(numberRegex);
  
  if (!match) {
    // If no leading number, assume quantity 1 and translate the entire string if mapped
    const cleanUnit = trimmed;
    return { 
      cantidad: 1, 
      unidad: UNIT_TRANSLATIONS[cleanUnit] || cleanUnit 
    };
  }
  
  const rawNum = match[1];
  let cantidad = 1;
  
  try {
    if (rawNum.includes('/')) {
      if (rawNum.includes(' ')) {
        // Mixed number, e.g. "1 1/2"
        const parts = rawNum.split(/\s+/);
        const whole = parseFloat(parts[0]);
        const fracParts = parts[1].split('/');
        cantidad = whole + parseFloat(fracParts[0]) / parseFloat(fracParts[1]);
      } else {
        // Simple fraction, e.g. "1/2"
        const parts = rawNum.split('/');
        cantidad = parseFloat(parts[0]) / parseFloat(parts[1]);
      }
    } else {
      cantidad = parseFloat(rawNum.replace(',', '.'));
    }
  } catch (err) {
    cantidad = 1;
  }
  
  let unidad = trimmed.slice(rawNum.length).trim();
  
  // Default cleanups for common units
  if (!unidad) {
    unidad = 'unidad';
  } else if (unidad === 'g' || unidad === 'gr' || unidad === 'gram' || unidad === 'grams') {
    unidad = 'g';
  } else if (unidad === 'ml' || unidad === 'millilitres' || unidad === 'milliliters') {
    unidad = 'ml';
  } else if (unidad === 'kg' || unidad === 'kilo' || unidad === 'kilos' || unidad === 'kilogram' || unidad === 'kilograms') {
    unidad = 'kg';
  } else if (UNIT_TRANSLATIONS[unidad]) {
    unidad = UNIT_TRANSLATIONS[unidad];
  }
  
  return { 
    cantidad: isNaN(cantidad) ? 1 : cantidad, 
    unidad 
  };
}

/**
 * Searches for recipes by keyword on TheMealDB
 * @param {string} query - search query
 * @returns {Promise<Array>} - list of matching recipes
 */
export async function searchExternalRecipes(query) {
  if (!query || !query.trim()) return [];
  
  const url = `https://www.themealdb.com/api/json/v1/1/search.php?s=${encodeURIComponent(query)}`;
  const res = await fetch(url);
  const data = await res.json();
  
  if (!data.meals) return [];
  
  return data.meals.map(meal => ({
    id: meal.idMeal,
    nombre: meal.strMeal,
    imagen: meal.strMealThumb,
    categoria: meal.strCategory,
    origen: meal.strArea
  }));
}

/**
 * Retrieves full details of a recipe from TheMealDB and maps it to MealCrafter format
 * @param {string} externalId - TheMealDB recipe ID
 * @returns {Promise<Object>} - mapped recipe object
 */
export async function getExternalRecipeById(externalId) {
  if (!externalId) throw new Error('ID externo requerido');
  
  const url = `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${externalId}`;
  const res = await fetch(url);
  const data = await res.json();
  
  if (!data.meals || data.meals.length === 0) {
    throw new Error('Receta externa no encontrada');
  }
  
  const meal = data.meals[0];
  const ingredients = [];
  
  // TheMealDB supports up to 20 ingredients sequentially
  for (let i = 1; i <= 20; i++) {
    const ingName = meal[`strIngredient${i}`];
    const measure = meal[`strMeasure${i}`];
    
    if (ingName && ingName.trim()) {
      const { cantidad, unidad } = parseMeasure(measure);
      ingredients.push({
        nombre: ingName.trim().toLowerCase(),
        cantidad,
        unidad
      });
    }
  }
  
  return {
    nombre: meal.strMeal,
    porciones_base: 4, // Default base portions for foreign recipes
    tipo_comida: 'almuerzo', // Default meal category
    tiempo_preparacion_min: 45, // Default average time
    instrucciones: meal.strInstructions || '',
    ingredients
  };
}
