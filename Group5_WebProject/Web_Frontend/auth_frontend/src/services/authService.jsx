import axios from 'axios';
import { gql } from '@apollo/client';
import { apolloClient } from './apiClient';

const AUTH_API_URL = 'http://localhost:4001/graphql';

// GraphQL Queries and Mutations
const LOGIN_MUTATION = gql`
  mutation Login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      token
      user {
        id
        username
        email
        role
        createdAt
      }
    }
  }
`;

const LOGIN_WITH_EMAIL_MUTATION = gql`
  mutation LoginWithEmail($email: String!, $password: String!) {
    loginWithEmail(email: $email, password: $password) {
      token
      user {
        id
        username
        email
        role
        createdAt
      }
    }
  }
`;

const REGISTER_MUTATION = gql`
  mutation Register($username: String!, $email: String!, $password: String!, $role: String) {
    register(username: $username, email: $email, password: $password, role: $role) {
      token
      user {
        id
        username
        email
        role
        createdAt
      }
    }
  }
`;

const GET_ME_QUERY = gql`
  query GetMe {
    me {
      id
      username
      email
      role
      createdAt
    }
  }
`;

const GET_USERS_QUERY = gql`
  query GetUsers($role: String) {
    getUsers(role: $role) {
      id
      username
      email
      role
      createdAt
    }
  }
`;

const UPDATE_USER_ROLE_MUTATION = gql`
  mutation UpdateUserRole($id: ID!, $role: String!) {
    updateUserRole(id: $id, role: $role) {
      id
      username
      email
      role
    }
  }
`;

export const authService = {
  // Login with username
  async login(username, password) {
    try {
      console.log('Attempting login with:', username);
      
      const response = await apolloClient.mutate({
        mutation: LOGIN_MUTATION,
        variables: { username, password }
      });
      
      console.log('Login response:', response);
      
      if (response.errors) {
        throw new Error(response.errors[0].message);
      }
      
      return response.data.login;
    } catch (error) {
      console.error('Login API error:', error.message);
      throw error;
    }
  },


  // Login with email
  async loginWithEmail(email, password) {
    try {
      const response = await apolloClient.mutate({
        mutation: LOGIN_WITH_EMAIL_MUTATION,
        variables: { email, password }
      });
      
      if (response.errors) {
        throw new Error(response.errors[0].message);
      }
      
      return response.data.loginWithEmail;
    } catch (error) {
      console.error('Login with email error:', error.message);
      throw error;
    }
  },

  // Register new user
  async register(userData) {
    try {
      console.log('Attempting registration:', userData);
      
      const response = await apolloClient.mutate({
        mutation: REGISTER_MUTATION,
        variables: userData
      });
      
      console.log('Register response:', response);
      
      if (response.errors) {
        throw new Error(response.errors[0].message);
      }
      
      return response.data.register;
    } catch (error) {
      console.error('Register API error:', error.message);
      throw error;
    }
  },

  // Get current user
  async getCurrentUser() {
    try {
      const response = await apolloClient.query({
        query: GET_ME_QUERY,
        fetchPolicy: 'network-only'
      });
      
      return response.data.me;
    } catch (error) {
      console.error('Error fetching current user:', error);
      return null;
    }
  },

  // Get all users (admin only)
  async getUsers(role = null) {
    try {
      const response = await apolloClient.query({
        query: GET_USERS_QUERY,
        variables: { role },
        fetchPolicy: 'network-only'
      });
      
      return response.data.getUsers;
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  },

  // Update user role (admin only)
  async updateUserRole(userId, role) {
    try {
      const response = await apolloClient.mutate({
        mutation: UPDATE_USER_ROLE_MUTATION,
        variables: { id: userId, role }
      });
      
      return response.data.updateUserRole;
    } catch (error) {
      console.error('Error updating user role:', error);
      throw error;
    }
  },

  // Logout (client-side)
  logout() {
    localStorage.removeItem('token');
  },

  // Check if token is valid
  isTokenValid() {
    const token = localStorage.getItem('token');
    if (!token) return false;
    
    try {
      // You could add more validation here
      return true;
    } catch (error) {
      return false;
    }
  }
};