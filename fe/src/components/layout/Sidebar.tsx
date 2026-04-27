/**
 * Sidebar Component
 * 100% Ant Design 5.x Implementation
 */

"use client";

import React, { useState } from "react";
import { Layout, Menu, Button, Drawer, theme, Typography, Space } from "antd";
import {
  DashboardOutlined,
  UserOutlined,
  ClockCircleOutlined,
  DollarOutlined,
  MenuOutlined,
  DeploymentUnitOutlined,
  FileProtectOutlined,
  CalendarOutlined,
  HistoryOutlined,
  LineChartOutlined,
  FlagOutlined,
  AuditOutlined,
} from "@ant-design/icons";
import Link from "next/link";
import { usePathname } from "next/navigation";

const { Sider } = Layout;
const { Text, Title } = Typography;

interface SidebarProps {
  collapsed?: boolean;
  onCollapse?: (collapsed: boolean) => void;
  isMobile?: boolean;
  headerHeight?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  collapsed = false,
  onCollapse,
  isMobile = false,
  headerHeight = 88,
}) => {
  const pathname = usePathname();
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const { token } = theme.useToken();

  // Xác định menu item nào đang active
  const getActiveKey = (): string => {
    const segments = pathname.split("/");
    return segments[segments.length - 1] || "dashboard";
  };

  const menuItems = [
    {
      key: 'g1',
      label: 'TỔNG QUAN',
      type: 'group' as const,
      children: [
        {
          key: 'dashboard',
          icon: <DashboardOutlined />,
          label: <Link href="/admin/dashboard">Dashboard</Link>,
        },
      ],
    },
    {
      key: 'g2',
      label: 'NHÂN SỰ',
      type: 'group' as const,
      children: [
        {
          key: 'employee',
          icon: <UserOutlined />,
          label: <Link href="/admin/employee">Nhân viên</Link>,
        },
        {
          key: 'structure',
          icon: <DeploymentUnitOutlined />,
          label: <Link href="/admin/structure">Cơ cấu tổ chức</Link>,
        },
        {
          key: 'contract',
          icon: <FileProtectOutlined />,
          label: <Link href="/admin/contract">Hợp đồng</Link>,
        },
      ],
    },
    {
      key: 'g3',
      label: 'CHẤM CÔNG & NGHỈ PHÉP',
      type: 'group' as const,
      children: [
        {
          key: 'attendance',
          icon: <ClockCircleOutlined />,
          label: <Link href="/admin/attendance">Chấm công</Link>,
        },
        {
          key: 'leave',
          icon: <CalendarOutlined />,
          label: <Link href="/admin/leave">Nghỉ phép</Link>,
        },
        {
          key: 'overtime',
          icon: <HistoryOutlined />,
          label: <Link href="/admin/overtime">Làm thêm giờ</Link>,
        },
      ],
    },
    {
      key: 'g4',
      label: 'TÀI CHÍNH',
      type: 'group' as const,
      children: [
        {
          key: 'payroll',
          icon: <DollarOutlined />,
          label: <Link href="/admin/payroll">Bảng lương</Link>,
        },
        {
          key: 'salary-history',
          icon: <HistoryOutlined />,
          label: <Link href="/admin/salary-history">Lịch sử lương</Link>,
        },
      ],
    },
    {
      key: 'g5',
      label: 'HỆ THỐNG',
      type: 'group' as const,
      children: [
        {
          key: 'report',
          icon: <LineChartOutlined />,
          label: <Link href="/admin/report">Báo cáo</Link>,
        },
        {
          key: 'holiday',
          icon: <FlagOutlined />,
          label: <Link href="/admin/holiday">Ngày lễ</Link>,
        },
        {
          key: 'log',
          icon: <AuditOutlined />,
          label: <Link href="/admin/log">Nhật ký</Link>,
        },
      ],
    },
  ];

  return (
    <>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={onCollapse}
        width={260}
        theme="light"
        style={{
          display: isMobile ? "none" : "block",
          position: "fixed",
          left: 0,
          top: 0,
          bottom: 0,
          height: "100vh",
          zIndex: 1001,
          overflowY: "auto",
          borderRight: `1px solid ${token.colorBorderSecondary}`,
        }}
      >
        {/* Anti-Branding built with Typography */}
        <div
          style={{ 
            height: headerHeight,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            borderBottom: `1px solid ${token.colorBorderSecondary}`,
            overflow: 'hidden'
          }}
        >
          {!collapsed ? (
            <Space direction="vertical" align="center" size={0}>
              <Title level={4} style={{ margin: 0, fontWeight: 900, letterSpacing: '-1px' }}>
                NEXHR
              </Title>
              <Text strong style={{ fontSize: '10px', color: token.colorError, letterSpacing: '1px' }}>
                SYSTEM ADMIN
              </Text>
            </Space>
          ) : (
            <Button 
              type="primary" 
              danger 
              size="small" 
              style={{ fontWeight: 900, borderRadius: token.borderRadius }}
            >
              N
            </Button>
          )}
        </div>

        <Menu
          mode="inline"
          selectedKeys={[getActiveKey()]}
          items={menuItems}
          style={{ borderRight: 0, paddingBottom: 24 }}
        />
      </Sider>

      {isMobile && (
        <div style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 1100 }}>
          <Button
            type="primary"
            danger
            shape="circle"
            size="large"
            icon={<MenuOutlined />}
            onClick={() => setMobileDrawerOpen(true)}
            style={{ boxShadow: token.boxShadow }}
          />
        </div>
      )}

      <Drawer
        title={<Title level={5} style={{ margin: 0 }}>Menu Quản lý</Title>}
        placement="left"
        onClose={() => setMobileDrawerOpen(false)}
        open={mobileDrawerOpen}
        styles={{ body: { padding: 0 } }}
      >
        <Menu
          mode="inline"
          selectedKeys={[getActiveKey()]}
          items={menuItems}
          onClick={() => setMobileDrawerOpen(false)}
        />
      </Drawer>
    </>
  );
};

export default Sidebar;
