import { GeminiService } from './geminiService.js';

export class AIService {
  static async classifyIssue(description) {
    return await GeminiService.classifyIssue(description);
  }

  static async chatbotQuery(query, context) {
    return await GeminiService.chatbotQuery(query, context);
  }

  static async summarizeIssues(issuesArray) {
    const issuesText = issuesArray.map(issue => 
      `- ${issue.title}: ${issue.description} (Status: ${issue.status})`
    ).join('\n');
    
    return await GeminiService.summarizeIssues(issuesText);
  }

  static async detectTrends(issuesArray) {
    const issuesData = issuesArray.map(issue => ({
      title: issue.title,
      description: issue.description.substring(0, 200),
      category: issue.category,
      status: issue.status,
      createdAt: issue.createdAt
    }));
    
    return await GeminiService.detectTrends(issuesData);
  }

  static async analyzeSentiment(text) {
    return await GeminiService.analyzeSentiment(text);
  }

  static async generateInsights(issuesArray) {
    try {
      const summary = await this.summarizeIssues(issuesArray);
      const trends = await this.detectTrends(issuesArray);
      
      return {
        summary,
        trends,
        totalIssues: issuesArray.length,
        generatedAt: new Date().toISOString()
      };
    } catch (error) {
      console.error('Insights generation error:', error);
      return {
        summary: "Unable to generate insights",
        trends: [],
        totalIssues: issuesArray.length,
        error: error.message
      };
    }
  }
}