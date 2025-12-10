/*id: ID!
    username: String!
    email: String!
    role: String!
    createdAt: Date! */
import gql from 'graphql-tag';

const typeDef = gql`
    scalar Date

    type User @key(fields: "id") {
        id: ID!
        email: String!
        name: String
        role: String!
        permissions: [String!]!
        avatar: String
        createdAt: Date!
        updatedAt: Date!
        lastLogin: Date
        isActive: Boolean!
    }

    type AuthPayload {
        token: String!
        user: User!
    }

    type Query {
        getUser(id: ID!): User
        getCurrentUser: User
        listUsers(skip: Int, limit: Int): [User!]!
        verifyToken(token: String!): Boolean!
    }

    type Mutation {
        register(email: String!, password: String!, name: String!): AuthPayload!
        login(email: String!, password: String!): AuthPayload!
        loginWithOAuth(provider: String!, token: String!): AuthPayload!
        updateProfile(id: ID!, name: String, email: String, avatar: String): User
        assignRole(userId: ID!, role: String!): User
        logout: Boolean!
    }
`;
export default typeDef;
//export { typeDef };
