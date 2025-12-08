/**
 * Database Seed Script for Gamification System
 * Populates initial achievements, challenges, and test users
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Import models
import { Achievement } from '../models/Achievement.js';
import { Challenge } from '../models/Challenge.js';
import { GameProfile } from '../models/GameProfile.js';
import { Leaderboard } from '../models/Leaderboard.js';
import { PointsLog } from '../models/PointsLog.js';

// MongoDB Connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/gamification_db', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✓ Connected to MongoDB');
  } catch (error) {
    console.error('✗ MongoDB connection failed:', error);
    process.exit(1);
  }
};

// Achievement Seed Data
const achievementsData = [
  // Beginner Achievements
  {
    name: 'First Steps',
    description: 'Report your first civic issue',
    category: 'engagement',
    rarity: 'common',
    symbol: '👣',
    condition: { type: 'issues_reported', value: 1 },
    reward: 50,
  },
  {
    name: 'Voice of Change',
    description: 'Leave your first comment on an issue',
    category: 'engagement',
    rarity: 'common',
    symbol: '🗣️',
    condition: { type: 'comments_written', value: 1 },
    reward: 25,
  },
  {
    name: 'Community Helper',
    description: 'Receive 10 helpful votes on your comments',
    category: 'engagement',
    rarity: 'rare',
    symbol: '🤝',
    condition: { type: 'helpful_votes', value: 10 },
    reward: 100,
  },
  // Intermediate Achievements
  {
    name: 'Issue Reporter',
    description: 'Report 10 civic issues',
    category: 'engagement',
    rarity: 'rare',
    symbol: '📝',
    condition: { type: 'issues_reported', value: 10 },
    reward: 250,
  },
  {
    name: 'Community Pillar',
    description: 'Write 25 helpful comments',
    category: 'engagement',
    rarity: 'rare',
    symbol: '🏛️',
    condition: { type: 'comments_written', value: 25 },
    reward: 300,
  },
  {
    name: 'Accessibility Advocate',
    description: 'Report 5 accessibility issues',
    category: 'civic_focus',
    rarity: 'epic',
    symbol: '♿',
    condition: { type: 'category_issues', category: 'accessibility', value: 5 },
    reward: 500,
  },
  // Advanced Achievements
  {
    name: 'Infrastructure Expert',
    description: 'Report 10 infrastructure issues',
    category: 'civic_focus',
    rarity: 'epic',
    symbol: '🏗️',
    condition: { type: 'category_issues', category: 'infrastructure', value: 10 },
    reward: 600,
  },
  {
    name: 'Safety Champion',
    description: 'Report 5 safety-related issues',
    category: 'civic_focus',
    rarity: 'epic',
    symbol: '🛡️',
    condition: { type: 'category_issues', category: 'safety', value: 5 },
    reward: 500,
  },
  {
    name: 'Sustainability Leader',
    description: 'Report 10 sustainability issues',
    category: 'civic_focus',
    rarity: 'epic',
    symbol: '🌱',
    condition: { type: 'category_issues', category: 'sustainability', value: 10 },
    reward: 600,
  },
  // Legendary Achievements
  {
    name: 'Legendary Contributor',
    description: 'Reach level 40',
    category: 'progression',
    rarity: 'legendary',
    symbol: '⭐',
    condition: { type: 'level', value: 40 },
    reward: 1000,
  },
  {
    name: 'Hall of Fame',
    description: 'Get into top 10 leaderboard',
    category: 'progression',
    rarity: 'legendary',
    symbol: '🏆',
    condition: { type: 'leaderboard_rank', value: 10 },
    reward: 1500,
  },
  {
    name: '100 Day Streak',
    description: 'Maintain a 100-day contribution streak',
    category: 'progression',
    rarity: 'legendary',
    symbol: '🔥',
    condition: { type: 'streak', value: 100 },
    reward: 2000,
  },
];

// Challenge Seed Data
const challengesData = [
  {
    title: 'Accessibility Week Challenge',
    description: 'Report 5 accessibility issues within 7 days',
    category: 'accessibility',
    difficulty: 'medium',
    xpReward: 200,
    duration: 7,
    objective: 'Report at least 5 accessibility issues',
    successCriteria: 'Successfully report and complete 5 accessibility issues',
    startDate: new Date(),
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    status: 'active',
    progressMetric: { type: 'count', target: 5 },
  },
  {
    title: 'Infrastructure Sprint',
    description: 'Help resolve 3 infrastructure issues',
    category: 'infrastructure',
    difficulty: 'hard',
    xpReward: 350,
    duration: 14,
    objective: 'Leave helpful comments on infrastructure issues',
    successCriteria: 'Provide constructive feedback on 3 infrastructure issues',
    startDate: new Date(),
    endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
    status: 'active',
    progressMetric: { type: 'count', target: 3 },
  },
  {
    title: 'Safety First',
    description: 'Identify safety concerns in your neighborhood',
    category: 'safety',
    difficulty: 'easy',
    xpReward: 150,
    duration: 7,
    objective: 'Report 3 safety issues',
    successCriteria: 'Report and document 3 safety concerns',
    startDate: new Date(),
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    status: 'active',
    progressMetric: { type: 'count', target: 3 },
  },
  {
    title: 'Sustainability Drive',
    description: 'Advocate for environmental improvements',
    category: 'sustainability',
    difficulty: 'medium',
    xpReward: 250,
    duration: 30,
    objective: 'Report sustainability issues and comment on others',
    successCriteria: 'Engage in sustainability discussions and reporting',
    startDate: new Date(),
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    status: 'active',
    progressMetric: { type: 'engagement', target: 5 },
  },
  {
    title: 'Community Voice',
    description: 'Write thoughtful comments and build consensus',
    category: 'general',
    difficulty: 'easy',
    xpReward: 100,
    duration: 7,
    objective: 'Write 5 helpful comments',
    successCriteria: 'Contribute 5 meaningful comments to community discussions',
    startDate: new Date(),
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    status: 'active',
    progressMetric: { type: 'comments', target: 5 },
  },
];

// Test User Data
const testUsersData = [
  {
    username: 'alice_advocate',
    email: 'alice@example.com',
    password: 'hashed_password_1', // In real app, hash this
    role: 'user',
    avatar: '👩',
  },
  {
    username: 'bob_builder',
    email: 'bob@example.com',
    password: 'hashed_password_2',
    role: 'user',
    avatar: '👨',
  },
  {
    username: 'carol_citizen',
    email: 'carol@example.com',
    password: 'hashed_password_3',
    role: 'staff',
    avatar: '👩‍💼',
  },
  {
    username: 'demo_admin',
    email: 'admin@example.com',
    password: 'hashed_password_4',
    role: 'admin',
    avatar: '👨‍💻',
  },
];

// Seed Achievements
const seedAchievements = async () => {
  try {
    const existingCount = await Achievement.countDocuments();
    if (existingCount > 0) {
      console.log(`⚠️  ${existingCount} achievements already exist. Skipping...`);
      return;
    }

    await Achievement.insertMany(achievementsData);
    console.log(`✓ ${achievementsData.length} achievements seeded`);
  } catch (error) {
    console.error('✗ Error seeding achievements:', error);
  }
};

// Seed Challenges
const seedChallenges = async () => {
  try {
    const existingCount = await Challenge.countDocuments();
    if (existingCount > 0) {
      console.log(`⚠️  ${existingCount} challenges already exist. Skipping...`);
      return;
    }

    await Challenge.insertMany(challengesData);
    console.log(`✓ ${challengesData.length} challenges seeded`);
  } catch (error) {
    console.error('✗ Error seeding challenges:', error);
  }
};

// Seed Test Users
const seedUsers = async () => {
  try {
    // Check if we already have game profiles
    const existingCount = await GameProfile.countDocuments();
    if (existingCount > 0) {
      console.log(`⚠️  ${existingCount} game profiles already exist. Skipping...`);
      return;
    }

    // Note: User creation is handled by auth-service
    // This just logs the test users for reference
    console.log(`ℹ️  Test users (created by auth-service):`);
    testUsersData.forEach((user) => {
      console.log(`  • ${user.username} (${user.email}) - ${user.role}`);
    });
  } catch (error) {
    console.error('✗ Error seeding users:', error);
  }
};

// Main seed function
const seedDatabase = async () => {
  console.log('\n╔════════════════════════════════════════╗');
  console.log('║    Gamification Database Seeding       ║');
  console.log('╚════════════════════════════════════════╝\n');

  await connectDB();

  try {
    // Seed data
    await seedAchievements();
    await seedChallenges();
    await seedUsers();

    console.log('\n✓ Database seeding completed successfully!\n');
    console.log('Test Users:');
    testUsersData.forEach(user => {
      console.log(`  • ${user.username} (${user.email}) - ${user.role}`);
    });

  } catch (error) {
    console.error('✗ Seeding failed:', error);
  } finally {
    mongoose.connection.close();
    console.log('\n✓ MongoDB connection closed\n');
  }
};

// Run seeding
seedDatabase();
