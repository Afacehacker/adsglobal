const mongoose = require('mongoose');

const OrderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  name: { type: String, required: true },
  sku: { type: String, required: true },
  quantity: { type: Number, required: true, min: 1 },
  price_coins: { type: Number, required: true },
  weight_kg: { type: Number, required: true },
});

const TrackingEventSchema = new mongoose.Schema({
  location: { type: String, default: 'Sorting Hub' },
  status: { type: String, required: true },
  message: { type: String, required: true },
  internal_note: { type: String },
  visible_to_customer: { type: Boolean, default: true },
  timestamp: { type: Date, default: Date.now },
});

const OrderSchema = new mongoose.Schema({
  order_number: {
    type: String,
    required: true,
    unique: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  items: [OrderItemSchema],
  delivery_address: {
    recipient_name: { type: String, required: true },
    recipient_phone: { type: String, required: true },
    recipient_email: { type: String },
    country: { type: String, required: true },
    state: { type: String, required: true },
    city: { type: String, required: true },
    zip: { type: String },
    street_address: { type: String, required: true },
    apartment: { type: String },
    landmark: { type: String },
    instructions: { type: String },
  },
  delivery_method: {
    type: String,
    enum: ['STANDARD', 'EXPRESS'],
    default: 'STANDARD',
  },
  subtotal_coins: {
    type: Number,
    required: true,
  },
  delivery_fee_coins: {
    type: Number,
    required: true,
  },
  handling_fee_coins: {
    type: Number,
    required: true,
    default: 0,
  },
  total_coins: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: [
      'PAYMENT_PENDING', 'PAID', 'PROCESSING', 'PACKED', 'READY_FOR_DISPATCH',
      'DISPATCHED', 'IN_TRANSIT', 'ARRIVED_COUNTRY', 'CUSTOMS',
      'OUT_FOR_DELIVERY', 'DELIVERED', 'DELIVERY_FAILED', 'CANCELLED', 'REFUNDED'
    ],
    default: 'PAYMENT_PENDING',
  },
  tracking_number: {
    type: String,
    required: true,
    unique: true,
  },
  tracking_events: [TrackingEventSchema],
  notes: {
    type: String,
    trim: true,
  },
  courier_info: {
    provider: { type: String },
    tracking_url: { type: String },
    reference: { type: String },
  },
  cancelled_reason: {
    type: String,
  },
  refunded_amount: {
    type: Number,
    default: 0,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Order', OrderSchema);
