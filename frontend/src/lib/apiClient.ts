import axios, { AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { ApiResponse } from '../types';

const BASE_URL = import.meta.env.VITE_API_URL || '/api/v1';

export const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor — attach JWT token
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('agromind_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor — handle 401 globally
apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('agromind_token');
      localStorage.removeItem('agromind_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const extractData = <T>(response: AxiosResponse<ApiResponse<T>>): T => {
  if (!response.data.success) {
    throw new Error(response.data.message || 'Error en la operación');
  }
  return response.data.data as T;
};

export default apiClient;
