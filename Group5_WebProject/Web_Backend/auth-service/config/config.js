// server/microservices/auth-service/config/config.js
import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: process.env.AUTH_PORT || 4000,
  db: process.env.AUTH_MONGO_URI || 'mongodb://localhost:27017/authServiceDB',
  jwtSecret: process.env.JWT_SECRET || 'your_jwt_secret_here',
  nodeEnv: process.env.NODE_ENV || 'development',
  
  cors: {
    origin: process.env.CORS_ORIGIN?.split(',') || [
      'http://localhost:3000',
      'http://localhost:3001', 
      'http://localhost:3002',
      'http://localhost:4000',
      'http://localhost:5173',
      'https://studio.apollographql.com'
    ],
    credentials: true
  }
};

export default config;
