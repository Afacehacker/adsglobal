const Order = require('../models/Order');
const Product = require('../models/Product');
const Wallet = require('../models/Wallet');
const WalletTransaction = require('../models/WalletTransaction');
const Notification = require('../models/Notification');
const { calculateOrderPricing } = require('../services/pricingEngine');

// Generate unique tracking number and order number
const generateOrderNumbers = () => {
  const date = new Date().getFullYear();
  const rand1 = Math.floor(100000 + Math.random() * 900000);
  const rand2 = Math.floor(100000 + Math.random() * 900000);
  return {
    orderNumber: `GLB-${date}-${rand1}`,
    trackingNumber: `TRK-${date}-${rand2}`
  };
};

// @desc    Create new delivery order (Checkout)
// @route   POST /api/orders
// @access  Private
exports.createOrder = async (req, res, next) => {
  try {
    const { items, delivery_address, delivery_method, notes } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Cart items are required for checkout' });
    }

    if (!delivery_address || !delivery_address.recipient_name || !delivery_address.recipient_phone || !delivery_address.country || !delivery_address.state || !delivery_address.city || !delivery_address.street_address) {
      return res.status(400).json({ error: 'Please provide all required delivery address fields' });
    }

    // 1. Authoritatively calculate total costs on the server
    let pricingBreakdown;
    try {
      pricingBreakdown = await calculateOrderPricing(items, delivery_address, deliveryMethod = delivery_method || 'STANDARD');
    } catch (err) {
      return res.status(400).json({ error: err.message });
    }

    const { total_coins, subtotal_coins, delivery_fee_coins, handling_fee_coins, total_weight_kg } = pricingBreakdown;

    // 2. Fetch user's wallet
    let wallet = await Wallet.findOne({ user: req.user._id });
    if (!wallet) {
      wallet = await Wallet.create({ user: req.user._id });
    }

    // 3. Check for sufficient wallet balance
    if (wallet.balance < total_coins) {
      const shortfall = total_coins - wallet.balance;
      return res.status(400).json({
        error: 'INSUFFICIENT_BALANCE',
        message: 'Your wallet balance is insufficient for this purchase.',
        required: total_coins,
        available: wallet.balance,
        shortfall
      });
    }

    // 4. Perform stock locks and decrement stock
    const rolledBackProducts = [];
    try {
      for (const item of items) {
        const product = await Product.findOneAndUpdate(
          { _id: item.product, stock: { $gte: item.quantity }, active: true },
          { $inc: { stock: -item.quantity } },
          { new: true }
        );

        if (!product) {
          throw new Error(`Item ${item.name || 'product'} is out of stock or inactive. Please adjust your cart.`);
        }
        rolledBackProducts.push({ id: item.product, quantity: item.quantity });
      }
    } catch (stockError) {
      // Rollback stock for any locked items
      for (const rolled of rolledBackProducts) {
        await Product.findByIdAndUpdate(rolled.id, { $inc: { stock: rolled.quantity } });
      }
      return res.status(400).json({ error: stockError.message });
    }

    // 5. Deduct coins atomically from wallet to prevent race conditions
    const updatedWallet = await Wallet.findOneAndUpdate(
      { user: req.user._id, balance: { $gte: total_coins } },
      { $inc: { balance: -total_coins } },
      { new: true }
    );

    if (!updatedWallet) {
      // Rollback stock
      for (const rolled of rolledBackProducts) {
        await Product.findByIdAndUpdate(rolled.id, { $inc: { stock: rolled.quantity } });
      }
      return res.status(400).json({ error: 'Transaction failed. Potential concurrent modification detected.' });
    }

    // 6. Generate order credentials
    const { orderNumber, trackingNumber } = generateOrderNumbers();

    // Create Order Object
    const order = await Order.create({
      order_number: orderNumber,
      user: req.user._id,
      items: pricingBreakdown.items,
      delivery_address,
      delivery_method: delivery_method || 'STANDARD',
      subtotal_coins,
      delivery_fee_coins,
      handling_fee_coins,
      total_coins,
      status: 'PAID', // mark as PAID instantly since coins were deducted
      tracking_number: trackingNumber,
      notes,
      tracking_events: [{
        location: 'Lagos Sorting Facility',
        status: 'PAID',
        message: 'Order successfully submitted. Payment processed.',
        timestamp: new Date()
      }]
    });

    // 7. Write separate Wallet Ledger entries for product purchase & delivery fee
    const txnDate = new Date();
    const dateStr = txnDate.toISOString().slice(0, 10).replace(/-/g, '');
    const randSuffix1 = Math.floor(1000 + Math.random() * 9000);
    const randSuffix2 = Math.floor(1000 + Math.random() * 9000);

    // Ledger Entry 1: Purchase
    const purchaseTxnId = `TXN-${dateStr}-${randSuffix1}`;
    await WalletTransaction.create({
      txn_id: purchaseTxnId,
      user: req.user._id,
      type: 'PURCHASE',
      amount: subtotal_coins,
      balance_before: wallet.balance,
      balance_after: wallet.balance - subtotal_coins,
      reference: orderNumber,
      description: `Purchase of ${pricingBreakdown.items.length} marketplace item(s)`,
      status: 'SUCCESS',
      source: 'USER',
      related_id: order._id
    });

    // Ledger Entry 2: Delivery & Surcharges
    const deliveryTxnId = `TXN-${dateStr}-${randSuffix2}`;
    const deliveryAndHandling = delivery_fee_coins + handling_fee_coins;
    await WalletTransaction.create({
      txn_id: deliveryTxnId,
      user: req.user._id,
      type: 'DELIVERY_FEE',
      amount: deliveryAndHandling,
      balance_before: wallet.balance - subtotal_coins,
      balance_after: wallet.balance - total_coins,
      reference: orderNumber,
      description: `Logistics delivery and processing fee to ${delivery_address.country}`,
      status: 'SUCCESS',
      source: 'USER',
      related_id: order._id
    });

    // 8. Create user-facing Notification
    await Notification.create({
      user: req.user._id,
      title: 'Order Paid Successfully',
      message: `Your package order ${orderNumber} is processing. Total paid: ${total_coins.toLocaleString()} COINS. Track: ${trackingNumber}`,
      type: 'ORDER',
      link: `/dashboard/orders/${order._id}`
    });

    res.status(201).json({
      success: true,
      message: 'Order placed and paid successfully.',
      order
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user's order history
// @route   GET /api/orders
// @access  Private
exports.getUserOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, orders });
  } catch (error) {
    next(error);
  }
};

// @desc    Get order details
// @route   GET /api/orders/:id
// @access  Private
exports.getOrderDetails = async (req, res, next) => {
  try {
    const order = await Order.findOne({ _id: req.params.id, user: req.user._id }).populate('items.product');
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.status(200).json({ success: true, order });
  } catch (error) {
    next(error);
  }
};

// @desc    Track order publicly by tracking number (No Auth required)
// @route   GET /api/orders/track/:trackingNumber
// @access  Public
exports.trackOrderByNumber = async (req, res, next) => {
  try {
    const order = await Order.findOne({ tracking_number: req.params.trackingNumber.trim() })
      .select('order_number tracking_number status tracking_events delivery_address.country delivery_address.state createdAt');
    
    if (!order) {
      return res.status(404).json({ error: 'Package tracking record not found. Check number.' });
    }

    res.status(200).json({
      success: true,
      order: {
        order_number: order.order_number,
        tracking_number: order.tracking_number,
        status: order.status,
        country: order.delivery_address.country,
        state: order.delivery_address.state,
        createdAt: order.createdAt,
        // Only return visible tracking events to user
        tracking_events: order.tracking_events.filter(e => e.visible_to_customer)
      }
    });
  } catch (error) {
    next(error);
  }
};
