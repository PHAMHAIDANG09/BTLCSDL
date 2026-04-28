"use client";

import React, { useState } from "react";
import { Layout, theme } from "antd";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";

const { Content } = Layout;

const SIDEBAR_WIDTH = 260;
const SIDEBAR_COLLAPSED_WIDTH = 80;
const HEADER_HEIGHT = 64;

interface StaffLayoutProps {
  children: React.ReactNode;
  user?: { name: string; email: string; avatar?: string; role?: string };
  onLogout?: () => void;
}

export default function StaffLayout({ children, user, onLogout }: StaffLayoutProps) {
  const [collapsed, setCollapsed] = useState(false);

  const sidebarWidth = collapsed ? SIDEBAR_COLLAPSED_WIDTH : SIDEBAR_WIDTH;

  return (
    <Layout style={{ minHeight: "100vh", background: "#fff" }}>
      {/* Sidebar dùng chung, truyền role="staff" */}
      <Sidebar
        role="staff"
        collapsed={collapsed}
        onCollapse={setCollapsed}
        headerHeight={HEADER_HEIGHT}
      />

      <Layout
        style={{
          marginLeft: sidebarWidth,
          transition: "margin-left 0.2s",
          background: "#fff",
        }}
      >
        <Header
          user={user}
          onLogout={onLogout}
          sidebarWidth={sidebarWidth}
          height={HEADER_HEIGHT}
        />

        <Content
          style={{
            marginTop: HEADER_HEIGHT,
            padding: "24px",
            minHeight: `calc(100vh - ${HEADER_HEIGHT}px)`,
            background: "#fff",
          }}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  );
}
