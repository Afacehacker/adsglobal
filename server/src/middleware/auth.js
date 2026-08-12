const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Protect Routes - Check if user is authenticated
const protect = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({ error: 'Not authorized to access this resource. Please log in.' });
    }

    // Verify Token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'super_secret_jwt_access_token_key_2026');

    // Find User
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ error: 'User associated with this token no longer exists.' });
    }

    // Check if user is active
    if (user.status === 'SUSPENDED') {
      return res.status(403).json({ error: 'Your account has been suspended. Please contact support.' });
    }

    // Attach user to req
    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

// Authorize Roles
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'User is not authenticated' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        error: `User role '${req.user.role}' is not authorized to access this resource`
      });
    }
    next();
  };
};

module.exports = {
  protect,
  authorize
};
