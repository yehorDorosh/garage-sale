const jwt = require('jsonwebtoken');
const User = require('../models/user');

module.exports = async(req, res, next) => {
  const authHeader = req.get('Authorization');
  if (!authHeader) {
    const error = new Error('Not authenticated.');
    error.statusCode = 401;
    return next(error);
  }
  const token = authHeader.split(' ')[1];
  let decodedToken;
  try {
    decodedToken = jwt.verify(token, process.env.JWT_PASSWORD);
  } catch (err) {
    err.statusCode = 500;
    return next(err);
  }
  if (!decodedToken) {
    const error = new Error('Not authenticated.');
    error.statusCode = 401;
    return next(error);
  }
  const user = await User.findById(decodedToken.userId);
  if (!user) {
    const error = new Error('Not authenticated!');
    error.statusCode = 401;
    next(error);
    return;
  }
  req.userId = decodedToken.userId;
  next();
};
