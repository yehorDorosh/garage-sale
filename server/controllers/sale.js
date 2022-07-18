const Sale = require('../models/sale');

exports.getSales = async(req, res, next) => {
  try {
    const sales = await Sale.find().populate('products');

    res.status(200).json({
      message: 'Fetched sales successfully.',
      sales,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
