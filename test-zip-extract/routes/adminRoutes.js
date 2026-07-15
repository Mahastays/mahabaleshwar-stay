const express = require('express');
const router = express.Router();
const { loginAdmin } = require('../controllers/adminController');
const rateLimit = require('express-rate-limit');

const adminLoginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per windowMs
  message: 'Too many login attempts from this IP, please try again after 15 minutes',
});

router.post('/login', adminLoginLimiter, loginAdmin);

module.exports = router;
