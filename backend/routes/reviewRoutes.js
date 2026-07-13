const express = require('express');
const router = express.Router();
const {
  getPropertyReviews,
  createReview,
  deleteReview,
  checkCanReview,
} = require('../controllers/reviewController');
const { protect } = require('../middleware/authMiddleware');

// Public: Get all reviews for a property
router.get('/property/:propertyId', getPropertyReviews);

// Private: Check if logged-in user can review a property
router.get('/can-review/:propertyId', protect, checkCanReview);

// Private: Create a review
router.post('/', protect, createReview);

// Private: Delete a review (own review or admin)
router.delete('/:id', protect, deleteReview);

module.exports = router;
