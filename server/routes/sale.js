const express = require('express');

const saleController = require('../controllers/sale');

const router = express.Router();

router.get('/api-sales', saleController.getSales);

module.exports = router;
