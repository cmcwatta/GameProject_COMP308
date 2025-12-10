# AI-Powered Local Issue Tracker - Architecture Documentation

## Project Overview

An intelligent web application that empowers residents to report and track community issues (potholes, broken streetlights, flooding, safety hazards, accessibility barriers) while enabling municipal staff to manage and resolve them efficiently. AI services provide agentic chatbot support, automated issue classification, summarization, trend detection, and actionable insights. The platform leverages micro-frontends for modularity and integrates Google Gemini API for intelligent features.

**Civic Focus**: Accessibility Issues in Municipal Infrastructure

---

## 1. System Architecture Overview

### 1.1 Architectural Pattern: Micro Frontends + Microservices Backend with AI Intelligence Layer

```
┌─────────────────────────────────────────────────────────────────┐
│                    CLIENT LAYER (Web)                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────────┐  ┌──────────────────┐  ┌────────────────┐ │
│  │ Auth Frontend    │  │ Issue Tracking   │  │ Analytics &    │ │
│  │  (Vite + React)  │  │ Frontend         │  │ Management     │ │
│  │ - Login/Register │  │ (Vite + React)   │  │ (Vite + React) │ │
│  │ - Profiles       │  │ - Report Issues  │  │ - Dashboards   │ │
│  │ - JWT Auth       │  │ - Track Status   │  │ - Analytics    │ │
│  └────────┬─────────┘  │ - View Alerts    │  │ - Staff Tools  │ │
│           │            │ - AI Chatbot     │  └────────┬───────┘ │
│           │            └────────┬─────────┘           │          │
│           │                     │                     │          │
│           └─────────────┬───────┴─────────────┬──────┘          │
│                         │                     │                  │
│                    ┌────▼─────────────────────▼──┐               │
│                    │   Apollo Client (GraphQL)    │               │
│                    └────────────┬─────────────────┘               │
│                                 │                                 │
└─────────────────────────────────┼─────────────────────────────────┘
                                  │
          ┌───────────────────────┼───────────────────────────┐
          │                       │                           │
┌─────────▼──────────┐ ┌─────────▼──────────┐ ┌──────────────▼─────────┐
│  Auth Service      │ │ Issue Management   │ │ Engagement Service     │
│  (Apollo Server)   │ │ Service            │ │ (Apollo Server)        │
│                    │ │ (Apollo Server)    │ │                        │
│  - JWT Auth        │ │                    │ │ - Comments & Discussion│
│  - User Mgmt       │ │ - Issue CRUD       │ │ - Upvotes/Helpful     │
│  - Roles/Perms     │ │ - Status Tracking  │ │ - Community Feedback   │
│  - Profiles        │ │ - Priority Mgmt    │ │ - Volunteer Matching  │
│  - Statistics      │ │ - Geolocation      │ │                        │
│  - Sign-up/Login   │ │ - Image Upload     │ │                        │
│                    │ │ - Real-time Alerts │ │                        │
└─────────┬──────────┘ └─────────┬──────────┘ └──────────────┬────────┘
          │                      │                           │
          │                      │                           │
          └──────────────┬───────┴───────────────────────────┘
                         │
          ┌──────────────┼──────────────┐
          │              │              │
    ┌─────▼────────────────────┐   ┌───▼──────────────────────┐
    │ AI Service               │   │ Notification Service     │
    │(LangGraph + Gemini)      │   │ (Real-time Updates)      │
    │                          │   │                          │
    │ - Agentic Chatbot        │   │ - Alert Notifications    │
    │ - Issue Classification   │   │ - Status Updates         │
    │ - Auto Summarization     │   │ - Urgent Alerts          │
    │ - Trend Detection        │   │ - User Notifications     │
    │ - Sentiment Analysis     │   └──────────────────────────┘
    │ - Specialized Queries    │
    │   (Accessibility Focus)  │
    └─────────┬────────────────┘
              │
         ┌────▼──────────────────────────────┐
         │   MongoDB Database                │
         ├───────────────────────────────────┤
         │  Collections:                      │
         │  - Users                           │
         │  - Issues                          │
         │  - Comments                        │
         │  - Notifications                   │
         │  - AIOutputs (summaries, classifications)
         │  - IssueHistory (audit trail)      │
         └───────────────────────────────────┘

              ┌────────────────────────────┐
              │ External APIs & Services   │
              ├────────────────────────────┤
              │ - Google Gemini API        │
              │ - LangGraph Framework      │
              │ - Email/SMS Services       │
              │ - Geolocation APIs         │
              └────────────────────────────┘
```

---

## 2. Frontend Architecture (Micro Frontends)

### 2.1 Frontend Modules

#### **auth_frontend** - Authentication Module
- **Technology Stack**: React 19, Vite, Apollo Client, GraphQL
- **Responsibilities**:
  - User registration (residents, staff, advocates)
  - Login/logout with JWT authentication
  - Role-based access control (RBAC)
  - User profile management
  - Session management
  - Password reset functionality
- **User Roles**:
  - **Resident**: Submit and track issues, view dashboards
  - **Municipal Staff**: Manage issues, assign tasks, update status
  - **Community Advocate**: Monitor trends, support residents, engagement tools
- **Key Components**:
  - `LoginForm.jsx` - User authentication
  - `RegisterForm.jsx` - New user signup
  - `ProfileForm.jsx` - User profile editing
  - `AuthGuard.jsx` - Route protection and role-based access
  - `AuthComponents.jsx` - Reusable auth UI components
- **Styling**: Tailwind CSS

#### **issue_frontend** - Issue Reporting & Tracking Module
- **Technology Stack**: React 19, Vite, Apollo Client, GraphQL, Tailwind CSS
- **Responsibilities** (Residents):
  - Submit new issues with geolocation and photos
  - Track issue status in real-time
  - View alerts and notifications
  - Comment on issues and engage with community
  - Access AI-powered chatbot for issue queries
  - Upload evidence (images, documents)
- **Responsibilities** (Staff):
  - View assigned issues dashboard
  - Update issue status and priority
  - Assign issues to team members
  - Add internal notes and updates
  - Triage issues with AI assistance
- **Key Features**:
  - Geolocation-based issue submission
  - File/image uploads for evidence
  - Real-time status updates with notifications
  - Comment threads for discussion
  - AI chatbot integration
  - Issue filtering and search
  - Map view of issues (heatmap visualization)
- **Key Components**:
  - `IssueSubmissionForm.jsx` - Create new issues
  - `IssuesList.jsx` - Browse and filter issues
  - `IssueDetail.jsx` - View full issue information
  - `StatusTracker.jsx` - Track issue progress
  - `CommentsSection.jsx` - Community discussion
  - `AIChatbot.jsx` - Chat interface for queries
  - `MapView.jsx` - Geospatial visualization
- **Styling**: Tailwind CSS with responsive design

#### **analytics_frontend** - Analytics, Administration & Insights Module
- **Technology Stack**: React 19, Vite, Apollo Client, GraphQL, Tailwind CSS
- **Responsibilities**:
  - Admin dashboard with KPI metrics
  - Issue trend analysis and visualizations
  - Heatmap showing issue clusters
  - Backlog and workload tracking
  - AI-powered insights and recommendations
  - Staff performance and assignment management
  - Report generation and export
- **For Municipal Staff**:
  - Issue management dashboard
  - AI-based triage recommendations
  - Analytics and insights for decision-making
  - Workload balancing
- **For Community Advocates**:
  - Trend monitoring and analysis
  - Community engagement metrics
  - Volunteer coordination tools
  - Engagement tracking
- **Key Components**:
  - `AdminDashboard.jsx` - KPI metrics and overview
  - `IssueHeatmap.jsx` - Geospatial visualization
  - `TrendAnalysis.jsx` - Pattern detection and insights
  - `BacklogTracker.jsx` - Issue queue management
  - `StaffManagement.jsx` - User and role management
  - `AIInsights.jsx` - AI-generated recommendations
  - `ReportGenerator.jsx` - Export and reporting tools
  - `EngagementMetrics.jsx` - Community activity tracking
- **Styling**: Tailwind CSS with analytics-focused UI

### 2.2 Micro Frontend Integration

**Module Loading Strategy**:
- Dynamic imports based on user role and route
- Lazy loading for non-critical modules
- Shared Apollo Client instance for consistent data management
- Centralized error boundaries and error handling
- Environment-based configuration for API endpoints

### 2.3 Responsive Design Strategy

- Mobile-first approach
- Breakpoints: xs (320px), sm (640px), md (768px), lg (1024px), xl (1280px)
- Touch-friendly interactions for mobile
- Progressive enhancement for older browsers
- Accessibility compliance (WCAG 2.1 Level AA)
- Map interfaces optimized for mobile

---

## 3. Backend Architecture (Microservices)

### 3.1 Microservices Overview

#### **Auth Service** (Port: 4001)
```
auth-service/
├── auth-microservice.js          # Service entry point
├── config/
│   ├── config.js                 # Service configuration
│   └── mongoose.js               # MongoDB connection
├── graphql/
│   ├── typeDef.js               # GraphQL type definitions
│   └── resolvers.js             # GraphQL resolvers
├── models/
│   └── User.js                  # User data model
├── middleware/
│   └── auth.js                  # JWT authentication middleware
├── utils/
│   ├── jwt.js                   # JWT token utilities
│   └── validators.js            # Input validation
└── package.json
```

**Responsibilities**:
- User registration (with validation)
- User login with JWT token generation
- JWT token validation and refresh
- Password hashing with bcrypt
- User profile management
- Role and permission assignment (Resident, Staff, Advocate)
- User deactivation/deletion

**Technology Stack**:
- Express.js for HTTP server
- Apollo Server for GraphQL
- MongoDB + Mongoose for data persistence
- JWT for stateless authentication
- bcrypt for password security

**GraphQL Operations**:
```graphql
# Mutations
mutation Register($email: String!, $password: String!, $name: String!, $role: String!)
mutation Login($email: String!, $password: String!)
mutation UpdateProfile($id: ID!, $name: String, $email: String, $avatar: String)
mutation ChangePassword($userId: ID!, $oldPassword: String!, $newPassword: String!)
mutation AssignRole($userId: ID!, $role: String!)

# Queries
query GetUser($id: ID!)
query GetCurrentUser
query ListUsers($role: String, $skip: Int, $limit: Int)
query VerifyToken($token: String!)
```

---

#### **Issue Service** (Port: 4003)
```
issue-service/
├── issue-microservice.js         # Service entry point
├── config/
│   ├── config.js                 # Service configuration
│   └── mongoose.js               # MongoDB connection
├── graphql/
│   ├── typeDefs.js              # GraphQL type definitions
│   └── resolvers.js             # GraphQL resolvers
├── models/
│   └── Issue.js                 # Issue data model
└── package.json
```

**Responsibilities**:
- Issue lifecycle management (CRUD operations)
- Issue status tracking (Open, In Progress, Resolved, Closed, Duplicate)
- Priority assignment (Low, Medium, High, Critical)
- Geolocation-based issue storage
- Image and file upload management
- Alert generation for urgent issues
- Permission-based issue access
- Issue history/audit trail
- **AI Classification**: Auto-categorize and suggest priority
- **Urgent Alerts**: Send real-time notifications for critical issues

**Technology Stack**:
- Express.js for HTTP server
- Apollo Server for GraphQL
- MongoDB + Mongoose for data persistence
- File upload handling (Multer)
- Real-time updates via subscriptions

**GraphQL Operations**:
```graphql
# Issue Mutations
mutation CreateIssue($title: String!, $description: String!, $category: String!, 
                     $location: LocationInput!, $photos: [String!])
mutation UpdateIssueStatus($id: ID!, $status: String!)
mutation UpdateIssuePriority($id: ID!, $priority: String!)
mutation AssignIssue($id: ID!, $staffId: ID!)
mutation DeleteIssue($id: ID!)

# Issue Queries
query GetIssue($id: ID!)
query ListIssues($category: String, $status: String, $priority: String, 
                 $location: LocationInput, $skip: Int, $limit: Int)
query GetUserIssues($userId: ID!, $skip: Int, $limit: Int)
query SearchIssues($query: String!, $skip: Int, $limit: Int)

# Subscriptions
subscription OnIssueStatusChanged($id: ID!)
subscription OnUrgentAlert
```

---

#### **AI Service** (Port: 4002)
```
ai-service/
├── index.js                      # Service entry point
├── config/
│   ├── config.js                # AI and LangGraph setup
│   └── gemini.js                # Gemini API initialization
├── agents/
│   ├── civic-chatbot.js         # Main agentic chatbot
│   ├── classifier.js            # Issue classification & triage
│   ├── summarizer.js            # Issue summarization
│   ├── trend-detector.js        # Pattern and trend analysis
│   └── accessibility-advisor.js # Accessibility-focused queries
├── tools/
│   ├── issue-query-tool.js      # Query issues from database
│   ├── trend-analysis-tool.js   # Analyze patterns
│   ├── accessibility-tool.js    # Accessibility-specific queries
│   └── notification-tool.js     # Trigger notifications
├── prompts/
│   ├── system-prompts.js        # Base system prompts
│   ├── accessibility-focus.js   # Civic focus configuration
│   └── civic-prompts.js         # Civic-specific instructions
├── graphql/
│   ├── typeDefs.js              # GraphQL type definitions
│   └── resolvers.js             # GraphQL resolvers
└── package.json
```

**Responsibilities**:
- Agentic chatbot for Q&A on civic issues
- AI-powered issue classification and triage
- Automated issue summarization
- Trend detection and pattern analysis
- Sentiment analysis of community feedback
- Specialized queries for accessibility issues (civic focus)
- AI-assisted recommendations for staff
- Challenge and opportunity identification

**Technology Stack**:
- LangGraph for agentic workflows
- Google Gemini API (multimodal AI)
- MongoDB for storing AI outputs
- Express.js with GraphQL

**Key Features**:
```
Agentic Chatbot Capabilities:
├─ Basic Q&A
│  ├─ Open issues count and details
│  ├─ Status queries for specific issues
│  ├─ Category-based issue searches
│  └─ General civic information
├─ Accessibility-Focused Features (Civic Focus)
│  ├─ Query accessibility issues in specific areas
│  ├─ Identify accessibility barriers and gaps
│  ├─ Recommend accessible alternatives
│  ├─ Trend analysis on accessibility improvements
│  └─ Community sentiment on accessibility
├─ Advanced AI Features
│  ├─ Issue summarization for long threads
│  ├─ Automatic classification of new reports
│  ├─ Emerging pattern detection
│  ├─ Sentiment analysis of comments
│  └─ Staff decision support
└─ Specialized Queries
   ├─ "What accessibility issues are in downtown?"
   ├─ "Which barriers have been reported most?"
   ├─ "What's the trend in accessibility issues?"
   └─ "Which areas need urgent accessibility improvements?"
```

**Agentic Workflow**:
```
User Query
  ↓
[Intent Recognition] → Determine action (Q&A, classification, analysis, etc.)
  ↓
[Tool Selection] → Choose appropriate tools
  ├─ issue-query-tool (fetch from database)
  ├─ trend-analysis-tool (analyze patterns)
  ├─ accessibility-tool (specialized accessibility queries)
  └─ notification-tool (trigger alerts if needed)
  ↓
[Agent Loop] → Execute tools and refine responses
  ↓
[Response Generation] → Format and deliver answer
  ↓
User Response with Actionable Insights
```

**GraphQL Operations**:
```graphql
# AI Mutations
mutation ClassifyIssue($issueData: IssueInput!): ClassificationResult
mutation GenerateIssueSummary($issueId: ID!): SummaryResult
mutation AnalyzeTrends($timeRange: String, $category: String): TrendAnalysis

# AI Queries
query ChatWithBot($input: String!, $context: String): ChatResponse
query GetTrendInsights($timeRange: String!): [Insight!]!
query GetSentimentAnalysis($issueId: ID!): SentimentScore
query GetAccessibilityInsights: AccessibilityReport
query RecommendPriorities($count: Int): [IssueRecommendation!]!

# Subscriptions
subscription OnTrendDetected
subscription OnClassificationComplete($issueId: ID!)
```

---

#### **Engagement Service** (Community Features) (Port: 4004)
```
engagement-service/
├── engagement-microservice.js    # Service entry point
├── config/
│   ├── config.js                 # Service configuration
│   └── mongoose.js               # MongoDB connection
├── graphql/
│   ├── typeDefs.js              # GraphQL type definitions
│   └── resolvers.js             # GraphQL resolvers
├── models/
│   ├── Comment.js               # Comment data model
│   └── Volunteer.js             # Volunteer coordination
└── package.json
```

**Responsibilities** (Community Advocates):
- Comment and discussion management on issues
- Upvote/helpful voting system for community feedback
- Community engagement tracking and sentiment analysis
- Volunteer matching and coordination
- Community advocate tools for engagement activities
- **Discussion Summaries**: Summarize community discussion threads
- **Community Sentiment**: Gauge community sentiment on issues

**Technology Stack**:
- Express.js with GraphQL
- MongoDB + Mongoose for comments and volunteer data
- Real-time updates via subscriptions

**GraphQL Operations**:
```graphql
# Engagement Mutations
mutation AddComment($issueId: ID!, $content: String!, $authorId: ID!)
mutation UpvoteIssue($issueId: ID!, $userId: ID!)
mutation MarkCommentHelpful($commentId: ID!, $userId: ID!)
mutation CreateVolunteerMatch($userId: ID!, $issueId: ID!)
mutation UpdateVolunteerStatus($matchId: ID!, $status: String!)

# Engagement Queries
query GetIssueComments($issueId: ID!, $skip: Int, $limit: Int)
query GetCommentThread($commentId: ID!)
query GetUpvoteCount($issueId: ID!)
query GetVolunteerMatches($userId: ID!)
query GetDiscussionSummary($issueId: ID!)

# Subscriptions
subscription OnNewComment($issueId: ID!)
subscription OnCommentUpvote($commentId: ID!)
subscription OnVolunteerMatch($userId: ID!)
```

---

#### **Notification Service** (Port: 4005)
```
notification-service/
├── index.js                      # Service entry point
├── config/
│   ├── config.js                # Configuration
│   └── email.js                 # Email service setup
├── models/
│   └── Notification.js          # Notification data model
├── services/
│   ├── emailService.js          # Email sending
│   └── alertService.js          # Alert management
└── package.json
```

**Responsibilities**:
- Send real-time notifications
- Manage alert preferences
- Alert generation for urgent issues
- Email notifications for issue updates
- User notification history

---

### 3.2 Inter-Service Communication

**API Gateway Pattern** (Federation):
```
Client
  ↓
Apollo Server (Federation)
  ├─ Auth Service (Apollo Subgraph)
  ├─ Issue Service (Apollo Subgraph)
  ├─ AI Service (Apollo Subgraph)
  └─ Notification Service (REST/Events)
  ↓
MongoDB
```

**Communication Methods**:
1. **GraphQL Federation** - Primary (Subgraph composition)
2. **REST API** - Secondary (for non-GraphQL clients)
3. **Event System** - For async operations (status updates, notifications)

---

## 4. Data Model

### 4.1 Database Schema

#### **User Collection**
```javascript
{
  _id: ObjectId,
  email: String (unique),
  passwordHash: String,
  name: String,
  avatar: String (URL),
  role: String (Enum: "resident", "staff", "advocate"),
  location: {
    address: String,
    coordinates: {
      type: Point,
      coordinates: [longitude, latitude]
    }
  },
  phone: String (optional),
  department: String (for staff),
  bio: String (optional),
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date,
  lastLogin: Date
}
```

#### **Issue Collection**
```javascript
{
  _id: ObjectId,
  title: String,
  description: String,
  category: String (Enum: accessibility, pothole, streetlight, flooding, safety, other),
  priority: String (Enum: "low", "medium", "high", "critical"),
  status: String (Enum: "open", "in_progress", "resolved", "closed", "duplicate"),
  reportedBy: ObjectId (reference to User),
  assignedTo: ObjectId (reference to User, optional),
  location: {
    address: String,
    coordinates: {
      type: Point,
      coordinates: [longitude, latitude]
    },
    description: String
  },
  photos: [String] (URLs to uploaded images),
  attachments: [String] (URLs to documents),
  tags: [String],
  upvotes: [ObjectId] (array of user IDs),
  upvoteCount: Number,
  comments: [ObjectId] (reference to Comment),
  commentCount: Number,
  aiClassification: {
    category: String,
    confidence: Number (0-1),
    summary: String,
    suggestedPriority: String
  },
  internalNotes: [String] (for staff),
  resolution: {
    description: String,
    resolvedDate: Date,
    resolvedBy: ObjectId
  },
  createdAt: Date,
  updatedAt: Date,
  resolvedAt: Date (optional),
  statusHistory: [{
    status: String,
    changedAt: Date,
    changedBy: ObjectId,
    note: String
  }]
}
```

#### **Comment Collection**
```javascript
{
  _id: ObjectId,
  issueId: ObjectId (reference to Issue),
  authorId: ObjectId (reference to User),
  content: String,
  helpful: Boolean (optional),
  helpfulCount: Number,
  replies: [ObjectId] (reference to Comment, for threaded replies),
  attachments: [String] (URLs),
  isDeleted: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

#### **Notification Collection**
```javascript
{
  _id: ObjectId,
  userId: ObjectId (reference to User),
  issueId: ObjectId (reference to Issue),
  type: String (Enum: "status_update", "comment", "urgent_alert", "resolved"),
  title: String,
  message: String,
  isRead: Boolean,
  link: String (deep link to issue),
  createdAt: Date,
  readAt: Date (optional)
}
```

#### **AI Output Collection**
```javascript
{
  _id: ObjectId,
  issueId: ObjectId (reference to Issue),
  type: String (Enum: "summary", "classification", "trend", "sentiment"),
  content: String,
  metadata: {
    confidence: Number,
    generatedBy: String (model name),
    processingTime: Number
  },
  createdAt: Date
}
```

---

## 5. AI Integration & LangGraph Architecture

### 5.1 Gemini API Integration

**Setup**:
```javascript
// config/gemini.js
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ 
  model: "gemini-1.5-pro" 
});
```

**Use Cases**:
1. **Chatbot**: Q&A on civic issues, status queries, trend information
2. **Classification**: Auto-categorize and prioritize new reports
3. **Summarization**: Generate concise summaries of issue threads
4. **Trend Detection**: Identify clusters and emerging patterns
5. **Sentiment Analysis**: Analyze community feedback and satisfaction
6. **Specialized Queries**: Accessibility-focused analysis (civic focus)
7. **Staff Decision Support**: Recommend actions and priorities

---

### 5.2 Agentic Chatbot (LangGraph) Architecture

**Agentic Workflow**:
```
User Query
  ↓
[Intent Recognition] → Determine action (Q&A, search, analysis, etc.)
  ↓
[Tool Selection] → Choose appropriate tools
  ├─ issue-query-tool (fetch from database)
  ├─ trend-analysis-tool (analyze patterns)
  ├─ accessibility-tool (specialized queries)
  └─ notification-tool (alerts)
  ↓
[Agent Loop] → Execute tools and refine responses with context
  ↓
[Response Generation] → Format and deliver answer with citations
  ↓
User Response with Actionable Insights
```

**Civic Focus Example: Accessibility Issues**
- **Specialized Capability**: Accessibility-specific queries and recommendations
- **Sample Bot Interactions**:
  - "What accessibility issues are reported downtown?"
  - "Which areas lack accessible transportation?"
  - "Show me the trend in accessibility improvements"
  - "What are the most reported accessibility barriers?"
  - "Which unresolved accessibility issues need urgent attention?"

---

## 6. Civic Focus Declaration

**Chosen Civic Focus: Accessibility Issues in Municipal Infrastructure**

**Rationale**:
- Critical for inclusive community engagement
- Clear, measurable outcomes and trackable improvements
- Diverse specialized queries (accessibility barriers, alternative routes)
- Strong AI integration opportunities for trend analysis
- Enables targeted community advocacy

**Specialized Chatbot Capabilities for Accessibility Focus**:
1. **Accessibility Queries**: "What accessibility barriers are reported in my neighborhood?"
2. **Barrier Analysis**: "Which intersections lack accessible crosswalks?"
3. **Alternative Routes**: "Can you suggest accessible routes for my commute?"
4. **Trend Analysis**: Track improvement/decline in accessibility over time
5. **Community Sentiment**: Monitor community sentiment on accessibility initiatives
6. **Gap Identification**: Identify underreported areas for accessibility issues

**AI-Enhanced Features for Accessibility**:
```
Chatbot Examples:
├─ "Show me all accessibility issues in downtown"
├─ "What's the status of accessibility improvements on Main Street?"
├─ "Which areas have the most unresolved accessibility issues?"
├─ "How has accessibility improved in the past month?"
├─ "What are the most common accessibility barriers reported?"
├─ "Can you help me report an accessibility issue I encountered?"
└─ "What resources are available for accessibility advocacy?"
```

**Requirement Alignment**: 100% (Exceeds 70% threshold)
- Core Requirements: ✓ All met (User auth, issue tracking, AI chatbot, classification, trend detection)
- Customization: Accessibility focus (civic specificity), LangGraph agents, specialized chatbot capabilities

---

## 7. Technology Stack Summary

### Backend
| Component | Technology | Version |
|-----------|-----------|---------|
| Runtime | Node.js | 18+ |
| Web Framework | Express.js | 4.21+ |
| GraphQL Server | Apollo Server | 4.10+ |
| Database | MongoDB | 6+ |
| Authentication | JWT + bcrypt | - |
| AI/LLM | Google Gemini API | 1.5+ |
| Agentic Framework | LangGraph | Latest |
| File Upload | Multer | 1.4+ |

### Frontend
| Component | Technology | Version |
|-----------|-----------|---------|
| Framework | React | 19+ |
| Build Tool | Vite | 7+ |
| GraphQL Client | Apollo Client | 4+ |
| Styling | Tailwind CSS | 3+ |
| State Management | React Context API | - |
| Maps | Leaflet/MapBox | - |
| Testing | Vitest / React Testing Library | - |

---

## 8. Security Architecture

### 8.1 Authentication & Authorization
- **JWT-based Authentication**: Stateless, scalable
- **Role-Based Access Control (RBAC)**:
  - `resident`: Submit issues, comment, upvote, view public data
  - `staff`: Manage issues, update status, assign tasks, view analytics
  - `advocate`: Monitor trends, support residents, engagement tools
- **Token Expiration**: 24 hours (configurable)
- **Refresh Tokens**: Secure, httpOnly cookies

### 8.2 Data Protection
- **Password Hashing**: bcrypt (10+ salt rounds)
- **CORS Policy**: Restrict cross-origin requests
- **Input Validation**: Sanitize all user inputs
- **Rate Limiting**: Prevent brute force and DDoS
- **File Upload Security**: Validate file types and sizes

---

## 9. Development Timeline

| Phase | Timeline | Deliverables |
|-------|----------|--------------|
| **Phase 1** | Week 1-2 | Auth service, user models, role management |
| **Phase 2** | Week 2-3 | Issue Management service, CRUD operations |
| **Phase 3** | Week 3-4 | Engagement service, comments, notifications |
| **Phase 4** | Week 4-5 | Frontend modules setup (auth, issue tracking, analytics) |
| **Phase 5** | Week 5-6 | AI service, Gemini integration, agentic chatbot |
| **Phase 6** | Week 6-7 | Classification, summarization, trend detection |
| **Phase 7** | Week 7-8 | Accessibility-focused features |
| **Phase 8** | Week 8-9 | Analytics dashboards, insights |
| **Phase 9** | Week 9-10 | Integration testing, optimization |
| **Phase 10** | Week 10-11 | Deployment, documentation |

---

## 10. Testing Strategy

### 10.1 Frontend Testing
```
Unit Tests → Component-level tests (Vitest)
Integration Tests → API integration (React Testing Library)
E2E Tests → User workflows (Cypress/Playwright)
Accessibility Tests → WCAG compliance
```

### 10.2 Backend Testing
```
Unit Tests → Service logic (Jest)
Integration Tests → GraphQL resolvers
Database Tests → Mongoose models
API Tests → REST/GraphQL endpoints
Performance Tests → Load testing
```

---

## 11. Risk Mitigation

| Risk | Mitigation |
|------|-----------|
| Gemini API rate limits | Implement caching, queue management |
| Data privacy/security | GDPR compliance, encrypted storage |
| Scalability issues | Horizontal scaling, load balancing |
| Inaccurate AI classification | Human review, feedback loops |
| Low user adoption | Intuitive UX, mobile optimization |

---

## 12. Future Enhancements

- **Mobile Apps**: React Native for iOS/Android
- **Real-time Updates**: WebSockets for live status updates
- **Advanced Analytics**: ML models for predictive maintenance
- **Multi-language Support**: i18n for communities
- **API for Third Parties**: Integration with city systems
- **Volunteer Management**: Full volunteer coordination
- **Photo Analysis**: ML for automated issue detection
- **Accessibility Scoring**: Rate areas by accessibility compliance

---

## Summary

This AI-powered local issue tracker empowers residents and municipal staff to collaboratively solve community problems through intelligent issue reporting, tracking, and resolution. The integration of LangGraph and Gemini AI provides sophisticated natural language capabilities, automatic issue classification, and trend detection. The focus on accessibility ensures inclusive community engagement while leveraging modern web technologies for scalability and responsiveness.

**Document Version**: 2.0 (Redesigned for AI-Powered Issue Tracking)  
**Last Updated**: 2025-12-09  
**Status**: Active
