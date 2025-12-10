import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: process.env.PORT || 4002,
  nodeEnv: process.env.NODE_ENV || 'development',
  
  gemini: {
    apiKey: process.env.GEMINI_API_KEY,
    model: process.env.GEMINI_MODEL || 'gemini-pro'
  },
  
  cors: {
    origin: process.env.CORS_ORIGIN?.split(',') || [
      'http://localhost:5173',
      'http://localhost:5174',
      'http://localhost:5175'
    ],
    credentials: true
  },
  
  logging: {
    level: process.env.LOG_LEVEL || 'info'
  }
};