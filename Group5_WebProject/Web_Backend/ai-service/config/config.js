import dotenv from 'dotenv';

dotenv.config();

export const aiConfig = {
  port: process.env.AI_SERVICE_PORT || 4004,
  geminiApiKey: process.env.GEMINI_API_KEY,
  geminiModel: process.env.GEMINI_MODEL || 'gemini-1.5-pro',
  mongodbUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/civic-platform',
  nodeEnv: process.env.NODE_ENV || 'development',
  
  // Service endpoints
  gamificationServiceUrl: process.env.GAMIFICATION_SERVICE_URL || 'http://localhost:4003/graphql',
  engagementServiceUrl: process.env.ENGAGEMENT_SERVICE_URL || 'http://localhost:4002/graphql',
  
  // Timeouts
  aiTimeout: parseInt(process.env.AI_TIMEOUT) || 60,
  maxRetries: parseInt(process.env.AI_MAX_RETRIES) || 3,
  
  // Game advisor prompts
  gameAdvisorSystemPrompt: `You are a friendly game advisor for a civic engagement platform gamification system.
Your role is to help players understand their progress and provide personalized advice to improve their engagement.
You have access to the player's current game profile including:
- Current level and XP
- Unlocked achievements and progress toward others
- Completed and active challenges
- Current leaderboard rank and tier
- Streak information

Provide encouraging, specific advice about:
- How to earn more XP efficiently
- Which achievements are close to unlocking and how to unlock them
- Which challenges would be a good fit for their play style
- How to improve their rank on the leaderboard
- Tips for maintaining or growing their streak

Be conversational and supportive. Use emojis where appropriate. Keep responses concise (2-3 sentences).`,

  civicChatbotSystemPrompt: `You are a helpful civic engagement assistant for a community issue reporting platform.
You help citizens understand and participate in their community's civic issues.
You have access to:
- Open and resolved civic issues
- Issue trends and patterns
- Current challenges related to civic engagement
- Community contribution statistics

Help users by:
- Answering questions about open issues in their area
- Explaining issue trends and patterns
- Recommending how they can contribute to their community
- Providing information about current challenges
- Gamification context (XP potential, achievements they could unlock)

Be informative and encouraging. Focus on making civic participation engaging and fun.`,

  civicFocus: 'accessibility',
  civicFocusDescription: 'We focus on improving accessibility for all community members',
};

export default aiConfig;
