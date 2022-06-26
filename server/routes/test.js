const express = require('express');

const testController = require('../controllers/test');

const router = express.Router();

router.get('/test', testController.test);
router.post('/test-db', testController.testDB);

module.exports = router;
