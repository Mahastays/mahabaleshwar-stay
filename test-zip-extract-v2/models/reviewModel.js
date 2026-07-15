const mongoose = require('mongoose');

const reviewSchema = mongoose.Schema(
  {
    property: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Property',
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    // The booking that enables this review (ensures only guests who stayed can review)
    booking: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Booking',
    },
    rating: {
      type: Number,
      required: [true, 'Please add a rating between 1 and 5'],
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      required: [true, 'Please add a comment'],
      trim: true,
      maxlength: [500, 'Comment cannot be more than 500 characters'],
    },
    title: {
      type: String,
      required: [true, 'Please add a review title'],
      trim: true,
      maxlength: [100, 'Title cannot be more than 100 characters'],
    },
  },
  {
    timestamps: true,
  }
);

// Prevent user from reviewing the same property from the same booking more than once
reviewSchema.index({ booking: 1 }, { unique: true });

// --- Static method to calculate average rating ---
// This gets called every time a review is added or removed
reviewSchema.statics.calcAverageRating = async function (propertyId) {
  const stats = await this.aggregate([
    { $match: { property: propertyId } },
    {
      $group: {
        _id: '$property',
        numReviews: { $sum: 1 },
        avgRating: { $avg: '$rating' },
      },
    },
  ]);

  if (stats.length > 0) {
    await mongoose.model('Property').findByIdAndUpdate(propertyId, {
      reviews: stats[0].numReviews,
      rating: Math.round(stats[0].avgRating * 10) / 10, // Round to 1 decimal
    });
  } else {
    // No reviews left — reset to defaults
    await mongoose.model('Property').findByIdAndUpdate(propertyId, {
      reviews: 0,
      rating: 0,
    });
  }
};

// Middleware: Auto-calculate rating AFTER a review is saved
reviewSchema.post('save', function () {
  this.constructor.calcAverageRating(this.property);
});

// Middleware: Auto-recalculate rating AFTER a review is deleted
reviewSchema.post('deleteOne', { document: true, query: false }, function () {
  this.constructor.calcAverageRating(this.property);
});

module.exports = mongoose.model('Review', reviewSchema);
