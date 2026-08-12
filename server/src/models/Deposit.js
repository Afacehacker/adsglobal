const mongoose = require('mongoose');

const DepositSchema = new mongoose.Schema({
  deposit_id: {
    type: String,
    required: true,
    unique: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  amount_naira: {
    type: Number,
    required: true,
    min: [1, 'Amount must be at least ₦1'],
  },
  amount_coins: {
    type: Number,
    required: true,
    min: [1, 'Amount must convert to at least 1 COIN'],
  },
  sender_name: {
    type: String,
    required: [true, 'Sender name is required'],
    trim: true,
  },
  bank_used: {
    type: String,
    required: [true, 'Bank name is required'],
    trim: true,
  },
  transfer_reference: {
    type: String,
    required: [true, 'Transfer reference is required'],
    trim: true,
    unique: true,
  },
  transfer_date: {
    type: Date,
    required: [true, 'Transfer date/time is required'],
  },
  status: {
    type: String,
    enum: ['PENDING', 'APPROVED', 'REJECTED', 'CLARIFICATION_REQUESTED'],
    default: 'PENDING',
  },
  proof_image: {
    type: String, // URL of uploaded proof screenshot
  },
  rejection_reason: {
    type: String,
    trim: true,
  },
  reviewed_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  reviewed_at: {
    type: Date,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Deposit', DepositSchema);
