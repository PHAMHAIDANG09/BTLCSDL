/**
 * Sidebar Component (Dùng chung cho Admin & Staff)
 * Nhận prop `role` để hiển thị menu tương ứng
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
  HomeOutlined,
  BellOutlined,
  FileTextOutlined,
} from "@ant-design/icons";
import Link from "next/link";
import { usePathname } from "next/navigation";

const { Sider } = Layout;
const { Text, Title } = Typography;

type Role = "admin" | "staff";

interface SidebarProps {
  role?: Role;
  collapsed?: boolean;
  onCollapse?: (collapsed: boolean) => void;
  isMobile?: boolean;
  headerHeight?: number;
}

// ─── Menu Admin ───────────────────────────────────────────────
const adminMenuItems = [
  {
    key: "g1",
    label: "TỔNG QUAN",
    type: "group" as const,
    children: [
      {
        key: "bang-dieu-khien",
        icon: <DashboardOutlined />,
        label: <Link href="/admin/bang-dieu-khien">Dashboard</Link>,
      },
    ],
  },
  {
    key: "g1_personal",
    label: "CÁ NHÂN",
    type: "group" as const,
    children: [
      {
        key: "ho-so",
        icon: <UserOutlined />,
        label: <Link href="/admin/ho-so">Hồ sơ cá nhân</Link>,
      },
    ],
  },
  {
    key: "g2",
    label: "NHÂN SỰ",
    type: "group" as const,
    children: [
      {
        key: "nhan-vien",
        icon: <UserOutlined />,
        label: <Link href="/admin/nhan-vien">Nhân viên</Link>,
      },
      {
        key: "co-cau-to-chuc",
        icon: <DeploymentUnitOutlined />,
        label: <Link href="/admin/co-cau-to-chuc">Cơ cấu tổ chức</Link>,
      },
      {
        key: "hop-dong",
        icon: <FileProtectOutlined />,
        label: <Link href="/admin/hop-dong">Hợp đồng</Link>,
      },
    ],
  },
  {
    key: "g3",
    label: "CHẤM CÔNG & NGHỈ PHÉP",
    type: "group" as const,
    children: [
      {
        key: "cham-cong",
        icon: <ClockCircleOutlined />,
        label: <Link href="/admin/cham-cong">Chấm công</Link>,
      },
      {
        key: "nghi-phep",
        icon: <CalendarOutlined />,
        label: <Link href="/admin/nghi-phep">Nghỉ phép</Link>,
      },
      {
        key: "lam-them-gio",
        icon: <HistoryOutlined />,
        label: <Link href="/admin/lam-them-gio">Làm thêm giờ</Link>,
      },
    ],
  },
  {
    key: "g4",
    label: "TÀI CHÍNH",
    type: "group" as const,
    children: [
      {
        key: "luong",
        icon: <DollarOutlined />,
        label: <Link href="/admin/luong">Bảng lương</Link>,
      },
      {
        key: "lich-su-luong",
        icon: <HistoryOutlined />,
        label: <Link href="/admin/lich-su-luong">Lịch sử lương</Link>,
      },
    ],
  },
  {
    key: "g5",
    label: "HỆ THỐNG",
    type: "group" as const,
    children: [
      {
        key: "bao-cao",
        icon: <LineChartOutlined />,
        label: <Link href="/admin/bao-cao">Báo cáo</Link>,
      },
      {
        key: "ngay-le",
        icon: <FlagOutlined />,
        label: <Link href="/admin/ngay-le">Ngày lễ</Link>,
      },
      {
        key: "nhat-ky",
        icon: <AuditOutlined />,
        label: <Link href="/admin/nhat-ky">Nhật ký</Link>,
      },
    ],
  },
];

// ─── Menu Staff (chỉ các trang có thật trong /staff/) ─────────
const staffMenuItems = [
  {
    key: "g1",
    label: "TỔNG QUAN",
    type: "group" as const,
    children: [
      {
        key: "home",
        icon: <HomeOutlined />,
        label: <Link href="/staff/trang-chu">Trang chủ</Link>,
      },
    ],
  },
  {
    key: "g2",
    label: "HỒ SƠ CÁ NHÂN",
    type: "group" as const,
    children: [
      {
        key: "profile",
        icon: <UserOutlined />,
        label: <Link href="/staff/ho-so">Thông tin cá nhân</Link>,
      },
    ],
  },
  {
    key: "g3",
    label: "CHẤM CÔNG & NGHỈ PHÉP",
    type: "group" as const,
    children: [
      {
        key: "attendance",
        icon: <ClockCircleOutlined />,
        label: <Link href="/staff/cham-cong">Chấm công</Link>,
      },
      {
        key: "leave",
        icon: <CalendarOutlined />,
        label: <Link href="/staff/leave">Nghỉ phép</Link>,
      },
    ],
  },
  {
    key: "g4",
    label: "TÀI CHÍNH",
    type: "group" as const,
    children: [
      {
        key: "payslip",
        icon: <DollarOutlined />,
        label: <Link href="/staff/phieu-luong">Phiếu lương</Link>,
      },
    ],
  },
  {
    key: "g5",
    label: "KHÁC",
    type: "group" as const,
    children: [
      {
        key: "notifications",
        icon: <BellOutlined />,
        label: <Link href="/staff/notifications">Thông báo</Link>,
      },
      {
        key: "my-requests",
        icon: <FileTextOutlined />,
        label: <Link href="/staff/my-requests">Đơn của tôi</Link>,
      },
    ],
  },
];

// ─── Component ────────────────────────────────────────────────
export const Sidebar: React.FC<SidebarProps> = ({
  role = "admin",
  collapsed = false,
  onCollapse,
  isMobile = false,
  headerHeight = 64,
}) => {
  const pathname = usePathname();
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const { token } = theme.useToken();

  const isAdmin = role === "admin";
  const menuItems = isAdmin ? adminMenuItems : staffMenuItems;

  const getActiveKey = (): string => {
    const segments = pathname.split("/").filter((s) => s && s !== "admin" && s !== "staff");
    return segments[0] || (isAdmin ? "bang-dieu-khien" : "trang-chu");
  };

  const siderContent = (
    <>
      {/* Brand */}
      <div
        style={{
          height: headerHeight,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          borderBottom: `1px solid ${token.colorBorderSecondary}`,
          overflow: "hidden",
        }}
      >
        {!collapsed ? (
          <Space direction="vertical" align="center" size={0}>
            <Title level={4} style={{ margin: 0, fontWeight: 900, letterSpacing: "-1px" }}>
              NEXHR
            </Title>
            <Text
              strong
              style={{
                fontSize: "10px",
                color: isAdmin ? token.colorError : token.colorPrimary,
                letterSpacing: "1px",
              }}
            >
              {isAdmin ? "QUẢN TRỊ HỆ THỐNG" : "CỔNG NHÂN VIÊN"}
            </Text>
          </Space>
        ) : (
          <Button
            type="primary"
            danger={isAdmin}
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
        className="admin-sider-menu"
        style={{ borderRight: 0, paddingBottom: 24 }}
      />
    </>
  );

  return (
    <>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={onCollapse}
        width={260}
        theme="light"
        className="admin-sider"
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
        {siderContent}
      </Sider>

      {isMobile && (
        <div style={{ position: "fixed", bottom: 24, right: 24, zIndex: 1100 }}>
          <Button
            type="primary"
            danger={isAdmin}
            shape="circle"
            size="large"
            icon={<MenuOutlined />}
            onClick={() => setMobileDrawerOpen(true)}
            style={{ boxShadow: token.boxShadow }}
          />
        </div>
      )}

      <Drawer
        title={
          <Title level={5} style={{ margin: 0 }}>
            {isAdmin ? "Menu Quản lý" : "Menu Nhân viên"}
          </Title>
        }
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
