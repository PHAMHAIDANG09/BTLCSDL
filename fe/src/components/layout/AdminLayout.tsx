/**
 * Admin Layout Component
 * Wrapper bọc Sidebar + Header và render children
 */

"use client";

import React, { useState, useEffect } from "react";
import { Layout } from "antd";
import Sidebar from "./Sidebar";
import Header from "./Header";

const { Content } = Layout;

interface User {
  name: string;
  email: string;
  avatar?: string;
  role?: string;
}

interface AdminLayoutProps {
  children: React.ReactNode;
  user?: User;
  onLogout?: () => void;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  children,
  user,
  onLogout,
}) => {
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile screen
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setCollapsed(false);
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const sidebarWidth = collapsed ? 80 : 250;

  return (
    <Layout className="min-h-screen">
      {/* Sidebar - Desktop only */}
      <div className="hidden md:block">
        <Sidebar collapsed={collapsed} onCollapse={setCollapsed} />
      </div>

      {/* Main Content */}
      <Layout
        style={{
          marginLeft: isMobile ? 0 : sidebarWidth,
          transition: "margin-left 0.2s",
        }}
      >
        {/* Header */}
        <Header user={user} onLogout={onLogout} collapsed={collapsed} />

        {/* Content Area */}
        <Content
          className="mt-16 p-4 sm:p-6 bg-gray-50"
          style={{
            minHeight: "calc(100vh - 64px)",
          }}
        >
          {children}
        </Content>

        {/* Footer (Optional) */}
        <footer className="text-center text-gray-500 text-sm py-4 border-t">
          <p>
            &copy; 2024 NextHR - Hệ Thống Quản Trị Nhân Sự. All rights reserved.
          </p>
        </footer>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;
