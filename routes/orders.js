const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orders');
const orders = require('../models/orders');

router.post('/', orderController.createOrder);

module.exports = router;