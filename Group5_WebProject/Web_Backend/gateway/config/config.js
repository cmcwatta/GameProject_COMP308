import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: process.env.GATEWAY_PORT || process.env.PORT || 4000,
  nodeEnv: process.env.NODE_ENV || 'development',
  jwtSecret: process.env.JWT_SECRET || 'dev-secret-key-change-in-production-12345',
  
  services: {
    auth: process.env.AUTH_SERVICE_URL || 'http://localhost:4001/graphql',
    issue: process.env.ISSUE_SERVICE_URL || 'http://localhost:4002/graphql',
    ai: process.env.AI_SERVICE_URL || 'http://localhost:4003/graphql',
  },
  
  cors: {
    origin: (process.env.CORS_ORIGIN || 'http://localhost:5173,http://localhost:3001,https://studio.apollographql.com').split(','),
    credentials: true,
  }
};