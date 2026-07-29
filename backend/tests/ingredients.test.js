import request from 'supertest';
import { describe, it, expect, beforeEach, afterAll } from 'vitest';
import app from '../app.js';
import prisma from '../prismaClient.js';

describe('Ingredients API', () => {
  let authCookie;

  beforeEach(async () => {
    // Clear database before each test to guarantee test isolation
    await prisma.unitConversion.deleteMany({});
    await prisma.ingredient.deleteMany({});
    await prisma.user.deleteMany({});

    // Register a test user to get a session cookie
    const registerRes = await request(app)
      .post('/api/auth/register')
      .send({
        email: 'test@mealcrafter.com',
        password: 'password123',
        nombre: 'Test User'
      });
    authCookie = registerRes.headers['set-cookie'];
  });

  afterAll(async () => {
    // Disconnect prisma client after all tests have completed
    await prisma.$disconnect();
  });

  describe('GET /api/ingredients', () => {
    it('should return an empty list when no ingredients exist', async () => {
      const res = await request(app)
        .get('/api/ingredients')
        .set('Cookie', authCookie);
      expect(res.status).toBe(200);
      expect(res.body).toEqual([]);
    });

    it('should return all ingredients with their conversions', async () => {
      await prisma.ingredient.create({
        data: {
          nombre: 'papa',
          unidad_base: 'g',
          conversions: {
            create: {
              unidad_origen: 'kg',
              factor_a_base: 1000.0,
            },
          },
        },
      });

      const res = await request(app)
        .get('/api/ingredients')
        .set('Cookie', authCookie);
      expect(res.status).toBe(200);
      expect(res.body.length).toBe(1);
      expect(res.body[0].nombre).toBe('papa');
      expect(res.body[0].conversions.length).toBe(1);
      expect(res.body[0].conversions[0].unidad_origen).toBe('kg');
    });
  });

  describe('POST /api/ingredients', () => {
    it('should create a new ingredient', async () => {
      const res = await request(app)
        .post('/api/ingredients')
        .set('Cookie', authCookie)
        .send({ nombre: 'cebolla', unidad_base: 'g' });

      expect(res.status).toBe(201);
      expect(res.body.nombre).toBe('cebolla');
      expect(res.body.unidad_base).toBe('g');

      const dbIng = await prisma.ingredient.findUnique({
        where: { id: res.body.id },
      });
      expect(dbIng).toBeDefined();
      expect(dbIng.nombre).toBe('cebolla');
    });

    it('should return 400 if required fields are missing', async () => {
      const res = await request(app)
        .post('/api/ingredients')
        .set('Cookie', authCookie)
        .send({ nombre: 'cebolla' });

      expect(res.status).toBe(400);
      expect(res.body.error).toBeDefined();
    });

    it('should return 400 if duplicate name is used (case-insensitive)', async () => {
      await prisma.ingredient.create({
        data: { nombre: 'cebolla', unidad_base: 'g' },
      });

      const res = await request(app)
        .post('/api/ingredients')
        .set('Cookie', authCookie)
        .send({ nombre: 'CEBOLLA', unidad_base: 'g' });

      expect(res.status).toBe(400);
      expect(res.body.error).toContain('already exists');
    });
  });

  describe('POST /api/ingredients/:id/conversions', () => {
    it('should add a conversion factor', async () => {
      const ing = await prisma.ingredient.create({
        data: { nombre: 'papa', unidad_base: 'g' },
      });

      const res = await request(app)
        .post(`/api/ingredients/${ing.id}/conversions`)
        .set('Cookie', authCookie)
        .send({ unidad_origen: 'kg', factor_a_base: 1000.0 });

      expect(res.status).toBe(201);
      expect(res.body.unidad_origen).toBe('kg');
      expect(parseFloat(res.body.factor_a_base)).toBe(1000.0);

      const dbConv = await prisma.unitConversion.findFirst({
        where: { ingredient_id: ing.id },
      });
      expect(dbConv).toBeDefined();
      expect(parseFloat(dbConv.factor_a_base)).toBe(1000.0);
    });

    it('should update conversion factor if it already exists', async () => {
      const ing = await prisma.ingredient.create({
        data: { nombre: 'papa', unidad_base: 'g' },
      });

      await prisma.unitConversion.create({
        data: { ingredient_id: ing.id, unidad_origen: 'kg', factor_a_base: 1000.0 },
      });

      const res = await request(app)
        .post(`/api/ingredients/${ing.id}/conversions`)
        .set('Cookie', authCookie)
        .send({ unidad_origen: 'kg', factor_a_base: 1000.5 });

      expect(res.status).toBe(201);
      expect(parseFloat(res.body.factor_a_base)).toBe(1000.5);
    });

    it('should return 400 if trying to convert to the base unit itself', async () => {
      const ing = await prisma.ingredient.create({
        data: { nombre: 'papa', unidad_base: 'g' },
      });

      const res = await request(app)
        .post(`/api/ingredients/${ing.id}/conversions`)
        .set('Cookie', authCookie)
        .send({ unidad_origen: 'g', factor_a_base: 1.0 });

      expect(res.status).toBe(400);
      expect(res.body.error).toContain('Cannot add conversion to the base unit itself');
    });
  });
});
