const express = require('express');
const router = express.Router();
const {
  createBooking,
  getMyBookings,
  getHostBookings,
  updateBookingStatus,
} = require('../controllers/bookingController');
const { protect, host } = require('../middleware/authMiddleware');

router.route('/').post(protect, createBooking);
router.route('/mybookings').get(protect, getMyBookings);
router.route('/host').get(protect, host, getHostBookings);
router.route('/:id/status').put(protect, host, updateBookingStatus);

module.exports = router;
