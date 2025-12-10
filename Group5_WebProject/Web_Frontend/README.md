# AI-Powered Local Issue Tracker - Frontend

A modern, responsive micro-frontend application for reporting, tracking, and managing community issues with AI-powered insights.

## 🎯 Overview

This is a micro-frontend architecture using React 19, Vite, and Apollo Client (GraphQL). The application is divided into three independent frontend modules:

- **auth_frontend**: Authentication & user management
- **issue_frontend**: Issue reporting & tracking
- **analytics_frontend**: Analytics & administration dashboard

## 🏗️ Architecture

```
Web_Frontend/
├── auth_frontend/       # Authentication module
├── issue_frontend/      # Issue reporting & tracking module
├── analytics_frontend/  # Analytics & management module
└── shared/              # Shared utilities and components
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- Backend services running (see Web_Backend README)

### Installation

1. **Clone and navigate to frontend directory**:
```bash
cd Web_Frontend
npm install
```

2. **Configure environment variables**:
Create a `.env` file in each frontend module:

```env
# auth_frontend/.env
VITE_API_URL=http://localhost:4000/graphql
VITE_AUTH_SERVICE=http://localhost:4001/graphql

# issue_frontend/.env
VITE_API_URL=http://localhost:4000/graphql
VITE_ISSUE_SERVICE=http://localhost:4003/graphql

# analytics_frontend/.env
VITE_API_URL=http://localhost:4000/graphql
VITE_AI_SERVICE=http://localhost:4002/graphql
```

3. **Start development servers**:
```bash
npm run dev
```

This runs all three modules concurrently:
- Auth Frontend: http://localhost:5173
- Issue Frontend: http://localhost:5174
- Analytics Frontend: http://localhost:5175

## 📚 Frontend Modules

### auth_frontend - Authentication Module

**Purpose**: User registration, login, profile management

**Key Features**:
- User registration with email & password
- JWT-based login
- Role selection (Resident, Staff, Advocate)
- Profile editing
- Password reset

**Key Components**:
- `LoginForm.jsx` - Login interface
- `RegisterForm.jsx` - User registration
- `ProfileForm.jsx` - Profile editing
- `AuthGuard.jsx` - Protected routes

**Port**: 5173

See [auth_frontend/README.md](./auth_frontend/README.md) for details

### issue_frontend - Issue Reporting & Tracking Module

**Purpose**: Submit, track, and discuss community issues

**Key Features**:
- Submit new issues with geolocation & photos
- View issue status in real-time
- Filter and search issues
- Comment and upvote on issues
- AI chatbot for Q&A
- Geospatial map view

**Key Components**:
- `IssueSubmissionForm.jsx` - Create new issues
- `IssuesList.jsx` - Browse and filter issues
- `IssueDetail.jsx` - View full issue details
- `CommentsSection.jsx` - Community discussion
- `AIChatbot.jsx` - AI chatbot interface
- `MapView.jsx` - Geospatial visualization

**Port**: 5174

See [issue_frontend/README.md](./issue_frontend/README.md) for details

### analytics_frontend - Analytics & Administration Module

**Purpose**: Dashboard, insights, and administrative tools

**Key Features**:
- KPI dashboard
- Issue trend analysis
- Heatmap visualization
- Backlog tracking
- Staff management
- AI-powered insights
- Report generation

**Key Components**:
- `AdminDashboard.jsx` - Main dashboard
- `IssueHeatmap.jsx` - Geospatial heatmap
- `TrendAnalysis.jsx` - Pattern detection
- `BacklogTracker.jsx` - Issue queue
- `StaffManagement.jsx` - User management
- `AIInsights.jsx` - AI recommendations

**Port**: 5175

See [analytics_frontend/README.md](./analytics_frontend/README.md) for details

## 🔐 Authentication

All modules use Apollo Client with JWT authentication:

1. User logs in through `auth_frontend`
2. JWT token stored in localStorage
3. Token included in Authorization header for all API requests
4. Automatic token refresh on expiry

**User Roles**:
- **Resident**: Submit and track issues
- **Municipal Staff**: Manage issues, assign tasks
- **Community Advocate**: Monitor trends, engagement tools

## 📊 State Management

Uses React Context API for:
- User authentication state
- Apollo Client configuration
- Global app state

Example:
```javascript
import { useAuthContext } from './context/AuthContext';

function MyComponent() {
  const { user, isAuthenticated } = useAuthContext();
  // ...
}
```

## 🎨 Styling

All modules use **Tailwind CSS** for consistent, responsive design:

```bash
# Tailwind is pre-configured in each module
npm run build:css  # Build Tailwind CSS
```

## 📡 GraphQL Integration

Uses Apollo Client for GraphQL queries and mutations:

```javascript
import { useQuery, useMutation } from '@apollo/client';
import { GET_ISSUES, CREATE_ISSUE } from './queries';

function IssueList() {
  const { data, loading } = useQuery(GET_ISSUES);
  const [createIssue] = useMutation(CREATE_ISSUE);
  // ...
}
```

## 🤖 AI Chatbot Integration

The `issue_frontend` includes an AI chatbot component that communicates with the AI service:

```javascript
<AIChatbot
  isOpen={chatOpen}
  onClose={() => setChatOpen(false)}
  issueContext={currentIssue}
/>
```

Features:
- Natural language Q&A
- Accessibility-focused queries
- Issue classification assistance
- Trend insights

## 🗺️ Geolocation Features

Issue submission and viewing includes:
- Google Maps integration
- Location auto-detection
- Geospatial filtering
- Heatmap visualization

```javascript
import Map from './components/MapView';

<Map
  issues={issues}
  onIssueClick={handleIssueClick}
  center={{ lat: 45.5, lng: -122.6 }}
/>
```

## 📱 Responsive Design

All modules use mobile-first design:
- Responsive breakpoints: xs, sm, md, lg, xl
- Touch-friendly interactions
- Mobile-optimized forms
- Progressive enhancement

## 🧪 Testing

```bash
# Run tests in each module
npm run test

# Watch mode
npm run test:watch

# Coverage report
npm run test:coverage
```

Uses Vitest and React Testing Library

## 🏗️ Building for Production

```bash
# Build all modules
npm run build

# Or individual modules
npm run build:auth
npm run build:issue
npm run build:analytics

# Output goes to dist/ in each module
```

## 📦 Dependencies

Key packages used across all modules:
- **React 19**: Core framework
- **Vite 7**: Build tool
- **Apollo Client 4**: GraphQL client
- **Tailwind CSS 3**: Styling
- **React Hook Form**: Form management
- **Leaflet/Mapbox**: Map visualization

## 🚀 Deployment

### Docker
```bash
# Build Docker image
docker build -t civic-platform-frontend .

# Run container
docker run -p 80:3000 civic-platform-frontend
```

### Static Hosting
Each module builds to static files that can be deployed to:
- Vercel
- Netlify
- GitHub Pages
- AWS S3 + CloudFront

### Environment Configuration
Set environment variables for different deployment targets:
```env
# Production
VITE_API_URL=https://api.example.com/graphql
VITE_AUTH_SERVICE=https://api.example.com/auth
```

## 📖 Civic Focus

**Accessibility Issues in Municipal Infrastructure**

The application includes specialized features for accessibility:
- Accessibility issue category
- Accessibility-focused chatbot queries
- Trend analysis for accessibility issues
- Accessible UI components (WCAG 2.1 AA compliant)

Example queries:
- "What accessibility issues are reported near me?"
- "Show me accessibility barriers on Main Street"
- "How has accessibility improved this month?"

## 🛠️ Development Workflow

1. **Create feature branch**:
```bash
git checkout -b feature/my-feature
```

2. **Make changes** in appropriate module

3. **Test locally**:
```bash
npm run dev
```

4. **Build for production**:
```bash
npm run build
```

5. **Submit pull request**

## 📄 Project Structure

```
Web_Frontend/
├── auth_frontend/
│   ├── src/
│   │   ├── components/      # Reusable auth components
│   │   ├── pages/           # Auth pages
│   │   ├── services/        # Auth service
│   │   ├── utils/           # Constants and helpers
│   │   └── App.jsx
│   ├── index.html
│   └── vite.config.js
├── issue_frontend/
│   ├── src/
│   │   ├── components/      # Issue components
│   │   ├── pages/           # Issue pages
│   │   ├── graphql/         # GraphQL queries/mutations
│   │   └── App.jsx
│   ├── index.html
│   └── vite.config.js
├── analytics_frontend/
│   ├── src/
│   │   ├── components/      # Dashboard components
│   │   ├── pages/           # Admin pages
│   │   ├── graphql/         # Analytics queries
│   │   └── App.jsx
│   ├── index.html
│   └── vite.config.js
└── package.json
```

## 🔗 Related Documentation

- [Web_Backend README](../Web_Backend/README.md)
- [Main Architecture](../ARCHITECTURE.md)
- [Individual Module READMEs](./auth_frontend/README.md)

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Make changes and test locally
4. Push to your fork
5. Submit a pull request

## 📞 Support

For issues, questions, or suggestions:
1. Check existing issues
2. Create a new issue with detailed description
3. Include steps to reproduce if applicable

## 📄 License

[Your License Here]

---

**Version**: 2.0 (AI-Powered Issue Tracking)  
**Last Updated**: 2025-12-09  
**Status**: Active
