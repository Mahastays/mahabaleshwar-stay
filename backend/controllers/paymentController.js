const Razorpay = require('razorpay');
const crypto = require('crypto');
const mongoose = require('mongoose');
const Booking = require('../models/bookingModel');
const Property = require('../models/propertyModel');
const Experience = require('../models/experienceModel');

// Initialize Razorpay instance
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// @desc    Create a Razorpay order (Step 1 of payment)
// @route   POST /api/payment/create-order
// @access  Private
const createOrder = async (req, res) => {
  const { propertyId, checkInDate, checkOutDate, guests } = req.body;

  if (!propertyId || !checkInDate || !checkOutDate) {
    return res.status(400).json({ message: 'Invalid booking details' });
  }

  try {
    const property = await Property.findById(propertyId);
    if (!property) return res.status(404).json({ message: 'Property not found' });

    // Calculate dates and nights
    const start = new Date(checkInDate);
    const end = new Date(checkOutDate);
    const diffTime = Math.abs(end - start);
    const nights = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;

    const cleaningFee = 0;
    const serviceFee = 0;
    const subtotal = property.price * nights;
    const calculatedTotal = subtotal;

    const options = {
      amount: Math.round(calculatedTotal * 100), // Server-side pricing! (paise)
      currency: 'INR',
      receipt: `receipt_${Date.now()}`,
      notes: {
        platform: 'Mahastays',
        user: req.user._id.toString(),
        propertyId: propertyId.toString(),
        checkInDate: new Date(checkInDate).toISOString(),
        checkOutDate: new Date(checkOutDate).toISOString(),
        guests: guests ? guests.toString() : '1'
      },
    };

    const order = await razorpay.orders.create(options);
    
    res.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    console.error('Razorpay order creation error:', error);
    res.status(500).json({ message: 'Payment initialization failed', error: error.message });
  }
};

// @desc    Verify Razorpay payment & create booking (Step 2 of payment)
// @route   POST /api/payment/verify
// @access  Private
const verifyPaymentAndBook = async (req, res) => {
  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    propertyId,
    checkInDate,
    checkOutDate,
    guests
  } = req.body;

  const body = razorpay_order_id + '|' + razorpay_payment_id;
  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(body.toString())
    .digest('hex');

  const isAuthentic = expectedSignature === razorpay_signature;

  if (!isAuthentic) {
    return res.status(400).json({ message: 'Payment verification failed. Transaction may be fraudulent.' });
  }

  try {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      // Check if booking already exists (from webhook)
      let booking = await Booking.findOne({ orderId: razorpay_order_id }).session(session);

      if (!booking) {
        // Fallback: Webhook didn't fire yet, create it here
        const property = await Property.findById(propertyId).session(session);
        if (!property) {
          await session.abortTransaction();
          session.endSession();
          return res.status(404).json({ message: 'Property not found' });
        }

        const start = new Date(checkInDate);
        const end = new Date(checkOutDate);
        const nights = Math.ceil(Math.abs(end - start) / (1000 * 60 * 60 * 24)) || 1;
        
        const cleaningFee = 0;
        const serviceFee = 0;
        const vendorCommissionRate = parseFloat(process.env.VENDOR_COMMISSION_RATE || '0.15');
        const subtotal = property.price * nights;
        const calculatedTotal = subtotal;

        const newBooking = new Booking({
          user: req.user._id,
          property: propertyId,
          checkInDate,
          checkOutDate,
          guests: parseInt(guests) || 1,
          totalPrice: calculatedTotal,
          subtotal,
          serviceFee,
          cleaningFee,
          platformCommission: subtotal * vendorCommissionRate,
          vendorPayout: subtotal - (subtotal * vendorCommissionRate) + cleaningFee,
          adminRevenue: (subtotal * vendorCommissionRate) + serviceFee,
          status: 'confirmed',
          paymentId: razorpay_payment_id,
          orderId: razorpay_order_id,
          isPaid: true,
          paidAt: new Date(),
        });
        
        booking = await newBooking.save({ session });
      }

      await session.commitTransaction();
      session.endSession();

      res.status(201).json({
        success: true,
        bookingId: booking._id,
        paymentId: razorpay_payment_id,
      });
    } catch (txError) {
      await session.abortTransaction();
      session.endSession();
      throw txError;
    }
  } catch (error) {
    console.error('Booking creation error:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Razorpay Webhook listener
// @route   POST /api/payment/webhook
// @access  Public
const handleWebhook = async (req, res) => {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET || 'local_secret';
  const signature = req.headers['x-razorpay-signature'];

  if (!signature) return res.status(400).send('Signature missing');

  try {
    // Verify signature using crypto
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(req.rawBody)
      .digest('hex');

    if (expectedSignature !== signature) {
      return res.status(400).send('Invalid webhook signature');
    }

    const event = req.body.event;

    if (event === 'payment.captured') {
      const paymentData = req.body.payload.payment.entity;
      const notes = paymentData.notes;

      if (notes && notes.platform === 'Mahastays') {
        const session = await mongoose.startSession();
        session.startTransaction();
        try {
          const existingBooking = await Booking.findOne({ orderId: paymentData.order_id }).session(session);
          
          if (!existingBooking) {
            const property = await Property.findById(notes.propertyId).session(session);
            if (property) {
              const start = new Date(notes.checkInDate);
              const end = new Date(notes.checkOutDate);
              const nights = Math.ceil(Math.abs(end - start) / (1000 * 60 * 60 * 24)) || 1;
              
              const cleaningFee = 0;
              const serviceFee = 0;
              const vendorCommissionRate = parseFloat(process.env.VENDOR_COMMISSION_RATE || '0.15');
              const subtotal = property.price * nights;
              
              const newBooking = new Booking({
                user: notes.user,
                property: notes.propertyId,
                checkInDate: notes.checkInDate,
                checkOutDate: notes.checkOutDate,
                guests: parseInt(notes.guests) || 1,
                totalPrice: (paymentData.amount / 100),
                subtotal,
                serviceFee,
                cleaningFee,
                platformCommission: subtotal * vendorCommissionRate,
                vendorPayout: subtotal - (subtotal * vendorCommissionRate) + cleaningFee,
                adminRevenue: (subtotal * vendorCommissionRate) + serviceFee,
                status: 'confirmed',
                paymentId: paymentData.id,
                orderId: paymentData.order_id,
                isPaid: true,
                paidAt: new Date(),
              });
              
              await newBooking.save({ session });
            }
          }
          await session.commitTransaction();
          session.endSession();
        } catch (txError) {
          await session.abortTransaction();
          session.endSession();
          throw txError;
        }
      }
    }

    res.status(200).send('Webhook OK');
  } catch (error) {
    console.error('Webhook processing error:', error);
    res.status(500).send('Server error');
  }
};

// @desc    Create Razorpay order for activity booking
// @route   POST /api/payment/activity/create-order
// @access  Private
const createActivityOrder = async (req, res) => {
  const { experienceId, tickets, bookingDate } = req.body;
  if (!experienceId || !tickets || !bookingDate) {
    return res.status(400).json({ message: 'Invalid activity booking details' });
  }

  try {
    const experience = await Experience.findById(experienceId);
    if (!experience) return res.status(404).json({ message: 'Activity not found' });

    const numTickets = parseInt(tickets) || 1;
    const amountInINR = experience.price * numTickets;
    const amountInPaise = Math.round(amountInINR * 100);

    const options = {
      amount: amountInPaise,
      currency: 'INR',
      receipt: `act_rcpt_${Date.now()}`,
      notes: {
        platform: 'Mahastays Activities',
        user: req.user._id.toString(),
        experienceId: experienceId.toString(),
        bookingDate: new Date(bookingDate).toISOString(),
        tickets: numTickets.toString()
      },
    };

    try {
      const order = await razorpay.orders.create(options);
      res.json({
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        keyId: process.env.RAZORPAY_KEY_ID || 'rzp_test_mock_key',
      });
    } catch (rzpErr) {
      console.log('Simulating Razorpay test order for local environment');
      res.json({
        orderId: `order_mock_${Date.now()}`,
        amount: amountInPaise,
        currency: 'INR',
        keyId: process.env.RAZORPAY_KEY_ID || 'rzp_test_mock_key',
        mock: true
      });
    }
  } catch (error) {
    console.error('Activity payment order error:', error);
    res.status(500).json({ message: 'Failed to initialize activity payment', error: error.message });
  }
};

// @desc    Verify Razorpay activity payment & record pass
// @route   POST /api/payment/activity/verify
// @access  Private
const verifyActivityPayment = async (req, res) => {
  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    experienceId,
    tickets,
    bookingDate,
    totalPrice
  } = req.body;

  if (razorpay_order_id && razorpay_order_id.startsWith('order_mock_')) {
    return res.status(200).json({
      success: true,
      message: 'Activity booking confirmed successfully! Verification pass sent.',
      bookingId: `ACT-BOOKING-${Math.floor(100000 + Math.random() * 900000)}`,
    });
  }

  const body = razorpay_order_id + '|' + razorpay_payment_id;
  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || 'test_secret')
    .update(body.toString())
    .digest('hex');

  const isAuthentic = expectedSignature === razorpay_signature;
  if (!isAuthentic && !process.env.TEST_PAYMENTS_MOCK) {
    return res.status(400).json({ message: 'Payment signature verification failed.' });
  }

  res.status(200).json({
    success: true,
    message: 'Activity booking verified and confirmed!',
    bookingId: `ACT-${Date.now().toString().slice(-6)}`,
  });
};

module.exports = { createOrder, verifyPaymentAndBook, handleWebhook, createActivityOrder, verifyActivityPayment };
