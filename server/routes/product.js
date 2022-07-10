const express = require('express');
const { body } = require('express-validator');

const shopController = require('../controllers/shop');
const isAuth = require('../middleware/is-auth');

const router = express.Router();

router.get('/products', isAuth, shopController.getProducts);

router.post('/products', isAuth, [
  body('title')
    .trim()
    .not()
    .isEmpty()
    .withMessage('The field Title shouldn\'t be empty.'),
  body('description')
    .trim()
    .not()
    .isEmpty()
    .withMessage('The field Description shouldn\'t be empty.'),
  body('price')
    .trim()
    .not()
    .isEmpty()
    .withMessage('The field Price shouldn\'t be empty.'),
  // body('images')
  //   .isArray({ min: 1, max: 10 })
  //   .withMessage('The product must have at least one image, but no more than 10.'),
], shopController.createProduct);

router.delete('/products', isAuth, shopController.deleteProduct);

module.exports = router;
