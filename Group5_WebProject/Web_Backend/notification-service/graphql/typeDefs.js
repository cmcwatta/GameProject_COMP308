import gql from 'graphql-tag';

export const typeDefs = gql`
  extend schema
    @link(url: "https://specs.apollo.dev/federation/v2.0", import: ["@key"])

  type Notification @key(fields: "id") {
    id: ID!
    userId: String!
    type: NotificationType!
    title: String!
    message: String!
    data: NotificationData
    read: Boolean!
    createdAt: String!
  }

  type NotificationData {
    issueId: String
    commentId: String
    volunteerId: String
    area: String
    timestamp: String
    customData: String
  }

  enum NotificationType {
    issue_update
    new_comment
    urgent_alert
    status_change
    volunteer_match
    ai_insight
    test
  }

  type NotificationConnection {
    notifications: [Notification!]!
    total: Int!
    hasMore: Boolean!
  }

  type NotificationCountResult {
    unreadCount: Int!
  }

  type MarkAsReadResult {
    success: Boolean!
    modifiedCount: Int!
  }

  type Query {
    getNotifications(userId: String!, limit: Int, offset: Int): NotificationConnection!
    getNotification(id: ID!): Notification
    getUnreadCount(userId: String!): NotificationCountResult!
  }

  type Mutation {
    createNotification(userId: String!, type: NotificationType!, title: String!, message: String!, data: String): Notification!
    markAsRead(id: ID!, userId: String!): Notification
    markAllAsRead(userId: String!): MarkAsReadResult!
    deleteNotification(id: ID!, userId: String!): Boolean!
  }

  type Subscription {
    notificationReceived(userId: String!): Notification!
    urgentAlertReceived: Notification!
  }
`;
