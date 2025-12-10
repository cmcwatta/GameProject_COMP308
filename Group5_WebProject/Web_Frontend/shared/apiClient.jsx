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

const aiServiceLink = createHttpLink({
  uri: 'http://localhost:4002/graphql',
  credentials: 'include'
});

const notificationServiceLink = createHttpLink({
  uri: 'http://localhost:4005/graphql',
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
  
  const isIssueRelated = operationName?.includes('Issue') || operationName?.includes('GetIssue');
  const isEngagementRelated = operationName?.includes('Comment') || operationName?.includes('Upvote') || operationName?.includes('Volunteer');
  const isAIRelated = operationName?.includes('Classify') || operationName?.includes('AI');
  
  // Route based on operation name and type
  if (isMutation) {
    if (isEngagementRelated) {
      selectedLink = engagementServiceLink;
    } else if (isAIRelated) {
      selectedLink = aiServiceLink;
    } else if (isIssueRelated) {
      selectedLink = issueServiceLink;
    } else {
      // Default mutations go to auth service
      selectedLink = authServiceLink;
    }
  } else {
    // Queries
    if (isIssueRelated) {
      selectedLink = issueServiceLink;
    } else if (isEngagementRelated) {
      selectedLink = engagementServiceLink;
    } else if (isAIRelated) {
      selectedLink = aiServiceLink;
    } else {
      selectedLink = authServiceLink;
    }
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
const errorLink = onError(({ graphQLErrors, networkError, operation }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, locations, path }) => {
      console.log('[GraphQL error]:', { message, path, operation: operation.operationName });
      
      if (message.includes('Not authenticated') || message.includes('Unauthorized')) {
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
    });
  }
  
  if (networkError) {
    console.log('[Network error]:', networkError.message);
    if (networkError.statusCode === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
  }
});

// Create Apollo Client
export const apolloClient = new ApolloClient({
  link: from([errorLink, authLink, routerLink]),
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'network-and-cache',
    },
    query: {
      fetchPolicy: 'network-and-cache',
    },
  },
});

// Export service-specific clients if needed for multi-service queries
export const createServiceClient = (serviceUri) => {
  const httpLink = createHttpLink({
    uri: serviceUri,
    credentials: 'include'
  });

  return new ApolloClient({
    link: from([errorLink, authLink, httpLink]),
    cache: new InMemoryCache(),
    defaultOptions: {
      watchQuery: {
        fetchPolicy: 'network-and-cache',
      },
      query: {
        fetchPolicy: 'network-and-cache',
      },
    },
  });
};

export default apolloClient;
