# Notification Service Integration Summary

**Date**: December 10, 2025  
**Status**: ✅ Integration Complete

## Overview

The Notification Service has been successfully integrated with all core microservices in the Civic Engagement Platform. Notifications are now triggered automatically for key events across the system.

## Integrated Services

### 1. Issue Service (Port 4003)

**File**: `Web_Backend/issue-service/graphql/resolvers.js`  
**AlertService File**: `Web_Backend/issue-service/services/alertService.js`

#### Integrated Notifications:

- **Issue Creation** (`notifyIssueCreated`)
  - Triggered: When a new issue is created
  - Recipient: Issue submitter
  - Notification Type: `issue_update`
  - Data Included: issueId, title, category, priority

- **Status Change** (`notifyIssueStatusChanged`)
  - Triggered: When issue status changes (assigned, in_progress, resolved, closed, reopened)
  - Recipient: Issue submitter
  - Notification Type: `status_change`
  - Data Included: issueId, newStatus, previousStatus

#### Code Integration Points:

```javascript
// createIssue mutation now calls:
await AlertService.notifyIssueCreated({...})

// updateStatus mutation now calls:
await AlertService.notifyIssueStatusChanged({...})
```

---

### 2. Engagement Service (Port 4004)

**File**: `Web_Backend/engagement-service/graphql/resolvers.js`  
**AlertService File**: `Web_Backend/engagement-service/services/alertService.js`

#### Integrated Notifications:

- **New Comment** (`notifyNewComment`)
  - Triggered: When a user posts a comment on an issue
  - Recipient: Comment author (notified of their own comment)
  - Notification Type: `new_comment`
  - Data Included: issueId, commentId, content preview, authorId

- **Volunteer Match** (`notifyVolunteerMatch`)
  - Triggered: When a user volunteers for an issue
  - Recipient: Volunteer
  - Notification Type: `volunteer_match`
  - Data Included: issueId, volunteerId, volunteerName

#### Code Integration Points:

```javascript
// addComment mutation now calls:
await AlertService.notifyNewComment({...})

// volunteerForIssue mutation now calls:
await AlertService.notifyVolunteerMatch({...})
```

---

### 3. AI Service (Port 4002)

**File**: `Web_Backend/ai-service/graphql/resolvers.js`  
**AlertService File**: `Web_Backend/ai-service/services/alertService.js`

#### Integrated Notifications:

- **AI Insights** (`notifyAIInsight`)
  - Triggered: When AI generates insights from issues
  - Recipient: System/admin users
  - Notification Type: `ai_insight`
  - Data Included: insightCount, issueCount, generatedAt

#### Code Integration Points:

```javascript
// generateInsights query now calls:
await AlertService.notifyAIInsight({...})
```

---

## How It Works

### Notification Flow

```
Service Mutation/Query
       ↓
Execute Business Logic
       ↓
AlertService.notifyXxx()
       ↓
GraphQL Mutation to Notification Service
       ↓
Notification Service (Port 4005)
       ↓
Store Notification + WebSocket Broadcast
       ↓
User Receives Notification (Real-time)
```

### Service URLs

All services communicate with the Notification Service via GraphQL:

```
NOTIFICATION_SERVICE_URL = http://localhost:4005/graphql
```

### Error Handling

Notification failures are handled gracefully:

```javascript
try {
  await AlertService.notifyXxx({...});
} catch (notificationError) {
  console.warn('Failed to send notification:', notificationError);
  // Service continues normally even if notification fails
}
```

---

## Configuration

### Environment Variables

Add the following to all service `.env` files:

```env
NOTIFICATION_SERVICE_URL=http://localhost:4005/graphql
```

### Service Availability

For notifications to work, the Notification Service must be running:

```bash
cd Web_Backend/notification-service
npm run dev
```

---

## Testing Notifications

### Test Issue Creation

```graphql
mutation {
  createIssue(input: {
    title: "Test Issue"
    description: "Testing notifications"
    latitude: 40.7128
    longitude: -74.0060
    address: "123 Main St"
    category: "infrastructure"
    submitterId: "user123"
    submitterName: "John Doe"
  }) {
    id
    title
    status
  }
}
```

**Expected**: Notification sent to user123 about issue creation.

---

### Test Comment Notification

```graphql
mutation {
  addComment(issueId: "issue-id-here", content: "This is a test comment") {
    id
    content
    author
    createdAt
  }
}
```

**Expected**: Notification sent to comment author about their comment.

---

### Test Volunteer Notification

```graphql
mutation {
  volunteerForIssue(issueId: "issue-id-here") {
    id
    volunteers {
      userId
      name
    }
  }
}
```

**Expected**: Notification sent to volunteer about successful volunteer match.

---

### Test AI Insights

```graphql
query {
  generateInsights(issues: ["issue1", "issue2", "issue3"]) {
    summary
    trends
    recommendations
  }
}
```

**Expected**: Notification sent about newly generated insights.

---

## Alert Service Methods

Each service has an AlertService class with the following structure:

```typescript
export class AlertService {
  static async notifyXxx(data: object): Promise<object>
}
```

### Issue Service Methods

- `notifyIssueCreated(issueData)`
- `notifyIssueStatusChanged(issueData)`

### Engagement Service Methods

- `notifyNewComment(commentData)`
- `notifyVolunteerMatch(volunteerData)`

### AI Service Methods

- `notifyAIInsight(insightData)`

---

## Notification Types

The following notification types are used:

| Type | Service | Trigger |
|------|---------|---------|
| `issue_update` | Issue Service | Issue created |
| `status_change` | Issue Service | Issue status changes |
| `new_comment` | Engagement Service | Comment posted |
| `volunteer_match` | Engagement Service | User volunteers |
| `ai_insight` | AI Service | AI generates insights |

---

## Integration Checklist

- ✅ Issue Service AlertService created
- ✅ Engagement Service AlertService created
- ✅ AI Service AlertService created
- ✅ All mutation/query handlers updated to call AlertService
- ✅ Error handling implemented for failed notifications
- ✅ Notification Service confirmed running on port 4005
- ✅ GraphQL endpoints verified for all services
- ✅ Environment configuration documented

---

## Next Steps

1. **Add to Additional Services**: As new microservices are created, import and use AlertService
2. **Email Notifications**: Configure email provider in Notification Service for email alerts
3. **User Preferences**: Implement notification preference system (already modeled in NotificationPreference)
4. **Real-time Testing**: Test WebSocket connections for real-time delivery
5. **Analytics**: Monitor notification delivery success rates

---

## Troubleshooting

### Notifications Not Being Sent

1. Verify Notification Service is running: `npm run dev` in notification-service directory
2. Check GraphQL endpoint URL: `http://localhost:4005/graphql`
3. Verify MongoDB connection: `npm run verify` in notification-service directory
4. Check service logs for GraphQL errors

### GraphQL Errors

If you see `GraphQL error in notifyXxx`, check:
- Notification Service schema matches the mutation being called
- All required fields are included in the mutation
- Network connection to Notification Service

### WebSocket Connection Issues

Test WebSocket connection:

```bash
# From any terminal with websocat installed:
websocat ws://localhost:8080

# Send authentication:
{"type": "authenticate", "userId": "test-user-id"}
```

---

## Documentation Files

- `NOTIFICATION_INTEGRATION_EXAMPLES.md` - Detailed GraphQL examples
- `NOTIFICATION_FILE_MANIFEST.md` - Complete file listing
- `NOTIFICATION_STATUS.txt` - Current status summary

---

**Last Updated**: December 10, 2025  
**Next Review**: After first production deployment
