const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Experience = require('./models/experienceModel');
const User = require('./models/userModel');
const connectDB = require('./config/db');

dotenv.config();

connectDB();

const importData = async () => {
  try {
    await Experience.deleteMany();

    // Find the admin user to assign as the creator (or just the first user)
    const adminUser = await User.findOne({ role: 'admin' });
    const fallbackUserId = adminUser ? adminUser._id : (await User.findOne())._id;

    const activities = [
      {
        user: fallbackUserId,
        image: 'https://images.unsplash.com/photo-1605281317010-fe5ffe798166?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        location: 'Tapola Eco & Agro Tourism, Tapola Road, Mahabaleshwar, Maharashtra, India',
        title: 'Speed Boat',
        price: 1000,
        duration: '45 Minute (Per Round)',
        status: 'approved',
      },
      {
        user: fallbackUserId,
        image: 'https://images.unsplash.com/photo-1565031491910-e57fac031c41?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        location: 'Tapola Eco & Agro Tourism, Tapola Road, Mahabaleshwar, Maharashtra, India',
        title: 'Motor Boat',
        price: 900,
        duration: 'Per Hour For 1 To 9 Person',
        status: 'approved',
      },
      {
        user: fallbackUserId,
        image: 'https://images.unsplash.com/photo-1596401057633-54a8fe8ef647?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        location: 'Red button Go karting and amusement park, Mahabaleshwar, Maharashtra, India',
        title: 'Train Ride',
        price: 100,
        duration: 'Per Round',
        status: 'approved',
      },
      {
        user: fallbackUserId,
        image: 'https://images.unsplash.com/photo-1571131644146-24e52f58e1c6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        location: 'Mapro Garden, Panchgani-Mahabaleshwar Road, Maharashtra, India',
        title: 'Go Karting',
        price: 350,
        duration: 'Per Round',
        status: 'approved',
      }
    ];

    await Experience.insertMany(activities);

    console.log('Experiences Data Imported!');
    process.exit();
  } catch (error) {
    console.error(`Error with data import: ${error}`);
    process.exit(1);
  }
};

importData();
