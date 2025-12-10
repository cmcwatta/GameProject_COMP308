# Frontend Integration Guide

## Overview

All three frontend modules (auth, issue, analytics) are now connected through a shared authentication and API layer. Users can seamlessly navigate between modules based on their role.

## Architecture

```
Web_Frontend/
├── shared/                    # Shared modules (all frontends use these)
│   ├── AuthContext.jsx       # Authentication context and useAuth hook
│   ├── apiClient.jsx         # Apollo Client configuration with token management
│   ├── ProtectedRoute.jsx    # Role-based route protection component
│   └── index.js              # Module exports
│
├── auth_frontend/            # Port 5173 - Authentication hub
│   ├── src/
│   │   ├── pages/           # Login, Register, Profile, Dashboard
│   │   ├── components/      # Auth forms and guards
│   │   └── App.jsx          # Main auth routes
│   └── vite.config.js       # Shared module alias
│
├── issue_frontend/           # Port 5174 - Issue tracking
│   ├── src/
│   │   ├── pages/           # Issue list, submission, detail, map
│   │   ├── components/      # Issue forms and displays
│   │   └── App.jsx          # Protected issue routes
│   └── vite.config.js       # Shared module alias + GraphQL proxy
│
└── analytics_frontend/       # Port 5175 - Admin analytics
    ├── src/
    │   ├── pages/           # Dashboard, analytics, heatmap, trends
    │   ├── components/      # Charts, maps, insights
    │   └── App.jsx          # Protected admin routes
    └── vite.config.js       # Shared module alias + GraphQL proxy
```

## How It Works

### 1. Authentication Flow

1. User logs in at **auth_frontend** (port 5173)
2. `AuthContext` stores JWT token in localStorage
3. Apollo Client automatically includes token in all GraphQL requests
4. Token is validated by backend services

### 2. Navigation Between Frontends

Each frontend header includes links to other modules:

```jsx
<a href="http://localhost:5173">Dashboard</a>      {/* Auth */}
<a href="http://localhost:5174">Issues</a>         {/* Issue Tracker */}
<a href="http://localhost:5175">Analytics</a>      {/* Admin Analytics */}
```

### 3. Protected Routes

All routes except `/login` and `/register` require authentication:

```jsx
<ProtectedRoute>
  <IssueList />
</ProtectedRoute>
```

Analytics routes also require specific roles:

```jsx
<ProtectedRoute requiredRoles={['municipal_staff', 'admin']}>
  <AdminDashboard />
</ProtectedRoute>
```

### 4. Token Management

- **Stored in:** `localStorage.token`
- **Added to requests via:** Apollo Client `authLink`
- **Expired tokens:** Automatically cleared and user redirected to login
- **Cross-frontend:** Token persists across all modules

## Setup Instructions

### 1. Install Dependencies

```bash
cd Web_Frontend/auth_frontend
npm install

cd ../issue_frontend
npm install

cd ../analytics_frontend
npm install
```

### 2. Start Backend Services

Ensure these services are running:
- Auth Service (port 4001)
- API Gateway (port 4000)
- Issue Service (port 4003)
- Engagement Service (port 4004)
- Notification Service (port 4005)
- AI Service (port 4002)

### 3. Start Frontend Modules

In separate terminals:

```bash
# Terminal 1 - Auth Frontend (port 5173)
cd Web_Frontend/auth_frontend && npm run dev

# Terminal 2 - Issue Frontend (port 5174)
cd Web_Frontend/issue_frontend && npm run dev

# Terminal 3 - Analytics Frontend (port 5175)
cd Web_Frontend/analytics_frontend && npm run dev
```

## Shared Modules

### AuthContext (`shared/AuthContext.jsx`)

Provides authentication state and methods to all frontends.

```jsx
import { useAuth } from '@shared';

function MyComponent() {
  const { user, token, isAuthenticated, logout, hasRole } = useAuth();
  
  return (
    <div>
      {isAuthenticated && <p>Welcome, {user.username}</p>}
      {hasRole('admin') && <AdminPanel />}
    </div>
  );
}
```

### Apollo Client (`shared/apiClient.jsx`)

Configured for all GraphQL services with automatic token handling.

```jsx
import { apolloClient } from '@shared';

export const client = apolloClient;
```

### ProtectedRoute (`shared/ProtectedRoute.jsx`)

Protects routes and enforces role-based access.

```jsx
// Require authentication only
<ProtectedRoute>
  <Dashboard />
</ProtectedRoute>

// Require specific role
<ProtectedRoute requiredRole="admin">
  <AdminPanel />
</ProtectedRoute>

// Require any of multiple roles
<ProtectedRoute requiredRoles={['admin', 'municipal_staff']}>
  <StaffDashboard />
</ProtectedRoute>
```

## User Flows

### Resident Flow
1. Sign up at `localhost:5173/register`
2. Select "Resident" role
3. Redirected to auth dashboard
4. Navigate to "Issues" tab to submit/track issues
5. Can view community engagement on issue details

### Municipal Staff Flow
1. Sign up at `localhost:5173/register`
2. Select "Municipal Staff" role
3. Access full dashboard at `localhost:5173`
4. View analytics at `localhost:5175/analytics`
5. Access heatmap and trends
6. Can update issue statuses from `localhost:5174`

### Community Advocate Flow
1. Sign up at `localhost:5173/register`
2. Select "Community Advocate" role
3. Full issue tracking access at `localhost:5174`
4. Can comment and organize volunteers on issues

## Troubleshooting

### Token Not Persisting
- Check localStorage: `localStorage.getItem('token')`
- Verify token format: Should start with `eyJ` (Base64)
- Clear localStorage and re-login if corrupted

### Apollo Client Errors
- Check Network tab for GraphQL errors
- Verify backend services are running
- Check CORS configuration in backend

### Routes Not Loading
- Ensure you're logged in
- Verify token in localStorage
- Check browser console for error messages

### Cross-Frontend Navigation Issues
- Clear browser cache
- Check port numbers match (5173, 5174, 5175)
- Verify all frontends are running

## Next Steps

1. **Implement Components:** Each `localhost:PORT` component is a placeholder
2. **Connect to GraphQL:** Use `apolloClient` to fetch data from services
3. **Add Real Features:** Issue submission, comments, analytics
4. **Testing:** Test all user flows end-to-end

## API Integration Example

```jsx
import { useQuery, useMutation } from '@apollo/client';
import { apolloClient } from '@shared';
import { GET_ISSUES, CREATE_ISSUE } from './queries';

function IssueList() {
  const { data, loading } = useQuery(GET_ISSUES, { client: apolloClient });
  const [createIssue] = useMutation(CREATE_ISSUE, { client: apolloClient });

  return (
    <div>
      {data?.issues.map(issue => (
        <div key={issue.id}>{issue.title}</div>
      ))}
    </div>
  );
}
```
