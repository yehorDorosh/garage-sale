const express = require('express');
const { body } = require('express-validator');

const isAuth = require('../middleware/is-auth');
const imgUploader = require('../middleware/img-uploader');
const productController = require('../controllers/product');

const router = express.Router();

router.get('/products', isAuth, productController.getProducts);

router.post('/products', isAuth, imgUploader, [
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
  // body('imagesData')
  //   .isArray({ min: 1, max: 10 })
  //   .withMessage('The product must have at least one image, but no more than 10.'),
], productController.createProduct);

router.delete('/products', isAuth, productController.deleteProduct);

module.exports = router;
