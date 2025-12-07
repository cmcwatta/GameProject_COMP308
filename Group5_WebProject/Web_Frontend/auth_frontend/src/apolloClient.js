import { ApolloClient, InMemoryCache } from '@apollo/client';

const client = new ApolloClient({
  uri: '/api/graphql', // Vite proxy will forward to backend
  cache: new InMemoryCache(),
});

export default client;
