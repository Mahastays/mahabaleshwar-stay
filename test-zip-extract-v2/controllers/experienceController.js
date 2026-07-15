const Experience = require('../models/experienceModel');

// @desc    Get all approved experiences
// @route   GET /api/experiences
// @access  Public
const getExperiences = async (req, res) => {
  try {
    const experiences = await Experience.find({ status: 'approved' }).sort({ createdAt: -1 });
    res.json(experiences);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Get all experiences (admin only)
// @route   GET /api/experiences/admin/all
// @access  Private/Admin
const getAllExperiencesAdmin = async (req, res) => {
  try {
    const experiences = await Experience.find({}).sort({ createdAt: -1 }).populate('user', 'name email');
    res.json(experiences);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Create a new experience (Submit for approval)
// @route   POST /api/experiences
// @access  Private
const createExperience = async (req, res) => {
  try {
    const { title, location, image, price, duration } = req.body;

    const experience = new Experience({
      user: req.user._id,
      title,
      location,
      image,
      price,
      duration,
      status: 'pending', // Default status
    });

    const createdExperience = await experience.save();
    res.status(201).json(createdExperience);
  } catch (error) {
    res.status(400).json({ message: 'Invalid data', error: error.message });
  }
};

// @desc    Update experience status (Admin only)
// @route   PUT /api/experiences/:id/status
// @access  Private/Admin
const updateExperienceStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const experience = await Experience.findById(req.params.id);

    if (!experience) {
      return res.status(404).json({ message: 'Experience not found' });
    }

    experience.status = status;
    const updatedExperience = await experience.save();

    res.json(updatedExperience);
  } catch (error) {
    res.status(400).json({ message: 'Error updating status', error: error.message });
  }
};

// @desc    Update experience details (Admin only)
// @route   PUT /api/experiences/:id
// @access  Private/Admin
const updateExperience = async (req, res) => {
  try {
    const experience = await Experience.findById(req.params.id);
    if (!experience) {
      return res.status(404).json({ message: 'Experience not found' });
    }

    const fields = ['title', 'location', 'image', 'price', 'duration'];
    fields.forEach((field) => {
      if (req.body[field] !== undefined) {
        experience[field] = req.body[field];
      }
    });

    const updated = await experience.save();
    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: 'Invalid data', error: error.message });
  }
};

// @desc    Delete an experience (Admin only)
// @route   DELETE /api/experiences/:id
// @access  Private/Admin
const deleteExperience = async (req, res) => {
  try {
    const experience = await Experience.findById(req.params.id);
    if (!experience) {
      return res.status(404).json({ message: 'Experience not found' });
    }
    await Experience.deleteOne({ _id: experience._id });
    res.json({ message: 'Experience removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

module.exports = {
  getExperiences,
  getAllExperiencesAdmin,
  createExperience,
  updateExperienceStatus,
  updateExperience,
  deleteExperience,
};
