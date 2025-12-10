import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { config } from '../config/config.js';

const JWT_SECRET = config.JWT_SECRET || process.env.JWT_SECRET;

const resolvers = {
  User: {
    __resolveReference: async (user) => {
      const foundUser = await User.findById(user.id).select('-passwordHash');
      return foundUser;
    }
  },
  Query: {
    getUser: async (_, { id }) => {
      const user = await User.findById(id).select('-passwordHash');
      if (!user) throw new Error('User not found');
      return user;
    },
    
    getCurrentUser: async (_, __, { user }) => {
      if (!user) throw new Error('Not authenticated');
      const currentUser = await User.findById(user.userId).select('-passwordHash');
      return currentUser;
    },
    
    listUsers: async (_, { skip = 0, limit = 50 }) => {
      const users = await User.find()
        .select('-passwordHash')
        .skip(skip)
        .limit(limit);
      return users;
    },
    
    verifyToken: async (_, { token }) => {
      try {
        jwt.verify(token, JWT_SECRET);
        return true;
      } catch (error) {
        return false;
      }
    }
  },
  
  Mutation: {
    register: async (_, { email, password, name }) => {
      // Check if user exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        throw new Error('User with this email already exists');
      }
      
      // Create user with password (will be hashed by pre-save middleware)
      const user = new User({
        email,
        passwordHash: password,
        name: name || email.split('@')[0],
        role: 'resident'
      });
      
      await user.save();
      
      // Generate token
      const token = jwt.sign(
        { 
          userId: user._id,
          email: user.email,
          role: user.role
        },
        JWT_SECRET,
        { expiresIn: '24h' }
      );
      
      // Get user without password
      const userWithoutPassword = await User.findById(user._id).select('-passwordHash');
      
      return {
        token,
        user: userWithoutPassword
      };
    },
    
    login: async (_, { email, password }) => {
      const user = await User.findOne({ email });
      
      if (!user) {
        throw new Error('User not found');
      }
      
      if (!user.passwordHash) {
        throw new Error('Please use OAuth login for this account');
      }
      
      const isPasswordValid = await user.comparePassword(password);
      if (!isPasswordValid) {
        throw new Error('Invalid password');
      }
      
      // Update last login
      user.lastLogin = new Date();
      await user.save();
      
      const token = jwt.sign(
        { 
          userId: user._id,
          email: user.email,
          role: user.role
        },
        JWT_SECRET,
        { expiresIn: '24h' }
      );
      
      const userWithoutPassword = await User.findById(user._id).select('-passwordHash');
      
      return {
        token,
        user: userWithoutPassword
      };
    },
    
    loginWithOAuth: async (_, { provider, token }) => {
      // In a real implementation, verify the OAuth token with the provider
      // For now, we'll use a simple implementation
      const decodedToken = jwt.decode(token);
      
      if (!decodedToken) {
        throw new Error('Invalid OAuth token');
      }
      
      // Find user by OAuth provider ID
      let user = await User.findOne({
        'oauthProviders.provider': provider,
        'oauthProviders.providerId': decodedToken.sub || decodedToken.id
      });
      
      // If user doesn't exist, create new one
      if (!user) {
        user = new User({
          email: decodedToken.email,
          name: decodedToken.name,
          role: 'resident',
          oauthProviders: [{
            provider,
            providerId: decodedToken.sub || decodedToken.id,
            email: decodedToken.email
          }]
        });
        await user.save();
      }
      
      // Update last login
      user.lastLogin = new Date();
      await user.save();
      
      // Generate JWT token
      const jwtToken = jwt.sign(
        { 
          userId: user._id,
          email: user.email,
          role: user.role
        },
        JWT_SECRET,
        { expiresIn: '24h' }
      );
      
      const userWithoutPassword = await User.findById(user._id).select('-passwordHash');
      
      return {
        token: jwtToken,
        user: userWithoutPassword
      };
    },
    
    updateProfile: async (_, { id, name, email, avatar }, { user: authUser }) => {
      if (!authUser) throw new Error('Not authenticated');
      if (authUser.userId !== id && authUser.role !== 'admin') {
        throw new Error('Unauthorized');
      }
      
      const user = await User.findByIdAndUpdate(
        id,
        { name, email, avatar, updatedAt: new Date() },
        { new: true }
      ).select('-passwordHash');
      
      return user;
    },
    
    assignRole: async (_, { userId, role }, { user: authUser }) => {
      if (!authUser || authUser.role !== 'admin') {
        throw new Error('Only admins can assign roles');
      }
      
      const user = await User.findByIdAndUpdate(
        userId,
        { role, updatedAt: new Date() },
        { new: true }
      ).select('-passwordHash');
      
      return user;
    },
    
    logout: async (_, __, { user }) => {
      // Token invalidation is handled client-side
      // This endpoint simply returns success
      return true;
    }
  }
};

export default resolvers;