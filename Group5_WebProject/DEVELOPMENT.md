# AI-Powered Local Issue Tracker - Development Guide (No Docker)

## Overview

This guide walks through starting all backend services and 4 frontend applications for local development without Docker.

## System Architecture

```
┌──────────────────────────────────────────────────────────────────┐
│                        Browser/Client                            │
├──────────────────────────────────────────────────────────────────┤
│  Auth Frontend   │  Issue Frontend  │  Analytics Frontend         │
│   (port 5173)    │    (port 5174)   │     (port 5173)            │
│                  │                  │                            │
└────────────────────────────────────────────────────────────────────┘
                            ↓
                   Chatbot Frontend (5175)
                            ↓
┌──────────────────────────────────────────────────────────────────┐
│              Apollo Gateway (port 4000)                           │
│         Apollo Federation Composition                            │
├──────────────────────────────────────────────────────────────────┤
│  Auth Service  │  Issue Service  │  AI Service  │ Notification  │
│  (port 4001)   │  (port 4002)    │ (port 4003)  │  (port 4005)  │
└──────────────────────────────────────────────────────────────────┘
                            ↓
                      MongoDB Database
                    (port 27017)
```

## Prerequisites

- **Node.js**: v18+ (download from https://nodejs.org/)
- **MongoDB**: Running locally or MongoDB Atlas connection string
- **npm**: Comes with Node.js
- **Terminal/PowerShell**: Any terminal with `npm` in PATH

## Step 1: Verify MongoDB is Running

### Option A: Local MongoDB

```bash
# Start MongoDB (if installed locally)
mongod
```

Or use MongoDB Compass GUI application.

### Option B: MongoDB Atlas (Cloud)

Update `.env` with your connection string:
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/civic-issue-tracker
```

## Step 2: Configure Environment Variables

In `Web_Backend/.env.example`, copy to `Web_Backend/.env`:

```bash
# Windows PowerShell
Copy-Item .env.example .env
```

**Key variables to set:**

```env
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/civic-issue-tracker
JWT_SECRET=your-super-secret-jwt-key-change-in-production
GEMINI_API_KEY=your-gemini-api-key-here
CORS_ORIGIN=http://localhost:5173,http://localhost:5174,http://localhost:5175,http://localhost:3000,http://localhost:4000,https://studio.apollographql.com

# Service Ports
AUTH_SERVICE_PORT=4001
ISSUE_SERVICE_PORT=4002
AI_SERVICE_PORT=4003
NOTIFICATION_SERVICE_PORT=4005
GATEWAY_PORT=4000
```

## Step 3: Start Backend Services (5 Terminals)

You'll need 5 terminal windows (one for each service).

### Terminal 1: Auth Service

```bash
cd Web_Backend/auth-service
npm install
npm run dev
```

Expected output:
```
🚀 Auth Service (Apollo Subgraph) running on http://localhost:4001/graphql
✅ Connected to MongoDB
🔐 JWT authentication enabled
```

### Terminal 2: Issue Service

```bash
cd Web_Backend/issue-service
npm install
npm run dev
```

Expected output:
```
🚀 Issue Service (Apollo Subgraph) running on http://localhost:4002/graphql
✅ Connected to MongoDB
📍 Geospatial indexes created
```

### Terminal 3: AI Service

```bash
cd Web_Backend/ai-service
npm install
npm run dev
```

Expected output:
```
🚀 AI Service (Apollo Subgraph) running on http://localhost:4003/graphql
✅ Connected to MongoDB
🤖 Gemini API initialized
```

### Terminal 4: Notification Service

```bash
cd Web_Backend/notification-service
npm install
npm run dev
```

Expected output:
```
🚀 Notification Service running on http://localhost:4005
📬 Listening for events
```

### Terminal 5: Gateway

```bash
cd Web_Backend/gateway
npm install
npm run dev
```

Expected output:
```
🚀 Apollo Gateway running on port 4000
📡 GraphQL endpoint: http://localhost:4000/graphql
🔗 Apollo Federation enabled
    ⚙️ Composed Subgraphs:
    - Auth Service: http://localhost:4001/graphql
    - Issue Service: http://localhost:4002/graphql
    - AI Service: http://localhost:4003/graphql
🔐 JWT token verification active
```

## Step 4: Start Frontend Applications (4 Additional Terminals)

### Terminal 6: Auth Frontend

```bash
cd Web_Frontend/auth_frontend
npm install
npm run dev
```

Runs on http://localhost:5173

### Terminal 7: Issue Frontend

```bash
cd Web_Frontend/issue_frontend
npm install
npm run dev
```

Runs on http://localhost:5174

### Terminal 8: Analytics Frontend

```bash
cd Web_Frontend/analytics_frontend
npm install
npm run dev
```

Runs on http://localhost:5173 (or next available port)

### Terminal 9: Chatbot Frontend

```bash
cd Web_Frontend/chatbot_frontend
npm install
npm run dev
```

Runs on http://localhost:5175

## Step 5: Verify Everything is Running

Open your browser and check each service:

| Service | URL | Purpose |
|---------|-----|---------|
| **GraphQL Gateway** | http://localhost:4000/graphql | Apollo Studio - all GraphQL APIs |
| **Auth Frontend** | http://localhost:5173 | User login & registration |
| **Issue Frontend** | http://localhost:5174 | Report & track issues |
| **Analytics Frontend** | http://localhost:5173+ | Dashboard & metrics |
| **Chatbot Frontend** | http://localhost:5175 | AI-powered Q&A |

## Step 6: Test Backend with GraphQL Queries

Open Apollo Studio at: **http://localhost:4000/graphql**

### Query 1: Register a User

```graphql
mutation {
  register(
    email: "test@example.com"
    password: "SecurePassword123!"
    name: "Test User"
  ) {
    user {
      id
      email
      name
      role
    }
    token
  }
}
```

Copy the returned `token` and add to headers in Apollo Studio:

```json
{
  "Authorization": "Bearer <TOKEN_HERE>"
}
```

### Query 2: Create an Issue

```graphql
mutation {
  createIssue(
    title: "Broken Wheelchair Ramp"
    description: "The ramp near City Hall entrance is damaged and inaccessible"
    category: ACCESSIBILITY
    latitude: 40.7580
    longitude: -73.9855
    address: "City Hall, New York, NY"
  ) {
    id
    title
    description
    status
    category
    createdAt
  }
}
```

### Query 3: Get Dashboard Metrics

```graphql
query {
  getDashboardMetrics {
    totalIssues
    resolvedIssues
    pendingIssues
    averageResolutionTime
    categoriesBreakdown {
      category
      count
      percentage
    }
  }
}
```

### Query 4: Ask the Chatbot

```graphql
query {
  chatbot(message: "What accessibility issues are reported near me?") {
    response
    confidence
    sources {
      issueId
      title
      relevance
    }
    suggestedActions {
      type
      description
    }
  }
}
```

## Troubleshooting

### MongoDB Connection Error

```
Error: connect ECONNREFUSED 127.0.0.1:27017
```

**Solution:**
- Start MongoDB: `mongod` in a separate terminal
- Or use MongoDB Atlas and update MONGODB_URI in `.env`

### Port Already in Use

```
Error: listen EADDRINUSE: address already in use :::4001
```

**Solution (Windows PowerShell):**
```powershell
# Find process using port 4001
Get-NetTCPConnection -LocalPort 4001 | Select-Object -ExpandProperty OwningProcess | ForEach-Object { Stop-Process -Id $_ -Force }
```

Or change the port in the service's config file.

### CORS Errors

Update `Web_Backend/.env`:

```env
CORS_ORIGIN=http://localhost:5173,http://localhost:5174,http://localhost:5175,http://localhost:4000,https://studio.apollographql.com
```

### Gateway Can't Compose Subgraphs

Make sure all three services are running on correct ports:
- Auth: 4001
- Issue: 4002
- AI: 4003

Check each service's GraphQL endpoint is responsive:
```bash
curl http://localhost:4001/graphql
curl http://localhost:4002/graphql
curl http://localhost:4003/graphql
```

### Frontend Won't Connect to GraphQL

Ensure the Apollo Client is configured with correct gateway URL:

```javascript
const apolloClient = new ApolloClient({
  link: new HttpLink({
    uri: 'http://localhost:4000/graphql',
    credentials: 'include',
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
    },
  }),
  cache: new InMemoryCache(),
});
```

## Quick Start Script (Windows PowerShell)

Create a file `start-all.ps1`:

```powershell
# Start MongoDB (if installed locally)
Start-Process mongod

# Backend Services
Start-Process powershell -ArgumentList "cd Web_Backend\auth-service; npm install; npm run dev"
Start-Process powershell -ArgumentList "cd Web_Backend\issue-service; npm install; npm run dev"
Start-Process powershell -ArgumentList "cd Web_Backend\ai-service; npm install; npm run dev"
Start-Process powershell -ArgumentList "cd Web_Backend\notification-service; npm install; npm run dev"
Start-Process powershell -ArgumentList "cd Web_Backend\gateway; npm install; npm run dev"

# Frontend Applications
Start-Process powershell -ArgumentList "cd Web_Frontend\auth_frontend; npm install; npm run dev"
Start-Process powershell -ArgumentList "cd Web_Frontend\issue_frontend; npm install; npm run dev"
Start-Process powershell -ArgumentList "cd Web_Frontend\analytics_frontend; npm install; npm run dev"
Start-Process powershell -ArgumentList "cd Web_Frontend\chatbot_frontend; npm install; npm run dev"

Write-Host "All services starting... Check separate windows for output"
```

Run with:
```bash
.\start-all.ps1
```

## Development Workflow

1. **Edit Backend Code**: Changes to `Web_Backend/*/src` automatically restart with `npm run dev` (nodemon)
2. **Edit Frontend Code**: Changes to `Web_Frontend/*/src` automatically refresh (Vite HMR)
3. **Test GraphQL**: Use Apollo Studio at http://localhost:4000/graphql
4. **Check Logs**: Each terminal window shows logs from that service

## Performance Tips

- Use browser DevTools Network tab to inspect GraphQL queries
- Check Apollo Studio Profiling tab for slow queries
- MongoDB indexes are auto-created for common queries
- Frontend apps use Apollo Client caching to reduce API calls

## Next Steps

1. **Authentication**: Test login/register flows
2. **Issue Reporting**: Create issues with geolocation
3. **Analytics**: View dashboard metrics and trends
4. **Chatbot**: Test AI-powered queries (mock mode initially)
5. **Real-time**: Subscribe to issue updates via GraphQL subscriptions

## Production Deployment

When ready for production:

1. Set `NODE_ENV=production` in `.env`
2. Use environment-specific secrets
3. Enable rate limiting in gateway
4. Set up Redis for caching
5. Use Docker Compose for containerization
6. Deploy to cloud (AWS, GCP, Azure, etc.)

## Support

For issues or questions:
- Check service logs in their respective terminal
- Review IMPLEMENTATION_GUIDE.md in Web_Backend
- Test queries in Apollo Studio
- Verify MongoDB connectivity

---

**Happy developing! 🚀**
