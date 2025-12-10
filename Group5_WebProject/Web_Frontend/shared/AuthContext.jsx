import React, { createContext, useState, useContext, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(() => {
    // First check localStorage
    let storedToken = localStorage.getItem('token');
    
    // If not in localStorage, check URL query parameters
    if (!storedToken) {
      const params = new URLSearchParams(window.location.search);
      storedToken = params.get('token');
      console.log('[AuthContext] Token from URL params:', storedToken ? 'Found' : 'Not found');
      
      // If found in URL, save to localStorage and remove from URL
      if (storedToken) {
        localStorage.setItem('token', storedToken);
        // Clean up URL
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    }
    
    console.log('[AuthContext] Initial token:', storedToken ? 'Found' : 'Not found');
    return storedToken;
  });
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Initialize auth state from stored token
  useEffect(() => {
    // Also check localStorage in case it was updated in another tab/window
    const storedToken = localStorage.getItem('token');
    console.log('[AuthContext] useEffect - storedToken:', storedToken ? 'Found' : 'Not found', 'token state:', token ? 'Found' : 'Not found');
    
    if (storedToken && storedToken !== token) {
      console.log('[AuthContext] Updating token from localStorage');
      setToken(storedToken);
      return;
    }

    if (token) {
      try {
        const decoded = jwtDecode(token);
        console.log('[AuthContext] Token validated, user:', decoded.username);
        setUser(decoded);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('[AuthContext] Invalid token:', error);
        localStorage.removeItem('token');
        setToken(null);
        setIsAuthenticated(false);
      }
    } else {
      console.log('[AuthContext] No token found');
      setIsAuthenticated(false);
    }
    setLoading(false);
  }, [token]);

  const setAuthToken = (newToken) => {
    if (newToken) {
      localStorage.setItem('token', newToken);
      setToken(newToken);
    } else {
      localStorage.removeItem('token');
      setToken(null);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
  };

  const hasRole = (requiredRole) => {
    if (!user) return false;
    return user.role === requiredRole;
  };

  const hasAnyRole = (requiredRoles) => {
    if (!user) return false;
    return requiredRoles.includes(user.role);
  };

  const value = {
    user,
    token,
    loading,
    isAuthenticated,
    setAuthToken,
    logout,
    hasRole,
    hasAnyRole,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
