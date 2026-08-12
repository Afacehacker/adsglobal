const mongoose = require('mongoose');

const DeliveryAddressSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  recipient_name: {
    type: String,
    required: [true, 'Recipient name is required'],
    trim: true,
  },
  recipient_phone: {
    type: String,
    required: [true, 'Recipient phone is required'],
    trim: true,
  },
  recipient_email: {
    type: String,
    trim: true,
  },
  country: {
    type: String,
    required: [true, 'Country is required'],
    trim: true,
  },
  state: {
    type: String,
    required: [true, 'State/Province/Region is required'],
    trim: true,
  },
  city: {
    type: String,
    required: [true, 'City is required'],
    trim: true,
  },
  zip: {
    type: String,
    trim: true,
  },
  street_address: {
    type: String,
    required: [true, 'Street address is required'],
    trim: true,
  },
  apartment: {
    type: String,
    trim: true,
  },
  landmark: {
    type: String,
    trim: true,
  },
  instructions: {
    type: String,
    trim: true,
  },
  isDefault: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('DeliveryAddress', DeliveryAddressSchema);
