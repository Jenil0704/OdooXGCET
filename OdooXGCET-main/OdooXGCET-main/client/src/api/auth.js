import axios from 'axios';

const SERVER_URL = import.meta.env.VITE_SERVER_URL || 'http://localhost:3000';

// Create axios instance with default config
const api = axios.create({
  baseURL: SERVER_URL,
  withCredentials: true,
});

// Add token to requests if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

const authApi = {
  login: async (loginId, password) => {
    try {
      const response = await api.post('/api/auth/login', { loginId, password });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  registerEmployee: async (employeeData) => {
    try {
      const response = await api.post('/api/auth/register-employee', employeeData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  getCurrentUser: async () => {
    try {
      const response = await api.get('/api/auth/me');
      return response.data.data.user;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  changePassword: async (currentPassword, newPassword) => {
    try {
      const response = await api.post('/api/auth/change-password', {
        currentPassword,
        newPassword,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  getAllEmployees: async () => {
    try {
      const response = await api.get('/api/auth/employees');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  getAllEmployeesView: async () => {
    try {
      const response = await api.get('/api/auth/employees/view');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
};

export default authApi;