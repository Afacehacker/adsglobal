const express = require('express');
const router = express.Router();
const { getProducts, getProductDetails, getShippingEstimate } = require('../controllers/products');

router.get('/', getProducts);
router.post('/estimate', getShippingEstimate);
router.get('/:id', getProductDetails);

module.exports = router;
