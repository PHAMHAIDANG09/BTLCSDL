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
  const HEADER_HEIGHT = 64;

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

  const sidebarWidth = collapsed ? 80 : 260;

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
          width: isMobile ? '100%' : `calc(100% - ${sidebarWidth}px)`,
          transition: "margin-left 0.2s, width 0.2s",
          backgroundColor: "#fff",
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
          className="p-6 sm:p-10 overflow-y-auto bg-white"
          style={{
            marginTop: HEADER_HEIGHT,
            minHeight: `calc(100vh - ${HEADER_HEIGHT}px)`,
          }}
        >
          <div style={{ minHeight: `calc(100vh - ${HEADER_HEIGHT}px - 64px)` }}>
            {children}
          </div>
        </Content>

      </Layout>
    </Layout>
  );
};

export default AdminLayout;
