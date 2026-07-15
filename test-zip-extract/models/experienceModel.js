const mongoose = require('mongoose');

const experienceSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    title: {
      type: String,
      required: [true, 'Please add a title for the experience'],
    },
    location: {
      type: String,
      required: [true, 'Please add a location'],
    },
    image: {
      type: String,
      required: [true, 'Please add an image URL'],
    },
    price: {
      type: Number,
      required: [true, 'Please add a price'],
    },
    duration: {
      type: String,
      required: [true, 'Please add a duration (e.g., "45 Minute (Per Round)")'],
    },
    rating: {
      type: Number,
      default: 0,
    },
    reviews: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Experience', experienceSchema);
