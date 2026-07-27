const express = require('express');
const router = express.Router();
const {
  getStories,
  createStory,
  updateStory,
  deleteStory,
} = require('../controllers/storyController');
const { protect, admin } = require('../middleware/authMiddleware');

// Get all stories (public), Create new story (admin strictly)
router.route('/')
  .get(getStories)
  .post(protect, admin, createStory);

// Update or delete story (admin strictly)
router.route('/:id')
  .put(protect, admin, updateStory)
  .delete(protect, admin, deleteStory);

module.exports = router;
