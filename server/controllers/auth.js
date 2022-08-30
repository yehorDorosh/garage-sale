const fs = require('fs');
const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const constants = require('../utils/constants.js');

const User = require('../models/user');
const Product = require('../models/product');
const Sale = require('../models/sale');
const io = require('../socket');

exports.signup = async(req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Validation faild.');
    error.statusCode = 422;
    error.data = errors.array();
    next(error);
    return;
  }

  const name = req.body.name?.trim();
  const email = req.body.email?.trim();
  const password = req.body.password?.trim();
  const phone = req.body.phone || {};

  try {
    const hashedPassword = await bcrypt.hash(password, 12);

    const user = new User({
      name,
      email,
      phone,
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
      phone: user.phone,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.deleteUser = async(req, res, next) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      const error = new Error('User not found');
      error.statusCode = 404;
      next(error);
      return;
    }

    await Sale.deleteMany({ owner: req.userId });
    await Product.deleteMany({ owner: req.userId });
    await fs.rmSync(`${constants.IMAGE_DIR_PATH}/${req.userId}`, { recursive: true, force: true });
    await User.findByIdAndRemove(req.userId);

    io.getIO().emit('deletedUser', { userId: req.userId });

    res.status(200).json({ message: 'User was delete' });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.updUserData = async(req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Validation faild.');
    error.statusCode = 422;
    error.data = errors.array();
    next(error);
    return;
  }

  try {
    const user = await User.findById(req.userId);
    if (!user) {
      const error = new Error('User not found');
      error.statusCode = 404;
      next(error);
      return;
    }

    const newName = req.body.name?.trim();
    const newPhone = req.body.phone;

    user.name = newName;
    user.phone = newPhone;

    await user.save();
    res.status(200).json({
      message: 'User data was updated',
      user: {
        name: newName,
        phone: newPhone,
      }
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
