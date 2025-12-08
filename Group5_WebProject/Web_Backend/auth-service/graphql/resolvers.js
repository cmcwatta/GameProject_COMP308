import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import bcrypt from 'bcrypt';
import { config } from '../config/config.js';

const JWT_SECRET = config.jwtSecret;

const resolvers = {
  Query: {
    getUser: async (_, { id }) => {
      const user = await User.findById(id).select('-password');
      if (!user) throw new Error('User not found');
      return user;
    },
    
    getUsers: async () => {
      const users = await User.find().select('-password');
      return users;
    }
  },
  
  Mutation: {
    register: async (_, { username, email, password }) => {
      // Check if user exists
      const existingUser = await User.findOne({ 
        $or: [{ email }, { username }] 
      });
      
      if (existingUser) {
        throw new Error('User already exists');
      }
      
      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);
      
      // Create user
      const user = new User({
        username,
        email,
        password: hashedPassword,
        role: 'user'
      });
      
      await user.save();
      
      // Generate token
      const token = jwt.sign(
        { 
          userId: user._id,
          username: user.username,
          email: user.email,
          role: user.role
        },
        JWT_SECRET,
        { expiresIn: '7d' }
      );
      
      // Get user without password
      const userWithoutPassword = await User.findById(user._id).select('-password');
      
      return {
        token,
        user: userWithoutPassword
      };
    },
    
    login: async (_, { username, password }) => {
      const user = await User.findOne({ 
        $or: [{ email: username }, { username }] 
      });
      
      if (!user) {
        throw new Error('User not found');
      }
      
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        throw new Error('Invalid password');
      }
      
      const token = jwt.sign(
        { 
          userId: user._id,
          username: user.username,
          email: user.email,
          role: user.role
        },
        JWT_SECRET,
        { expiresIn: '7d' }
      );
      
      const userWithoutPassword = await User.findById(user._id).select('-password');
      
      return {
        token,
        user: userWithoutPassword
      };
    },
    
    // Add missing mutations from typeDef
    signin: async (_, { email, password }) => {
      const user = await User.findOne({ email });
      
      if (!user) {
        throw new Error('User not found');
      }
      
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        throw new Error('Invalid password');
      }
      
      const token = jwt.sign(
        { 
          userId: user._id,
          username: user.username,
          email: user.email,
          role: user.role
        },
        JWT_SECRET,
        { expiresIn: '7d' }
      );
      
      const userWithoutPassword = await User.findById(user._id).select('-password');
      
      return {
        token,
        user: userWithoutPassword
      };
    },
    
    signup: async (_, { username, email, password }) => {
      // Same as register
      const existingUser = await User.findOne({ 
        $or: [{ email }, { username }] 
      });
      
      if (existingUser) {
        throw new Error('User already exists');
      }
      
      const hashedPassword = await bcrypt.hash(password, 10);
      
      const user = new User({
        username,
        email,
        password: hashedPassword,
        role: 'user'
      });
      
      await user.save();
      
      const token = jwt.sign(
        { 
          userId: user._id,
          username: user.username,
          email: user.email,
          role: user.role
        },
        JWT_SECRET,
        { expiresIn: '7d' }
      );
      
      const userWithoutPassword = await User.findById(user._id).select('-password');
      
      return {
        token,
        user: userWithoutPassword
      };
    }
  }
};

export default resolvers;