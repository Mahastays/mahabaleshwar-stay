const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/userModel');
const connectDB = require('./config/db');

dotenv.config();

const upgradeToHost = async () => {
  try {
    await connectDB();
    const result = await User.updateMany({}, { $set: { role: 'host' } });
    console.log(`Successfully upgraded ${result.modifiedCount} users to host role!`);
    process.exit(0);
  } catch (error) {
    console.error('Error upgrading users:', error);
    process.exit(1);
  }
};

upgradeToHost();
