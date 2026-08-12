const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
  },
  phone: {
    type: String,
    trim: true,
  },
  country: {
    type: String,
    trim: true,
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    select: false, // Don't return password by default
  },
  role: {
    type: String,
    enum: ['USER', 'ADMIN', 'SUPER_ADMIN', 'OPERATIONS', 'ADVERTISING_MANAGER', 'DELIVERY_MANAGER', 'SUPPORT'],
    default: 'USER',
  },
  status: {
    type: String,
    enum: ['ACTIVE', 'SUSPENDED'],
    default: 'ACTIVE',
  },
  emailVerified: {
    type: Boolean,
    default: true,
  },
  emailOTP: String,
  emailOTPExpires: Date,
  emailVerificationToken: String,
  passwordResetToken: String,
  passwordResetExpires: Date,
}, {
  timestamps: true,
});

// Hash password before saving
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Password verification method
UserSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);
