/**
 * NOTIFICATION SERVICE INTEGRATION EXAMPLES
 * 
 * This file demonstrates how to integrate the Notification Service
 * with other microservices in the platform.
 */

// ============================================
// ISSUE SERVICE INTEGRATION
// ============================================

// File: issue-service/graphql/resolvers.js

import { AlertService } from '../../notification-service/services/alertService.js';

export const issueResolvers = {
  Mutation: {
    async createIssue(_, { input }, context) {
      try {
        // Create issue in database
        const issue = new Issue(input);
        await issue.save();

        // NOTIFY: Send issue created notification to staff
        const staffUsers = await User.find({ role: 'staff' });
        for (const staff of staffUsers) {
          await AlertService.notifyIssueCreated(
            issue._id,
            issue.title,
            issue.submitterName,
            staff._id
          );
        }

        // NOTIFY: Send urgent alert if critical
        if (issue.priority === 'critical') {
          await AlertService.notifyUrgentAlert(
            issue.location.address,
            issue.title,
            issue._id,
            issue.priority
          );
        }

        return issue;
      } catch (error) {
        console.error('Error creating issue:', error);
        throw error;
      }
    },

    async updateStatus(_, { id, status }, context) {
      try {
        const issue = await Issue.findById(id);
        const oldStatus = issue.status;
        issue.status = status;
        await issue.save();

        // NOTIFY: Send status change notification to interested parties
        await AlertService.notifyIssueStatusChanged(
          issue._id,
          issue.title,
          oldStatus,
          status,
          issue.submitterId
        );

        // Also notify assigned staff member
        if (issue.assignedTo) {
          await AlertService.notifyIssueStatusChanged(
            issue._id,
            issue.title,
            oldStatus,
            status,
            issue.assignedTo
          );
        }

        return issue;
      } catch (error) {
        console.error('Error updating issue status:', error);
        throw error;
      }
    }
  }
};

// ============================================
// ENGAGEMENT SERVICE INTEGRATION
// ============================================

// File: engagement-service/graphql/resolvers.js

import { AlertService } from '../../notification-service/services/alertService.js';

export const engagementResolvers = {
  Mutation: {
    async createComment(_, { issueId, input }, context) {
      try {
        // Create comment in database
        const comment = new Comment({
          issueId,
          ...input
        });
        await comment.save();

        // Get issue details for notification
        const issue = await Issue.findById(issueId);

        // NOTIFY: Send new comment notification to issue creator
        await AlertService.notifyNewComment(
          issueId,
          issue.title,
          input.authorName,
          input.text.substring(0, 100), // Preview first 100 chars
          issue.submitterId
        );

        // NOTIFY: Send to watchers of the issue
        const watchers = await NotificationPreference.find({
          watchedIssues: issueId
        });

        for (const watcher of watchers) {
          await AlertService.notifyNewComment(
            issueId,
            issue.title,
            input.authorName,
            input.text.substring(0, 100),
            watcher.userId
          );
        }

        return comment;
      } catch (error) {
        console.error('Error creating comment:', error);
        throw error;
      }
    },

    async addVolunteer(_, { issueId, userId }, context) {
      try {
        // Add volunteer to issue
        const issue = await Issue.findByIdAndUpdate(
          issueId,
          { $push: { volunteers: userId } },
          { new: true }
        );

        // NOTIFY: Send volunteer match notification
        const volunteer = await User.findById(userId);
        await AlertService.notifyVolunteerMatch(
          issueId,
          issue.title,
          {
            volunteerName: volunteer.name,
            location: issue.location.address,
            category: issue.category
          },
          userId
        );

        // NOTIFY: Inform issue creator about new volunteer
        await AlertService.notifyIssueStatusChanged(
          issueId,
          issue.title,
          'open',
          'has_volunteer',
          issue.submitterId
        );

        return issue;
      } catch (error) {
        console.error('Error adding volunteer:', error);
        throw error;
      }
    }
  }
};

// ============================================
// AI SERVICE INTEGRATION
// ============================================

// File: ai-service/services/chatbotService.js

import { AlertService } from '../../notification-service/services/alertService.js';

export class ChatbotService {
  static async generateInsights(userId, area, timeRange) {
    try {
      // Generate insights using LangGraph + Gemini
      const insights = await this.analyzeIssues(area, timeRange);

      // NOTIFY: Send AI insight notification if significant findings
      if (insights.trendsDetected.length > 0) {
        await AlertService.notifyAIInsight(userId, 'trend', {
          trends: insights.trendsDetected,
          area: area,
          confidence: insights.confidence,
          recommendations: insights.recommendations
        });
      }

      return insights;
    } catch (error) {
      console.error('Error generating insights:', error);
      throw error;
    }
  }

  static async classifyIssue(issueId) {
    try {
      // Classify issue using AI
      const classification = await this.performClassification(issueId);

      // NOTIFY: Staff about new classification
      const staffUsers = await User.find({ role: 'staff' });
      
      if (classification.requiresUrgentAction) {
        const issue = await Issue.findById(issueId);
        for (const staff of staffUsers) {
          await AlertService.notifyAIInsight(staff._id, 'classification', {
            issueId,
            classification: classification.category,
            priority: classification.suggestedPriority,
            confidence: classification.confidence
          });
        }
      }

      return classification;
    } catch (error) {
      console.error('Error classifying issue:', error);
      throw error;
    }
  }
}

// ============================================
// BULK NOTIFICATION EXAMPLE
// ============================================

// File: staff-dashboard/resolvers.js

import { AlertService } from '../../notification-service/services/alertService.js';

export const dashboardResolvers = {
  Mutation: {
    async broadcastCommunityAlert(_, { message, affectedArea }) {
      try {
        // Get all users in affected area
        const users = await User.find({
          'location.coordinates': {
            $near: {
              $geometry: {
                type: 'Point',
                coordinates: affectedArea.coordinates
              },
              $maxDistance: affectedArea.radius * 1000 // Convert km to meters
            }
          }
        });

        const userIds = users.map(u => u._id);

        // NOTIFY: Send bulk notification
        const result = await AlertService.notifyMultipleUsers(
          userIds,
          'urgent_alert',
          'Community Alert',
          message,
          {
            area: affectedArea.name,
            type: 'staff_broadcast'
          }
        );

        return {
          success: true,
          notificationsSent: result.sentCount
        };
      } catch (error) {
        console.error('Error broadcasting alert:', error);
        throw error;
      }
    }
  }
};

// ============================================
// USER PREFERENCES MANAGEMENT
// ============================================

// File: auth-service/graphql/resolvers.js

import NotificationPreference from '../../notification-service/models/NotificationPreference.js';

export const authResolvers = {
  Mutation: {
    async registerUser(_, { input }) {
      try {
        // Register user
        const user = new User(input);
        await user.save();

        // INITIALIZE: Create notification preferences
        const preferences = new NotificationPreference({
          userId: user._id,
          emailNotifications: {
            enabled: true,
            issueUpdates: true,
            urgentAlerts: true,
            digestFrequency: 'weekly'
          },
          inAppNotifications: {
            enabled: true,
            issueUpdates: true,
            urgentAlerts: true
          },
          preferredCategories: ['pothole', 'streetlight', 'drainage'],
          notificationRadius: 5 // km
        });
        await preferences.save();

        // NOTIFY: Send welcome email
        import { EmailService } from '../../notification-service/services/emailService.js';
        await EmailService.sendWelcomeEmail(user.email, user.name, user.role);

        return user;
      } catch (error) {
        console.error('Error registering user:', error);
        throw error;
      }
    }
  }
};

// ============================================
// TESTING NOTIFICATIONS
// ============================================

// Example: Send test notification from any service

import { sendNotification } from '../notification-service/index.js';

async function testNotification() {
  try {
    const notification = await sendNotification('test-user-123', {
      type: 'test',
      title: 'Test Notification',
      message: 'This is a test notification from the system',
      data: {
        test: true,
        timestamp: new Date().toISOString()
      }
    });

    console.log('✅ Test notification sent:', notification);
  } catch (error) {
    console.error('❌ Error sending test notification:', error);
  }
}

// ============================================
// WEBHOOK/EVENT LISTENER EXAMPLE
// ============================================

// File: notification-service/webhooks/issueWebhook.js

export async function handleIssueEvent(event) {
  const { type, data } = event;

  switch (type) {
    case 'issue.created':
      await AlertService.notifyIssueCreated(
        data.issueId,
        data.title,
        data.submitterName,
        data.staffId
      );
      break;

    case 'issue.status_changed':
      await AlertService.notifyIssueStatusChanged(
        data.issueId,
        data.title,
        data.oldStatus,
        data.newStatus,
        data.userId
      );
      break;

    case 'issue.urgent':
      await AlertService.notifyUrgentAlert(
        data.area,
        data.title,
        data.issueId,
        data.priority
      );
      break;

    default:
      console.log('Unknown event type:', type);
  }
}

export default handleIssueEvent;

// ============================================
// MIGRATION: Adding notifications to existing code
// ============================================

// BEFORE: Issue created without notification
/*
async function createIssue(input) {
  const issue = new Issue(input);
  await issue.save();
  return issue;
}
*/

// AFTER: Issue created with notification
async function createIssue(input) {
  const issue = new Issue(input);
  await issue.save();

  // Add this notification trigger
  await AlertService.notifyIssueCreated(
    issue._id,
    issue.title,
    issue.submitterName,
    issue.assignedTo
  );

  return issue;
}

// ============================================
// SETUP CHECKLIST
// ============================================

/**
 * To integrate notifications with your service:
 * 
 * ✓ Import AlertService from notification-service
 * ✓ Call appropriate AlertService methods in your resolvers/functions
 * ✓ Pass correct parameters (userId, title, message, data)
 * ✓ Handle errors gracefully (notifications shouldn't break main flow)
 * ✓ Test with /test-notification endpoint
 * ✓ Configure email service for email delivery
 * ✓ Set up user preferences for customization
 * 
 * Example:
 * import { AlertService } from '../notification-service/services/alertService.js';
 * await AlertService.notifyIssueCreated(issueId, title, author, userId);
 */
