const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
  getAnalytics, getUsers, getUserProfile, updateUserStatus, adjustWalletBalance,
  getDeposits, reviewDeposit, getOrders, updateOrderStatus, refundOrder,
  getCampaigns, reviewCampaign, updateCampaignExecution, refundCampaign,
  getSettings, updateSetting, createProduct, updateProduct, deleteProduct,
  getDeliveryPricingRules, createDeliveryPricingRule, updateDeliveryPricingRule, deleteDeliveryPricingRule,
  getAuditLogs, createAnnouncement
} = require('../controllers/admin');

// ==========================================
// 1. ANALYTICS
// ==========================================
router.get('/analytics', protect, authorize('ADMIN', 'SUPER_ADMIN', 'OPERATIONS', 'DELIVERY_MANAGER', 'ADVERTISING_MANAGER'), getAnalytics);

// ==========================================
// 2. USER MANAGEMENT
// ==========================================
router.get('/users', protect, authorize('ADMIN', 'SUPER_ADMIN', 'SUPPORT', 'OPERATIONS'), getUsers);
router.get('/users/:id', protect, authorize('ADMIN', 'SUPER_ADMIN', 'SUPPORT', 'OPERATIONS'), getUserProfile);
router.put('/users/:id/status', protect, authorize('ADMIN', 'SUPER_ADMIN'), updateUserStatus);
router.post('/users/:id/adjust-wallet', protect, authorize('ADMIN', 'SUPER_ADMIN'), adjustWalletBalance);

// ==========================================
// 3. DEPOSIT MODERATION
// ==========================================
router.get('/deposits', protect, authorize('ADMIN', 'SUPER_ADMIN', 'OPERATIONS', 'SUPPORT'), getDeposits);
router.post('/deposits/:id/review', protect, authorize('ADMIN', 'SUPER_ADMIN', 'OPERATIONS'), reviewDeposit);

// ==========================================
// 4. ORDER MODERATION
// ==========================================
router.get('/orders', protect, authorize('ADMIN', 'SUPER_ADMIN', 'DELIVERY_MANAGER', 'SUPPORT', 'OPERATIONS'), getOrders);
router.post('/orders/:id/status', protect, authorize('ADMIN', 'SUPER_ADMIN', 'DELIVERY_MANAGER', 'OPERATIONS'), updateOrderStatus);
router.post('/orders/:id/refund', protect, authorize('ADMIN', 'SUPER_ADMIN'), refundOrder);

// ==========================================
// 5. CAMPAIGN MODERATION
// ==========================================
router.get('/campaigns', protect, authorize('ADMIN', 'SUPER_ADMIN', 'ADVERTISING_MANAGER', 'SUPPORT', 'OPERATIONS'), getCampaigns);
router.post('/campaigns/:id/review', protect, authorize('ADMIN', 'SUPER_ADMIN', 'ADVERTISING_MANAGER', 'OPERATIONS'), reviewCampaign);
router.post('/campaigns/:id/execution', protect, authorize('ADMIN', 'SUPER_ADMIN', 'ADVERTISING_MANAGER', 'OPERATIONS'), updateCampaignExecution);
router.post('/campaigns/:id/refund', protect, authorize('ADMIN', 'SUPER_ADMIN'), refundCampaign);

// ==========================================
// 6. SYSTEM SETTINGS
// ==========================================
router.get('/settings', protect, authorize('ADMIN', 'SUPER_ADMIN', 'OPERATIONS'), getSettings);
router.post('/settings', protect, authorize('ADMIN', 'SUPER_ADMIN'), updateSetting);

// ==========================================
// 7. PRODUCT MANAGEMENT (CRUD)
// ==========================================
router.post('/products', protect, authorize('ADMIN', 'SUPER_ADMIN', 'OPERATIONS'), createProduct);
router.put('/products/:id', protect, authorize('ADMIN', 'SUPER_ADMIN', 'OPERATIONS'), updateProduct);
router.delete('/products/:id', protect, authorize('ADMIN', 'SUPER_ADMIN', 'OPERATIONS'), deleteProduct);

// ==========================================
// 8. DELIVERY PRICING MANAGEMENT
// ==========================================
router.get('/pricing-rules', protect, authorize('ADMIN', 'SUPER_ADMIN', 'OPERATIONS', 'DELIVERY_MANAGER'), getDeliveryPricingRules);
router.post('/pricing-rules', protect, authorize('ADMIN', 'SUPER_ADMIN', 'OPERATIONS'), createDeliveryPricingRule);
router.put('/pricing-rules/:id', protect, authorize('ADMIN', 'SUPER_ADMIN', 'OPERATIONS'), updateDeliveryPricingRule);
router.delete('/pricing-rules/:id', protect, authorize('ADMIN', 'SUPER_ADMIN', 'OPERATIONS'), deleteDeliveryPricingRule);

// ==========================================
// 9. AUDIT LOGS
// ==========================================
router.get('/audit-logs', protect, authorize('ADMIN', 'SUPER_ADMIN'), getAuditLogs);

// ==========================================
// 10. SYSTEM BROADCASTS
// ==========================================
router.post('/announcements', protect, authorize('ADMIN', 'SUPER_ADMIN', 'OPERATIONS'), createAnnouncement);

module.exports = router;
