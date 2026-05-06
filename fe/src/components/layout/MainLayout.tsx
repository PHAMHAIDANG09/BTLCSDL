/**
 * Main Layout Component
 * Hợp nhất AdminLayout và StaffLayout thành một component duy nhất.
 * Tự động cấu hình Sidebar và Header dựa trên `role`.
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

interface MainLayoutProps {
  children: React.ReactNode;
  user?: User;
  onLogout?: () => void;
  role: "admin" | "staff";
}

export const MainLayout: React.FC<MainLayoutProps> = ({
  children,
  user,
  onLogout,
  role,
}) => {
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const HEADER_HEIGHT = 64;

  // Tự động phát hiện kích thước màn hình
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile && window.innerWidth < 1200) {
        setCollapsed(true);
      } else if (window.innerWidth >= 1200) {
        setCollapsed(false);
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const sidebarWidth = collapsed ? 80 : 260;

  return (
    <Layout className="min-h-screen" hasSider style={{ background: "#fff" }}>
      {/* Sidebar - Tái sử dụng logic phân quyền bên trong Sidebar.tsx */}
      <Sidebar
        role={role}
        collapsed={collapsed}
        onCollapse={setCollapsed}
        isMobile={isMobile}
        headerHeight={HEADER_HEIGHT}
      />

      {/* Main Container */}
      <Layout
        style={{
          marginLeft: isMobile ? 0 : sidebarWidth,
          width: isMobile ? "100%" : `calc(100% - ${sidebarWidth}px)`,
          transition: "margin-left 0.2s, width 0.2s",
          background: "#fff",
        }}
      >
        {/* Header - Tái sử dụng cho cả 2 Portal */}
        <Header
          user={user}
          onLogout={onLogout}
          isMobile={isMobile}
          sidebarWidth={sidebarWidth}
          height={HEADER_HEIGHT}
        />

        {/* Content Area */}
        <Content
          style={{
            marginTop: HEADER_HEIGHT,
            padding: isMobile ? "16px" : "24px 40px",
            minHeight: `calc(100vh - ${HEADER_HEIGHT}px)`,
            background: "#fff",
          }}
        >
          <div style={{ maxWidth: 1600, margin: "0 auto" }}>
            {children}
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout;
