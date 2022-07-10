/* eslint no-console: "off" */
const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const multer = require('multer');

const { v4: uuid } = require('uuid');

const testRoutes = require('./routes/test');
const userRoutes = require('./routes/user');
const productRoutes = require('./routes/product');

const app = express();

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './server/images');
  },
  filename: (req, file, cb) => {
    cb(null, `${uuid()}-${file.originalname}`);
  }
});

const fileFilterSetup = (req, file, cb) => {
  if (
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'image/jpeg'
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

app.use(bodyParser.json());

app.use(
  multer({ storage: fileStorage, fileFilter: fileFilterSetup }).array('images')
);
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
