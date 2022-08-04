/* eslint no-console: "off" */
const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
const { loadNuxt, build } = require('nuxt');

const testRoutes = require('./routes/test');
const userRoutes = require('./routes/user');
const productRoutes = require('./routes/product');
const saleRoutes = require('./routes/sale');

const port = process.env.PORT || 3000;
const isDev = process.env.NODE_ENV !== 'prod';

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
    start();
  })
  .catch((err) => {
    console.log(err);
  });

module.exports = app;

async function start() {
  const nuxt = await loadNuxt(isDev ? 'dev' : 'start');
  app.use(nuxt.render);
  if (isDev) {
    build(nuxt);
  }
  const server = app.listen(port);
  console.log('Server listening on localhost:' + port + '.');

  const io = require('./socket').init(server);
  io.on('connection', (socket) => {
    // console.log('Client connected');
  });
}
