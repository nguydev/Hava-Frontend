import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'http://10.10.28.129:3000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('userToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const productApi = {
  getProducts: async (categoryId?: string) => {
    const params = categoryId ? { categoryId } : {};
    const response = await api.get('/products', { params });
    return response.data;
  },
  getProductById: async (id: string) => {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },
  getCategories: async () => {
    const response = await api.get('/categories');
    return response.data;
  }
};
