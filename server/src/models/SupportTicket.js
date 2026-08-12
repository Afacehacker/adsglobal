const mongoose = require('mongoose');

const SupportTicketSchema = new mongoose.Schema({
  ticket_number: {
    type: String,
    required: true,
    unique: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  subject: {
    type: String,
    required: [true, 'Subject is required'],
    trim: true,
  },
  category: {
    type: String,
    enum: ['Deposit issue', 'Delivery issue', 'Order issue', 'Advertising issue', 'Wallet issue', 'Account issue', 'Other'],
    required: true,
  },
  priority: {
    type: String,
    enum: ['LOW', 'MEDIUM', 'HIGH'],
    default: 'MEDIUM',
  },
  status: {
    type: String,
    enum: ['OPEN', 'IN_PROGRESS', 'WAITING_FOR_USER', 'RESOLVED', 'CLOSED'],
    default: 'OPEN',
  },
  assigned_to: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('SupportTicket', SupportTicketSchema);
