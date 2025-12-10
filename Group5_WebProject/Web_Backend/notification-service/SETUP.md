# 🔔 Notification Service - Setup Guide

**Status**: Configuration Complete  
**Service Port**: 4005  
**WebSocket Port**: 8080  
**Database**: MongoDB

---

## ✅ Environment Configuration Complete

Your `.env` file has been created with the following defaults:

```env
# Service Configuration
PORT=4005
WS_PORT=8080
NODE_ENV=development

# MongoDB Database
NOTIFICATION_MONGO_URI=mongodb://localhost:27017/notification_service_db

# CORS Origins
CORS_ORIGIN=http://localhost:5173,http://localhost:5174,http://localhost:5175,http://localhost:3000,http://localhost:4000

# Microservices
AUTH_SERVICE_URL=http://localhost:4001/graphql
ISSUE_SERVICE_URL=http://localhost:4003/graphql
ENGAGEMENT_SERVICE_URL=http://localhost:4004/graphql
AI_SERVICE_URL=http://localhost:4002/graphql
```

---

## 🚀 Quick Start

### 1. Verify Configuration

Run the configuration verification script to ensure everything is set up correctly:

```bash
npm run verify
```

This will check:
- ✅ Port configuration (4005, 8080)
- ✅ Environment variables
- ✅ Database URI format
- ✅ CORS configuration
- ✅ Service URLs
- ✅ MongoDB connection

### 2. Start the Service

```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

### 3. Verify Service is Running

Check the health endpoint:
```bash
npm run test:health

# Or manually:
curl http://localhost:4005/health
```

Expected response:
```json
{
  "status": "healthy",
  "service": "Notification Service",
  "timestamp": "2025-12-10T...",
  "websocket": {
    "connectedClients": 0,
    "port": 8080
  },
  "mongodb": "connected",
  "graphql": "ready"
}
```

---

## 📝 Configuration Details

### Database URI

The default configuration uses a local MongoDB instance:
```
mongodb://localhost:27017/notification_service_db
```

**To use MongoDB Atlas** (cloud):
1. Get your connection string from MongoDB Atlas
2. Update `.env`:
   ```env
   NOTIFICATION_MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/notification_service_db
   ```

**To use Docker MongoDB**:
```bash
docker run -d -p 27017:27017 --name mongodb mongo:latest
```
Then use: `mongodb://localhost:27017/notification_service_db`

### CORS Configuration

The service accepts requests from:
- `http://localhost:5173` - Frontend (Vite default)
- `http://localhost:5174` - Analytics Frontend
- `http://localhost:5175` - Alternate port
- `http://localhost:3000` - React default
- `http://localhost:4000` - API Gateway

**To add more origins**, update `.env`:
```env
CORS_ORIGIN=http://localhost:5173,http://localhost:5174,http://production-url.com
```

### Service Integration URLs

These point to other microservices in the platform:
- **Auth Service**: `http://localhost:4001/graphql`
- **Issue Service**: `http://localhost:4003/graphql`
- **Engagement Service**: `http://localhost:4004/graphql`
- **AI Service**: `http://localhost:4002/graphql`

Update these if your services are on different hosts/ports.

---

## 🔐 Optional: Email Configuration

To enable email notifications, uncomment and configure in `.env`:

### Gmail Configuration
```env
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
EMAIL_FROM=noreply@civicplatform.com
```

**Note**: Use App-Specific Password for Gmail (not your regular password)

### SendGrid Configuration
```env
EMAIL_SERVICE=sendgrid
SENDGRID_API_KEY=your-api-key
EMAIL_FROM=noreply@civicplatform.com
```

### AWS SES Configuration
```env
EMAIL_SERVICE=aws-ses
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
AWS_REGION=us-east-1
EMAIL_FROM=noreply@civicplatform.com
```

---

## 📋 Available NPM Scripts

| Command | Purpose |
|---------|---------|
| `npm run dev` | Start service with hot-reload (development) |
| `npm start` | Start service (production) |
| `npm run verify` | Verify configuration and MongoDB connection |
| `npm run test:health` | Test health endpoint |
| `npm run test:graphql` | Test GraphQL endpoint |

---

## 🔌 Testing the Service

### Health Check
```bash
curl http://localhost:4005/health
```

### Send Test Notification
```bash
curl -X POST http://localhost:4005/test-notification \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "test-user-123",
    "title": "Test Notification",
    "message": "This is a test notification"
  }'
```

### GraphQL Query
```bash
curl -X POST http://localhost:4005/graphql \
  -H "Content-Type: application/json" \
  -d '{
    "query": "{ getUnreadCount(userId: \"test-user-123\") { unreadCount } }"
  }'
```

### WebSocket Connection
```javascript
// JavaScript example
const ws = new WebSocket('ws://localhost:8080');

ws.onopen = () => {
  // Authenticate
  ws.send(JSON.stringify({
    type: 'authenticate',
    userId: 'test-user-123'
  }));
};

ws.onmessage = (event) => {
  const notification = JSON.parse(event.data);
  console.log('Notification received:', notification);
};

ws.onerror = (error) => {
  console.error('WebSocket error:', error);
};
```

---

## ⚠️ Common Issues & Solutions

### Issue: "Failed to connect to MongoDB"

**Cause**: MongoDB is not running or connection string is wrong

**Solution**:
1. Check if MongoDB is running:
   ```bash
   mongosh  # If installed locally
   ```
2. Verify connection string in `.env`
3. Check port (default 27017)
4. If using Atlas, ensure IP whitelist allows your connection

### Issue: "CORS error"

**Cause**: Frontend origin not in CORS_ORIGIN

**Solution**:
Update `.env`:
```env
CORS_ORIGIN=http://localhost:3000,http://your-frontend-url.com
```

### Issue: "Port already in use"

**Cause**: Another service is using port 4005 or 8080

**Solution**:
Update ports in `.env`:
```env
PORT=4006        # Use 4006 instead of 4005
WS_PORT=8081     # Use 8081 instead of 8080
```

### Issue: "Cannot find module 'graphql-tag'"

**Cause**: Dependencies not installed

**Solution**:
```bash
npm install
```

---

## 📚 Next Steps

1. ✅ **Verify Configuration**
   ```bash
   npm run verify
   ```

2. ✅ **Start Service**
   ```bash
   npm run dev
   ```

3. ✅ **Test Endpoints**
   - Health: `http://localhost:4005/health`
   - GraphQL: `http://localhost:4005/graphql`
   - WebSocket: `ws://localhost:8080`

4. ✅ **Integrate with Other Services**
   - See `NOTIFICATION_INTEGRATION_EXAMPLES.md` for code examples

5. ✅ **Configure Email** (Optional)
   - Update `.env` with your email provider

---

## 📞 Support

For detailed documentation, see:
- **API Reference**: `README.md`
- **Integration Guide**: `../NOTIFICATION_INTEGRATION_EXAMPLES.md`
- **File Manifest**: `../NOTIFICATION_FILE_MANIFEST.md`

---

**Status**: ✅ Environment Configured  
**Next**: Run `npm run verify` to test configuration
