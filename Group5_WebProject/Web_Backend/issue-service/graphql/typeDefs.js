import gql from 'graphql-tag';

const typeDefs = gql`
  scalar Date
  
  type GeoPoint {
    type: String!
    coordinates: [Float!]!
  }
  
  type Location {
    address: String!
    city: String!
    state: String
    postalCode: String
    geopoint: GeoPoint!
  }
  
  type StatusHistoryEntry {
    status: String!
    changedBy: ID!
    changedAt: Date!
    reason: String
  }
  
  type Issue {
    id: ID!
    title: String!
    description: String!
    category: String!
    priority: String!
    status: String!
    location: Location!
    photoUrl: String
    reportedBy: ID!
    assignedTo: ID
    slaDeadline: Date!
    slaStatus: String!
    upvotes: Int!
    commentCount: Int!
    statusHistory: [StatusHistoryEntry!]!
    createdAt: Date!
    updatedAt: Date!
  }
  
  type Comment {
    id: ID!
    issueId: ID!
    author: ID!
    content: String!
    isStaffResponse: Boolean!
    isPinned: Boolean!
    upvotes: Int!
    createdAt: Date!
    updatedAt: Date!
  }
  
  type Notification {
    id: ID!
    userId: ID!
    issueId: ID
    type: String!
    title: String!
    message: String!
    read: Boolean!
    createdAt: Date!
  }
  
  type Query {
    getIssue(id: ID!): Issue
    getIssues(category: String, status: String, priority: String): [Issue!]!
    getIssuesByLocation(latitude: Float!, longitude: Float!, radiusKm: Float!): [Issue!]!
    getIssuesByStatus(status: String!): [Issue!]!
    getIssuesByCategory(category: String!): [Issue!]!
    getComments(issueId: ID!): [Comment!]!
    getNotifications: [Notification!]!
    getUnreadNotifications: [Notification!]!
    searchIssues(query: String!): [Issue!]!
  }
  
  type Mutation {
    createIssue(
      title: String!
      description: String!
      category: String!
      priority: String!
      address: String!
      city: String!
      state: String
      postalCode: String
      latitude: Float!
      longitude: Float!
      photoUrl: String
    ): Issue!
    
    updateIssueStatus(issueId: ID!, status: String!, reason: String): Issue!
    
    assignIssue(issueId: ID!, staffId: ID!): Issue!
    
    addComment(issueId: ID!, content: String!, isStaffResponse: Boolean): Comment!
    
    pinComment(commentId: ID!): Comment!
    
    upvoteIssue(issueId: ID!): Issue!
    
    upvoteComment(commentId: ID!): Comment!
    
    createNotification(userId: ID!, type: String!, title: String!, message: String!, issueId: ID): Notification!
    
    markNotificationAsRead(notificationId: ID!): Notification!
    
    markAllNotificationsAsRead: Boolean!
  }
  
  type Subscription {
    onIssueCreated: Issue!
    onIssueStatusChanged(issueId: ID!): Issue!
    onNewComment(issueId: ID!): Comment!
    onNotificationReceived: Notification!
  }
`;

export default typeDefs;
export { typeDefs };