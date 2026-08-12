const express = require('express');
const router = express.Router();
const { 
  getCampaignPlatforms, getCampaignPricingRules, estimateCampaignCost, 
  createCampaign, getUserCampaigns, getCampaignDetails,
  getPublicLocationCounts, searchPublicAds, uploadCampaignMedia
} = require('../controllers/campaigns');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');

// Public routes
router.get('/public/locations', getPublicLocationCounts);
router.get('/public/search', searchPublicAds);

// Protected routes
router.get('/platforms', protect, getCampaignPlatforms);
router.get('/pricing-rules', protect, getCampaignPricingRules);
router.post('/estimate', protect, estimateCampaignCost);
router.post('/upload-creatives', protect, upload.array('files', 10), uploadCampaignMedia);
router.post('/', protect, createCampaign);
router.get('/', protect, getUserCampaigns);
router.get('/:id', protect, getCampaignDetails);

module.exports = router;
