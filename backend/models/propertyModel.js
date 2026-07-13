const mongoose = require('mongoose');

const propertySchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add a title'],
    },
    description: {
      type: String,
      required: [true, 'Please add a description'],
    },
    price: {
      type: Number,
      required: [true, 'Please add a price'],
    },
    rating: {
      type: Number,
      default: 0,
    },
    reviews: {
      type: Number,
      default: 0,
    },
    images: {
      type: [String],
      required: [true, 'Please add at least one image'],
    },
    amenities: {
      type: [String],
    },
    type: {
      type: String,
      required: [true, 'Please add a property type (e.g., Resort, Homestay)'],
    },
    location: {
      type: String,
      required: [true, 'Please add a location'],
    },
    coordinates: {
      lat: {
        type: Number,
        required: false,
      },
      lng: {
        type: Number,
        required: false,
      }
    },
    host: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
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

module.exports = mongoose.model('Property', propertySchema);
