/**
 * Auth Service
 * Bọc các API call liên quan đến xác thực (đăng nhập, đăng xuất, lấy profile)
 */

import api from './api';
import type { LoginRequest, LoginResponse, User } from '@/types/auth';

/**
 * Đăng nhập
 * POST /api/auth/login
 */
export const loginApi = async (credentials: LoginRequest): Promise<LoginResponse> => {
  const response = await api.post<LoginResponse>('/auth/login', credentials);
  // api.ts interceptor trả về response.data trực tiếp
  return response as unknown as LoginResponse;
};

/**
 * Lấy thông tin profile người dùng hiện tại
 * GET /api/auth/profile
 */
export const getProfileApi = async (): Promise<User> => {
  const response = await api.get<User>('/auth/profile');
  return response as unknown as User;
};

/**
 * Cập nhật thông tin profile
 * PATCH /api/auth/profile
 */
export const updateProfileApi = async (data: any): Promise<User> => {
  const response = await api.patch<User>('/auth/profile', data);
  return response as unknown as User;
};

/**
 * Đổi mật khẩu
 * POST /api/auth/change-password
 */
export const changePasswordApi = async (data: any): Promise<any> => {
  const response = await api.post('/auth/change-password', data);
  return response;
};

/**
 * Đăng xuất (client-side only – backend không có session)
 * Chỉ cần xoá token ở localStorage và Zustand
 */
export const logoutApi = async (): Promise<void> => {
  // Nếu backend có endpoint logout thì gọi ở đây
  // await api.post('/auth/logout');
};
