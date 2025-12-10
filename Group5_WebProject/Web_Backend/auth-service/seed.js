/**
 * Seed script to populate the auth database with test users
 * Run with: node seed.js
 */

import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import { config } from './config/config.js';
import User from './models/User.js';

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(config.db);
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

const testUsers = [
  {
    username: 'resident_user',
    email: 'resident@test.com',
    password: 'password123',
    role: 'resident'
  },
  {
    username: 'staff_user',
    email: 'staff@test.com',
    password: 'password123',
    role: 'municipal_staff'
  },
  {
    username: 'advocate_user',
    email: 'advocate@test.com',
    password: 'password123',
    role: 'community_advocate'
  },
  {
    username: 'admin_user',
    email: 'admin@test.com',
    password: 'password123',
    role: 'admin'
  }
];

const seedDatabase = async () => {
  try {
    await connectDB();

    // Clear existing users
    await User.deleteMany({});
    console.log('Cleared existing users');

    // Insert test users
    const hashedUsers = await Promise.all(
      testUsers.map(async (userData) => {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(userData.password, salt);
        return {
          ...userData,
          password: hashedPassword
        };
      })
    );

    const insertedUsers = await User.insertMany(hashedUsers);
    console.log(`✓ Seeded ${insertedUsers.length} test users`);

    // Display summary
    console.log('\n👤 Test Users Created:');
    console.log('─'.repeat(60));
    insertedUsers.forEach(user => {
      console.log(`  Username: ${user.username}`);
      console.log(`  Email: ${user.email}`);
      console.log(`  Role: ${user.role}`);
      console.log(`  Password: password123`);
      console.log('─'.repeat(60));
    });

    console.log('\n✅ Seeding complete!');
    console.log('\nYou can now login with any of these credentials:');
    testUsers.forEach(user => {
      console.log(`  - ${user.username} / password123 (${user.role})`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
