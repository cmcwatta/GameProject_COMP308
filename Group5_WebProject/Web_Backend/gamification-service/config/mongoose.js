import mongoose from 'mongoose';
import config from './config.js';

export const connectDB = async () => {
  try {
    await mongoose.connect(config.mongodbUri, {
      retryWrites: true,
      w: 'majority',
    });
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

export const disconnectDB = async () => {
  try {
    await mongoose.disconnect();
    console.log('MongoDB disconnected');
  } catch (error) {
    console.error('MongoDB disconnection error:', error);
  }
};

export default { connectDB, disconnectDB };
