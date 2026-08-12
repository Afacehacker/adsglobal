const Wallet = require('../models/Wallet');
const WalletTransaction = require('../models/WalletTransaction');
const AdminSetting = require('../models/AdminSetting');

// @desc    Get current wallet info
// @route   GET /api/wallet/balance
// @access  Private
exports.getWalletBalance = async (req, res, next) => {
  try {
    let wallet = await Wallet.findOne({ user: req.user._id });
    if (!wallet) {
      wallet = await Wallet.create({ user: req.user._id });
    }

    res.status(200).json({
      success: true,
      balance: wallet.balance,
      pending_credits: wallet.pending_credits
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get transaction ledger history
// @route   GET /api/wallet/transactions
// @access  Private
exports.getTransactionHistory = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const filter = { user: req.user._id };

    if (req.query.type) {
      filter.type = req.query.type;
    }
    if (req.query.status) {
      filter.status = req.query.status;
    }

    const total = await WalletTransaction.countDocuments(filter);
    const transactions = await WalletTransaction.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      page,
      pages: Math.ceil(total / limit),
      total,
      transactions
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get admin configured bank details for manual deposit
// @route   GET /api/wallet/bank-details
// @access  Private
exports.getBankDetails = async (req, res, next) => {
  try {
    const bankNameSetting = await AdminSetting.findOne({ key: 'bank_name' });
    const accNameSetting = await AdminSetting.findOne({ key: 'account_name' });
    const accNumSetting = await AdminSetting.findOne({ key: 'account_number' });
    const instructionsSetting = await AdminSetting.findOne({ key: 'deposit_instructions' });

    res.status(200).json({
      success: true,
      bankDetails: {
        bankName: bankNameSetting ? bankNameSetting.value : 'ADSGLOBAL Partner Bank',
        accountName: accNameSetting ? accNameSetting.value : 'ADSGLOBAL Services Ltd',
        accountNumber: accNumSetting ? accNumSetting.value : '1029384756',
        instructions: instructionsSetting ? instructionsSetting.value : 'Please make transfer and use your registered username in the reference field. Upload proof below.'
      }
    });
  } catch (error) {
    next(error);
  }
};
