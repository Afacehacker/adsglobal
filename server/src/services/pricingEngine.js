const Product = require('../models/Product');
const DeliveryPricingRule = require('../models/DeliveryPricingRule');

/**
 * Calculates delivery fees and order totals authoritatively on the server.
 * 
 * @param {Array} items - Array of { product: ObjectId/String, quantity: Number }
 * @param {Object} address - Recipient address details (country, state)
 * @param {String} deliveryMethod - 'STANDARD' or 'EXPRESS'
 * @returns {Promise<Object>} Calculated pricing breakdown
 */
const calculateOrderPricing = async (items, address, deliveryMethod = 'STANDARD') => {
  let subtotal = 0;
  let totalWeight = 0;
  let hasFragileItems = false;
  let hasRestrictedItems = false;
  const processedItems = [];

  // 1. Validate items and sum weights/subtotals
  for (const item of items) {
    const product = await Product.findById(item.product).populate('category');
    if (!product || !product.active) {
      throw new Error(`Product not found or inactive: ${item.name || item.product}`);
    }

    if (product.stock < item.quantity) {
      throw new Error(`Insufficient stock for product: ${product.name}. Available: ${product.stock}, Requested: ${item.quantity}`);
    }

    const itemWeight = product.weight_kg * item.quantity;
    const itemSubtotal = product.price_coins * item.quantity;

    subtotal += itemSubtotal;
    totalWeight += itemWeight;
    if (product.fragile) hasFragileItems = true;
    if (product.restricted) hasRestrictedItems = true;

    processedItems.push({
      product: product._id,
      name: product.name,
      sku: product.sku,
      quantity: item.quantity,
      price_coins: product.price_coins,
      weight_kg: product.weight_kg,
    });
  }

  // 2. Find matching Delivery Pricing Rule
  const country = address.country ? address.country.trim() : 'ALL';
  const state = address.state ? address.state.trim() : 'ALL';

  // Search rules in descending order of specificity:
  // Rule 1: Specific Country + Specific State + Weight Bracket match
  // Rule 2: Specific Country + 'ALL' State + Weight Bracket match
  // Rule 3: 'ALL' Country + 'ALL' State + Weight Bracket match
  
  let rule = null;

  // Try Rule 1
  rule = await DeliveryPricingRule.findOne({
    country,
    state,
    weight_min: { $lte: totalWeight },
    weight_max: { $gte: totalWeight },
    active: true
  });

  // Try Rule 2
  if (!rule) {
    rule = await DeliveryPricingRule.findOne({
      country,
      state: 'ALL',
      weight_min: { $lte: totalWeight },
      weight_max: { $gte: totalWeight },
      active: true
    });
  }

  // Try Rule 3 (fallback)
  if (!rule) {
    rule = await DeliveryPricingRule.findOne({
      country: 'ALL',
      state: 'ALL',
      weight_min: { $lte: totalWeight },
      weight_max: { $gte: totalWeight },
      active: true
    });
  }

  // If no rule matches at all, use default starting values
  const base_price = rule ? rule.base_price : 19000;
  const per_kg_price = rule ? rule.per_kg_price : 0;
  const express_fee = rule && deliveryMethod === 'EXPRESS' ? rule.express_fee : 0;
  const fragile_fee = rule && hasFragileItems ? rule.fragile_fee : 0;
  const handling_fee = rule ? rule.handling_fee : 0;

  // Calculate delivery fee
  const delivery_fee = base_price + (totalWeight * per_kg_price) + express_fee + fragile_fee;
  
  const total = subtotal + delivery_fee + handling_fee;

  return {
    success: true,
    items: processedItems,
    subtotal_coins: subtotal,
    delivery_fee_coins: delivery_fee,
    handling_fee_coins: handling_fee,
    total_coins: total,
    total_weight_kg: totalWeight,
    hasFragileItems,
    hasRestrictedItems,
    appliedRule: rule ? {
      country: rule.country,
      state: rule.state,
      id: rule._id
    } : 'DEFAULT_LOGISTICS_FALLBACK'
  };
};

module.exports = {
  calculateOrderPricing
};
