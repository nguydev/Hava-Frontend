import axios from 'axios';

// Ensure you set this to your backend IP address/domain
const API_URL = 'http://10.10.28.129:3000/api'; // Update appropriately

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const authApi = {
  login: async (data: any) => {
    const response = await api.post('/auth/login', data);
    return response.data;
  },
  register: async (data: any) => {
    const response = await api.post('/auth/register', data);
    return response.data;
  },
  forgotPassword: async (data: any) => {
    const response = await api.post('/auth/forgot-password', data);
    return response.data;
  },
  verifyOtp: async (data: any) => {
    const response = await api.post('/auth/verify-otp', data);
    return response.data;
  },
  resetPassword: async (data: any) => {
    const response = await api.post('/auth/reset-password', data);
    return response.data;
  },
  getMe: async (token: string) => {
    const response = await api.get('/auth/me', {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  }
};
