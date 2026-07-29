import request from 'supertest';
import { describe, it, expect, beforeEach, afterAll } from 'vitest';
import app from '../app.js';
import prisma from '../prismaClient.js';

describe('Auth API', () => {
  beforeEach(async () => {
    // Clear user table before each test to maintain test isolation
    await prisma.user.deleteMany({});
  });

  afterAll(async () => {
    // Disconnect prisma client after all tests have completed
    await prisma.$disconnect();
  });

  describe('POST /api/auth/register', () => {
    it('should register a new user successfully and set a session cookie', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'test@mealcrafter.com',
          password: 'securePassword123',
          nombre: 'Test User'
        });

      expect(res.status).toBe(201);
      expect(res.body.message).toBe('Usuario registrado exitosamente');
      expect(res.body.user.email).toBe('test@mealcrafter.com');
      expect(res.body.user.nombre).toBe('Test User');
      expect(res.body.user.password).toBeUndefined(); // Password must not be sent back
      expect(res.headers['set-cookie']).toBeDefined();
      expect(res.headers['set-cookie'][0]).toContain('auth_token');
    });

    it('should return 400 if email or password is empty', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          nombre: 'No Email User'
        });

      expect(res.status).toBe(400);
      expect(res.body.error).toContain('Email y contraseña son requeridos');
    });

    it('should return 400 if user tries to register an already registered email', async () => {
      // Create a user first
      await request(app)
        .post('/api/auth/register')
        .send({
          email: 'duplicate@mealcrafter.com',
          password: 'password123',
          nombre: 'Original'
        });

      // Try registering again
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'duplicate@mealcrafter.com',
          password: 'password999',
          nombre: 'Duplicate'
        });

      expect(res.status).toBe(400);
      expect(res.body.error).toContain('El email ya se encuentra registrado');
    });
  });

  describe('POST /api/auth/login', () => {
    beforeEach(async () => {
      // Seed a user for login tests
      await request(app)
        .post('/api/auth/register')
        .send({
          email: 'login@mealcrafter.com',
          password: 'correctPassword',
          nombre: 'User Login'
        });
    });

    it('should login successfully with valid credentials and set session cookie', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'login@mealcrafter.com',
          password: 'correctPassword'
        });

      expect(res.status).toBe(200);
      expect(res.body.message).toBe('Inicio de sesión exitoso');
      expect(res.body.user.email).toBe('login@mealcrafter.com');
      expect(res.headers['set-cookie']).toBeDefined();
      expect(res.headers['set-cookie'][0]).toContain('auth_token');
    });

    it('should return 401 for wrong password', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'login@mealcrafter.com',
          password: 'wrongPassword'
        });

      expect(res.status).toBe(401);
      expect(res.body.error).toContain('Credenciales inválidas');
    });

    it('should return 401 for non-existent email', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'notfound@mealcrafter.com',
          password: 'correctPassword'
        });

      expect(res.status).toBe(401);
      expect(res.body.error).toContain('Credenciales inválidas');
    });
  });

  describe('POST /api/auth/logout', () => {
    it('should clear session cookie', async () => {
      const res = await request(app)
        .post('/api/auth/logout');

      expect(res.status).toBe(200);
      expect(res.body.message).toBe('Sesión cerrada exitosamente');
      expect(res.headers['set-cookie']).toBeDefined();
      expect(res.headers['set-cookie'][0]).toContain('auth_token=;'); // Cookie cleared
    });
  });

  describe('GET /api/auth/me', () => {
    it('should return user profile if session cookie is valid', async () => {
      // Register user and get session cookie
      const registerRes = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'me@mealcrafter.com',
          password: 'mySecretPassword',
          nombre: 'John Doe'
        });

      const cookie = registerRes.headers['set-cookie'];

      // Fetch profile
      const res = await request(app)
        .get('/api/auth/me')
        .set('Cookie', cookie);

      expect(res.status).toBe(200);
      expect(res.body.user.email).toBe('me@mealcrafter.com');
      expect(res.body.user.nombre).toBe('John Doe');
    });

    it('should return 401 if request lacks session cookie', async () => {
      const res = await request(app)
        .get('/api/auth/me');

      expect(res.status).toBe(401);
      expect(res.body.error).toContain('No autorizado');
    });
  });
});
