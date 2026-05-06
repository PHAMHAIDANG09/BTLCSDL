/**
 * Admin Portal Layout
 * Sử dụng AdminLayout wrapper cho tất cả admin routes
 * Kiểm tra quyền admin qua authStore
 */

'use client';

import React, { useEffect } from 'react';
import MainLayout from "../../components/layout/MainLayout";
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { ADMIN_ROLES } from '@/constants/role';

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { user, isAuthenticated, logout, loadFromStorage } = useAuthStore();

  // Đồng bộ từ localStorage khi hydrate (xử lý SSR)
  useEffect(() => {
    loadFromStorage();
  }, [loadFromStorage]);

  // Guard: redirect về login nếu chưa xác thực
  useEffect(() => {
    if (!isAuthenticated || !user) {
      router.replace('/login');
      return;
    }
    // Guard: nếu không phải Admin/Manager → redirect về staff
    if (!ADMIN_ROLES.includes(user.role)) {
      router.replace('/staff/home');
    }
  }, [isAuthenticated, user]); // Stabilize dependency array

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  // Hiển thị loading trong khi kiểm tra auth
  if (!isAuthenticated || !user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-500">Đang xác thực...</p>
        </div>
      </div>
    );
  }

  // Map user từ authStore sang format AdminLayout cần
  const adminUser = {
    name: user.hoTen,
    email: user.email,
    role: user.role,
  };

  return (
    <MainLayout user={adminUser} onLogout={handleLogout} role="admin">
      {children}
    </MainLayout>
  );
}

