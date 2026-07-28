import express from 'express';
const router = express.Router();
import { getIngredients, createIngredient, addConversion } from '../controllers/ingredients.js';

router.get('/', getIngredients);
router.post('/', createIngredient);
router.post('/:id/conversions', addConversion);

export default router;
