# Service Structure - FINALIZED ✅

**Core Features Implementation Structure**

## Service Responsibilities (Confirmed)

### 🎯 **Issue Service** (Port 4003)
**Stores and updates reported issues, tracks issue status, sends urgent alerts**

Responsibilities:
- Issue CRUD operations (Create, Read, Update, Delete)
- Geolocation-based issue storage with mapping
- Issue status tracking (Open, In Progress, Resolved, Closed, Duplicate)
- Priority assignment (Low, Medium, High, Critical)
- File uploads (photos and evidence documents)
- AI classification and categorization
- Urgent alert generation
- Issue history and audit trail
- Permission-based access control

**Used By**: Residents (submit/track), Municipal Staff (manage/assign)

---

### 💬 **Engagement Service** (Port 4004)
**Enables comments and upvotes, supports volunteer matching, summarizes community discussions**

Responsibilities:
- Comment management and discussion threads
- Upvote/helpful voting system
- Community sentiment analysis
- Volunteer matching and coordination
- Discussion summarization
- Community engagement tracking
- Community advocate tools

**Used By**: Community Advocates, Residents (comments/upvotes)

---

## User Experience Mapping

### 👥 **Residents**
- **Issue Reporting & Tracking**
  - Submit new issues (geolocation + photos)
  - Track status in real-time
  - Receive urgent alerts
  - Comment on issues
  - Upvote helpful contributions
  
- **AI Assistance**
  - AI categorization of submitted issues
  - Chatbot Q&A for issue lookup
  - Accessibility-focused queries

### 🏢 **Municipal Staff**
- **Issue Management Dashboard**
  - View assigned issues
  - Update status and priority
  - Assign to team members
  - AI-based triage recommendations
  
- **Analytics & Insights**
  - Heatmap of issue clusters
  - Backlog tracking
  - Trend detection and analysis
  - AI-powered recommendations

### 🤝 **Community Advocates**
- **Engagement Tools**
  - Comment and discuss issues
  - Upvote helpful contributions
  - Volunteer matching
  - Track community sentiment
  - Community activity insights

---

## Service Architecture (Finalized)

```
┌─────────────────────────────────────────┐
│       User Roles (Auth Service)         │
│  Resident | Staff | Community Advocate │
└─────────────┬───────────────────────────┘
              │
       ┌──────┴──────┐
       │             │
       ▼             ▼
  ┌──────────┐  ┌────────────────┐
  │  Issue   │  │  Engagement    │
  │ Service  │  │   Service      │
  │ (4003)   │  │   (4004)       │
  ├──────────┤  ├────────────────┤
  │- CRUD    │  │- Comments      │
  │- Status  │  │- Upvotes       │
  │- Alerts  │  │- Volunteer     │
  │- Files   │  │- Sentiment     │
  └──────┬───┘  └────────┬───────┘
         │              │
         └──────┬───────┘
                │
         ┌──────▼────────┐
         │  AI Service   │
         │   (4002)      │
         ├───────────────┤
         │- Chatbot      │
         │- Classify     │
         │- Trends       │
         │- Accessibility│
         └───────────────┘
                │
         ┌──────▼────────┐
         │  Notify Svc   │
         │  (4005)       │
         └───────────────┘
```

---

## Core Features Checklist

### ✅ For Residents
- [ ] Issue Reporting & Tracking
  - [ ] Submit issues with geolocation
  - [ ] Upload photos/evidence
  - [ ] AI categorization
  - [ ] Real-time status tracking
  - [ ] Urgent alerts/notifications
  
- [ ] Community Engagement
  - [ ] Comment on issues
  - [ ] Upvote helpful contributions
  - [ ] View community activity
  
- [ ] AI Assistance
  - [ ] Chatbot Q&A
  - [ ] Issue lookup
  - [ ] Accessibility queries

### ✅ For Municipal Staff
- [ ] Issue Management Dashboard
  - [ ] View assigned issues
  - [ ] Update status/priority
  - [ ] Assign to team members
  - [ ] AI triage recommendations
  
- [ ] Analytics & Insights
  - [ ] Heatmap visualization
  - [ ] Backlog tracking
  - [ ] Trend detection
  - [ ] AI recommendations

### ✅ For Community Advocates
- [ ] Engagement Tools
  - [ ] Comment management
  - [ ] Upvote system
  - [ ] Volunteer coordination
  - [ ] Community sentiment tracking

---

## Phase 1 Implementation Tasks

### Backend Setup
- [ ] Issue Service: CRUD, file uploads, alerts, AI classification
- [ ] Engagement Service: Comments, upvotes, volunteer matching
- [ ] AI Service: Chatbot initialization (uncomment current code)
- [ ] Notification Service: Real-time alert dispatch
- [ ] Auth Service: Confirm Resident/Staff/Advocate roles

### Frontend Implementation
- [ ] auth_frontend: Registration with role selection
- [ ] issue_frontend:
  - [ ] IssueSubmissionForm (geolocation + photo upload)
  - [ ] MapView (geospatial visualization)
  - [ ] AIChatbot (integration)
  - [ ] StatusTracker
  - [ ] CommentsSection
- [ ] analytics_frontend:
  - [ ] AdminDashboard (KPIs)
  - [ ] IssueHeatmap
  - [ ] TrendAnalysis
  - [ ] BacklogTracker
  - [ ] AIInsights

### Testing & Integration
- [ ] Service-to-service GraphQL federation
- [ ] Real-time notification delivery
- [ ] AI chatbot functionality (LangGraph + Gemini)
- [ ] Geolocation features
- [ ] File upload processing (Multer)

---

## Remaining Code Issues to Address

### High Priority
1. **AI Service** - Currently commented out (ai-service/index.js)
   - Uncomment and implement LangGraph initialization
   
2. **Frontend Boilerplate** - Remove from App.jsx files
   - analytics_frontend/src/App.jsx
   - issue_frontend/src/App.jsx

### Medium Priority
1. **Add Missing Dependencies** to frontend packages
   - @apollo/client
   - tailwindcss
   - react-hook-form
   - leaflet/mapbox
   - chart libraries
   
2. **Auth Service** - Remove duplicate mutations
   - Consolidate signup/register
   - Consolidate signin/login

### Low Priority
1. **Config Consistency** - Align environment variable naming
2. **Commented Code Cleanup** - Remove old commented blocks

---

## Key Decisions Made ✅

✅ **Issue Service** = Issue management (CRUD, status, alerts, files)
✅ **Engagement Service** = Community features (comments, upvotes, volunteers)
✅ **Clear User Roles** = Resident, Staff, Community Advocate
✅ **Core Features** = All specified features supported across 3 user types

---

## Next Steps

1. **Code Preparation**
   - Uncomment AI service code
   - Remove frontend boilerplate
   - Add missing dependencies

2. **Phase 1 Implementation**
   - Implement backend services (Issue, Engagement, AI)
   - Build frontend components
   - Integrate services via GraphQL Federation

3. **Testing**
   - Unit tests for each service
   - Integration tests for service communication
   - E2E tests for user workflows

4. **Deployment Preparation**
   - Docker setup
   - Environment configuration
   - Monitoring setup

---

**Status**: ✅ FINALIZED - Ready for Phase 1 implementation  
**Decision Date**: December 9, 2025  
**Core Features**: All specified features mapped to services  
**Timeline**: Phase 1 estimated 2 weeks