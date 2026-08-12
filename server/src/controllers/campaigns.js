const AdPlatform = require('../models/AdPlatform');
const AdPricingRule = require('../models/AdPricingRule');
const AdCampaign = require('../models/AdCampaign');
const Wallet = require('../models/Wallet');
const WalletTransaction = require('../models/WalletTransaction');
const Notification = require('../models/Notification');

// Generate unique Campaign Number
const generateCampaignNumber = () => {
  const date = new Date().getFullYear();
  const rand = Math.floor(100000 + Math.random() * 900000);
  return `AD-${date}-${rand}`;
};

// @desc    Get active ad platforms
// @route   GET /api/campaigns/platforms
// @access  Private
exports.getCampaignPlatforms = async (req, res, next) => {
  try {
    const platforms = await AdPlatform.find({ active: true });
    res.status(200).json({ success: true, platforms });
  } catch (error) {
    next(error);
  }
};

// @desc    Get pricing rules for ad objectives
// @route   GET /api/campaigns/pricing-rules
// @access  Private
exports.getCampaignPricingRules = async (req, res, next) => {
  try {
    const rules = await AdPricingRule.find({ active: true }).populate('platform');
    res.status(200).json({ success: true, rules });
  } catch (error) {
    next(error);
  }
};

// @desc    Estimate campaign cost breakdown
// @route   POST /api/campaigns/estimate
// @access  Private
exports.estimateCampaignCost = async (req, res, next) => {
  try {
    const { platform_id, objective, platform_budget, budget_per_day, duration_days, duration_hours, creative_assistance } = req.body;

    if (!platform_id || !objective) {
      return res.status(400).json({ error: 'Platform and objective are required' });
    }

    const platform = await AdPlatform.findById(platform_id);
    if (!platform || !platform.active) {
      return res.status(404).json({ error: 'Selected ad platform is inactive or not found' });
    }

    const dailyBudget = parseFloat(budget_per_day || platform_budget || 7000);
    const minDailyBudget = 7000;

    if (isNaN(dailyBudget) || dailyBudget < minDailyBudget) {
      return res.status(400).json({
        error: 'BUDGET_TOO_LOW',
        message: `Minimum required daily ad budget is 7,000 COINS per 24 hours.`
      });
    }

    let days = parseInt(duration_days);
    if (!days && duration_hours) {
      days = Math.ceil(parseFloat(duration_hours) / 24);
    }
    if (isNaN(days) || days < 1) days = 1;
    if (days > 30) days = 30;

    const baseFee = 0;
    const creativeFee = creative_assistance ? 5000 : 0;
    const totalPlatformBudget = dailyBudget * days;
    const total = baseFee + creativeFee + totalPlatformBudget;

    res.status(200).json({
      success: true,
      management_fee_coins: baseFee,
      creative_fee_coins: creativeFee,
      budget_per_day_coins: dailyBudget,
      duration_days: days,
      platform_budget_coins: totalPlatformBudget,
      total_cost_coins: total,
      platform_name: platform.name
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Submit new ad campaign
// @route   POST /api/campaigns
// @access  Private
exports.createCampaign = async (req, res, next) => {
  try {
    const {
      name, business_name, product_service, landing_page, contact_info,
      objective, category, platform_id, duration_hours, duration_days, start_date,
      creative, target_locations, target_audience, platform_budget, budget_per_day,
      creative_assistance, compliance_declared
    } = req.body;

    // Basic Validation
    if (!name || !business_name || !product_service || !contact_info || !objective || !category || !platform_id || !creative || !compliance_declared) {
      return res.status(400).json({ error: 'Please provide all required fields, including compliance declarations' });
    }

    if (!creative.copy) {
      return res.status(400).json({ error: 'Ad creative text copy is required' });
    }

    // Fetch Platform
    const platform = await AdPlatform.findById(platform_id);
    if (!platform || !platform.active) {
      return res.status(404).json({ error: 'Selected ad platform is inactive or not found' });
    }

    // 1. Authoritative server-side pricing recalculation
    const dailyBudget = parseFloat(budget_per_day || platform_budget || 7000);
    const minDailyBudget = 7000;

    if (isNaN(dailyBudget) || dailyBudget < minDailyBudget) {
      return res.status(400).json({
        error: 'BUDGET_TOO_LOW',
        message: `Minimum required daily ad budget is 7,000 COINS per 24 hours.`
      });
    }

    let days = parseInt(duration_days);
    if (!days && duration_hours) {
      days = Math.ceil(parseFloat(duration_hours) / 24);
    }
    if (isNaN(days) || days < 1) days = 1;
    if (days > 30) days = 30;

    const baseFee = 0;
    const creativeFee = creative_assistance ? 5000 : 0;
    const totalPlatformBudget = dailyBudget * days;
    const totalCost = baseFee + creativeFee + totalPlatformBudget;
    const finalDurationHours = days * 24;

    // 3. Verify user wallet balance
    let wallet = await Wallet.findOne({ user: req.user._id });
    if (!wallet) {
      wallet = await Wallet.create({ user: req.user._id });
    }

    if (wallet.balance < totalCost) {
      const shortfall = totalCost - wallet.balance;
      return res.status(400).json({
        error: 'INSUFFICIENT_BALANCE',
        message: 'Your wallet balance is insufficient to launch this campaign.',
        required: totalCost,
        available: wallet.balance,
        shortfall
      });
    }

    // 4. Deduct balance atomically
    const updatedWallet = await Wallet.findOneAndUpdate(
      { user: req.user._id, balance: { $gte: totalCost } },
      { $inc: { balance: -totalCost } },
      { new: true }
    );

    if (!updatedWallet) {
      return res.status(400).json({ error: 'Payment processing failed. Please try again.' });
    }

    const campaign_number = generateCampaignNumber();

    try {
      // 5. Create Campaign
      const campaign = await AdCampaign.create({
        campaign_number,
        user: req.user._id,
        name,
        business_name,
        product_service,
        landing_page: landing_page || 'https://adsglobal.com',
        contact_info,
        objective,
        category,
        platform: platform._id,
        duration_hours: finalDurationHours,
        creative,
        media_files: req.body.media_files || [],
        target_locations: target_locations || [],
        target_audience: target_audience || {},
        management_fee_coins: baseFee,
        platform_budget_coins: totalPlatformBudget,
        creative_fee_coins: creativeFee,
        total_cost_coins: totalCost,
        status: 'SUBMITTED',
        compliance_declared
      });

      // 6. Write Ledger entries for ad campaign breakdown
      const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
      
      // Platform Budget Transaction
      await WalletTransaction.create({
        txn_id: `TXN-${dateStr}-${Math.floor(1000 + Math.random() * 9000)}`,
        user: req.user._id,
        type: 'AD_CAMPAIGN',
        amount: totalPlatformBudget,
        balance_before: wallet.balance,
        balance_after: wallet.balance - totalPlatformBudget,
        reference: campaign_number,
        description: `Ad Placement Budget for campaign ${campaign_number} on ${platform.name}`,
        status: 'SUCCESS',
        source: 'USER',
        related_id: campaign._id
      });

      // Creative Assist Fee Transaction (if applicable)
      if (creativeFee > 0) {
        await WalletTransaction.create({
          txn_id: `TXN-${dateStr}-${Math.floor(1000 + Math.random() * 9000)}`,
          user: req.user._id,
          type: 'AD_CAMPAIGN',
          amount: creativeFee,
          balance_before: wallet.balance - totalPlatformBudget,
          balance_after: wallet.balance - totalCost,
          reference: campaign_number,
          description: `Creative Copywriter Service Fee for campaign ${campaign_number}`,
          status: 'SUCCESS',
          source: 'USER',
          related_id: campaign._id
        });
      }

      // 7. Notification
      await Notification.create({
        user: req.user._id,
        title: 'Campaign Submitted',
        message: `Your campaign '${name}' (${campaign_number}) was submitted. ${totalCost.toLocaleString()} COINS deducted.`,
        type: 'CAMPAIGN',
        link: `/dashboard/campaigns/${campaign._id}`
      });

      return res.status(201).json({
        success: true,
        message: 'Campaign submitted for verification successfully.',
        campaign
      });
    } catch (createErr) {
      console.error('Campaign creation failed, rolling back balance:', createErr);
      // Automatic rollback refund if database creation fails
      await Wallet.findOneAndUpdate(
        { user: req.user._id },
        { $inc: { balance: totalCost } }
      );
      return res.status(400).json({
        error: createErr.message || 'Campaign creation failed. Your coins have been refunded.',
        details: createErr.errors ? Object.values(createErr.errors).map(e => e.message) : []
      });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get user campaigns history
// @route   GET /api/campaigns
// @access  Private
exports.getUserCampaigns = async (req, res, next) => {
  try {
    const campaigns = await AdCampaign.find({ user: req.user._id })
      .populate('platform')
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, campaigns });
  } catch (error) {
    next(error);
  }
};

// @desc    Get details of a campaign
// @route   GET /api/campaigns/:id
// @access  Private
exports.getCampaignDetails = async (req, res, next) => {
  try {
    const campaign = await AdCampaign.findOne({ _id: req.params.id, user: req.user._id })
      .populate('platform');

    if (!campaign) {
      return res.status(404).json({ error: 'Ad campaign not found' });
    }

    res.status(200).json({ success: true, campaign });
  } catch (error) {
    next(error);
  }
};

// @desc    Get public location counts (Country & City ads count)
// @route   GET /api/campaigns/public/locations
// @access  Public
exports.getPublicLocationCounts = async (req, res, next) => {
  try {
    // Default country counts
    const defaultCounts = [
      { country: 'United States', code: 'US', count: 77, flag: '🇺🇸' },
      { country: 'Canada', code: 'CA', count: 4, flag: '🇨🇦' },
      { country: 'Germany', code: 'DE', count: 3, flag: '🇩🇪' },
      { country: 'United Kingdom', code: 'UK', count: 12, flag: '🇬🇧' },
      { country: 'Finland', code: 'FI', count: 5, flag: '🇫🇮' },
      { country: 'Nigeria', code: 'NG', count: 18, flag: '🇳🇬' },
      { country: 'Australia', code: 'AU', count: 6, flag: '🇦🇺' },
      { country: 'France', code: 'FR', count: 4, flag: '🇫🇷' }
    ];

    // Merge database counts if available
    const dbCampaigns = await AdCampaign.find({ status: { $in: ['ACTIVE', 'SUBMITTED', 'APPROVED', 'COMPLETED'] } });
    
    // Aggregate by country
    const dbCountsMap = {};
    dbCampaigns.forEach(cam => {
      const country = (cam.target_locations && cam.target_locations[0]?.country) || 'Worldwide';
      dbCountsMap[country] = (dbCountsMap[country] || 0) + 1;
    });

    const locations = defaultCounts.map(loc => {
      const dbCount = dbCountsMap[loc.country] || 0;
      return {
        ...loc,
        count: loc.count + dbCount
      };
    });

    res.status(200).json({ success: true, locations, total_active_ads: locations.reduce((a, b) => a + b.count, 0) });
  } catch (error) {
    next(error);
  }
};

// @desc    Public search ads by location, keyword, or category
// @route   GET /api/campaigns/public/search
// @access  Public
exports.searchPublicAds = async (req, res, next) => {
  try {
    const { query, country, city, category } = req.query;

    const filter = { status: { $in: ['ACTIVE', 'SUBMITTED', 'APPROVED', 'COMPLETED'] } };

    if (category) {
      filter.objective = new RegExp(category, 'i');
    }

    const campaigns = await AdCampaign.find(filter)
      .populate('platform')
      .sort({ createdAt: -1 })
      .limit(30);

    // Client-side filtering if keyword or location passed
    let results = campaigns;
    if (query) {
      const q = query.toLowerCase();
      results = results.filter(c => 
        c.name.toLowerCase().includes(q) ||
        c.business_name.toLowerCase().includes(q) ||
        c.objective.toLowerCase().includes(q) ||
        c.product_service.toLowerCase().includes(q) ||
        (c.target_locations && c.target_locations.some(l => l.country.toLowerCase().includes(q) || (l.city && l.city.toLowerCase().includes(q))))
      );
    }

    if (country) {
      const cLower = country.toLowerCase();
      results = results.filter(c => 
        c.target_locations && c.target_locations.some(l => l.country.toLowerCase().includes(cLower))
      );
    }

    res.status(200).json({ success: true, count: results.length, campaigns: results });
  } catch (error) {
    next(error);
  }
};

// @desc    Upload creative pictures and videos (Max 200MB per file)
// @route   POST /api/campaigns/upload-creatives
// @access  Private
exports.uploadCampaignMedia = async (req, res, next) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No files were uploaded.' });
    }

    const mediaFiles = req.files.map(file => {
      const isVideo = file.mimetype.startsWith('video/');
      return {
        url: `/uploads/${file.filename}`,
        original_name: file.originalname,
        file_type: isVideo ? 'video' : 'image',
        mime_type: file.mimetype,
        size_bytes: file.size
      };
    });

    res.status(200).json({ success: true, files: mediaFiles });
  } catch (error) {
    next(error);
  }
};
