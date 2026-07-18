const { admin } = require('../config/firebase');
const User = require('../models/userModel');
const jwt = require('jsonwebtoken');

const protect = async (req, res, next) => {
  let token;
  const authHeader = req.headers.authorization || req.headers['x-auth-token'];

  if (authHeader && authHeader.startsWith('Bearer')) {
    try {
      token = authHeader.split(' ')[1];
      
      try {
        // Try to decode as standard JWT for admin
        if (!process.env.JWT_SECRET) {
          throw new Error('FATAL: JWT_SECRET environment variable is missing.');
        }
        const decodedJwt = jwt.verify(token, process.env.JWT_SECRET);
        if (decodedJwt && decodedJwt.role === 'admin') {
          req.user = {
            _id: decodedJwt.id,
            role: 'admin',
            isAdmin: true,
          };
          return next();
        }
      } catch (jwtError) {
        // Not a standard JWT, proceed to Firebase verification
      }

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
