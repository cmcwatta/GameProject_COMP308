import dotenv from 'dotenv';
dotenv.config({ path: './.env' });

import express from 'express';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { buildSubgraphSchema } from '@apollo/subgraph';
import mongoose from 'mongoose';
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

// Connect to MongoDB
connectDB();

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
        console.log(`🚀 Issue Service running at http://localhost:${config.port}/graphql`);
    });
}

startServer().catch(error => {
    console.error('Failed to start server:', error);
    process.exit(1);
});
