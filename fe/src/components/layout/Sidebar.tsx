/**
 * Sidebar Component
 * Menu điều hướng chính cho Admin Portal
 */

"use client";

import React, { useState } from "react";
import { Layout, Menu, Button, Drawer } from "antd";
import {
  DashboardOutlined,
  UserOutlined,
  ClockCircleOutlined,
  FileTextOutlined,
  DollarOutlined,
  CheckCircleOutlined,
  SettingOutlined,
  MenuOutlined,
} from "@ant-design/icons";
import Link from "next/link";
import { usePathname } from "next/navigation";

const { Sider } = Layout;

interface MenuItem {
  key: string;
  icon: React.ReactNode;
  label: string;
  href: string;
}

const menuItems: MenuItem[] = [
  {
    key: "dashboard",
    icon: <DashboardOutlined />,
    label: "Dashboard",
    href: "/dashboard",
  },
  {
    key: "employee",
    icon: <UserOutlined />,
    label: "Quản lý Nhân viên",
    href: "/employee",
  },
  {
    key: "attendance",
    icon: <ClockCircleOutlined />,
    label: "Chấm công",
    href: "/attendance",
  },
  {
    key: "leave",
    icon: <FileTextOutlined />,
    label: "Quản lý Phép",
    href: "/leave",
  },
  {
    key: "payroll",
    icon: <DollarOutlined />,
    label: "Quản lý Lương",
    href: "/payroll",
  },
  {
    key: "approval",
    icon: <CheckCircleOutlined />,
    label: "Duyệt Đơn",
    href: "/approval",
  },
  {
    key: "report",
    icon: <FileTextOutlined />,
    label: "Báo cáo",
    href: "/report",
  },
  {
    key: "settings",
    icon: <SettingOutlined />,
    label: "Cài đặt",
    href: "/settings",
  },
];

interface SidebarProps {
  collapsed?: boolean;
  onCollapse?: (collapsed: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  collapsed = false,
  onCollapse,
}) => {
  const pathname = usePathname();
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  // Xác định menu item nào đang active dựa trên pathname
  const getActiveKey = (): string => {
    const pathSegment = pathname.split("/")[2] || "dashboard"; // /admin/dashboard -> dashboard
    return pathSegment;
  };

  const menuItemsForAnt = menuItems.map((item) => ({
    key: item.key,
    icon: item.icon,
    label: <Link href={`/admin${item.href}`}>{item.label}</Link>,
  }));

  return (
    <>
      {/* Desktop Sidebar */}
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={onCollapse}
        width={250}
        className="fixed left-0 top-0 h-screen overflow-y-auto hidden md:block bg-gray-50"
        style={{
          backgroundColor: "#fff",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        }}
      >
        {/* Logo */}
        <div className="p-4 border-b border-gray-200">
          <h1
            className={`text-lg font-bold text-blue-600 ${collapsed ? "hidden" : ""}`}
          >
            NextHR
          </h1>
          {collapsed && (
            <div className="text-center text-blue-600 font-bold">HR</div>
          )}
        </div>

        {/* Menu */}
        <Menu
          mode="inline"
          selectedKeys={[getActiveKey()]}
          items={menuItemsForAnt}
          className="border-r-0"
        />
      </Sider>

      {/* Mobile Menu Button */}
      <div className="md:hidden fixed bottom-6 right-6 z-40">
        <Button
          type="primary"
          shape="circle"
          size="large"
          icon={<MenuOutlined />}
          onClick={() => setMobileDrawerOpen(true)}
          className="bg-blue-600"
        />
      </div>

      {/* Mobile Drawer */}
      <Drawer
        title="Menu"
        placement="left"
        onClose={() => setMobileDrawerOpen(false)}
        open={mobileDrawerOpen}
        bodyStyle={{ padding: 0 }}
      >
        <Menu
          mode="inline"
          selectedKeys={[getActiveKey()]}
          items={menuItemsForAnt}
          onClick={() => setMobileDrawerOpen(false)}
        />
      </Drawer>
    </>
  );
};

export default Sidebar;
