import gql from 'graphql-tag';

const typeDefs = gql`
  scalar Date
  
  type AIAnalysis {
    category: String!
    priority: String!
    suggestedDepartment: String!
    confidence: Float!
    tags: [String!]!
    estimatedResponseTime: String!
  }
  
  type Trend {
    pattern: String!
    location: String!
    frequency: String!
    severity: String!
    recommendation: String!
  }
  
  type ChatbotResponse {
    response: String!
    suggestedActions: [String!]!
    followupQuestions: [String!]!
  }
  
  type Insights {
    summary: String!
    trends: [Trend!]!
    totalIssues: Int!
    generatedAt: Date!
  }
  
  type Query {
    # Health check
    health: String!
    
    # AI Functions
    classifyIssue(description: String!): AIAnalysis!
    chatbotQuery(query: String!, userRole: String, location: String): ChatbotResponse!
    summarizeIssues(issues: [IssueInput!]!): String!
    detectTrends(issues: [IssueInput!]!): [Trend!]!
    analyzeSentiment(text: String!): String!
    generateInsights(issues: [IssueInput!]!): Insights!
  }
  
  type Mutation {
    # Training functions
    trainModel(data: String!): Boolean!
    clearCache: Boolean!
  }
  
  input IssueInput {
    title: String!
    description: String!
    category: String
    status: String!
    createdAt: Date!
  }
`;

export default typeDefs;