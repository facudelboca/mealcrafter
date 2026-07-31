import { vi, describe, it, expect, beforeEach, afterAll } from 'vitest';
import request from 'supertest';
import app from '../app.js';
import prisma from '../prismaClient.js';

describe('External Recipes API', () => {
  let cookieHeader = '';

  beforeEach(async () => {
    // Clear DB to avoid collisions
    await prisma.recipeIngredient.deleteMany({});
    await prisma.recipe.deleteMany({});
    await prisma.unitConversion.deleteMany({});
    await prisma.ingredient.deleteMany({});
    await prisma.user.deleteMany({});

    // Register a user to get a session cookie
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        email: 'chef@mealcrafter.com',
        password: 'chefPassword123',
        nombre: 'Chef User'
      });
    cookieHeader = res.headers['set-cookie'][0].split(';')[0];
  });

  afterAll(async () => {
    await prisma.$disconnect();
    vi.restoreAllMocks();
  });

  describe('GET /api/external/search', () => {
    it('should return matching external recipes from TheMealDB', async () => {
      // Mock fetch
      const mockFetch = vi.spyOn(global, 'fetch').mockImplementation(() =>
        Promise.resolve({
          json: () => Promise.resolve({
            meals: [
              {
                idMeal: '52772',
                strMeal: 'Teriyaki Chicken Casserole',
                strMealThumb: 'https://images.com/teriyaki.jpg',
                strCategory: 'Chicken',
                strArea: 'Japanese'
              }
            ]
          })
        })
      );

      const res = await request(app)
        .get('/api/external/search?q=chicken')
        .set('Cookie', cookieHeader);

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBe(1);
      expect(res.body[0].nombre).toBe('Teriyaki Chicken Casserole');
      expect(res.body[0].id).toBe('52772');
      
      mockFetch.mockRestore();
    });

    it('should return 401 if unauthorized', async () => {
      const res = await request(app).get('/api/external/search?q=chicken');
      expect(res.status).toBe(401);
    });
  });

  describe('POST /api/external/import', () => {
    it('should import the recipe and dynamically build ingredients catalog', async () => {
      // Mock lookup fetch
      const mockFetch = vi.spyOn(global, 'fetch').mockImplementation(() =>
        Promise.resolve({
          json: () => Promise.resolve({
            meals: [
              {
                idMeal: '52772',
                strMeal: 'Teriyaki Chicken Casserole',
                strInstructions: 'Cook chicken. Mix ingredients. Bake.',
                strMealThumb: 'https://images.com/teriyaki.jpg',
                strIngredient1: 'soy sauce',
                strMeasure1: '1/2 cup',
                strIngredient2: 'chicken breast',
                strMeasure2: '1 kg',
                strIngredient3: 'salt',
                strMeasure3: '1 pinch'
              }
            ]
          })
        })
      );

      const res = await request(app)
        .post('/api/external/import')
        .set('Cookie', cookieHeader)
        .send({ externalId: '52772' });

      expect(res.status).toBe(201);
      expect(res.body.nombre).toBe('Teriyaki Chicken Casserole');
      expect(res.body.instrucciones).toBe('Cook chicken. Mix ingredients. Bake.');
      expect(res.body.ingredients.length).toBe(3);

      // Verify database entries
      const dbIngredients = await prisma.ingredient.findMany({});
      expect(dbIngredients.length).toBe(3);
      
      // Verify "chicken breast" has unit conversion for "kg"
      const chickenIng = dbIngredients.find(i => i.nombre === 'chicken breast');
      expect(chickenIng).toBeDefined();
      expect(chickenIng.unidad_base).toBe('g');

      const conversions = await prisma.unitConversion.findMany({
        where: { ingredient_id: chickenIng.id }
      });
      expect(conversions.length).toBe(1);
      expect(conversions[0].unidad_origen).toBe('kg');
      expect(conversions[0].factor_a_base.toNumber()).toBe(1000.0);

      mockFetch.mockRestore();
    });

    it('should return 401 if unauthorized', async () => {
      const res = await request(app).post('/api/external/import').send({ externalId: '52772' });
      expect(res.status).toBe(401);
    });
  });

  describe('Local Community / Public Recipes Integration', () => {
    let localPublicRecipeId = 0;

    beforeEach(async () => {
      // Create a dummy public recipe (userId: null)
      const ing = await prisma.ingredient.create({
        data: { nombre: 'dulce de leche', unidad_base: 'g' }
      });

      const recipe = await prisma.recipe.create({
        data: {
          nombre: 'Milanesa de berenjena',
          porciones_base: 2,
          tipo_comida: 'almuerzo',
          tiempo_preparacion_min: 30,
          instrucciones: 'Cortar berenjenas, pasar por huevo, empanar y hornear.',
          userId: null // Public community recipe
        }
      });

      await prisma.recipeIngredient.create({
        data: {
          recipe_id: recipe.id,
          ingredient_id: ing.id,
          cantidad: 200,
          unidad: 'g'
        }
      });

      localPublicRecipeId = recipe.id;
    });

    it('should return local public recipes when searching', async () => {
      const res = await request(app)
        .get('/api/external/search?q=berenjena')
        .set('Cookie', cookieHeader);

      expect(res.status).toBe(200);
      expect(res.body.length).toBeGreaterThanOrEqual(1);
      const localItem = res.body.find(item => item.id === `local-${localPublicRecipeId}`);
      expect(localItem).toBeDefined();
      expect(localItem.nombre).toBe('Milanesa de berenjena');
      expect(localItem.isLocal).toBe(true);
      expect(localItem.categoria).toBe('Comunidad');
    });

    it('should return recipe details for local community recipe preview', async () => {
      const res = await request(app)
        .get(`/api/external/detail/local-${localPublicRecipeId}`)
        .set('Cookie', cookieHeader);

      expect(res.status).toBe(200);
      expect(res.body.nombre).toBe('Milanesa de berenjena');
      expect(res.body.isLocal).toBe(true);
      expect(res.body.ingredients.length).toBe(1);
      expect(res.body.ingredients[0].nombre).toBe('dulce de leche');
      expect(res.body.instrucciones).toBe('Cortar berenjenas, pasar por huevo, empanar y hornear.');
    });

    it('should clone the local community recipe to user portfolio when importing', async () => {
      const res = await request(app)
        .post('/api/external/import')
        .set('Cookie', cookieHeader)
        .send({ externalId: `local-${localPublicRecipeId}` });

      expect(res.status).toBe(201);
      expect(res.body.nombre).toBe('Milanesa de berenjena');
      
      // Verify cloned recipe belongs to the chef user
      const currentUser = await prisma.user.findUnique({
        where: { email: 'chef@mealcrafter.com' }
      });

      const cloned = await prisma.recipe.findFirst({
        where: {
          nombre: 'Milanesa de berenjena',
          userId: currentUser.id
        },
        include: {
          ingredients: true
        }
      });

      expect(cloned).toBeDefined();
      expect(cloned.porciones_base).toBe(2);
      expect(cloned.ingredients.length).toBe(1);
    });
  });
});

