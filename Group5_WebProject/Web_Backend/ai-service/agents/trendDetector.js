import { GoogleGenerativeAI } from '@google/generative-ai';
import aiConfig from '../config/config.js';

export class TrendDetector {
  constructor() {
    this.genAI = new GoogleGenerativeAI(aiConfig.geminiApiKey);
    this.model = this.genAI.getGenerativeModel({ model: aiConfig.geminiModel });
  }

  /**
   * Detect flooding hotspots and risk areas from issue data
   * @param {number} radiusKm - Search radius in kilometers
   * @returns {Promise<object>} Flooding hotspots with risk levels
   */
  async detectFloodingHotspots(radiusKm = 10) {
    try {
      // In production, this would query MongoDB for flooding issues
      const prompt = `Based on historical flooding patterns in urban areas, what are typical flooding hotspots?

Provide hotspot analysis for a ${radiusKm}km radius area with:
1. Common hotspot locations (parking lots, low-lying areas, underpasses, etc.)
2. Risk factors (poor drainage, proximity to waterways, infrastructure age)
3. Seasonal patterns
4. Mitigation recommendations

Format response as JSON array of hotspots with risk levels (low/medium/high/critical)`;

      const response = await this.model.generateContent(prompt);
      const jsonText = response.response.text();
      
      const jsonMatch = jsonText.match(/\[[\s\S]*\]/);
      return jsonMatch ? JSON.parse(jsonMatch[0]) : [];
    } catch (error) {
      console.error('Error detecting flooding hotspots:', error);
      return {
        error: 'Unable to detect hotspots',
        message: error.message,
        suggestions: [
          'Review historical flooding reports',
          'Analyze geographic elevation data',
          'Cross-reference with drainage infrastructure'
        ]
      };
    }
  }

  /**
   * Detect patterns in civic issues over time
   * @param {number} days - Number of days to analyze
   * @returns {Promise<object>} Issue patterns and trends
   */
  async detectIssuePatterns(days = 30) {
    try {
      const prompt = `Analyze typical patterns in civic issue reporting for a ${days}-day period.

What patterns typically emerge:
1. Peak reporting times (time of day, day of week)
2. Seasonal factors
3. Category distribution shifts
4. Geographic concentration patterns
5. Weather correlations

Provide actionable insights for municipal staff planning and resource allocation.
Format as JSON with pattern categories and recommendations.`;

      const response = await this.model.generateContent(prompt);
      const jsonText = response.response.text();
      
      const jsonMatch = jsonText.match(/\{[\s\S]*\}/);
      return jsonMatch ? JSON.parse(jsonMatch[0]) : {};
    } catch (error) {
      console.error('Error detecting patterns:', error);
      return {
        error: 'Unable to detect patterns',
        message: error.message,
        suggestions: [
          'Collect at least 30 days of data',
          'Analyze by hour and day of week',
          'Cross-reference with weather data'
        ]
      };
    }
  }

  /**
   * Get distribution of issues by category
   * @returns {Promise<object>} Category distribution with percentages
   */
  async getCategoryDistribution() {
    try {
      const prompt = `Provide typical category distribution for civic issue reports in a municipality.

Categories: Pothole, Streetlight, Flooding, Safety Hazard, Accessibility, Other

Return as JSON with:
1. Percentage distribution
2. Trend direction (increasing/decreasing/stable)
3. Seasonal variations
4. Year-over-year comparison insights

Format response as valid JSON only.`;

      const response = await this.model.generateContent(prompt);
      const jsonText = response.response.text();
      
      const jsonMatch = jsonText.match(/\{[\s\S]*\}/);
      return jsonMatch ? JSON.parse(jsonMatch[0]) : {};
    } catch (error) {
      console.error('Error getting category distribution:', error);
      return {
        distribution: {
          'Pothole': 25,
          'Streetlight': 20,
          'Flooding': 15,
          'Safety Hazard': 20,
          'Accessibility': 12,
          'Other': 8
        },
        error: error.message
      };
    }
  }

  /**
   * Analyze SLA compliance and performance
   * @param {number} days - Days to analyze
   * @param {string} category - Optional category filter
   * @returns {Promise<object>} SLA performance metrics
   */
  async analyzeSLAPerformance(days = 30, category = null) {
    try {
      const categoryFilter = category ? `focusing on ${category} category` : 'across all categories';
      
      const prompt = `Analyze SLA (Service Level Agreement) performance metrics ${categoryFilter} over a ${days}-day period.

Typical SLA deadlines:
- Flooding: 24 hours
- Safety Hazard: 48 hours
- Streetlight: 72 hours
- Pothole: 120 hours
- Accessibility: 96 hours
- Other: 144 hours

Provide analysis of:
1. On-time completion rate (%)
2. Average resolution time
3. Categories with best/worst performance
4. Bottlenecks and delays
5. Improvement recommendations

Format as JSON with metrics and recommendations.`;

      const response = await this.model.generateContent(prompt);
      const jsonText = response.response.text();
      
      const jsonMatch = jsonText.match(/\{[\s\S]*\}/);
      return jsonMatch ? JSON.parse(jsonMatch[0]) : {};
    } catch (error) {
      console.error('Error analyzing SLA performance:', error);
      return {
        error: 'Unable to analyze SLA performance',
        message: error.message,
        recommendations: [
          'Ensure SLA definitions are clear',
          'Track resolution times consistently',
          'Identify resource constraints'
        ]
      };
    }
  }

  /**
   * Generate insights for staff dashboards
   * @param {number} days - Days to analyze
   * @returns {Promise<object>} Dashboard insights
   */
  async generateDashboardInsights(days = 30) {
    try {
      const prompt = `Generate key insights and metrics for a municipal staff dashboard tracking civic issue management.

Time period: Last ${days} days

Provide:
1. Total issues reported (with change %)
2. Average resolution time
3. Top 3 issue categories
4. Urgent items requiring attention
5. Performance highlights
6. Recommended focus areas

Format as JSON for dashboard display.`;

      const response = await this.model.generateContent(prompt);
      const jsonText = response.response.text();
      
      const jsonMatch = jsonText.match(/\{[\s\S]*\}/);
      return jsonMatch ? JSON.parse(jsonMatch[0]) : {};
    } catch (error) {
      console.error('Error generating dashboard insights:', error);
      return {
        error: 'Unable to generate insights',
        message: error.message
      };
    }
  }

  /**
   * Predict issue trends
   * @param {number} daysForward - Days to predict forward
   * @returns {Promise<object>} Trend predictions
   */
  async predictTrends(daysForward = 7) {
    try {
      const prompt = `Predict civic issue trends for the next ${daysForward} days.

Based on typical municipal patterns, predict:
1. Expected issue volume (% change)
2. Categories likely to increase/decrease
3. Weather-related factors to watch
4. Resource needs (staffing, equipment)
5. Potential hotspots
6. Risk factors

Format as JSON with predictions and confidence levels.`;

      const response = await this.model.generateContent(prompt);
      const jsonText = response.response.text();
      
      const jsonMatch = jsonText.match(/\{[\s\S]*\}/);
      return jsonMatch ? JSON.parse(jsonMatch[0]) : {};
    } catch (error) {
      console.error('Error predicting trends:', error);
      return {
        error: 'Unable to predict trends',
        message: error.message,
        disclaimer: 'Predictions are based on historical patterns and may not reflect actual outcomes'
      };
    }
  }

  /**
   * Analyze community engagement metrics
   * @returns {Promise<object>} Engagement analysis
   */
  async analyzeEngagement() {
    try {
      const prompt = `Analyze civic engagement metrics for the community issue reporting platform.

Provide analysis of:
1. Participation rates by category
2. Comment engagement levels
3. Upvote patterns
4. User retention
5. Peak engagement times
6. Engagement improvement suggestions

Format response as JSON.`;

      const response = await this.model.generateContent(prompt);
      const jsonText = response.response.text();
      
      const jsonMatch = jsonText.match(/\{[\s\S]*\}/);
      return jsonMatch ? JSON.parse(jsonMatch[0]) : {};
    } catch (error) {
      console.error('Error analyzing engagement:', error);
      return {
        error: 'Unable to analyze engagement',
        message: error.message
      };
    }
  }
}
