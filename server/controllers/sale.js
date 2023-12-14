const { validationResult } = require('express-validator');

const Sale = require('../models/sale');
const User = require('../models/user');
const io = require('../socket');

exports.getSales = async(req, res, next) => {
  const currentPage = req.query.page || 1;
  const perPage = 10;
  try {
    let totalItems = await Sale.find({ isPublished: true })
      .populate('products', null, {
        isPublished: true,
        isSold: false,
      });
    totalItems = totalItems ? totalItems.filter(sale => !!sale.products.length) : [];

    const sales = await Sale.find({ isPublished: true })
      .sort({ updatedAt: 'desc' })
      .skip((currentPage - 1) * perPage)
      .limit(perPage)
      .populate('products', null, {
        isPublished: true,
        isSold: false,
      })
      .populate('owner', '-password');
    const filteredSales = sales ? sales.filter(sale => !!sale.products.length) : [];

    res.status(200).json({
      message: 'Fetched sales successfully.',
      sales: filteredSales,
      totalItems: totalItems.length,
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
  if (!user) {
    const error = new Error('User not found');
    error.statusCode = 404;
    next(error);
    return;
  }

  try {
    const owner = req.userId;
    const saleIsExist = await Sale.countDocuments({ id: owner });
    let sale;
    const description = req.body.description?.trim();
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

      io.getIO().emit('sale', {
        sale,
        saleId: owner
      });

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
