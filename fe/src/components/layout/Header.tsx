/**
 * Header Component
 * Chứa Breadcrumbs, Avatar, Notifications, User Info
 */

"use client";

import React from "react";
import {
  Layout,
  Breadcrumb,
  Avatar,
  Dropdown,
  Space,
  Badge,
  Button,
  type MenuProps,
} from "antd";
import {
  UserOutlined,
  LogoutOutlined,
  BellOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const { Header: AntHeader } = Layout;

interface User {
  name: string;
  email: string;
  avatar?: string;
  role?: string;
}

interface HeaderProps {
  user?: User;
  onLogout?: () => void;
  isMobile?: boolean;
  sidebarWidth?: number;
  height?: number;
}

const getBreadcrumbs = (
  pathname: string,
): Array<{ title: React.ReactNode; href?: string }> => {
  const segments = pathname.split("/").filter((seg) => seg && seg !== "admin");
  const breadcrumbs: Array<{ title: React.ReactNode; href?: string }> = [
    {
      title: <Link href="/admin/dashboard">Dashboard</Link>,
      href: "/admin/dashboard",
    },
  ];

  let path = "/admin";
  segments.forEach((segment, index) => {
    path += `/${segment}`;
    const isLast = index === segments.length - 1;
    const label = segment.charAt(0).toUpperCase() + segment.slice(1);

    if (!isLast) {
      breadcrumbs.push({
        title: <Link href={path}>{label}</Link>,
        href: path,
      });
    } else {
      breadcrumbs.push({
        title: label,
      });
    }
  });

  return breadcrumbs;
};

export const Header: React.FC<HeaderProps> = ({
  user,
  onLogout,
  isMobile = false,
  sidebarWidth = 250,
  height = 88,
}) => {
  const pathname = usePathname();
  const router = useRouter();
  const notificationCount = 3;

  const breadcrumbs = getBreadcrumbs(pathname);

  const userMenuItems: MenuProps["items"] = [
    {
      key: "profile",
      icon: <UserOutlined />,
      label: "Hồ sơ cá nhân",
      onClick: () => router.push("/admin/profile"),
    },
    {
      key: "settings",
      icon: <SettingOutlined />,
      label: "Cài đặt",
      onClick: () => router.push("/admin/settings"),
    },
    {
      type: "divider",
    },
    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: "Đăng xuất",
      danger: true,
      onClick: () => {
        if (onLogout) {
          onLogout();
        } else {
          localStorage.removeItem("token");
          router.push("/login");
        }
      },
    },
  ];

  return (
    <AntHeader
      className="bg-white/95 backdrop-blur flex items-center justify-between px-4 sm:px-6"
      style={{
        position: "fixed",
        top: 0,
        right: 0,
        left: isMobile ? 0 : `${sidebarWidth}px`,
        width: isMobile ? "100%" : `calc(100% - ${sidebarWidth}px)`,
        height,
        zIndex: 1000,
        backgroundColor: "#fff",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
        transition: "left 0.2s, width 0.2s",
      }}
    >
      {/* Breadcrumbs */}
      <div className="flex-1 min-w-0 pr-4">
        <Breadcrumb items={breadcrumbs} />
      </div>

      {/* Right Side: Notifications + User Menu */}
      <Space size="large">
        {/* Notifications */}
        <Button
          type="text"
          icon={
            <Badge count={notificationCount} color="#ff4d4f">
              <BellOutlined style={{ fontSize: "18px" }} />
            </Badge>
          }
          onClick={() => router.push("/admin/notifications")}
          className="hover:bg-gray-100"
        />

        {/* User Avatar & Dropdown */}
        <Dropdown menu={{ items: userMenuItems }} trigger={["click"]}>
          <div className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 px-3 py-1 rounded">
            <Avatar size="large" icon={<UserOutlined />} src={user?.avatar} />
            <div className="hidden sm:block">
              <p className="text-sm font-medium mb-0">
                {user?.name || "Admin"}
              </p>
              <p className="text-xs text-gray-500 mb-0">
                {user?.role || "Administrator"}
              </p>
            </div>
          </div>
        </Dropdown>
      </Space>
    </AntHeader>
  );
};

export default Header;
