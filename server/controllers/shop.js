const { validationResult } = require('express-validator');

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

  const product = new Product({
    title,
    description,
    price,
    images,
    isPublished,
    owner,
    isBooked,
    buyer,
  });

  try {
    await product.save();
    const user = await User.findById(req.userId);

    user.products.push(product);
    await user.save();

    res.status(201).json({
      message: 'Product created successful.',
      product,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
