const Booking = require('../models/bookingModel');
const Property = require('../models/propertyModel');

// @desc    Create new booking
// @route   POST /api/bookings
// @access  Private
const createBooking = async (req, res) => {
  try {
    const { property, checkInDate, checkOutDate, guests, totalPrice } = req.body;

    if (!property || !checkInDate || !checkOutDate || !guests || !totalPrice) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    const booking = new Booking({
      user: req.user._id,
      property,
      checkInDate,
      checkOutDate,
      guests,
      totalPrice,
    });

    const createdBooking = await booking.save();
    res.status(201).json(createdBooking);
  } catch (error) {
    res.status(400).json({ message: 'Invalid booking data', error: error.message });
  }
};

// @desc    Get logged in user's bookings
// @route   GET /api/bookings/mybookings
// @access  Private
const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id }).populate('property', 'title images location');
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Get bookings for host's properties
// @route   GET /api/bookings/host
// @access  Private/Host
const getHostBookings = async (req, res) => {
  try {
    // 1. Find all properties owned by this host
    const properties = await Property.find({ host: req.user._id }).select('_id');
    const propertyIds = properties.map(p => p._id);

    // 2. Find bookings that reference those properties
    const bookings = await Booking.find({ property: { $in: propertyIds } })
      .populate('property', 'title')
      .populate('user', 'name email phoneNumber');
      
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Update booking status
// @route   PUT /api/bookings/:id/status
// @access  Private/Host
const updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const booking = await Booking.findById(req.params.id).populate('property');

    if (booking) {
      // Security: Check ownership
      if (booking.property.host.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Forbidden: You do not own the property for this booking' });
      }

      booking.status = status;
      const updatedBooking = await booking.save();
      res.json(updatedBooking);
    } else {
      res.status(404).json({ message: 'Booking not found' });
    }
  } catch (error) {
    res.status(400).json({ message: 'Invalid data', error: error.message });
  }
};

module.exports = {
  createBooking,
  getMyBookings,
  getHostBookings,
  updateBookingStatus,
};
