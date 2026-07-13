const express = require('express');
const router = express.Router();
const { authFirebaseUser, getUserProfile, updateUserProfile, getAllUsers, upgradeToHost, adminUpdateUserRole, adminDeleteUser } = require('../controllers/userController');
const { protect, admin } = require('../middleware/authMiddleware');

router.post('/auth', authFirebaseUser);
router.route('/profile').get(protect, getUserProfile).put(protect, updateUserProfile);
router.route('/upgrade-to-host').put(protect, upgradeToHost);
router.route('/admin/all').get(protect, admin, getAllUsers);
router.route('/admin/:id/role').put(protect, admin, adminUpdateUserRole);
router.route('/admin/:id').delete(protect, admin, adminDeleteUser);

module.exports = router;
