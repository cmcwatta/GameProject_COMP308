import dotenv from 'dotenv';
dotenv.config({ path: './.env' });

import express from 'express';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { buildSubgraphSchema } from '@apollo/subgraph';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import connectDB from './config/mongoose.js';
import { config } from './config/config.js';
import typeDefs from './graphql/typeDefs.js';
import resolvers from './graphql/resolvers.js';

const app = express();

app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:4000', 'http://localhost:5173', 'https://studio.apollographql.com'],
    credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({
        status: 'healthy',
        service: 'AI Service',
        timestamp: new Date().toISOString(),
        environment: config.nodeEnv
    });
});

// Connect to MongoDB
connectDB();

const schema = buildSubgraphSchema([{ typeDefs, resolvers }]);

const server = new ApolloServer({
    schema,
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

async function startServer() {
    await server.start();

    app.use('/graphql', expressMiddleware(server, {
        context: async ({ req, res }) => {
            const token = req.cookies?.token || req.headers.authorization?.split(' ')[1];
            let user = null;

            if (token) {
                try {
                    const decoded = jwt.verify(token, config.JWT_SECRET);
                    user = {
                        userId: decoded.userId,
                        email: decoded.email,
                        role: decoded.role
                    };
                } catch (error) {
                    console.error('Token verification failed:', error.message);
                }
            }

            return { user, req, res };
        }
    }));

    app.listen(config.port, () => {
        console.log(`🚀 AI Service running at http://localhost:${config.port}/graphql`);
        console.log(`✅ Health check: http://localhost:${config.port}/health`);
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

startServer().catch(error => {
    console.error('Failed to start server:', error);
    process.exit(1);
});

export default app;