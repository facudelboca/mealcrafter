import request from 'supertest';
import { describe, it, expect, beforeEach, afterAll } from 'vitest';
import app from '../app.js';
import prisma from '../prismaClient.js';
import { calculateShoppingListFromEntries } from '../services/shoppingList.js';

describe('Shopping List Service & API', () => {
  // Pure unit tests for the calculation function
  describe('calculateShoppingListFromEntries (Unit Tests)', () => {
    it('should scale quantities correctly based on comensales and porciones_base', () => {
      // Recipe has 4 porciones_base, entry has 6 comensales (scale factor = 1.5)
      const mockEntries = [
        {
          comensales: 6,
          recipe: {
            nombre: 'Puré',
            porciones_base: 4,
            ingredients: [
              {
                cantidad: 500.0,
                unidad: 'g',
                ingredient: {
                  id: 1,
                  nombre: 'papa',
                  unidad_base: 'g',
                  conversions: [],
                },
              },
            ],
          },
        },
      ];

      const list = calculateShoppingListFromEntries(mockEntries);
      expect(list.items.length).toBe(1);
      expect(list.items[0].ingredient).toBe('papa');
      expect(list.items[0].cantidad).toBe(750.0); // 500 * 1.5 = 750
      expect(list.items[0].unidad).toBe('g');
      expect(list.no_convertibles.length).toBe(0);
    });

    it('should sum convertible ingredients into a single line', () => {
      // Ingredient 'papa' has base unit 'g'
      // Recipe 1 uses 500g (direct base unit match)
      // Recipe 2 uses 1.5kg (with a conversion factor: 1 kg = 1000g)
      // both entries have comensales matching porciones_base (scale factor = 1.0)
      const mockEntries = [
        {
          comensales: 4,
          recipe: {
            nombre: 'Puré',
            porciones_base: 4,
            ingredients: [
              {
                cantidad: 500.0,
                unidad: 'g',
                ingredient: {
                  id: 1,
                  nombre: 'papa',
                  unidad_base: 'g',
                  conversions: [
                    { unidad_origen: 'kg', factor_a_base: 1000.0 },
                  ],
                },
              },
            ],
          },
        },
        {
          comensales: 2,
          recipe: {
            nombre: 'Papas al horno',
            porciones_base: 2,
            ingredients: [
              {
                cantidad: 1.5,
                unidad: 'kg',
                ingredient: {
                  id: 1,
                  nombre: 'papa',
                  unidad_base: 'g',
                  conversions: [
                    { unidad_origen: 'kg', factor_a_base: 1000.0 },
                  ],
                },
              },
            ],
          },
        },
      ];

      const list = calculateShoppingListFromEntries(mockEntries);
      expect(list.items.length).toBe(1);
      expect(list.items[0].ingredient).toBe('papa');
      expect(list.items[0].cantidad).toBe(2000.0); // 500g + (1.5kg * 1000) = 2000g
      expect(list.items[0].unidad).toBe('g');
      expect(list.no_convertibles.length).toBe(0);
    });

    it('should place ingredients without matching conversions into no_convertibles', () => {
      // Ingredient 'sal' has base unit 'g'
      // Recipe 1 uses 5g (direct base unit match)
      // Recipe 2 uses 2 pizca (no conversion factor defined)
      const mockEntries = [
        {
          comensales: 4,
          recipe: {
            nombre: 'Fideos',
            porciones_base: 4,
            ingredients: [
              {
                cantidad: 5.0,
                unidad: 'g',
                ingredient: {
                  id: 2,
                  nombre: 'sal',
                  unidad_base: 'g',
                  conversions: [],
                },
              },
            ],
          },
        },
        {
          comensales: 2,
          recipe: {
            nombre: 'Huevo frito',
            porciones_base: 2,
            ingredients: [
              {
                cantidad: 2.0,
                unidad: 'pizca',
                ingredient: {
                  id: 2,
                  nombre: 'sal',
                  unidad_base: 'g',
                  conversions: [],
                },
              },
            ],
          },
        },
      ];

      const list = calculateShoppingListFromEntries(mockEntries);
      // 'g' amount goes to items
      expect(list.items.length).toBe(1);
      expect(list.items[0].ingredient).toBe('sal');
      expect(list.items[0].cantidad).toBe(5.0);
      expect(list.items[0].unidad).toBe('g');

      // 'pizca' amount goes to no_convertibles
      expect(list.no_convertibles.length).toBe(1);
      expect(list.no_convertibles[0].ingredient).toBe('sal');
      expect(list.no_convertibles[0].cantidad).toBe(2.0);
      expect(list.no_convertibles[0].unidad).toBe('pizca');
    });
  });

  // Integration tests using DB and HTTP endpoint
  describe('GET /api/meal-plans/:id/shopping-list (Integration & Performance)', () => {
    beforeEach(async () => {
      // Clear database
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

    it('should generate shopping list from DB entries and respond quickly', async () => {
      // 1. Create ingredients and conversions in DB
      const ingPapa = await prisma.ingredient.create({
        data: { nombre: 'papa', unidad_base: 'g' },
      });
      await prisma.unitConversion.create({
        data: { ingredient_id: ingPapa.id, unidad_origen: 'kg', factor_a_base: 1000.0 },
      });

      const ingCarne = await prisma.ingredient.create({
        data: { nombre: 'carne vacuna', unidad_base: 'g' },
      });

      // 2. Create recipes
      const recipePure = await prisma.recipe.create({
        data: {
          nombre: 'Puré',
          porciones_base: 4,
          tipo_comida: 'almuerzo',
          instrucciones: 'Hacer puré.',
          ingredients: {
            create: [
              { ingredient_id: ingPapa.id, cantidad: 1.0, unidad: 'kg' },
            ],
          },
        },
      });

      const recipeBife = await prisma.recipe.create({
        data: {
          nombre: 'Bife',
          porciones_base: 2,
          tipo_comida: 'cena',
          instrucciones: 'Cocinar bife.',
          ingredients: {
            create: [
              { ingredient_id: ingCarne.id, cantidad: 400, unidad: 'g' },
              { ingredient_id: ingPapa.id, cantidad: 150, unidad: 'g' }, // shared papa
            ],
          },
        },
      });

      // 3. Create a complete meal plan with 14 entries
      // To perform a realistic performance test, let's load all 14 entries
      const days = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo'];
      const meals = ['almuerzo', 'cena'];
      const entriesData = [];

      for (const dia of days) {
        for (const tipo_comida of meals) {
          // Assign Puré to almuerzos and Bife to cenas
          const isAlmuerzo = tipo_comida === 'almuerzo';
          entriesData.push({
            dia,
            tipo_comida,
            recipe_id: isAlmuerzo ? recipePure.id : recipeBife.id,
            comensales: isAlmuerzo ? 6 : 2, // scale pure by 1.5, bife by 1.0
          });
        }
      }

      const plan = await prisma.mealPlan.create({
        data: {
          nombre: 'Semana completa',
          fecha_inicio: new Date('2026-07-27'),
          entries: {
            create: entriesData,
          },
        },
      });

      // 4. Measure response time (performance check)
      const startTime = performance.now();
      
      const res = await request(app).get(`/api/meal-plans/${plan.id}/shopping-list`);
      
      const endTime = performance.now();
      const durationMs = endTime - startTime;

      expect(res.status).toBe(200);
      expect(res.body.items).toBeDefined();
      expect(res.body.no_convertibles).toBeDefined();

      console.log(`Shopping list endpoint response time for 14 entries: ${durationMs.toFixed(2)}ms`);
      // Performance check (Requirement 3.1, criterion of performance: response under 2 seconds)
      expect(durationMs).toBeLessThan(2000.0);

      // Verify the math:
      // - 7 almuerzos of Puré (recipePure, base: 4, comensales: 6, scale: 1.5)
      //   -> 1kg (1000g) of papa per almuerzo -> 1000g * 1.5 * 7 = 10500g
      // - 7 cenas of Bife (recipeBife, base: 2, comensales: 2, scale: 1.0)
      //   -> 150g of papa per cena -> 150g * 1.0 * 7 = 1050g
      //   -> 400g of carne vacuna per cena -> 400g * 1.0 * 7 = 2800g
      // - Total Papa: 10500 + 1050 = 11550g
      // - Total Carne: 2800g

      const itemPapa = res.body.items.find(i => i.ingredient === 'papa');
      const itemCarne = res.body.items.find(i => i.ingredient === 'carne vacuna');

      expect(itemPapa).toBeDefined();
      expect(itemPapa.cantidad).toBe(11550);
      expect(itemPapa.unidad).toBe('g');

      expect(itemCarne).toBeDefined();
      expect(itemCarne.cantidad).toBe(2800);
      expect(itemCarne.unidad).toBe('g');
    });
  });
});
