import { ApolloClient, InMemoryCache, createHttpLink, from } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';
import toast from 'react-hot-toast';

const httpLink = createHttpLink({
  uri: 'http://localhost:4001/graphql',
  credentials: 'include'
});

// Auth link to add token to headers
const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('token');
  
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    }
  };
});

// Error handling link

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, locations, path }) => {
      console.log('[GraphQL error]:', { message, path });
      
      // DON'T show toast for login errors - LoginForm handles it
      if (!message.includes('Invalid credentials') && 
          !message.includes('User already exists')) {
        // Only show toast for other errors
        if (message.includes('Not authenticated')) {
          localStorage.removeItem('token');
        }
      }
    });
  }
  
  if (networkError) {
    console.log('[Network error]:', networkError.message);
  }
});
export const apolloClient = new ApolloClient({
  link: from([errorLink, authLink, httpLink]),
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'network-and-cache',
      errorPolicy: 'all',
    },
    query: {
      fetchPolicy: 'network-and-cache',
      errorPolicy: 'all',
    },
    mutate: {
      errorPolicy: 'all',
    },
  },
});