# AI-Powered Local Issue Tracker - Architecture Documentation

## Project Overview

**Civic Case**: An AI-driven web application that helps residents report, track, and resolve local community issues (potholes, broken streetlights, flooding, safety hazards, accessibility barriers, etc.). The platform empowers residents to submit reports with geolocation and photos, enables city staff to manage and prioritize issues with AI-powered triage, and leverages an **agentic chatbot (LangGraph + Gemini API)** for intelligent natural language queries. AI services provide issue classification, summarization, trend detection, and sentiment analysis. The system uses micro-frontends for modularity and implements microservices architecture for scalability.

---

## 1. System Architecture Overview

### 1.1 Architectural Pattern: Micro Frontends + Microservices Backend with AI Intelligence Layer

```
                                       ┌───────────────────────────────────┐
                                       │             Frontend              │
                                       │ React 19 / Next.js 15 / Svelte 5 │
                                       ├───────────────────────────────────┤
                                       │  Authentication MFE               │
                                       │   • Login / Registration          │
                                       │   • JWT / OAuth                   │
                                       ├───────────────────────────────────┤
                                       │  Issue Reporting & Tracking MFE   │
                                       │   • Submit issue + geotag/photo   │
                                       │   • Track status + notifications  │
                                       │   • AI auto-classification        │
                                       ├───────────────────────────────────┤
                                       │  Analytics & Admin MFE            │
                                       │   • Dashboards + heatmaps         │
                                       │   • Backlog + trend insights      │
                                       │   • Staff issue management        │
                                       ├───────────────────────────────────┤
                                       │  Chatbot UI MFE                   │
                                       │   • Agentic civic assistant       │
                                       │   • Q&A + insights                │
                                       └─────────────────────▲─────────────┘
                                                             │
                                                             │ GraphQL API
                                                             │ Queries/Mutations
                                                             ▼
                  ┌──────────────────────────────────────────────────────────────────┐
                  │                          Backend API                              │
                  │     Apollo Server + Express.js  or  Next.js GraphQL Route         │
                  ├──────────────────────────────────────────────────────────────────┤
                  │ Gateway Layer                                                     │
                  │ • Routes queries to services                                      │
                  │ • Authentication middleware                                       │
                  └───────────────▲──────────────────────────────────────────────────┘
                                  │
                                  │ Service-to-service RPC / REST / GraphQL
                                  ▼
     ┌──────────────────────────────────┬──────────────────────────────────┬────────────────────────────────────┐
     │     Auth Service                │  Issue Management Service         │   Analytics & AI Service           │
     │     (Microservice 1)            │  (Microservice 2)                │   (Microservice 3)                 │
     ├──────────────────────────────────┼──────────────────────────────────┼────────────────────────────────────┤
     │ • Registration / Login          │ • Issue CRUD                      │ • Agentic Chatbot (LangGraph)     │
     │ • JWT / OAuth handling          │ • Status updates                  │ • Gemini classification            │
     │ • Role assignment               │ • Assign staff                    │ • Summaries, triage               │
     │ • Token validation              │ • Alerts + priority               │ • Trend detection                  │
     └───────────────────▲─────────────┼───────────────▲──────────────────┼──────────────────────────▲────────┘
                         │             │               │                  │                          │
                         │             │               │                  │                          │
                         ▼             ▼               ▼                  ▼                          ▼
               ┌────────────────┐  ┌────────────────┐  ┌────────────────────────┐          ┌────────────────────────┐
               │  MongoDB       │  │  MongoDB       │  │  MongoDB               │          │   Gemini API            │
               ├────────────────┤  ├────────────────┤  ├────────────────────────┤          ├────────────────────────┤
               │ • Users        │  │ • Issues        │ │ • Analytics cache       │          │ • LLM responses         │
               │ • Roles        │  │ • Photos/geo     │ │ • AI summaries         │          │ • Classification         │
               │ • Sessions     │  │ • Status logs    │ │ • Trends               │          │ • Triage + insights     │
               └────────────────┘  └────────────────┘  └────────────────────────┘          └────────────────────────┘
```

---

## 2. Frontend Architecture (Micro Frontends)

### 2.1 Frontend Modules

#### **auth_frontend** - Authentication Module
- **Technology Stack**: React 19 / Next.js 15 / Svelte 5, Vite, Apollo Client, GraphQL
- **Responsibilities**:
  - User registration and login (Email/Password)
  - OAuth integration (Google, GitHub)
  - JWT token management
  - Role-based access control (RBAC)
  - Session management
  - Account settings and profile updates
- **Key Components**:
  - `LoginForm.jsx` - Secure login interface
  - `RegisterForm.jsx` - Registration with validation
  - `AuthGuard.jsx` - Protected route wrapper
  - `ProfileForm.jsx` - User profile management
  - `apolloClient.js` - GraphQL client configuration
- **Styling**: Tailwind CSS / React Bootstrap
- **Responsive Design**: Mobile-first approach, touch-friendly interactions

#### **issue_frontend** - Issue Reporting & Tracking Module
- **Technology Stack**: React 19 / Next.js 15 / Svelte 5, Vite, Apollo Client, GraphQL, Tailwind CSS
- **Responsibilities**:
  - Issue submission with geolocation and photo upload
  - Real-time issue tracking and status updates
  - Real-time notifications and urgent alerts
  - Community engagement (comments, upvotes, discussions)
  - AI-powered auto-classification display
  - Issue filtering and search
  - Category and priority management
  - Personal issue dashboard
- **Key Features**:
  - **Issue Reporting**: Form with geolocation capture, photo upload, category selection
  - **Issue Tracking**: Real-time status updates, timeline view, resolution tracking
  - **Notifications**: Push alerts for status changes, urgent neighborhood alerts
  - **Community Engagement**: Comments, upvotes, helpful votes, discussion threads
  - **AI Integration**: Display AI classifications, summaries, and triage recommendations
- **Key Components**:
  - `IssueReportingForm.jsx` - Geolocation + photo submission
  - `IssueTracking.jsx` - Real-time status tracking
  - `IssueList.jsx` - Browse and filter issues
  - `CommentThread.jsx` - Community discussions
  - `NotificationCenter.jsx` - Alerts and updates
- **Styling**: Tailwind CSS with responsive UI

#### **analytics_frontend** - Analytics, Administration & Management Module
- **Technology Stack**: React 19 / Next.js 15 / Svelte 5, Vite, Apollo Client, GraphQL, Tailwind CSS
- **Responsibilities**:
  - Dashboard with KPI metrics and real-time stats
  - Issue heatmaps and geographic visualization
  - Backlog tracking and trend analysis
  - AI-powered triage and classification insights
  - Staff issue assignment and workload management
  - Analytics dashboards and trend detection
  - Report generation and export
  - User and permission management
- **Key Features**:
  - **Dashboards**: Real-time KPIs, issue counts by status/category
  - **Heatmaps**: Geographic distribution of issues
  - **Backlog Management**: Priority tracking, resolution timelines
  - **Trend Detection**: AI-identified patterns, seasonal insights
  - **Staff Tools**: Issue assignment, triage recommendations, workload balancing
  - **Analytics**: Sentiment trends, issue resolution rates, community engagement metrics
- **Key Components**:
  - Interactive charts and graphs (Chart.js / D3.js)
  - Heatmap visualization
  - Customizable dashboards
  - Staff assignment tools
  - Report generation and export
  - Real-time data updates
- **Styling**: Tailwind CSS with analytics-focused UI

#### **Chatbot UI MFE** - Agentic Chatbot Interface
- **Technology Stack**: React 19 / Next.js 15 / Svelte 5, Vite, Apollo Client, GraphQL
- **Responsibilities**:
  - User interface for conversational AI chatbot
  - Display agentic responses with citations and sources
  - Q&A about civic issues (open, resolved, trends)
  - Integration with LangGraph agent workflows
  - Display specialized capabilities (safety alerts, accessibility queries, etc.)
- **Key Features**:
  - Chat message interface with rich formatting
  - Display AI sources and references
  - Specialized civic focus queries
  - Real-time streaming responses
  - Quick action suggestions
- **Key Components**:
  - `ChatInterface.jsx` - Main chat UI
  - `MessageDisplay.jsx` - Format and render responses
  - `QuerySuggestions.jsx` - Quick action buttons
  - `SourceAttribution.jsx` - Show AI sources
- **Styling**: Tailwind CSS

### 2.2 Micro Frontend Integration

```
Main Application Entry Point (index.html)
    ├─ Auth Module (conditional mounting)
    ├─ Issue Module (primary module)
    ├─ Analytics Module (admin-only)
    ├─ Chatbot Module (always available)
    └─ Shared Components & Utilities
        ├─ Apollo Client (centralized)
        ├─ Auth Context/State
        ├─ Notification System
        └─ Styling Framework (Tailwind)
```

**Module Loading Strategy**:
- Dynamic imports based on user role and route
- Lazy loading for non-critical modules
- Shared Apollo Client instance for consistent data management
- Centralized error boundaries and error handling
- Environment-based configuration (development, staging, production)

### 2.3 Responsive Design Strategy

- Mobile-first approach
- Breakpoints: xs (320px), sm (640px), md (768px), lg (1024px), xl (1280px)
- Touch-friendly interactions for mobile
- Progressive enhancement for older browsers
- Accessibility compliance (WCAG 2.1 Level AA)

---

## 3. Backend Architecture (Microservices)

### 3.1 Microservices Overview

#### **Auth Service** (Port: Configurable via .env)
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
│   ├── auth.js                  # JWT verification
│   └── rbac.js                  # Role-based access control
├── utils/
│   ├── jwt.js                   # JWT generation/validation
│   └── validators.js            # Input validation
└── package.json
```

**Responsibilities**:
- User registration and login
- JWT token generation and validation
- OAuth integration (Google, GitHub)
- Password hashing with bcrypt
- User profile management
- Role and permission assignment
- Session management

**Technology Stack**:
- Express.js for HTTP server
- Apollo Server for GraphQL
- MongoDB + Mongoose for data persistence
- JWT for authentication
- bcrypt for password security
- Passport.js for OAuth (optional)

**GraphQL Operations**:
```graphql
# Mutations
mutation Register($email: String!, $password: String!, $name: String!)
mutation Login($email: String!, $password: String!)
mutation LoginWithOAuth($provider: String!, $token: String!)
mutation UpdateProfile($id: ID!, $name: String, $email: String)
mutation AssignRole($userId: ID!, $role: String!)
mutation Logout($token: String!)

# Queries
query GetUser($id: ID!)
query GetCurrentUser
query ListUsers(skip: Int, limit: Int)
query VerifyToken($token: String!)
```

---

#### **Issue Management Service** (Port: Configurable via .env)
```
issue-service/
├── issue-microservice.js        # Service entry point
├── config/
│   ├── config.js                 # Service configuration
│   └── mongoose.js               # MongoDB connection
├── graphql/
│   ├── typeDefs.js              # GraphQL type definitions
│   └── resolvers.js             # GraphQL resolvers
├── models/
│   ├── Issue.js                 # Issue data model
│   ├── Comment.js               # Comment data model
│   └── Alert.js                 # Alert/Notification model
├── services/
│   ├── issueService.js          # Business logic
│   ├── alertService.js          # Alert generation
│   └── notificationService.js   # Real-time notifications
└── package.json
```

**Responsibilities**:
- Issue lifecycle management (CRUD)
- Comment and discussion threads
- Issue categorization and tagging
- Status tracking and updates
- Alert generation and notification
- Permission-based issue access
- Geolocation storage and queries
- Photo/attachment management
- Real-time status updates via subscriptions

**Technology Stack**:
- Express.js for HTTP server
- Apollo Server for GraphQL
- MongoDB + Mongoose for data persistence
- Real-time updates via GraphQL subscriptions
- File upload handling (multer for photo storage)

**GraphQL Operations**:
```graphql
# Issue Mutations
mutation CreateIssue(
  $title: String!
  $description: String!
  $category: String!
  $latitude: Float!
  $longitude: Float!
  $photo: Upload
)
mutation UpdateIssueStatus($id: ID!, $status: String!, $notes: String)
mutation AssignIssueToStaff($id: ID!, $staffId: ID!)
mutation AddComment($issueId: ID!, $content: String!, $photo: Upload)
mutation DeleteIssue($id: ID!)
mutation MarkCommentHelpful($commentId: ID!)

# Issue Queries
query GetIssue($id: ID!)
query ListIssues(
  category: String
  status: String
  priority: String
  skip: Int
  limit: Int
  nearbyLocation: LocationInput
)
query GetIssueComments($issueId: ID!, $skip: Int, $limit: Int)
query GetIssuesNearby($latitude: Float!, $longitude: Float!, $radius: Float!)

# Subscriptions
subscription OnIssueStatusChanged($id: ID!)
subscription OnNewComment($issueId: ID!)
subscription OnIssueAlert($userId: ID!)
subscription OnUrgentNeighborhoodAlert($latitude: Float!, $longitude: Float!, $radius: Float!)
```

---

#### **Analytics & AI Service** (Port: Configurable via .env)
```
ai-service/
├── index.js                      # Service entry point
├── config/
│   ├── config.js                # Gemini API setup
│   └── agents.js                # LangGraph agent definitions
├── agents/
│   ├── civic-chatbot.js         # Main agentic chatbot
│   ├── triage-agent.js          # Issue classification & triage
│   ├── trend-detector.js        # Trend analysis agent
│   └── sentiment-analyzer.js    # Sentiment analysis
├── tools/
│   ├── issue-query-tool.js      # Query issues from DB
│   ├── trend-analysis-tool.js   # Analyze patterns
│   ├── sentiment-tool.js        # Sentiment analysis
│   ├── classification-tool.js   # Issue classification
│   ├── summarizer-tool.js       # Generate summaries
│   └── notification-tool.js     # Send alerts
├── prompts/
│   ├── system-prompts.js        # System prompts
│   ├── civic-focus.js           # Civic focus configuration
│   └── specialized-prompts.js   # Specialized capability prompts
├── models/
│   ├── AnalyticsCache.js        # Cache for analytics
│   ├── AISummary.js             # Stored summaries
│   └── AIOutput.js              # AI operation outputs
└── package.json
```

**Responsibilities**:
- **Agentic Chatbot**: Conversational Q&A on civic issues with LangGraph
- **AI Classification**: Automated categorization and triage of new issues
- **Summarization**: Auto-generate concise issue and discussion summaries
- **Trend Detection**: Identify clusters, patterns, and emerging issues
- **Sentiment Analysis**: Analyze resident feedback and staff responses
- **Analytics**: Dashboard data, insights, backlog predictions
- **Specialized Capabilities**: Civic focus-dependent (e.g., safety alerts, accessibility)

**Technology Stack**:
- LangGraph for agentic workflows
- Google Gemini API (multimodal AI)
- MongoDB for storing AI outputs
- Node.js with async/await for agent execution

**Key AI Features**:

**Agentic Chatbot Capabilities**:
```
Basic Q&A:
├─ Open issues count and details
├─ Resolved issues trends
├─ Issue status queries
├─ General civic information
├─ Geographic queries ("Issues in downtown")
└─ Category-specific insights

Specialized Capabilities (Civic Focus Dependent):
├─ Safety Alerts
│  ├─ High-incident areas
│  ├─ Safety trends
│  └─ Urgent alerts
├─ Accessibility Queries
│  ├─ Accessibility barriers by location
│  ├─ Accessible route recommendations
│  └─ Accessibility improvement trends
└─ Custom Focus Areas
   ├─ Sustainability/environmental issues
   ├─ Infrastructure/transportation
   └─ Community-specific concerns
```

**LangGraph Workflow Example**:
```javascript
import { StateGraph } from "@langchain/langgraph";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

// Define agent state
class AgentState {
  input: string;
  userId: string;
  context: object;
  intermediate_steps: array;
  output: string;
  sources: array;
}

// Build graph
graph = new StateGraph(AgentState);
graph.addNode("agent", agentNode);
graph.addNode("tools", toolNode);
graph.addConditionalEdge("agent", "tools", "agent");

// Compile and run
app = graph.compile();
result = await app.invoke({
  input: userQuery,
  userId: currentUserId
});
```

**GraphQL Operations**:
```graphql
# Analytics Queries
query GetDashboardMetrics {
  dashboardMetrics {
    totalIssues
    openIssues
    resolvedIssues
    averageResolutionTime
    issuesByCategory {
      category
      count
    }
    issuesByStatus {
      status
      count
    }
  }
}

query GetTrendAnalysis {
  trendAnalysis {
    emergingIssues {
      category
      count
      trend
    }
    hotspots {
      latitude
      longitude
      issueCount
      categories
    }
    sentimentTrend {
      timestamp
      averageSentiment
    }
  }
}

query GetIssueSummary($issueId: ID!) {
  issueSummary(issueId: $issueId) {
    summary
    keyPoints
    suggestedCategory
    priority
    confidence
  }
}

# Chatbot Query
query AskChatbot($message: String!, $userId: ID!) {
  chatbot(message: $message, userId: $userId) {
    response
    sources {
      issueId
      title
      relevance
    }
    suggestedActions {
      type
      description
    }
    confidence
  }
}

# Classification Query
query ClassifyIssue($description: String!, $category: String) {
  classifyIssue(description: $description, category: $category) {
    suggestedCategory
    confidence
    alternativeCategories {
      category
      confidence
    }
    suggestedPriority
    expectedResolutionTime
  }
}

# Sentiment Query
query AnalyzeSentiment($issueId: ID!) {
  analyzeSentiment(issueId: $issueId) {
    overallSentiment
    score
    comments {
      commentId
      sentiment
      score
    }
  }
}
```

---

#### **Community Engagement Service** (Optional Microservice)
```
engagement-service/
├── engagement-microservice.js   # Service entry point
├── config/
│   ├── config.js                # Service configuration
│   └── mongoose.js              # MongoDB connection
├── graphql/
│   ├── typeDefs.js             # GraphQL type definitions
│   └── resolvers.js            # GraphQL resolvers
├── models/
│   ├── Volunteer.js            # Volunteer data model
│   ├── EngagementActivity.js    # Engagement tracking
│   └── Discussion.js            # Discussion threads
└── package.json
```

**Responsibilities** (Optional):
- Volunteer coordination and matching
- Community engagement tracking
- Discussion aggregation
- Upvote and voting mechanisms
- Community impact metrics

---

### 3.2 Inter-Service Communication

**API Gateway Pattern** (Apollo Federation):
```
Client
  ↓
Apollo Server (Federation Gateway)
  ├─ Auth Service (Apollo Subgraph)
  ├─ Issue Service (Apollo Subgraph)
  ├─ Analytics & AI Service (Apollo Subgraph)
  └─ (Optional) Engagement Service (Apollo Subgraph)
  ↓
MongoDB (federated data access)
```

**Communication Methods**:
1. **GraphQL Federation** - Primary (Subgraph composition)
2. **REST API** - Secondary (for non-GraphQL clients)
3. **Message Queue** (Optional) - For async operations (alerts, AI processing)

**Error Handling**:
- Centralized error codes
- Consistent error response format
- Retry mechanisms for transient failures
- Circuit breaker pattern for service degradation
- Graceful fallbacks for AI service delays

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
  role: Enum ['resident', 'staff', 'community_advocate', 'admin'],
  permissions: [String],
  avatar: String (URL),
  createdAt: Date,
  updatedAt: Date,
  lastLogin: Date,
  isActive: Boolean,
  oauthProviders: [{
    provider: String (google, github),
    providerId: String,
    email: String
  }]
}
```

#### **Issue Collection**
```javascript
{
  _id: ObjectId,
  title: String,
  description: String,
  category: Enum ['infrastructure', 'safety', 'accessibility', 'sustainability', 'other'],
  priority: Enum ['low', 'medium', 'high', 'critical'],
  status: Enum ['open', 'in_progress', 'resolved', 'closed', 'archived'],
  reportedBy: ObjectId (User reference),
  assignedTo: [ObjectId] (User references),
  location: {
    address: String,
    latitude: Number,
    longitude: Number,
    city: String,
    neighborhood: String
  },
  attachments: [
    {
      url: String,
      fileType: String,
      uploadedAt: Date
    }
  ],
  tags: [String],
  estimatedResolution: Date,
  // AI-generated fields
  aiClassification: {
    category: String,
    confidence: Number (0-1),
    suggestedPriority: String
  },
  aiSummary: String,
  sentiment: {
    score: Number (-1 to 1),
    label: String ['positive', 'neutral', 'negative']
  },
  // Community engagement
  upvotes: Number,
  commentCount: Number,
  resolvedAt: Date,
  createdAt: Date,
  updatedAt: Date
}
```

#### **Comment Collection**
```javascript
{
  _id: ObjectId,
  issueId: ObjectId (Issue reference),
  authorId: ObjectId (User reference),
  content: String,
  attachments: [String (URLs)],
  sentiment: {
    score: Number,
    label: String
  },
  reactions: Map<String, Int>, // e.g., {'👍': 5, '❤️': 2}
  helpfulVotes: Number,
  isResolved: Boolean, // marked as helpful for resolution
  createdAt: Date,
  updatedAt: Date
}
```

#### **Alert/Notification Collection**
```javascript
{
  _id: ObjectId,
  userId: ObjectId (User reference),
  type: Enum ['status_update', 'urgent_alert', 'neighborhood_alert', 'resolution_notification'],
  issueId: ObjectId (Issue reference, optional),
  title: String,
  message: String,
  location: {
    latitude: Number,
    longitude: Number,
    radius: Number (for neighborhood alerts)
  },
  priority: Enum ['normal', 'urgent', 'critical'],
  isRead: Boolean,
  createdAt: Date,
  expiresAt: Date
}
```

#### **AnalyticsCache Collection** (Optional)
```javascript
{
  _id: ObjectId,
  type: Enum ['dashboard_metrics', 'trend_analysis', 'heatmap_data'],
  data: Object,
  generatedAt: Date,
  expiresAt: Date // TTL index for auto-cleanup
}
```

#### **AISummary Collection** (Optional)
```javascript
{
  _id: ObjectId,
  sourceType: Enum ['issue', 'discussion', 'comment_thread'],
  sourceId: ObjectId,
  summary: String,
  keyPoints: [String],
  confidence: Number (0-1),
  model: String (e.g., 'gemini-1.5-pro'),
  generatedAt: Date
}
```

---

## 5. AI Integration & Features

### 5.1 Gemini API Integration

**Setup**:
```javascript
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ 
  model: "gemini-1.5-pro"
});
```

**Use Cases**:
1. **Agentic Chatbot**: Conversational Q&A on civic issues with tool use
2. **Issue Classification**: Categorize and triage new reports
3. **Summarization**: Auto-generate concise issue and discussion summaries
4. **Trend Detection**: Identify patterns, clusters, and emerging issues
5. **Sentiment Analysis**: Analyze resident feedback and staff responses
6. **Alert Generation**: Suggest urgent alerts based on issue severity and patterns
7. **Specialized Capabilities**: Domain-specific features (accessibility queries, safety insights, etc.)

---

### 5.2 Agentic Chatbot (LangGraph + Gemini)

**Architecture**:
```
User Input (Natural Language)
  ↓
[Intent Recognition] → Determine action type
  ├─ Q&A (open/resolved issues)
  ├─ Trend Analysis
  ├─ Geographic Query
  ├─ Category Insight
  ├─ Safety Alert
  ├─ Accessibility Query
  └─ Custom Specialized Query
  ↓
[Tool Selection] → Choose appropriate tools
  ├─ issue-query-tool (fetch from database)
  ├─ trend-analysis-tool (identify patterns)
  ├─ sentiment-tool (analyze feedback)
  ├─ classification-tool (categorize)
  ├─ summarizer-tool (generate summaries)
  └─ notification-tool (send alerts)
  ↓
[Agent Loop] → Execute tools, refine response
  ├─ Gather relevant data
  ├─ Analyze patterns
  ├─ Generate insights
  └─ Compile sources
  ↓
[Response Generation] → Format and deliver answer
  ├─ Natural language response
  ├─ Source attribution
  ├─ Suggested actions
  └─ Confidence score
  ↓
User Response (Conversational + Data)
```

**Example Bot Interactions**:

*Basic Q&A*:
- "How many potholes are reported in downtown?"
- "What's the status of the streetlight repair on Main Street?"
- "Show me resolved issues this month"

*Trend & Analysis*:
- "What are the emerging issue patterns?"
- "Which neighborhoods have the most safety concerns?"
- "How quickly are we resolving issues?"

*Specialized Capabilities (Civic Focus)*:
- "What accessibility barriers are reported near me?"
- "Can you show accessible routes in the downtown area?"
- "Which neighborhoods need the most accessibility improvements?"

*Geographic Queries*:
- "What issues are near [latitude, longitude]?"
- "Show me urgent issues in my neighborhood"

---

### 5.3 Civic Focus Declaration

**Chosen Civic Focus: Accessibility Issues**

**Rationale**:
- Critical for inclusive community engagement
- Clear, measurable outcomes
- Diverse specialized queries
- Strong integration with AI and trend analysis
- Enables progressive issue discovery

**Specialized Chatbot Capabilities**:
1. **Accessibility Queries**: "What accessibility barriers are reported near me?"
2. **Route Recommendations**: "Show me accessible routes to [destination]"
3. **Trend Analysis**: Track improvement/decline in accessibility
4. **Sentiment Tracking**: Monitor community sentiment on accessibility
5. **Advocacy Support**: Suggest effective accessibility advocacy actions

**Example Accessible Queries**:
```
Query: "What accessibility issues are reported in downtown?"
Response: 
  - 15 accessibility barriers reported
  - 8 in transportation
  - 4 in public facilities
  - 3 in outdoor areas
  - 2 resolved this month
  [Sources: 15 issues, average sentiment: -0.3]

Query: "Can you recommend an accessible route from City Hall to the library?"
Response:
  - Main route: City Hall → Commercial St → Oak Ave → Library
  - Accessibility features: Wheelchair accessible, elevators, accessible parking
  - Barriers noted: Curb cut missing at Commercial & 3rd
  - Alternative route available via pedestrian bridge
  [Sources: 23 issues in corridor, community feedback]
```

---

## 6. User Roles & Permissions

### **User Roles**:

#### **Resident**
- Submit new issues with geolocation and photos
- View their own submitted issues
- Comment on and upvote issues
- Receive notifications on issue status
- Use AI chatbot for queries
- View public analytics dashboards

#### **Municipal Staff**
- View all issues with filtering/search
- Assign issues to team members
- Update issue status and add notes
- Prioritize and triage issues
- View staff dashboards with workload metrics
- Access AI triage recommendations
- Manage urgent alerts
- (Optional) Manage volunteer coordination

#### **Community Advocate** (Optional)
- Monitor trends and emerging patterns
- Support residents in issue reporting
- Coordinate community discussions
- View engagement metrics
- Suggest issue improvements
- Generate community reports

#### **Admin**
- Full system access
- User management (create, update, delete users)
- System configuration
- Role assignment
- Analytics and reporting
- Audit logs
- API key management

---

## 7. Technology Stack Summary

### Backend
| Component | Technology | Version |
|-----------|-----------|---------|
| Runtime | Node.js | 18+ |
| Web Framework | Express.js | 5.x+ |
| GraphQL Server | Apollo Server | 4.10+ |
| Database | MongoDB | 6+ |
| ODM | Mongoose | 8+ |
| Authentication | JWT + bcrypt | - |
| OAuth | Passport.js | 0.7+ |
| AI/LLM | Google Gemini API | 2.0+ |
| Agentic Framework | LangGraph | Latest |
| File Upload | multer | 1.4+ |
| File Storage | Local / Cloud (AWS S3, GCS) | - |

### Frontend
| Component | Technology | Version |
|-----------|-----------|---------|
| Framework | React 19 / Next.js 15 / Svelte 5 | Latest |
| Build Tool | Vite | 7+ |
| GraphQL Client | Apollo Client | 4+ |
| Styling | Tailwind CSS | 3+ |
| UI Components | React Bootstrap / Headless UI | - |
| State Management | React Context API / Zustand | - |
| Forms | React Hook Form | 7+ |
| Maps | Leaflet / Google Maps API | - |
| Testing | Vitest / React Testing Library | - |

---

## 8. Deployment Architecture

### 8.1 Container Strategy
```
docker-compose.yml
├─ auth-service (Container)
├─ issue-service (Container)
├─ ai-service (Container)
├─ engagement-service (Optional Container)
├─ mongodb (Container)
├─ auth_frontend (Container/Static)
├─ issue_frontend (Container/Static)
└─ analytics_frontend (Container/Static)
```

### 8.2 Environment Configuration
```
.env files (per service):
├─ SERVICE_PORT
├─ NODE_ENV
├─ MONGODB_URI
├─ GEMINI_API_KEY
├─ JWT_SECRET
├─ CORS_ORIGIN
├─ OAUTH_GOOGLE_ID / OAUTH_GOOGLE_SECRET
├─ OAUTH_GITHUB_ID / OAUTH_GITHUB_SECRET
└─ LOG_LEVEL
```

### 8.3 Development Workflow
```
Development
├─ npm run dev (each service separately)
├─ MongoDB local instance
└─ Environment variables from .env.local

Production
├─ Docker Compose or Kubernetes
├─ MongoDB Atlas or managed cluster
├─ Cloud storage for uploads (S3, GCS)
└─ Environment variables from secrets manager
```

---

## 9. Security Architecture

### 9.1 Authentication & Authorization
- **JWT-based Authentication**: Stateless, scalable
- **OAuth 2.0**: Google and GitHub sign-in support
- **Role-Based Access Control (RBAC)**:
  - `resident`: Submit issues, comment, view public data
  - `staff`: Manage assigned issues, view dashboards
  - `community_advocate`: Monitor trends, support residents
  - `admin`: Full system access
- **Token Expiration**: 24 hours (configurable)
- **Refresh Tokens**: Secure, httpOnly cookies

### 9.2 Data Protection
- **Password Hashing**: bcrypt (10+ salt rounds)
- **CORS Policy**: Restrict cross-origin requests
- **Input Validation**: Sanitize all user inputs
- **Rate Limiting**: Prevent brute force and DDoS
- **Data Encryption**: HTTPS/TLS for all communications

### 9.3 API Security
- **GraphQL**: Rate limiting, query complexity analysis
- **HTTPS**: TLS 1.3 in production
- **API Keys**: Secure key management for external services
- **Audit Logging**: Track sensitive operations
- **File Upload Security**: Validate file types, scan for malware

### 9.4 Privacy & Compliance
- **GDPR Compliance**: Data minimization, user consent
- **Privacy Policy**: Clear data usage terms
- **Anonymization**: Option to anonymize issue reports
- **Data Retention**: Configurable retention policies

---

## 10. Performance Optimization

### 10.1 Frontend
- **Code Splitting**: Lazy load routes and modules
- **Image Optimization**: WebP with fallbacks, responsive images
- **Caching**: Service Workers, HTTP cache headers
- **Bundle Analysis**: Regular webpack analysis
- **Virtualization**: Virtual scrolling for large lists

### 10.2 Backend
- **Database Indexing**: Index frequently queried fields (userId, status, location)
- **Query Optimization**: Use aggregation pipelines for analytics
- **Caching**: Redis for dashboards, trending data
- **Connection Pooling**: MongoDB connection optimization
- **Batch Operations**: Batch AI processing for efficiency

### 10.3 AI Service Optimization
```
Chatbot Response Caching:
├─ Cache frequent queries
├─ Invalidate on data changes
└─ Fallback to Gemini if cache misses

Analytics Aggregation:
├─ Scheduled batch jobs (hourly, daily)
├─ Cached snapshots for dashboards
└─ Real-time updates for critical metrics

Classification Caching:
├─ Cache classification results
├─ Batch process new issues
└─ Update on manual overrides
```

### 10.4 Monitoring
- **Performance Metrics**: APM tools (New Relic, DataDog)
- **Error Tracking**: Sentry integration
- **Log Aggregation**: ELK Stack or CloudWatch
- **AI Cost Tracking**: Monitor Gemini API usage
- **Uptime Monitoring**: Heartbeat checks for all services

---

## 11. Development Timeline & Milestones

| Phase | Timeline | Deliverables |
|-------|----------|--------------|
| **Phase 1** | Week 1-2 | Backend setup: Auth service, MongoDB models |
| **Phase 2** | Week 2-3 | Issue Management Service with CRUD operations |
| **Phase 3** | Week 3-4 | Frontend modules setup (auth, issue, analytics) |
| **Phase 4** | Week 4-5 | Real-time features (notifications, subscriptions) |
| **Phase 5** | Week 5-6 | Analytics & AI Service setup, Gemini integration |
| **Phase 6** | Week 6-7 | Agentic chatbot development (LangGraph) |
| **Phase 7** | Week 7-8 | AI features (classification, summarization, trends) |
| **Phase 8** | Week 8-9 | Civic focus specialization (accessibility features) |
| **Phase 9** | Week 9-10 | Integration testing, performance optimization |
| **Phase 10** | Week 10-11 | Deployment, documentation, user testing |
| **Phase 11** | Week 11+ | Launch, monitoring, iterative improvements |

---

## 12. Testing Strategy

### 12.1 Frontend Testing
```
Unit Tests → Component-level tests (Vitest)
Integration Tests → GraphQL/API integration (React Testing Library)
E2E Tests → User workflows (Cypress/Playwright)
Accessibility Tests → WCAG compliance (axe-core)
```

**Critical User Workflows**:
- Issue submission with geolocation
- Real-time status tracking
- Chatbot interaction
- Staff assignment flow

### 12.2 Backend Testing
```
Unit Tests → Service logic (Jest)
Integration Tests → GraphQL resolvers (Apollo Server testing)
Database Tests → Mongoose models
API Tests → GraphQL/REST endpoints
Performance Tests → Load testing (k6, Artillery)
```

**AI Service Testing**:
- Chatbot response quality
- Classification accuracy
- Summary relevance
- Trend detection validity
- Sentiment analysis accuracy

### 12.3 User Acceptance Testing (UAT)
```
Beta Testing → Real user feedback
Usability Testing → UI/UX validation
Performance Testing → Load under real-world conditions
Security Testing → Penetration testing, vulnerability assessment
```

---

## 13. Risk Mitigation

| Risk | Mitigation |
|------|-----------|
| Gemini API rate limits | Implement caching, queue management, fallback responses |
| AI accuracy issues | Human review process, feedback loops, fallback strategies |
| Data privacy concerns | GDPR compliance, encrypted storage, anonymization options |
| Scalability issues | Horizontal scaling, load balancing, database sharding |
| Real-time sync delays | Fallback to polling, optimistic updates, clear status indicators |
| File upload abuse | File type validation, size limits, virus scanning |
| Geographic query performance | Spatial indexing (geospatial queries), caching |
| Integration complexity | Comprehensive testing, clear APIs, detailed documentation |
| Low user engagement | Effective onboarding, notifications, community features |

---

## 14. Future Enhancements

- **Mobile Apps**: React Native for iOS/Android with offline support
- **Real-time Collaboration**: Live updates for staff teams
- **Advanced Analytics**: ML models for predictive issue patterns
- **Multi-language Support**: i18n for international users
- **Social Features**: Volunteer teams, community forums
- **Integration with City Systems**: API connections to existing city databases
- **AR Features**: Augmented reality issue visualization
- **Mobile-First Portal**: Responsive design for on-the-go reporting
- **Sentiment-Driven Prioritization**: Automatic priority adjustment based on sentiment
- **Accessibility Verification**: Photo verification of accessibility improvements

---

## 15. API Examples & Integration Points

### Auth Service Examples
```graphql
mutation RegisterUser {
  register(
    email: "resident@example.com"
    password: "securePassword123"
    name: "John Doe"
    role: "resident"
  ) {
    token
    user {
      id
      name
      email
      role
    }
  }
}

mutation LoginUser {
  login(email: "resident@example.com", password: "securePassword123") {
    token
    user {
      id
      name
      role
    }
  }
}

mutation LoginWithOAuth {
  loginWithOAuth(provider: "google", token: "google_token_string") {
    token
    user {
      id
      name
      email
    }
  }
}
```

### Issue Service Examples
```graphql
mutation CreateIssue {
  createIssue(
    title: "Pothole on Main Street"
    description: "Large pothole near the intersection"
    category: "infrastructure"
    latitude: 40.7128
    longitude: -74.0060
    photo: "file.jpg"
  ) {
    id
    status
    reportedBy {
      name
    }
  }
}

query GetIssuesNearby {
  issuesNearby(
    latitude: 40.7128
    longitude: -74.0060
    radius: 2000
  ) {
    id
    title
    category
    distance
    status
  }
}

subscription OnIssueStatusChanged {
  issueStatusChanged(id: "issue_123") {
    id
    status
    updatedAt
    assignedTo {
      name
    }
  }
}
```

### Analytics & AI Service Examples
```graphql
query GetChatbotResponse {
  chatbot(
    message: "What accessibility issues are near downtown?"
    userId: "user_123"
  ) {
    response
    sources {
      issueId
      title
      relevance
    }
    confidence
  }
}

query ClassifyNewIssue {
  classifyIssue(
    description: "The curb has no ramp for wheelchair users"
    category: null
  ) {
    suggestedCategory
    confidence
    suggestedPriority
  }
}

query GetDashboardMetrics {
  dashboardMetrics {
    totalIssues
    openIssues
    avgResolutionTime
    byCategory {
      category
      count
    }
  }
}

query GetTrendAnalysis {
  trends {
    emergingIssues {
      category
      count
      trend
    }
    hotspots {
      latitude
      longitude
      issueCount
    }
  }
}
```

---

## 16. Requirement Alignment Checklist

### Core Requirements: 100% Alignment

✅ **User Authentication**:
- JWT-based login/registration
- OAuth support (Google, GitHub)

✅ **User Roles**:
- Resident (submit, track)
- Municipal Staff (manage, assign)
- Community Advocate (monitor, support)
- Admin (full access)

✅ **Core Features for Residents**:
- Issue Reporting & Tracking (geotag + photo)
- Notifications & Alerts (real-time)

✅ **Core Features for Municipal Staff**:
- Issue Management Dashboard
- Analytics & AI-based Insights

✅ **Core Features for Community Advocates**:
- Engagement Tools (comments, discussions)
- Support coordination

✅ **Backend Requirements**:
- MongoDB for document storage
- GraphQL with Apollo Server + Express
- Microservices Architecture (3+ services):
  - Auth Service ✅
  - Issue Management Service ✅
  - Analytics & AI Service ✅
  - (Optional) Community Engagement Service

✅ **Frontend Requirements**:
- React 19 / Next.js 15 / Svelte 5
- Micro Frontends Approach:
  - Authentication MFE
  - Issue Reporting & Tracking MFE
  - Analytics & Administration MFE
  - Chatbot UI MFE

✅ **AI Integrations**:
- Gemini API for all AI features
- Agentic Chatbot (LangGraph + Gemini) ✅ [MANDATORY]
- Optional Extensions:
  - Summarization ✅
  - Classification & Triage ✅
  - Trend Detection ✅
  - Sentiment Analysis ✅

✅ **UI & Design**:
- Tailwind CSS / React Bootstrap
- Responsive design (mobile-first)

✅ **Civic Focus Declaration**:
- Accessibility Issues (with specialized chatbot capabilities)

---

## Document Version & History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 2.0 | 2025-12-09 | Architecture Team | Revised to AI-Powered Local Issue Tracker with agentic chatbot focus, added architecture diagram |
| 1.0 | 2025-12-07 | Architecture Team | Initial gamified platform architecture |

---

**Document Approved By**: Project Lead  
**Last Updated**: 2025-12-09  
**Status**: Active - Ready for Implementation
