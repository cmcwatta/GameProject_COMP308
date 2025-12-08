import gql from 'graphql-tag';

const typeDef = gql`
    scalar Date
    
    type Location {
        address: String!
        city: String!
        state: String
        postalCode: String
        latitude: Float
        longitude: Float
    }
    
    type Preferences {
        notificationFrequency: String!
        categories: [String!]!
        alertRadius: Int!
    }
    
    type OAuthProvider {
        provider: String!
        externalId: String!
        email: String!
    }
    
    type User {
        id: ID!
        email: String!
        name: String!
        phone: String
        role: String!
        location: Location
        preferences: Preferences
        emailVerified: Boolean!
        status: String!
        oauthProviders: [OAuthProvider!]
        department: String
        staffId: String
        volunteerSkills: [String!]
        hoursContributed: Int
        createdAt: Date!
        updatedAt: Date!
    }
    
    type AuthPayload {
        token: String!
        user: User!
    }
    
    type Query {
        getUser(id: ID!): User
        getCurrentUser: User
        getUserByEmail(email: String!): User
        getUsers(role: String, status: String): [User!]!
    }
    
    type Mutation {
        register(email: String!, name: String!, password: String!, phone: String, role: String): AuthPayload!
        login(email: String!, password: String!): AuthPayload!
        logout: Boolean!
        updateProfile(name: String, phone: String, location: LocationInput, preferences: PreferencesInput): User!
        loginWithGoogle(token: String!): AuthPayload!
        loginWithGitHub(code: String!): AuthPayload!
        updateUserStatus(userId: ID!, status: String!): User!
        addStaffRole(userId: ID!, department: String!, staffId: String!): User!
        addVolunteerInfo(userId: ID!, skills: [String!]!, hoursContributed: Int): User!
    }
    
    input LocationInput {
        address: String
        city: String
        state: String
        postalCode: String
        latitude: Float
        longitude: Float
    }
    
    input PreferencesInput {
        notificationFrequency: String
        categories: [String!]
        alertRadius: Int
    }
`;
export default typeDef;
export { typeDef };
