# Quick Reference - Ports & URLs

## Backend Services

| Service | Port | GraphQL URL | Health Check |
|---------|------|-------------|--------------|
| **Auth Service** | 4001 | http://localhost:4001/graphql | http://localhost:4001/health |
| **Issue Service** | 4002 | http://localhost:4002/graphql | http://localhost:4002/health |
| **AI Service** | 4003 | http://localhost:4003/graphql | http://localhost:4003/health |
| **Notification Service** | 4005 | — | http://localhost:4005/health |
| **Apollo Gateway** | 4000 | http://localhost:4000/graphql | http://localhost:4000/health |

## Frontend Applications

| App | Port | URL |
|-----|------|-----|
| **Auth Frontend** | 5173 | http://localhost:5173 |
| **Issue Frontend** | 5174 | http://localhost:5174 |
| **Analytics Frontend** | 5173+ | http://localhost:5173 (or next) |
| **Chatbot Frontend** | 5175 | http://localhost:5175 |

## Important URLs

| Purpose | URL |
|---------|-----|
| **Main GraphQL API** | http://localhost:4000/graphql |
| **Apollo Studio** | https://studio.apollographql.com (connect to http://localhost:4000/graphql) |
| **MongoDB** | mongodb://localhost:27017/civic-issue-tracker |

## Common Commands

```bash
# Start a specific service
cd Web_Backend/auth-service && npm install && npm run dev

# Check service health
curl http://localhost:4001/health

# Test GraphQL endpoint
curl -X POST http://localhost:4000/graphql \
  -H "Content-Type: application/json" \
  -d '{"query":"{ __typename }"}'

# Install all frontend dependencies
cd Web_Frontend && npm install

# Kill process on a port (Windows PowerShell)
Get-NetTCPConnection -LocalPort 4001 | Select-Object -ExpandProperty OwningProcess | ForEach-Object { Stop-Process -Id $_ -Force }
```

## Environment Variables (.env)

```env
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/civic-issue-tracker
JWT_SECRET=your-secret-key-here
GEMINI_API_KEY=your-api-key-here
CORS_ORIGIN=http://localhost:5173,http://localhost:5174,http://localhost:5175,http://localhost:4000
```

## GraphQL Test Queries

### Register User
```graphql
mutation {
  register(email: "test@example.com", password: "Test123!", name: "Test User") {
    user { id email name }
    token
  }
}
```

### Login
```graphql
mutation {
  login(email: "test@example.com", password: "Test123!") {
    user { id email }
    token
  }
}
```

### Create Issue
```graphql
mutation {
  createIssue(
    title: "Broken Ramp"
    description: "Wheelchair ramp is damaged"
    category: ACCESSIBILITY
    latitude: 40.7580
    longitude: -73.9855
  ) {
    id title status
  }
}
```

### Get Dashboard
```graphql
query {
  getDashboardMetrics {
    totalIssues
    resolvedIssues
    pendingIssues
    averageResolutionTime
  }
}
```

### Chat with Bot
```graphql
query {
  chatbot(message: "What accessibility issues are near me?") {
    response
    confidence
    sources { issueId title }
  }
}
```

## Service Dependencies

```
Frontend Apps
    ↓
Apollo Gateway (4000)
    ↓
┌─ Auth Service (4001)
├─ Issue Service (4002)
├─ AI Service (4003)
└─ MongoDB (27017)
```

## Architecture Decisions

✅ **Apollo Federation**: Multiple GraphQL services with gateway composition
✅ **MongoDB**: Document database with geospatial indexes
✅ **JWT Auth**: Stateless authentication across services
✅ **React 19**: Latest React with hooks and suspense
✅ **Vite**: Fast HMR for frontend development
✅ **GraphQL Subscriptions**: Real-time updates for issues

## Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| MongoDB won't connect | Run `mongod` in separate terminal or use MongoDB Atlas |
| Port already in use | Kill process with `lsof -ti:4001 \| xargs kill -9` (Mac/Linux) |
| CORS errors | Update `CORS_ORIGIN` in `.env` |
| JWT errors | Check token in Authorization header |
| Frontend won't load | Ensure all backend services running on correct ports |

## Next Testing Steps

1. ✅ Start all 9 services (5 backend + 4 frontend)
2. ✅ Register user via Auth Frontend
3. ✅ Create issue via Issue Frontend
4. ✅ View dashboard via Analytics Frontend
5. ✅ Chat with bot via Chatbot Frontend
6. ✅ Test real-time updates with subscriptions

---

**Documentation**: See `DEVELOPMENT.md` for complete setup guide
