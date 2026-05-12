/**
 * Auth Store - Zustand
 * Quản lý trạng thái đăng nhập: token, user info, role
 * Sử dụng persist middleware để lưu vào localStorage
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AuthState, User } from '@/types/auth';

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      // ============ STATE ============
      token: null,
      user: null,
      isAuthenticated: false,
      isLoading: false,

      // ============ ACTIONS ============

      /**
       * Lưu token và user sau khi đăng nhập thành công
       */
      setAuth: (token: string, user: User) => {
        // Lưu vào localStorage thủ công để middleware đọc được
        if (typeof window !== 'undefined') {
          localStorage.setItem('token', token);
          localStorage.setItem('user', JSON.stringify(user));
          // Lưu vào cookie để Next.js middleware đọc được (server-side)
          document.cookie = `auth_token=${token}; path=/; max-age=86400; SameSite=Lax`;
          document.cookie = `user_role=${user.role}; path=/; max-age=86400; SameSite=Lax`;
        }
        set({ token, user, isAuthenticated: true });
      },

      /**
       * Xoá toàn bộ thông tin đăng nhập
       */
      logout: () => {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          // Xoá cookie
          document.cookie = 'auth_token=; path=/; max-age=0';
          document.cookie = 'user_role=; path=/; max-age=0';
        }
        set({ token: null, user: null, isAuthenticated: false });
      },

      /**
       * Set trạng thái loading
       */
      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },

      /**
       * Đồng bộ state từ localStorage khi app khởi động
       * (dùng trong layout hoặc Provider)
       */
      loadFromStorage: () => {
        if (typeof window === 'undefined') return;
        try {
          const token = localStorage.getItem('token');
          const userJson = localStorage.getItem('user');
          if (token && userJson) {
            const user = JSON.parse(userJson) as User;
            // Đồng bộ lại cookie nếu bị thiếu (ví dụ sau khi refresh trang mà cookie hết hạn)
            if (!document.cookie.includes('auth_token=')) {
              document.cookie = `auth_token=${token}; path=/; max-age=86400; SameSite=Lax`;
              document.cookie = `user_role=${user.role}; path=/; max-age=86400; SameSite=Lax`;
            }
            set({ token, user, isAuthenticated: true });
          }
        } catch {
          // Nếu dữ liệu bị corrupt, xoá đi
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
      },
    }),
    {
      name: 'auth-store',
      // Chỉ persist những field cần thiết
      partialize: (state) => ({
        token: state.token,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
      // Khi hydrate lại state từ localStorage, kiểm tra và khôi phục cookie
      onRehydrateStorage: () => (state) => {
        if (state && state.isAuthenticated && state.token && state.user) {
          if (typeof document !== 'undefined' && !document.cookie.includes('auth_token=')) {
            document.cookie = `auth_token=${state.token}; path=/; max-age=86400; SameSite=Lax`;
            document.cookie = `user_role=${state.user.role}; path=/; max-age=86400; SameSite=Lax`;
          }
        }
      },
    },
  ),
);

export default useAuthStore;
