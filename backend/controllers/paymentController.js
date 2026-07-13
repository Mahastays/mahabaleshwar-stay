const Razorpay = require('razorpay');
const crypto = require('crypto');
const Booking = require('../models/bookingModel');
const Property = require('../models/propertyModel');

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

    // Hardcoded fees
    const cleaningFee = 1500;
    const serviceFee = 3800;
    const subtotal = property.price * nights;
    const calculatedTotal = subtotal + cleaningFee + serviceFee;

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
    // Check if booking already exists (from webhook)
    let booking = await Booking.findOne({ orderId: razorpay_order_id });

    if (!booking) {
      // Fallback: Webhook didn't fire yet, create it here
      const property = await Property.findById(propertyId);
      if (!property) return res.status(404).json({ message: 'Property not found' });

      const start = new Date(checkInDate);
      const end = new Date(checkOutDate);
      const nights = Math.ceil(Math.abs(end - start) / (1000 * 60 * 60 * 24)) || 1;
      
      const cleaningFee = 1500;
      const serviceFee = 3800;
      const vendorCommissionRate = 0.15;
      const subtotal = property.price * nights;
      const calculatedTotal = subtotal + cleaningFee + serviceFee;

      booking = await Booking.create({
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
    }

    res.status(201).json({
      success: true,
      bookingId: booking._id,
      paymentId: razorpay_payment_id,
    });
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
      .update(JSON.stringify(req.body))
      .digest('hex');

    if (expectedSignature !== signature) {
      return res.status(400).send('Invalid webhook signature');
    }

    const event = req.body.event;

    if (event === 'payment.captured') {
      const paymentData = req.body.payload.payment.entity;
      const notes = paymentData.notes;

      if (notes && notes.platform === 'Mahastays') {
        const existingBooking = await Booking.findOne({ orderId: paymentData.order_id });
        
        if (!existingBooking) {
          const property = await Property.findById(notes.propertyId);
          if (property) {
            const start = new Date(notes.checkInDate);
            const end = new Date(notes.checkOutDate);
            const nights = Math.ceil(Math.abs(end - start) / (1000 * 60 * 60 * 24)) || 1;
            
            const cleaningFee = 1500;
            const serviceFee = 3800;
            const vendorCommissionRate = 0.15;
            const subtotal = property.price * nights;
            
            await Booking.create({
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
          }
        }
      }
    }

    res.status(200).send('Webhook OK');
  } catch (error) {
    console.error('Webhook processing error:', error);
    res.status(500).send('Server error');
  }
};

module.exports = { createOrder, verifyPaymentAndBook, handleWebhook };
