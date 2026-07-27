const express = require('express');
const router = express.Router();
const { createOrder, verifyPaymentAndBook, handleWebhook } = require('../controllers/paymentController');
const { protect } = require('../middleware/authMiddleware');

// Create a Razorpay order (requires login)
router.post('/create-order', protect, createOrder);

// Verify payment & create booking (requires login)
router.post('/verify', protect, verifyPaymentAndBook);

// Razorpay Webhook (public access, verified via signature)
router.post('/webhook', handleWebhook);

// Activity payment routes (requires login)
router.post('/activity/create-order', protect, require('../controllers/paymentController').createActivityOrder);
router.post('/activity/verify', protect, require('../controllers/paymentController').verifyActivityPayment);

module.exports = router;
