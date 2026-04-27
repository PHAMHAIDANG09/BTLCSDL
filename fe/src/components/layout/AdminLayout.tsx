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
  const HEADER_HEIGHT = 88;

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
    <Layout className="min-h-screen" hasSider>
      <Sidebar
        collapsed={collapsed}
        onCollapse={setCollapsed}
        isMobile={isMobile}
        headerHeight={HEADER_HEIGHT}
      />

      {/* Main Content */}
      <Layout
        className="admin-main-layout"
        style={{
          marginLeft: isMobile ? 0 : sidebarWidth,
          transition: "margin-left 0.2s",
        }}
      >
        {/* Header */}
        <Header
          user={user}
          onLogout={onLogout}
          isMobile={isMobile}
          sidebarWidth={sidebarWidth}
          height={HEADER_HEIGHT}
        />

        {/* Content Area */}
        <Content
          className="p-4 sm:p-6 bg-slate-100"
          style={{
            marginTop: HEADER_HEIGHT,
            minHeight: `calc(100vh - ${HEADER_HEIGHT}px)`,
          }}
        >
          <div className="rounded-2xl bg-white shadow-sm p-4 sm:p-6 min-h-[calc(100vh-140px)]">
            {children}
          </div>
        </Content>

        {/* Footer (Optional) */}
        <footer className="text-center text-gray-500 text-sm py-4 bg-white/90">
          <p>
            &copy; 2024 NextHR - Hệ Thống Quản Trị Nhân Sự. All rights reserved.
          </p>
        </footer>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;
