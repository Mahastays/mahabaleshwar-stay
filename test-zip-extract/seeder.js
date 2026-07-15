const mongoose = require('mongoose');
const dotenv = require('dotenv');
const properties = require('./data/mockProperties');
const Property = require('./models/propertyModel');
const User = require('./models/userModel');
const connectDB = require('./config/db');

dotenv.config();

connectDB();

const importData = async () => {
  try {
    await Property.deleteMany();
    await User.deleteMany();

    const createdUsers = await User.insertMany([
      { name: 'Admin User', email: 'admin@mahastays.com', firebaseUid: 'admin_uid', role: 'admin' },
      { name: 'Vendor User', email: 'vendor@mahastays.com', firebaseUid: 'vendor_uid', role: 'host' },
      { name: 'Customer User', email: 'user@mahastays.com', firebaseUid: 'user_uid', role: 'user' },
    ]);

    const vendorId = createdUsers[1]._id;

    const sampleProperties = properties.map((property) => {
      const { _id, ...rest } = property;
      return { ...rest, host: vendorId, status: 'approved' };
    });

    await Property.insertMany(sampleProperties);

    console.log('Data Imported!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error}`);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await Property.deleteMany();
    await User.deleteMany();

    console.log('Data Destroyed!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error}`);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}
