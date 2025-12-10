#!/usr/bin/env node

/**
 * Notification Service Configuration Verification
 * 
 * This script verifies that all required environment variables are properly
 * configured and that the service can connect to MongoDB.
 * 
 * Usage: node verify-config.js
 */

import mongoose from 'mongoose';
import { config } from './config/config.js';
import dotenv from 'dotenv';

dotenv.config();

console.log('\n╔════════════════════════════════════════════════════════════╗');
console.log('║  Notification Service - Configuration Verification       ║');
console.log('╚════════════════════════════════════════════════════════════╝\n');

// Track verification results
let allGood = true;
const checks = [];

// 1. Check Port Configuration
console.log('📋 Checking Port Configuration...');
checks.push({
  name: 'HTTP Port',
  value: config.port,
  required: true,
  valid: config.port >= 1000 && config.port <= 65535
});

checks.push({
  name: 'WebSocket Port',
  value: config.wsPort,
  required: true,
  valid: config.wsPort >= 1000 && config.wsPort <= 65535
});

// 2. Check Node Environment
console.log('📋 Checking Environment...');
checks.push({
  name: 'Node Environment',
  value: config.nodeEnv,
  required: true,
  valid: ['development', 'production', 'test'].includes(config.nodeEnv)
});

// 3. Check Database Configuration
console.log('📋 Checking Database Configuration...');
checks.push({
  name: 'MongoDB URI',
  value: config.database.uri.replace(/mongodb:\/\/([^:]+):([^@]+)@/, 'mongodb://***:***@'),
  required: true,
  valid: config.database.uri && config.database.uri.includes('mongodb')
});

// 4. Check CORS Configuration
console.log('📋 Checking CORS Configuration...');
checks.push({
  name: 'CORS Origins',
  value: Array.isArray(config.cors.origin) ? `${config.cors.origin.length} origins` : config.cors.origin,
  required: true,
  valid: config.cors.origin && config.cors.origin.length > 0
});

// 5. Check Service URLs
console.log('📋 Checking Service URLs...');
const services = ['auth', 'issue', 'engagement'];
for (const service of services) {
  checks.push({
    name: `${service.charAt(0).toUpperCase() + service.slice(1)} Service URL`,
    value: config.services[service],
    required: true,
    valid: config.services[service] && config.services[service].includes('http')
  });
}

// Display all checks
console.log('\n📊 Configuration Summary:\n');
checks.forEach(check => {
  const status = check.valid ? '✅' : '❌';
  const required = check.required ? '[REQUIRED]' : '[OPTIONAL]';
  console.log(`${status} ${check.name} ${required}`);
  console.log(`   Value: ${check.value}`);
  console.log('');
  if (!check.valid) {
    allGood = false;
  }
});

// Try to connect to MongoDB
console.log('📡 Testing MongoDB Connection...\n');
mongoose.connect(config.database.uri, {
  serverSelectionTimeoutMS: 5000,
})
  .then(async () => {
    console.log('✅ Successfully connected to MongoDB');
    console.log(`   Database: ${mongoose.connection.name}`);
    console.log(`   Host: ${mongoose.connection.host}:${mongoose.connection.port}`);
    
    // List collections
    const collections = mongoose.connection.collections;
    console.log(`   Collections: ${Object.keys(collections).length} found`);
    
    await mongoose.connection.close();
    
    // Final result
    console.log('\n╔════════════════════════════════════════════════════════════╗');
    if (allGood) {
      console.log('║  ✅ All checks passed! Service is ready to start.         ║');
    } else {
      console.log('║  ⚠️  Some checks failed. Please review configuration.     ║');
    }
    console.log('╚════════════════════════════════════════════════════════════╝\n');
    
    process.exit(allGood ? 0 : 1);
  })
  .catch(error => {
    console.log('❌ Failed to connect to MongoDB');
    console.log(`   Error: ${error.message}`);
    console.log(`\n   Troubleshooting Tips:`);
    console.log(`   1. Ensure MongoDB is running on ${config.database.uri}`);
    console.log(`   2. Check your NOTIFICATION_MONGO_URI in .env file`);
    console.log(`   3. Verify MongoDB connection string format`);
    console.log(`\n   Example connection strings:`);
    console.log(`   - Local: mongodb://localhost:27017/notification_service_db`);
    console.log(`   - Atlas: mongodb+srv://user:password@cluster.mongodb.net/dbname`);
    console.log('');
    
    console.log('\n╔════════════════════════════════════════════════════════════╗');
    console.log('║  ❌ Configuration verification failed.                      ║');
    console.log('╚════════════════════════════════════════════════════════════╝\n');
    
    process.exit(1);
  });
