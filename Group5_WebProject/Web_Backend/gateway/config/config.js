import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: process.env.PORT || 4000,
  nodeEnv: process.env.NODE_ENV || 'development',
  
  services: {
    auth: process.env.AUTH_SERVICE_URL || 'http://localhost:4001/graphql',
    engagement: process.env.ENGAGEMENT_SERVICE_URL || 'http://localhost:4003/graphql',
    ai: process.env.AI_SERVICE_URL || 'http://localhost:4002/graphql',
  },
  
  jwt: {
    secret: process.env.JWT_SECRET,
  },
  
  cors: {
    origin: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:5173'],
    credentials: true,
  }
};