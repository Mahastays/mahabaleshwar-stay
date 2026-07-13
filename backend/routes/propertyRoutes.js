const express = require('express');
const router = express.Router();
const {
  getProperties,
  getProviderProperties,
  getAllPropertiesAdmin,
  getPropertyById,
  createProperty,
  updateProperty,
  updatePropertyStatus,
  togglePropertyFeatured,
  deleteProperty,
} = require('../controllers/propertyController');
const { protect, host, admin } = require('../middleware/authMiddleware');

router.route('/').get(getProperties).post(protect, host, createProperty);
router.route('/host').get(protect, host, getProviderProperties);
router.route('/admin/all').get(protect, admin, getAllPropertiesAdmin);
router.route('/:id/status').put(protect, admin, updatePropertyStatus);
router.route('/:id/featured').put(protect, admin, togglePropertyFeatured);
router.route('/:id').get(getPropertyById).put(protect, host, updateProperty).delete(protect, host, deleteProperty);

module.exports = router;
