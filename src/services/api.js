import axios from 'axios';

// Get base URL from environment variable or default to localhost Express backend
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to request headers if present in localStorage
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('petzone_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Unified response error interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear token if unauthorized
      localStorage.removeItem('petzone_token');
      localStorage.removeItem('petzone_user');
    }
    
    // Normalize error message
    const message = 
      error.response?.data?.message || 
      error.response?.data?.error || 
      error.message || 
      'An unexpected network error occurred';

    return Promise.reject({
      message,
      status: error.response?.status,
      data: error.response?.data,
      isNetworkError: !error.response,
    });
  }
);

export default api;
