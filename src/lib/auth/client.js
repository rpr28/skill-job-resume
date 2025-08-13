import { createContext, useContext, useEffect, useState } from 'react';
import { api } from '../api';

// Auth context
const AuthContext = createContext();

// Auth provider component
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize auth state from localStorage
  useEffect(() => {
    const savedToken = localStorage.getItem('cb:auth:token');
    const savedUser = localStorage.getItem('cb:auth:user');
    
    if (savedToken && savedUser) {
      try {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('Failed to parse saved user:', error);
        localStorage.removeItem('cb:auth:token');
        localStorage.removeItem('cb:auth:user');
      }
    }
    setLoading(false);
  }, []);

  // Listen for logout events
  useEffect(() => {
    const handleLogout = () => {
      setUser(null);
      setToken(null);
    };

    window.addEventListener('auth:logout', handleLogout);
    return () => window.removeEventListener('auth:logout', handleLogout);
  }, []);

  // Login function
  const login = async (email, password) => {
    try {
      const response = await api.post('/api/auth/login', { email, password });
      
      setToken(response.token);
      setUser(response.user);
      
      localStorage.setItem('cb:auth:token', response.token);
      localStorage.setItem('cb:auth:user', JSON.stringify(response.user));
      
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // Signup function
  const signup = async (name, email, password) => {
    try {
      const response = await api.post('/api/auth/signup', { name, email, password });
      
      setToken(response.token);
      setUser(response.user);
      
      localStorage.setItem('cb:auth:token', response.token);
      localStorage.setItem('cb:auth:user', JSON.stringify(response.user));
      
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // Logout function
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('cb:auth:token');
    localStorage.removeItem('cb:auth:user');
  };

  // Verify token on mount
  const verifyToken = async () => {
    if (!token) return;
    
    try {
      const response = await api.get('/api/auth/me');
      setUser(response.user);
      localStorage.setItem('cb:auth:user', JSON.stringify(response.user));
    } catch (error) {
      console.error('Token verification failed:', error);
      logout();
    }
  };

  // Verify token when token changes
  useEffect(() => {
    if (token) {
      verifyToken();
    }
  }, [token]);

  const value = {
    user,
    token,
    loading,
    isAuthenticated: !!user && !!token,
    login,
    signup,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook to use auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
