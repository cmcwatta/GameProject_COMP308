/*Resident mutations, Staff mutations, Advocate mutations roles With support for: Issue reporting, AI categorization, Staff assignment, Status updates, Comments, Upvotes, Volunteer coordination */
import gql from 'graphql-tag';
const typeDefs = gql`
  type Geotag {
    lat: Float
    lng: Float
  }
    type Issue {
        id: ID!
        title: String!
        description: String!
        photoUrl: String
        geotag: Geotag
        category: String
        status: String!
        createdBy: ID!
        createdAt: Date!
        updatedAt: Date!
    }

    type Comment {
        id: ID!
        issueId: ID!
        userId: ID!
        content: String!
        createdAt: Date!
    }
    type Volunteer {
        id: ID!
        issueId: ID!
        userId: ID!
        createdAt: Date!
    }

    type Query {
        getIssue(id: ID!): Issue
        getIssues: [Issue!]!
        getComments(issueId: ID!): [Comment!]!
        getVolunteers(issueId: ID!): [Volunteer!]!
    }
    type Mutation {
        reportIssue(
            title: String!
            description: String!
            photoUrl: String
            geotag: GeotagInput
        ): Issue!
        updateIssueStatus(issueId: ID!, status: String!): Issue!
        addComment(issueId: ID!, content: String!): Comment!
        upvoteIssue(issueId: ID!): Issue!
        volunteerForIssue(issueId: ID!): Volunteer!
    }
    input GeotagInput {
        lat: Float
        lng: Float
    }
    scalar Date
`;
export default typeDefs;
export { typeDefs };