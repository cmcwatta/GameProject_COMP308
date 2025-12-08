import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: parseInt(process.env.PORT) || 4004,
  wsPort: parseInt(process.env.WS_PORT) || 8080,
  nodeEnv: process.env.NODE_ENV || 'development',
  
  database: {
    uri: process.env.NOTIFICATION_MONGO_URI || 'mongodb://localhost:27017/notification_service_db'
  },
  
  services: {
    auth: process.env.AUTH_SERVICE_URL || 'http://localhost:4001/graphql',
    engagement: process.env.ENGAGEMENT_SERVICE_URL || 'http://localhost:4003/graphql'
  },
  
  cors: {
    origin: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:5173'],
    credentials: true
  },
  
  websocket: {
    path: '/ws',
    heartbeatInterval: 30000
  }
};