import gql from 'graphql-tag';

export const typeDefs = gql`
  extend schema
    @link(url: "https://specs.apollo.dev/federation/v2.0", import: ["@key"])

  type Issue @key(fields: "id") {
    id: ID!
    title: String!
    description: String!
    location: Location!
    category: IssueCategory!
    status: IssueStatus!
    priority: Priority!
    submitterId: String!
    submitterName: String
    attachments: [Attachment!]
    upvotes: Int!
    commentCount: Int!
    volunteers: [Volunteer!]
    assignedTo: String
    assignedAt: String
    completedAt: String
    aiClassification: AIClassification
    createdAt: String!
    updatedAt: String!
  }

  type Location {
    type: String!
    coordinates: [Float!]!
    address: String
  }

  type Attachment {
    filename: String!
    fileUrl: String!
    uploadedAt: String!
  }

  type Volunteer {
    userId: String!
    name: String!
    joinedAt: String!
  }

  type AIClassification {
    category: String!
    confidence: Float!
    suggestedPriority: String!
  }

  enum IssueCategory {
    pothole
    streetlight
    debris
    drainage
    other
  }

  enum IssueStatus {
    open
    assigned
    in_progress
    resolved
    closed
  }

  enum Priority {
    low
    medium
    high
    critical
  }

  type Query {
    issue(id: ID!): Issue
    issues(
      status: IssueStatus
      category: IssueCategory
      limit: Int
      offset: Int
    ): [Issue!]!
    issuesByLocation(
      latitude: Float!
      longitude: Float!
      maxDistance: Int
    ): [Issue!]!
    issuesBySubmitter(submitterId: String!): [Issue!]!
    myIssues(submitterId: String!): [Issue!]!
  }

  type Mutation {
    createIssue(input: CreateIssueInput!): Issue!
    updateIssue(id: ID!, input: UpdateIssueInput!): Issue!
    deleteIssue(id: ID!): Boolean!
    updateStatus(id: ID!, status: IssueStatus!): Issue!
    assignIssue(id: ID!, assignedTo: String!): Issue!
    addVolunteer(id: ID!, userId: String!, name: String!): Issue!
    removeVolunteer(id: ID!, userId: String!): Issue!
    upvoteIssue(id: ID!): Issue!
  }

  input CreateIssueInput {
    title: String!
    description: String!
    latitude: Float!
    longitude: Float!
    address: String
    category: IssueCategory!
    priority: Priority
    submitterId: String!
    submitterName: String
  }

  input UpdateIssueInput {
    title: String
    description: String
    category: IssueCategory
    priority: Priority
  }
`;
