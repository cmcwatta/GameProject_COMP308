import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import bcrypt from 'bcrypt';
import {config} from '../config/config.js'; // Use default import
const JWT_SECRET = config.jwtSecret;

const resolvers = {
  Query: {
    getUser: async (_, { username }) => {
      return await User.findOne({ username }).select('-password');
    },
    getUsers: async () => {
      return await User.find().select('-password');
    }
  },
  Mutation: {
    register: async (_, { username, email, password }) => {
      const existingUser = await User.findOne({ $or: [{ username }, { email }] });
      if (existingUser) {
        throw new Error('Username or email already exists');
      }
      const newUser = new User({ username, email, password, role: 'Resident' });
      await newUser.save();
      const token = jwt.sign({ userId: newUser._id, username: newUser.username }, JWT_SECRET);
      return { token, user: newUser };
    },
    signup: async (_, { username, email, password, role }) => {
      const existingUser = await User.findOne({ $or: [{ username }, { email }] });
      if (existingUser) {
        throw new Error('Username or email already exists');
      }
      const newUser = new User({ username, email, password, role: role || 'Resident' });
      await newUser.save();
      const token = jwt.sign({ userId: newUser._id, username: newUser.username }, JWT_SECRET);
      return { token, user: newUser };
    },
    login: async (_, { username, password }) => {
      const user = await User.findOne({ username });
      if (!user) {
        throw new Error('User not found');
      }
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        throw new Error('Invalid password');
      }
      const token = jwt.sign({ userId: user._id, username: user.username }, JWT_SECRET);
      return { token, user };
    },
    signin: async (_, { email, password }) => {
      const user = await User.findOne({ email });
      if (!user) {
        throw new Error('User not found');
      }
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        throw new Error('Invalid password');
      }
      const token = jwt.sign({ userId: user._id, username: user.username }, JWT_SECRET);
      return { token, user };
    }
  }
};

export default resolvers;