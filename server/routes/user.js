const express = require('express');
const { body } = require('express-validator');

const User = require('../models/user');
const authController = require('../controllers/auth');
const isAuth = require('../middleware/is-auth');

const router = express.Router();

router.post('/signup', [
  body('email')
    .isEmail()
    .withMessage('Please enter a valid email.')
    .custom((value, { req }) => {
      return User.findOne({ email: value }).then((userDoc) => {
        if (userDoc) {
          return Promise.reject(new Error('Email adress already exist.'));
        }
      });
    })
    .normalizeEmail(),
  body('password')
    .trim()
    .isStrongPassword({ minSymbols: 0 })
    .withMessage('Password should contain at least 8 symbols. At least one char in upper case and at least 1 number.'),
  body('name')
    .trim()
    .not()
    .isEmpty()
    .withMessage('The field Name shouldn\'t be empty.'),
  body('passwordConfirmation')
    .trim()
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Password confirmation is incorrect.');
      } else {
        return true;
      }
    }),
], authController.signup);

router.post('/login', authController.login);

router.get('/data', isAuth, authController.userData);

router.delete('/delete', isAuth, authController.deleteUser);

module.exports = router;
