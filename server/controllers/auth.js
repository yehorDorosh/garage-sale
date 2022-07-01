const { validationResult } = require('express-validator');

const User = require('../models/user');

exports.signup = async(req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Validation faild.');
    error.statusCode = 422;
    error.data = errors.array();
    next(error);
    return;
  }

  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;
  // const passwordConfirmation = req.body.passwordConfirmation;

  const user = new User({
    name,
    email,
    password,
  });

  try {
    const result = await user.save();
    res.status(200).json({
      message: 'Created new user',
      userId: result._id
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
