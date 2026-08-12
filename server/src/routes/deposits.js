const express = require('express');
const router = express.Router();
const { createDepositRequest, getUserDeposits } = require('../controllers/deposits');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.post('/', protect, upload.single('proof_image'), createDepositRequest);
router.get('/', protect, getUserDeposits);

module.exports = router;
