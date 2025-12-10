import React from 'react';
import { ApolloClient, InMemoryCache, HttpLink, ApolloProvider } from '@apollo/client';
import ChatInterface from './components/ChatInterface';
import './App.css';

const apolloClient = new ApolloClient({
  link: new HttpLink({
    uri: 'http://localhost:4000/graphql',
    credentials: 'include',
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
    },
  }),
  cache: new InMemoryCache(),
});

export default function App() {
  return (
    <ApolloProvider client={apolloClient}>
      <div className="app-container">
        <header className="app-header">
          <h1>🏘️ Community Assistant</h1>
          <p>Powered by AI</p>
        </header>
        <main className="app-main">
          <ChatInterface />
        </main>
        <footer className="app-footer">
          <p>© 2024 AI-Powered Local Issue Tracker. All rights reserved.</p>
        </footer>
      </div>
    </ApolloProvider>
  );
}
