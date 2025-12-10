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
        refreshToken: String
        user: User!
    }
    
    type Query {
        # Get current user
        me: User
        
        # Get user by ID
        getUser(id: ID!): User
        
        # Get all users (admin only)
        getUsers(role: String): [User!]!
        
        # Health check
        health: String!
    }
    
    type Mutation {
        # Registration
        register(
            username: String!
            email: String!
            password: String!
            role: String
        ): AuthPayload!
        
        # Login
        login(username: String!, password: String!): AuthPayload!
        loginWithEmail(email: String!, password: String!): AuthPayload!
        
        # Logout
        logout: Boolean!
        
        # Admin functions
        updateUserRole(id: ID!, role: String!): User!
        deleteUser(id: ID!): Boolean!
    }
`;

export default typeDef;
