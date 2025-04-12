import axios from 'axios';
import Cookies from 'js-cookie';
import { Chemical, Location } from '@/types/inventory';

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
    
    // Only attempt token refresh for authenticated requests that aren't auth-related
    const isAuthRequest = originalRequest.url?.includes('/token/');
    
    // Handle 401 errors - token expired, needs refresh
    if (error.response?.status === 401 && !originalRequest._retry && !isAuthRequest) {
      originalRequest._retry = true;

      try {
        const refreshToken = Cookies.get('refreshToken');
        if (!refreshToken) throw new Error('No refresh token available');

        const response = await authAPI.refreshToken(refreshToken);
        const { access, refresh } = response;

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
    
    // Handle 403 errors - forbidden, insufficient permissions
    if (error.response?.status === 403) {
      console.warn('Access forbidden:', originalRequest.url);
      
      // In development mode, we can continue with mock data
      if (process.env.NODE_ENV === 'development') {
        // Let the specific API methods handle providing mock data
        console.log('Development mode: API call forbidden, will use mock data');
        
        // Don't count this as a real error in development
        return Promise.reject({
          ...error,
          handled: true,
          message: 'Forbidden: Using mock data in development mode'
        });
      }
      
      // In production, we should handle forbidden errors appropriately
      // For now, we'll just reject with the error
      return Promise.reject(error);
    }

    return Promise.reject(error);
  }
);

export const authAPI = {
  login: async (email: string, password: string) => {
    try {
      const response = await api.post('/api/users/token/', { email, password });
      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },
  refreshToken: async (refresh: string) => {
    const response = await api.post('/api/users/token/refresh/', { refresh });
    return response.data;
  },
  logout: () => {
    // Remove authentication tokens from cookies
    Cookies.remove('token');
    Cookies.remove('refreshToken');
  },
};

export const usersAPI = {
  getCurrentUser: async () => {
    try {
      const response = await api.get('/api/users/me/');
      return response.data;
    } catch (error) {
      console.error('Error fetching current user:', error);
      if (process.env.NODE_ENV === 'development') {
        console.log('Using mock data for current user in development');
        // Return a mock admin user in development
        return { 
          id: '1', 
          first_name: 'John', 
          last_name: 'Doe', 
          email: 'john@example.com', 
          role: 'admin',
          join_date: new Date().toISOString(),
          is_active: true 
        };
      }
      throw error;
    }
  },
  getUsers: async () => {
    try {
      const response = await api.get('/api/users/');
      return response.data;
    } catch (error) {
      console.error('Error fetching users:', error);
      if (process.env.NODE_ENV === 'development') {
        console.log('Using mock data for users in development');
        // Import mockUsers from types
        const { mockUsers } = require('@/types/user');
        return mockUsers;
      }
      throw error;
    }
  },
  getUserById: async (id: string) => {
    try {
      const response = await api.get(`/api/users/${id}/`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching user ${id}:`, error);
      throw error;
    }
  },
  createUser: async (userData: any) => {
    try {
      const response = await api.post('/api/users/', userData);
      return response.data;
    } catch (error) {
      console.error('Error creating user:', error);
      if (process.env.NODE_ENV === 'development') {
        console.log('Using mock data for user creation in development');
        // Return a mock successful response
        return {
          ...userData,
          id: Date.now().toString(),
          join_date: new Date().toISOString()
        };
      }
      throw error;
    }
  },
  updateUser: async (id: string, userData: any) => {
    try {
      const response = await api.patch(`/api/users/${id}/`, userData);
      return response.data;
    } catch (error) {
      console.error(`Error updating user ${id}:`, error);
      if (process.env.NODE_ENV === 'development') {
        console.log(`Using mock data for updating user ${id} in development`);
        // Return the updated data
        return {
          id,
          ...userData,
          updated_at: new Date().toISOString()
        };
      }
      throw error;
    }
  },
  deleteUser: async (id: string) => {
    try {
      const response = await api.delete(`/api/users/${id}/`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting user ${id}:`, error);
      if (process.env.NODE_ENV === 'development') {
        console.log(`Using mock data for deleting user ${id} in development`);
        // Return a success response
        return { success: true };
      }
      throw error;
    }
  },
};

export const inventoryAPI = {
  // CHEMICAL ENDPOINTS
  
  // Get all chemicals
  getChemicals: async (filters = {}): Promise<Chemical[]> => {
    const response = await api.get('/api/chemical/', { params: filters });
    return response.data;
  },
  
  // Get a single chemical by ID
  getChemicalById: async (id: string): Promise<Chemical> => {
    const response = await api.get(`/api/chemical/${id}/`);
    return response.data;
  },
  
  // Create a new chemical
  addChemical: async (chemical: Partial<Chemical>): Promise<Chemical> => {
    const response = await api.post('/api/chemical/', chemical);
    return response.data;
  },
  
  // Update a chemical
  updateChemical: async (id: string, updates: Partial<Chemical>): Promise<Chemical> => {
    const response = await api.patch(`/api/chemical/${id}/`, updates);
    return response.data;
  },
  
  // Delete a chemical
  deleteChemical: async (id: string): Promise<void> => {
    await api.delete(`/api/chemical/${id}/`);
  },
  
  // LOCATION ENDPOINTS
  
  // Get all locations
  getLocations: async (): Promise<Location[]> => {
    const response = await api.get('/api/location/');
    return response.data;
  },
  
  // Get a single location by ID
  getLocationById: async (id: string): Promise<Location> => {
    const response = await api.get(`/api/location/${id}/`);
    return response.data;
  },
  
  // Create a new location
  addLocation: async (location: Partial<Location>): Promise<Location> => {
    const response = await api.post('/api/location/', location);
    return response.data;
  },
  
  // Update a location
  updateLocation: async (id: string, updates: Partial<Location>): Promise<Location> => {
    const response = await api.patch(`/api/location/${id}/`, updates);
    return response.data;
  },
  
  // Delete a location
  deleteLocation: async (id: string): Promise<void> => {
    await api.delete(`/api/location/${id}/`);
  },
  
  // Dashboard
  getDashboardOverview: async () => {
    const response = await api.get('/api/dashboard/overview/');
    return response.data;
  },

  // Reports
  generateReport: async (params: { 
    format: 'pdf' | 'excel', 
    report_type: string,
    start_date?: string,
    end_date?: string
  }) => {
    try {
      // Log request parameters for debugging
      console.log('Generating report with params:', params);
      
      // Build query parameters
      const queryParams = new URLSearchParams();
      if (params.start_date) queryParams.append('start_date', params.start_date);
      if (params.end_date) queryParams.append('end_date', params.end_date);
      if (params.format) queryParams.append('format', params.format);
      
      // Try both URL formats (with and without /api prefix)
      // This ensures we can work with any backend URL structure
      const urls = [
        `${API_URL}/reports/${params.report_type}/?${queryParams.toString()}`,  // Direct URL (no /api)
        `${API_URL}/api/reports/${params.report_type}/?${queryParams.toString()}` // API URL
      ];
      
      // Set headers for authorization and content type
      const token = Cookies.get('token');
      const headers = {
        'Authorization': token ? `Bearer ${token}` : '',
        'Accept': params.format === 'pdf' 
          ? 'application/pdf' 
          : 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      };
      
      // Try each URL in sequence until one works
      let response = null;
      let error = null;
      
      // First try the direct URL
      try {
        console.log('Attempting to fetch report from:', urls[0]);
        response = await fetch(urls[0], {
          method: 'GET',
          headers,
          credentials: 'include'
        });
        
        if (response.ok) {
          console.log('Successfully fetched report from direct URL');
          return await response.blob();
        }
      } catch (err) {
        console.error('Error with direct URL:', err);
        error = err;
      }
      
      // If first attempt failed, try the API URL
      if (!response || !response.ok) {
        console.log('Direct URL failed, trying API URL:', urls[1]);
        try {
          response = await fetch(urls[1], {
            method: 'GET',
            headers,
            credentials: 'include'
          });
          
          if (response.ok) {
            console.log('Successfully fetched report from API URL');
            return await response.blob();
          } else {
            throw new Error(`Failed with status: ${response.status} ${response.statusText}`);
          }
        } catch (err) {
          console.error('Error with API URL:', err);
          error = err;
        }
      }
      
      // If we get here, both attempts failed
      throw error || new Error('Failed to generate report from all endpoints');
    } catch (error) {
      console.error('Error in generateReport:', error);
      throw error;
    }
  },
};

export const qrCodeAPI = {
  // Get all QR codes
  getQRCodes: async () => {
    try {
      const response = await api.get('/api/qr-codes/');
      return response.data;
    } catch (error) {
      console.error('Error fetching QR codes:', error);
      if (process.env.NODE_ENV === 'development') {
        console.log('Using mock data for QR codes in development');
        // Import mockQRCodes from types
        const { mockQRCodes } = require('@/types/user');
        return mockQRCodes;
      }
      throw error;
    }
  },
  
  // Get a single QR code by ID
  getQRCodeById: async (id: string) => {
    try {
      const response = await api.get(`/api/qr-codes/${id}/`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching QR code ${id}:`, error);
      if (process.env.NODE_ENV === 'development') {
        console.log(`Using mock data for QR code ${id} in development`);
        // Import mockQRCodes from types and find the QR code
        const { mockQRCodes } = require('@/types/user');
        const qrCode = mockQRCodes.find(code => code.id === id);
        if (qrCode) {
          return qrCode;
        }
      }
      throw error;
    }
  },
  
  // Generate a new QR code (only used in production)
  generateQRCode: async (data: { chemical_id: string, chemical_name: string }) => {
    try {
      const response = await api.post('/api/qr-codes/', data);
      return response.data;
    } catch (error) {
      console.error('Error generating QR code:', error);
      if (process.env.NODE_ENV === 'development') {
        console.log('Using mock data for QR code generation in development');
        // Return a mock successful response
        return {
          id: Date.now().toString(),
          chemical_id: data.chemical_id,
          chemical_name: data.chemical_name,
          date_created: new Date().toISOString(),
          created_by: '1' // Assuming user ID 1 is the current user
        };
      }
      throw error;
    }
  },
  
  // Delete a QR code
  deleteQRCode: async (id: string) => {
    try {
      await api.delete(`/api/qr-codes/${id}/`);
      return { success: true };
    } catch (error) {
      console.error(`Error deleting QR code ${id}:`, error);
      if (process.env.NODE_ENV === 'development') {
        console.log(`Using mock data for deleting QR code ${id} in development`);
        // Return a success response
        return { success: true };
      }
      throw error;
    }
  }
};

export default api;
