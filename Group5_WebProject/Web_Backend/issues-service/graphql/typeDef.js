import gql from 'graphql-tag';

const typeDef = gql`
    scalar Date
    scalar JSON
    
    type Location {
        address: String!
        coordinates: [Float!]!
        ward: String
        neighborhood: String
    }
    
    type Photo {
        url: String!
        publicId: String
        uploadedAt: Date
    }
    
    type AIMetadata {
        sentiment: Float
        keywords: [String]
        urgencyScore: Float
        confidence: Float
    }
    
    type UserInfo {
        userId: String!
        username: String!
        email: String
        role: String
    }
    
    type Comment {
        userId: String!
        username: String!
        text: String!
        createdAt: Date!
    }
    
    type Resolution {
        notes: String
        resolvedAt: Date
        resolvedBy: UserInfo
        beforePhotos: [String]
        afterPhotos: [String]
    }
    
    type Issue {
        id: ID!
        title: String!
        description: String!
        category: String!
        aiCategory: String
        priority: String!
        status: String!
        location: Location!
        photos: [Photo]
        reporterId: String!
        reporter: UserInfo!
        assignedTo: UserInfo
        aiMetadata: AIMetadata
        votes: VoteCount!
        comments: [Comment]
        resolution: Resolution
        estimatedResolutionTime: Date
        createdAt: Date!
        updatedAt: Date!
        daysOpen: Int
    }
    
    type VoteCount {
        upvotes: Int!
        downvotes: Int!
    }
    
    type Notification {
        id: ID!
        userId: String!
        title: String!
        message: String!
        type: String!
        issueId: String
        data: JSON
        isRead: Boolean!
        priority: String!
        createdAt: Date!
        readAt: Date
    }
    
    type IssueStats {
        total: Int!
        open: Int!
        resolved: Int!
        byCategory: JSON!
        byStatus: JSON!
        byPriority: JSON!
    }
    
    type HeatmapPoint {
        coordinates: [Float!]!
        address: String!
        count: Int!
        intensity: Float!
    }
    
    type Query {
        # Issue queries
        getIssue(id: ID!): Issue
        getIssues(
            status: String
            category: String
            priority: String
            reporterId: String
            assignedTo: String
            page: Int
            limit: Int
            near: String
            radius: Float
        ): [Issue!]!
        getMyIssues: [Issue!]!
        getAssignedIssues: [Issue!]!
        searchIssues(query: String!): [Issue!]!
        
        # Dashboard queries (Issue Management Dashboard - 10 marks)
        getIssueStats: IssueStats!
        getHeatmapData(days: Int): [HeatmapPoint!]!
        getRecentActivity(limit: Int): [Issue!]!
        
        # Notification queries
        getNotifications(unreadOnly: Boolean): [Notification!]!
        getNotificationCount: Int!
    }
    
    type Mutation {
        # Issue mutations
        createIssue(
            title: String!
            description: String!
            category: String
            location: LocationInput!
            photos: [String]
        ): Issue!
        
        updateIssue(
            id: ID!
            title: String
            description: String
            category: String
            priority: String
        ): Issue!
        
        updateIssueStatus(id: ID!, status: String!): Issue!
        assignIssue(issueId: ID!, userId: String!): Issue!
        addComment(issueId: ID!, text: String!): Issue!
        voteIssue(issueId: ID!, vote: String!): Issue!
        
        # Notification mutations
        markNotificationRead(id: ID!): Notification!
        markAllNotificationsRead: Boolean!
        deleteNotification(id: ID!): Boolean!
        
        # Admin mutations
        bulkUpdateIssues(ids: [ID!]!, status: String!): [Issue!]!
        generateReport(startDate: Date, endDate: Date): String!
    }
    
    input LocationInput {
        address: String!
        coordinates: [Float!]!
        ward: String
        neighborhood: String
    }
    
    input PhotoInput {
        url: String!
        publicId: String
    }
    
    type Subscription {
        issueUpdated(issueId: ID!): Issue!
        newIssueNearby(coordinates: [Float!]!, radius: Float): Issue!
        notificationReceived(userId: String!): Notification!
    }
`;

export default typeDef;