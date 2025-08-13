// Centralized API helper with auth handling
const API_BASE = '';

// Get token from localStorage
const getToken = () => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('cb:auth:token');
};

// Set token in localStorage
const setToken = (token) => {
  if (typeof window === 'undefined') return;
  if (token) {
    localStorage.setItem('cb:auth:token', token);
  } else {
    localStorage.removeItem('cb:auth:token');
  }
};

// API fetch wrapper
export async function apiFetch(endpoint, options = {}) {
  const token = getToken();
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  // Add auth header if token exists
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  try {
    const response = await fetch(`${API_BASE}${endpoint}`, config);
    
    // Handle 401 - trigger logout
    if (response.status === 401) {
      setToken(null);
      localStorage.removeItem('cb:auth:user');
      // Dispatch custom event for auth state change
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('auth:logout'));
      }
      throw new Error('Unauthorized');
    }

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}

// Convenience methods
export const api = {
  get: (endpoint) => apiFetch(endpoint),
  post: (endpoint, data) => apiFetch(endpoint, {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  put: (endpoint, data) => apiFetch(endpoint, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  delete: (endpoint) => apiFetch(endpoint, {
    method: 'DELETE',
  }),
};
