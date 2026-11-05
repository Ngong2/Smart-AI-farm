const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Protect routes: verify JWT
const protect = async (req, res, next) => {
  let token;

  // Check for Bearer token in header
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Attach user to request
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        return res.status(401).json({ success: false, message: 'User not found' });
      }

      return next(); // ✅ proceed
    } catch (error) {
      console.error('JWT verification failed:', error);
      return res.status(401).json({ success: false, message: 'Not authorized' });
    }
  }

  // No token provided
  return res.status(401).json({ success: false, message: 'Not authorized, no token' });
};

// Authorize by role
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Not authorized' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        success: false, 
        message: `User role '${req.user.role}' is not authorized to access this route` 
      });
    }

    next();
  };
};

module.exports = { protect, authorize };