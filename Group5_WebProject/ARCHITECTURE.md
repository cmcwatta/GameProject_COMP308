# Civic Engagement Gamified Platform - Architecture Documentation

## Project Overview

A modular, scalable civic engagement platform that gamifies issue reporting and tracking through interactive gameplay mechanics. Residents engage by submitting reports, completing challenges, earning rewards, and climbing leaderboards while helping their community. Administrators receive AI-driven insights to prioritize and manage civic issues. The system leverages micro-frontends for modularity and integrates Gemini AI for intelligent features and game analysis.

---

## 1. System Architecture Overview

### 1.1 Architectural Pattern: Micro Frontends + Microservices Backend with Gamification Layer

```
┌─────────────────────────────────────────────────────────────────┐
│                    CLIENT LAYER (Web)                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────────┐  ┌──────────────────┐  ┌────────────────┐ │
│  │ Auth Frontend    │  │ Game Frontend    │  │ Analytics      │ │
│  │  (Vite + React)  │  │ (Vite + React)   │  │ (Vite + React) │ │
│  └────────┬─────────┘  │ - Issue Games    │  └────────┬───────┘ │
│           │            │ - Challenges     │           │          │
│           │            │ - Leaderboards   │           │          │
│           │            │ - Rewards/XP     │           │          │
│           │            │ - Achievements   │           │          │
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
          ┌───────────────────────┼───────────────────────┐
          │                       │                       │
┌─────────▼──────────┐ ┌─────────▼──────────┐ ┌─────────▼──────────┐
│  Auth Service      │ │ Gamification       │ │ Engagement         │
│  (Apollo Server)   │ │ Service            │ │ Service            │
│                    │ │ (Apollo Server)    │ │ (Apollo Server)    │
│  - JWT Auth        │ │                    │ │                    │
│  - User Mgmt       │ │ - Points/XP System │ │ - Issue CRUD       │
│  - Roles/Perms     │ │ - Achievements     │ │ - Comments         │
│  - Profiles        │ │ - Challenges       │ │ - Alerts           │
│  - Statistics      │ │ - Leaderboards     │ │ - Status Updates   │
└─────────┬──────────┘ │ - Badges           │ └─────────┬──────────┘
          │            │ - Rewards          │           │
          │            │ - Game Analytics   │           │
          │            └─────────┬──────────┘           │
          │                      │                      │
          └──────────────┬───────┴──────────────────────┘
                         │
          ┌──────────────┼──────────────┐
          │              │              │
    ┌─────▼────────┐     │     ┌────────▼─────────┐
    │ AI Service   │     │     │ Analytics        │
    │(LangGraph +  │     │     │Service (optional)│
    │ Gemini)      │     │     └──────────────────┘
    │              │     │
    │ - Chat Bot   │     │
    │ - Game AI    │     │
    │ - Content    │     │
    │   Generation │     │
    │ - Sentiment  │     │
    └──────────────┘     │
                         │
                ┌────────▼─────────────────┐
                │   MongoDB Database       │
                ├────────────────────────────┤
                │  Collections:              │
                │  - Users                   │
                │  - GameProfiles            │
                │  - Issues                  │
                │  - Comments                │
                │  - Achievements            │
                │  - Challenges              │
                │  - Points/XP Log           │
                │  - Leaderboards            │
                │  - GameStats               │
                └────────────────────────────┘

                 ┌──────────────────────────┐
                 │ External APIs & Services │
                 ├──────────────────────────┤
                 │ - Google Gemini API      │
                 │ - LangGraph Framework    │
                 │ - Email/Notifications    │
                 │ - Analytics Providers    │
                 └──────────────────────────┘
```

---

## 2. Frontend Architecture (Micro Frontends)

### 2.1 Frontend Modules

#### **auth_frontend** - Authentication Module
- **Technology Stack**: React 19, Vite, Apollo Client, GraphQL
- **Responsibilities**:
  - User registration and login
  - JWT token management
  - Role-based access control (RBAC)
  - Session management
  - Account settings and profile updates
- **Key Components**:
  - `AuthComponents.jsx` - Reusable auth UI components
  - `apolloClient.js` - GraphQL client configuration
  - Responsive authentication flows
- **Styling**: Tailwind CSS / React Bootstrap

#### **issue_frontend** - Issue Reporting & Gamified Tracking Module
- **Technology Stack**: React 19, Vite, Apollo Client, GraphQL, Tailwind CSS
- **Responsibilities**:
  - Gamified issue submission with XP rewards
  - Issue browsing with game-based filtering and sorting
  - Real-time status updates with achievement notifications
  - Comment threads with reputation and voting mechanics
  - File/image uploads with media rewards
  - Category and priority management
  - Challenge tracking and completion
  - Personal game stats and progress dashboard
- **Game Mechanics**:
  - **Issue Reporting Rewards**: XP for creating quality reports
  - **Engagement Points**: Earn points for comments, upvotes, helpful reports
  - **Achievements**: Unlock badges (Reporter, Advocate, Community Champion)
  - **Challenges**: "Report 5 issues this week", "Help resolve 3 issues"
  - **Progress Visualization**: XP bars, level indicators, streak counters
  - **Gamification Elements**:
    - Issue quality scores (affects XP earned)
    - Community impact ratings
    - Resolution time bonuses
    - Streak rewards for consistent participation
- **Key Components**:
  - `IssueReportingGame.jsx` - Gamified submission flow
  - `IssueLeaderboard.jsx` - User rankings and stats
  - `AchievementBadges.jsx` - Progress and achievements
  - `ChallengeTracker.jsx` - Active and completed challenges
  - `PersonalStats.jsx` - User game profile
- **Styling**: Tailwind CSS with game-themed UI elements

#### **analytics_frontend** - Analytics, Administration & Game Management Module
- **Technology Stack**: React 19, Vite, Apollo Client, GraphQL, Tailwind CSS
- **Responsibilities**:
  - Dashboard with KPI metrics and game engagement stats
  - Issue trend analysis and visualization
  - Staff workload management with performance incentives
  - Issue classification insights
  - Sentiment analysis results
  - Game analytics and player engagement metrics
  - User leaderboards and achievement tracking
  - Challenge management and design
  - Gamification effectiveness reports
  - Report generation
  - User and permission management
- **Game Analytics Features**:
  - **Engagement Metrics**: Daily active players, retention rates, challenge completion
  - **Leaderboards**: Global, team-based, monthly, weekly rankings
  - **Achievement Analytics**: Badge unlock rates, popular achievements
  - **Challenge Performance**: Completion rates, difficulty balancing
  - **Economic Analytics**: XP distribution, reward fairness
  - **User Segments**: Casual players, power users, inactive users
  - **Gamification ROI**: Impact on issue reporting quality and volume
  - **Behavior Analytics**: User engagement patterns, drop-off points
- **Key Components**:
  - Interactive charts and graphs (with game metrics)
  - Customizable dashboards
  - Leaderboard management
  - Challenge creation and balancing tools
  - Achievement configuration
  - Player insights and segmentation
  - Export functionality
  - Real-time data updates
- **Styling**: Tailwind CSS with analytics-focused UI

### 2.2 Micro Frontend Integration

```
Main Application Entry Point (index.html)
    ├─ Auth Module (conditional mounting)
    ├─ Issue Module (primary module)
    ├─ Analytics Module (admin-only)
    └─ Shared Components & Utilities
        ├─ Apollo Client (centralized)
        ├─ Auth Context/State
        ├─ Notification System
        └─ Styling Framework
```

**Module Loading Strategy**:
- Dynamic imports based on user role and route
- Lazy loading for non-critical modules
- Shared Apollo Client instance for consistent data management
- Centralized error boundaries and error handling

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
└── package.json
```

**Responsibilities**:
- User authentication (registration, login, logout)
- JWT token generation and validation
- Password hashing with bcrypt
- User profile management
- Role and permission assignment
- OAuth integration (future)

**Technology Stack**:
- Express.js for HTTP server
- Apollo Server for GraphQL
- MongoDB + Mongoose for data persistence
- JWT for authentication
- bcrypt for password security

**GraphQL Mutations/Queries**:
```graphql
# Mutations
mutation Register($email: String!, $password: String!, $name: String!)
mutation Login($email: String!, $password: String!)
mutation UpdateProfile($id: ID!, $name: String, $email: String)
mutation AssignRole($userId: ID!, $role: String!)

# Queries
query GetUser($id: ID!)
query GetCurrentUser
query ListUsers(skip: Int, limit: Int)
query VerifyToken($token: String!)
```

---

#### **Engagement Service** (Port: Configurable via .env)
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
│   ├── Issue.js                 # Issue data model
│   └── Comment.js               # Comment data model
└── package.json
```

**Responsibilities**:
- Issue lifecycle management (CRUD)
- Comment and discussion threads
- Issue categorization and tagging
- Status tracking and updates
- Alert generation and notification
- Permission-based issue access
- Integration with gamification service for XP rewards

**Technology Stack**:
- Express.js for HTTP server
- Apollo Server for GraphQL
- MongoDB + Mongoose for data persistence
- Real-time updates via subscriptions

**GraphQL Operations**:
```graphql
# Issue Mutations
mutation CreateIssue($title: String!, $description: String!, $category: String!)
mutation UpdateIssueStatus($id: ID!, $status: String!)
mutation AddComment($issueId: ID!, $content: String!)
mutation DeleteIssue($id: ID!)

# Issue Queries
query GetIssue($id: ID!)
query ListIssues(category: String, status: String, skip: Int, limit: Int)
query GetIssueComments($issueId: ID!, $skip: Int, $limit: Int)

# Subscriptions
subscription OnIssueStatusChanged($id: ID!)
subscription OnNewComment($issueId: ID!)
```

---

#### **Gamification Service** (Port: Configurable via .env) - NEW
```
gamification-service/
├── gamification-microservice.js  # Service entry point
├── config/
│   ├── config.js                 # Service configuration
│   └── mongoose.js               # MongoDB connection
├── graphql/
│   ├── typeDefs.js              # GraphQL type definitions
│   └── resolvers.js             # GraphQL resolvers
├── models/
│   ├── GameProfile.js           # User game data
│   ├── Achievement.js           # Achievements and badges
│   ├── Challenge.js             # Active challenges
│   ├── PointsLog.js             # XP/Points transaction log
│   └── Leaderboard.js           # Ranking calculations
├── engines/
│   ├── pointsEngine.js          # XP/Points calculation
│   ├── achievementEngine.js     # Achievement unlocking
│   ├── challengeEngine.js       # Challenge management
│   └── leaderboardEngine.js     # Ranking calculations
└── package.json
```

**Responsibilities**:
- Points and XP system management
- Achievement and badge tracking
- Challenge creation and tracking
- Leaderboard calculations and rankings
- Reward distribution logic
- Game economy balancing
- Player progression tracking
- Integration with engagement service for event-based rewards

**Technology Stack**:
- Express.js for HTTP server
- Apollo Server for GraphQL
- MongoDB + Mongoose for data persistence
- Real-time updates via subscriptions

**Key Game Mechanics**:
```javascript
// Points/XP System
- Issue Submission: 10 XP + Quality Bonus (0-20 XP)
- Comment: 5 XP + Helpful Votes (1 XP each)
- Issue Resolution: 50 XP + Speed Bonus
- Challenge Completion: 25-100 XP (varies by challenge)
- Daily Streak Bonus: 5 XP x streak_days
- Upvotes/Helpful: 1 XP per vote (max 10 XP per post)

// Levels
- Level = floor(Total XP / 100)
- Max level: Adjustable (suggested: 50)
- Level-up rewards: Badges, special titles

// Achievement Categories
- Civic Actions (Report X issues, Complete X challenges)
- Community (Help X users, Receive X upvotes)
- Consistency (X-day streak, Monthly contributor)
- Quality (High-rated issues, Popular comments)
- Special Events (Seasonal, time-limited achievements)
```

**GraphQL Operations**:
```graphql
# Game Profile Mutations
mutation AwardXP($userId: ID!, $amount: Int!, $source: String!)
mutation UnlockAchievement($userId: ID!, $achievementId: ID!)
mutation JoinChallenge($userId: ID!, $challengeId: ID!)
mutation CompleteChallenge($userId: ID!, $challengeId: ID!)

# Game Profile Queries
query GetGameProfile($userId: ID!)
query GetLeaderboard($timeRange: String, $limit: Int)
query GetUserAchievements($userId: ID!)
query GetActiveChallenge($userId: ID!)
query GetXPLog($userId: ID!, $skip: Int, $limit: Int)

# Challenge Queries
query ListChallenges(active: Boolean, difficulty: String)
query GetChallenge($id: ID!)

# Subscriptions
subscription OnXPGained($userId: ID!)
subscription OnAchievementUnlocked($userId: ID!)
subscription OnLevelUp($userId: ID!)
subscription OnLeaderboardChange
```

---

#### **AI Service** (New)
```
ai-service/
├── index.js                      # Service entry point
├── config/
│   ├── config.js                # LangGraph & Gemini setup
│   └── agents.js                # Agent definitions
├── agents/
│   ├── civic-chatbot.js         # Main agentic chatbot
│   ├── game-advisor.js          # Game progression advisor
│   ├── summarizer.js            # Summarization pipeline
│   ├── classifier.js            # Classification & triage
│   ├── trend-detector.js        # Trend analysis
│   └── sentiment-analyzer.js    # Sentiment analysis
├── tools/
│   ├── issue-query-tool.js      # Query issues from DB
│   ├── game-stats-tool.js       # Retrieve player game stats
│   ├── challenge-recommendation-tool.js # Suggest challenges
│   ├── trend-analysis-tool.js   # Analyze patterns
│   └── notification-tool.js     # Send notifications
├── prompts/
│   ├── system-prompts.js        # System prompts
│   ├── game-advisor-prompts.js  # Game-related prompts
│   └── civic-focus.js           # Civic focus configuration
└── package.json
```

**Responsibilities**:
- Agentic chatbot for Q&A on issues
- Game progression advisor for player engagement
- AI-powered issue summarization
- Automated classification and triage
- Trend detection and pattern analysis
- Sentiment analysis of comments
- Challenge recommendation engine
- Gamification feedback and personalization
- Specialized capabilities (e.g., safety alerts, accessibility queries)

**Technology Stack**:
- LangGraph for agentic workflows
- Google Gemini API (multimodal AI)
- MongoDB for storing AI outputs
- Python (optional) for ML-intensive tasks

**Key Features**:
```
Chatbot Capabilities:
├─ Basic Q&A
│  ├─ Open issues count and details
│  ├─ Resolved issues trends
│  ├─ Issue status queries
│  └─ General civic information
├─ Game-Related Features
│  ├─ Player progression advice
│  ├─ Challenge recommendations based on play style
│  ├─ Achievement hints and guides
│  ├─ Leaderboard insights
│  └─ Game strategy and tips
├─ Specialized Features (civic-focus dependent)
│  ├─ Safety alerts and notifications
│  ├─ Accessibility queries and recommendations
│  ├─ Sustainability tips and suggestions
│  └─ Volunteer matching and coordination
└─ Advanced Features
   ├─ AI Summarization
   ├─ Classification & Triage
   ├─ Trend Detection
   ├─ Sentiment Analysis
   └─ Dynamic Challenge Generation
```

**Game Advisor Agent**:
```
Player Query: "I want to improve my rank"
  ↓
[Analyze Game Profile] → Current level, XP, achievements
  ↓
[Recommend Path] → High-value challenges, skill gaps
  ↓
[Personalized Advice] → "Focus on accessibility issues for 
                         quick XP; you're close to the 
                         Community Advocate badge"
  ↓
Player Gets Actionable Guidance
```

---

### 3.2 Inter-Service Communication

**API Gateway Pattern** (Federation):
```
Client
  ↓
Apollo Server (Federation)
  ├─ Auth Service (Apollo Subgraph)
  ├─ Engagement Service (Apollo Subgraph)
  └─ AI Service (Apollo Subgraph)
  ↓
MongoDB
```

**Communication Methods**:
1. **GraphQL Federation** - Primary (Subgraph composition)
2. **REST API** - Secondary (for non-GraphQL clients)
3. **Message Queue** (Optional) - For async operations

**Error Handling**:
- Centralized error codes
- Consistent error response format
- Retry mechanisms for transient failures
- Circuit breaker pattern for service degradation

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
  role: Enum ['citizen', 'staff', 'admin'],
  permissions: [String],
  avatar: String (URL),
  createdAt: Date,
  updatedAt: Date,
  lastLogin: Date,
  isActive: Boolean,
  // Game-related fields
  gameProfileId: ObjectId (reference to GameProfile)
}
```

#### **GameProfile Collection** (New)
```javascript
{
  _id: ObjectId,
  userId: ObjectId (User reference),
  totalXP: Number (total accumulated XP),
  currentLevel: Number,
  currentXPInLevel: Number (0 to levelThreshold),
  title: String (e.g., "Civic Champion", "Issue Reporter"),
  unlockedAchievements: [ObjectId], // Achievement references
  currentStreak: Number (days),
  longestStreak: Number (days),
  totalIssuesReported: Number,
  totalCommentsPosted: Number,
  totalUpvotesReceived: Number,
  issueResolutionContribution: Number,
  joinedChallenges: [ObjectId], // Challenge references
  completedChallenges: [ObjectId],
  leaderboardRank: Number,
  leaderboardTier: Enum ['bronze', 'silver', 'gold', 'platinum'],
  gameStats: {
    favoriteCategory: String,
    mostActiveDay: String,
    engagementScore: Number,
    trustScore: Number
  },
  createdAt: Date,
  updatedAt: Date,
  lastActivityDate: Date
}
```

#### **Achievement Collection** (New)
```javascript
{
  _id: ObjectId,
  name: String,
  description: String,
  category: Enum ['civic', 'community', 'consistency', 'quality', 'special'],
  badge: String (emoji or icon URL),
  rarity: Enum ['common', 'uncommon', 'rare', 'legendary'],
  xpReward: Number,
  unlockCondition: {
    type: Enum ['count', 'streak', 'score', 'special'],
    target: Number,
    metric: String
  },
  icon: String (URL),
  displayOrder: Number,
  isHidden: Boolean (before unlock),
  createdAt: Date,
  updatedAt: Date,
  // Examples:
  // - First Issue Reporter: report 1 issue
  // - Civic Advocate: report 10 issues
  // - Community Champion: 100 helpful votes
  // - 7-Day Streak: 7 consecutive days of activity
}
```

#### **Challenge Collection** (New)
```javascript
{
  _id: ObjectId,
  title: String,
  description: String,
  category: Enum ['accessibility', 'infrastructure', 'safety', 'sustainability'],
  difficulty: Enum ['easy', 'medium', 'hard', 'epic'],
  xpReward: Number,
  duration: Number (days),
  startDate: Date,
  endDate: Date,
  status: Enum ['active', 'upcoming', 'completed', 'archived'],
  objective: String,
  progressMetric: {
    type: Enum ['count', 'score', 'completion'],
    target: Number
  },
  successCriteria: String,
  participants: [ObjectId], // User references
  completedBy: [ObjectId],
  bonusRewards: [{
    condition: String,
    xpBonus: Number
  }],
  createdAt: Date,
  updatedAt: Date,
  // Examples:
  // - "Report 5 Accessibility Issues This Week"
  // - "Help Resolve 3 Civic Issues"
  // - "Comment Helpfully on 10 Issues"
}
```

#### **PointsLog Collection** (New)
```javascript
{
  _id: ObjectId,
  userId: ObjectId (User reference),
  xpAmount: Number (can be positive or negative),
  source: Enum ['issue_report', 'comment', 'helpful_vote', 'challenge_complete', 
               'achievement_unlock', 'streak_bonus', 'quality_bonus', 'admin_award'],
  sourceId: ObjectId (reference to Issue, Comment, Challenge, etc.),
  reason: String,
  before: {
    level: Number,
    xpInLevel: Number
  },
  after: {
    level: Number,
    xpInLevel: Number
  },
  createdAt: Date
}
```

#### **Leaderboard Collection** (New)
```javascript
{
  _id: ObjectId,
  timeRange: Enum ['all_time', 'monthly', 'weekly', 'daily'],
  period: String (e.g., "2025-12", "2025-W48"),
  rankings: [{
    rank: Number,
    userId: ObjectId,
    username: String,
    xp: Number,
    level: Number,
    streak: Number,
    timestamp: Date
  }],
  updatedAt: Date,
  // Recalculated periodically (batch job)
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
    longitude: Number
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
  aiSummary: String,
  aiClassification: String,
  sentiment: {
    score: Number (-1 to 1),
    label: String ['positive', 'neutral', 'negative']
  },
  // Game-related fields
  reportQualityScore: Number (0-100), // impacts XP rewards
  communityHelpfulVotes: Number,
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
  attachments: [String],
  sentiment: {
    score: Number,
    label: String
  },
  reactions: Map<String, Int>, // e.g., {'👍': 5, '❤️': 2}
  helpfulVotes: Number, // game-related
  isResolved: Boolean, // marked helpful for resolution
  createdAt: Date,
  updatedAt: Date
}
```

#### **AI Output Collection** (Optional)
```javascript
{
  _id: ObjectId,
  type: Enum ['summary', 'classification', 'trend', 'sentiment', 'game_advice'],
  sourceId: ObjectId (Issue or Comment reference),
  output: {
    text: String,
    metadata: Object
  },
  confidence: Number (0-1),
  model: String (e.g., 'gemini-1.5-pro'),
  createdAt: Date
}
```

---

## 5. AI Integration & Game Design Details

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
1. **Chatbot**: Conversational Q&A on civic issues and game mechanics
2. **Game Advisor**: Personalized progression and achievement advice
3. **Challenge Generation**: Dynamically create themed challenges
4. **Summarization**: Auto-generate concise issue summaries
5. **Classification**: Categorize new reports with context awareness
6. **Trend Detection**: Identify similar issues and emerging patterns
7. **Sentiment Analysis**: Analyze resident and staff feedback
8. **Content Generation**: Create engaging challenge descriptions and achievement hints

---

### 5.2 Agentic Chatbot (LangGraph) with Game Features

**Extended Architecture**:
```
User Input
  ↓
[Intent Recognition] → Determine action (Q&A, game advice, search, analysis, etc.)
  ↓
[Tool Selection] → Choose appropriate tools
  ├─ issue-query-tool (fetch from database)
  ├─ game-stats-tool (retrieve player game data)
  ├─ challenge-recommendation-tool (suggest challenges)
  ├─ trend-analysis-tool (analyze patterns)
  ├─ notification-tool (send alerts)
  └─ gemini-inference (generate responses)
  ↓
[Agent Loop] → Execute tools and refine responses
  ↓
[Response Generation] → Format and deliver answer
  ↓
User Response
```

**LangGraph Workflow Example**:
```python
from langgraph.graph import StateGraph
from langchain_google_genai import ChatGoogleGenerativeAI

# Define agent state
class AgentState(TypedDict):
    input: str
    userId: str
    context: Dict
    intermediate_steps: List[Tuple[AgentAction, str]]
    output: str
    gameRecommendations: Optional[List]

# Build graph
graph = StateGraph(AgentState)
graph.add_node("agent", agent_node)
graph.add_node("tools", tool_node)
graph.add_node("game_advisor", game_advisor_node)
graph.add_edge("agent", "tools")
graph.add_edge("tools", "agent")
graph.add_conditional_edge(
    "agent",
    lambda x: "game_advisor" if "game" in x["input"].lower() else "end"
)

# Compile and run
app = graph.compile()
result = app.invoke({
    "input": user_query,
    "userId": current_user_id
})
```

**Civic Focus Example: Accessibility**
- **Specialized Capability**: Accessibility queries and recommendations
- **Game Integration**: Accessibility challenges, accessibility advocate badges
- **Sample Bot Interactions**:
  - "What accessibility issues are reported in downtown?"
  - "How many accessibility improvements have been completed?"
  - "Can you recommend accessibility-friendly routes in my area?"
  - "I'm working on accessibility issues - what challenges are available?"
  - "How can I earn the 'Accessibility Advocate' badge?"

---

### 5.3 Game Economy Design

#### **XP/Points System**
```
Base Rewards:
├─ Issue Creation
│  ├─ Basic Report: 10 XP
│  ├─ Quality Multiplier: 1.0x - 2.0x (based on detail, clarity)
│  ├─ Resolved Bonus: 50 XP (awarded when issue is resolved)
│  └─ Max per Issue: 60 XP
├─ Community Engagement
│  ├─ Comment: 5 XP
│  ├─ Helpful Vote Received: 1 XP (max 10 per post)
│  ├─ Issue Marked as Helpful: 25 XP
│  └─ Monthly Top Contributor: 100 XP
├─ Streaks
│  ├─ 7-Day Activity Streak: +5 XP per day
│  ├─ 30-Day Streak: +10 XP per day
│  ├─ Annual Recognition: 1000 XP
│  └─ Streak Reset: 48 hours of inactivity
└─ Challenges
   ├─ Easy: 25 XP
   ├─ Medium: 50 XP
   ├─ Hard: 100 XP
   └─ Epic: 200+ XP + special rewards
```

#### **Level Progression**
```
Level Calculation:
  level = floor(totalXP / 100)
  xpToNextLevel = 100 - (totalXP % 100)
  
Level Milestones (example):
  Level 1-5: Rookie (green)
  Level 6-15: Contributor (blue)
  Level 16-30: Advocate (purple)
  Level 31-50: Champion (gold)
  Level 50+: Legend (platinum)
  
Level-Up Rewards:
  ├─ Unlock new challenges
  ├─ New title/badge eligibility
  ├─ Profile customization options
  ├─ Leaderboard visibility
  └─ Special event invitations
```

#### **Balancing Mechanics**
```
Fairness Controls:
├─ XP Decay: Prevent inflation over time
├─ Activity Caps: Daily max rewards to prevent grinding
├─ Quality Thresholds: Require minimum quality for bonus XP
├─ Report Moderation: Reduce XP for poor-quality submissions
└─ Voting Weight: Established users' votes worth more
```

---

### 5.4 Optional AI-Enhanced Game Features

#### **Dynamic Challenge Generation**
```
Game Analytics Feed
  ↓
[Identify Trends] → Hot issues, underreported categories
  ↓
[Gemini Design] → Create themed challenges around trends
  ↓
[A/B Testing] → Test challenge appeal and difficulty
  ↓
Daily/Weekly Challenges
```

**Example Challenge**:
"Accessibility Spotlight (Medium) - Report 3 accessibility issues 
in transportation. Reward: 50 XP + 'Transit Advocate' badge progression"

#### **AI-Powered Achievement Hints**
```
Player Approaching Achievement
  ↓
[Gemini Hint Generation] → Create non-spoiler guidance
  ↓
[Contextual Help] → "You're close to the 'Community Helper' badge.
                      Keep voting helpfully on comments!"
  ↓
Motivational Nudge
```

#### **Personalized Progression Advice**
```
Game Profile Analysis
  ├─ Play Style Detection (explorer, achiever, socializer)
  ├─ Strength/Weakness Identification
  └─ Optimal Path Suggestion
  ↓
[Gemini Analysis] → "You excel at quality issues. Try reporting 
                     in the underrepresented sustainability category
                     for accelerated leveling!"
  ↓
Player Gets Custom Roadmap
```

---

## 6. Civic Focus Declaration & Game Integration

**Chosen Civic Focus: Accessibility Issues**

**Rationale**:
- Critical for inclusive community engagement
- Clear, measurable outcomes
- Diverse specialized queries (accessibility queries, recommendations)
- Strong integration with AI and game mechanics
- Enables progressive challenge design

**Specialized Chatbot Capabilities**:
1. **Accessibility Queries**: "What accessibility barriers are reported near me?"
2. **Recommendations**: "Can you suggest accessible routes/services?"
3. **Trend Analysis**: Track improvement/decline in accessibility
4. **Sentiment Tracking**: Monitor community sentiment on accessibility
5. **Game-Enhanced Features**:
   - Challenge recommendations for accessibility advocacy
   - Personalized achievement paths for inclusive actions
   - Community challenges around accessibility improvements
   - Leaderboards for "Accessibility Champions"

**Game-Themed Achievements for Accessibility Focus**:
```
Badge Name              Unlock Condition              XP Reward
─────────────────────────────────────────────────────────────
First Accessibility    Report 1 accessibility issue    10 XP
Report

Accessibility          Report 10 accessibility        50 XP
Advocate               issues

Accessibility          Help resolve 5 accessibility   100 XP
Champion               issues

Universal Designer     Receive 50 helpful votes on     200 XP
                       accessibility feedback

Accessibility Hero     Maintain 14-day streak while   150 XP
                       reporting accessibility issues
```

**Game Challenges for Accessibility Focus**:
```
Challenge Title                Difficulty   XP   Duration
──────────────────────────────────────────────────────────
Accessibility Awareness         Easy        25    1 week
Report 3 accessibility issues in your area

Barrier Elimination             Medium      50    1 week
Help resolve 2 accessibility issues

Community Accessibility Push    Hard        100   1 month
Report 15 accessibility issues across categories

Accessibility Excellence        Epic        200   3 months
Achieve 14-day streak + 100 helpful votes
```

**Requirement Alignment**: 100% (Exceeds 70% threshold)
- 70% Core Requirements: ✓ All met
- 30% Customization: Game mechanics (10%), Accessibility focus (10%), 
                      Enhanced AI features (10%)

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
| AI/LLM | Google Gemini API | 1.5 |
| Agentic Framework | LangGraph | Latest |
| Async Jobs | Node.js Worker Threads / Bull | - |

### Frontend
| Component | Technology | Version |
|-----------|-----------|---------|
| Framework | React | 19+ |
| Build Tool | Vite | 7+ |
| GraphQL Client | Apollo Client | 4+ |
| Styling | Tailwind CSS | 3+ |
| State Management | React Context API | - |
| Forms | React Hook Form | - |
| Testing | Vitest / React Testing Library | - |

---

## 8. Deployment Architecture

### 8.1 Container Strategy
```
docker-compose.yml
├─ auth-service (Container)
├─ engagement-service (Container)
├─ ai-service (Container)
├─ mongodb (Container)
├─ auth_frontend (Container/Static)
├─ issue_frontend (Container/Static)
└─ analytics_frontend (Container/Static)
```

### 8.2 Environment Configuration
```
.env files (per service):
├─ MONGODB_URI
├─ GEMINI_API_KEY
├─ JWT_SECRET
├─ CORS_ORIGIN
├─ SERVICE_PORT
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
└─ Environment variables from secrets manager
```

---

## 9. Security Architecture

### 9.1 Authentication & Authorization
- **JWT-based Authentication**: Stateless, scalable
- **Role-Based Access Control (RBAC)**:
  - `citizen`: Submit issues, comment, view public data
  - `staff`: Manage assigned issues, view analytics
  - `admin`: Full system access, user management, system configuration
- **Token Expiration**: 24 hours (configurable)
- **Refresh Tokens**: Secure, httpOnly cookies

### 9.2 Data Protection
- **Password Hashing**: bcrypt (10+ salt rounds)
- **CORS Policy**: Restrict cross-origin requests
- **Input Validation**: Sanitize all user inputs
- **Rate Limiting**: Prevent brute force and DDoS

### 9.3 API Security
- **GraphQL**: Rate limiting, query complexity analysis
- **HTTPS**: TLS 1.3 in production
- **API Keys**: For external service integrations
- **Audit Logging**: Track all sensitive operations

---

## 10. Performance Optimization & Game Mechanics

### 10.1 Frontend
- **Code Splitting**: Lazy load routes, modules, and game components
- **Image Optimization**: WebP with fallbacks for achievements, badges
- **Caching**: Service Workers, HTTP cache headers, leaderboard caching
- **Game State Management**: Efficient XP/level calculations on client
- **Bundle Analysis**: Regular webpack analysis
- **Animation Optimization**: Hardware-accelerated CSS for level-ups, achievements

### 10.2 Backend
- **Database Indexing**: Index frequently queried fields (userId, status, XP)
- **Query Optimization**: Use aggregation pipelines for leaderboard calculations
- **Caching**: Redis for leaderboards, player stats, challenge lists
- **Connection Pooling**: MongoDB connection optimization
- **Batch Operations**: Batch XP awards, leaderboard updates

### 10.3 Game-Specific Optimizations
```
Leaderboard Recalculation:
├─ Scheduled jobs (hourly, daily, monthly) instead of real-time
├─ Cached leaderboard snapshots
└─ Incremental updates for active users

XP Transactions:
├─ Batch multiple XP updates
├─ Async processing for non-critical rewards
└─ Deferred achievement checking

Challenge Completion:
├─ Cached challenge progress
├─ Event-driven notifications instead of polling
└─ Bulk reward distribution
```

### 10.4 Monitoring
- **Performance Metrics**: APM tools (e.g., New Relic, DataDog)
- **Game Metrics**: Engagement rate, progression rate, daily active users
- **Error Tracking**: Sentry integration for game service errors
- **Log Aggregation**: ELK Stack or CloudWatch for game events

---

## 11. Development Timeline & Milestones

| Phase | Timeline | Deliverables |
|-------|----------|--------------|
| **Phase 1** | Week 1-2 | Auth service finalization, user model with game profile references |
| **Phase 2** | Week 2-3 | Engagement service & issue management, comment systems |
| **Phase 3** | Week 3-4 | Gamification service setup (XP, levels, achievements) |
| **Phase 4** | Week 4-5 | Challenge system and leaderboard implementation |
| **Phase 5** | Week 5-6 | Frontend modules (auth, game/issue, analytics with game stats) |
| **Phase 6** | Week 6-7 | AI service setup, Gemini integration, game advisor agent |
| **Phase 7** | Week 7-8 | Agentic chatbot development, game-specific AI features |
| **Phase 8** | Week 8-9 | Optional AI features (dynamic challenges, achievement hints, trends) |
| **Phase 9** | Week 9-10 | Integration testing, game balance testing, performance optimization |
| **Phase 10** | Week 10-11 | Deployment, documentation, gameplay guidelines |
| **Phase 11** | Week 11+ | Launch, monitoring, iterative balance adjustments |

---

## 12. Testing Strategy

### 12.1 Frontend Testing
```
Unit Tests → Component-level tests (Vitest)
Integration Tests → API integration (React Testing Library)
E2E Tests → User workflows (Cypress/Playwright)
Accessibility Tests → WCAG compliance (axe-core)
Game Testing → XP calculations, achievement logic, leaderboards
```

**Game-Specific Tests**:
```javascript
// XP Calculation Tests
- Award XP for issue submission
- Apply quality multipliers correctly
- Handle streak bonuses
- Level-up triggers new achievements

// Achievement Tests
- Unlock conditions evaluated correctly
- Only unlock once per achievement
- Progress tracked accurately
- Display in correct order

// Leaderboard Tests
- Rankings calculated correctly
- Ties handled properly
- Real-time updates (if applicable)
- Historical records maintained

// Challenge Tests
- Completion detection accurate
- Progress calculations correct
- Bonus rewards awarded properly
- Time windows respected
```

### 12.2 Backend Testing
```
Unit Tests → Service logic (Jest)
Integration Tests → GraphQL resolvers (Apollo Server testing)
Database Tests → Mongoose models, game collections
API Tests → REST/GraphQL endpoints
Performance Tests → Load testing (k6, Artillery)
Game Balance Tests → XP economy, progression curves, exploit detection
```

**Game Balance Testing**:
```javascript
// Economy Tests
- XP distribution fairness (compare player types)
- Level progression pacing (time to level-up)
- Achievement difficulty distribution
- Challenge reward appropriateness

// Exploit Detection
- Multiple XP award prevention
- Quality threshold enforcement
- Bot/fake report detection
- Streaking abuse prevention

// Data Integrity
- XP transaction logging accuracy
- Leaderboard consistency
- Achievement unlock atomicity
- Level-up state transitions
```

### 12.3 User Acceptance Testing (UAT)
```
Beta Testing → Select player cohort tests game progression
Balance Testing → Verify XP economy, challenge difficulty
Engagement Testing → Monitor retention, daily active users
Competitive Testing → Leaderboard fairness, no exploits detected
```

---

## 13. Documentation Requirements

- **API Documentation**: GraphQL schema + Postman collections
- **Component Library**: Storybook for UI components
- **Developer Guide**: Setup, deployment, contribution guidelines
- **Architectural Decision Records (ADRs)**: Rationale for key decisions
- **Civic Focus Documentation**: Accessibility focus details and capabilities

---

## 14. Risk Mitigation

| Risk | Mitigation |
|------|-----------|
| Gemini API rate limits | Implement caching, queue management, fallback responses |
| Game economy imbalance | Continuous monitoring, rapid iteration cycles, player feedback |
| XP inflation over time | Built-in decay mechanisms, seasonal reset options |
| Exploitation/cheating | Transaction logging, anomaly detection, review processes |
| Low engagement/retention | A/B testing challenges, dynamic difficulty, personalization |
| Data privacy concerns | GDPR compliance, encrypted storage, anonymization |
| Scalability issues | Horizontal scaling, load balancing, database sharding |
| Integration complexity | Comprehensive testing, documentation, modular design |
| AI accuracy issues | Human review process, feedback loops, fallback strategies |
| Leaderboard staleness | Regular recalculation jobs, cache invalidation, real-time updates for active tier |

---

## 15. Future Enhancements

- **Mobile Apps**: React Native for iOS/Android with offline game progress
- **Real-time Collaboration**: WebSockets for live leaderboard updates
- **Advanced Analytics**: ML models for predictive player engagement
- **Multi-language Support**: i18n for international users
- **Social Features**: Teams, guilds, co-op challenges, tournaments
- **Seasonal Events**: Limited-time challenges, exclusive rewards, story-driven campaigns
- **Integration with City Systems**: API connections to existing city databases
- **Volunteer Management**: Full volunteer coordination with team-based achievements
- **Marketplace**: Cosmetic rewards, special titles, profile customizations
- **Streaming Integration**: Support for twitch/youtube streaming of challenges
- **Physical World Integration**: Location-based challenges, AR elements
- **Cross-platform Progression**: Sync progress across web and mobile

---

## 16. Game Mechanics Deep Dive

### 16.1 Progression System

**Level Design Goals**:
- **Early Game (Levels 1-10)**: Quick progression, encourages first-time behaviors
- **Mid Game (Levels 11-30)**: Steady challenge, introduces specialization
- **Late Game (Levels 31-50)**: Mastery phase, diminishing XP returns by design
- **Prestige (Level 50+)**: Optional: reset with multipliers or seasonal ranks

**Progression Pacing**:
```
Level    XP Required    Est. Time        Key Milestone
────────────────────────────────────────────────────────
1        0              0 days           Welcome
5        500            1 week           Contributor
10       1000           2-3 weeks        Community Member
20       2000           1-2 months       Advocate
30       3000           2-3 months       Champion
40       4000           4-6 months       Legend
50       5000           6-12 months      Master Citizen
```

### 16.2 Engagement Loops

**Daily Loop**:
```
Log In → View Daily Challenge → Complete Activity → Earn XP 
→ Check Leaderboard → Logout

Reward Triggers:
- First login of day: +5 bonus XP
- Complete daily challenge: +25-50 XP
- Daily streak milestone: +streak_bonus
```

**Weekly Loop**:
```
Check Weekly Challenge → Accumulate Progress → Reach Milestone 
→ Unlock Weekly Reward → New Challenge Arrives

Reward Triggers:
- Weekly challenge complete: +50-100 XP
- Weekly top contributor: +200 XP
- First week with 4+ daily logins: Consistency badge
```

**Monthly Loop**:
```
Seasonal Achievement Progress → Leaderboard Race 
→ Monthly Reset → Recognition → Prestige Options

Reward Triggers:
- Top 10 leaderboard finish: +500 XP + exclusive badge
- Monthly challenge set complete: +250 XP
- Seasonal event participation: Themed rewards
```

### 16.3 Player Segments & Motivations

```
Casual Players (30% population):
├─ Motivation: Help community, occasional engagement
├─ Challenges: Easy, low-frequency
├─ Progression: Slower, more milestone-focused
└─ Retention: Monthly events, alt-play options

Core Players (50% population):
├─ Motivation: Competition, mastery, progression
├─ Challenges: Medium difficulty, varied types
├─ Progression: Steady, predictable
└─ Retention: Leaderboards, seasonal resets, new content

Hardcore Players (20% population):
├─ Motivation: Dominance, speedrunning, perfection
├─ Challenges: Hard/Epic, intricate mechanics
├─ Progression: Fast-paced, optimization-driven
└─ Retention: Leaderboard competition, content speed
```

### 16.4 Balancing Knobs (Tunable Parameters)

```javascript
GAME_CONFIG = {
  // XP Multipliers
  BASE_ISSUE_XP: 10,
  QUALITY_MULTIPLIER_MIN: 1.0,
  QUALITY_MULTIPLIER_MAX: 2.0,
  HELPFUL_VOTE_XP: 1,
  HELPFUL_VOTE_CAP_PER_POST: 10,
  
  // Levels
  XP_PER_LEVEL: 100,
  MAX_LEVEL: 50,
  
  // Streaks
  STREAK_BONUS_XP_PER_DAY: 5,
  STREAK_EXPIRY_HOURS: 48,
  
  // Challenges
  EASY_CHALLENGE_XP: 25,
  MEDIUM_CHALLENGE_XP: 50,
  HARD_CHALLENGE_XP: 100,
  EPIC_CHALLENGE_XP: 200,
  
  // Achievements
  ACHIEVEMENT_UNLOCK_BONUS: 0, // already included in XP source
  
  // Leaderboard
  LEADERBOARD_UPDATE_FREQUENCY: 'hourly',
  LEADERBOARD_DISPLAY_TOP: 100,
  
  // Anti-Gaming Measures
  DAILY_MAX_XP: 500, // prevent grinding
  MIN_REPORT_QUALITY_FOR_BONUS: 70, // quality threshold
  UPVOTE_WEIGHT_BY_LEVEL: { /* multiplier by reporter level */ }
}
```

### 16.5 Achievement Design Principles

**Achievement Categories**:
```
Civic Actions (Community Goals):
└─ Focus on civic contribution quantity and quality
   - "Report 1, 5, 10, 50 issues"
   - "Help resolve 1, 5, 10 issues"
   - "Write helpful comments on 10 different issues"

Community (Social Goals):
└─ Focus on reputation and influence
   - "Receive 10, 50, 100 helpful votes"
   - "Reach 10K leaderboard ranking"
   - "Get featured comment 5 times"

Consistency (Behavioral Goals):
└─ Focus on regular engagement
   - "3, 7, 14-day streaks"
   - "Log in 30 days this month"
   - "Monthly top contributor (Top 50)"

Quality (Excellence Goals):
└─ Focus on quality contributions
   - "High-rated issues average 85%+"
   - "Popular achievement badge"
   - "Expert in category (100+ issues in one category)"

Special (Limited-Time Goals):
└─ Focus on engagement and events
   - "Seasonal achievement"
   - "Accessibility Month hero"
   - "Tournament winner"
```

**Achievement Balancing**:
```
Common (40% of population):
├─ Easily achievable (70%+ will unlock)
├─ Early progression (first 5 levels)
└─ Example: "First Issue Reporter" (unlock at first issue)

Uncommon (25% of population):
├─ Challenging but attainable (25-50% will unlock)
├─ Mid progression (levels 10-25)
└─ Example: "Civic Advocate" (50 helpful votes)

Rare (10% of population):
├─ Difficult to achieve (5-10% will unlock)
├─ Late progression (levels 25-40)
└─ Example: "30-Day Streak Master"

Legendary (<5% of population):
├─ Very challenging (< 5% will unlock)
├─ End-game progression (levels 40+)
└─ Example: "Accessibility Champion" (100+ accessibility issues)
```

---

## Appendix A: API Examples

### Auth Service Mutation
```graphql
mutation LoginUser {
  login(email: "user@example.com", password: "secure123") {
    token
    user {
      id
      name
      role
      email
      gameProfileId
    }
  }
}
```

### Gamification Service Queries
```graphql
# Get player profile with game stats
query GetPlayerProfile($userId: ID!) {
  gameProfile(userId: $userId) {
    totalXP
    currentLevel
    currentXPInLevel
    title
    unlockedAchievements {
      id
      name
      badge
      unlockedDate
    }
    currentStreak
    leaderboardRank
    gameStats {
      favoriteCategory
      engagementScore
      trustScore
    }
  }
}

# Get leaderboard
query GetLeaderboard($timeRange: String!, $limit: Int) {
  leaderboard(timeRange: $timeRange, limit: $limit) {
    rankings {
      rank
      userId
      username
      xp
      level
    }
  }
}

# Get active challenges for user
query GetActiveChallenges($userId: ID!) {
  activeChallenges(userId: $userId) {
    id
    title
    description
    difficulty
    xpReward
    progressMetric {
      current
      target
    }
    timeRemaining
  }
}
```

### Gamification Service Mutations
```graphql
# Award XP for action
mutation AwardXP($userId: ID!, $amount: Int!, $source: String!) {
  awardXP(userId: $userId, amount: $amount, source: $source) {
    newTotalXP
    leveledUp
    newLevel
    newUnlockedAchievements {
      id
      name
      badge
    }
  }
}

# Complete challenge
mutation CompleteChallenge($userId: ID!, $challengeId: ID!) {
  completeChallenge(userId: $userId, challengeId: $challengeId) {
    success
    xpAwarded
    newAchievements {
      id
      name
    }
    challengeReward
  }
}
```

### Engagement Service with Gamification
```graphql
query GetIssuesWithGameData {
  issues(category: "accessibility", status: "open") {
    id
    title
    description
    aiClassification
    reportQualityScore
    sentiment {
      score
      label
    }
    reportedBy {
      id
      name
      gameProfile {
        currentLevel
        title
      }
    }
    comments(limit: 5) {
      content
      authorId
      helpfulVotes
      sentiment {
        score
      }
    }
  }
}
```

### AI Service - Game Advisor
```graphql
query GetGameAdvice($userId: ID!) {
  gameAdvice(userId: $userId) {
    progressStatus
    recommendedChallenges {
      id
      title
      reasonForRecommendation
    }
    achievementHints {
      achievementId
      hint
      progressToward
    }
    leaderboardInsight {
      currentRank
      pointsToNextRank
      estimatedTimeToNextLevel
    }
    personalizedTips
  }
}
```

### AI Service - Civic Chatbot (Game-Aware)
```graphql
query ChatBot($message: String!, $userId: ID!) {
  chatBot(message: $message, userId: $userId) {
    response
    gameContext {
      relevantChallenges {
        id
        title
      }
      potentialAchievements {
        id
        name
      }
    }
    sources {
      issueReferences
      trendData
    }
  }
}
```

---

## Appendix B: Environment Variables Reference

```env
# Auth Service
AUTH_SERVICE_PORT=4001
JWT_SECRET=your-secret-key-here
JWT_EXPIRATION=24h
BCRYPT_ROUNDS=10

# Engagement Service
ENGAGEMENT_SERVICE_PORT=4002
ISSUE_ATTACHMENT_MAX_SIZE=10000000

# Gamification Service
GAMIFICATION_SERVICE_PORT=4003
BASE_ISSUE_XP=10
QUALITY_MULTIPLIER_MIN=1.0
QUALITY_MULTIPLIER_MAX=2.0
HELPFUL_VOTE_XP=1
XP_PER_LEVEL=100
MAX_LEVEL=50
DAILY_MAX_XP=500
STREAK_BONUS_XP=5
STREAK_EXPIRY_HOURS=48
LEADERBOARD_UPDATE_FREQUENCY=hourly

# AI Service
AI_SERVICE_PORT=4004
GEMINI_API_KEY=your-gemini-api-key
GEMINI_MODEL=gemini-1.5-pro
LANGRAPH_TIMEOUT=60

# Database
MONGODB_URI=mongodb://localhost:27017/civic-platform
MONGODB_OPTIONS_RETRYWRITE=true

# CORS & Security
CORS_ORIGIN=http://localhost:5173,http://localhost:5174,http://localhost:5175
CORS_CREDENTIALS=true
NODE_ENV=development
LOG_LEVEL=debug

# Game Configuration
GAME_SEASON_START=2025-01-01
GAME_SEASON_LENGTH_DAYS=90
ENABLE_SEASONAL_RESET=true
ENABLE_LEADERBOARD_TIERS=true
ACHIEVEMENT_RARITY_DISTRIBUTION=0.4,0.25,0.1,0.05 # common,uncommon,rare,legendary
```

---

## Document Version & History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2025-12-07 | Architecture Team | Initial comprehensive architecture document |

---

**Document Approved By**: Project Lead  
**Last Updated**: 2025-12-07  
**Status**: Active
