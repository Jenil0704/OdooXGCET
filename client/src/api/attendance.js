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

const attendanceApi = {
  checkIn: async () => {
    try {
      const response = await api.post('/api/attendance/check-in');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  checkOut: async () => {
    try {
      const response = await api.post('/api/attendance/check-out');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  getTodayAttendance: async () => {
    try {
      const response = await api.get('/api/attendance/today');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  getMyAttendance: async (startDate, endDate) => {
    try {
      const params = {};
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;
      const response = await api.get('/api/attendance/my-attendance', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  getAllEmployeesAttendance: async (startDate, endDate) => {
    try {
      const params = {};
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;
      const response = await api.get('/api/attendance/all', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
};

export default attendanceApi;

