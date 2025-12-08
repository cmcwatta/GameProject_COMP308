// server/microservices/auth-service/config/config.js
import dotenv from 'dotenv';
dotenv.config();
export const config = {
  db: process.env.MONGODB_URI || 'mongodb://localhost:27017/authServiceDB',
  jwtSecret: process.env.JWT_SECRET || 'your_jwt_secret_here',
  port: process.env.PORT || 5001,
};
export default config;
