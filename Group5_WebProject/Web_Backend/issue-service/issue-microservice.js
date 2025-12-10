import express from 'express';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { buildSubgraphSchema } from '@apollo/subgraph';
import cors from 'cors';
import connectDB from './config/mongoose.js';
import { config } from './config/config.js';
import { typeDefs } from './graphql/typeDefs.js';
import { resolvers } from './graphql/resolvers.js';

const app = express();
const PORT = config.port;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));

// Connect to MongoDB
connectDB();

// Apollo Server setup
const server = new ApolloServer({
  schema: buildSubgraphSchema([{ typeDefs, resolvers }]),
  introspection: true,
});

await server.start();

app.use(config.graphqlEndpoint, expressMiddleware(server));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', service: 'issue-service' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Issue Service running on port ${PORT}`);
  console.log(`GraphQL endpoint: http://localhost:${PORT}${config.graphqlEndpoint}`);
});
