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
  const [isLoading, setIsLoading] = React.useState(true);

  // Đồng bộ từ localStorage khi hydrate (xử lý SSR)
  useEffect(() => {
    loadFromStorage();
    setIsLoading(false);
  }, [loadFromStorage]);

  // Guard: redirect nếu không auth
  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated || !user) {
        router.push('/login');
      } else if (!ADMIN_ROLES.includes(user.role)) {
        router.replace('/staff/trang-chu');
      }
    }
  }, [isLoading, isAuthenticated, user, router]);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  // Hiển thị loading trong khi kiểm tra auth
  if (isLoading || !isAuthenticated || !user) {
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

