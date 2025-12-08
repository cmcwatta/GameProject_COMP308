# 🚀 Quick Start Guide - Civic Issue Platform

## Prerequisites

- Docker & Docker Compose installed
- Node.js 18+ (for local development)
- MongoDB 6+ (included in docker-compose)
- Git

## ⚡ 5-Minute Quick Start

### 1. Start All Services

```bash
cd Group5_WebProject
docker-compose up -d
```

Wait for all services to show "healthy" status:
```bash
docker-compose ps
```

### 2. Access the Applications

| Application | URL | Purpose |
|------------|-----|---------|
| Auth (Login) | http://localhost:3000 | User login & signup |
| Issues | http://localhost:3001 | Report & view issues |
| Analytics | http://localhost:3002 | Staff dashboard |
| API Docs | http://localhost:4001 | GraphQL playground |

### 3. Test Login

**Email/Password**:
- Email: `resident@example.com`
- Password: `password`
- Role: Resident

**Or use OAuth** (Google/GitHub)

### 4. Create Your First Issue

1. Go to http://localhost:3001
2. Click "Report Issue"
3. Click "Use Current Location" or enter coordinates
4. Click "Classify with AI" to auto-fill category
5. Submit

### 5. View Analytics (Staff Only)

1. Go to http://localhost:3002
2. Login as staff: `staff@example.com` / `password`
3. Explore Dashboard, Heatmap, SLA Monitor, Trends, AI Insights

---

## 📚 Detailed Setup

### Clone & Install

```bash
# Navigate to project root
cd Group5_WebProject

# Install backend dependencies
cd Web_Backend/auth-service && npm install
cd ../issue-service && npm install
cd ../ai-service && npm install

# Install frontend dependencies
cd ../../Web_Frontend/auth_frontend && npm install
cd ../issue_frontend && npm install
cd ../analytics_frontend && npm install

# Return to root
cd ../..
```

### Environment Variables

Create `.env` file in each service root (optional for local dev):

**Web_Backend/auth-service/.env**
```
NODE_ENV=development
PORT=4001
MONGODB_URI=mongodb://mongodb:27017/civic-platform
JWT_SECRET=dev-secret-key
```

**Web_Backend/issue-service/.env**
```
NODE_ENV=development
PORT=4002
MONGODB_URI=mongodb://mongodb:27017/civic-platform
JWT_SECRET=dev-secret-key
```

**Web_Backend/ai-service/.env**
```
NODE_ENV=development
PORT=4003
MONGODB_URI=mongodb://mongodb:27017/civic-platform
GEMINI_API_KEY=your-api-key-here
```

### Docker Compose Start

```bash
# Start all services in background
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down
```

### Database Migration (First Time Only)

```bash
cd Web_Backend/migrations
MONGODB_URI=mongodb://localhost:27017/civic-platform node removedGameCollections.js
```

This creates:
- 3 test users (Resident, Advocate, Staff)
- 6 sample civic issues
- Status history & SLA deadlines

---

## 🧪 Quick Tests

### Test 1: Create an Issue

```bash
curl -X POST http://localhost:4002/graphql \
  -H "Content-Type: application/json" \
  -d '{
    "query": "mutation { createIssue(title: \"Test Issue\", category: \"Flooding\", description: \"Test description\", location: {address: \"123 Main\", latitude: 40.7128, longitude: -74.0060}) { _id title } }"
  }'
```

### Test 2: Query Issues by Location

```bash
curl -X POST http://localhost:4002/graphql \
  -H "Content-Type: application/json" \
  -d '{
    "query": "query { getIssuesByLocation(latitude: 40.7128, longitude: -74.0060, maxDistance: 5000) { _id title category } }"
  }'
```

### Test 3: Classify Issue with AI

```bash
curl -X POST http://localhost:4003/api/classify/issue \
  -H "Content-Type: application/json" \
  -d '{
    "description": "Large pothole on Main Street",
    "location": "Downtown"
  }'
```

---

## 🎯 Key Features to Try

### Issue Reporting (Port 3001)
1. ✅ Click "Report Issue" button
2. ✅ Use geolocation or enter coordinates
3. ✅ Click "Classify with AI" (pre-fills category)
4. ✅ Select priority & view SLA deadline
5. ✅ Submit issue

### Map View
1. ✅ View all issues as colored markers
2. ✅ Click marker to see issue details
3. ✅ Blue dot shows your location
4. ✅ Filter by category

### List View
1. ✅ Search issues by title
2. ✅ Filter by category/status/priority
3. ✅ Click to expand issue details
4. ✅ Upvote issues

### Chatbot Widget
1. ✅ Click floating "💬" button
2. ✅ Ask about flooding issues
3. ✅ Get prevention tips
4. ✅ Quick action buttons

### Analytics Dashboard (Port 3002)
1. ✅ Login as staff@example.com
2. ✅ View Dashboard: Key metrics & activity
3. ✅ Heatmap: Issue density by zone
4. ✅ SLA Monitor: Compliance tracking
5. ✅ Trends: 7/30/90-day analysis
6. ✅ AI Insights: Staff chatbot

---

## 🐛 Common Issues & Fixes

### MongoDB Connection Error
```bash
# Check if MongoDB is running
docker-compose logs mongodb

# Restart MongoDB
docker-compose restart mongodb
```

### GraphQL Endpoint Not Responding
```bash
# Check service logs
docker-compose logs auth-service
docker-compose logs issue-service

# Restart services
docker-compose restart auth-service issue-service
```

### Port Already in Use
```bash
# Kill process on port (e.g., 3000)
# Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Mac/Linux:
lsof -i :3000
kill -9 <PID>
```

### Frontend Not Loading
```bash
# Clear browser cache (Ctrl+Shift+Delete)
# Then hard refresh (Ctrl+Shift+R)
# Check console for errors (F12)
```

---

## 📖 Next Steps

1. **Read the full guide**: `TESTING_AND_DEPLOYMENT.md`
2. **Understand architecture**: `ARCHITECTURE.md`
3. **Review code changes**: Check git diffs
4. **Configure OAuth** (optional):
   - Get Google OAuth credentials
   - Get GitHub OAuth credentials
   - Update environment variables

---

## 🆘 Need Help?

1. **Check logs**:
   ```bash
   docker-compose logs [service-name]
   ```

2. **GraphQL Playground**:
   - Visit http://localhost:4001
   - Write queries/mutations
   - Test endpoints live

3. **Review documentation**:
   - `TESTING_AND_DEPLOYMENT.md` - Full testing guide
   - `SESSION_COMPLETION_SUMMARY.md` - Project overview
   - `ARCHITECTURE.md` - System design

---

## 📞 API Endpoints

### Authentication Service (Port 4001)
- GraphQL: http://localhost:4001/graphql
- Playground: http://localhost:4001

### Issue Service (Port 4002)
- GraphQL: http://localhost:4002/graphql
- Playground: http://localhost:4002

### Analytics Service (Port 4003)
- REST API: http://localhost:4003/api/*
- Classification: POST /api/classify/issue
- Chatbot: POST /api/chatbot/query
- Trends: GET /api/trends/*

---

## 🎉 You're Ready!

Your civic issue management platform is now running. Start reporting issues, viewing the map, and exploring the analytics dashboard.

**Happy civic engagement! 🏛️**
