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
// @access  Private (customer users only)
const createReview = async (req, res) => {
  const { propertyId, rating, title, comment, bookingId } = req.body;

  try {
    // Strictly forbid property hosts from leaving ratings or reviews
    if (req.user.role === 'host') {
      return res.status(403).json({ message: 'Property hosts are strictly not permitted to submit ratings or reviews.' });
    }

    // Check if user has already reviewed this stay/property
    const existingReview = await Review.findOne({ property: propertyId, user: req.user._id });
    if (existingReview) {
      return res.status(400).json({ message: 'You have already posted a rating and review for this property.' });
    }

    // Create the review
    const review = await Review.create({
      property: propertyId,
      user: req.user._id,
      booking: bookingId || undefined,
      rating,
      title,
      comment,
    });

    const populatedReview = await review.populate('user', 'name');

    res.status(201).json(populatedReview);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'You have already posted a rating and review for this property.' });
    }
    res.status(400).json({ message: 'Failed to submit review', error: error.message });
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

// @desc    Check if user can review a property
// @route   GET /api/reviews/can-review/:propertyId
// @access  Private
const checkCanReview = async (req, res) => {
  try {
    // Strictly forbid property hosts from leaving ratings or reviews
    if (req.user.role === 'host') {
      return res.json({ canReview: false, reason: 'Property hosts are not permitted to review properties.' });
    }

    // Check if they've already reviewed this property
    const existingReview = await Review.findOne({ property: req.params.propertyId, user: req.user._id });
    if (existingReview) {
      return res.json({ canReview: false, reason: 'You have already reviewed this stay.', existingReview });
    }

    res.json({ canReview: true });
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
