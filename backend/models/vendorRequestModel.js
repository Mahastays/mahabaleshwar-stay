const mongoose = require('mongoose');

const vendorRequestSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    businessName: {
      type: String,
      required: true,
    },
    taxId: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    bankDetails: {
      accountName: { type: String, required: true },
      accountNumber: { type: String, required: true },
      ifscCode: { type: String, required: true },
      bankName: { type: String, required: true },
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

const VendorRequest = mongoose.model('VendorRequest', vendorRequestSchema);

module.exports = VendorRequest;
