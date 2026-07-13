const express = require('express');
const router = express.Router();
const { 
  submitVendorRequest, 
  getMyVendorRequest, 
  getAllVendorRequests, 
  updateVendorRequestStatus 
} = require('../controllers/vendorController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/request')
  .post(protect, submitVendorRequest);

router.route('/request/me')
  .get(protect, getMyVendorRequest);

router.route('/admin/requests')
  .get(protect, admin, getAllVendorRequests);

router.route('/admin/requests/:id')
  .put(protect, admin, updateVendorRequestStatus);

module.exports = router;
