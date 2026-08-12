const mongoose = require('mongoose');
const Product = require('../models/Product');
const ProductCategory = require('../models/ProductCategory');
const { calculateOrderPricing } = require('../services/pricingEngine');

// @desc    Get all products (with search & filters)
// @route   GET /api/products
// @access  Public
exports.getProducts = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 200;
    const skip = (page - 1) * limit;

    const filter = { active: true };

    // Search query (case insensitive)
    if (req.query.search) {
      filter.$or = [
        { name: { $regex: req.query.search, $options: 'i' } },
        { sku: { $regex: req.query.search, $options: 'i' } },
        { tags: { $regex: req.query.search, $options: 'i' } }
      ];
    }

    // Category filter - robust ObjectId / Slug / Name matching
    if (req.query.category) {
      const catParam = req.query.category;
      let matchedCategory = null;

      if (mongoose.Types.ObjectId.isValid(catParam)) {
        matchedCategory = await ProductCategory.findById(catParam);
      }
      if (!matchedCategory) {
        matchedCategory = await ProductCategory.findOne({
          $or: [{ slug: catParam }, { name: catParam }]
        });
      }

      if (matchedCategory) {
        filter.category = matchedCategory._id;
      } else if (mongoose.Types.ObjectId.isValid(catParam)) {
        filter.category = new mongoose.Types.ObjectId(catParam);
      }
    }

    // Featured filter
    if (req.query.featured === 'true') {
      filter.featured = true;
    }

    // Stock availability filter
    if (req.query.inStock === 'true') {
      filter.stock = { $gt: 0 };
    }

    const sortOrder = req.query.order === 'desc' ? -1 : 1; // Default 1 (cheap first)

    const total = await Product.countDocuments(filter);
    let products = await Product.find(filter)
      .populate('category')
      .sort({ price_coins: sortOrder })
      .skip(skip)
      .limit(limit);

    // If no specific category is selected ("All Categories"), ensure Fast Food & Express Meals appear FIRST before any other products
    if (!req.query.category) {
      products.sort((a, b) => {
        const isFastFoodA = a.category?.name === 'Fast Food & Express Meals' ? 1 : 0;
        const isFastFoodB = b.category?.name === 'Fast Food & Express Meals' ? 1 : 0;

        if (isFastFoodA !== isFastFoodB) {
          return isFastFoodB - isFastFoodA; // Fast food items first
        }

        // Secondary sort by price_coins (cheap ones first by default)
        return sortOrder === 1 ? a.price_coins - b.price_coins : b.price_coins - a.price_coins;
      });
    }

    res.status(200).json({
      success: true,
      page,
      pages: Math.ceil(total / limit),
      total,
      products
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get product details by ID
// @route   GET /api/products/:id
// @access  Public
exports.getProductDetails = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id).populate('category');
    if (!product || !product.active) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.status(200).json({
      success: true,
      product
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get shipping fee estimate
// @route   POST /api/products/estimate
// @access  Public
exports.getShippingEstimate = async (req, res, next) => {
  try {
    const { items, country, state, delivery_method } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Items list is required' });
    }

    if (!country || !state) {
      return res.status(400).json({ error: 'Destination country and state are required' });
    }

    const pricingBreakdown = await calculateOrderPricing(
      items,
      { country, state },
      delivery_method || 'STANDARD'
    );

    res.status(200).json(pricingBreakdown);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
