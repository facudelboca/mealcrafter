import request from 'supertest';
import { describe, it, expect, beforeEach, afterAll } from 'vitest';
import app from '../app.js';
import prisma from '../prismaClient.js';

describe('Recipes API', () => {
  let authCookie;
  let userId;

  beforeEach(async () => {
    // Clear all tables in reverse order of dependency
    await prisma.mealPlanEntry.deleteMany({});
    await prisma.mealPlan.deleteMany({});
    await prisma.recipeIngredient.deleteMany({});
    await prisma.recipe.deleteMany({});
    await prisma.unitConversion.deleteMany({});
    await prisma.ingredient.deleteMany({});
    await prisma.user.deleteMany({});

    // Register a test user
    const registerRes = await request(app)
      .post('/api/auth/register')
      .send({
        email: 'test@mealcrafter.com',
        password: 'password123',
        nombre: 'Test User'
      });
    authCookie = registerRes.headers['set-cookie'];
    userId = registerRes.body.user.id;
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('POST /api/recipes', () => {
    it('should create a recipe and link existing ingredients', async () => {
      // 1. Pre-create an ingredient
      await prisma.ingredient.create({
        data: { nombre: 'papa', unidad_base: 'g' },
      });

      // 2. Create a recipe referencing existing and new ingredients
      const res = await request(app)
        .post('/api/recipes')
        .set('Cookie', authCookie)
        .send({
          nombre: 'Papas fritas',
          porciones_base: 2,
          tipo_comida: 'almuerzo',
          tiempo_preparacion_min: 30,
          instrucciones: 'Cortar y freír papas.',
          ingredients: [
            { nombre: 'papa', cantidad: 500, unidad: 'g' },
            { nombre: 'aceite', cantidad: 200, unidad: 'ml' }, // This is new
          ],
        });

      expect(res.status).toBe(201);
      expect(res.body.nombre).toBe('Papas fritas');
      expect(res.body.porciones_base).toBe(2);
      expect(res.body.ingredients.length).toBe(2);

      // Verify that 'aceite' was auto-created in the catalog
      const aceiteDb = await prisma.ingredient.findFirst({
        where: { nombre: { equals: 'aceite', mode: 'insensitive' } },
      });
      expect(aceiteDb).toBeDefined();
      expect(aceiteDb.unidad_base).toBe('ml'); // Auto-detected from ml unit
    });

    it('should return 400 if required fields are missing', async () => {
      const res = await request(app)
        .post('/api/recipes')
        .set('Cookie', authCookie)
        .send({
          nombre: 'Solo nombre',
        });
      expect(res.status).toBe(400);
    });
  });

  describe('GET /api/recipes/:id', () => {
    it('should return recipe detail with ingredients', async () => {
      const createdIng = await prisma.ingredient.create({
        data: { nombre: 'cebolla', unidad_base: 'g' },
      });

      const createdRecipe = await prisma.recipe.create({
        data: {
          nombre: 'Sopa de cebolla',
          porciones_base: 4,
          tipo_comida: 'cena',
          instrucciones: 'Hervir cebollas.',
          userId: userId, // owned by test user
          ingredients: {
            create: {
              ingredient_id: createdIng.id,
              cantidad: 300,
              unidad: 'g',
            },
          },
        },
      });

      const res = await request(app)
        .get(`/api/recipes/${createdRecipe.id}`)
        .set('Cookie', authCookie);
      expect(res.status).toBe(200);
      expect(res.body.nombre).toBe('Sopa de cebolla');
      expect(res.body.ingredients.length).toBe(1);
      expect(res.body.ingredients[0].ingredient.nombre).toBe('cebolla');
    });

    it('should return 404 for non-existent recipe', async () => {
      const res = await request(app)
        .get('/api/recipes/99999')
        .set('Cookie', authCookie);
      expect(res.status).toBe(404);
    });
  });

  describe('GET /api/recipes (Search)', () => {
    beforeEach(async () => {
      const ingPapa = await prisma.ingredient.create({
        data: { nombre: 'papa', unidad_base: 'g' },
      });
      const ingCarne = await prisma.ingredient.create({
        data: { nombre: 'carne vacuna', unidad_base: 'g' },
      });

      await prisma.recipe.create({
        data: {
          nombre: 'Puré de papas',
          porciones_base: 2,
          tipo_comida: 'almuerzo',
          instrucciones: 'Hacer puré.',
          ingredients: {
            create: { ingredient_id: ingPapa.id, cantidad: 500, unidad: 'g' },
          },
        },
      });

      await prisma.recipe.create({
        data: {
          nombre: 'Estofado de carne',
          porciones_base: 4,
          tipo_comida: 'ambos',
          instrucciones: 'Cocinar estofado.',
          ingredients: {
            create: { ingredient_id: ingCarne.id, cantidad: 1000, unidad: 'g' },
          },
        },
      });
    });

    it('should search by recipe name', async () => {
      const res = await request(app)
        .get('/api/recipes?q=puré')
        .set('Cookie', authCookie);
      expect(res.status).toBe(200);
      expect(res.body.results.length).toBe(1);
      expect(res.body.results[0].nombre).toBe('Puré de papas');
    });

    it('should search by ingredient name', async () => {
      const res = await request(app)
        .get('/api/recipes?q=carne')
        .set('Cookie', authCookie);
      expect(res.status).toBe(200);
      expect(res.body.results.length).toBe(1);
      expect(res.body.results[0].nombre).toBe('Estofado de carne');
    });

    it('should return context message when no results are found', async () => {
      const res = await request(app)
        .get('/api/recipes?q=maracuyá')
        .set('Cookie', authCookie);
      expect(res.status).toBe(200);
      expect(res.body.results).toEqual([]);
      expect(res.body.message).toContain('No se encontraron recetas');
    });
  });

  describe('PUT /api/recipes/:id', () => {
    it('should update basic fields and nested ingredients', async () => {
      const ingPapa = await prisma.ingredient.create({
        data: { nombre: 'papa', unidad_base: 'g' },
      });

      const recipe = await prisma.recipe.create({
        data: {
          nombre: 'Puré simple',
          porciones_base: 2,
          tipo_comida: 'almuerzo',
          instrucciones: 'Hacer puré.',
          userId: userId, // Owned by test user so they can edit it
          ingredients: {
            create: { ingredient_id: ingPapa.id, cantidad: 500, unidad: 'g' },
          },
        },
      });

      const res = await request(app)
        .put(`/api/recipes/${recipe.id}`)
        .set('Cookie', authCookie)
        .send({
          nombre: 'Puré premium',
          porciones_base: 3,
          ingredients: [
            { nombre: 'papa', cantidad: 750, unidad: 'g' },
            { nombre: 'manteca', cantidad: 50, unidad: 'g' }, // new ingredient
          ],
        });

      expect(res.status).toBe(200);
      expect(res.body.nombre).toBe('Puré premium');
      expect(res.body.porciones_base).toBe(3);
      expect(res.body.ingredients.length).toBe(2);

      // Verify DB updates
      const updatedRecipe = await prisma.recipe.findUnique({
        where: { id: recipe.id },
        include: { ingredients: { include: { ingredient: true } } },
      });

      expect(updatedRecipe.nombre).toBe('Puré premium');
      expect(updatedRecipe.ingredients.some(i => i.ingredient.nombre === 'manteca')).toBe(true);
    });
  });

  describe('DELETE /api/recipes/:id', () => {
    it('should delete recipe owned by current user and clear ingredients links', async () => {
      const ingPapa = await prisma.ingredient.create({
        data: { nombre: 'papa', unidad_base: 'g' },
      });

      const recipe = await prisma.recipe.create({
        data: {
          nombre: 'Puré simple',
          porciones_base: 2,
          tipo_comida: 'almuerzo',
          instrucciones: 'Hacer puré.',
          userId: userId,
          ingredients: {
            create: { ingredient_id: ingPapa.id, cantidad: 500, unidad: 'g' },
          },
        },
      });

      const res = await request(app)
        .delete(`/api/recipes/${recipe.id}`)
        .set('Cookie', authCookie);

      expect(res.status).toBe(200);
      expect(res.body.message).toContain('eliminada exitosamente');

      // Verify it is gone from DB
      const dbRecipe = await prisma.recipe.findUnique({
        where: { id: recipe.id }
      });
      expect(dbRecipe).toBeNull();
    });

    it('should return 403 when trying to delete a recipe owned by another user', async () => {
      // Register another user
      const registerRes2 = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'other@mealcrafter.com',
          password: 'password123',
          nombre: 'Other User'
        });
      const otherUserId = registerRes2.body.user.id;

      const recipe = await prisma.recipe.create({
        data: {
          nombre: 'Receta Secreta',
          porciones_base: 1,
          tipo_comida: 'almuerzo',
          instrucciones: 'Nada.',
          userId: otherUserId,
        },
      });

      const res = await request(app)
        .delete(`/api/recipes/${recipe.id}`)
        .set('Cookie', authCookie); // current test user cookies

      expect(res.status).toBe(403);
    });
  });
});
