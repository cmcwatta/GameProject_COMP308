import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client'
import { setContext } from '@apollo/client/link/context'

const API_URL = import.meta.env.VITE_AUTH_URL || 'http://localhost:4000/auth'

// HTTP link
const httpLink = createHttpLink({
  uri: `${API_URL}/graphql`,
  credentials: 'include'
})

// Auth middleware
const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('token')
  
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    }
  }
})

// Create Apollo Client
export const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'network-only',
    },
    query: {
      fetchPolicy: 'network-only',
    },
  },
})
