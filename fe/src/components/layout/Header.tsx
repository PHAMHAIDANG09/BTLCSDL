/**
 * Header Component
 * Chứa Breadcrumbs, Avatar, Notifications, User Info
 */

"use client";

import React, { useState, useEffect } from "react";
import {
  Layout,
  Breadcrumb,
  Avatar,
  Dropdown,
  Space,
  Tag,
  type MenuProps,
} from "antd";
import { getProfileApi } from "@/services/auth.service";
import { getEmployeeByIdApi } from "@/services/employee.service";
import {
  UserOutlined,
  LogoutOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { NotificationBell } from "@/app/staff/notifications/_components/NotificationBell";
import { useNotificationStore } from "@/store/notificationStore";

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
  "lam-them-gio": "Làm thêm giờ",
  holiday: "Ngày lễ",
  log: "Nhật ký",
  home: "Trang chủ",
  payslip: "Phiếu lương",
  "my-requests": "Yêu cầu của tôi",
  "nghi-phep": "Nghỉ phép",
};

const getBreadcrumbs = (
  pathname: string,
  dynamicLabels?: Record<string, string>,
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
    const label = dynamicLabels?.[segment] || SEGMENT_MAP[segment] || (segment.charAt(0).toUpperCase() + segment.slice(1));

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
  const [profile, setProfile] = useState<any>(null);
  const [dynamicLabels, setDynamicLabels] = useState<Record<string, string>>({});
  const isStaffPage = pathname.startsWith("/staff");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getProfileApi();
        setProfile(data);
      } catch (error) {
        console.error("Failed to fetch profile in Header:", error);
      }
    };
    if (user) {
      fetchProfile();
    }
  }, [user]);

  // Fetch thông báo khi là Staff
  const fetchNotifications = useNotificationStore((s) => s.fetchNotifications);
  useEffect(() => {
    if (isStaffPage) {
      fetchNotifications();
    }
  }, [isStaffPage]);
  useEffect(() => {
    const match = pathname.match(/\/cham-cong\/(\d+)$/);
    if (match) {
      const id = match[1];
      const fetchEmployeeName = async () => {
        try {
          const emp = await getEmployeeByIdApi(parseInt(id));
          setDynamicLabels(prev => {
            if (prev[id] === emp.HoTen) return prev;
            return { ...prev, [id]: emp.HoTen };
          });
        } catch (error) {
          console.error("Failed to fetch employee name for breadcrumb:", error);
        }
      };
      fetchEmployeeName();
    }
  }, [pathname]);

  // notificationCount handled by NotificationBell store

  const breadcrumbs = getBreadcrumbs(pathname, dynamicLabels);

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
        {/* Notification Bell – chỉ hiện với Staff */}
        {isStaffPage && <NotificationBell />}

        <Dropdown menu={{ items: userMenuItems }} trigger={["click"]}>
          <div 
            className="cursor-pointer hover:bg-gray-50 px-3 py-1 rounded-lg transition-all duration-200" 
            style={{ 
              display: "flex", 
              alignItems: "center", 
              gap: "12px", 
              lineHeight: "normal" 
            }}
          >
            <Avatar 
              size={36} 
              style={{ backgroundColor: "#cb1414", flexShrink: 0 }}
              src={user?.avatar}
              className="shadow-sm"
            >
              {user?.name ? user.name.charAt(0).toUpperCase() : <UserOutlined />}
            </Avatar>
            <div 
              style={{ 
                display: "flex", 
                flexDirection: "column", 
                alignItems: "flex-start", 
                gap: "2px" 
              }}
            >
              <span 
                className="text-sm text-gray-800 leading-tight"
                style={{ fontWeight: 700 }}
              >
                {user?.name || "Admin"}
              </span>
              {(() => {
                const displayPosition = profile?.chucVu?.TenChucVu || (user?.role === "Admin" ? "Quản trị viên" : (pathname.startsWith("/staff") ? "Nhân viên" : "Giám đốc"));
                const normalizedPosition = displayPosition.toLowerCase();
                let tagColor = "default";
                if (normalizedPosition.includes("giám đốc") || normalizedPosition === "admin" || normalizedPosition === "manager" || normalizedPosition.includes("quản trị")) {
                  tagColor = "error";
                } else if (normalizedPosition.includes("trưởng phòng")) {
                  tagColor = "processing";
                } else if (normalizedPosition.includes("nhân viên") || normalizedPosition === "staff") {
                  tagColor = "success";
                }
                return (
                  <Tag color={tagColor} style={{ margin: 0 }}>
                    {displayPosition}
                  </Tag>
                );
              })()}
            </div>
          </div>
        </Dropdown>
      </Space>
    </AntHeader>
  );
};

export default Header;
