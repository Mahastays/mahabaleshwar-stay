const mongoose = require('mongoose');

const bookingSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    property: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Property',
    },
    checkInDate: {
      type: Date,
      required: [true, 'Please add a check-in date'],
    },
    checkOutDate: {
      type: Date,
      required: [true, 'Please add a check-out date'],
    },
    guests: {
      type: Number,
      required: [true, 'Please add number of guests'],
    },
    totalPrice: {
      type: Number,
      required: [true, 'Please add total price'],
    },
    subtotal: {
      type: Number,
    },
    serviceFee: {
      type: Number,
    },
    cleaningFee: {
      type: Number,
    },
    platformCommission: {
      type: Number,
    },
    vendorPayout: {
      type: Number,
    },
    adminRevenue: {
      type: Number,
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'cancelled'],
      default: 'pending',
    },
    // Payment tracking fields
    paymentId: { type: String },
    orderId: { type: String },
    isPaid: { type: Boolean, default: false },
    paidAt: { type: Date },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Booking', bookingSchema);
