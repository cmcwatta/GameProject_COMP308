import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: process.env.AI_SERVICE_PORT || 4003,
  mongoURI: process.env.MONGODB_URI || 'mongodb://localhost:27017/civic-issue-tracker',
  GEMINI_API_KEY: process.env.GEMINI_API_KEY,
  GEMINI_MODEL: process.env.GEMINI_MODEL || 'gemini-1.5-pro',
  JWT_SECRET: process.env.JWT_SECRET || 'secret',
  NODE_ENV: process.env.NODE_ENV || 'development',
  LOG_LEVEL: process.env.LOG_LEVEL || 'debug'
};