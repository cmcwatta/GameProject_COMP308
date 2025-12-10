// Export all shared authentication and API modules
export { default as AuthContext, useAuth, AuthProvider } from './AuthContext';
export { default as apolloClient, createServiceClient } from './apiClient';
export { default as ProtectedRoute } from './ProtectedRoute';
