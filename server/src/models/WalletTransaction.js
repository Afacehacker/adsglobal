const mongoose = require('mongoose');

const WalletTransactionSchema = new mongoose.Schema({
  txn_id: {
    type: String,
    required: true,
    unique: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  type: {
    type: String,
    enum: ['DEPOSIT', 'PURCHASE', 'DELIVERY_FEE', 'AD_CAMPAIGN', 'REFUND', 'ADMIN_CREDIT', 'ADMIN_DEBIT', 'ADJUSTMENT'],
    required: true,
  },
  amount: {
    type: Number,
    required: true,
    min: [0.01, 'Amount must be greater than 0'],
  },
  balance_before: {
    type: Number,
    required: true,
  },
  balance_after: {
    type: Number,
    required: true,
  },
  reference: {
    type: String, // e.g. 'DEP-12345', 'ORD-54321', 'CAM-98765'
  },
  description: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['PENDING', 'SUCCESS', 'FAILED'],
    default: 'SUCCESS',
  },
  source: {
    type: String,
    enum: ['USER', 'ADMIN'],
    default: 'USER',
  },
  related_id: {
    type: mongoose.Schema.Types.ObjectId,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('WalletTransaction', WalletTransactionSchema);
