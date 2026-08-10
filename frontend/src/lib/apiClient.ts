import axios, { AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { ApiResponse } from '../types';

// Se establece la URL del backend en Render como fallback directo en producción
const BASE_URL = import.meta.env.VITE_API_URL || 'https://backend-service-ue3f.onrender.com/api/v1';

export const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor de peticiones — adjunta el token JWT
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

// Interceptor de respuestas — manejo global de sesión expirada (401)
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