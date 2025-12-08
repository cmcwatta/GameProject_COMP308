import { GoogleGenerativeAI } from '@google/generative-ai';
import aiConfig from '../config/config.js';

export default class CivicChatbot {
  constructor() {
    this.genAI = new GoogleGenerativeAI(aiConfig.geminiApiKey);
    this.model = this.genAI.getGenerativeModel({ model: aiConfig.geminiModel });
    this.conversationHistory = new Map();
  }

  /**
   * Handle general civic information queries
   * @param {string} query - User's civic question
   * @param {string} userId - User ID for conversation context
   * @param {object} context - Additional context (location, issue category, etc.)
   * @returns {Promise<string>} AI response
   */
  async handleQuery(query, userId, context = {}) {
    try {
      const systemPrompt = `You are a helpful civic engagement assistant for a municipal issue tracking platform. 
Your role is to:
1. Help residents report and understand civic issues (potholes, streetlights, flooding, accessibility, safety hazards)
2. Provide guidance on the issue resolution process
3. Answer questions about municipal services and civic participation
4. Encourage community engagement and environmental responsibility
5. Direct users to appropriate resources and contacts

Be friendly, informative, and solution-focused. Keep responses concise but thorough.
Emphasize the importance of community participation in improving municipal services.`;

      const contextString = Object.entries(context)
        .map(([key, value]) => `${key}: ${value}`)
        .join('\n');

      const userMessage = `${query}${contextString ? '\n\nContext:\n' + contextString : ''}`;

      // Maintain conversation history per user
      if (!this.conversationHistory.has(userId)) {
        this.conversationHistory.set(userId, []);
      }

      const history = this.conversationHistory.get(userId);
      history.push({
        role: 'user',
        parts: [{ text: userMessage }]
      });

      // Keep only last 10 messages for efficiency
      if (history.length > 10) {
        history.shift();
      }

      const response = await this.model.generateContent({
        contents: [
          {
            role: 'user',
            parts: [{ text: systemPrompt }]
          },
          ...history
        ]
      });

      const answer = response.response.text();

      // Store assistant response in history
      history.push({
        role: 'model',
        parts: [{ text: answer }]
      });

      return answer;
    } catch (error) {
      console.error('Error in handleQuery:', error);
      throw new Error('Failed to process civic query: ' + error.message);
    }
  }

  /**
   * Specialized flooding emergency guidance
   * @param {object} userLocation - User's location {address, lat, lon}
   * @param {string} emergencyLevel - 'low', 'medium', 'high', 'critical'
   * @param {object} context - Additional context
   * @returns {Promise<object>} Flooding guidance with safety tips
   */
  async getFloodingGuidance(userLocation, emergencyLevel = 'medium', context = {}) {
    try {
      const prompt = `You are a flooding emergency assistant. Provide immediate, practical guidance for someone experiencing flooding.

User Location: ${userLocation?.address || 'Unknown'}
Emergency Level: ${emergencyLevel}
${context.currentWeather ? `Current Weather: ${context.currentWeather}` : ''}
${context.nearbyResources ? `Nearby Resources: ${context.nearbyResources}` : ''}

Provide:
1. Immediate safety actions (in priority order)
2. What to report to authorities
3. Resources and hotlines
4. Next steps after the flood subsides

Be direct, practical, and life-safety focused. Format the response as clear bullet points.`;

      const response = await this.model.generateContent(prompt);
      const text = response.response.text();

      return {
        emergencyLevel,
        location: userLocation,
        guidance: text,
        lastUpdated: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error in getFloodingGuidance:', error);
      throw new Error('Failed to get flooding guidance: ' + error.message);
    }
  }

  /**
   * Generate tips for issue prevention
   * @param {string} category - Issue category
   * @param {object} context - Location context
   * @returns {Promise<array>} Prevention tips
   */
  async getPreventionTips(category, context = {}) {
    try {
      const prompt = `Provide 3-4 practical prevention tips for ${category} issues in a municipal environment.
Focus on what residents and community members can do to prevent or minimize these issues.
Be specific, actionable, and encouraging.

Context: ${JSON.stringify(context)}

Format as a numbered list.`;

      const response = await this.model.generateContent(prompt);
      return response.response.text().split('\n').filter(line => line.trim());
    } catch (error) {
      console.error('Error in getPreventionTips:', error);
      return [];
    }
  }

  /**
   * Suggest escalation paths for issues
   * @param {string} category - Issue category
   * @param {string} severity - Issue severity
   * @returns {Promise<object>} Escalation recommendations
   */
  async suggestEscalation(category, severity) {
    try {
      const prompt = `For a ${severity} severity ${category} issue, what escalation path should be recommended?

Provide:
1. Is this a regular report or emergency escalation?
2. Which department should handle this?
3. Are there any external agencies to notify?
4. What's the typical timeline for resolution?

Be concise and actionable.`;

      const response = await this.model.generateContent(prompt);
      return {
        category,
        severity,
        recommendations: response.response.text()
      };
    } catch (error) {
      console.error('Error in suggestEscalation:', error);
      throw new Error('Failed to suggest escalation: ' + error.message);
    }
  }
}
