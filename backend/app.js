import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import 'dotenv/config';

import authRouter from './routes/authRoutes.js';
import ingredientsRouter from './routes/ingredients.js';
import recipesRouter from './routes/recipes.js';
import mealPlansRouter from './routes/mealPlans.js';
import swaggerUi from 'swagger-ui-express';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const swaggerDocument = require('./swagger.json');

const app = express();

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'MealCrafter API is running' });
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use('/api/auth', authRouter);
app.use('/api/ingredients', ingredientsRouter);
app.use('/api/recipes', recipesRouter);
app.use('/api/meal-plans', mealPlansRouter);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal Server Error', message: err.message });
});

export default app;
