import React from 'react';
import './QuerySuggestions.css';

export default function QuerySuggestions({ suggestions, onSuggestionClick }) {
  return (
    <div className="suggestions-container">
      <p className="suggestions-title">Try asking:</p>
      <div className="suggestions-grid">
        {suggestions.map((suggestion, index) => (
          <button
            key={index}
            className="suggestion-btn"
            onClick={() => onSuggestionClick(suggestion)}
          >
            <span className="suggestion-text">{suggestion}</span>
            <span className="suggestion-arrow">→</span>
          </button>
        ))}
      </div>
    </div>
  );
}
