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

const SEGMENT_MAP: Record<string, string> = {
  dashboard: "Bảng điều khiển",
  staff: "Nhân viên",
  attendance: "Chấm công",
  "cham-cong": "Chấm công",
  employee: "Nhân viên",
  profile: "Hồ sơ",
  notifications: "Thông báo",
  settings: "Cài đặt",
  payroll: "Lương",
  leave: "Nghỉ phép",
  approval: "Phê duyệt",
  report: "Báo cáo",
  structure: "Cơ cấu",
  contract: "Hợp đồng",
  overtime: "Làm thêm giờ",
  holiday: "Ngày lễ",
  log: "Nhật ký",
  home: "Trang chủ",
  payslip: "Phiếu lương",
  "my-requests": "Yêu cầu của tôi",
};

const getBreadcrumbs = (
  pathname: string,
): Array<{ title: React.ReactNode; href?: string }> => {
  const segments = pathname.split("/").filter((seg) => seg && seg !== "admin" && seg !== "staff");
  
  // Determine the root based on the pathname
  const isStaff = pathname.startsWith("/staff");
  const rootHref = isStaff ? "/staff/trang-chu" : "/admin/bang-dieu-khien";
  const rootLabel = isStaff ? "Trang chủ" : "Bảng điều khiển";

  const breadcrumbs: Array<{ title: React.ReactNode; href?: string }> = [
    {
      title: <Link href={rootHref}>{rootLabel}</Link>,
    },
  ];

  let path = isStaff ? "/staff" : "/admin";
  segments.forEach((segment, index) => {
    path += `/${segment}`;
    const isLast = index === segments.length - 1;
    
    // Map segment to Vietnamese label or capitalize if not found
    const label = SEGMENT_MAP[segment] || (segment.charAt(0).toUpperCase() + segment.slice(1));

    if (!isLast) {
      breadcrumbs.push({
        title: <Link href={path}>{label}</Link>,
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
      onClick: () => {
        const isStaff = pathname.startsWith("/staff");
        router.push(isStaff ? "/staff/ho-so" : "/admin/ho-so");
      },
    },
    {
      key: "settings",
      icon: <SettingOutlined />,
      label: "Cài đặt",
      onClick: () => {
        const isStaff = pathname.startsWith("/staff");
        router.push(isStaff ? "/staff/ho-so" : "/admin/settings");
      },
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
        boxShadow: "none",
        borderBottom: "1px solid #f0f0f0",
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

        <Dropdown menu={{ items: userMenuItems }} trigger={["click"]}>
          <div className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 px-3 py-1 rounded" style={{ lineHeight: "normal" }}>
            <Avatar 
              size={32} 
              style={{ backgroundColor: "#cb1414" }}
              src={user?.avatar}
            >
              {user?.name ? user.name.charAt(0).toUpperCase() : <UserOutlined />}
            </Avatar>
            <span className="text-sm font-semibold text-gray-800">
              {user?.name || "Admin"}
            </span>
          </div>
        </Dropdown>
      </Space>
    </AntHeader>
  );
};

export default Header;
