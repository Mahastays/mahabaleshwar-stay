const VendorRequest = require('../models/vendorRequestModel');
const User = require('../models/userModel');

// @desc    Submit vendor request
// @route   POST /api/vendors/request
// @access  Private
const submitVendorRequest = async (req, res) => {
  try {
    const { businessName, taxId, address, bankDetails } = req.body;

    // Check if user already has a pending or approved request
    const existingRequest = await VendorRequest.findOne({ user: req.user._id });
    if (existingRequest && existingRequest.status !== 'rejected') {
      return res.status(400).json({ message: 'You already have a pending or approved vendor request' });
    }

    if (existingRequest && existingRequest.status === 'rejected') {
      // Re-apply
      existingRequest.businessName = businessName;
      existingRequest.taxId = taxId;
      existingRequest.address = address;
      if (bankDetails) existingRequest.bankDetails = bankDetails;
      existingRequest.status = 'pending';
      const updatedRequest = await existingRequest.save();
      return res.status(200).json(updatedRequest);
    }

    const vendorRequest = await VendorRequest.create({
      user: req.user._id,
      businessName,
      taxId,
      address,
      bankDetails,
    });

    res.status(201).json(vendorRequest);
  } catch (error) {
    console.error('Error submitting vendor request:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get user's own vendor request
// @route   GET /api/vendors/request/me
// @access  Private
const getMyVendorRequest = async (req, res) => {
  try {
    const request = await VendorRequest.findOne({ user: req.user._id });
    if (!request) {
      return res.status(404).json({ message: 'No vendor request found' });
    }
    res.json(request);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get all vendor requests (admin only)
// @route   GET /api/vendors/admin/requests
// @access  Private/Admin
const getAllVendorRequests = async (req, res) => {
  try {
    const requests = await VendorRequest.find({}).populate('user', 'name email phoneNumber');
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Approve or reject a vendor request
// @route   PUT /api/vendors/admin/requests/:id
// @access  Private/Admin
const updateVendorRequestStatus = async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const request = await VendorRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    request.status = status;
    const updatedRequest = await request.save();

    if (status === 'approved') {
      // Upgrade user to host
      const user = await User.findById(request.user);
      if (user) {
        user.role = 'host';
        await user.save();
      }
    } else if (status === 'rejected') {
      // Downgrade back to user if they were a host? (Optional, safe bet is just leave them or set to 'user')
      const user = await User.findById(request.user);
      if (user && user.role === 'host') {
        user.role = 'user';
        await user.save();
      }
    }

    res.json(updatedRequest);
  } catch (error) {
    console.error('Error updating vendor request:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = {
  submitVendorRequest,
  getMyVendorRequest,
  getAllVendorRequests,
  updateVendorRequestStatus,
};
