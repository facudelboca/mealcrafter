import request from 'supertest';
import { describe, it, expect, beforeEach, afterAll } from 'vitest';
import app from '../app.js';
import prisma from '../prismaClient.js';

describe('Meal Plans API', () => {
  beforeEach(async () => {
    // Clear database in reverse order of dependencies
    await prisma.mealPlanEntry.deleteMany({});
    await prisma.mealPlan.deleteMany({});
    await prisma.recipeIngredient.deleteMany({});
    await prisma.recipe.deleteMany({});
    await prisma.unitConversion.deleteMany({});
    await prisma.ingredient.deleteMany({});
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('POST /api/meal-plans', () => {
    it('should create a meal plan and generate 14 empty entries', async () => {
      const res = await request(app)
        .post('/api/meal-plans')
        .send({
          nombre: 'Semana de prueba',
          fecha_inicio: '2026-07-27', // A Monday
        });

      expect(res.status).toBe(201);
      expect(res.body.nombre).toBe('Semana de prueba');
      expect(res.body.fecha_inicio).toContain('2026-07-27');
      expect(res.body.entries.length).toBe(14);

      // Verify all entries are initially empty
      for (const entry of res.body.entries) {
        expect(entry.recipe_id).toBeNull();
        expect(entry.comensales).toBe(0);
      }
    });

    it('should return 400 if fecha_inicio is missing', async () => {
      const res = await request(app)
        .post('/api/meal-plans')
        .send({ nombre: 'Sin fecha' });
      expect(res.status).toBe(400);
    });

    it('should return 400 if fecha_inicio format is invalid', async () => {
      const res = await request(app)
        .post('/api/meal-plans')
        .send({ fecha_inicio: 'fecha-invalida' });
      expect(res.status).toBe(400);
    });
  });

  describe('GET /api/meal-plans/:id', () => {
    it('should return the meal plan sorted by day and meal type', async () => {
      const plan = await prisma.mealPlan.create({
        data: {
          nombre: 'Semana de orden',
          fecha_inicio: new Date('2026-07-27'),
          entries: {
            create: [
              { dia: 'martes', tipo_comida: 'cena', comensales: 0 },
              { dia: 'lunes', tipo_comida: 'almuerzo', comensales: 0 },
              { dia: 'lunes', tipo_comida: 'cena', comensales: 0 },
              { dia: 'martes', tipo_comida: 'almuerzo', comensales: 0 },
            ],
          },
        },
        include: { entries: true },
      });

      const res = await request(app).get(`/api/meal-plans/${plan.id}`);
      expect(res.status).toBe(200);
      expect(res.body.entries.length).toBe(4);
      // Verify order: lunes almuerzo, lunes cena, martes almuerzo, martes cena
      expect(res.body.entries[0].dia).toBe('lunes');
      expect(res.body.entries[0].tipo_comida).toBe('almuerzo');
      expect(res.body.entries[1].dia).toBe('lunes');
      expect(res.body.entries[1].tipo_comida).toBe('cena');
      expect(res.body.entries[2].dia).toBe('martes');
      expect(res.body.entries[2].tipo_comida).toBe('almuerzo');
      expect(res.body.entries[3].dia).toBe('martes');
      expect(res.body.entries[3].tipo_comida).toBe('cena');
    });

    it('should return 404 for non-existent meal plan', async () => {
      const res = await request(app).get('/api/meal-plans/99999');
      expect(res.status).toBe(404);
    });
  });

  describe('PUT /api/meal-plans/:id/entries/:entryId', () => {
    let plan, recipe, entry;

    beforeEach(async () => {
      // 1. Create a recipe
      recipe = await prisma.recipe.create({
        data: {
          nombre: 'Milanesas',
          porciones_base: 4,
          tipo_comida: 'almuerzo',
          instrucciones: 'Fritar.',
        },
      });

      // 2. Create a meal plan with entries
      plan = await prisma.mealPlan.create({
        data: {
          nombre: 'Mi semana',
          fecha_inicio: new Date('2026-07-27'),
          entries: {
            create: [
              { dia: 'lunes', tipo_comida: 'almuerzo', comensales: 0 },
            ],
          },
        },
        include: { entries: true },
      });

      entry = plan.entries[0];
    });

    it('should assign a recipe and use recipe porciones_base as default comensales count', async () => {
      const res = await request(app)
        .put(`/api/meal-plans/${plan.id}/entries/${entry.id}`)
        .send({ recipe_id: recipe.id });

      expect(res.status).toBe(200);
      expect(res.body.recipe_id).toBe(recipe.id);
      expect(res.body.comensales).toBe(recipe.porciones_base); // Defaults to porciones_base (4)
    });

    it('should assign a recipe with custom comensales count', async () => {
      const res = await request(app)
        .put(`/api/meal-plans/${plan.id}/entries/${entry.id}`)
        .send({ recipe_id: recipe.id, comensales: 6 });

      expect(res.status).toBe(200);
      expect(res.body.recipe_id).toBe(recipe.id);
      expect(res.body.comensales).toBe(6);
    });

    it('should return 400 if comensales is invalid (<= 0)', async () => {
      const res = await request(app)
        .put(`/api/meal-plans/${plan.id}/entries/${entry.id}`)
        .send({ recipe_id: recipe.id, comensales: 0 });

      expect(res.status).toBe(400);
      expect(res.body.error).toContain('comensales must be a positive integer');
    });

    it('should return 400 if recipe does not exist', async () => {
      const res = await request(app)
        .put(`/api/meal-plans/${plan.id}/entries/${entry.id}`)
        .send({ recipe_id: 99999 });

      expect(res.status).toBe(400);
    });

    it('should allow unassigning a recipe by sending null', async () => {
      // 1. Assign first
      await prisma.mealPlanEntry.update({
        where: { id: entry.id },
        data: { recipe_id: recipe.id, comensales: 4 },
      });

      // 2. Unassign
      const res = await request(app)
        .put(`/api/meal-plans/${plan.id}/entries/${entry.id}`)
        .send({ recipe_id: null });

      expect(res.status).toBe(200);
      expect(res.body.recipe_id).toBeNull();
      expect(res.body.comensales).toBe(0);
    });
  });
});
