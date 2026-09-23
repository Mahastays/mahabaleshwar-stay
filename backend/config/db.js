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
    console.error(`MongoDB Connection Error (Check IP Whitelist & ENV!): ${error.message}`);
    console.error(`Make sure MONGO_URI is set in your environment variables.`);
    // We remove process.exit(1) so Beanstalk doesn't mark the instance as "Degraded" 
    // before the user has a chance to configure environment variables.
  }
};

module.exports = connectDB;
