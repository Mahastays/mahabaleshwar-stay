const express = require('express');
const router = express.Router();
const {
  getExperiences,
  getAllExperiencesAdmin,
  createExperience,
  updateExperienceStatus,
  updateExperience,
  deleteExperience,
} = require('../controllers/experienceController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/')
  .get(getExperiences)
  .post(protect, createExperience);

router.get('/admin/all', protect, admin, getAllExperiencesAdmin);

router.route('/:id/status')
  .put(protect, admin, updateExperienceStatus);

router.route('/:id')
  .put(protect, admin, updateExperience)
  .delete(protect, admin, deleteExperience);

module.exports = router;
