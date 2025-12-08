import { AIService } from '../services/aiService.js';

const resolvers = {
  Query: {
    health: () => 'AI Service is healthy',
    
    classifyIssue: async (_, { description }) => {
      return await AIService.classifyIssue(description);
    },
    
    chatbotQuery: async (_, { query, userRole, location }) => {
      const context = { userRole, location };
      return await AIService.chatbotQuery(query, context);
    },
    
    summarizeIssues: async (_, { issues }) => {
      return await AIService.summarizeIssues(issues);
    },
    
    detectTrends: async (_, { issues }) => {
      return await AIService.detectTrends(issues);
    },
    
    analyzeSentiment: async (_, { text }) => {
      return await AIService.analyzeSentiment(text);
    },
    
    generateInsights: async (_, { issues }) => {
      return await AIService.generateInsights(issues);
    }
  },
  
  Mutation: {
    trainModel: async (_, { data }) => {
      console.log('Training model with data:', data.substring(0, 100));
      // In a real app, you would train the model here
      return true;
    },
    
    clearCache: async () => {
      console.log('Cache cleared');
      return true;
    }
  }
};

export default resolvers;