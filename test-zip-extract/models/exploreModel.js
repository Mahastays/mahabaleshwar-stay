const mongoose = require('mongoose');

const exploreSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a place name'],
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    tagline: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: [true, 'Please add a description'],
    },
    history: {
      type: String,
      required: [true, 'Please add the history of this place'],
    },
    images: {
      type: [String],
      required: [true, 'Please add at least one image'],
    },
    bestTime: {
      type: String,
      required: [true, 'Please add the best time to visit'],
    },
    thingsToDo: {
      type: [String],
      default: [],
    },
    category: {
      type: String,
      enum: ['Viewpoint', 'Lake', 'Fort', 'Temple', 'Nature', 'Market', 'Adventure'],
      default: 'Nature',
    },
    entryFee: {
      type: String,
      default: 'Free',
    },
    distance: {
      type: String,
      default: 'Within Mahabaleshwar',
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Explore', exploreSchema);
