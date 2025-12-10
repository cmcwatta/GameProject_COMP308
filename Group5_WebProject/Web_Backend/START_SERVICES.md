# Starting the AI-Powered Local Issue Tracker Backend Services

This guide provides step-by-step instructions for starting all backend services and verifying they work correctly.

## Prerequisites

- Node.js 18+ installed
- MongoDB running locally (port 27017) or MongoDB Atlas connection string
- All `.env` files configured in each service directory
- Terminal/PowerShell access

## Step 1: Environment Setup

Copy the `.env.example` file to `.env` in the Web_Backend directory:

```bash
cp .env.example .env
```

Then create symlinks (or copy) the `.env` file to each service:

```bash
# For each service directory
cp .env auth-service/.env
cp .env issue-service/.env
cp .env ai-service/.env
cp .env gateway/.env
cp .env notification-service/.env
```

Update the following in your `.env` file:
- `MONGODB_URI`: Your MongoDB connection string (default: mongodb://localhost:27017/civic-issue-tracker)
- `GEMINI_API_KEY`: Your Google Gemini API key (get from https://ai.google.dev/)
- `JWT_SECRET`: A secure random string (recommendation: use `openssl rand -hex 32`)

## Step 2: Install Dependencies

Install dependencies for all services:

### Terminal 1 - Auth Service
```bash
cd Web_Backend/auth-service
npm install
npm run dev
```

Output should show:
```
🚀 Auth Service (Apollo Subgraph) running on http://localhost:4001/graphql
✅ Connected to MongoDB
🔐 JWT authentication enabled
```

### Terminal 2 - Issue Service
```bash
cd Web_Backend/issue-service
npm install
npm run dev
```

Output should show:
```
🚀 Issue Service (Apollo Subgraph) running on http://localhost:4002/graphql
✅ Connected to MongoDB
📍 Geospatial indexes created
```

### Terminal 3 - AI Service
```bash
cd Web_Backend/ai-service
npm install
npm run dev
```

Output should show:
```
🚀 AI Service (Apollo Subgraph) running on http://localhost:4003/graphql
✅ Connected to MongoDB
🤖 Gemini API initialized (mock mode until configured)
```

### Terminal 4 - Gateway
```bash
cd Web_Backend/gateway
npm install
npm run dev
```

Output should show:
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

### Terminal 5 - Notification Service (Optional)
```bash
cd Web_Backend/notification-service
npm install
npm run dev
```

## Step 3: Verify Services Are Running

Check the health of all services:

```bash
# Auth Service
curl http://localhost:4001/health

# Issue Service
curl http://localhost:4002/health

# AI Service
curl http://localhost:4003/health

# Gateway
curl http://localhost:4000/health

# Notification Service (if running)
curl http://localhost:4005/health
```

Expected response format:
```json
{
  "status": "healthy",
  "service": "Auth Service",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

## Step 4: Test the Apollo Gateway

Open Apollo Studio (or GraphQL IDE) at: **http://localhost:4000/graphql**

### Quick Test Queries

#### 1. Register a User
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

#### 2. Login
```graphql
mutation {
  login(
    email: "test@example.com"
    password: "SecurePassword123!"
  ) {
    user {
      id
      email
      name
    }
    token
  }
}
```

Copy the returned `token` and add it to your request headers:
```json
{
  "Authorization": "Bearer <your_token_here>"
}
```

#### 3. Create an Issue
```graphql
mutation {
  createIssue(
    title: "Broken Wheelchair Ramp"
    description: "The ramp near City Hall entrance is damaged"
    category: "ACCESSIBILITY"
    latitude: 40.7580
    longitude: -73.9855
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

#### 4. Query Issues Near a Location
```graphql
query {
  getIssuesNearby(
    latitude: 40.7580
    longitude: -73.9855
    radius: 5
  ) {
    id
    title
    category
    status
    location {
      latitude
      longitude
    }
  }
}
```

#### 5. Get Dashboard Metrics
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

#### 6. Chatbot Query
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

### Services Won't Start

**Error: `EADDRINUSE: address already in use :::4001`**
- Another service is using the port
- Solution: 
  ```bash
  # Windows PowerShell - Find and kill process
  Get-NetTCPConnection -LocalPort 4001 | Select-Object -ExpandProperty OwningProcess | ForEach-Object { Stop-Process -Id $_ -Force }
  ```

**Error: `Cannot find module '@apollo/server'`**
- Dependencies not installed
- Solution: Run `npm install` in the service directory

**Error: `MONGO_CONNECT_ERROR: connect ECONNREFUSED 127.0.0.1:27017`**
- MongoDB not running
- Solution: Start MongoDB:
  ```bash
  # If using MongoDB Atlas, ensure MONGODB_URI is correct in .env
  # If using local MongoDB:
  mongod  # or use MongoDB Compass GUI
  ```

### Gateway Can't Compose Subgraphs

**Error: `Apollo Gateway error: Unable to introspect`**
- Subgraph services not running
- Solution: Ensure all three services (auth, issue, ai) are running on their correct ports
- Check firewall isn't blocking ports 4001, 4002, 4003

**Error: `No subgraph found at URL`**
- Services running but endpoints different
- Verify each service outputs its GraphQL endpoint URL

### GraphQL Queries Return Errors

**Error: `"Unauthorized" or "Invalid token"`**
- JWT token missing or invalid
- Solution: 
  1. Register and login to get a fresh token
  2. Add to request headers: `{"Authorization": "Bearer TOKEN"}`
  3. Verify JWT_SECRET matches across all services

**Error: `"Cannot read property 'graphql' of undefined"`**
- GraphQL typeDefs or resolvers malformed
- Check service console for parsing errors
- Review the service's `graphql/typeDefs.js` and `graphql/resolvers.js`

## Service Ports Reference

| Service | Port | URL |
|---------|------|-----|
| Auth Service | 4001 | http://localhost:4001/graphql |
| Issue Service | 4002 | http://localhost:4002/graphql |
| AI Service | 4003 | http://localhost:4003/graphql |
| Notification Service | 4005 | http://localhost:4005 (REST) |
| **Gateway** | **4000** | **http://localhost:4000/graphql** |

## Architecture Overview

```
┌─────────────────────────────────────────────┐
│        Apollo Server Gateway (4000)         │
│      [Apollo Federation Composer]           │
└───────┬──────────┬──────────┬───────────────┘
        │          │          │
    ┌───▼──┐   ┌───▼──┐   ┌──▼────┐
    │  🔐  │   │  📍   │   │  🤖   │
    │ Auth │   │ Issue │   │  AI   │
    │ 4001 │   │ 4002  │   │ 4003  │
    └───┬──┘   └───┬──┘   └──┬────┘
        │          │          │
        └──────────┬──────────┘
                   │
            ┌──────▼───────┐
            │   MongoDB    │
            │    :27017    │
            └──────────────┘
```

## Next Steps

1. **Frontend Setup**: Navigate to `Web_Frontend` and follow setup instructions
2. **LangGraph Integration**: Implement full agentic chatbot workflows in AI Service
3. **Testing**: Run integration tests to verify inter-service communication
4. **Deployment**: Use Docker Compose for containerized deployment
5. **Monitoring**: Set up Apollo Studio Enterprise for federated graph analytics

## Performance Tips

- Use Redis for caching (add REDIS_URL to .env)
- Enable GraphQL query complexity analysis in production
- Set up rate limiting on the gateway
- Use Apollo Studio for query performance monitoring
- Configure indexes on MongoDB for frequently queried fields

---

**Happy testing!** 🚀

For detailed API documentation, see `IMPLEMENTATION_GUIDE.md`.
