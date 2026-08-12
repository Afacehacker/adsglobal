const express = require('express');
const router = express.Router();
const { createOrder, getUserOrders, getOrderDetails, trackOrderByNumber } = require('../controllers/orders');
const { protect } = require('../middleware/auth');

router.post('/', protect, createOrder);
router.get('/', protect, getUserOrders);
router.get('/track/:trackingNumber', trackOrderByNumber);
router.get('/:id', protect, getOrderDetails);

module.exports = router;
