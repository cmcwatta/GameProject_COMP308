/**
 * Alert Service for Engagement Service
 * Sends notifications to the Notification Service
 */

const NOTIFICATION_SERVICE_URL = process.env.NOTIFICATION_SERVICE_URL || 'http://localhost:4005/graphql';

export class AlertService {
  /**
   * Notify about new comment on an issue
   */
  static async notifyNewComment(commentData) {
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
          userId: commentData.authorId,
          type: 'new_comment',
          title: 'New Comment Posted',
          message: `You posted a comment on an issue: "${commentData.content.substring(0, 100)}${commentData.content.length > 100 ? '...' : ''}"`,
          data: {
            issueId: commentData.issueId,
            commentId: commentData.commentId,
            authorId: commentData.authorId,
            author: commentData.author,
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
        console.error('GraphQL error in notifyNewComment:', data.errors);
      }
      return data.data?.createNotification;
    } catch (error) {
      console.error('Error sending comment notification:', error);
      throw error;
    }
  }

  /**
   * Notify about volunteer match
   */
  static async notifyVolunteerMatch(volunteerData) {
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
          userId: volunteerData.volunteerId,
          type: 'volunteer_match',
          title: 'Volunteer Match Confirmed',
          message: `You have successfully volunteered for an issue. Thank you for your commitment to helping the community!`,
          data: {
            issueId: volunteerData.issueId,
            volunteerId: volunteerData.volunteerId,
            volunteerName: volunteerData.volunteerName,
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
        console.error('GraphQL error in notifyVolunteerMatch:', data.errors);
      }
      return data.data?.createNotification;
    } catch (error) {
      console.error('Error sending volunteer match notification:', error);
      throw error;
    }
  }
}
