const express = require('express');
const router = express.Router();
const { getNotifications, markAsRead, markAllAsRead, getAnnouncements } = require('../controllers/notifications');
const { protect } = require('../middleware/auth');

router.get('/', protect, getNotifications);
router.get('/announcements', protect, getAnnouncements);
router.patch('/:id/read', protect, markAsRead);
router.post('/read-all', protect, markAllAsRead);

module.exports = router;
