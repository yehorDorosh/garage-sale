const express = require('express');
const bodyParser = require('body-parser');

const testRoutes = require('./routes/test');

const app = express();

app.use(bodyParser.json());

app.use(testRoutes);

module.exports = app;
