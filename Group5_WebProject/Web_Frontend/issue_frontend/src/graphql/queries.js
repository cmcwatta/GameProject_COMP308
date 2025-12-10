import { gql } from '@apollo/client';

// Queries
export const GET_ISSUES = gql`
  query GetIssues($status: String, $category: String, $limit: Int, $offset: Int) {
    getIssues(status: $status, category: $category, limit: $limit, offset: $offset) {
      id
      title
      description
      status
      category
      upvotes
      commentCount
      location {
        latitude
        longitude
        address
      }
      createdAt
      updatedAt
      creator {
        id
        name
      }
    }
  }
`;

export const GET_ISSUES_NEARBY = gql`
  query GetIssuesNearby($latitude: Float!, $longitude: Float!, $radius: Float!) {
    getIssuesNearby(latitude: $latitude, longitude: $longitude, radius: $radius) {
      id
      title
      description
      status
      category
      upvotes
      commentCount
      location {
        latitude
        longitude
        address
      }
      createdAt
      creator {
        id
        name
      }
    }
  }
`;

export const GET_ISSUE_DETAIL = gql`
  query GetIssueDetail($id: ID!) {
    getIssueDetail(id: $id) {
      id
      title
      description
      status
      category
      upvotes
      commentCount
      aiClassification
      aiSummary
      sentiment
      location {
        latitude
        longitude
        address
      }
      createdAt
      updatedAt
      creator {
        id
        name
        role
      }
      comments {
        id
        content
        sentiment
        createdAt
        author {
          id
          name
        }
      }
    }
  }
`;

export const GET_ALERTS = gql`
  query GetAlerts {
    getAlerts {
      id
      issueId
      title
      description
      priority
      radius
      center {
        latitude
        longitude
      }
      createdAt
      expiresAt
    }
  }
`;

// Mutations
export const CREATE_ISSUE = gql`
  mutation CreateIssue(
    $title: String!
    $description: String!
    $category: String!
    $latitude: Float!
    $longitude: Float!
    $address: String
    $attachments: [String]
  ) {
    createIssue(
      title: $title
      description: $description
      category: $category
      latitude: $latitude
      longitude: $longitude
      address: $address
      attachments: $attachments
    ) {
      id
      title
      description
      status
      category
      location {
        latitude
        longitude
        address
      }
      createdAt
    }
  }
`;

export const UPDATE_ISSUE_STATUS = gql`
  mutation UpdateIssueStatus($id: ID!, $status: String!) {
    updateIssueStatus(id: $id, status: $status) {
      id
      title
      status
      updatedAt
    }
  }
`;

export const ADD_COMMENT = gql`
  mutation AddComment($issueId: ID!, $content: String!) {
    addComment(issueId: $issueId, content: $content) {
      id
      issueId
      content
      sentiment
      createdAt
      author {
        id
        name
      }
    }
  }
`;

export const UPVOTE_ISSUE = gql`
  mutation UpvoteIssue($id: ID!) {
    upvoteIssue(id: $id) {
      id
      upvotes
    }
  }
`;

export const DELETE_ISSUE = gql`
  mutation DeleteIssue($id: ID!) {
    deleteIssue(id: $id)
  }
`;

// Subscriptions
export const ISSUE_STATUS_CHANGED = gql`
  subscription OnIssueStatusChanged($issueId: ID!) {
    issueStatusChanged(issueId: $issueId) {
      id
      status
      updatedAt
    }
  }
`;

export const NEW_COMMENT = gql`
  subscription OnNewComment($issueId: ID!) {
    newComment(issueId: $issueId) {
      id
      issueId
      content
      sentiment
      createdAt
      author {
        id
        name
      }
    }
  }
`;
