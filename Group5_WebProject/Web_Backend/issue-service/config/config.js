export const config = {
    port: process.env.ISSUE_SERVICE_PORT || 4002,
    mongoURI: process.env.MONGODB_URI || 'mongodb://localhost:27017/civic-issue-tracker',
    JWT_SECRET: process.env.JWT_SECRET || 'secret',
    NODE_ENV: process.env.NODE_ENV || 'development',
    LOG_LEVEL: process.env.LOG_LEVEL || 'debug'
};
