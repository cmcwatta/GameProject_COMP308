import jwt from 'jsonwebtoken';
import { config } from '../config/config.js';

export const authenticateGateway = async (req) => {
  const token = req.headers.authorization?.split(' ')[1] || 
               req.cookies?.token;
  
  if (!token) {
    return null;
  }
  
  try {
    const decoded = jwt.verify(token, config.jwt.secret);
    return decoded;
  } catch (error) {
    console.error('Gateway token verification failed:', error.message);
    return null;
  }
};

export const addUserToHeaders = (user, headers) => {
  if (user) {
    return {
      ...headers,
      'x-user-id': user.userId,
      'x-user-email': user.email,
      'x-user-role': user.role,
      'x-user-username': user.username,
    };
  }
  return headers;
};