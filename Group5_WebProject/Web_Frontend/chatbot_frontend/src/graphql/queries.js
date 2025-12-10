import { gql } from '@apollo/client';

export const CHATBOT_QUERY = gql`
  query Chatbot($message: String!) {
    chatbot(message: $message) {
      response
      confidence
      suggestedActions {
        type
        description
        url
      }
      sources {
        issueId
        title
        relevance
        status
      }
    }
  }
`;

export const CLASSIFY_ISSUE = gql`
  query ClassifyIssue($text: String!) {
    classifyIssue(text: $text) {
      classification
      confidence
      alternatives {
        category
        confidence
      }
    }
  }
`;

export const ANALYZE_SENTIMENT = gql`
  query AnalyzeSentiment($text: String!) {
    analyzeSentiment(text: $text) {
      score
      label
      confidence
    }
  }
`;
