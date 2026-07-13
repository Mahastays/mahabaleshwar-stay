const Review = require('../models/reviewModel');
const Booking = require('../models/bookingModel');

// @desc    Get all reviews for a property
// @route   GET /api/reviews/property/:propertyId
// @access  Public
const getPropertyReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ property: req.params.propertyId })
      .populate('user', 'name')
      .sort({ createdAt: -1 });

    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Create a review
// @route   POST /api/reviews
// @access  Private (customer who has a confirmed booking)
const createReview = async (req, res) => {
  const { propertyId, bookingId, rating, title, comment } = req.body;

  try {
    // 1. Check if the booking exists and belongs to this user
    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (booking.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'You can only review bookings you made' });
    }

    // 2. Check if the booking is for the right property
    if (booking.property.toString() !== propertyId) {
      return res.status(400).json({ message: 'Booking does not match this property' });
    }

    // 3. Check if booking is confirmed (not cancelled/pending)
    if (booking.status !== 'confirmed') {
      return res.status(400).json({ message: 'You can only review properties from confirmed bookings' });
    }

    // 4. Check if the checkout date has passed (can't review before staying)
    const now = new Date();
    if (new Date(booking.checkOutDate) > now) {
      return res.status(400).json({ message: 'You can only review a property after your stay is complete' });
    }

    // 5. Check if a review already exists for this booking
    const existingReview = await Review.findOne({ booking: bookingId });
    if (existingReview) {
      return res.status(400).json({ message: 'You have already reviewed this stay' });
    }

    // 6. Create the review
    const review = await Review.create({
      property: propertyId,
      user: req.user._id,
      booking: bookingId,
      rating,
      title,
      comment,
    });

    const populatedReview = await review.populate('user', 'name');

    res.status(201).json(populatedReview);
  } catch (error) {
    // Handle duplicate booking index error
    if (error.code === 11000) {
      return res.status(400).json({ message: 'You have already reviewed this stay' });
    }
    res.status(400).json({ message: 'Failed to create review', error: error.message });
  }
};

// @desc    Delete a review
// @route   DELETE /api/reviews/:id
// @access  Private (owner of the review or admin)
const deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    // Check if the user is the owner or an admin
    if (review.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this review' });
    }

    await review.deleteOne();

    res.json({ message: 'Review removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Check if user can review a property (has eligible booking)
// @route   GET /api/reviews/can-review/:propertyId
// @access  Private
const checkCanReview = async (req, res) => {
  try {
    const now = new Date();

    // Find a confirmed booking for this property by this user that has already checked out
    const eligibleBooking = await Booking.findOne({
      user: req.user._id,
      property: req.params.propertyId,
      status: 'confirmed',
      checkOutDate: { $lte: now },
    });

    if (!eligibleBooking) {
      return res.json({ canReview: false, reason: 'No completed stays found for this property' });
    }

    // Check if they've already reviewed this booking
    const existingReview = await Review.findOne({ booking: eligibleBooking._id });
    if (existingReview) {
      return res.json({ canReview: false, reason: 'Already reviewed', existingReview });
    }

    res.json({ canReview: true, bookingId: eligibleBooking._id });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

module.exports = {
  getPropertyReviews,
  createReview,
  deleteReview,
  checkCanReview,
};
