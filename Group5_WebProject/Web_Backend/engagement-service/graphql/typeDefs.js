/*Resident mutations, Staff mutations, Advocate mutations roles With support for: Issue reporting, AI categorization, Staff assignment, Status updates, Comments, Upvotes, Volunteer coordination */
import gql from 'graphql-tag';
const typeDefs = gql`
  type Comment {
    id: ID!
    issueId: ID!
    authorId: ID!
    author: String
    content: String!
    createdAt: String!
  }

  type Volunteer {
    id: ID!
    issueId: ID!
    userId: ID!
    status: String
    createdAt: String!
  }

  type Query {
    getComments(issueId: ID!): [Comment!]!
    getVolunteers(issueId: ID!): [Volunteer!]!
  }

  type Mutation {
    addComment(issueId: ID!, content: String!): Comment!
    upvoteIssue(issueId: ID!): Issue!
    volunteerForIssue(issueId: ID!): Volunteer!
  }

  # Extended from issue service
  extend type Issue {
    upvotes: Int
    commentCount: Int
    volunteers: [Volunteer!]
  }

  scalar Date
`;
export default typeDefs;
export { typeDefs };