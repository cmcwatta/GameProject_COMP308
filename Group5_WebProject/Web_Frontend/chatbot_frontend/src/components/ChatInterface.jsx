import React, { useState, useRef, useEffect } from 'react';
import { useLazyQuery } from '@apollo/client';
import { CHATBOT_QUERY } from '../graphql/queries';
import ChatMessage from './ChatMessage';
import QuerySuggestions from './QuerySuggestions';
import './ChatInterface.css';

const DEFAULT_SUGGESTIONS = [
  'What accessibility issues are in my area?',
  'Show me safety concerns near downtown',
  'Which issues take longest to resolve?',
  'What categories have the most reports?',
  'How can I report a new issue?',
];

export default function ChatInterface() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      text: 'Hello! 👋 I\'m your community assistant. I can help you find information about local issues, analyze trends, and answer questions about civic improvements. What would you like to know?',
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const [chatbot] = useLazyQuery(CHATBOT_QUERY, {
    onCompleted: (data) => {
      const response = data.chatbot;
      setMessages((prev) => [
        ...prev,
        {
          id: prev.length + 1,
          type: 'bot',
          text: response.response,
          confidence: response.confidence,
          sources: response.sources,
          suggestedActions: response.suggestedActions,
          timestamp: new Date(),
        },
      ]);
      setIsLoading(false);
    },
    onError: (error) => {
      setMessages((prev) => [
        ...prev,
        {
          id: prev.length + 1,
          type: 'bot',
          text: `Sorry, I encountered an error: ${error.message}. Please try again.`,
          timestamp: new Date(),
        },
      ]);
      setIsLoading(false);
    },
  });

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (text) => {
    if (!text.trim()) return;

    // Add user message
    setMessages((prev) => [
      ...prev,
      {
        id: prev.length + 1,
        type: 'user',
        text: text.trim(),
        timestamp: new Date(),
      },
    ]);

    setInputValue('');
    setIsLoading(true);

    // Send to chatbot
    try {
      await chatbot({
        variables: { message: text.trim() },
      });
    } catch (error) {
      console.error('Chatbot error:', error);
      setIsLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSendMessage(inputValue);
  };

  const handleSuggestionClick = (suggestion) => {
    handleSendMessage(suggestion);
  };

  return (
    <div className="chatbot-container">
      <div className="chatbot-header">
        <h1>🤖 Community Assistant</h1>
        <p className="subtitle">Ask me anything about local issues and improvements</p>
      </div>

      <div className="chatbot-messages">
        {messages.map((message) => (
          <ChatMessage
            key={message.id}
            message={message}
            isUser={message.type === 'user'}
          />
        ))}

        {isLoading && (
          <div className="message-container bot-message">
            <div className="typing-indicator">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {!isLoading && messages.length === 1 && (
        <QuerySuggestions
          suggestions={DEFAULT_SUGGESTIONS}
          onSuggestionClick={handleSuggestionClick}
        />
      )}

      <form onSubmit={handleSubmit} className="chatbot-input-form">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Ask a question about local issues..."
          disabled={isLoading}
          className="chatbot-input"
        />
        <button
          type="submit"
          disabled={isLoading || !inputValue.trim()}
          className="chatbot-send-btn"
        >
          {isLoading ? '⏳' : '📤'}
        </button>
      </form>
    </div>
  );
}
