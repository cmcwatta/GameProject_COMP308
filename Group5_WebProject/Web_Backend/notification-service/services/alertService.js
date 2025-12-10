/**
 * Alert Service - Handles notification triggers for various events
 * Used by other services to notify users about important events
 */

import { sendNotification, sendUrgentAlert } from '../index.js';

export class AlertService {
  /**
   * Send issue created notification
   */
  static async notifyIssueCreated(issueId, issueTitle, submitterName, userId) {
    try {
      await sendNotification(userId, {
        type: 'issue_update',
        title: 'New Issue Reported',
        message: `${submitterName} reported a new issue: "${issueTitle}"`,
        data: {
          issueId,
          submitterName,
          timestamp: new Date().toISOString()
        }
      });
    } catch (error) {
      console.error('❌ Error notifying issue created:', error);
    }
  }

  /**
   * Send issue status changed notification
   */
  static async notifyIssueStatusChanged(issueId, issueTitle, oldStatus, newStatus, userId) {
    try {
      await sendNotification(userId, {
        type: 'status_change',
        title: 'Issue Status Updated',
        message: `Issue "${issueTitle}" status changed from ${oldStatus} to ${newStatus}`,
        data: {
          issueId,
          oldStatus,
          newStatus,
          timestamp: new Date().toISOString()
        }
      });
    } catch (error) {
      console.error('❌ Error notifying issue status changed:', error);
    }
  }

  /**
   * Send new comment notification
   */
  static async notifyNewComment(issueId, issueTitle, commentAuthor, commentPreview, userId) {
    try {
      await sendNotification(userId, {
        type: 'new_comment',
        title: 'New Comment on Issue',
        message: `${commentAuthor} commented: "${commentPreview}"`,
        data: {
          issueId,
          commentAuthor,
          commentPreview,
          timestamp: new Date().toISOString()
        }
      });
    } catch (error) {
      console.error('❌ Error notifying new comment:', error);
    }
  }

  /**
   * Send volunteer match notification
   */
  static async notifyVolunteerMatch(issueId, issueTitle, matchDetails, userId) {
    try {
      await sendNotification(userId, {
        type: 'volunteer_match',
        title: 'Volunteer Opportunity Matched',
        message: `You have been matched with a volunteer opportunity: "${issueTitle}"`,
        data: {
          issueId,
          ...matchDetails,
          timestamp: new Date().toISOString()
        }
      });
    } catch (error) {
      console.error('❌ Error notifying volunteer match:', error);
    }
  }

  /**
   * Send urgent alert for critical issues in a location
   */
  static async notifyUrgentAlert(area, issueTitle, issueId, priority) {
    try {
      const result = await sendUrgentAlert(
        area,
        `🚨 URGENT: ${issueTitle}`,
        issueId
      );
      console.log(`✅ Urgent alert sent: ${result.sentTo} users notified`);
      return result;
    } catch (error) {
      console.error('❌ Error sending urgent alert:', error);
    }
  }

  /**
   * Send AI insight notification
   */
  static async notifyAIInsight(userId, insightType, insightData) {
    try {
      await sendNotification(userId, {
        type: 'ai_insight',
        title: 'AI Insight Available',
        message: `New ${insightType} insight available for your area`,
        data: {
          insightType,
          ...insightData,
          timestamp: new Date().toISOString()
        }
      });
    } catch (error) {
      console.error('❌ Error notifying AI insight:', error);
    }
  }

  /**
   * Bulk notify multiple users (for staff/advocates)
   */
  static async notifyMultipleUsers(userIds, notificationType, title, message, data) {
    try {
      const promises = userIds.map(userId =>
        sendNotification(userId, {
          type: notificationType,
          title,
          message,
          data: {
            ...data,
            timestamp: new Date().toISOString()
          }
        })
      );

      await Promise.all(promises);
      console.log(`✅ Bulk notification sent to ${userIds.length} users`);
      return { success: true, sentCount: userIds.length };
    } catch (error) {
      console.error('❌ Error sending bulk notifications:', error);
      throw error;
    }
  }
}

export default AlertService;
