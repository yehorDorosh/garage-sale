const { validationResult } = require('express-validator');
const mongodb = require('mongodb');

const ObjectId = mongodb.ObjectId;

const Product = require('../models/product');
const User = require('../models/user');

exports.getProducts = async(req, res, next) => {
  try {
    const products = await Product.find();

    res.status(200).json({
      message: 'Fetched products successfully.',
      products,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.createProduct = async(req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Validation faild.');
    error.statusCode = 422;
    error.data = errors.array();
    next(error);
    return;
  }

  const title = req.body.title;
  const description = req.body.description;
  const price = req.body.price;
  const images = req.body.images;
  const isPublished = req.body.isPublished;
  const owner = req.userId;
  const isBooked = req.body.isBooked;
  const buyer = req.body.buyer;
  const prodId = req.body.tempId;
  const isValidId = ObjectId.isValid(prodId);
  let product;

  try {
    if (isValidId) {
      product = await Product.findById(prodId);
    }

    if (product) {
      if (product.owner.toString() !== owner) {
        const error = new Error('Not authorized!');
        error.statusCode = 403;
        next(error);
        return;
      }

      product.title = title;
      product.description = description;
      product.price = price;
      product.images = images;
      product.isPublished = isPublished;
      product.isBooked = isBooked;
      product.buyer = buyer;
      await product.save();

      res.status(200).json({
        message: 'Product was updated.',
        product,
      });
    } else {
      product = new Product({
        title,
        description,
        price,
        images,
        isPublished,
        owner,
        isBooked,
        buyer,
      });

      await product.save();
      const user = await User.findById(req.userId);

      user.products.push(product);
      await user.save();

      res.status(201).json({
        message: 'Product created successful.',
        product,
      });
    }
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.deleteProduct = async(req, res, next) => {
  const prodId = req.body.prodId;
  const isValidId = ObjectId.isValid(prodId);

  if (!isValidId) {
    const error = new Error('Invalid product ID.');
    error.statusCode = 406;
    next(error);
    return;
  }

  try {
    const product = await Product.findById(prodId);

    if (!product) {
      const error = new Error('Could not find product.');
      error.statusCode = 404;
      next(error);
      return;
    }
    if (product.owner.toString() !== req.userId) {
      const error = new Error('Not authorized.');
      error.statusCode = 403;
      next(error);
      return;
    }

    await Product.findByIdAndRemove(prodId);

    const user = await User.findById(req.userId);
    user.products.pull(prodId);
    await user.save();

    res.status(200).json({
      message: 'Product was deleted.',
      prodId,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
