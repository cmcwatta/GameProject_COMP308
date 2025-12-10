# Notification Service

Real-time notification service for the Civic Engagement Platform. Handles user alerts, status updates, and event notifications via GraphQL, REST API, and WebSocket.

**Port**: 4005  
**Endpoint**: `http://localhost:4005/graphql`  
**WebSocket**: `ws://localhost:8080`

## 📋 Overview

The Notification Service provides:
- ✅ Real-time WebSocket notifications
- ✅ GraphQL API with Apollo Federation support
- ✅ REST API endpoints for compatibility
- ✅ Email notification templates
- ✅ User notification preferences/subscription management
- ✅ Multiple notification types (issue updates, comments, urgent alerts, volunteer matches, AI insights)
- ✅ Notification history with pagination
- ✅ Unread count tracking

## 🏗️ Architecture

### Service Structure
```
notification-service/
├── index.js                          # Apollo Server + Express setup
├── config/
│   └── config.js                    # Configuration (ports, database, CORS)
├── models/
│   ├── Notification.js              # Notification data model
│   └── NotificationPreference.js     # User preferences model
├── graphql/
│   ├── typeDefs.js                  # GraphQL schema with Federation
│   └── resolvers.js                 # GraphQL resolvers
├── services/
│   ├── alertService.js              # Notification event handlers
│   └── emailService.js              # Email notification templates
└── package.json
```

### Communication Methods
1. **GraphQL Federation** (Primary) - For service-to-service communication
2. **REST API** (Secondary) - For non-GraphQL clients
3. **WebSocket** (Real-time) - For live notification delivery

## 📦 Dependencies

### Core
- `express` - Web framework
- `mongoose` - MongoDB ODM
- `ws` - WebSocket server
- `cors` - Cross-origin resource sharing

### GraphQL
- `@apollo/server` - Apollo Server v4
- `@apollo/subgraph` - Apollo Federation support
- `graphql` - GraphQL library
- `graphql-tag` - GraphQL template literals

### Utilities
- `dotenv` - Environment variable management

## 🚀 Getting Started

### 1. Install Dependencies
```bash
cd notification-service
npm install
```

### 2. Configure Environment Variables
Create a `.env` file in the notification-service directory:

```env
# Port configuration
PORT=4005
WS_PORT=8080

# Database
NOTIFICATION_MONGO_URI=mongodb://localhost:27017/notification_service_db

# CORS
CORS_ORIGIN=http://localhost:5173,http://localhost:5174,http://localhost:5175

# Email service (optional)
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
EMAIL_FROM=noreply@civicplatform.com

# Other services
AUTH_SERVICE_URL=http://localhost:4001/graphql
ISSUE_SERVICE_URL=http://localhost:4003/graphql
ENGAGEMENT_SERVICE_URL=http://localhost:4004/graphql
```

### 3. Start the Service
```bash
npm run dev    # Development mode with nodemon
# or
npm start      # Production mode
```

**Output:**
```
✅ Notification Service connected to MongoDB
🚀 Apollo Server starting
🚀 Notification Service running on port 4005
📡 WebSocket server running on port 8080
✅ GraphQL endpoint: http://localhost:4005/graphql
✅ Health check: http://localhost:4005/health
🔌 WebSocket connect: ws://localhost:8080
```

## 📡 API Endpoints

### GraphQL Endpoint
**POST** `http://localhost:4005/graphql`

### WebSocket Endpoint
**WS** `ws://localhost:8080`

### REST API Endpoints

#### Get User Notifications
```
GET /notifications/:userId?limit=50&offset=0
```

Response:
```json
{
  "notifications": [...],
  "pagination": {
    "total": 150,
    "offset": 0,
    "limit": 50,
    "hasMore": true
  }
}
```

#### Mark Notification as Read
```
PATCH /notifications/:id/read
Content-Type: application/json

{
  "userId": "user-id"
}
```

#### Mark All as Read
```
PATCH /notifications/read-all
Content-Type: application/json

{
  "userId": "user-id"
}
```

#### Health Check
```
GET /health
```

#### Test Notification
```
POST /test-notification
Content-Type: application/json

{
  "userId": "user-id",
  "title": "Test Title",
  "message": "Test Message"
}
```

## 📊 GraphQL Schema

### Types

#### Notification
```graphql
type Notification {
  id: ID!
  userId: String!
  type: NotificationType!
  title: String!
  message: String!
  data: NotificationData
  read: Boolean!
  createdAt: String!
}

enum NotificationType {
  issue_update
  new_comment
  urgent_alert
  status_change
  volunteer_match
  ai_insight
  test
}
```

### Queries

#### Get Notifications
```graphql
query GetNotifications($userId: String!, $limit: Int, $offset: Int) {
  getNotifications(userId: $userId, limit: $limit, offset: $offset) {
    notifications {
      id
      type
      title
      message
      read
      createdAt
    }
    total
    hasMore
  }
}
```

#### Get Unread Count
```graphql
query GetUnreadCount($userId: String!) {
  getUnreadCount(userId: $userId) {
    unreadCount
  }
}
```

#### Get Single Notification
```graphql
query GetNotification($id: ID!) {
  getNotification(id: $id) {
    id
    type
    title
    message
    read
    createdAt
  }
}
```

### Mutations

#### Create Notification
```graphql
mutation CreateNotification(
  $userId: String!
  $type: NotificationType!
  $title: String!
  $message: String!
  $data: String
) {
  createNotification(
    userId: $userId
    type: $type
    title: $title
    message: $message
    data: $data
  ) {
    id
    type
    title
    message
    read
    createdAt
  }
}
```

#### Mark As Read
```graphql
mutation MarkAsRead($id: ID!, $userId: String!) {
  markAsRead(id: $id, userId: $userId) {
    id
    read
  }
}
```

#### Mark All As Read
```graphql
mutation MarkAllAsRead($userId: String!) {
  markAllAsRead(userId: $userId) {
    success
    modifiedCount
  }
}
```

## 🔌 WebSocket Usage

### Authentication
```javascript
const ws = new WebSocket('ws://localhost:8080');

ws.onopen = () => {
  ws.send(JSON.stringify({
    type: 'authenticate',
    userId: 'user-123'
  }));
};

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  console.log('Notification:', data);
};
```

### Mark as Read via WebSocket
```javascript
ws.send(JSON.stringify({
  type: 'mark_read',
  notificationId: 'notification-123',
  userId: 'user-123'
}));
```

## 📧 Email Service

The email service provides templates for various notification types. Configure with your email provider:

### Supported Email Types
- Issue update notifications
- Urgent alerts
- Volunteer match notifications
- Notification digest (daily/weekly)
- Welcome emails

### Configuration
1. Install nodemailer:
   ```bash
   npm install nodemailer
   ```

2. Update `services/emailService.js` with your provider configuration

3. Configure environment variables for email service

## ⚙️ Services Integration

### AlertService
Used by other microservices to trigger notifications:

```javascript
import { AlertService } from './services/alertService.js';

// Notify user of issue creation
await AlertService.notifyIssueCreated(issueId, issueTitle, submitterName, userId);

// Notify of status change
await AlertService.notifyIssueStatusChanged(issueId, issueTitle, oldStatus, newStatus, userId);

// Send urgent alert
await AlertService.notifyUrgentAlert(area, issueTitle, issueId, priority);
```

### Notification Preferences
Users can customize their notification settings:

```graphql
# Query user preferences
query {
  getNotificationPreferences(userId: "user-123") {
    emailNotifications {
      enabled
      issueUpdates
      urgentAlerts
    }
    watchedIssues
    preferredCategories
  }
}

# Update preferences
mutation {
  updateNotificationPreferences(
    userId: "user-123"
    preferences: {
      emailNotifications: { enabled: true }
      watchedIssues: ["issue-1", "issue-2"]
    }
  ) {
    success
  }
}
```

## 🧪 Testing

### Health Check
```bash
curl http://localhost:4005/health
```

### Test Notification
```bash
curl -X POST http://localhost:4005/test-notification \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "test-user-123",
    "title": "Test Notification",
    "message": "This is a test"
  }'
```

### GraphQL Query
```bash
curl -X POST http://localhost:4005/graphql \
  -H "Content-Type: application/json" \
  -d '{
    "query": "query { getUnreadCount(userId: \"user-123\") { unreadCount } }"
  }'
```

## 🔄 Integration with Other Services

### Issue Service
When issues are created or updated, trigger notifications:
```javascript
import { AlertService } from '../notification-service/services/alertService.js';

await AlertService.notifyIssueCreated(issue._id, issue.title, user.name, assignedUserId);
```

### Engagement Service
When comments are added, trigger notifications:
```javascript
import { AlertService } from '../notification-service/services/alertService.js';

await AlertService.notifyNewComment(issueId, issueTitle, author.name, commentText, userId);
```

### AI Service
When AI generates insights, trigger notifications:
```javascript
import { AlertService } from '../notification-service/services/alertService.js';

await AlertService.notifyAIInsight(userId, 'trend', { trend: 'pothole_increase', area: 'Downtown' });
```

## 📋 Notification Types

| Type | Trigger | Recipients |
|------|---------|------------|
| `issue_update` | Issue created | Staff, interested users |
| `new_comment` | Comment added | Issue creator, watchers |
| `urgent_alert` | Critical issue in area | All users in geolocation |
| `status_change` | Issue status updated | Interested users |
| `volunteer_match` | Volunteer opportunity | Matched volunteers |
| `ai_insight` | AI analysis complete | Relevant staff |

## 🛠️ Troubleshooting

### WebSocket Connection Fails
- Check that `WS_PORT` environment variable is set
- Ensure port 8080 is not blocked by firewall
- Verify client is using correct WebSocket URL

### Notifications Not Appearing
- Verify user is authenticated and connected via WebSocket
- Check MongoDB connection
- Ensure notification preferences allow the notification type

### GraphQL Errors
- Check that Apollo Server started successfully
- Verify schema is valid in GraphQL playground
- Look at server logs for resolver errors

## 📚 Additional Resources

- [Apollo Server Documentation](https://www.apollographql.com/docs/apollo-server/)
- [GraphQL Federation](https://www.apollographql.com/docs/apollo-server/federation/introduction/)
- [WebSocket API](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket)
- [MongoDB Mongoose](https://mongoosejs.com/)

## 📝 License

Part of the Civic Engagement Platform project.
