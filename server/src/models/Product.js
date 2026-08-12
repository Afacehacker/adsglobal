const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
  },
  sku: {
    type: String,
    required: [true, 'SKU is required'],
    unique: true,
    trim: true,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ProductCategory',
    required: true,
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
  },
  short_description: {
    type: String,
    trim: true,
  },
  price_coins: {
    type: Number,
    required: [true, 'Price in COINS is required'],
    min: [0, 'Price cannot be negative'],
  },
  images: {
    type: [String],
    default: [],
  },
  stock: {
    type: Number,
    required: [true, 'Stock quantity is required'],
    default: 0,
    min: [0, 'Stock cannot be negative'],
  },
  weight_kg: {
    type: Number,
    required: [true, 'Weight in kg is required'],
    default: 0.5,
    min: [0.01, 'Weight must be greater than 0'],
  },
  dimensions: {
    length_cm: { type: Number, default: 10 },
    width_cm: { type: Number, default: 10 },
    height_cm: { type: Number, default: 10 },
  },
  package_type: {
    type: String,
    default: 'box',
  },
  fragile: {
    type: Boolean,
    default: false,
  },
  restricted: {
    type: Boolean,
    default: false,
  },
  delivery_eligible: {
    type: Boolean,
    default: true,
  },
  active: {
    type: Boolean,
    default: true,
  },
  featured: {
    type: Boolean,
    default: false,
  },
  tags: {
    type: [String],
    default: [],
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Product', ProductSchema);
