const mongoose = require('mongoose');

const AnnouncementSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Announcement title is required'],
    trim: true,
  },
  message: {
    type: String,
    required: [true, 'Announcement message is required'],
  },
  image: {
    type: String,
  },
  target_audience: {
    type: String,
    enum: ['ALL', 'ACTIVE_ORDERS', 'ACTIVE_CAMPAIGNS'],
    default: 'ALL',
  },
  expires_at: {
    type: Date,
  },
  priority: {
    type: String,
    enum: ['LOW', 'MEDIUM', 'HIGH'],
    default: 'LOW',
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Announcement', AnnouncementSchema);
