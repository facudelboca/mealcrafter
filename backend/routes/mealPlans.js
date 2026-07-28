import express from 'express';
const router = express.Router();
import { 
  createMealPlan, 
  getMealPlanById, 
  updateMealPlanEntry, 
  getShoppingList,
  getAllMealPlans,
  cloneMealPlan,
  deleteMealPlan
} from '../controllers/mealPlans.js';

router.get('/', getAllMealPlans);
router.post('/', createMealPlan);
router.get('/:id', getMealPlanById);
router.put('/:id/entries/:entryId', updateMealPlanEntry);
router.get('/:id/shopping-list', getShoppingList);
router.post('/:id/clone', cloneMealPlan);
router.delete('/:id', deleteMealPlan);

export default router;
