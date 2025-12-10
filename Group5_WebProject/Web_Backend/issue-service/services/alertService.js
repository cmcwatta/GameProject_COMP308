/**
 * Alert Service for Issue Service
 * Sends notifications to the Notification Service
 */

const NOTIFICATION_SERVICE_URL = process.env.NOTIFICATION_SERVICE_URL || 'http://localhost:4005/graphql';

export class AlertService {
  /**
   * Notify about new issue creation
   */
  static async notifyIssueCreated(issueData) {
    try {
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
          userId: issueData.submitterId,
          type: 'issue_update',
          title: `New Issue: ${issueData.title}`,
          message: `Your issue "${issueData.title}" has been created successfully.`,
          data: {
            issueId: issueData.issueId,
            category: issueData.category,
            priority: issueData.priority,
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
        console.error('GraphQL error in notifyIssueCreated:', data.errors);
      }
      return data.data?.createNotification;
    } catch (error) {
      console.error('Error sending issue creation notification:', error);
      throw error;
    }
  }

  /**
   * Notify about issue status change
   */
  static async notifyIssueStatusChanged(issueData) {
    try {
      const statusMessages = {
        assigned: 'has been assigned to a volunteer',
        in_progress: 'is now being worked on',
        resolved: 'has been resolved',
        closed: 'has been closed',
        reopened: 'has been reopened',
      };

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
          userId: issueData.submitterId,
          type: 'status_change',
          title: `Issue Status Update: ${issueData.title}`,
          message: `Your issue "${issueData.title}" ${statusMessages[issueData.newStatus] || 'status has been updated'}.`,
          data: {
            issueId: issueData.issueId,
            newStatus: issueData.newStatus,
            previousStatus: issueData.previousStatus,
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
        console.error('GraphQL error in notifyIssueStatusChanged:', data.errors);
      }
      return data.data?.createNotification;
    } catch (error) {
      console.error('Error sending status change notification:', error);
      throw error;
    }
  }
}
