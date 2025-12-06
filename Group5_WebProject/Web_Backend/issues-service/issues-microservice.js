// server/microservices/issues-service/issues-microservice.js
import dotenv from 'dotenv';
dotenv.config({ path: './.env' });

import { config } from './config/config.js';
import express from 'express';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { buildSubgraphSchema } from '@apollo/subgraph';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import connectDB from './config/mongoose.js';
import typeDefs from './graphql/typeDef.js';
import resolvers from './graphql/resolvers.js';

console.log("🔍 Issues Service starting...");

// Connect to MongoDB
connectDB();

const app = express();
app.use(cors({
  origin: ['http://localhost:3000','http://localhost:3001', 'http://localhost:3002', 'http://localhost:4000','http://localhost:5173', 'https://studio.apollographql.com'],
  credentials: true,
}));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    service: 'issues-service',
    timestamp: new Date().toISOString()
  });
});

const schema = buildSubgraphSchema([{ typeDefs, resolvers }]);

const server = new ApolloServer({
  schema,
  introspection: true,
});

async function startServer() {
  await server.start();
  
  app.use('/graphql', expressMiddleware(server, {
    context: async ({ req, res }) => {
      const token = req.cookies?.token || req.headers.authorization?.split(' ')[1];
      let user = null;
      
      if (token) {
        try {
          const jwt = await import('jsonwebtoken');
          const { config: authConfig } = await import('./config/config.js');
          const decoded = jwt.verify(token, authConfig.jwtSecret);
          user = { 
            id: decoded.userId, 
            username: decoded.username,
            email: decoded.email,
            role: decoded.role 
          };
        } catch (error) {
          console.error("🚨 Token verification failed:", error.message);
        }
      }
      
      return { user, req, res };
    }
  }));
  
  app.listen(config.port, () => {
    console.log(`
    🚀 Issues Microservice running at:
    📡 Port: ${config.port}
    🔗 GraphQL: http://localhost:${config.port}/graphql
    ✅ Health: http://localhost:${config.port}/health
    `);
  });
}

startServer().catch(console.error);