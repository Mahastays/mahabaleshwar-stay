const Explore = require('../models/exploreModel');

// @desc    Get all explore places
// @route   GET /api/explore
// @access  Public
const getExplorePlaces = async (req, res) => {
  try {
    const places = await Explore.find({}).sort({ isFeatured: -1, name: 1 });
    res.json(places);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Get single explore place by slug or id
// @route   GET /api/explore/:slug
// @access  Public
const getExplorePlace = async (req, res) => {
  try {
    const { slug } = req.params;
    // Try slug first, then _id
    let place = await Explore.findOne({ slug });
    if (!place) {
      place = await Explore.findById(slug).catch(() => null);
    }
    if (!place) {
      return res.status(404).json({ message: 'Place not found' });
    }
    res.json(place);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Create an explore place
// @route   POST /api/explore
// @access  Private/Admin
const createExplorePlace = async (req, res) => {
  try {
    const {
      name, slug, tagline, description, history,
      images, bestTime, thingsToDo, category,
      entryFee, distance, isFeatured,
    } = req.body;

    const place = new Explore({
      name, slug, tagline, description, history,
      images, bestTime, thingsToDo, category,
      entryFee, distance, isFeatured,
    });

    const createdPlace = await place.save();
    res.status(201).json(createdPlace);
  } catch (error) {
    res.status(400).json({ message: 'Invalid data', error: error.message });
  }
};

// @desc    Update an explore place
// @route   PUT /api/explore/:id
// @access  Private/Admin
const updateExplorePlace = async (req, res) => {
  try {
    const place = await Explore.findById(req.params.id);
    if (!place) {
      return res.status(404).json({ message: 'Place not found' });
    }

    const fields = [
      'name', 'slug', 'tagline', 'description', 'history',
      'images', 'bestTime', 'thingsToDo', 'category',
      'entryFee', 'distance', 'isFeatured',
    ];

    fields.forEach((field) => {
      if (req.body[field] !== undefined) {
        place[field] = req.body[field];
      }
    });

    const updated = await place.save();
    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: 'Invalid data', error: error.message });
  }
};

// @desc    Delete an explore place
// @route   DELETE /api/explore/:id
// @access  Private/Admin
const deleteExplorePlace = async (req, res) => {
  try {
    const place = await Explore.findById(req.params.id);
    if (!place) {
      return res.status(404).json({ message: 'Place not found' });
    }
    await Explore.deleteOne({ _id: place._id });
    res.json({ message: 'Place removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

module.exports = {
  getExplorePlaces,
  getExplorePlace,
  createExplorePlace,
  updateExplorePlace,
  deleteExplorePlace,
};
