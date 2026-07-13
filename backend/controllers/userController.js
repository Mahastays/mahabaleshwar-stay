const { admin } = require('../config/firebase');
const User = require('../models/userModel');

// @desc    Auth user & sync with DB
// @route   POST /api/users/auth
// @access  Public (Requires Firebase token)
const authFirebaseUser = async (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.status(400).json({ message: 'No Firebase token provided' });
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    const { uid, email, phone_number, name } = decodedToken;

    let user = await User.findOne({ firebaseUid: uid });

    if (user) {
      return res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        phoneNumber: user.phoneNumber,
        role: user.role,
        firebaseUid: user.firebaseUid,
      });
    } else {
      user = await User.create({
        name: name || 'New User',
        email: email || '',
        phoneNumber: phone_number || '',
        firebaseUid: uid,
      });

      return res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        phoneNumber: user.phoneNumber,
        role: user.role,
        firebaseUid: user.firebaseUid,
      });
    }
  } catch (error) {
    console.error('Error authenticating Firebase token:', error);
    res.status(401).json({ message: 'Invalid Firebase token' });
  }
};

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phoneNumber: user.phoneNumber,
      role: user.role,
      firebaseUid: user.firebaseUid,
    });
  } else {
    res.status(404).json({ message: 'User not found' });
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.phoneNumber = req.body.phoneNumber || user.phoneNumber;

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      phoneNumber: updatedUser.phoneNumber,
      role: updatedUser.role,
      firebaseUid: updatedUser.firebaseUid,
    });
  } else {
    res.status(404).json({ message: 'User not found' });
  }
};

// @desc    Get all users
// @route   GET /api/users/admin/all
// @access  Private/Admin
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-firebaseUid');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Upgrade user to host
// @route   PUT /api/users/upgrade-to-host
// @access  Private
const upgradeToHost = async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.role = 'host';
    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      phoneNumber: updatedUser.phoneNumber,
      role: updatedUser.role,
      firebaseUid: updatedUser.firebaseUid,
    });
  } else {
    res.status(404).json({ message: 'User not found' });
  }
};

// @desc    Admin: Update a user's role
// @route   PUT /api/users/admin/:id/role
// @access  Private/Admin
const adminUpdateUserRole = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const { role } = req.body;
    if (!['user', 'host', 'admin'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }
    user.role = role;
    const updatedUser = await user.save();
    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      phoneNumber: updatedUser.phoneNumber,
      role: updatedUser.role,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Admin: Delete a user
// @route   DELETE /api/users/admin/:id
// @access  Private/Admin
const adminDeleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    if (user.role === 'admin') {
      return res.status(403).json({ message: 'Cannot delete admin users' });
    }
    await User.deleteOne({ _id: user._id });
    res.json({ message: 'User removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

module.exports = {
  authFirebaseUser,
  getUserProfile,
  updateUserProfile,
  getAllUsers,
  upgradeToHost,
  adminUpdateUserRole,
  adminDeleteUser,
};
