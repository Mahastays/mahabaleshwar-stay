const mongoose = require('mongoose');
const dns = require('dns');

// Use Google DNS to resolve MongoDB Atlas SRV records
// (fixes issues on networks that block SRV lookups)
dns.setServers(['8.8.8.8', '8.8.4.4']);

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.log(`MongoDB Connection Error (Check IP Whitelist!): ${error.message}`);
    // Do not process.exit(1) so the server stays up and we avoid Axios Network Errors on frontend
  }
};

module.exports = connectDB;
