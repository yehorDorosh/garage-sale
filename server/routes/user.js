const express = require('express');
const { body } = require('express-validator');

const constants = require('../utils/constants');
const User = require('../models/user');
const authController = require('../controllers/auth');
const isAuth = require('../middleware/is-auth');

const router = express.Router();

router.post('/signup', [
  body('email')
    .isEmail()
    .withMessage('Please enter a valid email.')
    .custom((value, { req }) => {
      const domain = value.split('@')[1];
      const blackList = process.env.EMAIL_BLACK_LIST?.split(',');
      if (blackList && blackList.includes(domain)) {
        return Promise.reject(new Error(`Email with this domain (${domain}) is not allowed.`));
      }
      return User.findOne({ email: value }).then((userDoc) => {
        if (userDoc) {
          return Promise.reject(new Error('Email address already exist.'));
        }
      });
    })
    .normalizeEmail({ gmail_remove_dots: false }),
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
  body('phone.number')
    .if(body('phone.number').notEmpty())
    .trim()
    .custom((value, { req }) => {
      const regexp = constants.PHONE_VALIDATOR;
      const isValid = !!value.trim().match(regexp);
      if (!isValid) {
        throw new Error('Invalid phone number.');
      }
      return true;
    })
], authController.signup);

router.post('/login', authController.login);

router.get('/data', isAuth, authController.userData);

router.delete('/delete', isAuth, authController.deleteUser);

router.put('/update', isAuth, [
  body('name')
    .trim()
    .not()
    .isEmpty()
    .withMessage('The field Name shouldn\'t be empty.'),
  body('phone.number')
    .if(body('phone.number').notEmpty())
    .trim()
    .custom((value, { req }) => {
      const regexp = constants.PHONE_VALIDATOR;
      const isValid = !!value.trim().match(regexp);
      if (!isValid) {
        throw new Error('Invalid phone number.');
      }
      return true;
    })
], authController.updUserData);

module.exports = router;
