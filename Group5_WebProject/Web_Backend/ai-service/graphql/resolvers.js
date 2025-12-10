import { AIService } from '../services/aiService.js';
import { AlertService } from '../services/alertService.js';

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
      try {
        const insights = await AIService.generateInsights(issues);
        
        // Send notification about AI insights
        try {
          if (insights && insights.length > 0) {
            await AlertService.notifyAIInsight({
              insights,
              issueCount: issues ? issues.length : 0,
              generatedAt: new Date().toISOString(),
            });
          }
        } catch (notificationError) {
          console.warn('Failed to send AI insight notification:', notificationError);
        }
        
        return insights;
      } catch (error) {
        console.error('Error generating insights:', error);
        throw error;
      }
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