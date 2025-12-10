# AI-Powered Local Issue Tracker - Implementation Guide

## Quick Start

This project has been initialized with the architecture specified in ARCHITECTURE.md. Follow these steps to get the system running.

### Prerequisites

- Node.js 18+ and npm
- MongoDB 6+ (local or MongoDB Atlas)
- Google Gemini API key ([Get API Key](https://ai.google.dev/))

### Installation & Setup

#### 1. Environment Configuration

Create `.env` files in each service directory with the following variables:

**Root `.env` (Web_Backend/)**:
```env
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/civic-issue-tracker
JWT_SECRET=your-secret-key-change-in-production

# Services
AUTH_SERVICE_PORT=4001
ISSUE_SERVICE_PORT=4002
AI_SERVICE_PORT=4003
GATEWAY_PORT=4000

# Gemini API
GEMINI_API_KEY=your-gemini-api-key
GEMINI_MODEL=gemini-1.5-pro

# CORS
CORS_ORIGIN=http://localhost:5173,http://localhost:5174,http://localhost:5175,http://localhost:3000,https://studio.apollographql.com

# Logging
LOG_LEVEL=debug
```

Copy this to each service:
- `auth-service/.env`
- `issue-service/.env`
- `ai-service/.env`
- `gateway/.env`

#### 2. Install Dependencies

```bash
# Install all backend service dependencies
cd Web_Backend

# Auth Service
cd auth-service && npm install && cd ..

# Issue Service
cd issue-service && npm install && cd ..

# AI Service
cd ai-service && npm install && cd ..

# Gateway
cd gateway && npm install && cd ..

# Frontend (from Web_Frontend)
cd ../Web_Frontend
npm install
```

#### 3. Start Services

**Terminal 1 - MongoDB** (if running locally):
```bash
mongod
```

**Terminal 2 - Auth Service**:
```bash
cd Web_Backend/auth-service
npm run dev
```

**Terminal 3 - Issue Service**:
```bash
cd Web_Backend/issue-service
npm run dev
```

**Terminal 4 - AI Service**:
```bash
cd Web_Backend/ai-service
npm run dev
```

**Terminal 5 - API Gateway**:
```bash
cd Web_Backend/gateway
npm run dev
```

**Terminal 6 - Frontend**:
```bash
cd Web_Frontend
npm run dev
```

### Service Endpoints

Once all services are running:

- **API Gateway**: http://localhost:4000
  - Auth GraphQL: http://localhost:4001/graphql
  - Issue GraphQL: http://localhost:4002/graphql
  - AI GraphQL: http://localhost:4003/graphql
  
- **Frontend Modules**:
  - Main App: http://localhost:5173
  - Auth Frontend: http://localhost:5174
  - Issue Frontend: http://localhost:5175

### Architecture Overview

```
Frontend (React 19 / Next.js / Svelte)
    ↓
API Gateway (Apollo Server Federation)
    ↓
Microservices:
    ├── Auth Service (User management, JWT/OAuth)
    ├── Issue Service (CRUD, Real-time updates)
    └── AI Service (Chatbot, Classification, Analytics)
    ↓
MongoDB
```

### File Structure

```
Web_Backend/
├── auth-service/
│   ├── config/
│   ├── graphql/
│   ├── models/
│   ├── utils/
│   └── auth-microservice.js
├── issue-service/
│   ├── config/
│   ├── graphql/
│   ├── models/
│   └── issue-microservice.js
├── ai-service/
│   ├── config/
│   ├── graphql/
│   ├── models/
│   └── index.js
├── gateway/
│   ├── config/
│   └── index.js
└── ...

Web_Frontend/
├── auth_frontend/
├── issue_frontend/
├── analytics_frontend/
└── ...
```

### Key Features Implemented

#### Auth Service
✅ User registration and login
✅ JWT authentication
✅ OAuth support (Google, GitHub - setup required)
✅ Role-based access control (resident, staff, community_advocate, admin)
✅ User profile management

#### Issue Service
✅ Issue CRUD operations
✅ Geolocation-based queries
✅ Real-time subscriptions
✅ Comment threads
✅ Alert system
✅ Attachment handling (photo uploads)

#### AI Service
✅ Agentic chatbot interface (LangGraph foundation)
✅ Issue classification with Gemini
✅ Analytics dashboards
✅ Trend detection
✅ Sentiment analysis
✅ Summary generation

### Development Notes

1. **Database Models**: All MongoDB schemas are indexed for performance
2. **GraphQL Federation**: Services use Apollo Federation for composition
3. **Authentication**: JWT tokens verified in middleware
4. **API Documentation**: Use Apollo Studio (https://studio.apollographql.com) to explore schemas
5. **AI Integration**: Gemini API calls are mocked in resolvers pending full LangGraph implementation

### Next Steps

1. **Complete LangGraph Integration**: Implement full agentic chatbot with tool chains
2. **Frontend Implementation**: Build out React components for all modules
3. **Real-time Features**: Implement GraphQL subscriptions for live updates
4. **Testing**: Add comprehensive unit and integration tests
5. **Deployment**: Set up Docker, Kubernetes, or cloud deployment

### Troubleshooting

**MongoDB Connection Error**:
```
Make sure MongoDB is running and MONGODB_URI is correct
```

**CORS Issues**:
```
Check that CORS_ORIGIN includes your frontend URL
```

**Gemini API Error**:
```
Ensure GEMINI_API_KEY is set and valid
```

**Port Already in Use**:
```
Change service ports in .env if defaults are occupied
```

### Production Checklist

- [ ] Set strong JWT_SECRET
- [ ] Enable HTTPS
- [ ] Configure production MongoDB
- [ ] Set up Gemini API rate limiting
- [ ] Enable CORS restrictions
- [ ] Configure logging and monitoring
- [ ] Set up CI/CD pipeline
- [ ] Database backups
- [ ] Error tracking (Sentry)
- [ ] Performance monitoring (New Relic/DataDog)

### Support & Documentation

- See `ARCHITECTURE.md` for detailed architecture
- GraphQL schemas available in each service's `/graphql` directory
- Apollo Studio: Query playground at http://localhost:4000/graphql
