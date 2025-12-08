/*import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { gql } from 'apollo-server-express';

// Example typeDefs for AI analytics/chatbot
const typeDefs = gql`
  type Query {
    classifyIssue(description: String!): String!
    summarizeIssues: String!
    detectTrends: [String!]!
    chatbotQuery(query: String!): String!
  }
`;

const resolvers = {
  Query: {
    classifyIssue: async (_, { description }) => {
      // Integrate Gemini or other AI model here
      return 'Category: Example';
    },
    summarizeIssues: async () => {
      // Summarize issues using AI
      return 'Summary: Example';
    },
    detectTrends: async () => {
      // Detect trends using AI
      return ['Trend1', 'Trend2'];
    },
    chatbotQuery: async (_, { query }) => {
      // Integrate LangGraph + Gemini chatbot here
      return 'Chatbot response: Example';
    },
  },
};

const app = express();
const server = new ApolloServer({ typeDefs, resolvers });
await server.start();
server.applyMiddleware({ app });

app.listen(4002, () => {
  console.log('AI Service running on port 4002');
});*/


// ai-service/index.js (enhanced)
import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import cors from 'cors';
import { config } from './config/config.js';
import typeDefs from './graphql/typeDefs.js';
import resolvers from './graphql/resolvers.js';

const app = express();

// Middleware
app.use(cors(config.cors));
app.use(express.json());

// GraphQL Server
const server = new ApolloServer({
  typeDefs,
  resolvers,
  introspection: true,
  formatError: (error) => {
    console.error('GraphQL Error:', error);
    return {
      message: error.message,
      locations: error.locations,
      path: error.path
    };
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'AI Service',
    timestamp: new Date().toISOString(),
    environment: config.nodeEnv
  });
});

// Test endpoint
app.get('/test', async (req, res) => {
  try {
    const { AIService } = await import('./services/aiService.js');
    const result = await AIService.classifyIssue('There is a large pothole on Main Street');
    res.json({ success: true, result });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Start server
async function startServer() {
  await server.start();
  server.applyMiddleware({ app, path: '/graphql' });
  
  app.listen(config.port, () => {
    console.log(`🚀 AI Service running on port ${config.port}`);
    console.log(`📡 GraphQL endpoint: http://localhost:${config.port}${server.graphqlPath}`);
    console.log(`✅ Health check: http://localhost:${config.port}/health`);
    console.log(`🔧 Environment: ${config.nodeEnv}`);
  });
}

// Handle errors
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

// Start the server
startServer().catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});

export default app;