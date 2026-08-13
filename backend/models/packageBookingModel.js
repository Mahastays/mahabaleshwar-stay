const mongoose = require('mongoose');

const packageBookingSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    package: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Package',
    },
    dates: {
      startDate: {
        type: Date,
        required: true,
      },
      endDate: {
        type: Date,
        required: true,
      }
    },
    guests: {
      adults: {
        type: Number,
        required: true,
        default: 1,
      },
      children: {
        type: Number,
        required: true,
        default: 0,
      }
    },
    totalPrice: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'cancelled', 'completed'],
      default: 'pending',
    },
    paymentInfo: {
      id: {
        type: String,
      },
      status: {
        type: String,
      }
    }
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('PackageBooking', packageBookingSchema);
