/**
 * Staff Portal Layout
 * Bao bọc tất cả các route dưới /staff/
 */

"use client";

import React, { useEffect, useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";

interface User {
  name: string;
  email: string;
  avatar?: string;
  role?: string;
}

export default function StaffRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { user, isAuthenticated, logout, loadFromStorage } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadFromStorage();
    setIsLoading(false);
  }, [loadFromStorage]);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  if (!isAuthenticated || !user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Đang xác thực...</p>
        </div>
      </div>
    );
  }

  const staffUser = {
    name: user.hoTen,
    email: user.email,
    role: user.role,
  };

  return (
    <MainLayout user={staffUser} onLogout={handleLogout} role="staff">
      {children}
    </MainLayout>
  );
}
