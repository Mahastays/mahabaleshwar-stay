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

module.exports = router;
