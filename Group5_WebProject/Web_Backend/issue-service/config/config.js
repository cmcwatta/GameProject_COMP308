export const config = {
  port: process.env.PORT || 4003,
  graphqlEndpoint: '/graphql',
  mongodbUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/issue-service',
  nodeEnv: process.env.NODE_ENV || 'development',
  gatewayUrl: process.env.GATEWAY_URL || 'http://localhost:4000',
};

export default config;
