import express from 'express';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloGateway, IntrospectAndCompose } from '@apollo/gateway';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import { config } from './config/config.js';

const app = express();

// Middleware
app.use(cors({
  origin: config.cors.origin,
  credentials: config.cors.credentials,
}));
app.use(express.json());

// Token verification middleware
const verifyToken = (token) => {
  if (!token) return null;
  try {
    return jwt.verify(token, config.jwtSecret);
  } catch (error) {
    return null;
  }
};

// Apollo Gateway configuration with Apollo Federation
const gateway = new ApolloGateway({
  supergraphSdl: new IntrospectAndCompose({
    subgraphs: [
      { name: 'auth', url: 'http://localhost:4001/graphql' },
      { name: 'issue', url: 'http://localhost:4002/graphql' },
      { name: 'ai', url: 'http://localhost:4003/graphql' }
    ],
    pollIntervalInMs: 10000,
  }),
});

// Apollo Server setup with federation
const server = new ApolloServer({
  gateway,
  context: ({ req }) => {
    const authHeader = req.headers.authorization;
    const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;
    const user = verifyToken(token);
    
    if (token && user) {
      console.log("✅ Gateway: Authenticated user ID:", user.userId);
    } else if (token) {
      console.log("🚨 Gateway: Token verification failed");
    }
    
    return {
      user: user || null,
      token: token || null,
      userId: user?.userId || null,
      userRole: user?.role || null
    };
  },
  introspection: true,
});

// Start Apollo Server
await server.start();

// Apply GraphQL middleware
app.use('/graphql', expressMiddleware(server));

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'API Gateway',
    timestamp: new Date().toISOString(),
    federation: 'enabled',
    subgraphs: {
      auth: 'http://localhost:4001/graphql',
      issue: 'http://localhost:4002/graphql',
      ai: 'http://localhost:4003/graphql',
    },
  });
});

// Welcome message
app.get('/', (req, res) => {
  res.json({
    message: 'AI-Powered Local Issue Tracker - API Gateway',
    graphql: `${req.protocol}://${req.get('host')}/graphql`,
    federation: 'enabled',
    subgraphs: {
      auth: 'http://localhost:4001/graphql',
      issue: 'http://localhost:4002/graphql',
      ai: 'http://localhost:4003/graphql',
    },
    health: `${req.protocol}://${req.get('host')}/health`,
  });
});

// Start server
app.listen(config.port, () => {
  console.log(`🚀 Apollo Gateway running on port ${config.port}`);
  console.log(`📡 GraphQL endpoint: http://localhost:${config.port}/graphql`);
  console.log(`🔗 Apollo Federation enabled`);
  console.log(`
    ⚙️ Composed Subgraphs:
    - Auth Service: http://localhost:4001/graphql
    - Issue Service: http://localhost:4002/graphql
    - AI Service: http://localhost:4003/graphql
  `);
  console.log(`🔐 JWT token verification active`);
  console.log(`📊 Health check: http://localhost:${config.port}/health`);
});