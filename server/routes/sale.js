const express = require('express');
const { body } = require('express-validator');

const isAuth = require('../middleware/is-auth');
const saleController = require('../controllers/sale');

const router = express.Router();

router.get('/api-sales', saleController.getSales);

router.get('/api-user-sales', isAuth, saleController.getUserSales);

router.post('/api-sales', isAuth, [
  body('description')
    .trim()
    .not()
    .isEmpty()
    .withMessage('The field Title shouldn\'t be empty.'),
], saleController.createSale);

module.exports = router;
