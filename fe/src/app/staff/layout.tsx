/**
 * Staff Portal Layout
 * Bao bọc tất cả các route dưới /staff/
 */

"use client";

import React, { useEffect, useState } from "react";
import StaffLayout from "@/components/layout/StaffLayout";
import { useRouter } from "next/navigation";

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
  const [user, setUser] = useState<User | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const userJson = localStorage.getItem("user");
      if (userJson) {
        const userData = JSON.parse(userJson);
        setUser(userData);
      }
      setIsLoading(false);
    } catch (error) {
      console.error("Failed to load user:", error);
      setIsLoading(false);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/login");
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Đang tải...</p>
        </div>
      </div>
    );
  }

  return (
    <StaffLayout user={user} onLogout={handleLogout}>
      {children}
    </StaffLayout>
  );
}
