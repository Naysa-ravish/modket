const mongoose = require('mongoose');

const connectDB = async () => {
  const uri = process.env.MONGO_URI;

  if (!uri) {
    throw new Error('MONGO_URI not provided');
  }

  try {
    mongoose.set('strictQuery', true);
    await mongoose.connect(uri, {
      dbName: process.env.MONGO_DB || 'modket',
    });
    console.log('✅ MongoDB connected');
  } catch (error) {
    console.error('❌ MongoDB connection failed', error);
    process.exit(1);
  }
};

module.exports = connectDB;

