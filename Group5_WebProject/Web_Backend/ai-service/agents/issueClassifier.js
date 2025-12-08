import { GoogleGenerativeAI } from '@google/generative-ai';
import aiConfig from '../config/config.js';

export class IssueClassifier {
  constructor() {
    this.genAI = new GoogleGenerativeAI(aiConfig.geminiApiKey);
    this.model = this.genAI.getGenerativeModel({ model: aiConfig.geminiModel });
    this.categories = ['Pothole', 'Streetlight', 'Flooding', 'Safety Hazard', 'Accessibility', 'Other'];
    this.priorities = ['Low', 'Medium', 'High', 'Critical'];
  }

  /**
   * Classify issue based on title and description
   * @param {string} title - Issue title
   * @param {string} description - Issue description
   * @returns {Promise<object>} Classification result with category, priority, confidence
   */
  async classifyIssue(title, description) {
    try {
      const categoriesStr = this.categories.join(', ');
      const prioritiesStr = this.priorities.join(', ');

      const prompt = `You are a civic issue classification system. Classify the following issue.

Issue Title: "${title}"
Issue Description: "${description}"

Classify the issue with:
1. Category (must be one of: ${categoriesStr})
2. Priority (must be one of: ${prioritiesStr})
3. Confidence score (0.0 - 1.0)
4. Brief reasoning (one sentence)
5. Suggested SLA deadline in hours

Consider:
- Immediate safety hazards → High/Critical priority
- Accessibility issues → Medium priority
- Infrastructure issues (potholes, streetlights) → Low/Medium priority
- Flooding reports → High priority with special attention

Respond in valid JSON format:
{
  "category": "...",
  "priority": "...",
  "confidence": 0.0,
  "reasoning": "...",
  "suggestedSLAHours": 24,
  "relatedCategories": ["..."]
}`;

      const response = await this.model.generateContent(prompt);
      const jsonText = response.response.text();
      
      // Extract JSON from response
      const jsonMatch = jsonText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No valid JSON in response');
      }

      const result = JSON.parse(jsonMatch[0]);
      return {
        ...result,
        classified: true,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error classifying issue:', error);
      return {
        category: 'Other',
        priority: 'Medium',
        confidence: 0.5,
        reasoning: 'Automatic classification failed, using defaults',
        suggestedSLAHours: 120,
        relatedCategories: [],
        classified: false,
        error: error.message
      };
    }
  }

  /**
   * Analyze sentiment of civic content
   * @param {string} text - Text to analyze
   * @returns {Promise<object>} Sentiment analysis result
   */
  async analyzeSentiment(text) {
    try {
      const prompt = `Analyze the sentiment of this civic engagement comment or feedback.

Text: "${text}"

Provide:
1. Overall sentiment: "positive", "neutral", or "negative"
2. Confidence score (0.0 - 1.0)
3. Emotional tone: brief description
4. Key sentiment drivers: 2-3 phrases
5. Urgency indicators: true/false

Respond in valid JSON:
{
  "sentiment": "neutral",
  "confidence": 0.8,
  "emotionalTone": "...",
  "sentimentDrivers": ["...", "..."],
  "urgencyIndicators": false
}`;

      const response = await this.model.generateContent(prompt);
      const jsonText = response.response.text();
      
      const jsonMatch = jsonText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No valid JSON in response');
      }

      const result = JSON.parse(jsonMatch[0]);
      return {
        ...result,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error analyzing sentiment:', error);
      return {
        sentiment: 'neutral',
        confidence: 0.5,
        emotionalTone: 'Neutral tone, unable to analyze',
        sentimentDrivers: [],
        urgencyIndicators: false,
        error: error.message
      };
    }
  }

  /**
   * Summarize issue details
   * @param {string} title - Issue title
   * @param {string} description - Issue description
   * @param {array} comments - Related comments
   * @returns {Promise<object>} Summary with key points and recommendations
   */
  async summarizeIssue(title, description, comments = []) {
    try {
      const commentsText = comments
        .slice(0, 5)
        .map((c, i) => `Comment ${i + 1}: ${c}`)
        .join('\n');

      const prompt = `Create a concise executive summary of this civic issue report.

Title: "${title}"
Description: "${description}"
${commentsText ? `\nCommunity Comments:\n${commentsText}` : ''}

Provide:
1. Issue Summary (2-3 sentences)
2. Key Facts (3-4 bullet points)
3. Community Feedback (if any)
4. Recommended Actions (2-3 points for staff)
5. Public Communication (how to inform residents about progress)

Be professional and solution-focused.`;

      const response = await this.model.generateContent(prompt);
      return {
        issueSummary: response.response.text(),
        sourceTitle: title,
        commentCount: comments.length,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error summarizing issue:', error);
      throw new Error('Failed to summarize issue: ' + error.message);
    }
  }

  /**
   * Generate response template for issue
   * @param {string} category - Issue category
   * @param {string} priority - Issue priority
   * @returns {Promise<string>} Response template
   */
  async generateResponseTemplate(category, priority) {
    try {
      const prompt = `Create a professional but friendly response template for a municipal staff member to use when responding to a ${priority.toLowerCase()} priority ${category} issue.

The template should:
1. Acknowledge the issue professionally
2. Show understanding of impact
3. Provide next steps
4. Give timeline expectations
5. Include contact information placeholder
6. Invite further feedback

Keep it around 100-150 words.`;

      const response = await this.model.generateContent(prompt);
      return response.response.text();
    } catch (error) {
      console.error('Error generating response template:', error);
      return 'Thank you for reporting this issue. We appreciate your input and will investigate promptly.';
    }
  }

  /**
   * Extract key details from issue
   * @param {string} description - Issue description
   * @returns {Promise<object>} Extracted details
   */
  async extractDetails(description) {
    try {
      const prompt = `Extract key details from this civic issue report in a structured format.

Issue: "${description}"

Identify and extract:
1. Specific location details (if mentioned)
2. When the issue was first noticed
3. Affected people or areas
4. Safety concerns (if any)
5. Weather/environmental factors
6. Any equipment or infrastructure involved

Respond in JSON:
{
  "location": "...",
  "timeframe": "...",
  "affectedEntities": ["..."],
  "safetyConcerns": false,
  "environmentalFactors": "...",
  "equipmentInvolved": "..."
}`;

      const response = await this.model.generateContent(prompt);
      const jsonText = response.response.text();
      
      const jsonMatch = jsonText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No valid JSON in response');
      }

      return JSON.parse(jsonMatch[0]);
    } catch (error) {
      console.error('Error extracting details:', error);
      return {
        location: 'Unknown',
        timeframe: 'Unknown',
        affectedEntities: [],
        safetyConcerns: false,
        environmentalFactors: '',
        equipmentInvolved: ''
      };
    }
  }
}
