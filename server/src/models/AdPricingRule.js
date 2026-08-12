const mongoose = require('mongoose');

const AdPricingRuleSchema = new mongoose.Schema({
  platform: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'AdPlatform',
    required: true,
  },
  objective: {
    type: String,
    required: true,
    trim: true,
  },
  base_management_fee_coins: {
    type: Number,
    required: true,
    default: 10000,
    min: 0,
  },
  creative_fee_coins: {
    type: Number,
    required: true,
    default: 5000,
    min: 0,
  },
  platform_spend_min_coins: {
    type: Number,
    required: true,
    default: 25000,
    min: 0,
  },
  active: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('AdPricingRule', AdPricingRuleSchema);
