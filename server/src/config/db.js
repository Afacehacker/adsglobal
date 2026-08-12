const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    let connStr = (process.env.MONGODB_URI || '').trim().replace(/^["']|["']$/g, '');
    
    if (!connStr || (!connStr.startsWith('mongodb://') && !connStr.startsWith('mongodb+srv://'))) {
      console.warn('Warning: Invalid or unconfigured MONGODB_URI. Falling back to local MongoDB connection...');
      connStr = 'mongodb://127.0.0.1:27017/adsglobal';
    }

    const conn = await mongoose.connect(connStr, {
      autoIndex: true,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
