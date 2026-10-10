import api from './api';

const TOKEN_KEY = 'petzone_token';
const USER_KEY = 'petzone_user';

export const authService = {
  // Login user
  async login(email, password) {
    try {
      const response = await api.post('/auth/login', { email, password });
      const { token, user } = response.data;
      
      if (token) localStorage.setItem(TOKEN_KEY, token);
      if (user) localStorage.setItem(USER_KEY, JSON.stringify(user));
      
      return { success: true, user, token, isDemo: false };
    } catch (error) {
      // If network error (backend not running), use transparent demo adapter with notification
      if (error.isNetworkError || error.status === 404) {
        console.warn('Backend API unavailable. Falling back to frontend demo authentication mode.');
        
        // Demo fallback validation
        if (!email || !password) {
          throw { message: 'Please enter both email and password.' };
        }

        // Retrieve existing demo user or generate demo session
        const storedUser = localStorage.getItem(USER_KEY);
        let user = storedUser ? JSON.parse(storedUser) : null;

        if (!user || user.email !== email) {
          user = {
            id: 'demo-user-101',
            name: email.split('@')[0].replace('.', ' ') || 'Demo Customer',
            email: email,
            phone: '+91 98765 43210',
            address: '123 Pet Lovers Lane, Green Park',
            city: 'Bengaluru',
            state: 'Karnataka',
            pincode: '560001',
            role: 'customer'
          };
        }

        const token = 'demo-jwt-token-petzone-' + Date.now();
        localStorage.setItem(TOKEN_KEY, token);
        localStorage.setItem(USER_KEY, JSON.stringify(user));

        return {
          success: true,
          user,
          token,
          isDemo: true,
          notice: 'Signed in using Demo Adapter (Backend API not connected).'
        };
      }
      throw error;
    }
  },

  // Register user
  async register(userData) {
    try {
      const response = await api.post('/auth/register', userData);
      return { success: true, data: response.data, isDemo: false };
    } catch (error) {
      if (error.isNetworkError || error.status === 404) {
        console.warn('Backend API unavailable. Registering user via demo adapter.');
        
        const demoUser = {
          id: 'demo-user-' + Date.now(),
          name: userData.name,
          email: userData.email,
          phone: userData.phone || '',
          address: '',
          city: '',
          state: '',
          pincode: '',
          role: 'customer'
        };

        // Save demo user in localStorage for login step
        localStorage.setItem(USER_KEY, JSON.stringify(demoUser));

        return {
          success: true,
          user: demoUser,
          isDemo: true,
          notice: 'Registration simulated in Demo Mode. You can now login!'
        };
      }
      throw error;
    }
  },

  // Fetch Current Profile
  async getProfile() {
    try {
      const response = await api.get('/auth/me');
      const user = response.data.user || response.data;
      localStorage.setItem(USER_KEY, JSON.stringify(user));
      return { success: true, user, isDemo: false };
    } catch (error) {
      if (error.isNetworkError || error.status === 404) {
        const storedUser = localStorage.getItem(USER_KEY);
        if (storedUser) {
          return { success: true, user: JSON.parse(storedUser), isDemo: true };
        }
      }
      throw error;
    }
  },

  // Update Profile
  async updateProfile(profileData) {
    try {
      const response = await api.put('/auth/profile', profileData);
      const updatedUser = response.data.user || response.data;
      localStorage.setItem(USER_KEY, JSON.stringify(updatedUser));
      return { success: true, user: updatedUser, isDemo: false };
    } catch (error) {
      if (error.isNetworkError || error.status === 404) {
        const storedUser = localStorage.getItem(USER_KEY);
        const currentUser = storedUser ? JSON.parse(storedUser) : {};
        const updatedUser = { ...currentUser, ...profileData };
        
        localStorage.setItem(USER_KEY, JSON.stringify(updatedUser));
        return {
          success: true,
          user: updatedUser,
          isDemo: true,
          notice: 'Profile updated locally (Demo Mode active).'
        };
      }
      throw error;
    }
  },

  // Logout
  logout() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },

  // Utility to check stored state
  getCurrentUser() {
    const userStr = localStorage.getItem(USER_KEY);
    return userStr ? JSON.parse(userStr) : null;
  },

  getToken() {
    return localStorage.getItem(TOKEN_KEY);
  }
};
