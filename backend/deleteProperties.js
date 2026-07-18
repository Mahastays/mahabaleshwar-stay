const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Property = require('./models/propertyModel');
const connectDB = require('./config/db');

dotenv.config();

const deleteDummyProperties = async () => {
  try {
    await connectDB();
    await Property.deleteMany();
    console.log('All dummy properties have been successfully deleted from the live database!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error}`);
    process.exit(1);
  }
};

deleteDummyProperties();
