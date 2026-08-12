const express = require('express');
const router = express.Router();
const { getWalletBalance, getTransactionHistory, getBankDetails } = require('../controllers/wallet');
const { protect } = require('../middleware/auth');

router.get('/balance', protect, getWalletBalance);
router.get('/transactions', protect, getTransactionHistory);
router.get('/bank-details', protect, getBankDetails);

module.exports = router;
