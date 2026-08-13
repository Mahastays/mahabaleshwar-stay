const mongoose = require('mongoose');

const packageSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add a package title'],
    },
    description: {
      type: String,
      required: [true, 'Please add a package description'],
    },
    price: {
      type: Number,
      required: [true, 'Please add a price for the package'],
    },
    originalPrice: {
      type: Number,
      default: 0,
    },
    duration: {
      type: String,
      required: [true, 'Please add duration (e.g., "2 Days, 1 Night")'],
    },
    properties: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Property',
      }
    ],
    experiences: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Experience',
      }
    ],
    explore: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Explore',
      }
    ],
    images: {
      type: [String],
      required: [true, 'Please add at least one image'],
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    }
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Package', packageSchema);
