import axios from 'axios';
import Cookies from 'js-cookie';

// Ensure API_URL always has a value and ends without a trailing slash
const API_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000').replace(/\/$/, '');

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = Cookies.get('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // Avoid intercepting blob responses that might be reports
    if (originalRequest.responseType === 'blob') {
      return Promise.reject(error);
    }
    
    // Only attempt token refresh for authenticated requests that aren't auth-related
    const isAuthRequest = originalRequest.url?.includes('/token/');
    
    // Handle 401 errors - token expired, needs refresh
    if (error.response?.status === 401 && !originalRequest._retry && !isAuthRequest) {
      originalRequest._retry = true;

      try {
        const refreshToken = Cookies.get('refreshToken');
        if (!refreshToken) throw new Error('No refresh token available');

        const response = await axios.post(`${API_URL}/api/users/token/refresh/`, { 
          refresh: refreshToken 
        });
        
        const { access, refresh } = response.data;

        // Update tokens
        Cookies.set('token', access);
        Cookies.set('refreshToken', refresh);

        // Retry the original request
        originalRequest.headers.Authorization = `Bearer ${access}`;
        return api(originalRequest);
      } catch (refreshError) {
        // If refresh fails, redirect to login
        Cookies.remove('token');
        Cookies.remove('refreshToken');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

export default api; 