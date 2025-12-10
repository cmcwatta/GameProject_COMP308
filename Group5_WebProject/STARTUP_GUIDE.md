# System Startup Guide

## Fixed Issues (Dec 9, 2025)

### Backend Schema Fixes
- ✅ **Auth Service**: Fixed GraphQL mutations to use `name` instead of `username`
- ✅ **Auth Service**: Added `@key(fields: "id")` to User type for Federation
- ✅ **Auth Service**: Added `__resolveReference` resolver for federation lookups
- ✅ **Issue Service**: Removed invalid `extend schema @link` from typeDefs
- ✅ **AI Service**: Removed invalid `extend schema @link` from typeDefs
- ✅ **Gateway**: Simplified context definition (removed duplicate context)

### Frontend Fixes
- ✅ **Auth Frontend**: Updated mutations to use `name` instead of `username`
- ✅ **Auth Frontend**: Updated RegisterForm component - "Full Name" field
- ✅ **Auth Frontend**: Updated ProfileForm component - "Full Name" field
- ✅ **Auth Frontend**: Fixed authService methods to accept `name` parameter

## Startup Instructions

### Terminal 1: Auth Service (Port 4001)
```powershell
cd "c:\Users\Chiang\Desktop\GameProject_COMP308\Group5_WebProject\Web_Backend\auth-service"
npm run dev
```
**Expected Output:**
```
🚀 Auth Microservice running at http://localhost:4001/graphql
```

### Terminal 2: Issue Service (Port 4002)
```powershell
cd "c:\Users\Chiang\Desktop\GameProject_COMP308\Group5_WebProject\Web_Backend\issue-service"
npm run dev
```
**Expected Output:**
```
🚀 Issue Microservice running at http://localhost:4002/graphql
```

### Terminal 3: AI Service (Port 4003)
```powershell
cd "c:\Users\Chiang\Desktop\GameProject_COMP308\Group5_WebProject\Web_Backend\ai-service"
npm run dev
```
**Expected Output:**
```
🚀 AI Microservice running at http://localhost:4003/graphql
```

### Terminal 4: Gateway (Port 4000)
```powershell
cd "c:\Users\Chiang\Desktop\GameProject_COMP308\Group5_WebProject\Web_Backend\gateway"
npm run dev
```
**Expected Output:**
```
🚀 Apollo Gateway running on port 4000
📡 GraphQL endpoint: http://localhost:4000/graphql
🔗 Apollo Federation enabled
```

### Terminal 5: Auth Frontend (Port 3001)
```powershell
cd "c:\Users\Chiang\Desktop\GameProject_COMP308\Group5_WebProject\Web_Frontend\auth_frontend"
npm run dev
```
**Expected Output:**
```
VITE v5.x.x  ready in XXX ms

➜  Local:   http://localhost:3001/
```

### Terminal 6: Issue Frontend (Port 5173)
```powershell
cd "c:\Users\Chiang\Desktop\GameProject_COMP308\Group5_WebProject\Web_Frontend\issue_frontend"
npm run dev
```

### Terminal 7: Analytics Frontend (Port 5174)
```powershell
cd "c:\Users\Chiang\Desktop\GameProject_COMP308\Group5_WebProject\Web_Frontend\analytics_frontend"
npm run dev
```

### Terminal 8: Chatbot Frontend (Port 5175)
```powershell
cd "c:\Users\Chiang\Desktop\GameProject_COMP308\Group5_WebProject\Web_Frontend\chatbot_frontend"
npm run dev
```

## Testing the System

### 1. Register New User
- Go to http://localhost:3001/register
- Fill in:
  - **Full Name**: John Doe
  - **Email**: john@example.com
  - **Password**: password123
  - **Confirm Password**: password123
- Click "Register"

### 2. Login
- Go to http://localhost:3001/login
- Enter email: john@example.com
- Enter password: password123
- Click "Login"

### 3. Access Other Frontends
- **Issue Frontend**: http://localhost:5173 (Report/view local issues)
- **Analytics Dashboard**: http://localhost:5174 (View metrics and trends)
- **Chatbot**: http://localhost:5175 (Chat interface)

## API Endpoints

- **Gateway**: http://localhost:4000/graphql
- **Auth Service**: http://localhost:4001/graphql
- **Issue Service**: http://localhost:4002/graphql
- **AI Service**: http://localhost:4003/graphql
- **Health Check**: http://localhost:4000/health

## Environment Variables

Located in: `Web_Backend/.env`

```
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/civic-issue-tracker
JWT_SECRET=dev-secret-key-change-in-production-12345
AUTH_SERVICE_PORT=4001
ISSUE_SERVICE_PORT=4002
AI_SERVICE_PORT=4003
NOTIFICATION_SERVICE_PORT=4005
GATEWAY_PORT=4000
CORS_ORIGIN=http://localhost:5173,http://localhost:5174,http://localhost:5175,http://localhost:3001,http://localhost:4000,https://studio.apollographql.com
GEMINI_API_KEY=mock-key-for-development
```

## Troubleshooting

### Port Already in Use
If you get "EADDRINUSE" error, kill all node processes:
```powershell
Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force
Start-Sleep -Seconds 2
```

### MongoDB Connection Error
Ensure MongoDB is running:
```powershell
# If not running, start it
mongod
```

### Schema Composition Error
If gateway shows "schema composition failed":
1. Stop all services
2. Kill all node processes
3. Restart services in order: auth → issue → ai → gateway

### GraphQL Errors
- Check browser console (F12) for detailed error messages
- Check service terminal output for resolver errors
- Verify CORS settings match your frontend ports
