# Civic Issue Management Platform - Architecture Documentation

## Project Overview

An AI-driven web application that empowers residents to report and track local community issues (potholes, broken streetlights, flooding, safety hazards, accessibility barriers), enables municipal staff to manage and prioritize responses, and leverages AI for intelligent issue analysis, classification, and community engagement. The platform features an agentic chatbot powered by LangGraph and Google Gemini API for natural language queries about civic issues, trends, and specialized features.

---

## 1. System Architecture Overview

### 1.1 Architectural Pattern: Microservices Backend + Micro Frontends

```
FRONTEND LAYER (React 19 + Vite)
├─ Auth Frontend (Login, Registration, OAuth)
├─ Issue Frontend (Report, Track, Discuss)
└─ Analytics Frontend (Dashboard, Insights, Chatbot)

GRAPHQL LAYER (Apollo Federation)
├─ Auth Service Subgraph
├─ Issue Service Subgraph
├─ Analytics Service Subgraph
└─ Engagement Service Subgraph (Optional)

BACKEND SERVICES (Node.js + Express)
├─ Auth Service (JWT, OAuth, User Management)
├─ Issue Management Service (CRUD, Geolocation, Notifications)
├─ Analytics & AI Service (LangGraph, Gemini, Trends, Chatbot)
└─ Engagement Service (Comments, Upvotes, Volunteer Matching)

DATA LAYER
├─ MongoDB (Issue, User, Comment, Notification Collections)
├─ Redis Cache (optional, for performance)
└─ External APIs (Gemini, Google Maps, OAuth Providers)
```

---

## 2. Frontend Architecture (Micro Frontends)

### 2.1 Frontend Modules

#### **auth_frontend** - Authentication & User Management
- User registration with email/password
- Login with JWT
- OAuth integration (Google, GitHub sign-in)
- Role selection (Resident, Municipal Staff, Community Advocate)
- User profile management
- Password reset and account settings

#### **issue_frontend** - Issue Reporting & Tracking
- Submit issues with geolocation and photo uploads
- Real-time issue status tracking
- Browse and filter issues (by category, status, location)
- Comment threads and community discussions
- Upvote helpful issues and comments
- Receive real-time notifications and alerts
- Personal dashboard showing submitted issues

#### **analytics_frontend** - Analytics, Administration & Insights
- Issue management dashboard for staff (assign, update, triage)
- Analytics and insights visualizations
- Heatmap showing issue clusters by location
- Trend detection and pattern analysis
- SLA tracking and performance metrics
- AI-powered chatbot interface
- Sentiment analysis of community feedback
- Custom report generation

### 2.2 Responsive Design
- Mobile-first approach for field reporting
- Tailwind CSS for styling
- Responsive layout for all screen sizes
- Touch-friendly interactions for mobile
- Progressive enhancement for older browsers

---

## 3. Backend Architecture (Microservices)

### 3.1 Auth Service
**Responsibilities**:
- User registration and login (JWT)
- OAuth integration (Google, GitHub)
- Password hashing and security
- User profile management
- Role and permission assignment

**Technology**: Node.js + Express + Apollo Server + MongoDB + Mongoose

**Key Operations**:
```graphql
mutation Register($email: String!, $password: String!, $name: String!, $role: String!)
mutation Login($email: String!, $password: String!)
mutation LoginWithOAuth($provider: String!, $token: String!)
query GetCurrentUser
query VerifyToken($token: String!)
```

---

### 3.2 Issue Management Service
**Responsibilities**:
- Issue CRUD operations (create, read, update, delete)
- Geolocation-based issue tracking
- Photo/attachment management
- Comment threads and discussions
- Upvote and helpful voting system
- Real-time notifications and alerts
- SLA tracking and escalation
- Status history and audit trails
- Workflow management and assignments

**Technology**: Node.js + Express + Apollo Server + MongoDB + Socket.io (for real-time)

**Key Models**:
- Issue (title, description, category, status, priority, location, photos, assignee)
- Comment (issueId, authorId, content, upvotes)
- Notification (userId, type, title, message, read status)
- StatusHistory (audit trail of all status changes)

**Key Operations**:
```graphql
mutation CreateIssue($title: String!, $description: String!, $category: String!, $location: LocationInput!, $photos: [Upload!])
mutation UpdateIssueStatus($id: ID!, $status: String!)
mutation AssignIssue($id: ID!, $staffId: ID!)
mutation AddComment($issueId: ID!, $content: String!)
query GetIssue($id: ID!)
query ListIssues(category: String, status: String, skip: Int, limit: Int)
query GetIssuesByLocation(lat: Float!, lon: Float!, radius: Int!)
subscription OnIssueStatusChanged($id: ID!)
subscription OnNewComment($issueId: ID!)
```

---

### 3.3 Analytics & AI Service
**Responsibilities**:
- Agentic chatbot for Q&A on civic issues (LangGraph + Gemini)
- Issue classification and triage
- Trend detection and pattern analysis
- Sentiment analysis of comments
- Geographic clustering and heatmap generation
- Forecasting and predictive analytics
- Issue summarization
- Dashboard insights and recommendations

**Technology**: Node.js + Express + Apollo Server + LangGraph + Google Gemini API + MongoDB

**Agentic Chatbot Example**:
```
User: "What flooding issues are in downtown?"
  ↓
[Intent: Geographic + Category Query]
  ↓
[Tools: issueQuery, trendAnalysis, geospatialAnalysis]
  ↓
[Gemini: Generate Natural Language Response]
  ↓
Response: "12 flooding reports downtown, up 40% this week. 
           Critical areas: Maple & 5th, Park Avenue underpass."
```

**Civic Focus: Flooding**
- **Specialized Capabilities**:
  - Flood risk assessment for specific addresses
  - Flood-prone area identification
  - Seasonal flood trends and patterns
  - Preventive measures and guidance
  - Drainage system status and improvements
  - Flood alert subscriptions by location

**Key Operations**:
```graphql
query ChatBot($message: String!): ChatbotResponse
query GetTrends(category: String, timeRange: String): [Trend]
query GetHeatmapData(bounds: BoundsInput): HeatmapData
query GetInsights(timeRange: String): [AnalyticsInsight]
query GetSentimentAnalysis(issueId: ID!): SentimentAnalysis
query GetClassificationSuggestion($description: String!): ClassificationResult
subscription OnTrendDetected: Trend
```

---

### 3.4 Engagement Service (Optional)
**Responsibilities**:
- Volunteer registration and management
- Volunteer-to-issue matching
- Community engagement tracking
- Volunteer coordination

**Technology**: Node.js + Express + Apollo Server + MongoDB

---

## 4. Data Model

### Core Collections

#### Users
```
{
  _id, email, passwordHash, name, role, phone, location,
  preferences {notificationFrequency, categories, radius},
  status, emailVerified, createdAt, oauthProviders
}
```

#### Issues
```
{
  _id, title, description, category, subcategory, priority, status,
  location {address, latitude, longitude, geopoint},
  reportedBy, assignedTo, photos, severity,
  aiSummary, aiClassification, sentiment,
  upvotes, comments, statusHistory,
  slaDeadline, slaStatus, createdAt, resolvedAt
}
```

#### Comments
```
{
  _id, issueId, authorId, content, upvotes,
  sentiment, isStaffResponse, isPinned, createdAt
}
```

#### Notifications
```
{
  _id, userId, type, issueId, title, message,
  priority, read, readAt, createdAt
}
```

#### Trends & Analytics
```
{
  _id, type, title, data, affectedArea,
  period {startDate, endDate}, generatedAt, confidence
}
```

---

## 5. AI Integration

### 5.1 Gemini API

**Use Cases**:
1. **Chatbot**: Q&A on civic issues, trends, alerts
2. **Classification**: Auto-categorize new reports
3. **Summarization**: Condense issue descriptions and comment threads
4. **Sentiment Analysis**: Analyze community feedback
5. **Trend Detection**: Identify issue clusters and patterns
6. **Forecasting**: Predict future issue hotspots

### 5.2 LangGraph + Gemini Integration

**Agent Workflow**:
```
User Query
  ↓
Intent Recognition
  ↓
Tool Selection (issueQuery, trendAnalysis, geospatial, etc.)
  ↓
Tool Execution
  ↓
Response Refinement (LangGraph loop)
  ↓
Gemini Response Generation
  ↓
Return to User
```

**Tools**:
- `issueQueryTool`: Fetch issues from database with filters
- `trendAnalysisTool`: Analyze patterns and trends
- `geospatialTool`: Geographic clustering and analysis
- `sentimentTool`: Analyze sentiment in comments
- `predictionTool`: Forecast issue locations/types

---

## 6. Core Features

### 6.1 For Residents
- **Report Issues**: Submit with geolocation, photo, description
- **Track Status**: Real-time updates on issue resolution
- **Receive Alerts**: Notifications for nearby high-priority issues
- **Engage**: Comment, upvote, discuss with community and staff

### 6.2 For Municipal Staff
- **Manage Issues**: View, assign, update status, track SLA
- **Dashboard**: Analytics, trends, performance metrics
- **Triage**: AI-powered categorization and priority suggestions
- **Insights**: Heatmaps, trend detection, forecasting

### 6.3 For Community Advocates (Optional)
- **Monitor**: Track issues and trends
- **Support**: Help residents, match with volunteers
- **Report**: Generate insights and recommendations

---

## 7. Technology Stack

**Backend**:
- Node.js 20+, Express.js 4.21+
- Apollo Server 4.10+, GraphQL
- MongoDB 6+, Mongoose
- JWT + bcrypt for auth
- Google Gemini API
- LangGraph
- Socket.io for real-time

**Frontend**:
- React 19.2+, Vite 7+
- Apollo Client 4+
- Tailwind CSS 3+
- Mapbox GL JS or Google Maps
- Recharts or Chart.js

---

## 8. Deployment

**Docker Compose Structure**:
```
Services:
├─ auth-service (Port: 5001)
├─ issue-service (Port: 5002)
├─ analytics-service (Port: 5003)
├─ engagement-service (Port: 5004, optional)
├─ mongodb (Port: 27017)
├─ auth_frontend (Port: 3001)
├─ issue_frontend (Port: 3002)
└─ analytics_frontend (Port: 3003)
```

---

## 9. Security

- **Authentication**: JWT + OAuth (Google, GitHub)
- **Authorization**: Role-based access control
- **Data Protection**: Password hashing, HTTPS/TLS
- **API Security**: Rate limiting, input validation
- **Privacy**: GDPR/PIPEDA compliance, audit logging

---

## 10. Civic Focus: Flooding Management

**Problem**: Flooding is a critical civic issue affecting infrastructure, safety, and quality of life.

**AI Solution**: Agentic chatbot provides intelligent Q&A, risk assessment, historical analysis, and preventive guidance.

**Specialized Capabilities**:
- Flood risk assessment for specific addresses
- Flood-prone area identification
- Historical flood trends (seasonal, year-over-year)
- Preventive measures and home protection tips
- Drainage system status and improvements
- Real-time flooding alerts by location

**Metrics**:
- Flood report response time
- Recurring flood hotspots
- Seasonal flood trends
- Community risk perception (sentiment)
- Prevention measure effectiveness

---

## 11. Requirements Alignment

**Core Requirements (70%)** ✓
- Microservices architecture (Auth, Issue, Analytics)
- MongoDB database
- GraphQL with Express.js
- React 19 frontend with micro frontends
- JWT authentication + OAuth
- Issue management features
- User roles (Resident, Staff, Advocate)
- AI integration (Gemini)
- Agentic chatbot (LangGraph + Gemini)

**Customization (30%)** ✓
- Flooding civic focus (10%)
- Specialized chatbot features (10%)
- Enhanced analytics & trends (10%)

---

## 12. Future Enhancements

- Mobile apps (React Native)
- Real-time collaboration for staff
- ML-powered issue prediction
- Integration with city databases
- Advanced volunteer management
- IoT sensor integration
- SMS/push notifications
- Offline mobile support
- AR issue reporting

---

**Document Status**: Active  
**Version**: 2.0  
**Last Updated**: 2025-12-07
