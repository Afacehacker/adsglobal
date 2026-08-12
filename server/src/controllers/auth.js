const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Wallet = require('../models/Wallet');
const { sendVerificationOTP, sendWelcomeEmail } = require('../services/emailService');

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'super_secret_jwt_access_token_key_2026', {
    expiresIn: '30d'
  });
};

// @desc    Register user with Email OTP Verification
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res, next) => {
  try {
    const { name, email, phone, country, password } = req.body;
    const cleanEmail = (email || '').trim().toLowerCase();

    // Check if user exists
    const userExists = await User.findOne({ email: cleanEmail });
    if (userExists) {
      if (!userExists.emailVerified) {
        // Generate new OTP for existing unverified user
        const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
        userExists.emailOTP = otpCode;
        userExists.emailOTPExpires = new Date(Date.now() + 15 * 60 * 1000);
        await userExists.save();

        // Send Verification OTP Email
        await sendVerificationOTP(userExists.email, otpCode, userExists.name);

        return res.status(200).json({
          success: true,
          requiresVerification: true,
          email: userExists.email,
          message: 'Account exists but is unverified. A new 6-digit verification code was sent to your email.'
        });
      }
      return res.status(400).json({ error: 'User already exists with this email address' });
    }

    // Generate 6-digit Verification OTP
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes validity

    // Create User (emailVerified = false by default)
    const user = await User.create({
      name,
      email: cleanEmail,
      phone,
      country,
      password,
      emailVerified: false,
      emailOTP: otpCode,
      emailOTPExpires: otpExpires
    });

    // Create associated Wallet for user
    await Wallet.create({ user: user._id });

    // Send Verification OTP Email
    await sendVerificationOTP(user.email, otpCode, user.name);

    res.status(201).json({
      success: true,
      requiresVerification: true,
      email: user.email,
      message: 'Registration successful! A 6-digit verification code has been sent to your email address.'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Verify Email OTP & Send Welcome Email
// @route   POST /api/auth/verify-email
// @access  Public
exports.verifyEmailOTP = async (req, res, next) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ error: 'Please provide email and verification code' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanOTP = otp.trim();

    const user = await User.findOne({ email: cleanEmail }).select('+password');
    if (!user) {
      return res.status(404).json({ error: 'Account not found' });
    }

    if (user.emailVerified) {
      const token = signToken(user._id);
      return res.status(200).json({
        success: true,
        message: 'Email is already verified',
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          country: user.country,
          role: user.role
        }
      });
    }

    // Check OTP validity
    if (!user.emailOTP || user.emailOTP !== cleanOTP || !user.emailOTPExpires || user.emailOTPExpires < Date.now()) {
      return res.status(400).json({ error: 'Invalid or expired 6-digit verification code. Please request a new code.' });
    }

    // Mark user as verified
    user.emailVerified = true;
    user.emailOTP = undefined;
    user.emailOTPExpires = undefined;
    await user.save();

    // Send Welcome Email immediately after successful verification
    await sendWelcomeEmail(user.email, user.name);

    // Sign Token for instant login
    const token = signToken(user._id);

    res.status(200).json({
      success: true,
      message: 'Email verified successfully! Welcome to ADSGLOBAL.',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        country: user.country,
        role: user.role
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Resend Email Verification OTP
// @route   POST /api/auth/resend-otp
// @access  Public
exports.resendOTP = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: 'Please provide an email address' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const user = await User.findOne({ email: cleanEmail });

    if (!user) {
      return res.status(404).json({ error: 'No account found with this email address' });
    }

    if (user.emailVerified) {
      return res.status(400).json({ error: 'This email is already verified. You can log in directly.' });
    }

    // Generate new OTP
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    user.emailOTP = otpCode;
    user.emailOTPExpires = new Date(Date.now() + 15 * 60 * 1000);
    await user.save();

    // Send Verification OTP Email
    await sendVerificationOTP(user.email, otpCode, user.name);

    res.status(200).json({
      success: true,
      message: 'A new 6-digit verification code has been sent to your email.'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Login user (Blocks unverified users)
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Please provide an email and password' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();

    const user = await User.findOne({ email: cleanEmail }).select('+password');
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isMatch = await user.comparePassword(cleanPassword);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    if (user.status === 'SUSPENDED') {
      return res.status(403).json({ error: 'Your account has been suspended. Please contact support.' });
    }

    // Check Email Verification (Allow official admins to bypass if needed)
    if (!user.emailVerified && user.role === 'USER') {
      // Auto-send fresh OTP code if unverified user attempts to login
      const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
      user.emailOTP = otpCode;
      user.emailOTPExpires = new Date(Date.now() + 15 * 60 * 1000);
      await user.save();

      // Send Verification OTP Email
      await sendVerificationOTP(user.email, otpCode, user.name);

      return res.status(403).json({
        error: 'Your email address is not verified yet. A 6-digit verification code has been sent to your email.',
        requiresVerification: true,
        email: user.email
      });
    }

    const token = signToken(user._id);

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        country: user.country,
        role: user.role
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res, next) => {
  try {
    const wallet = await Wallet.findOne({ user: req.user._id });

    res.status(200).json({
      success: true,
      user: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        phone: req.user.phone,
        country: req.user.country,
        role: req.user.role,
        status: req.user.status,
        emailVerified: req.user.emailVerified,
        createdAt: req.user.createdAt
      },
      wallet: wallet ? {
        balance: wallet.balance,
        pending_credits: wallet.pending_credits
      } : { balance: 0, pending_credits: 0 }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
exports.updateProfile = async (req, res, next) => {
  try {
    const { name, phone, country } = req.body;

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (name) user.name = name;
    if (phone) user.phone = phone;
    if (country) user.country = country;

    await user.save();

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        country: user.country,
        role: user.role
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Change user password
// @route   PUT /api/auth/change-password
// @access  Private
exports.changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Please provide current and new password' });
    }

    const user = await User.findById(req.user._id).select('+password');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({ error: 'Current password is incorrect' });
    }

    user.password = newPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password updated successfully'
    });
  } catch (error) {
    next(error);
  }
};
