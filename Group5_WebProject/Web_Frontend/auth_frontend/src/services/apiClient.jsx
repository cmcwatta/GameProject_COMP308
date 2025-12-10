import { ApolloClient, InMemoryCache, createHttpLink, from, ApolloLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';
import toast from 'react-hot-toast';

// Create HTTP links for different services
const authServiceLink = createHttpLink({
  uri: 'http://localhost:4001/graphql',
  credentials: 'include'
});

const issueServiceLink = createHttpLink({
  uri: 'http://localhost:4003/graphql',
  credentials: 'include'
});

const engagementServiceLink = createHttpLink({
  uri: 'http://localhost:4004/graphql',
  credentials: 'include'
});

// Router link to direct operations to the correct service
const routerLink = new ApolloLink((operation, forward) => {
  const operationName = operation.operationName;
  const definitions = operation.query.definitions;
  
  // Check if operation is a mutation or query/subscription and route accordingly
  let selectedLink;
  
  // Check operation definitions to determine type
  const isMutation = definitions.some(
    def => def.operation === 'mutation'
  );
  
  const isIssueRelated = operationName?.toLowerCase().includes('issue');
  const isEngagementRelated = operationName?.toLowerCase().includes('comment') || operationName?.toLowerCase().includes('upvote') || operationName?.toLowerCase().includes('volunteer');
  
  // Route based on operation name and type
  if (isIssueRelated) {
    selectedLink = issueServiceLink;
  } else if (isEngagementRelated) {
    selectedLink = engagementServiceLink;
  } else {
    // Default goes to auth service
    selectedLink = authServiceLink;
  }
  
  return selectedLink.request(operation, forward);
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
  link: from([errorLink, authLink, routerLink]),
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