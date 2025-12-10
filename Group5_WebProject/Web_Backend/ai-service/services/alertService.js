/**
 * Alert Service for AI Service
 * Sends notifications about AI-generated insights to the Notification Service
 */

const NOTIFICATION_SERVICE_URL = process.env.NOTIFICATION_SERVICE_URL || 'http://localhost:4005/graphql';

export class AlertService {
  /**
   * Notify about AI insights generated
   */
  static async notifyAIInsight(insightData) {
    try {
      // Create a summary of insights for the notification
      const insightSummary = Array.isArray(insightData.insights) 
        ? insightData.insights.slice(0, 3).join('; ')
        : insightData.insights;

      const mutation = `
        mutation CreateNotification($input: CreateNotificationInput!) {
          createNotification(input: $input) {
            id
            userId
            title
            message
          }
        }
      `;

      const variables = {
        input: {
          userId: 'ai-system',
          type: 'ai_insight',
          title: 'AI Insights Generated',
          message: `New AI insights have been generated from ${insightData.issueCount} issues: ${insightSummary.substring(0, 100)}${insightSummary.length > 100 ? '...' : ''}`,
          data: {
            insightCount: Array.isArray(insightData.insights) ? insightData.insights.length : 1,
            issueCount: insightData.issueCount,
            generatedAt: insightData.generatedAt,
          },
        },
      };

      const response = await fetch(NOTIFICATION_SERVICE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: mutation, variables }),
      });

      const data = await response.json();
      if (data.errors) {
        console.error('GraphQL error in notifyAIInsight:', data.errors);
      }
      return data.data?.createNotification;
    } catch (error) {
      console.error('Error sending AI insight notification:', error);
      throw error;
    }
  }
}
