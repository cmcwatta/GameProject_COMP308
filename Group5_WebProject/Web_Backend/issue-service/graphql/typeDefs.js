import gql from 'graphql-tag';

const typeDefs = gql`
    scalar Date
    scalar Upload

    type Location {
        address: String
        latitude: Float!
        longitude: Float!
        city: String
        neighborhood: String
    }

    type Attachment {
        url: String!
        fileType: String!
        uploadedAt: Date!
    }

    type AIClassification {
        category: String
        confidence: Float
        suggestedPriority: String
    }

    type Sentiment {
        score: Float
        label: String
    }

    type Issue {
        id: ID!
        title: String!
        description: String!
        category: String!
        priority: String!
        status: String!
        reportedBy: ID!
        assignedTo: [ID!]!
        location: Location
        attachments: [Attachment!]!
        tags: [String!]!
        estimatedResolution: Date
        aiClassification: AIClassification
        aiSummary: String
        sentiment: Sentiment
        upvotes: Int!
        commentCount: Int!
        resolvedAt: Date
        createdAt: Date!
        updatedAt: Date!
    }

    type Comment {
        id: ID!
        issueId: ID!
        authorId: ID!
        content: String!
        attachments: [String!]!
        sentiment: Sentiment
        helpfulVotes: Int!
        isResolved: Boolean!
        createdAt: Date!
        updatedAt: Date!
    }

    type Alert {
        id: ID!
        userId: ID!
        type: String!
        issueId: ID
        title: String!
        message: String!
        priority: String!
        isRead: Boolean!
        createdAt: Date!
    }

    input LocationInput {
        address: String
        latitude: Float!
        longitude: Float!
        city: String
        neighborhood: String
    }

    type Query {
        getIssue(id: ID!): Issue
        listIssues(
            category: String
            status: String
            priority: String
            skip: Int
            limit: Int
        ): [Issue!]!
        getIssuesNearby(
            latitude: Float!
            longitude: Float!
            radius: Float!
        ): [Issue!]!
        getIssueComments(
            issueId: ID!
            skip: Int
            limit: Int
        ): [Comment!]!
        getUserAlerts(
            userId: ID!
            unreadOnly: Boolean
        ): [Alert!]!
    }

    type Mutation {
        createIssue(
            title: String!
            description: String!
            category: String!
            latitude: Float!
            longitude: Float!
            address: String
            priority: String
            tags: [String!]
            photo: Upload
        ): Issue!
        updateIssueStatus(
            id: ID!
            status: String!
            notes: String
        ): Issue!
        assignIssueToStaff(
            id: ID!
            staffId: ID!
        ): Issue!
        addComment(
            issueId: ID!
            content: String!
            authorId: ID!
            photo: Upload
        ): Comment!
        markCommentHelpful(
            commentId: ID!
        ): Comment!
        deleteIssue(id: ID!): Boolean!
        createAlert(
            userId: ID!
            type: String!
            title: String!
            message: String!
            issueId: ID
            priority: String
        ): Alert!
        markAlertAsRead(id: ID!): Alert!
    }

    type Subscription {
        issueStatusChanged(id: ID!): Issue!
        newComment(issueId: ID!): Comment!
        issueAlert(userId: ID!): Alert!
    }
`;

export default typeDefs;
