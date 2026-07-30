import express from 'express';
import { searchRecipes, importRecipe, getExternalRecipeDetail } from '../controllers/externalRecipesController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/search', authMiddleware, searchRecipes);
router.post('/import', authMiddleware, importRecipe);
router.get('/detail/:id', authMiddleware, getExternalRecipeDetail);

export default router;
