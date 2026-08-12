const mongoose = require('mongoose');

const DeliveryPricingRuleSchema = new mongoose.Schema({
  country: {
    type: String,
    required: true,
    trim: true,
    default: 'ALL', // fallback/default rule
  },
  state: {
    type: String,
    trim: true,
    default: 'ALL', // rule applies to all states unless matched specifically
  },
  weight_min: {
    type: Number,
    required: true,
    default: 0,
    min: 0,
  },
  weight_max: {
    type: Number,
    required: true,
    default: 9999, // practically unlimited
    min: 0,
  },
  base_price: {
    type: Number,
    required: true,
    default: 19000, // 19,000 COINS minimum starting price
    min: 0,
  },
  per_kg_price: {
    type: Number,
    default: 0,
    min: 0,
  },
  express_fee: {
    type: Number,
    default: 0,
    min: 0,
  },
  fragile_fee: {
    type: Number,
    default: 0,
    min: 0,
  },
  handling_fee: {
    type: Number,
    default: 0,
    min: 0,
  },
  active: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('DeliveryPricingRule', DeliveryPricingRuleSchema);
