import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { config } from '../config/config.js';

const JWT_SECRET = config.jwtSecret;

const resolvers = {
  Query: {
    me: async (_, __, context) => {
      if (!context.user) {
        throw new Error('Not authenticated');
      }
      const user = await User.findById(context.user.userId).select('-password');
      if (!user) throw new Error('User not found');
      return user;
    },
    
    getUser: async (_, { id }, context) => {
      if (!context.user) {
        throw new Error('Not authenticated');
      }
      
      const currentUser = await User.findById(context.user.userId);
      
      // Only admins can view other users' details
      if (currentUser.role !== 'admin' && context.user.userId !== id) {
        throw new Error('Insufficient permissions');
      }
      
      const user = await User.findById(id).select('-password');
      if (!user) throw new Error('User not found');
      return user;
    },
    
    getUsers: async (_, { role }, context) => {
      if (!context.user || context.user.role !== 'admin') {
        throw new Error('Admin access required');
      }
      
      const query = {};
      if (role) {
        const validRoles = ['resident', 'municipal_staff', 'community_advocate', 'admin'];
        if (!validRoles.includes(role)) {
          throw new Error('Invalid role');
        }
        query.role = role;
      }
      
      const users = await User.find(query).select('-password');
      return users;
    },
    
    health: () => 'Auth Service is healthy'
  },
  
  Mutation: {
    register: async (_, { username, email, password, role = 'resident' }) => {
      // Validate role
      const validRoles = ['resident', 'municipal_staff', 'community_advocate', 'admin'];
      if (!validRoles.includes(role)) {
        throw new Error('Invalid role');
      }
      
      // Check if user exists
      const existingUser = await User.findOne({ 
        $or: [{ email }, { username }] 
      });
      
      if (existingUser) {
        throw new Error('User already exists');
      }
      
      // Create user
      const user = new User({
        username,
        email,
        password,
        role
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
        throw new Error('Invalid credentials');
      }
      
      const isPasswordValid = await user.comparePassword(password);
      if (!isPasswordValid) {
        throw new Error('Invalid credentials');
      }
      
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
      
      const userWithoutPassword = await User.findById(user._id).select('-password');
      
      return {
        token,
        user: userWithoutPassword
      };
    },
    
    loginWithEmail: async (_, { email, password }) => {
      const user = await User.findOne({ email });
      
      if (!user) {
        throw new Error('Invalid credentials');
      }
      
      const isPasswordValid = await user.comparePassword(password);
      if (!isPasswordValid) {
        throw new Error('Invalid credentials');
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
    
    updateUserRole: async (_, { id, role }, context) => {
      if (!context.user || context.user.role !== 'admin') {
        throw new Error('Only admins can update user roles');
      }
      
      const validRoles = ['resident', 'municipal_staff', 'community_advocate', 'admin'];
      if (!validRoles.includes(role)) {
        throw new Error('Invalid role');
      }
      
      const user = await User.findById(id);
      if (!user) {
        throw new Error('User not found');
      }
      
      user.role = role;
      await user.save();
      
      return await User.findById(user._id).select('-password');
    },
    
    deleteUser: async (_, { id }, context) => {
      if (!context.user || context.user.role !== 'admin') {
        throw new Error('Only admins can delete users');
      }
      
      const user = await User.findById(id);
      if (!user) {
        throw new Error('User not found');
      }
      
      await User.findByIdAndDelete(id);
      return true;
    },
    
    logout: async () => {
      // Client-side token invalidation
      return true;
    }
  }
};

export default resolvers;