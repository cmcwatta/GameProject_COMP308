/**
 * Database Migration Script
 * Purpose: Remove deprecated gamification collections and seed civic data
 * 
 * Usage: 
 *   MONGODB_URI=mongodb://localhost:27017/civic-platform node removedGameCollections.js
 */

const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/civic-platform';

async function migrateDatabase() {
  try {
    console.log('🔄 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB\n');

    const db = mongoose.connection.db;

    // Step 1: Drop deprecated game-related collections
    console.log('🗑️  Removing deprecated gamification collections...');
    const deprecatedCollections = [
      'gameprofiles',
      'achievements',
      'challenges',
      'pointslogs',
      'leaderboards',
    ];

    for (const collection of deprecatedCollections) {
      try {
        await db.collection(collection).drop();
        console.log(`  ✓ Dropped ${collection}`);
      } catch (err) {
        if (err.message.includes('ns not found')) {
          console.log(`  ℹ️  ${collection} does not exist (skipped)`);
        } else {
          console.error(`  ✗ Error dropping ${collection}: ${err.message}`);
        }
      }
    }
    console.log();

    // Step 2: Seed civic data
    console.log('🌱 Seeding civic data...\n');

    // Seed users
    console.log('  Creating users...');
    const users = await db.collection('users').insertMany([
      {
        _id: new mongoose.Types.ObjectId(),
        email: 'resident@example.com',
        password: '$2b$10$dummy_hash_resident',
        role: 'Resident',
        location: {
          address: '123 Main St',
          city: 'Sample City',
          state: 'SC',
          postalCode: '12345',
          latitude: 40.7128,
          longitude: -74.0060,
        },
        phone: '+1-555-0100',
        preferences: {
          notificationFrequency: 'daily',
          categories: ['Flooding', 'Pothole', 'Streetlight'],
          alertRadius: 1,
        },
        oauthProviders: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        _id: new mongoose.Types.ObjectId(),
        email: 'advocate@example.com',
        password: '$2b$10$dummy_hash_advocate',
        role: 'Community Advocate',
        location: {
          address: '456 Oak Ave',
          city: 'Sample City',
          state: 'SC',
          postalCode: '12346',
          latitude: 40.7189,
          longitude: -74.0101,
        },
        phone: '+1-555-0101',
        preferences: {
          notificationFrequency: 'immediate',
          categories: ['Flooding', 'Safety Hazard', 'Accessibility'],
          alertRadius: 2,
        },
        oauthProviders: [],
        volunteerSkills: ['Community Outreach', 'Technical Support'],
        hoursContributed: 25,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        _id: new mongoose.Types.ObjectId(),
        email: 'staff@example.com',
        password: '$2b$10$dummy_hash_staff',
        role: 'Municipal Staff',
        location: {
          address: '789 City Hall',
          city: 'Sample City',
          state: 'SC',
          postalCode: '12347',
          latitude: 40.7050,
          longitude: -74.0150,
        },
        phone: '+1-555-0102',
        preferences: {
          notificationFrequency: 'immediate',
          categories: ['Flooding', 'Pothole', 'Streetlight', 'Safety Hazard', 'Accessibility', 'Other'],
          alertRadius: 5,
        },
        oauthProviders: [],
        department: 'Public Works',
        staffId: 'PWD-001',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
    console.log(`  ✓ Created ${users.insertedCount} users\n`);

    // Seed issues
    console.log('  Creating civic issues...');
    const sampleIssues = [
      {
        title: 'Large pothole on Main Street',
        description: 'A significant pothole that could damage vehicles. Located near the intersection with 5th Avenue.',
        category: 'Pothole',
        priority: 'High',
        status: 'Open',
        location: {
          type: 'Point',
          coordinates: [-74.0060, 40.7128],
          address: '123 Main St',
          city: 'Sample City',
        },
        reportedBy: users.insertedIds[0],
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        slaDeadline: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000 + 120 * 60 * 60 * 1000),
        slaDays: 5,
        comments: [],
        upvotes: 12,
      },
      {
        title: 'Flooding near Roosevelt Park',
        description: 'Heavy water accumulation in the parking lot area. Potentially hazardous during rain.',
        category: 'Flooding',
        priority: 'Critical',
        status: 'In Progress',
        location: {
          type: 'Point',
          coordinates: [-74.0150, 40.7050],
          address: '456 Park Ave',
          city: 'Sample City',
        },
        reportedBy: users.insertedIds[1],
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        slaDeadline: new Date(Date.now() + 22 * 60 * 60 * 1000),
        slaDays: 1,
        assignedTo: users.insertedIds[2],
        comments: [],
        upvotes: 28,
      },
      {
        title: 'Broken streetlight on Oak Avenue',
        description: 'Streetlight pole #4521 has been non-functional for several weeks. Creates safety concern at night.',
        category: 'Streetlight',
        priority: 'Medium',
        status: 'Open',
        location: {
          type: 'Point',
          coordinates: [-74.0101, 40.7189],
          address: '789 Oak Ave',
          city: 'Sample City',
        },
        reportedBy: users.insertedIds[0],
        createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
        slaDeadline: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000 + 72 * 60 * 60 * 1000),
        slaDays: 3,
        comments: [],
        upvotes: 8,
      },
      {
        title: 'Safety hazard: Loose railing at bridge entrance',
        description: 'The metal railing at the north bridge entrance is loose and poses a safety risk to pedestrians.',
        category: 'Safety Hazard',
        priority: 'High',
        status: 'Open',
        location: {
          type: 'Point',
          coordinates: [-74.0200, 40.7250],
          address: '1000 North Bridge',
          city: 'Sample City',
        },
        reportedBy: users.insertedIds[1],
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        slaDeadline: new Date(Date.now() + 45 * 60 * 60 * 1000),
        slaDays: 2,
        comments: [],
        upvotes: 15,
      },
      {
        title: 'Wheelchair ramp needs repair',
        description: 'The ramp at the City Library entrance has uneven surface that makes wheelchair access difficult.',
        category: 'Accessibility',
        priority: 'Medium',
        status: 'Open',
        location: {
          type: 'Point',
          coordinates: [-74.0180, 40.7150],
          address: '200 Library Lane',
          city: 'Sample City',
        },
        reportedBy: users.insertedIds[1],
        createdAt: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000),
        slaDeadline: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000 + 96 * 60 * 60 * 1000),
        slaDays: 4,
        comments: [],
        upvotes: 5,
      },
      {
        title: 'Graffiti on downtown area',
        description: 'Multiple surfaces in the downtown area have been vandalized with graffiti. Needs cleanup.',
        category: 'Other',
        priority: 'Low',
        status: 'Closed',
        location: {
          type: 'Point',
          coordinates: [-74.0090, 40.7100],
          address: '500 Downtown District',
          city: 'Sample City',
        },
        reportedBy: users.insertedIds[0],
        createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000),
        slaDeadline: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000 + 144 * 60 * 60 * 1000),
        slaDays: 6,
        resolvedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        assignedTo: users.insertedIds[2],
        comments: [],
        upvotes: 3,
      },
    ];

    const issuesCollection = db.collection('issues');
    
    // Ensure geospatial index
    await issuesCollection.createIndex({ 'location.coordinates': '2dsphere' });
    console.log('  ✓ Created geospatial index on issues');

    const issues = await issuesCollection.insertMany(sampleIssues);
    console.log(`  ✓ Created ${issues.insertedCount} sample civic issues\n`);

    // Step 3: Create status history entries
    console.log('  Creating status history for issues...');
    const statusHistoryCollection = db.collection('statushistories');
    const statusHistories = [];

    for (const [idx, issueId] of Object.entries(issues.insertedIds)) {
      const issue = sampleIssues[parseInt(idx)];
      statusHistories.push({
        issueId: issueId,
        status: 'Open',
        changedAt: issue.createdAt,
        changedBy: issue.reportedBy,
        reason: 'Issue created',
      });

      if (issue.status !== 'Open') {
        statusHistories.push({
          issueId: issueId,
          status: issue.status,
          changedAt: new Date(issue.createdAt.getTime() + 2 * 24 * 60 * 60 * 1000),
          changedBy: issue.assignedTo || issue.reportedBy,
          reason: 'Status updated by staff',
        });
      }

      if (issue.status === 'Closed') {
        statusHistories.push({
          issueId: issueId,
          status: 'Closed',
          changedAt: issue.resolvedAt,
          changedBy: issue.assignedTo,
          reason: 'Issue resolved',
        });
      }
    }

    const statusHistory = await statusHistoryCollection.insertMany(statusHistories);
    console.log(`  ✓ Created ${statusHistory.insertedCount} status history entries\n`);

    // Step 4: Summary
    console.log('=' .repeat(60));
    console.log('✅ Migration completed successfully!\n');
    console.log('📊 Summary:');
    console.log(`   • Removed ${deprecatedCollections.length} deprecated collections`);
    console.log(`   • Created ${users.insertedCount} users (Resident, Advocate, Staff)`);
    console.log(`   • Created ${issues.insertedCount} sample civic issues`);
    console.log(`   • Created ${statusHistory.insertedCount} status history entries`);
    console.log(`   • Geospatial index created for location-based queries`);
    console.log('\n🔐 Test Users:');
    console.log('   • Resident: resident@example.com / password');
    console.log('   • Advocate: advocate@example.com / password');
    console.log('   • Staff: staff@example.com / password');
    console.log('\n💾 Next Steps:');
    console.log('   • Start all services with: docker-compose up -d');
    console.log('   • Test OAuth login with Google/GitHub');
    console.log('   • Test issue creation with geolocation');
    console.log('   • Verify GraphQL endpoints');
    console.log('=' .repeat(60));

    await mongoose.connection.close();
    process.exit(0);
  } catch (err) {
    console.error('❌ Migration failed:', err);
    await mongoose.connection.close();
    process.exit(1);
  }
}

// Run migration
migrateDatabase();
