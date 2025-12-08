# Civic Issue Management Platform - Testing & Deployment Guide

## 📋 Pre-Deployment Checklist

### Backend Services
- ✅ Auth Service: OAuth (Google/GitHub) + email authentication
- ✅ Issue Service: Geolocation queries, SLA tracking, notifications
- ✅ Analytics Service: AI classification, trend detection, staff insights
- ✅ Dependencies installed across all services

### Frontend Applications
- ✅ Auth Frontend: OAuth UI, role-based signup
- ✅ Issue Frontend: Map/list/chat views, geolocation form
- ✅ Analytics Frontend: Staff-only dashboard with 5 views

### Database
- ✅ Migration script created: Removes game collections, seeds civic data
- ✅ Geospatial indexing configured for location queries

---

## 🚀 Deployment Instructions

### 1. Environment Setup

Create `.env` files for each service:

**`Web_Backend/auth-service/.env`**
```
NODE_ENV=production
PORT=4001
MONGODB_URI=mongodb://mongodb:27017/civic-platform
JWT_SECRET=your_jwt_secret_here
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
CORS_ORIGIN=http://localhost:3000,http://localhost:3001,http://localhost:3002
```

**`Web_Backend/issue-service/.env`**
```
NODE_ENV=production
PORT=4002
MONGODB_URI=mongodb://mongodb:27017/civic-platform
JWT_SECRET=your_jwt_secret_here
AUTH_SERVICE_URL=http://auth-service:4001
CORS_ORIGIN=http://localhost:3000,http://localhost:3001,http://localhost:3002
```

**`Web_Backend/ai-service/.env`**
```
NODE_ENV=production
PORT=4003
MONGODB_URI=mongodb://mongodb:27017/civic-platform
GEMINI_API_KEY=your_gemini_api_key
JWT_SECRET=your_jwt_secret_here
CORS_ORIGIN=http://localhost:3000,http://localhost:3001,http://localhost:3002
```

**`Web_Frontend/auth_frontend/.env`**
```
VITE_AUTH_SERVICE_URL=http://localhost:4001
VITE_ISSUE_SERVICE_URL=http://localhost:4002
VITE_GOOGLE_CLIENT_ID=your_google_client_id
VITE_GITHUB_CLIENT_ID=your_github_client_id
```

**`Web_Frontend/issue_frontend/.env`**
```
VITE_ISSUE_SERVICE_URL=http://localhost:4002
VITE_AUTH_SERVICE_URL=http://localhost:4001
VITE_ANALYTICS_SERVICE_URL=http://localhost:4003
```

**`Web_Frontend/analytics_frontend/.env`**
```
VITE_AUTH_SERVICE_URL=http://localhost:4001
VITE_ISSUE_SERVICE_URL=http://localhost:4002
VITE_ANALYTICS_SERVICE_URL=http://localhost:4003
```

### 2. Database Migration

```bash
# Navigate to migrations folder
cd Web_Backend/migrations

# Run migration script (requires MongoDB connection)
MONGODB_URI=mongodb://localhost:27017/civic-platform node removedGameCollections.js
```

Expected output:
```
✅ Migration completed successfully!
📊 Summary:
   • Removed 5 deprecated collections
   • Created 3 users (Resident, Advocate, Staff)
   • Created 6 sample civic issues
   • Created 17 status history entries
   • Geospatial index created for location-based queries
```

### 3. Docker Compose Startup

```bash
# Start all services
docker-compose up -d

# Monitor logs
docker-compose logs -f

# Verify all services are running
docker-compose ps
```

Expected services:
```
SERVICE                STATUS
mongodb                healthy
nginx                  healthy
auth-service           healthy
issue-service          healthy
ai-service             healthy
auth_frontend          healthy
issue_frontend         healthy
analytics_frontend     healthy
```

---

## ✅ Testing Checklist

### 1. Connectivity Tests

```bash
# Test auth service
curl http://localhost:4001/graphql -X POST \
  -H "Content-Type: application/json" \
  -d '{"query": "{ __typename }"}'

# Test issue service  
curl http://localhost:4002/graphql -X POST \
  -H "Content-Type: application/json" \
  -d '{"query": "{ __typename }"}'

# Test analytics service
curl http://localhost:4003/api/health

# Test frontends
curl http://localhost:3000  # Auth
curl http://localhost:3001  # Issues
curl http://localhost:3002  # Analytics
```

### 2. Authentication Testing

**GraphQL Query (Auth Service)**
```graphql
mutation LoginWithEmail {
  loginWithEmail(email: "resident@example.com", password: "password") {
    token
    user {
      _id
      email
      role
      location {
        address
        latitude
        longitude
      }
    }
  }
}
```

**OAuth Flow Testing**
1. Navigate to http://localhost:3000/login
2. Click "Continue with Google"
3. Sign in with test Google account
4. Verify redirect to profile page
5. Check localStorage for JWT token

### 3. Geolocation & Issue Queries

**GraphQL Query (Issue Service)**
```graphql
query GetIssuesByLocation {
  getIssuesByLocation(
    longitude: -74.0060
    latitude: 40.7128
    maxDistance: 5000
  ) {
    _id
    title
    category
    priority
    location {
      type
      coordinates
      address
    }
    slaDeadline
    upvotes
  }
}
```

**Expected Response:**
- Returns issues within 5km radius
- Includes geolocation coordinates
- Shows SLA deadline and status
- Displays upvote counts

### 4. AI Classification Testing

**API Request (Analytics Service)**
```bash
curl -X POST http://localhost:4003/api/classify/issue \
  -H "Content-Type: application/json" \
  -d '{
    "description": "Large pothole on Main Street that could damage vehicles",
    "location": "Downtown area"
  }'
```

**Expected Response:**
```json
{
  "category": "Pothole",
  "confidence": 0.95,
  "sentiment": "negative",
  "priority": "High",
  "summary": "Vehicle hazard from street damage"
}
```

### 5. Issue Creation End-to-End

1. **Frontend Action**: User reports issue on map at coordinates
2. **Process**:
   - Form submits to issue-service GraphQL
   - Geolocation stored as Point geometry
   - AI classification runs via analytics-service
   - Category/priority auto-populated
   - Issue created with 24-144h SLA based on category
3. **Verification**:
   - Check MongoDB issue document
   - Verify geospatial index used
   - Confirm status history created
   - Validate SLA deadline calculated

### 6. Real-time Notification Testing

**GraphQL Subscription (Issue Service)**
```graphql
subscription OnIssueCreated {
  onIssueCreated {
    _id
    title
    category
    location {
      address
    }
    createdAt
  }
}
```

**Testing Steps**:
1. Open WebSocket connection to issue-service
2. Create issue via mutation
3. Verify subscription receives event in real-time
4. Check staff notification preferences respected

### 7. Analytics Dashboard Testing

**Staff Login**:
1. Navigate to http://localhost:3002
2. Login as staff@example.com / password
3. Verify access granted (non-staff should see error)

**Dashboard Views**:
- **Dashboard**: Summary metrics, category breakdown (working ✅)
- **Heatmap**: Grid visualization with issue density (working ✅)
- **SLA Monitor**: Compliance percentage, deadline tracking (working ✅)
- **Trends**: 7/30/90-day trends, predictions (working ✅)
- **AI Insights**: Chatbot for staff queries (working ✅)

### 8. SLA Compliance Tracking

**Manual Verification**:
```javascript
// Check SLA for specific category
const CATEGORY_SLA = {
  'Flooding': 24,        // hours
  'Safety Hazard': 48,
  'Streetlight': 72,
  'Pothole': 120,
  'Accessibility': 96,
  'Other': 144,
};

// Verify deadline calculation
createdAt: 2024-12-01T10:00:00Z
category: Flooding
slaDeadline: 2024-12-02T10:00:00Z  ✅ (24 hours later)

// Check compliance status
resolvedAt: 2024-12-02T09:00:00Z  ✅ On-time (1 hour before deadline)
status: On Track
```

### 9. Comment & Upvoting System

**GraphQL Mutation (Issue Service)**
```graphql
mutation UpvoteComment {
  upvoteComment(issueId: "...", commentId: "...") {
    _id
    upvotes
    userUpvoted
  }
}
```

**Expected Behavior**:
- User can upvote/downvote comments
- Vote count updates in real-time
- Prevents duplicate votes from same user
- No XP/points awarded (civic focus, not game)

### 10. Performance Testing

**Load Test Setup**:
```bash
# Simulate 100 concurrent users creating issues
ab -n 1000 -c 100 http://localhost:4002/graphql

# Expected metrics:
# - Response time: <500ms
# - Error rate: <1%
# - Throughput: >10 req/s
```

**Geospatial Query Performance**:
```javascript
// Test centerSphere query with various distances
db.issues.find({
  'location.coordinates': {
    $geoWithin: {
      $centerSphere: [[-74.0060, 40.7128], 10/3959]  // 10 miles
    }
  }
});

// Expected: <100ms response time with 2dsphere index
```

---

## 🐛 Troubleshooting

### MongoDB Connection Issues
```bash
# Verify MongoDB is running
docker-compose logs mongodb

# Check connection string
MONGODB_URI=mongodb://localhost:27017/civic-platform mongosh --eval "db.version()"
```

### GraphQL Endpoint Issues
```bash
# Check Apollo Server is running
curl -v http://localhost:4001/graphql

# View schema
curl -X POST http://localhost:4001/graphql \
  -H "Content-Type: application/json" \
  -d '{"query": "{__schema{types{name}}}"}'
```

### Geolocation Not Working
```bash
# Verify 2dsphere index exists
db.issues.getIndexes()

# Should show:
# { "key": { "location.coordinates": "2dsphere" } }

# Recreate if missing
db.issues.createIndex({ "location.coordinates": "2dsphere" })
```

### OAuth Not Working
```bash
# Check redirect URIs in Google Cloud Console
# Should include: http://localhost:3000/auth/callback

# Verify CORS is configured
# Check CORS_ORIGIN environment variable includes frontend URLs
```

---

## 📊 Post-Deployment Monitoring

### Key Metrics to Track

**Performance**:
- API response times (target: <500ms)
- GraphQL query execution time
- Database query latency
- Frontend bundle size

**Reliability**:
- Error rate (target: <0.1%)
- Service uptime
- Failed OAuth attempts
- Database connection pool health

**Usage**:
- Daily active users
- Issues created per day
- Average resolution time by category
- SLA compliance percentage
- Most common issue categories

### Monitoring Stack

```yaml
# Recommended tools
- Prometheus: Metrics collection
- Grafana: Visualization dashboards
- ELK Stack: Log aggregation
- New Relic / DataDog: APM
```

---

## 🔒 Security Considerations

### Before Production Deployment

1. **Environment Variables**
   - Use secrets management (HashiCorp Vault, AWS Secrets Manager)
   - Never commit `.env` files
   - Rotate JWT secret quarterly

2. **Database Security**
   - Enable MongoDB authentication
   - Use network policies to restrict access
   - Enable TLS for all connections
   - Regular backups and disaster recovery testing

3. **API Security**
   - Rate limiting on all endpoints
   - CORS properly configured
   - Input validation on all endpoints
   - SQL injection prevention (mongoose does this)

4. **OAuth Security**
   - Use PKCE flow for SPAs
   - Validate state parameter
   - Use secure random nonce
   - Implement CSRF protection

5. **Frontend Security**
   - Content Security Policy headers
   - Subresource Integrity (SRI)
   - HTTPS only (no HTTP)
   - Secure cookie flags

---

## ✨ Post-Deployment Enhancements

### Phase 2 Features
- Real-time map updates with WebSockets
- Mobile app (React Native)
- Advanced search with Elasticsearch
- Email notifications for SLA alerts
- SMS notifications for critical issues
- Bulk import/export of issues
- Advanced analytics and reporting
- PDF report generation
- Integration with external systems (311 platforms)

---

## 📞 Support

For issues or questions:
1. Check docker-compose logs: `docker-compose logs -f [service]`
2. Review GraphQL playground: http://localhost:4001
3. Check console errors in browser DevTools
4. Review API response bodies for detailed error messages

---

**Deployment Date**: [Date]
**Last Updated**: [Date]
**Environment**: [Development/Staging/Production]
