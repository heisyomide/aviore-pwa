import axios from 'axios';

// Standardized API fallback port across the entire project
const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export const api = axios.create({
  baseURL: BACKEND_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Flag to prevent infinite redirect loops on concurrent 401 failures
let isRedirecting = false;

// 1. Request Interceptor: Attach Auth Bearer Token
api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('aviore_token');

      if (token) {
        // Modern Axios v1.x compliant header setting
        if (config.headers?.set) {
          config.headers.set('Authorization', `Bearer ${token}`);
        } else {
          config.headers = config.headers || {};
          config.headers['Authorization'] = `Bearer ${token}`;
        }
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 2. Response Interceptor: Session Expiration & Auto Cleanup
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Check if error response status is 401 Unauthorized
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        // Clear local credentials
        localStorage.removeItem('aviore_token');
        localStorage.removeItem('aviore_user');

        const currentPath = window.location.pathname;

        // Redirect to login if not already on authentication routes
        if (!currentPath.includes('/login') && !isRedirecting) {
          isRedirecting = true;
          console.warn('Session expired or unauthorized access. Redirecting to login...');
          
          // Use window.location.assign or router dispatch to redirect
          window.location.href = `/login?redirect=${encodeURIComponent(currentPath)}`;
        }
      }
    }
    return Promise.reject(error);
  }
);