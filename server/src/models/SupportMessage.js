const mongoose = require('mongoose');

const SupportMessageSchema = new mongoose.Schema({
  ticket: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SupportTicket',
    required: true,
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  sender_type: {
    type: String,
    enum: ['USER', 'ADMIN'],
    required: true,
  },
  message: {
    type: String,
    required: [true, 'Message text is required'],
    trim: true,
  },
  attachments: {
    type: [String],
    default: [],
  },
}, {
  timestamps: { createdAt: true, updatedAt: false }, // Only need created timestamp for messages
});

module.exports = mongoose.model('SupportMessage', SupportMessageSchema);
