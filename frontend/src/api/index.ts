import apiClient, { extractData } from '../lib/apiClient';
import {
  User, Cultivo, TipoSuelo, Fertilizante, Recommendation,
  RecommendationInput, PaginatedResponse, DashboardStats, RecommendationStats
} from '../types';

// ── Auth ──────────────────────────────────────────────────────
export const authApi = {
  login: async (email: string, password: string) => {
    const res = await apiClient.post('/auth/login', { email, password });
    return extractData<{ token: string; user: User }>(res);
  },
  me: async () => {
    const res = await apiClient.get('/auth/me');
    return extractData<User>(res);
  },
  forgotPassword: async (email: string) => {
    const res = await apiClient.post('/auth/forgot-password', { email });
    return extractData<null>(res);
  },
  resetPassword: async (token: string, password: string) => {
    const res = await apiClient.post('/auth/reset-password', { token, password });
    return extractData<null>(res);
  },
  logout: async () => {
    await apiClient.post('/auth/logout');
  },
};

// ── Recommendations ───────────────────────────────────────────
export const recommendationsApi = {
  create: async (data: RecommendationInput) => {
    const res = await apiClient.post('/recommendations', data);
    return extractData<Recommendation>(res);
  },
  getAll: async (params?: Record<string, unknown>) => {
    const res = await apiClient.get('/recommendations', { params });
    return extractData<PaginatedResponse<Recommendation>>(res);
  },
  getById: async (id: number) => {
    const res = await apiClient.get(`/recommendations/${id}`);
    return extractData<Recommendation>(res);
  },
  delete: async (id: number) => {
    const res = await apiClient.delete(`/recommendations/${id}`);
    return extractData<{ deleted: boolean }>(res);
  },
  getStats: async () => {
    const res = await apiClient.get('/recommendations/stats');
    return extractData<RecommendationStats>(res);
  },
};

// ── Admin ─────────────────────────────────────────────────────
export const adminApi = {
  // Dashboard
  getDashboardStats: async () => {
    const res = await apiClient.get('/admin/dashboard');
    return extractData<DashboardStats>(res);
  },

  // Crops
  getCrops: async () => {
    const res = await apiClient.get('/admin/crops');
    return extractData<Cultivo[]>(res);
  },
  createCrop: async (data: Partial<Cultivo>) => {
    const res = await apiClient.post('/admin/crops', data);
    return extractData<Cultivo>(res);
  },
  updateCrop: async (id: number, data: Partial<Cultivo>) => {
    const res = await apiClient.put(`/admin/crops/${id}`, data);
    return extractData<Cultivo>(res);
  },
  deleteCrop: async (id: number) => {
    const res = await apiClient.delete(`/admin/crops/${id}`);
    return extractData<null>(res);
  },

  // Soil types
  getSoilTypes: async () => {
    const res = await apiClient.get('/admin/soil-types');
    return extractData<TipoSuelo[]>(res);
  },

  // Fertilizers
  getFertilizers: async () => {
    const res = await apiClient.get('/admin/fertilizers');
    return extractData<Fertilizante[]>(res);
  },
  getFertilizerById: async (id: number) => {
    const res = await apiClient.get(`/admin/fertilizers/${id}`);
    return extractData<Fertilizante>(res);
  },

  // Users
  getUsers: async () => {
    const res = await apiClient.get('/admin/users');
    return extractData<User[]>(res);
  },
  updateUser: async (id: number, data: Record<string, unknown>) => {
    const res = await apiClient.put(`/admin/users/${id}`, data);
    return extractData<null>(res);
  },
  deleteUser: async (id: number) => {
    const res = await apiClient.delete(`/admin/users/${id}`);
    return extractData<null>(res);
  },

  // Roles
  getRoles: async () => {
    const res = await apiClient.get('/admin/roles');
    return extractData<{ id: number; nombre: string }[]>(res);
  },

  // Manufacturers
  getManufacturers: async () => {
    const res = await apiClient.get('/admin/manufacturers');
    return extractData<{ id: number; nombre: string; pais: string }[]>(res);
  },

  // Nutrients
  getNutrients: async () => {
    const res = await apiClient.get('/admin/nutrients');
    return extractData<unknown[]>(res);
  },

  // Reports
  getReportByCrop: async () => {
    const res = await apiClient.get('/admin/reports/by-crop');
    return extractData<unknown[]>(res);
  },
  getReportByFertilizer: async () => {
    const res = await apiClient.get('/admin/reports/by-fertilizer');
    return extractData<unknown[]>(res);
  },
  getReportBySoil: async () => {
    const res = await apiClient.get('/admin/reports/by-soil');
    return extractData<unknown[]>(res);
  },
  getReportByMonth: async () => {
    const res = await apiClient.get('/admin/reports/by-month');
    return extractData<unknown[]>(res);
  },

  // Config
  getConfig: async () => {
    const res = await apiClient.get('/admin/config');
    return extractData<unknown[]>(res);
  },
  updateConfig: async (clave: string, valor: string) => {
    const res = await apiClient.put(`/admin/config/${clave}`, { valor });
    return extractData<null>(res);
  },
};
