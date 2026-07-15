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
