import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://mindmess.runasp.net/api',
  withCredentials: false,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach token later via interceptor
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;