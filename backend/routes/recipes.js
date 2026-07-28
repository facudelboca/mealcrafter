import express from 'express';
const router = express.Router();
import { createRecipe, getRecipeById, searchRecipes, updateRecipe } from '../controllers/recipes.js';

router.get('/', searchRecipes);
router.get('/:id', getRecipeById);
router.post('/', createRecipe);
router.put('/:id', updateRecipe);

export default router;
