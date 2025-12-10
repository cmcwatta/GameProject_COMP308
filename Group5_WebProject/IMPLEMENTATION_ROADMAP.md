# Core Features Implementation Roadmap

## 🚀 Phase 1: Issue Reporting & Management (CURRENT)

### ✅ 1.1 Frontend Issue Report Integration 
**Status**: IN PROGRESS - PARTIALLY COMPLETE
- ✅ IssueReportPage.jsx wired with GraphQL mutation
- ✅ Form validation implemented
- ✅ Loading state on submit button
- ✅ Toast notifications on success/error
- ⏳ File upload handling (ready but not sent to backend yet)
- ⏳ Geolocation data inclusion in mutation

**Next Steps**:
1. Test issue submission through GraphQL
2. Implement file upload handling
3. Add image/document upload to mutation

---

### 1.2 Backend Issue Service 
**Status**: READY
- ✅ GraphQL typeDefs complete
- ✅ Resolvers implemented:
  - `createIssue` - Submit new issue
  - `updateIssue` - Update issue details
  - `deleteIssue` - Remove issue
  - `updateStatus` - Change status (open → in_progress → resolved)
  - `assignIssue` - Assign to staff
  - `upvoteIssue` - Community voting
  - `addVolunteer` - Volunteer coordination

---

### 1.3 Issue List & Filtering
**Status**: PLACEHOLDER
- Location: `issue_frontend/src/App.jsx` - `IssueList` component
- Needs Implementation:
  - Fetch issues list from backend
  - Filter by status, category, priority
  - Search by location (radius)
  - Pagination
  - Real-time updates via subscriptions

---

### 1.4 Issue Details Page
**Status**: PLACEHOLDER
- Location: `issue_frontend/src/App.jsx` - `IssueDetail` component
- Needs Implementation:
  - Display full issue information
  - Show comments and upvotes
  - Volunteer list and join button
  - Status updates (staff only)
  - Assignment controls (staff only)

---

## 🗺️ Phase 2: Analytics & Insights

### 2.1 Admin Dashboard
**Status**: PLACEHOLDER
- Location: `analytics_frontend/src/App.jsx` - `AdminDashboard` component
- Needs Implementation:
  - Key metrics (total issues, resolved %, avg resolution time)
  - Issue status breakdown (pie/bar charts)
  - Recent activity timeline
  - Staff performance metrics

---

### 2.2 Issue Heatmap
**Status**: PLACEHOLDER
- Location: `analytics_frontend/src/App.jsx` - `HeatMap` component
- Needs Implementation:
  - Map integration (Leaflet/Mapbox)
  - Geolocation clustering
  - Category-based filtering
  - Zoom and pan controls
  - Popup with issue preview

---

### 2.3 Trends & Insights
**Status**: PLACEHOLDER
- Location: `analytics_frontend/src/App.jsx` - `Trends` component
- Needs Implementation:
  - Issue frequency over time
  - Top categories/locations
  - AI-powered trend detection (Gemini)
  - Recommendations for action

---

### 2.4 Backlog Management
**Status**: PLACEHOLDER
- Location: `analytics_frontend/src/App.jsx` - `Backlog` component
- Needs Implementation:
  - Drag-and-drop kanban board
  - Status transitions
  - Priority reassignment
  - Bulk actions

---

## 💬 Phase 3: Community Engagement

### 3.1 Comments & Discussion
**Status**: BACKEND READY - FRONTEND NEEDED
- Backend: Engagement Service (mutations: `addComment`, `upvoteIssue`)
- Frontend Implementation Needed:
  - Comment list display
  - Comment form with validation
  - Nested replies support
  - Comment moderation UI

---

### 3.2 Volunteer Coordination
**Status**: BACKEND READY - FRONTEND NEEDED
- Backend: Engagement Service (mutations: `volunteerForIssue`)
- Frontend Implementation Needed:
  - Volunteer signup button
  - Volunteer list with status
  - Volunteer status management (staff only)
  - Notification when volunteered for

---

### 3.3 Upvoting & Community Support
**Status**: BACKEND READY - FRONTEND NEEDED
- Backend: Engagement Service (mutation: `upvoteIssue`)
- Frontend Implementation Needed:
  - Upvote button with visual feedback
  - Vote count display
  - Prevent duplicate votes

---

## 🤖 Phase 4: AI Features

### 4.1 AI Issue Classification
**Status**: BACKEND READY - NEEDS INTEGRATION
- Service: AI Service (query: `classifyIssue`)
- Purpose: Auto-categorize issues on submission
- Integration Point: Issue creation mutation

---

### 4.2 Chatbot Assistant
**Status**: BACKEND READY - NEEDS INTEGRATION
- Service: AI Service (query: `chatbotQuery`)
- Features:
  - Answer FAQs about issue reporting
  - Help with categorization
  - Provide local insights
- Integration Point: Chat widget on frontend

---

### 4.3 Trend Detection
**Status**: BACKEND READY - NEEDS INTEGRATION
- Service: AI Service (query: `detectTrends`)
- Purpose: Identify emerging issue patterns
- Display: Analytics dashboard

---

### 4.4 Sentiment Analysis
**Status**: BACKEND READY - NEEDS INTEGRATION
- Service: AI Service (query: `analyzeSentiment`)
- Purpose: Gauge community sentiment on issues
- Display: Issue detail page, analytics

---

## 🔔 Phase 5: Notifications

### 5.1 Issue Update Notifications
**Status**: SERVICE READY - NEEDS INTEGRATION
- Service: Notification Service (port 4005)
- Triggers:
  - Issue status change
  - Comment on watched issue
  - Volunteer accepted/assigned
- Delivery: Toast, email, in-app bell

---

### 5.2 Subscription Management
**Status**: NOT STARTED
- Allow users to customize notifications
- Watch/mute specific issues
- Category preferences

---

## 📋 Implementation Priority Matrix

### IMMEDIATE (This Week)
1. ✅ **Issue Report Submission** (Phase 1.1)
   - Test GraphQL mutation
   - Handle file uploads
   - Error handling

2. **Issue List Page** (Phase 1.3)
   - Fetch and display issues
   - Basic filtering
   - Search functionality

### HIGH (Next Week)
3. **Issue Details Page** (Phase 1.4)
   - Full issue view
   - Comments display
   - Upvote functionality

4. **Admin Dashboard** (Phase 2.1)
   - Key metrics
   - Charts and visualization

### MEDIUM (Following Week)
5. **Heatmap** (Phase 2.2)
   - Map integration
   - Location clustering

6. **AI Classification** (Phase 4.1)
   - Auto-categorization

### LOWER (As Time Allows)
7. Volunteer coordination
8. Trend detection
9. Advanced analytics
10. Chatbot integration

---

## 🛠️ Technical Stack for Implementation

### Frontend Technologies
```
- React 19 with Hooks
- Apollo Client 3.9 for GraphQL
- TailwindCSS for utility styling
- Custom CSS for complex layouts
- Heroicons for icons
- React Hot Toast for notifications
- Leaflet/Mapbox for maps
- Chart.js or Recharts for analytics
- React Hook Form for complex forms
```

### Backend Technologies
```
- Express.js + Apollo Server
- MongoDB + Mongoose
- JWT Authentication
- Google Gemini API (AI)
- LangGraph (chatbot orchestration)
- Multer (file uploads)
```

---

## 📊 Testing Checklist

For each feature, verify:
- [ ] Frontend form submission works
- [ ] GraphQL mutation executes without errors
- [ ] Data persists in MongoDB
- [ ] Response returns to frontend correctly
- [ ] Loading states display properly
- [ ] Error messages show appropriately
- [ ] Token authentication passes through
- [ ] Role-based access works
- [ ] No console errors or warnings
- [ ] Mobile responsiveness maintained

---

## 🎯 Success Metrics

Phase 1 Complete When:
- Users can submit issues with title, description, location
- Issues appear in list after submission
- Issue details page shows all information
- Comments and upvotes functional

Phase 2 Complete When:
- Admin dashboard shows accurate metrics
- Heatmap displays issues geographically
- Trends are detected and displayed

Phase 3 Complete When:
- Community can comment on issues
- Volunteers can signup for issues
- Upvoting affects issue visibility

Phase 4 Complete When:
- AI categorizes issues automatically
- Chatbot responds to common questions
- Trends are identified from data

Phase 5 Complete When:
- Users receive notifications
- Notifications can be customized
- No missed updates

---

## 🚨 Known Issues to Address

1. **Auth Service Duplicate Mutations**
   - `register` vs `signup`
   - `login` vs `signin`
   - Action: Consolidate to `register`/`login`

2. **File Upload Handling**
   - Frontend collects files but doesn't send
   - Need multipart form handling
   - AWS S3 or local storage decision needed

3. **Error Boundary Implementation**
   - Add React Error Boundary
   - Prevent full app crashes

4. **Loading Indicators**
   - Add skeleton screens for list pages
   - Improve perceived performance

---

**Last Updated**: December 10, 2025
**Next Review**: After Phase 1.2 completion
