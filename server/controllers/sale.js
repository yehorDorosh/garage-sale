const { validationResult } = require('express-validator');

const Sale = require('../models/sale');
const User = require('../models/user');

exports.getSales = async(req, res, next) => {
  const currentPage = req.query.page || 1;
  const perPage = 10;
  try {
    const filter = { isPublished: true, 'products.0': { $exists: true } };
    const totalItems = await Sale.find(filter).countDocuments();
    const sales = await Sale.find(filter)
      .skip((currentPage - 1) * perPage)
      .limit(perPage)
      .populate('products')
      .populate('owner', '-password');

    res.status(200).json({
      message: 'Fetched sales successfully.',
      sales: sales.map((sale) => {
        sale.products = sale.products.filter(p => p.isPublished);
        return sale;
      }),
      totalItems,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.getUserSales = async(req, res, next) => {
  try {
    const sales = await Sale.find({ owner: req.userId }).populate('products').populate('owner', '-password');

    res.status(200).json({
      message: 'Fetched user sales successfully.',
      sales,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.createSale = async(req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Validation faild.');
    error.statusCode = 422;
    error.data = errors.array();
    next(error);
    return;
  }

  const user = await User.findById(req.userId);

  try {
    const owner = req.userId;
    const saleIsExist = await Sale.countDocuments({ id: owner });
    let sale;
    const description = req.body.description;
    const isPublished = req.body.isPublished;

    if (saleIsExist === 0) {
      sale = new Sale({
        id: owner,
        description,
        isPublished,
        owner,
        products: []
      });
      await sale.save();
      user.sales.push(sale);
      await user.save();
      res.status(201).json({
        message: 'Sale created successful.',
        sale,
      });
    } else {
      sale = await Sale.findOne({ id: owner });
      sale.description = description;
      sale.isPublished = isPublished;
      sale.save();
      res.status(200).json({
        message: 'Sale successfuly updated',
        sale,
      });
    }
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
