/* eslint no-console: "off" */
const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const testRoutes = require('./routes/test');
const userRoutes = require('./routes/user');
const productRoutes = require('./routes/product');
const saleRoutes = require('./routes/sale');

const app = express();

app.use(bodyParser.json());

app.use('/server/images', express.static(path.join(__dirname, 'images')));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', `${process.env.PROTOCOL}://${process.env.HOST_NAME}`);
  res.setHeader(
    'Access-Control-Allow-Methods',
    'OPTIONS, GET, POST, PUT, PATCH, DELETE'
  );
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

app.use(testRoutes);
app.use('/user', userRoutes);
app.use(productRoutes);
app.use(saleRoutes);

app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({ message, data });
});

mongoose.connect(
  `mongodb://${process.env.MONGO_INITDB_ROOT_USERNAME}:${process.env.MONGO_INITDB_ROOT_PASSWORD}@mongodb:27017/garage-sale?authSource=admin`
)
  .then(() => {
    console.log('Connect to DB!!!');
  })
  .catch((err) => {
    console.log(err);
  });

module.exports = app;
