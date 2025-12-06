import mongoose from 'mongoose';
import { config } from './config.js';

const connectDB = async () => {
  try {
    if (!config.db) {
      throw new Error("MongoDB URI is undefined. Check your environment variables.");
    }

    await mongoose.connect(config.db, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`✅ Issues Service connected to MongoDB at ${config.db}`);
    
    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB connection error:', err.message);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('⚠️  MongoDB disconnected');
    });

    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      console.log('⏹️  MongoDB connection closed through app termination');
      process.exit(0);
    });

  } catch (error) {
    console.error('❌ Error connecting to MongoDB (Issues Service):', error.message);
    process.exit(1);
  }
};

export default connectDB;