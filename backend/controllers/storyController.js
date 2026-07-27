const Story = require('../models/storyModel');

const initialStories = [
  {
    category: 'TOURIST SPOTS',
    title: 'Temples of Mahabaleshwar',
    image: 'https://images.unsplash.com/photo-1601058268499-e52658b8bb88?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    excerpt: 'Mahabaleshwar, known for its temples and natural beauty, offers spiritual solace and rich historical significance, particularly through the ancient Panchganga Temple and Mahabaleshwar Temple.'
  },
  {
    category: 'TOURIST SPOTS',
    title: 'Mahabaleshwar Hill Station & Vistas',
    image: 'https://images.unsplash.com/photo-1623862660144-88001712a2aa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    excerpt: 'A scenic emerald hill station in Maharashtra, offering breathtaking misty landscapes, authentic strawberry delicacies, adventure activities, and royal Maratha cultural heritage.'
  },
  {
    category: 'TOURIST SPOTS',
    title: 'Mahabaleshwar Tiger Spring Point',
    image: 'https://images.unsplash.com/photo-1616053896425-c63bf7246ecf?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    excerpt: 'Tiger Spring Point in Mahabaleshwar offers serene natural beauty, crystal-clear spring waters, and fascinating folklore, attracting explorers, nature lovers, and travelers.'
  },
  {
    category: 'GUIDES & TREKKING',
    title: 'Mahabaleshwar Connaught Peak Trail',
    image: 'https://images.unsplash.com/photo-1592659762303-90081d34b277?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    excerpt: 'Connaught Peak in Mahabaleshwar offers panoramic 360-degree views, rich Western Ghat biodiversity, and total serenity, making it an idyllic spot for sunrise photographers and trekkers.'
  }
];

// @desc    Get all stories / blogs
// @route   GET /api/stories
// @access  Public
const getStories = async (req, res) => {
  try {
    const count = await Story.countDocuments();
    if (count === 0) {
      await Story.insertMany(initialStories);
    }
    const stories = await Story.find().sort({ createdAt: -1 });
    res.json(stories);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Create a new story (Admin only)
// @route   POST /api/stories
// @access  Private/Admin
const createStory = async (req, res) => {
  try {
    const { title, category, image, excerpt, content } = req.body;
    const story = new Story({
      title,
      category: category || 'TOURIST SPOTS',
      image,
      excerpt,
      content,
      user: req.user._id,
    });
    const createdStory = await story.save();
    res.status(201).json(createdStory);
  } catch (error) {
    res.status(400).json({ message: 'Invalid data', error: error.message });
  }
};

// @desc    Update a story (Admin only)
// @route   PUT /api/stories/:id
// @access  Private/Admin
const updateStory = async (req, res) => {
  try {
    const story = await Story.findById(req.params.id);
    if (!story) {
      return res.status(404).json({ message: 'Story not found' });
    }

    const fields = ['title', 'category', 'image', 'excerpt', 'content'];
    fields.forEach((field) => {
      if (req.body[field] !== undefined) {
        story[field] = req.body[field];
      }
    });

    const updatedStory = await story.save();
    res.json(updatedStory);
  } catch (error) {
    res.status(400).json({ message: 'Invalid data', error: error.message });
  }
};

// @desc    Delete a story (Admin only)
// @route   DELETE /api/stories/:id
// @access  Private/Admin
const deleteStory = async (req, res) => {
  try {
    const story = await Story.findById(req.params.id);
    if (!story) {
      return res.status(404).json({ message: 'Story not found' });
    }
    await story.deleteOne();
    res.json({ message: 'Story removed completely' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

module.exports = {
  getStories,
  createStory,
  updateStory,
  deleteStory,
};
