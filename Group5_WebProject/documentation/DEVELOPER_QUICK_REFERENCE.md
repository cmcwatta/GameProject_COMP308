# Quick Reference - Service Responsibilities

## 🎯 Service Division at a Glance

```
┌──────────────────────────────────────────────────────────┐
│  ISSUE SERVICE (Port 4003)                              │
│  Store & Update Issues | Track Status | Send Alerts     │
│  - CreateIssue (geolocation + photos)                   │
│  - UpdateIssueStatus, Priority, Assignment              │
│  - File uploads, AI classification                      │
│  - Urgent alert generation                              │
└──────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────┐
│  ENGAGEMENT SERVICE (Port 4004)                         │
│  Comments | Upvotes | Volunteer Matching               │
│  - AddComment, GetComments                              │
│  - UpvoteIssue, MarkHelpful                             │
│  - VolunteerMatch, Community Sentiment                  │
└──────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────┐
│  AI SERVICE (Port 4002)                                │
│  Chatbot | Classification | Trends | Accessibility      │
│  - ChatBot Q&A                                          │
│  - ClassifyIssue, Summarize, DetectTrends             │
│  - AccessibilityAdvisor (civic focus)                  │
└──────────────────────────────────────────────────────────┘
```

---

## 👤 User Role → Service Mapping

### Resident
```
Issue Submission
  └─> Issue Service (CreateIssue)
  └─> AI Service (ClassifyIssue)
  └─> Notification Service (SendAlert)

Engagement
  └─> Engagement Service (AddComment, UpvoteIssue)
  
AI Assistance
  └─> AI Service (ChatBot, Accessibility queries)
```

### Municipal Staff
```
Issue Management
  └─> Issue Service (UpdateStatus, Priority, Assign)
  └─> AI Service (ClassifyIssue - recommendations)

Analytics
  └─> AI Service (GetTrends, Analytics)
  └─> Issue Service (ListIssues with filters)
```

### Community Advocate
```
Engagement
  └─> Engagement Service (AddComment, UpvoteIssue)
  └─> Engagement Service (VolunteerMatch)
  
Monitoring
  └─> AI Service (GetSentiment, Trends)
  └─> Engagement Service (EngagementMetrics)
```

---

## 📊 Data Flow Examples

### Resident Submits Issue
```
1. User submits issue with geolocation & photos
   └─> Issue Service: CreateIssue
2. AI automatically classifies issue
   └─> AI Service: ClassifyIssue
3. Urgent issues trigger alert
   └─> Notification Service: SendAlert
4. User can track status updates
   └─> Issue Service: Subscriptions.OnIssueStatusChanged
```

### Staff Manages Issues
```
1. Staff views assigned issues
   └─> Issue Service: ListIssues (filtered by assignment)
2. AI suggests priority/triage
   └─> AI Service: RecommendPriorities
3. Staff updates status
   └─> Issue Service: UpdateIssueStatus
4. All users get notified
   └─> Notification Service: SendStatusUpdate
5. Analytics auto-update
   └─> AI Service: UpdateTrends
```

### Advocates Drive Engagement
```
1. Comment on issues
   └─> Engagement Service: AddComment
2. Upvote helpful contributions
   └─> Engagement Service: UpvoteIssue
3. Coordinate volunteers
   └─> Engagement Service: VolunteerMatch
4. Monitor community sentiment
   └─> AI Service: GetSentimentAnalysis
```

---

## 🔑 Key Mutations by Service

### Issue Service
```graphql
mutation CreateIssue(
  title, description, category, 
  location: {address, coordinates}, 
  photos: [URLs]
)

mutation UpdateIssueStatus($id, $status)
mutation UpdateIssuePriority($id, $priority)
mutation AssignIssue($id, $staffId)
```

### Engagement Service
```graphql
mutation AddComment($issueId, $content, $authorId)
mutation UpvoteIssue($issueId, $userId)
mutation MarkCommentHelpful($commentId, $userId)
mutation CreateVolunteerMatch($userId, $issueId)
```

### AI Service
```graphql
mutation ClassifyIssue($issueData)
mutation GenerateIssueSummary($issueId)
mutation AnalyzeTrends($timeRange, $category)

query ChatWithBot($input, $context)
query GetTrendInsights($timeRange)
query GetAccessibilityInsights
```

---

## 🏗️ Implementation Order

1. **Auth Service** - User management foundation
2. **Issue Service** - Core issue CRUD and alerts
3. **Engagement Service** - Comments and volunteer coordination
4. **AI Service** - Chatbot and classification (currently commented)
5. **Notification Service** - Real-time alert delivery
6. **Frontend Modules** - UI implementation for all roles

---

## ✅ Checklist for Phase 1

**Backend**:
- [ ] Issue Service: CRUD, geolocation, alerts, AI classification
- [ ] Engagement Service: Comments, upvotes, volunteers
- [ ] AI Service: Uncomment code, implement LangGraph
- [ ] Auth Service: Confirm Resident/Staff/Advocate roles
- [ ] Notification Service: Real-time dispatch
- [ ] GraphQL Federation: Test service composition

**Frontend**:
- [ ] auth_frontend: Role selection during signup
- [ ] issue_frontend: Form, map, chatbot, status tracker
- [ ] analytics_frontend: Dashboard, heatmap, trends

**Testing**:
- [ ] Service-to-service communication
- [ ] Real-time notifications
- [ ] File uploads
- [ ] AI chatbot functionality
- [ ] User workflows

---

## 📚 Reference Documents

- **ARCHITECTURE.md** - Full system design
- **SERVICE_STRUCTURE_FINAL.md** - Core features mapping
- **CODE_ANALYSIS_REPORT.md** - Code quality issues
- **Web_Backend/README.md** - Backend setup
- **Web_Frontend/README.md** - Frontend setup

---

**Quick Answer**: Which service for this feature?
- Issue reporting/tracking/status/alerts? → **Issue Service**
- Comments/upvotes/volunteers/engagement? → **Engagement Service**
- Chatbot/classification/trends/AI? → **AI Service**
- User login/roles/JWT? → **Auth Service**
- Notifications? → **Notification Service**

---

**Last Updated**: December 9, 2025  
**Version**: 1.0 - Core Features Finalized