const mongoose = require('mongoose');

const AuditLogSchema = new mongoose.Schema({
  admin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  action: {
    type: String,
    required: true,
    trim: true,
  },
  affected_user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  affected_object_id: {
    type: mongoose.Schema.Types.ObjectId,
  },
  affected_object_type: {
    type: String, // e.g. 'Deposit', 'Order', 'AdCampaign', 'Product', 'DeliveryPricingRule'
  },
  prev_value: {
    type: mongoose.Schema.Types.Mixed,
  },
  new_value: {
    type: mongoose.Schema.Types.Mixed,
  },
  ip_address: {
    type: String,
  },
}, {
  timestamps: { createdAt: true, updatedAt: false }, // Only log created date
});

module.exports = mongoose.model('AuditLog', AuditLogSchema);
