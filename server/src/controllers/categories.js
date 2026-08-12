const ProductCategory = require('../models/ProductCategory');

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
exports.getCategories = async (req, res, next) => {
  try {
    const rawCategories = await ProductCategory.find({ active: true });
    
    // Requested priority order: Fast Food, Family Gifts, Tech, Jewelry, Perfumes...
    const priorityOrder = [
      'Fast Food & Express Meals',
      'Family Gift Boxes',
      'Electronics & Tech',
      'Jewelry & Fine Accessories',
      'Perfumes & Luxury Fragrances',
      'Beauty & Fashion',
      'Food & Groceries',
      'Home & Living',
      'Automotive & Vehicles'
    ];

    const sortedCategories = rawCategories.sort((a, b) => {
      let idxA = priorityOrder.indexOf(a.name);
      let idxB = priorityOrder.indexOf(b.name);
      if (idxA === -1) idxA = 999;
      if (idxB === -1) idxB = 999;
      return idxA - idxB;
    });

    res.status(200).json({ success: true, categories: sortedCategories });
  } catch (error) {
    next(error);
  }
};
