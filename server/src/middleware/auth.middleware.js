const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware to verify JWT token
const authenticate = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: 'Access denied. No token provided.' 
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Find user and populate employee details
    const user = await User.findById(decoded.userId)
      .populate('employeeId')
      .select('-passwordHash');

    if (!user || !user.isActive) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid or inactive token.' 
      });
    }

    req.user = user;
    req.userId = decoded.userId;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid token.' 
      });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        success: false, 
        message: 'Token expired.' 
      });
    }
    res.status(500).json({ 
      success: false, 
      message: 'Authentication error.', 
      error: error.message 
    });
  }
};

// Middleware to check if user has HR role
const authorizeHR = (req, res, next) => {
  if (req.user.role !== 'HR') {
    return res.status(403).json({ 
      success: false, 
      message: 'Access denied. HR role required.' 
    });
  }
  next();
};

// Middleware to check if user has Employee role
const authorizeEmployee = (req, res, next) => {
  if (req.user.role !== 'EMPLOYEE') {
    return res.status(403).json({ 
      success: false, 
      message: 'Access denied. Employee role required.' 
    });
  }
  next();
};

module.exports = {
  authenticate,
  authorizeHR,
  authorizeEmployee
};

