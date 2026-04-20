import axios from 'axios';

const api = axios.create({
  // 10.0.2.2 is the official Android Emulator IP to reach your Windows localhost
  baseURL: 'http://10.0.2.2:5141/api', 
  timeout: 1000, 
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.log('🚀 ATTEMPTED URL:', error.config?.url);
    console.log('🚀 FULL BASE URL:', error.config?.baseURL);
    console.error('API Error:', error?.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default api;