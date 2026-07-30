import express from 'express';
const router = express.Router();
import { createRecipe, getRecipeById, searchRecipes, updateRecipe, deleteRecipe } from '../controllers/recipes.js';
import authMiddleware from '../middleware/authMiddleware.js';

router.use(authMiddleware);

router.get('/', searchRecipes);
router.get('/:id', getRecipeById);
router.post('/', createRecipe);
router.put('/:id', updateRecipe);
router.delete('/:id', deleteRecipe);

export default router;
