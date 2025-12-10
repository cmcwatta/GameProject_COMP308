import dotenv from 'dotenv';
dotenv.config();

import { config } from './config/config.js';
import express from 'express';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { buildSubgraphSchema } from '@apollo/subgraph';
import mongoose from 'mongoose';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import jwt from 'jsonwebtoken';
import connectDB from './config/mongoose.js';
import typeDefs from './graphql/typeDef.js';
import resolvers from './graphql/resolvers.js';

// Connect to MongoDB
connectDB();

const app = express();

// CORS configuration
app.use(cors({
  origin: config.cors.origin,
  credentials: true,
}));

// Middleware
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'Auth Service',
    timestamp: new Date().toISOString(),
    environment: config.nodeEnv
  });
});

// GraphQL setup
const schema = buildSubgraphSchema([{ typeDefs, resolvers }]);

const server = new ApolloServer({
  schema,
  introspection: true,
});

async function startServer() {
  await server.start();
  
  app.use('/graphql', cors(config.cors), expressMiddleware(server, {
    context: async ({ req, res }) => {
      // Check for token in cookies or headers
      const token = req.cookies?.token || req.headers.authorization?.split(' ')[1];
      let user = null;
      
      // Verify token
      if (token) {
        try {
          const decoded = jwt.verify(token, config.jwtSecret);
          user = {
            userId: decoded.userId,
            username: decoded.username,
            email: decoded.email,
            role: decoded.role
          };
        } catch (error) {
          console.error("Token verification failed:", error.message);
        }
      }
      
      return { user, req, res };
    }
  }));
  
  app.listen(config.port, () => {
    console.log(`🚀 Auth Service running at http://localhost:${config.port}`);
    console.log(`📡 GraphQL endpoint: http://localhost:${config.port}/graphql`);
    console.log(`✅ Health check: http://localhost:${config.port}/health`);
    console.log(`👥 User roles: ${['resident', 'municipal_staff', 'community_advocate', 'admin'].join(', ')}`);
  });
}

startServer().catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});