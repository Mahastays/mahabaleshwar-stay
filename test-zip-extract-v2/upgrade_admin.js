const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/userModel');
const connectDB = require('./config/db');

dotenv.config();

const upgradeToAdmin = async () => {
  try {
    await connectDB();
    const result = await User.updateOne({ email: 'bookingmahastays@gmail.com' }, { $set: { role: 'admin' } });
    if (result.matchedCount > 0) {
      console.log(`Successfully upgraded bookingmahastays@gmail.com to admin role!`);
    } else {
      console.log(`User not found.`);
    }
    process.exit(0);
  } catch (error) {
    console.error('Error upgrading user:', error);
    process.exit(1);
  }
};

upgradeToAdmin();
