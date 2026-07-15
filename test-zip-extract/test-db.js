const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("SUCCESS: Connected to MongoDB!");
    process.exit(0);
  })
  .catch((err) => {
    console.error("ERROR: Failed to connect to MongoDB:", err.message);
    process.exit(1);
  });
