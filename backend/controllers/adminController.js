const jwt = require('jsonwebtoken');

// @desc    Admin login
// @route   POST /api/admin/login
// @access  Public
const loginAdmin = async (req, res) => {
  const { username, password } = req.body;

  // Retrieve credentials from .env, or use fallback
  const adminUsername = process.env.ADMIN_USERNAME || 'admin';
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';

  if (username === adminUsername && password === adminPassword) {
    res.json({
      _id: 'admin_id_custom',
      name: 'Super Admin',
      email: 'admin@mahastays.com',
      isAdmin: true,
      token: generateToken('admin_id_custom'),
    });
  } else {
    res.status(401).json({ message: 'Invalid admin credentials' });
  }
};

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id, role: 'admin' }, process.env.JWT_SECRET || 'fallback_secret', {
    expiresIn: '30d',
  });
};

module.exports = {
  loginAdmin,
};
