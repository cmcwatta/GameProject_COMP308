import { GoogleGenerativeAI } from '@google/generative-ai';
import { config } from '../config/config.js';

const genAI = new GoogleGenerativeAI(config.gemini.apiKey);
const model = genAI.getGenerativeModel({ model: config.gemini.model });

export class GeminiService {
  static async classifyIssue(description) {
    try {
      const prompt = `Analyze this community issue: "${description}"
      
      Categorize it and return JSON with:
      {
        "category": "Pothole/Streetlight/Flooding/Safety/Vandalism/Garbage/Noise/Other",
        "priority": "low/medium/high/urgent",
        "suggestedDepartment": "Public Works/Transportation/Emergency/Parks/Sanitation",
        "confidence": 0.0 to 1.0,
        "tags": ["tag1", "tag2", "tag3"],
        "estimatedResponseTime": "hours/days/weeks"
      }`;
      
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      // Extract JSON from response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      
      return this.getDefaultClassification();
    } catch (error) {
      console.error('Gemini classification error:', error.message);
      return this.getDefaultClassification();
    }
  }

  static async chatbotQuery(query, context = {}) {
    try {
      const { userRole, location } = context;
      
      const prompt = `You are a civic engagement assistant for a Canadian municipality.
      User Role: ${userRole || 'Resident'}
      Location: ${location || 'Not specified'}
      
      User Query: "${query}"
      
      Provide helpful response about community issues, reporting, or municipal services.
      Include suggested actions and follow-up questions.
      
      Return JSON:
      {
        "response": "Your answer here",
        "suggestedActions": ["action1", "action2"],
        "followupQuestions": ["question1", "question2"]
      }`;
      
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      
      return {
        response: text || "I understand your query. How can I assist you further?",
        suggestedActions: ["Visit municipal website", "Submit issue report"],
        followupQuestions: ["Can you provide more details?", "What is your location?"]
      };
    } catch (error) {
      console.error('Chatbot error:', error.message);
      return {
        response: "Sorry, I'm having trouble processing your request. Please try again.",
        suggestedActions: [],
        followupQuestions: []
      };
    }
  }

  static async summarizeIssues(issuesText) {
    try {
      const prompt = `Summarize these community issues concisely:
      ${issuesText}
      
      Focus on:
      1. Main problems
      2. Status overview
      3. Urgent matters
      4. Recommendations`;
      
      const result = await model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Summarization error:', error.message);
      return "Unable to generate summary at this time.";
    }
  }

  static async detectTrends(issuesData) {
    try {
      const prompt = `Analyze these community issues for trends:
      ${JSON.stringify(issuesData, null, 2)}
      
      Return JSON array of trends:
      [{
        "pattern": "Description",
        "location": "Area",
        "frequency": "Number per week",
        "severity": "low/medium/high",
        "recommendation": "Action to take"
      }]`;
      
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      const jsonMatch = text.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      
      return [];
    } catch (error) {
      console.error('Trend detection error:', error.message);
      return [];
    }
  }

  static async analyzeSentiment(text) {
    try {
      const prompt = `Analyze sentiment of: "${text}"
      Return only: positive, negative, or neutral`;
      
      const result = await model.generateContent(prompt);
      const response = await result.response;
      return response.text().toLowerCase().trim();
    } catch (error) {
      console.error('Sentiment analysis error:', error.message);
      return "neutral";
    }
  }

  static getDefaultClassification() {
    return {
      category: "Other",
      priority: "medium",
      suggestedDepartment: "Public Works",
      confidence: 0.5,
      tags: ["general"],
      estimatedResponseTime: "days"
    };
  }
}