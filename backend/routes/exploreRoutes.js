const express = require('express');
const router = express.Router();
const {
  getExplorePlaces,
  getExplorePlace,
  createExplorePlace,
  updateExplorePlace,
  deleteExplorePlace,
} = require('../controllers/exploreController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/')
  .get(getExplorePlaces)
  .post(protect, admin, createExplorePlace);

router.route('/:slug')
  .get(getExplorePlace);

router.route('/:id/update')
  .put(protect, admin, updateExplorePlace);

router.route('/:id/delete')
  .delete(protect, admin, deleteExplorePlace);

module.exports = router;
