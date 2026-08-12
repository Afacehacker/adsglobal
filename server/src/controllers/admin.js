const User = require('../models/User');
const Wallet = require('../models/Wallet');
const WalletTransaction = require('../models/WalletTransaction');
const Deposit = require('../models/Deposit');
const Order = require('../models/Order');
const Product = require('../models/Product');
const DeliveryPricingRule = require('../models/DeliveryPricingRule');
const AdPlatform = require('../models/AdPlatform');
const AdCampaign = require('../models/AdCampaign');
const SupportTicket = require('../models/SupportTicket');
const SupportMessage = require('../models/SupportMessage');
const Announcement = require('../models/Announcement');
const AuditLog = require('../models/AuditLog');
const AdminSetting = require('../models/AdminSetting');
const Refund = require('../models/Refund');
const Notification = require('../models/Notification');

// Helper to log administrative actions
const createAuditLog = async (adminId, action, affectedUser, objectId, objectType, prevVal, newVal, req) => {
  try {
    const ip = req ? (req.headers['x-forwarded-for'] || req.socket.remoteAddress) : '127.0.0.1';
    await AuditLog.create({
      admin: adminId,
      action,
      affected_user: affectedUser,
      affected_object_id: objectId,
      affected_object_type: objectType,
      prev_value: prevVal,
      new_value: newVal,
      ip_address: ip
    });
  } catch (error) {
    console.error('Failed to create audit log:', error);
  }
};

// ==========================================
// 1. ANALYTICS & DASHBOARD
// ==========================================
exports.getAnalytics = async (req, res, next) => {
  try {
    // Basic Counts
    const totalUsers = await User.countDocuments({ role: 'USER' });
    const activeUsers = await User.countDocuments({ role: 'USER', status: 'ACTIVE' });
    
    // Wallets Sum
    const wallets = await Wallet.aggregate([
      { $group: { _id: null, totalBalance: { $sum: '$balance' }, totalPending: { $sum: '$pending_credits' } } }
    ]);
    const totalWalletBalance = wallets[0] ? wallets[0].totalBalance : 0;
    const pendingDepositsSum = wallets[0] ? wallets[0].totalPending : 0;

    // Deposits Analytics
    const totalDepositsCount = await Deposit.countDocuments({ status: 'APPROVED' });
    const depositsSum = await Deposit.aggregate([
      { $match: { status: 'APPROVED' } },
      { $group: { _id: null, total: { $sum: '$amount_coins' } } }
    ]);
    const totalDepositsRevenue = depositsSum[0] ? depositsSum[0].total : 0;

    // Orders Analytics
    const totalOrders = await Order.countDocuments({});
    const activeOrders = await Order.countDocuments({ status: { $in: ['PAID', 'PROCESSING', 'PACKED', 'READY_FOR_DISPATCH', 'DISPATCHED', 'IN_TRANSIT', 'CUSTOMS', 'OUT_FOR_DELIVERY'] } });
    const deliveredOrders = await Order.countDocuments({ status: 'DELIVERED' });

    // Financial splits
    const orderFinances = await Order.aggregate([
      { $match: { status: { $nin: ['CANCELLED', 'PAYMENT_PENDING'] } } },
      { $group: {
        _id: null,
        subtotal: { $sum: '$subtotal_coins' },
        delivery: { $sum: '$delivery_fee_coins' },
        handling: { $sum: '$handling_fee_coins' }
      }}
    ]);
    const productRevenue = orderFinances[0] ? orderFinances[0].subtotal : 0;
    const deliveryRevenue = orderFinances[0] ? (orderFinances[0].delivery + orderFinances[0].handling) : 0;

    // Campaigns Analytics
    const totalCampaigns = await AdCampaign.countDocuments({});
    const activeCampaigns = await AdCampaign.countDocuments({ status: 'ACTIVE' });
    const campaignFinances = await AdCampaign.aggregate([
      { $match: { status: { $nin: ['CANCELLED', 'PAYMENT_PENDING'] } } },
      { $group: {
        _id: null,
        management: { $sum: '$management_fee_coins' },
        creative: { $sum: '$creative_fee_coins' },
        budget: { $sum: '$platform_budget_coins' }
      }}
    ]);
    const campaignRevenue = campaignFinances[0] ? (campaignFinances[0].management + campaignFinances[0].creative + campaignFinances[0].budget) : 0;

    // Refunds Sum
    const refundsAggregate = await Refund.aggregate([
      { $group: { _id: null, total: { $sum: '$amount_coins' } } }
    ]);
    const totalRefunds = refundsAggregate[0] ? refundsAggregate[0].total : 0;

    // Net Revenue
    const netRevenue = (productRevenue + deliveryRevenue + campaignRevenue) - totalRefunds;

    res.status(200).json({
      success: true,
      summary: {
        totalUsers,
        activeUsers,
        totalWalletBalance,
        pendingDepositsSum,
        totalDepositsCount,
        totalDepositsRevenue,
        totalOrders,
        activeOrders,
        deliveredOrders,
        totalCampaigns,
        activeCampaigns,
        productRevenue,
        deliveryRevenue,
        campaignRevenue,
        totalRefunds,
        netRevenue
      }
    });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// 2. USER MANAGEMENT
// ==========================================
exports.getUsers = async (req, res, next) => {
  try {
    const search = req.query.search || '';
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const filter = { role: { $ne: 'SUPER_ADMIN' } };
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } }
      ];
    }

    const total = await User.countDocuments(filter);
    const users = await User.find(filter).skip(skip).limit(limit).sort({ createdAt: -1 });

    res.status(200).json({ success: true, total, page, pages: Math.ceil(total / limit), users });
  } catch (error) {
    next(error);
  }
};

exports.getUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const wallet = await Wallet.findOne({ user: user._id });
    const orders = await Order.find({ user: user._id }).sort({ createdAt: -1 });
    const campaigns = await AdCampaign.find({ user: user._id }).sort({ createdAt: -1 });
    const deposits = await Deposit.find({ user: user._id }).sort({ createdAt: -1 });
    const transactions = await WalletTransaction.find({ user: user._id }).sort({ createdAt: -1 }).limit(10);

    res.status(200).json({
      success: true,
      user,
      wallet,
      orders,
      campaigns,
      deposits,
      transactions
    });
  } catch (error) {
    next(error);
  }
};

exports.updateUserStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    if (!['ACTIVE', 'SUSPENDED'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const oldStatus = user.status;
    user.status = status;
    await user.save();

    await createAuditLog(req.user._id, 'USER_STATUS_CHANGED', user._id, user._id, 'User', { status: oldStatus }, { status }, req);

    res.status(200).json({ success: true, message: `User status changed to ${status}`, user });
  } catch (error) {
    next(error);
  }
};

exports.adjustWalletBalance = async (req, res, next) => {
  try {
    const { type, amount, description } = req.body;
    if (!['ADMIN_CREDIT', 'ADMIN_DEBIT'].includes(type)) {
      return res.status(400).json({ error: 'Adjustment type must be ADMIN_CREDIT or ADMIN_DEBIT' });
    }

    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      return res.status(400).json({ error: 'Adjustment amount must be positive' });
    }

    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    let wallet = await Wallet.findOne({ user: user._id });
    if (!wallet) {
      wallet = await Wallet.create({ user: user._id });
    }

    const balanceBefore = wallet.balance;
    let balanceAfter = balanceBefore;

    if (type === 'ADMIN_CREDIT') {
      balanceAfter = balanceBefore + numericAmount;
      wallet.balance = balanceAfter;
    } else {
      if (balanceBefore < numericAmount) {
        return res.status(400).json({ error: `Cannot debit ${numericAmount} COINS. User only has ${balanceBefore} COINS.` });
      }
      balanceAfter = balanceBefore - numericAmount;
      wallet.balance = balanceAfter;
    }

    await wallet.save();

    // Create Ledger Log
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const txn_id = `TXN-${dateStr}-${Math.floor(10000 + Math.random() * 90000)}`;

    const transaction = await WalletTransaction.create({
      txn_id,
      user: user._id,
      type,
      amount: numericAmount,
      balance_before: balanceBefore,
      balance_after: balanceAfter,
      reference: 'ADMIN-ADJUSTMENT',
      description: description || `Administrative manual balance adjustment`,
      status: 'SUCCESS',
      source: 'ADMIN'
    });

    // Notify User
    await Notification.create({
      user: user._id,
      title: type === 'ADMIN_CREDIT' ? 'Wallet Credited' : 'Wallet Debited',
      message: `An administrator manual balance adjustment has occurred. ${type === 'ADMIN_CREDIT' ? '+' : '-'}${numericAmount.toLocaleString()} COINS. Description: ${description || 'N/A'}`,
      type: 'SYSTEM'
    });

    await createAuditLog(req.user._id, type, user._id, wallet._id, 'Wallet', { balance: balanceBefore }, { balance: balanceAfter }, req);

    res.status(200).json({ success: true, message: 'Wallet balance adjusted successfully', balance: wallet.balance, transaction });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// 3. DEPOSIT MODERATION
// ==========================================
exports.getDeposits = async (req, res, next) => {
  try {
    const status = req.query.status;
    const filter = {};
    if (status) filter.status = status;

    const deposits = await Deposit.find(filter).populate('user').sort({ createdAt: -1 });
    res.status(200).json({ success: true, deposits });
  } catch (error) {
    next(error);
  }
};

exports.reviewDeposit = async (req, res, next) => {
  try {
    const { status, rejection_reason } = req.body;
    if (!['APPROVED', 'REJECTED', 'CLARIFICATION_REQUESTED'].includes(status)) {
      return res.status(400).json({ error: 'Status must be APPROVED, REJECTED or CLARIFICATION_REQUESTED' });
    }

    const deposit = await Deposit.findById(req.params.id);
    if (!deposit) return res.status(404).json({ error: 'Deposit request not found' });

    if (deposit.status !== 'PENDING' && deposit.status !== 'CLARIFICATION_REQUESTED') {
      return res.status(400).json({ error: `Cannot review. Deposit request is already ${deposit.status}` });
    }

    const userWallet = await Wallet.findOne({ user: deposit.user });
    if (!userWallet) {
      return res.status(400).json({ error: 'User wallet not found' });
    }

    const prevStatus = deposit.status;

    if (status === 'APPROVED') {
      // Deduct from pending_credits, add to balance
      const newPending = Math.max(0, userWallet.pending_credits - deposit.amount_coins);
      const balanceBefore = userWallet.balance;
      const balanceAfter = balanceBefore + deposit.amount_coins;

      userWallet.pending_credits = newPending;
      userWallet.balance = balanceAfter;
      await userWallet.save();

      // Create Wallet Ledger log
      const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
      await WalletTransaction.create({
        txn_id: `TXN-${dateStr}-${Math.floor(10000 + Math.random() * 90000)}`,
        user: deposit.user,
        type: 'DEPOSIT',
        amount: deposit.amount_coins,
        balance_before: balanceBefore,
        balance_after: balanceAfter,
        reference: deposit.deposit_id,
        description: `Manual Bank Transfer credit approved. Ref: ${deposit.transfer_reference}`,
        status: 'SUCCESS',
        source: 'ADMIN',
        related_id: deposit._id
      });

      // Notify User
      await Notification.create({
        user: deposit.user,
        title: 'Deposit Approved',
        message: `Your deposit request of ₦${deposit.amount_naira.toLocaleString()} (${deposit.amount_coins.toLocaleString()} COINS) has been approved! Funds are available in your wallet.`,
        type: 'DEPOSIT',
        link: '/dashboard/wallet'
      });
    } else {
      // For REJECTED or CLARIFICATION_REQUESTED, we just remove the amount from pending_credits
      const newPending = Math.max(0, userWallet.pending_credits - deposit.amount_coins);
      userWallet.pending_credits = newPending;
      await userWallet.save();

      deposit.rejection_reason = rejection_reason || 'Information mismatch. Verify details and upload readable proof.';

      // Notify User
      await Notification.create({
        user: deposit.user,
        title: status === 'REJECTED' ? 'Deposit Rejected' : 'Clarification Required',
        message: `Deposit review update: ${status}. Reason: ${deposit.rejection_reason}`,
        type: 'DEPOSIT',
        link: '/dashboard/wallet'
      });
    }

    deposit.status = status;
    deposit.reviewed_by = req.user._id;
    deposit.reviewed_at = new Date();
    await deposit.save();

    await createAuditLog(req.user._id, `DEPOSIT_${status}`, deposit.user, deposit._id, 'Deposit', { status: prevStatus }, { status }, req);

    res.status(200).json({ success: true, message: `Deposit request status updated to ${status}`, deposit });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// 4. ORDER MODERATION
// ==========================================
exports.getOrders = async (req, res, next) => {
  try {
    const status = req.query.status;
    const filter = {};
    if (status) filter.status = status;

    const orders = await Order.find(filter).populate('user').sort({ createdAt: -1 });
    res.status(200).json({ success: true, orders });
  } catch (error) {
    next(error);
  }
};

exports.updateOrderStatus = async (req, res, next) => {
  try {
    const { status, location, message, internal_note, provider, tracking_url, reference } = req.body;
    
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ error: 'Order not found' });

    const prevStatus = order.status;

    if (status) {
      order.status = status;
      
      // Append tracking timeline event
      order.tracking_events.push({
        location: location || 'Transit Hub',
        status,
        message: message || `Logistics dispatch status: ${status.replace(/_/g, ' ')}`,
        internal_note: internal_note || '',
        visible_to_customer: true,
        timestamp: new Date()
      });

      // Send User notification
      await Notification.create({
        user: order.user,
        title: 'Package Shipment Status Updated',
        message: `Your package order ${order.order_number} is now ${status.replace(/_/g, ' ')}. Status update: ${message || 'Processing.'}`,
        type: 'ORDER',
        link: `/dashboard/orders/${order._id}`
      });
    }

    // Save Courier metadata
    if (provider) order.courier_info.provider = provider;
    if (tracking_url) order.courier_info.tracking_url = tracking_url;
    if (reference) order.courier_info.reference = reference;

    await order.save();

    await createAuditLog(req.user._id, 'ORDER_STATUS_CHANGED', order.user, order._id, 'Order', { status: prevStatus }, { status }, req);

    res.status(200).json({ success: true, message: 'Order status updated successfully', order });
  } catch (error) {
    next(error);
  }
};

exports.refundOrder = async (req, res, next) => {
  try {
    const { reason, service_fee_retained } = req.body;
    if (!reason) return res.status(400).json({ error: 'Reason for refund is required' });

    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ error: 'Order not found' });

    if (order.status === 'REFUNDED' || order.status === 'CANCELLED') {
      return res.status(400).json({ error: `Cannot refund order that is already ${order.status}` });
    }

    const wallet = await Wallet.findOne({ user: order.user });
    if (!wallet) return res.status(400).json({ error: 'User wallet not found' });

    const deduction = order.total_coins;
    const retained = parseFloat(service_fee_retained) || 0;
    const refundAmount = deduction - retained;

    if (refundAmount < 0) {
      return res.status(400).json({ error: 'Service fee retained cannot exceed order cost' });
    }

    const prevBalance = wallet.balance;
    const newBalance = prevBalance + refundAmount;
    wallet.balance = newBalance;
    await wallet.save();

    // Create Refund log in DB
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const refund_id = `REF-${dateStr}-${Math.floor(10000 + Math.random() * 90000)}`;
    const refund = await Refund.create({
      refund_id,
      user: order.user,
      related_type: 'ORDER',
      related_id: order._id,
      amount_coins: refundAmount,
      service_fee_retained_coins: retained,
      status: 'COMPLETED',
      reason,
      processed_by: req.user._id
    });

    // Create Ledger Log
    await WalletTransaction.create({
      txn_id: `TXN-${dateStr}-${Math.floor(10000 + Math.random() * 90000)}`,
      user: order.user,
      type: 'REFUND',
      amount: refundAmount,
      balance_before: prevBalance,
      balance_after: newBalance,
      reference: order.order_number,
      description: `Refund for cancelled order ${order.order_number}. Reason: ${reason}`,
      status: 'SUCCESS',
      source: 'ADMIN',
      related_id: refund._id
    });

    // Restore stock if processing
    if (['PAID', 'PROCESSING', 'PACKED'].includes(order.status)) {
      for (const item of order.items) {
        await Product.findByIdAndUpdate(item.product, { $inc: { stock: item.quantity } });
      }
    }

    // Update order status
    order.status = 'REFUNDED';
    order.refunded_amount = refundAmount;
    order.tracking_events.push({
      location: 'Logistics Center',
      status: 'REFUNDED',
      message: `Order cancelled and refunded. Refund: ${refundAmount.toLocaleString()} COINS. Reason: ${reason}`,
      visible_to_customer: true,
      timestamp: new Date()
    });
    await order.save();

    // Notify User
    await Notification.create({
      user: order.user,
      title: 'Order Refunded',
      message: `Order ${order.order_number} has been cancelled and refunded. ${refundAmount.toLocaleString()} COINS credited to your wallet.`,
      type: 'ORDER',
      link: '/dashboard/wallet'
    });

    await createAuditLog(req.user._id, 'ORDER_REFUNDED', order.user, order._id, 'Order', { status: 'PAID' }, { status: 'REFUNDED' }, req);

    res.status(200).json({ success: true, message: 'Order refunded successfully', order, refund });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// 5. CAMPAIGN MODERATION
// ==========================================
exports.getCampaigns = async (req, res, next) => {
  try {
    const status = req.query.status;
    const filter = {};
    if (status) filter.status = status;

    const campaigns = await AdCampaign.find(filter).populate('user').populate('platform').sort({ createdAt: -1 });
    res.status(200).json({ success: true, campaigns });
  } catch (error) {
    next(error);
  }
};

exports.reviewCampaign = async (req, res, next) => {
  try {
    const { status, moderation_notes } = req.body;
    if (!['APPROVED', 'REJECTED', 'NEEDS_CHANGES', 'ACTIVE', 'COMPLETED'].includes(status)) {
      return res.status(400).json({ error: 'Invalid campaign review status' });
    }

    const campaign = await AdCampaign.findById(req.params.id);
    if (!campaign) return res.status(404).json({ error: 'Campaign not found' });

    const prevStatus = campaign.status;
    campaign.status = status;
    if (moderation_notes) campaign.moderation_notes = moderation_notes;
    await campaign.save();

    // Notify User
    await Notification.create({
      user: campaign.user,
      title: `Campaign Update: ${status}`,
      message: `Your campaign '${campaign.name}' (${campaign.campaign_number}) status is now ${status}. Admin notes: ${moderation_notes || 'Processing.'}`,
      type: 'CAMPAIGN',
      link: `/dashboard/campaigns/${campaign._id}`
    });

    await createAuditLog(req.user._id, `CAMPAIGN_${status}`, campaign.user, campaign._id, 'AdCampaign', { status: prevStatus }, { status }, req);

    res.status(200).json({ success: true, message: `Campaign status updated to ${status}`, campaign });
  } catch (error) {
    next(error);
  }
};

exports.updateCampaignExecution = async (req, res, next) => {
  try {
    const { external_campaign_id, posting_url, execution_notes, moderation_notes, impressions_views, views, clicks, status } = req.body;

    const campaign = await AdCampaign.findById(req.params.id);
    if (!campaign) return res.status(404).json({ error: 'Campaign not found' });

    if (external_campaign_id !== undefined) campaign.external_campaign_id = external_campaign_id;
    if (posting_url !== undefined) campaign.posting_url = posting_url;
    if (execution_notes !== undefined) campaign.execution_notes = execution_notes;
    if (moderation_notes !== undefined) campaign.moderation_notes = moderation_notes;
    
    if (impressions_views !== undefined || views !== undefined) {
      const vVal = impressions_views !== undefined ? impressions_views : views;
      campaign.impressions_views = Math.max(0, Number(vVal) || 0);
    }

    if (clicks !== undefined) {
      campaign.clicks = Math.max(0, Number(clicks) || 0);
    }

    if (status && ['SUBMITTED', 'UNDER_REVIEW', 'NEEDS_CHANGES', 'APPROVED', 'REJECTED', 'ACTIVE', 'PAUSED', 'COMPLETED', 'CANCELLED'].includes(status)) {
      campaign.status = status;
    } else if (posting_url && (campaign.status === 'APPROVED' || campaign.status === 'SUBMITTED')) {
      campaign.status = 'ACTIVE';
    }

    await campaign.save();

    // Notify User if status or metrics updated
    await Notification.create({
      user: campaign.user,
      title: 'Ad Campaign Updated',
      message: `Your campaign '${campaign.name}' (${campaign.campaign_number}) status is now ${campaign.status}. Performance: ${campaign.impressions_views.toLocaleString()} Views, ${campaign.clicks.toLocaleString()} Clicks.`,
      type: 'CAMPAIGN',
      link: `/dashboard/campaigns/${campaign._id}`
    });

    res.status(200).json({ success: true, message: 'Campaign performance & status updated successfully', campaign });
  } catch (error) {
    next(error);
  }
};

exports.refundCampaign = async (req, res, next) => {
  try {
    const { reason, service_fee_retained } = req.body;
    if (!reason) return res.status(400).json({ error: 'Reason for refund is required' });

    const campaign = await AdCampaign.findById(req.params.id);
    if (!campaign) return res.status(404).json({ error: 'Campaign not found' });

    if (campaign.status === 'CANCELLED' || campaign.status === 'COMPLETED') {
      return res.status(400).json({ error: `Cannot refund campaign that is already ${campaign.status}` });
    }

    const wallet = await Wallet.findOne({ user: campaign.user });
    if (!wallet) return res.status(400).json({ error: 'User wallet not found' });

    const cost = campaign.total_cost_coins;
    const retained = parseFloat(service_fee_retained) || 0;
    const refundAmount = cost - retained;

    if (refundAmount < 0) {
      return res.status(400).json({ error: 'Retained fee cannot exceed campaign cost' });
    }

    const prevBalance = wallet.balance;
    const newBalance = prevBalance + refundAmount;
    wallet.balance = newBalance;
    await wallet.save();

    // Create Refund log in DB
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const refund_id = `REF-${dateStr}-${Math.floor(10000 + Math.random() * 90000)}`;
    const refund = await Refund.create({
      refund_id,
      user: campaign.user,
      related_type: 'CAMPAIGN',
      related_id: campaign._id,
      amount_coins: refundAmount,
      service_fee_retained_coins: retained,
      status: 'COMPLETED',
      reason,
      processed_by: req.user._id
    });

    // Create Ledger Log
    await WalletTransaction.create({
      txn_id: `TXN-${dateStr}-${Math.floor(10000 + Math.random() * 90000)}`,
      user: campaign.user,
      type: 'REFUND',
      amount: refundAmount,
      balance_before: prevBalance,
      balance_after: newBalance,
      reference: campaign.campaign_number,
      description: `Refund for cancelled ad campaign ${campaign.campaign_number}. Reason: ${reason}`,
      status: 'SUCCESS',
      source: 'ADMIN',
      related_id: refund._id
    });

    campaign.status = 'CANCELLED';
    campaign.refund_id = refund._id;
    campaign.moderation_notes = `Refunded: ${refundAmount.toLocaleString()} COINS. Reason: ${reason}`;
    await campaign.save();

    // Notify User
    await Notification.create({
      user: campaign.user,
      title: 'Campaign Refunded',
      message: `Your campaign '${campaign.name}' was cancelled. ${refundAmount.toLocaleString()} COINS returned.`,
      type: 'CAMPAIGN',
      link: '/dashboard/wallet'
    });

    await createAuditLog(req.user._id, 'CAMPAIGN_REFUNDED', campaign.user, campaign._id, 'AdCampaign', { status: 'SUBMITTED' }, { status: 'CANCELLED' }, req);

    res.status(200).json({ success: true, message: 'Campaign refunded successfully', campaign, refund });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// 6. SYSTEM SETTINGS
// ==========================================
exports.getSettings = async (req, res, next) => {
  try {
    const settings = await AdminSetting.find({});
    res.status(200).json({ success: true, settings });
  } catch (error) {
    next(error);
  }
};

exports.updateSetting = async (req, res, next) => {
  try {
    const { key, value } = req.body;
    if (!key) return res.status(400).json({ error: 'Setting key is required' });

    const prevSetting = await AdminSetting.findOne({ key });
    
    const setting = await AdminSetting.findOneAndUpdate(
      { key },
      { value },
      { upsert: true, new: true }
    );

    await createAuditLog(
      req.user._id,
      'SETTING_CHANGED',
      null,
      setting._id,
      'AdminSetting',
      prevSetting ? prevSetting.value : null,
      value,
      req
    );

    res.status(200).json({ success: true, message: `Setting '${key}' updated successfully`, setting });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// 7. PRODUCT MANAGEMENT (CRUD)
// ==========================================
exports.createProduct = async (req, res, next) => {
  try {
    const { name, sku, category, description, short_description, price_coins, stock, weight_kg, dimensions, fragile, restricted, delivery_eligible, active, featured, tags, images } = req.body;

    if (!name || !sku || !category || !description || !price_coins || isNaN(stock)) {
      return res.status(400).json({ error: 'Please provide all required fields' });
    }

    const product = await Product.create({
      name, sku, category, description, short_description, price_coins, stock, weight_kg, dimensions, fragile, restricted, delivery_eligible, active, featured, tags, images
    });

    await createAuditLog(req.user._id, 'PRODUCT_CREATED', null, product._id, 'Product', null, product, req);

    res.status(201).json({ success: true, message: 'Product created successfully', product });
  } catch (error) {
    next(error);
  }
};

exports.updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!product) return res.status(404).json({ error: 'Product not found' });

    await createAuditLog(req.user._id, 'PRODUCT_UPDATED', null, product._id, 'Product', null, product, req);

    res.status(200).json({ success: true, message: 'Product updated successfully', product });
  } catch (error) {
    next(error);
  }
};

exports.deleteProduct = async (req, res, next) => {
  try {
    // Soft delete/archive
    const product = await Product.findByIdAndUpdate(req.params.id, { active: false }, { new: true });
    if (!product) return res.status(404).json({ error: 'Product not found' });

    await createAuditLog(req.user._id, 'PRODUCT_ARCHIVED', null, product._id, 'Product', null, { active: false }, req);

    res.status(200).json({ success: true, message: 'Product archived successfully' });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// 8. DELIVERY PRICING MANAGEMENT
// ==========================================
exports.getDeliveryPricingRules = async (req, res, next) => {
  try {
    const rules = await DeliveryPricingRule.find({}).sort({ country: 1, state: 1 });
    res.status(200).json({ success: true, rules });
  } catch (error) {
    next(error);
  }
};

exports.createDeliveryPricingRule = async (req, res, next) => {
  try {
    const { country, state, weight_min, weight_max, base_price, per_kg_price, express_fee, fragile_fee, handling_fee } = req.body;

    if (!country || isNaN(base_price)) {
      return res.status(400).json({ error: 'Country and Base Price are required' });
    }

    const rule = await DeliveryPricingRule.create({
      country,
      state: state || 'ALL',
      weight_min: weight_min || 0,
      weight_max: weight_max || 9999,
      base_price,
      per_kg_price: per_kg_price || 0,
      express_fee: express_fee || 0,
      fragile_fee: fragile_fee || 0,
      handling_fee: handling_fee || 0
    });

    await createAuditLog(req.user._id, 'DELIVERY_PRICING_RULE_CREATED', null, rule._id, 'DeliveryPricingRule', null, rule, req);

    res.status(201).json({ success: true, message: 'Pricing rule created successfully', rule });
  } catch (error) {
    next(error);
  }
};

exports.updateDeliveryPricingRule = async (req, res, next) => {
  try {
    const rule = await DeliveryPricingRule.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!rule) return res.status(404).json({ error: 'Pricing rule not found' });

    await createAuditLog(req.user._id, 'DELIVERY_PRICING_RULE_UPDATED', null, rule._id, 'DeliveryPricingRule', null, rule, req);

    res.status(200).json({ success: true, message: 'Pricing rule updated successfully', rule });
  } catch (error) {
    next(error);
  }
};

exports.deleteDeliveryPricingRule = async (req, res, next) => {
  try {
    const rule = await DeliveryPricingRule.findByIdAndDelete(req.params.id);
    if (!rule) return res.status(404).json({ error: 'Pricing rule not found' });

    await createAuditLog(req.user._id, 'DELIVERY_PRICING_RULE_DELETED', null, rule._id, 'DeliveryPricingRule', rule, null, req);

    res.status(200).json({ success: true, message: 'Pricing rule deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// 9. AUDIT LOGS DISPLAY
// ==========================================
exports.getAuditLogs = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const total = await AuditLog.countDocuments({});
    const logs = await AuditLog.find({})
      .populate('admin', 'name email role')
      .populate('affected_user', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({ success: true, total, page, pages: Math.ceil(total / limit), logs });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// 10. SYSTEM BROADCASTS & ANNOUNCEMENTS
// ==========================================
exports.createAnnouncement = async (req, res, next) => {
  try {
    const { title, message, target_audience, priority, expires_at, image } = req.body;
    if (!title || !message) return res.status(400).json({ error: 'Title and message are required' });

    const announcement = await Announcement.create({
      title, message, target_audience, priority, expires_at, image
    });

    res.status(201).json({ success: true, message: 'Announcement broadcasted successfully', announcement });
  } catch (error) {
    next(error);
  }
};
