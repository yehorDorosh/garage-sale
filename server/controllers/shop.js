const fs = require('fs');
const path = require('path');

const sharp = require('sharp');
const { validationResult } = require('express-validator');
const mongodb = require('mongodb');

const constants = require('../utils/constants.js');

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
  const isPublished = req.body.isPublished;
  const owner = req.userId;
  const isBooked = req.body.isBooked;
  const buyer = JSON.parse(req.body.buyer) || {};
  const prodId = req.body.id;
  const imagesData = (req.body.imagesData && JSON.parse(req.body.imagesData)) || [];
  const images = req.files;
  const isValidId = ObjectId.isValid(prodId);
  let product;
  imagesData.forEach((imgObj) => {
    if (!imgObj.alt) { imgObj.alt = title; }
  });

  // Copy data from image files to images data array
  if (images.length) {
    req.files.forEach((imgFile) => {
      const imgData = imagesData.find(img => img.name === imgFile.originalname);

      if (imgData) {
        imgData.path = imgFile.path;
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
      product.isBooked = isBooked;
      product.buyer = buyer;
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

    product.images.forEach((img) => {
      clearImage(img.path, next);
    });

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

function clearImage(filePath, next) {
  filePath = path.join(...constants.ROOT_DIR_ARR, filePath);
  fs.unlink(filePath, (err) => {
    if (err && !err.statusCode) {
      err.statusCode = 500;
      next(err);
    }
  });
};
