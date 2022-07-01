const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const testRoutes = require('./routes/test');

const app = express();

app.use(bodyParser.json());

app.use(testRoutes);

module.exports = app;

/* eslint no-console: "off" */
mongoose.connect(
  `mongodb://${process.env.MONGO_INITDB_ROOT_USERNAME}:${process.env.MONGO_INITDB_ROOT_PASSWORD}@mongodb:27017/garage-sale?authSource=admin`
)
  .then(() => {
    console.log('Connect to DB!!!');
  })
  .catch((err) => {
    console.log(err);
  });
