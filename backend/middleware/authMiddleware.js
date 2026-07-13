const { admin } = require('../config/firebase');
const User = require('../models/userModel');

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      
      // Strict Firebase Token Verification
      const decodedToken = await admin.auth().verifyIdToken(token);
      const user = await User.findOne({ firebaseUid: decodedToken.uid });

      if (!user) {
        return res.status(401).json({ message: 'User not found in database, please authenticate first' });
      }

      req.user = user;
      next();
    } catch (error) {
      console.error('Auth Middleware Error:', error);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  } else {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

const host = (req, res, next) => {
  if (req.user && (req.user.role === 'host' || req.user.role === 'admin')) {
    next();
  } else {
    res.status(403).json({ message: 'Forbidden: Host access required' });
  }
};

const adminMiddleware = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Forbidden: Admin access required' });
  }
};

module.exports = { protect, host, admin: adminMiddleware };
