import { http } from '../lib/api/http';
import type { ApiResponse, User } from '../types';

export interface LoginResponseData {
  accessToken: string;
  refreshToken: string;
  user: User;
}

const DEFAULT_MOCK_USER: User = {
  id: 'usr-admin-01',
  email: 'admin@rebattery.com',
  fullName: 'Quản trị viên Hệ thống REBATT',
  phone: '0901234567',
  role: 'Admin',
  organizationId: 'org-rebatt-system',
  organizationName: 'REBATT Platform HQ',
  organizationType: 'SYSTEM',
};

export const authService = {
  async login(email: string, password: string): Promise<LoginResponseData> {
    try {
      if (import.meta.env.VITE_USE_MOCK === 'true') {
        throw new Error('Mock mode enabled');
      }
      const response = await http.post<ApiResponse<LoginResponseData>>('/auth/login', { email, password });
      const data = response.data.data;
      if (data?.accessToken) {
        localStorage.setItem('token', data.accessToken);
        localStorage.setItem('accessToken', data.accessToken);
        if (data.refreshToken) localStorage.setItem('refreshToken', data.refreshToken);
        if (data.user) localStorage.setItem('user', JSON.stringify(data.user));
      }
      return data;
    } catch (error) {
      console.warn('API call failed or mock mode enabled, falling back to Mock Auth:', error);
      const mockUser = { ...DEFAULT_MOCK_USER, email };
      const mockToken = 'mock-jwt-token-rebattery-demo';
      localStorage.setItem('token', mockToken);
      localStorage.setItem('accessToken', mockToken);
      localStorage.setItem('user', JSON.stringify(mockUser));
      return {
        accessToken: mockToken,
        refreshToken: 'mock-refresh-token',
        user: mockUser,
      };
    }
  },

  async getMe(): Promise<User> {
    try {
      if (import.meta.env.VITE_USE_MOCK === 'true') {
        throw new Error('Mock mode enabled');
      }
      const response = await http.get<ApiResponse<User>>('/auth/me');
      return response.data.data;
    } catch (error) {
      console.warn('API call failed, returning cached/mock user:', error);
      const cached = localStorage.getItem('user');
      if (cached) return JSON.parse(cached);
      return DEFAULT_MOCK_USER;
    }
  },

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
  }
};
