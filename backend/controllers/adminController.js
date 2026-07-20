const jwt = require('jsonwebtoken');

// @desc    Admin login
// @route   POST /api/admin/login
// @access  Public
const loginAdmin = async (req, res) => {
  const { username, password } = req.body;

  // Retrieve credentials from .env, or use fallback
  const adminUsername = process.env.ADMIN_USERNAME;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (username === adminUsername && password === adminPassword) {
    const User = require('../models/userModel');
    let adminUser = await User.findOne({ email: 'admin@mahastays.com' });
    const adminId = adminUser ? adminUser._id.toString() : '6a187998f404a4afd4d4b1f7'; // fallback to valid ObjectId format

    res.json({
      _id: adminId,
      name: 'Super Admin',
      email: 'admin@mahastays.com',
      isAdmin: true,
      token: generateToken(adminId),
    });
  } else {
    res.status(401).json({ message: 'Invalid admin credentials' });
  }
};

// Generate JWT
const generateToken = (id) => {
  if (!process.env.JWT_SECRET) {
    throw new Error('FATAL: JWT_SECRET environment variable is missing.');
  }
  return jwt.sign({ id, role: 'admin' }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

module.exports = {
  loginAdmin,
};
