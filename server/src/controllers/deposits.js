const Deposit = require('../models/Deposit');
const Wallet = require('../models/Wallet');
const Notification = require('../models/Notification');

// Generate unique Deposit ID
const generateDepositId = () => {
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const rand = Math.floor(10000 + Math.random() * 90000);
  return `DEP-${date}-${rand}`;
};

// @desc    Submit deposit confirmation request
// @route   POST /api/deposits
// @access  Private
exports.createDepositRequest = async (req, res, next) => {
  try {
    const { amount_naira, sender_name, bank_used, transfer_reference, transfer_date } = req.body;

    if (!amount_naira || !sender_name || !bank_used || !transfer_reference || !transfer_date) {
      return res.status(400).json({ error: 'Please provide all required fields' });
    }

    const numericAmount = parseFloat(amount_naira);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      return res.status(400).json({ error: 'Please provide a valid deposit amount greater than 0' });
    }

    // Check for duplicate transfer reference to prevent double entry
    const existingRef = await Deposit.findOne({ transfer_reference: transfer_reference.trim() });
    if (existingRef) {
      return res.status(400).json({ error: 'A deposit request with this transaction reference has already been submitted.' });
    }

    // Get proof file URL
    let proof_image = '';
    if (req.file) {
      // Local fallback url path
      proof_image = `/uploads/${req.file.filename}`;
    }

    const deposit_id = generateDepositId();
    const coinsAmount = numericAmount; // 1 Naira = 1 Coin

    // Create Deposit Request
    const deposit = await Deposit.create({
      deposit_id,
      user: req.user._id,
      amount_naira: numericAmount,
      amount_coins: coinsAmount,
      sender_name,
      bank_used,
      transfer_reference: transfer_reference.trim(),
      transfer_date,
      proof_image,
      status: 'PENDING'
    });

    // Atomically increment pending_credits in User's Wallet
    await Wallet.findOneAndUpdate(
      { user: req.user._id },
      { $inc: { pending_credits: coinsAmount } },
      { upsert: true, new: true }
    );

    // Create Notification
    await Notification.create({
      user: req.user._id,
      title: 'Deposit Submitted',
      message: `Your deposit request of ₦${numericAmount.toLocaleString()} (${coinsAmount.toLocaleString()} COINS) has been submitted for review. ID: ${deposit_id}`,
      type: 'DEPOSIT',
      link: '/dashboard/wallet'
    });

    res.status(201).json({
      success: true,
      message: 'Deposit request submitted successfully. It is now pending admin verification.',
      deposit
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get logged-in user's deposit requests
// @route   GET /api/deposits
// @access  Private
exports.getUserDeposits = async (req, res, next) => {
  try {
    const deposits = await Deposit.find({ user: req.user._id }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      deposits
    });
  } catch (error) {
    next(error);
  }
};
