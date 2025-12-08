/*id: ID!
    username: String!
    email: String!
    role: String!
    createdAt: Date! */
import gql from 'graphql-tag';

const typeDef = gql`
    scalar Date
    type User {
        id: ID!
        username: String!
        email: String!
        role: String!
        createdAt: Date!
    }
    type AuthPayload {
    token: String!
    user: User!
  }
    type Query {
        getUser(id: ID!): User
        getUsers: [User!]!
    }
    type Mutation {
        register(username: String!, email: String!, password: String!): AuthPayload!
        login(username: String!, password: String!): AuthPayload!
        signin(email: String!, password: String!): AuthPayload
        signup(username: String!, email: String!, password: String!, role: String): AuthPayload
    }

`;
export default typeDef;
export { typeDef };
