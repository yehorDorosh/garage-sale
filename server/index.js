/* eslint no-console: "off" */
const path = require('path');
const fs = require('fs');
const https = require('https');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

const app = express();
const { loadNuxt, build } = require('nuxt');

const testRoutes = require('./routes/test');
const userRoutes = require('./routes/user');
const productRoutes = require('./routes/product');
const saleRoutes = require('./routes/sale');

const port = process.env.PORT || 3000;
const isDev = process.env.NODE_ENV !== 'prod';
const accessLogStream = fs.createWriteStream(
  path.join(__dirname, 'log', 'error.log'),
  { flags: 'a' }
);
const privateKey = fs.readFileSync(path.join(__dirname, 'ssl', 'key.pem'));
const certificate = fs.readFileSync(path.join(__dirname, 'ssl', 'cert.pem'));
const limiter = rateLimit({
  windowMs: (+process.env.RATE_LIMIT_WINDOW || 15) * 60 * 1000,
  limit: +process.env.RATE_LIMIT || 100,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
});

if (!isDev) {
  app.use(limiter);
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          'script-src': ["'self'", "'unsafe-inline'"]
        }
      },
    })
  );
}

app.use(morgan('combined', {
  stream: accessLogStream,
  skip(req, res) { return res.statusCode < 400; }
}));

app.use(bodyParser.json());

app.use('/server/images', express.static(path.join(__dirname, 'images')));
app.use('/.well-known/pki-validation', express.static(path.join(__dirname, '.well-known', 'pki-validation')));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', process.env.FULL_HOST_NAME);
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
  `${process.env.MONGO_INITDB_PROTOCOL}://${process.env.MONGO_INITDB_ROOT_USERNAME}:${process.env.MONGO_INITDB_ROOT_PASSWORD}@${process.env.MONGO_INITDB_CONNECTION}`
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
  let server;
  app.use(nuxt.render);
  if (isDev) {
    build(nuxt);
    server = app.listen(port);
  } else {
    server = https
      .createServer({ key: privateKey, cert: certificate }, app)
      .listen(port);
  }
  console.log('Server listening on localhost:' + port + '.');
  console.log('Rate limit: ' + process.env.RATE_LIMIT_WINDOW + ' minutes / ' + process.env.RATE_LIMIT + ' requests.');

  const io = require('./socket').init(server);
  io.on('connection', (socket) => {
    // console.log('Client connected');
  });
}
