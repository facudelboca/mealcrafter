const express = require('express');
const router = express.Router();
const ingredientsController = require('../controllers/ingredients');

router.get('/', ingredientsController.getIngredients);
router.post('/', ingredientsController.createIngredient);
router.post('/:id/conversions', ingredientsController.addConversion);

module.exports = router;
