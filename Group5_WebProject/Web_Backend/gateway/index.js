import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import cors from 'cors';
import { config } from './config/config.js';

const app = express();

// Middleware
app.use(cors({
  origin: config.cors.origin,
  credentials: config.cors.credentials,
}));
app.use(express.json());

// Proxy to services
app.use('/auth', createProxyMiddleware({
  target: config.services.auth.replace('/graphql', ''),
  changeOrigin: true,
  pathRewrite: {
    '^/auth': '',
  },
}));

app.use('/engagement', createProxyMiddleware({
  target: config.services.engagement.replace('/graphql', ''),
  changeOrigin: true,
  pathRewrite: {
    '^/engagement': '',
  },
}));

app.use('/ai', createProxyMiddleware({
  target: config.services.ai.replace('/graphql', ''),
  changeOrigin: true,
  pathRewrite: {
    '^/ai': '',
  },
}));

app.use('/notification', createProxyMiddleware({
  target: config.services.notification.replace('/graphql', ''),
  changeOrigin: true,
  pathRewrite: {
    '^/notification': '',
  },
}));

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'API Gateway',
    timestamp: new Date().toISOString(),
    routes: {
      auth: '/auth/graphql',
      engagement: '/engagement/graphql',
      ai: '/ai/graphql',
      notification: '/notification/graphql',
    },
  });
});

// Welcome message
app.get('/', (req, res) => {
  res.json({
    message: 'Civic Engagement Platform API Gateway',
    services: {
      auth: `${req.protocol}://${req.get('host')}/auth/graphql`,
      engagement: `${req.protocol}://${req.get('host')}/engagement/graphql`,
      ai: `${req.protocol}://${req.get('host')}/ai/graphql`,
      notification: `${req.protocol}://${req.get('host')}/notification/graphql`,
    },
    health: `${req.protocol}://${req.get('host')}/health`,
  });
});

// Start server
app.listen(config.port, () => {
  console.log(`🚀 API Gateway running on port ${config.port}`);
  console.log(`🔐 Auth Service: http://localhost:${config.port}/auth/graphql`);
  console.log(`🏗️ Engagement Service: http://localhost:${config.port}/engagement/graphql`);
  console.log(`🤖 AI Service: http://localhost:${config.port}/ai/graphql`);
  console.log(`🔔 Notification Service: http://localhost:${config.port}/notification/graphql`);
  console.log(`📊 Health check: http://localhost:${config.port}/health`);
});