import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import bcrypt from 'bcrypt';
import { config } from '../config/config.js';

const JWT_SECRET = config.jwtSecret;

const generateToken = (userId, email) => {
  return jwt.sign({ userId, email }, JWT_SECRET, { expiresIn: '7d' });
};

const resolvers = {
  Query: {
    getUser: async (_, { id }) => {
      return await User.findById(id).select('-password');
    },
    getCurrentUser: async (_, __, { user }) => {
      if (!user) throw new Error('Not authenticated');
      return await User.findById(user.userId).select('-password');
    },
    getUserByEmail: async (_, { email }) => {
      return await User.findOne({ email }).select('-password');
    },
    getUsers: async (_, { role, status }) => {
      const filter = {};
      if (role) filter.role = role;
      if (status) filter.status = status;
      return await User.find(filter).select('-password');
    }
  },
  Mutation: {
    register: async (_, { email, name, password, phone, role }) => {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        throw new Error('Email already registered');
      }
      const newUser = new User({
        email,
        name,
        password,
        phone,
        role: role || 'Resident',
        preferences: {
          notificationFrequency: 'daily',
          categories: ['Pothole', 'Streetlight', 'Flooding', 'Safety Hazard', 'Accessibility'],
          alertRadius: 5
        },
        status: 'active',
        emailVerified: false
      });
      await newUser.save();
      const token = generateToken(newUser._id, newUser.email);
      return { token, user: newUser };
    },
    login: async (_, { email, password }) => {
      const user = await User.findOne({ email });
      if (!user) {
        throw new Error('User not found');
      }
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        throw new Error('Invalid password');
      }
      const token = generateToken(user._id, user.email);
      return { token, user };
    },
    logout: async () => {
      return true;
    },
    updateProfile: async (_, { name, phone, location, preferences }, { user }) => {
      if (!user) throw new Error('Not authenticated');
      const updateData = {};
      if (name) updateData.name = name;
      if (phone) updateData.phone = phone;
      if (location) updateData.location = location;
      if (preferences) updateData.preferences = preferences;
      return await User.findByIdAndUpdate(user.userId, updateData, { new: true }).select('-password');
    },
    loginWithGoogle: async (_, { token }) => {
      try {
        const decoded = jwt.decode(token);
        let user = await User.findOne({ 'oauthProviders.externalId': decoded.sub, 'oauthProviders.provider': 'google' });
        
        if (!user) {
          user = await User.findOne({ email: decoded.email });
          if (!user) {
            user = new User({
              email: decoded.email,
              name: decoded.name,
              emailVerified: true,
              status: 'active',
              role: 'Resident',
              preferences: {
                notificationFrequency: 'daily',
                categories: ['Pothole', 'Streetlight', 'Flooding', 'Safety Hazard', 'Accessibility'],
                alertRadius: 5
              },
              oauthProviders: [{
                provider: 'google',
                externalId: decoded.sub,
                email: decoded.email
              }]
            });
            await user.save();
          } else {
            user.oauthProviders.push({
              provider: 'google',
              externalId: decoded.sub,
              email: decoded.email
            });
            await user.save();
          }
        }
        const jwtToken = generateToken(user._id, user.email);
        return { token: jwtToken, user };
      } catch (error) {
        throw new Error('Google authentication failed: ' + error.message);
      }
    },
    loginWithGitHub: async (_, { code }) => {
      try {
        const response = await fetch('https://github.com/login/oauth/access_token', {
          method: 'POST',
          headers: { 'Accept': 'application/json' },
          body: JSON.stringify({
            client_id: config.githubOAuthClientId,
            client_secret: config.githubOAuthClientSecret,
            code
          })
        });
        const data = await response.json();
        if (!data.access_token) throw new Error('Failed to get access token');
        
        const userResponse = await fetch('https://api.github.com/user', {
          headers: { 'Authorization': `Bearer ${data.access_token}` }
        });
        const githubUser = await userResponse.json();
        
        let user = await User.findOne({ 'oauthProviders.externalId': githubUser.id, 'oauthProviders.provider': 'github' });
        
        if (!user) {
          user = await User.findOne({ email: githubUser.email });
          if (!user) {
            user = new User({
              email: githubUser.email,
              name: githubUser.name || githubUser.login,
              emailVerified: true,
              status: 'active',
              role: 'Resident',
              preferences: {
                notificationFrequency: 'daily',
                categories: ['Pothole', 'Streetlight', 'Flooding', 'Safety Hazard', 'Accessibility'],
                alertRadius: 5
              },
              oauthProviders: [{
                provider: 'github',
                externalId: String(githubUser.id),
                email: githubUser.email
              }]
            });
            await user.save();
          } else {
            user.oauthProviders.push({
              provider: 'github',
              externalId: String(githubUser.id),
              email: githubUser.email
            });
            await user.save();
          }
        }
        const jwtToken = generateToken(user._id, user.email);
        return { token: jwtToken, user };
      } catch (error) {
        throw new Error('GitHub authentication failed: ' + error.message);
      }
    },
    updateUserStatus: async (_, { userId, status }, { user }) => {
      if (!user) throw new Error('Not authenticated');
      const currentUser = await User.findById(user.userId);
      if (currentUser.role !== 'Admin') throw new Error('Only admins can update user status');
      return await User.findByIdAndUpdate(userId, { status }, { new: true }).select('-password');
    },
    addStaffRole: async (_, { userId, department, staffId }, { user }) => {
      if (!user) throw new Error('Not authenticated');
      const currentUser = await User.findById(user.userId);
      if (currentUser.role !== 'Admin') throw new Error('Only admins can assign staff roles');
      return await User.findByIdAndUpdate(userId, 
        { role: 'Municipal Staff', department, staffId }, 
        { new: true }
      ).select('-password');
    },
    addVolunteerInfo: async (_, { userId, skills, hoursContributed }, { user }) => {
      if (!user) throw new Error('Not authenticated');
      if (user.userId !== userId && (await User.findById(user.userId)).role !== 'Admin') {
        throw new Error('Unauthorized');
      }
      return await User.findByIdAndUpdate(userId,
        { volunteerSkills: skills, hoursContributed },
        { new: true }
      ).select('-password');
    }
  }
};

export default resolvers;