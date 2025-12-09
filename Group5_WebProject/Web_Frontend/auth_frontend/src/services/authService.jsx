import { gql } from '@apollo/client'
import { client } from '../apollo/client.js'

// GraphQL Queries & Mutations
const LOGIN_MUTATION = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        id
        username
        email
        role
      }
    }
  }
`

const REGISTER_MUTATION = gql`
  mutation Register($username: String!, $email: String!, $password: String!) {
    register(username: $username, email: $email, password: $password) {
      token
      user {
        id
        username
        email
        role
      }
    }
  }
`

const GET_CURRENT_USER = gql`
  query GetCurrentUser {
    getCurrentUser {
      id
      username
      email
      role
      createdAt
    }
  }
`

const UPDATE_PROFILE = gql`
  mutation UpdateProfile($username: String, $email: String) {
    updateProfile(username: $username, email: $email) {
      id
      username
      email
      role
    }
  }
`

const LOGOUT_MUTATION = gql`
  mutation Logout {
    logout
  }
`

// Auth service functions
export class AuthService {
  static async login(email, password) {
    try {
      const { data } = await client.mutate({
        mutation: LOGIN_MUTATION,
        variables: { email, password }
      })
      
      if (data.login.token) {
        localStorage.setItem('token', data.login.token)
        localStorage.setItem('user', JSON.stringify(data.login.user))
      }
      
      return data
    } catch (error) {
      throw new Error(error.message)
    }
  }

  static async register(username, email, password) {
    try {
      const { data } = await client.mutate({
        mutation: REGISTER_MUTATION,
        variables: { username, email, password }
      })
      
      if (data.register.token) {
        localStorage.setItem('token', data.register.token)
        localStorage.setItem('user', JSON.stringify(data.register.user))
      }
      
      return data
    } catch (error) {
      throw new Error(error.message)
    }
  }

  static async getCurrentUser() {
    try {
      const { data } = await client.query({
        query: GET_CURRENT_USER,
        fetchPolicy: 'network-only'
      })
      return data
    } catch (error) {
      throw new Error(error.message)
    }
  }

  static async updateProfile(username, email) {
    try {
      const { data } = await client.mutate({
        mutation: UPDATE_PROFILE,
        variables: { username, email }
      })
      
      // Update stored user
      if (data.updateProfile) {
        const currentUser = JSON.parse(localStorage.getItem('user') || '{}')
        const updatedUser = { ...currentUser, ...data.updateProfile }
        localStorage.setItem('user', JSON.stringify(updatedUser))
      }
      
      return data
    } catch (error) {
      throw new Error(error.message)
    }
  }

  static async logout() {
    try {
      await client.mutate({
        mutation: LOGOUT_MUTATION
      })
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      this.removeToken()
    }
  }

  static getToken() {
    return localStorage.getItem('token')
  }

  static setToken(token) {
    localStorage.setItem('token', token)
  }

  static removeToken() {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }

  static isAuthenticated() {
    const token = this.getToken()
    if (!token) return false
    
    try {
      const payload = JSON.parse(atob(token.split('.')[1]))
      return payload.exp * 1000 > Date.now()
    } catch {
      return false
    }
  }

  static getUser() {
    const userStr = localStorage.getItem('user')
    return userStr ? JSON.parse(userStr) : null
  }

  static getUserRole() {
    const user = this.getUser()
    return user?.role || null
  }
}

// Export mutations for direct use
export { 
  LOGIN_MUTATION, 
  REGISTER_MUTATION, 
  GET_CURRENT_USER, 
  UPDATE_PROFILE, 
  LOGOUT_MUTATION 
}