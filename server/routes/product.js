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
], productController.createProduct);

router.delete('/products', isAuth, productController.deleteProduct);

router.post('/buyer', [
  body('email')
    .isEmail()
    .withMessage('Please enter a valid email.')
    .normalizeEmail(),
  body('name')
    .trim()
    .not()
    .isEmpty()
    .withMessage('The field Name shouldn\'t be empty.'),
  body('phone.number')
    .if(body('phone.number').notEmpty())
    .trim()
    .isMobilePhone()
    .withMessage('Invalid phone number'),
], productController.saveBuyer);

router.delete('/buyer', isAuth, productController.saveBuyer);

router.post('/sell', isAuth, productController.sell);

module.exports = router;
