const fs = require('fs');
const path = require('path');

const sharp = require('sharp');
const { validationResult } = require('express-validator');
const mongodb = require('mongodb');

const constants = require('../utils/constants.js');

const ObjectId = mongodb.ObjectId;

const Product = require('../models/product');
const Sale = require('../models/sale');

exports.getProducts = async(req, res, next) => {
  try {
    const products = await Product.find({ owner: req.userId });

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
  const isPublished = req.body.isPublished;
  const owner = req.userId;
  const prodId = req.body.id;
  const imagesData = (req.body.imagesData && JSON.parse(req.body.imagesData)) || [];
  const images = req.files;
  const isValidId = ObjectId.isValid(prodId);
  let product, sale;
  imagesData.forEach((imgObj) => {
    if (!imgObj.alt) { imgObj.alt = title; }
  });

  // Copy data from image files to images data array
  if (images.length) {
    req.files.forEach((imgFile) => {
      const imgData = imagesData.find(img => img.name === imgFile.originalname);

      if (imgData) {
        imgData.path = '/' + imgFile.path;
        imgData.originalname = imgFile.originalname;
        imgData.filename = imgFile.filename;
      }
    });
  }
  if (!images.length && !imagesData.length) {
    const error = new Error('Validation faild.');
    error.statusCode = 422;
    error.data = [{ value: imagesData, msg: 'No file piked.', param: 'imagesData', location: 'body' }];
    next(error);
    return;
  }

  try {
    sale = await Sale.findOne({ id: owner });
    if (!sale) {
      const error = new Error('Sale does not exist');
      error.statusCode = 404;
      next(error);
      return;
    }

    if (isValidId) {
      product = await Product.findById(prodId);
    }

    // Resize uploaded images
    for await (const img of images) {
      const filePath = path.join(...constants.ROOT_DIR_ARR, img.path);
      const buffer = await sharp(img.path)
        .resize(constants.IMG_WIDTH, constants.IMG_HEIGHT, {
          withoutEnlargement: true,
        })
        .toBuffer();
      await sharp(buffer).toFile(filePath);
    }

    // Update product
    if (product) {
      if (product.owner.toString() !== owner) {
        const error = new Error('Not authorized!');
        error.statusCode = 403;
        next(error);
        return;
      }

      // Delete irrelevant images
      product.images.forEach((currImg) => {
        const imgIsExist = imagesData.find(newImg => newImg.path === currImg.path);
        if (!imgIsExist) {
          clearImage(currImg.path, next);
        }
      });

      product.title = title;
      product.description = description;
      product.price = price;
      product.images = imagesData;
      product.isPublished = isPublished;
      await product.save();

      res.status(200).json({
        message: 'Product was updated.',
        product,
      });
    } else {
      // Save new product
      product = new Product({
        title,
        description,
        price,
        images: imagesData,
        isPublished,
        owner,
        isBooked: false,
        isSold: false,
        buyer: {
          name: '',
          email: ''
        },
      });
      await product.save();

      sale.products.push(product);
      await sale.save();

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

    product.images.forEach((img) => {
      clearImage(img.path, next);
    });

    await Product.findByIdAndRemove(prodId);

    const sale = await Sale.findOne({ id: req.userId });
    sale.products.pull(prodId);
    await sale.save();

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

exports.saveBuyer = async(req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Validation faild.');
    error.statusCode = 422;
    error.data = errors.array();
    next(error);
    return;
  }

  const saleId = req.body.saleId;
  const productId = req.body.productId;
  const name = req.body.name;
  const email = req.body.email;

  try {
    const product = await Product.findById(productId);
    if (!product) {
      const error = new Error('Failed update buyer. The product doesn\'t exist.');
      error.statusCode = 404;
      next(error);
      return;
    }

    product.buyer.name = name;
    product.buyer.email = email;
    if (name && email) {
      if (product.isBooked) {
        res.status(202).json({
          message: 'Product already booked',
          buyer: null
        });
        return;
      }
      product.isBooked = true;
    } else {
      if (product.owner.toString() !== req.userId) {
        const error = new Error('Not authorized.');
        error.statusCode = 403;
        next(error);
        return;
      }
      product.isBooked = false;
    }
    await product.save();

    res.status(200).json({
      message: 'Buyer was updated.',
      buyer: {
        saleId,
        productId,
        name,
        email,
      },
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.sell = async(req, res, next) => {
  const isSold = req.body.isSold;
  const productId = req.body.productId;

  try {
    const product = await Product.findById(productId);
    if (!product) {
      const error = new Error('Failed update "is sold" status. The product doesn\'t exist.');
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

    product.isSold = isSold;
    await product.save();

    res.status(200).json({
      message: 'Product "is sold" status was updated.',
      product,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

function clearImage(filePath, next) {
  filePath = path.join(...constants.ROOT_DIR_ARR, filePath);
  fs.unlink(filePath, (err) => {
    if (err && !err.statusCode) {
      err.statusCode = 500;
      next(err);
    }
  });
};
