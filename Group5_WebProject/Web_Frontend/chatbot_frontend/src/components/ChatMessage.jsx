import React, { useState } from 'react';
import './ChatMessage.css';

export default function ChatMessage({ message, isUser }) {
  const [showSources, setShowSources] = useState(false);

  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (isUser) {
    return (
      <div className="message-container user-message">
        <div className="message-content user">
          <p>{message.text}</p>
          <span className="message-time">{formatTime(message.timestamp)}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="message-container bot-message">
      <div className="message-content bot">
        <p>{message.text}</p>

        {message.confidence && (
          <div className="confidence-indicator">
            <small>Confidence: {(message.confidence * 100).toFixed(0)}%</small>
          </div>
        )}

        {message.sources && message.sources.length > 0 && (
          <div className="message-sources">
            <button
              className="sources-toggle"
              onClick={() => setShowSources(!showSources)}
            >
              📚 {message.sources.length} source{message.sources.length !== 1 ? 's' : ''}
            </button>

            {showSources && (
              <div className="sources-list">
                {message.sources.map((source) => (
                  <div key={source.issueId} className="source-item">
                    <div className="source-title">{source.title}</div>
                    <div className="source-meta">
                      <span className="source-status">{source.status}</span>
                      <span className="source-relevance">
                        {(source.relevance * 100).toFixed(0)}% relevant
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {message.suggestedActions && message.suggestedActions.length > 0 && (
          <div className="suggested-actions">
            <p className="actions-title">💡 Suggested Actions:</p>
            <div className="actions-list">
              {message.suggestedActions.map((action, index) => (
                <div key={index} className="action-item">
                  <span className="action-type">{action.type}</span>
                  <span className="action-description">{action.description}</span>
                  {action.url && (
                    <a href={action.url} className="action-link" target="_blank" rel="noopener noreferrer">
                      Learn more →
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        <span className="message-time">{formatTime(message.timestamp)}</span>
      </div>
    </div>
  );
}
