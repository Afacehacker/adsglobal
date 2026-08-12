const express = require('express');
const router = express.Router();
const { register, login, getMe, updateProfile, changePassword, verifyEmailOTP, resendOTP } = require('../controllers/auth');
const { protect } = require('../middleware/auth');

router.post('/register', register);
router.post('/login', login);
router.post('/verify-email', verifyEmailOTP);
router.post('/resend-otp', resendOTP);
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);
router.put('/change-password', protect, changePassword);

module.exports = router;
