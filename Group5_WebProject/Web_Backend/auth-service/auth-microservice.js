// server/microservices/auth-service/auth-microservice.js
import dotenv from 'dotenv';
dotenv.config({ path: './.env' });

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
//
console.log("🔍 JWT_SECRET in service:", process.env.JWT_SECRET);

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

// typeDefs is already parsed by gql tag, no need to parse again
const schema = buildSubgraphSchema([{ typeDefs, resolvers }]);
// 
const server = new ApolloServer({
  schema,
  introspection: true,
});
// 
async function startServer() {
  await server.start();
  // 
  app.use('/graphql', expressMiddleware(server, {
    context: async ({ req, res }) => {
      // Check for token in Authorization header or cookies
      const authHeader = req.headers.authorization;
      const token = authHeader?.startsWith('Bearer ') 
        ? authHeader.slice(7) 
        : req.cookies?.token;
      
      let user = null;
      
      // Verify token and extract user info
      if (token) {
        try {
          const decoded = jwt.verify(token, config.JWT_SECRET);
          user = {
            userId: decoded.userId,
            email: decoded.email,
            role: decoded.role
          };
          console.log("✅ Auth Microservice: Authenticated user:", user.userId);
        } catch (error) {
          console.error("🚨 Auth Microservice: Token verification failed:", error.message);
        }
      } else {
        console.log("🔍 Auth Microservice: No token provided");
      }
      
      return { user, req, res };
    }
  }));
  
  //
  //
  app.listen(config.port, () => console.log(`🚀 Auth Microservice running at http://localhost:${config.port}/graphql`));
}
//
startServer();