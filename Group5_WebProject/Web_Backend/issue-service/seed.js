/**
 * Seed script to populate the database with sample issues
 * Run with: node seed.js
 */

import mongoose from 'mongoose';
import { config } from './config/config.js';
import Issue from './models/Issue.js';

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(config.mongodbUri);
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

const sampleIssues = [
  {
    title: 'Large pothole on Main Street',
    description: 'There is a significant pothole at the intersection of Main Street and 5th Avenue. It has been there for several weeks and is getting worse. It poses a safety hazard to vehicles and pedestrians.',
    location: {
      type: 'Point',
      coordinates: [-105.2705, 40.015],
      address: 'Main Street & 5th Avenue, Boulder, CO'
    },
    category: 'pothole',
    priority: 'high',
    status: 'in_progress',
    submitterId: 'user_1',
    submitterName: 'John Smith',
    upvotes: 24,
    comments: [],
    volunteers: [
      { userId: 'user_2', name: 'Sarah Johnson', joinedAt: new Date('2024-12-08') }
    ],
    createdAt: new Date('2024-12-02'),
    updatedAt: new Date('2024-12-08')
  },
  {
    title: 'Street light outage on Oak Boulevard',
    description: 'The street light at Oak Boulevard near the park has been out for over a week. It is affecting visibility and safety in the evening hours. Residents are concerned about the dark area.',
    location: {
      type: 'Point',
      coordinates: [-105.2634, 40.0075],
      address: 'Oak Boulevard & Park Lane, Boulder, CO'
    },
    category: 'streetlight',
    priority: 'medium',
    status: 'assigned',
    submitterId: 'user_3',
    submitterName: 'Emma Wilson',
    upvotes: 15,
    comments: [],
    volunteers: [
      { userId: 'user_4', name: 'Michael Chen', joinedAt: new Date('2024-12-09') }
    ],
    createdAt: new Date('2024-12-04'),
    updatedAt: new Date('2024-12-09')
  },
  {
    title: 'Debris and litter in Central Park',
    description: 'Central Park has accumulated a lot of trash and debris, including broken branches and litter. The area is used frequently by families and needs cleaning urgently.',
    location: {
      type: 'Point',
      coordinates: [-105.2648, 40.0096],
      address: 'Central Park, Boulder, CO'
    },
    category: 'debris',
    priority: 'medium',
    status: 'open',
    submitterId: 'user_5',
    submitterName: 'Lisa Anderson',
    upvotes: 18,
    comments: [],
    volunteers: [
      { userId: 'user_6', name: 'David Martinez', joinedAt: new Date('2024-12-07') },
      { userId: 'user_7', name: 'Rachel Green', joinedAt: new Date('2024-12-09') }
    ],
    createdAt: new Date('2024-12-05'),
    updatedAt: new Date('2024-12-09')
  },
  {
    title: 'Water pooling on Riverside Drive',
    description: 'Water is pooling on the street during rain because the drainage system is blocked. This creates a hazard for both vehicles and pedestrians. The area needs drainage maintenance.',
    location: {
      type: 'Point',
      coordinates: [-105.2726, 40.0041],
      address: 'Riverside Drive & Water Street, Boulder, CO'
    },
    category: 'drainage',
    priority: 'high',
    status: 'open',
    submitterId: 'user_8',
    submitterName: 'Robert Taylor',
    upvotes: 31,
    comments: [],
    volunteers: [
      { userId: 'user_9', name: 'Angela Moore', joinedAt: new Date('2024-12-06') },
      { userId: 'user_10', name: 'James White', joinedAt: new Date('2024-12-08') },
      { userId: 'user_11', name: 'Patricia Garcia', joinedAt: new Date('2024-12-09') }
    ],
    createdAt: new Date('2024-12-01'),
    updatedAt: new Date('2024-12-09')
  },
  {
    title: 'Graffiti on community center wall',
    description: 'The side wall of the community center has graffiti that needs to be removed. It affects the appearance of the building and the surrounding area.',
    location: {
      type: 'Point',
      coordinates: [-105.2715, 40.0085],
      address: 'Community Center, Boulder, CO'
    },
    category: 'debris',
    priority: 'low',
    status: 'resolved',
    submitterId: 'user_12',
    submitterName: 'Kevin Brown',
    upvotes: 8,
    comments: [],
    volunteers: [],
    createdAt: new Date('2024-11-25'),
    updatedAt: new Date('2024-12-06')
  },
  {
    title: 'Broken sidewalk on College Avenue',
    description: 'The sidewalk on College Avenue has several broken sections creating a tripping hazard. This is in a high-traffic area with many pedestrians daily.',
    location: {
      type: 'Point',
      coordinates: [-105.2655, 40.0062],
      address: 'College Avenue & Pearl Street, Boulder, CO'
    },
    category: 'pothole',
    priority: 'high',
    status: 'open',
    submitterId: 'user_13',
    submitterName: 'Jessica Davis',
    upvotes: 22,
    comments: [],
    volunteers: [
      { userId: 'user_14', name: 'Thomas Rodriguez', joinedAt: new Date('2024-12-08') }
    ],
    createdAt: new Date('2024-12-03'),
    updatedAt: new Date('2024-12-08')
  },
  {
    title: 'Overgrown vegetation blocking sidewalk',
    description: 'Trees and bushes are overgrown and blocking the sidewalk on Mapleton Avenue. Pedestrians have to walk in the street to get around the vegetation.',
    location: {
      type: 'Point',
      coordinates: [-105.2672, 40.0108],
      address: 'Mapleton Avenue, Boulder, CO'
    },
    category: 'debris',
    priority: 'medium',
    status: 'open',
    submitterId: 'user_15',
    submitterName: 'Nancy Lee',
    upvotes: 12,
    comments: [],
    volunteers: [],
    createdAt: new Date('2024-12-07'),
    updatedAt: new Date('2024-12-07')
  },
  {
    title: 'Traffic light not functioning at intersection',
    description: 'The traffic light at the intersection of Broadway and Canyon is not working properly. It is only showing red lights, creating a dangerous situation for drivers and pedestrians.',
    location: {
      type: 'Point',
      coordinates: [-105.2707, 40.0125],
      address: 'Broadway & Canyon Road, Boulder, CO'
    },
    category: 'streetlight',
    priority: 'critical',
    status: 'in_progress',
    submitterId: 'user_16',
    submitterName: 'Christopher Martinez',
    upvotes: 28,
    comments: [],
    volunteers: [
      { userId: 'user_17', name: 'Susan Jackson', joinedAt: new Date('2024-12-07') }
    ],
    createdAt: new Date('2024-12-08'),
    updatedAt: new Date('2024-12-09')
  },
  {
    title: 'Missing storm drain cover on Walnut Street',
    description: 'A storm drain cover is missing on Walnut Street, creating a hazard for pedestrians and cyclists. This needs immediate attention for safety.',
    location: {
      type: 'Point',
      coordinates: [-105.2685, 40.0045],
      address: 'Walnut Street & Spruce, Boulder, CO'
    },
    category: 'drainage',
    priority: 'critical',
    status: 'assigned',
    submitterId: 'user_18',
    submitterName: 'Daniel Wilson',
    upvotes: 19,
    comments: [],
    volunteers: [],
    createdAt: new Date('2024-12-06'),
    updatedAt: new Date('2024-12-08')
  },
  {
    title: 'Faded crosswalk markings on Pearl Street',
    description: 'The crosswalk markings on Pearl Street are very faded and almost invisible. This is a safety concern for pedestrians trying to cross the street.',
    location: {
      type: 'Point',
      coordinates: [-105.2642, 40.0055],
      address: 'Pearl Street & 10th, Boulder, CO'
    },
    category: 'debris',
    priority: 'low',
    status: 'open',
    submitterId: 'user_19',
    submitterName: 'Barbara Miller',
    upvotes: 7,
    comments: [],
    volunteers: [],
    createdAt: new Date('2024-12-09'),
    updatedAt: new Date('2024-12-09')
  }
];

const seedDatabase = async () => {
  try {
    await connectDB();

    // Clear existing issues
    await Issue.deleteMany({});
    console.log('Cleared existing issues');

    // Insert sample issues
    const insertedIssues = await Issue.insertMany(sampleIssues);
    console.log(`✓ Seeded ${insertedIssues.length} sample issues`);

    // Display summary
    console.log('\n📊 Seed Summary:');
    console.log(`Total Issues: ${insertedIssues.length}`);

    const byStatus = await Issue.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);
    console.log('\nBy Status:');
    byStatus.forEach(item => console.log(`  ${item._id}: ${item.count}`));

    const byPriority = await Issue.aggregate([
      { $group: { _id: '$priority', count: { $sum: 1 } } }
    ]);
    console.log('\nBy Priority:');
    byPriority.forEach(item => console.log(`  ${item._id}: ${item.count}`));

    const byCategory = await Issue.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]);
    console.log('\nBy Category:');
    byCategory.forEach(item => console.log(`  ${item._id}: ${item.count}`));

    console.log('\n✅ Seeding complete!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
