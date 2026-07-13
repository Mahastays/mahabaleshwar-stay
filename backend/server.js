const express = require('express');
const path = require('path');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/db');

// Route imports
const propertyRoutes = require('./routes/propertyRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const userRoutes = require('./routes/userRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const exploreRoutes = require('./routes/exploreRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const adminRoutes = require('./routes/adminRoutes');
const experienceRoutes = require('./routes/experienceRoutes');
const vendorRoutes = require('./routes/vendorRoutes');

connectDB();
const app = express();

// 1. Set security HTTP headers
app.use(helmet());

// 2. Strict CORS policy
app.use(cors({
  origin: ['http://localhost:3000', 'https://mahastays.com'], 
  credentials: true,
}));

// 3. Rate limiting 
const limiter = rateLimit({
  max: 1000, // Increased limit for SPA architecture
  windowMs: 15 * 60 * 1000, 
  message: 'Too many requests from this IP, please try again in 15 minutes.'
});
app.use('/api', limiter);

// 4. Body parser
app.use(express.json({ limit: '10kb' })); 

// 5. Custom NoSQL Sanitization (Express 5 compatible)
const sanitizeNoSQL = (obj) => {
  if (obj instanceof Object) {
    for (const key in obj) {
      if (key.startsWith('$')) {
        delete obj[key];
      } else {
        sanitizeNoSQL(obj[key]);
      }
    }
  }
};
app.use((req, res, next) => {
  if (req.body) sanitizeNoSQL(req.body);
  if (req.params) sanitizeNoSQL(req.params);
  next();
});

// 6. Data sanitization against XSS
// app.use(xss()); // Incompatible with Express 5 (req.query is read-only)

// 7. Routes
app.use('/api/properties', propertyRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/users', userRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/explore', exploreRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/experiences', experienceRoutes);
app.use('/api/vendors', vendorRoutes);

app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

app.get('/', (req, res) => {
  res.send('Mahabaleshwar Stay API is running...');
});

// 8. Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled Error:', err.stack);
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
    stack: process.env.NODE_ENV === 'development' ? err.stack : null,
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, console.log(`Server running on port ${PORT}`));
