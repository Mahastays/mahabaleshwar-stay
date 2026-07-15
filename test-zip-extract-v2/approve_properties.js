const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Property = require('./models/propertyModel');
const connectDB = require('./config/db');

dotenv.config();

const approveProperties = async () => {
  try {
    await connectDB();
    const result = await Property.updateMany({ status: 'pending' }, { $set: { status: 'approved' } });
    console.log(`Successfully approved ${result.modifiedCount} properties!`);
    process.exit(0);
  } catch (error) {
    console.error('Error approving properties:', error);
    process.exit(1);
  }
};

approveProperties();
