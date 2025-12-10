# Civic Engagement Platform - Backend

AI-driven web app for reporting, tracking, and resolving local community issues.

## 🏗️ Architecture

Microservices architecture with:
- **Auth Service** (Port 4001): User authentication & authorization with JWT
- **AI Service** (Port 4002): AI-powered chatbot (LangGraph + Gemini), classification, summarization, trend detection
- **Issue Service** (Port 4003): Issue tracking, geolocation, and status management
- **Engagement Service** (Port 4004): Comments, upvotes, community discussion
- **Notification Service** (Port 4005): Real-time alerts and status updates
- **API Gateway** (Port 4000): Unified GraphQL entry point with Federation

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
- Google Gemini API key
- npm or yarn

### Installation & Setup

1. **Install dependencies** (in each service directory):
```bash
npm install
```

2. **Configure environment variables** (.env file in each service):
```env
# Auth Service (.env)
AUTH_SERVICE_PORT=4001
JWT_SECRET=your-secret-key
MONGODB_URI=mongodb://localhost:27017/civic-platform

# AI Service (.env)
AI_SERVICE_PORT=4002
GEMINI_API_KEY=your-gemini-api-key
GEMINI_MODEL=gemini-1.5-pro

# Issue Service (.env)
ISSUE_SERVICE_PORT=4003
MONGODB_URI=mongodb://localhost:27017/civic-platform

# Notification Service (.env)
NOTIFICATION_SERVICE_PORT=4005
MONGODB_URI=mongodb://localhost:27017/civic-platform

# Engagement Service (.env)
ENGAGEMENT_SERVICE_PORT=4004
MONGODB_URI=mongodb://localhost:27017/civic-platform
```

3. **Start MongoDB**:
```bash
# Local MongoDB
mongod

# Or use MongoDB Atlas (update MONGODB_URI)
```

4. **Start each service** (in separate terminals):
```bash
# Terminal 1: Auth Service
cd auth-service
npm run dev

# Terminal 2: AI Service
cd ai-service
npm run dev

# Terminal 3: Issue Service
cd issue-service
npm run dev

# Terminal 4: Engagement Service
cd engagement-service  # (or separate engagement-service directory if applicable)
npm run dev

# Terminal 5: Notification Service
cd notification-service
npm run dev

# Terminal 6: API Gateway
cd gateway
npm run dev
```

## 📚 Services Overview

### Auth Service
Handles user registration, login, JWT token management, and role-based access control.

**GraphQL Endpoints**:
- Mutations: `Register`, `Login`, `UpdateProfile`, `ChangePassword`
- Queries: `GetUser`, `GetCurrentUser`, `ListUsers`

### Issue Service
Manages issue lifecycle, geolocation, uploads, comments, and status tracking.

**GraphQL Endpoints**:
- Mutations: `CreateIssue`, `UpdateIssueStatus`, `AssignIssue`, `AddComment`
- Queries: `GetIssue`, `ListIssues`, `GetIssueComments`, `SearchIssues`
- Subscriptions: `OnIssueStatusChanged`, `OnNewComment`

### AI Service
Provides agentic chatbot (powered by LangGraph and Gemini), issue classification, summarization, and trend analysis.

**GraphQL Endpoints**:
- Mutations: `ClassifyIssue`, `GenerateIssueSummary`, `AnalyzeTrends`
- Queries: `ChatWithBot`, `GetTrendInsights`, `GetAccessibilityInsights`
- Subscriptions: `OnTrendDetected`, `OnClassificationComplete`

**Key Features**:
- Agentic chatbot for Q&A on civic issues
- AI-powered issue classification and priority suggestions
- Automatic summarization of issue threads
- Trend detection and pattern analysis
- Accessibility-focused specialized queries

### Engagement Service
Handles comments, upvotes, helpful voting, and community engagement.

**GraphQL Endpoints**:
- Mutations: `AddComment`, `UpvoteIssue`, `MarkHelpful`
- Queries: `GetComments`, `GetUpvotes`

### Notification Service
Sends real-time notifications and alerts.

**GraphQL/REST Endpoints**:
- Mutations: `CreateNotification`, `MarkAsRead`
- Queries: `GetNotifications`

## 🔐 Authentication

Uses JWT-based authentication with three user roles:
- **Resident**: Submit and track issues, comment, upvote
- **Municipal Staff**: Manage assigned issues, update status, triage
- **Community Advocate**: Monitor trends, support residents, engagement tools

Token format: Bearer token in Authorization header
```bash
Authorization: Bearer <jwt_token>
```

## 📊 AI Integration

### Gemini API Setup
Get your API key from [Google AI Studio](https://aistudio.google.com/app/apikey)

### LangGraph Configuration
The AI service uses LangGraph for building agentic workflows:
- Intent recognition
- Tool selection and execution
- Response generation with context

### Chatbot Examples
```
User: "What accessibility issues are reported downtown?"
Bot: Queries database and uses trend analysis tools to provide insights

User: "Can you help me report a broken ramp?"
Bot: Guides through issue creation with AI-powered classification
```

## 🗄️ Data Model

Key collections in MongoDB:
- **Users**: Authentication and profile data
- **Issues**: Community issue reports with geolocation
- **Comments**: Discussion threads on issues
- **Notifications**: User notifications and alerts
- **AIOutputs**: Cached AI classifications and summaries

See [ARCHITECTURE.md](../ARCHITECTURE.md) for complete data schema.

## 🧪 Testing

```bash
# Run tests in each service
npm test

# Run with coverage
npm run test:coverage

# GraphQL tests
npm run test:graphql
```

## 📝 API Documentation

Full GraphQL schema available at:
- `http://localhost:4000/graphql` - Apollo Studio (when running gateway)

Postman collection available in `/docs/postman`

## 🚀 Deployment

### Docker Compose
```bash
docker-compose up
```

### Kubernetes
```bash
kubectl apply -f k8s/
```

### Environment Configuration
Production environment variables should be set in your deployment platform's secrets manager.

## 🛠️ Development

### Code Structure
```
auth-service/
├── config/          # Configuration files
├── graphql/         # GraphQL type definitions and resolvers
├── models/          # MongoDB schemas
├── middleware/      # Authentication and validation middleware
├── utils/           # Utility functions
└── auth-microservice.js

ai-service/
├── agents/          # LangGraph agents
├── tools/           # Agent tools and utilities
├── prompts/         # System and specialized prompts
├── graphql/         # GraphQL definitions
└── index.js

engagement-service/
├── models/          # Issue, Comment, Volunteer schemas
├── graphql/         # GraphQL definitions
└── engagement-microservice.js

gateway/
├── config/          # Gateway configuration
├── index.js         # Apollo Federation gateway
└── package.json
```

### Scripts
```bash
npm run dev          # Start service with hot reload
npm run build        # Build for production
npm run start        # Start production server
npm test             # Run tests
npm run lint         # Run linter
```

## 📖 Civic Focus

**Accessibility Issues in Municipal Infrastructure**

The AI service includes specialized capabilities for accessibility-focused queries:
- Identify accessibility barriers
- Track accessibility improvements over time
- Analyze community sentiment on accessibility
- Recommend accessible alternatives

Example queries:
- "What accessibility issues are reported in my area?"
- "Which intersections lack accessible crosswalks?"
- "How has accessibility improved this month?"

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## 📄 License

[Your License Here]

## 📞 Support

For issues and questions, please create an issue in the repository or contact the team.

---

**Version**: 2.0 (AI-Powered Issue Tracking)  
**Last Updated**: 2025-12-09

### Installation

1. **Clone the repository:**
```bash
git clone <your-repo-url>
cd Web_Backend