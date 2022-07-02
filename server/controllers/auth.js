const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

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

  try {
    const hashedPassword = await bcrypt.hash(password, 12);

    const user = new User({
      name,
      email,
      password: hashedPassword,
    });

    const result = await user.save();

    const token = jwt.sign({
      email,
      userId: result._id
    },
    process.env.JWT_PASSWORD);

    res.status(201).json({
      message: 'Created new user',
      userId: result._id,
      token
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.login = async(req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      const error = new Error('A user with this email could not be found.');
      error.statusCode = 401;
      next(error);
      return;
    }

    const isEqual = await bcrypt.compare(password, user.password);
    if (!isEqual) {
      const error = new Error('Wrong password.');
      error.statusCode = 401;
      next(error);
      return;
    }

    const token = jwt.sign({
      email: user.email,
      userId: user._id.toString(),
    },
    process.env.JWT_PASSWORD);

    res.status(200).json({
      message: 'User successful logined',
      userId: user._id.toString(),
      token
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.userData = async(req, res, next) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      const error = new Error('User not found.');
      error.statusCode = 404;
      next(error);
      return;
    }

    res.status(200).json({
      id: user._id.toString(),
      name: user.name,
      email: user.email,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
