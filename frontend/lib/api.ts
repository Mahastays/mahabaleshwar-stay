import axios from 'axios';
import { auth } from './firebase';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
});

// Add a request interceptor to attach the Firebase token
api.interceptors.request.use(
  async (config) => {
    // Check for admin custom token
    const adminToken = typeof window !== 'undefined' ? localStorage.getItem('adminToken') : null;
    if (adminToken) {
      config.headers['Authorization'] = `Bearer ${adminToken}`;
      return config;
    }

    // Fallback to Firebase token
    const user = auth.currentUser;
    if (user) {
      const token = await user.getIdToken();
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
