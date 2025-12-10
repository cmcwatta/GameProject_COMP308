import gql from 'graphql-tag';

const typeDefs = gql`
    scalar Date

    type DashboardMetrics {
        totalIssues: Int!
        openIssues: Int!
        resolvedIssues: Int!
        averageResolutionTime: Float!
        issuesByCategory: [CategoryCount!]!
        issuesByStatus: [StatusCount!]!
    }

    type CategoryCount {
        category: String!
        count: Int!
    }

    type StatusCount {
        status: String!
        count: Int!
    }

    type TrendAnalysis {
        emergingIssues: [EmergingIssue!]!
        hotspots: [Hotspot!]!
        sentimentTrend: [SentimentPoint!]!
    }

    type EmergingIssue {
        category: String!
        count: Int!
        trend: String!
    }

    type Hotspot {
        latitude: Float!
        longitude: Float!
        issueCount: Int!
        categories: [String!]!
    }

    type SentimentPoint {
        timestamp: Date!
        averageSentiment: Float!
    }

    type IssueSummary {
        summary: String!
        keyPoints: [String!]!
        suggestedCategory: String!
        priority: String!
        confidence: Float!
    }

    type ChatbotResponse {
        response: String!
        sources: [Source!]!
        suggestedActions: [SuggestedAction!]!
        confidence: Float!
    }

    type Source {
        issueId: ID!
        title: String!
        relevance: Float!
    }

    type SuggestedAction {
        type: String!
        description: String!
    }

    type ClassificationResult {
        suggestedCategory: String!
        confidence: Float!
        alternativeCategories: [CategoryOption!]!
        suggestedPriority: String!
        expectedResolutionTime: String!
    }

    type CategoryOption {
        category: String!
        confidence: Float!
    }

    type SentimentResult {
        overallSentiment: Float!
        score: Float!
        comments: [CommentSentiment!]!
    }

    type CommentSentiment {
        commentId: ID!
        sentiment: Float!
        score: Float!
    }

    type Query {
        getDashboardMetrics: DashboardMetrics!
        getTrendAnalysis: TrendAnalysis!
        getIssueSummary(issueId: ID!): IssueSummary
        chatbot(message: String!, userId: ID): ChatbotResponse!
        classifyIssue(description: String!, category: String): ClassificationResult!
        analyzeSentiment(issueId: ID!): SentimentResult
    }

    type Mutation {
        processChatbotMessage(
            message: String!
            userId: ID!
            context: String
        ): ChatbotResponse!
    }
`;

export default typeDefs;