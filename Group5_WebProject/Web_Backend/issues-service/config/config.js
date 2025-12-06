import dotenv from 'dotenv';
dotenv.config();

export const config = {
  db: process.env.ISSUES_MONGO_URI || 'mongodb://localhost:27017/civicconnect_issues',
  jwtSecret: process.env.JWT_SECRET || '',
  port: process.env.ISSUES_PORT || 4002,
  aiServiceUrl: process.env.AI_SERVICE_URL || 'http://localhost:4003/graphql'
};

export default config;