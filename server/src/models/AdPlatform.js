const mongoose = require('mongoose');

const AdPlatformSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Platform name is required'],
    unique: true,
    trim: true,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  active: {
    type: Boolean,
    default: true,
  },
  prohibited_categories: {
    type: [String],
    default: ['drugs', 'weapons', 'sexual_services', 'scams', 'counterfeit'],
  },
  restricted_categories: {
    type: [String],
    default: ['alcohol', 'gambling', 'finance', 'political'],
  },
  min_age: {
    type: Number,
    default: 13,
  },
  allowed_countries: {
    type: [String],
    default: ['ALL'], // applies to all unless specified
  },
  restricted_countries: {
    type: [String],
    default: [],
  },
  creative_requirements: {
    max_size_mb: { type: Number, default: 50 },
    formats: { type: [String], default: ['jpg', 'jpeg', 'png', 'mp4'] },
    formats_display: { type: String, default: 'JPG, PNG, MP4 (max 50MB)' },
  },
  landing_page_required: {
    type: Boolean,
    default: true,
  },
  api_available: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('AdPlatform', AdPlatformSchema);
