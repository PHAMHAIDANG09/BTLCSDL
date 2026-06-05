/**
 * Auth Types
 * Định nghĩa kiểu dữ liệu cho toàn bộ luồng Authentication
 */

/** Vai trò người dùng trong hệ thống */
export type UserRole = 'Admin' | 'Manager' | 'Staff';

/** Thông tin người dùng sau khi đăng nhập */
export interface User {
  id: number;
  hoTen: string;
  email: string;
  maNhanVien: string;
  role: UserRole | string;
}

/** Request body gửi lên backend khi đăng nhập */
export interface LoginRequest {
  email: string;
  password: string;
}

/** Response từ backend sau khi đăng nhập thành công */
export interface LoginResponse {
  access_token: string;
  user: User;
}

/** Trạng thái auth trong Zustand store */
export interface AuthState {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  // Actions
  setAuth: (token: string, user: User) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
  loadFromStorage: () => void;
  updateUser: (updatedUser: Partial<User>) => void;
}
