const mongoose = require('mongoose');

const RefundSchema = new mongoose.Schema({
  refund_id: {
    type: String,
    required: true,
    unique: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  related_type: {
    type: String,
    enum: ['ORDER', 'CAMPAIGN'],
    required: true,
  },
  related_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  amount_coins: {
    type: Number,
    required: true,
    min: 0,
  },
  service_fee_retained_coins: {
    type: Number,
    default: 0,
    min: 0,
  },
  status: {
    type: String,
    enum: ['PENDING', 'COMPLETED'],
    default: 'COMPLETED', // default to completed as transactions deduct balance immediately
  },
  reason: {
    type: String,
    required: [true, 'Refund reason is required'],
    trim: true,
  },
  processed_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  processed_at: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Refund', RefundSchema);
