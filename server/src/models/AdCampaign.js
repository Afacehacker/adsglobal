const mongoose = require('mongoose');

const AdCampaignSchema = new mongoose.Schema({
  campaign_number: {
    type: String,
    required: true,
    unique: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  name: {
    type: String,
    required: [true, 'Campaign name is required'],
    trim: true,
  },
  business_name: {
    type: String,
    required: [true, 'Business/Brand name is required'],
    trim: true,
  },
  product_service: {
    type: String,
    required: [true, 'Product/Service details are required'],
    trim: true,
  },
  landing_page: {
    type: String,
    required: [true, 'Landing page URL is required'],
    trim: true,
  },
  contact_info: {
    type: String,
    required: [true, 'Contact details are required'],
    trim: true,
  },
  objective: {
    type: String,
    required: [true, 'Campaign objective is required'],
    trim: true,
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    trim: true,
  },
  platform: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'AdPlatform',
    required: true,
  },
  duration_hours: {
    type: Number,
    required: true,
    min: [24, 'Minimum duration is 24 hours'],
  },
  start_date: {
    type: Date,
    required: true,
    default: Date.now,
  },
  creative: {
    headline: { type: String, trim: true },
    description: { type: String, trim: true },
    copy: { type: String, required: true },
    destination_url: { type: String, required: true },
    cta: { type: String, default: 'Learn More' },
    images: { type: [String], default: [] },
    video: { type: String },
  },
  media_files: [{
    url: { type: String, required: true },
    original_name: { type: String },
    file_type: { type: String, enum: ['image', 'video'], default: 'image' },
    mime_type: { type: String },
    size_bytes: { type: Number }
  }],
  target_locations: [{
    country: { type: String, required: true },
    state: { type: String },
    city: { type: String },
  }],
  target_audience: {
    age_min: { type: Number, default: 18 },
    age_max: { type: Number, default: 65 },
    genders: { type: [String], default: ['All'] },
    interests: { type: [String], default: [] },
    languages: { type: [String], default: ['English'] },
    description: { type: String },
  },
  management_fee_coins: {
    type: Number,
    required: true,
    min: 0,
  },
  platform_budget_coins: {
    type: Number,
    required: true,
    min: 0,
  },
  creative_fee_coins: {
    type: Number,
    required: true,
    default: 0,
    min: 0,
  },
  total_cost_coins: {
    type: Number,
    required: true,
    min: 0,
  },
  status: {
    type: String,
    enum: [
      'DRAFT', 'SUBMITTED', 'UNDER_REVIEW', 'NEEDS_CHANGES', 'APPROVED',
      'REJECTED', 'PAYMENT_PENDING', 'SCHEDULED', 'ACTIVE', 'PAUSED',
      'COMPLETED', 'CANCELLED'
    ],
    default: 'SUBMITTED',
  },
  external_campaign_id: {
    type: String, // external system ID pasted by admin
  },
  posting_url: {
    type: String, // execution url pasted by admin
  },
  execution_notes: {
    type: String,
  },
  compliance_declared: {
    type: Boolean,
    required: [true, 'Compliance declaration is required'],
    default: false,
  },
  moderation_notes: {
    type: String,
  },
  impressions_views: {
    type: Number,
    default: 0,
    min: 0,
  },
  clicks: {
    type: Number,
    default: 0,
    min: 0,
  },
  refund_id: {
    type: mongoose.Schema.Types.ObjectId,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('AdCampaign', AdCampaignSchema);
