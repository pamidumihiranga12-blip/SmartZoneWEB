import axios from 'axios';
import { useStore } from '../store/useStore';

// Since this is a frontend-only build (vite-plugin-singlefile),
// we'll use a mock/localStorage-based backend that simulates MongoDB operations.
// In production, replace API_BASE with your actual backend URL.

const API_BASE = 'https://api.smartzonelk.com'; // Replace with your backend URL

const api = axios.create({
  baseURL: API_BASE,
  timeout: 10000,
});

api.interceptors.request.use((config) => {
  const user = useStore.getState().user;
  if (user?.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useStore.getState().logout();
    }
    return Promise.reject(error);
  }
);

export default api;
