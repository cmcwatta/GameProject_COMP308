import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import bcrypt from 'bcrypt';
import {config} from '../config/config.js'; // Use default import
const JWT_SECRET = config.jwtSecret;

const resolvers = {
  Query: {
    getUser: async (_, { username }) => {
      return await User.find
        .findOne({ username })
        .select('-password'); // Exclude password from the result
    }
    },
    Mutation: {
    register: async (_, { username, password }) => {
      const existingUser = await User.findOne({ username });
      if (existingUser) {
        throw new Error('Username already exists');
      }
        const newUser = new User({ username, password });
        await newUser.save();
        const token = jwt.sign({ userId: newUser._id }, JWT_SECRET);
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
      const token = jwt.sign({ userId: user._id }, JWT_SECRET);
      return { token, user };
    }
    }
};

export default resolvers;