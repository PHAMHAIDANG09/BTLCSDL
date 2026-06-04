"use client";

/**
 * NotificationBell Component
 * Dropdown thông báo ở Header:
 * - Badge đỏ hiển thị số chưa đọc
 * - Dropdown list 5 thông báo gần nhất
 * - Nút "Xem tất cả" → /staff/notifications
 * - Click từng item → markAsRead + điều hướng
 */

import React, { useEffect, useRef, useState } from "react";
import { Badge, Button, Dropdown, Empty, Spin, Tag } from "antd";
import {
  BellOutlined,
  CheckOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  DollarOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useNotificationStore } from "@/store/notificationStore";
import { relativeTime } from "@/services/notification.service";
import type { AppNotification, NotificationType } from "@/types/notification";

/* ------------------------------------------------------------------ */
/* Icon & màu theo loại thông báo                                       */
/* ------------------------------------------------------------------ */
const typeConfig: Record<
  NotificationType,
  { icon: React.ReactNode; color: string; tagColor: string }
> = {
  leave_approved: {
    icon: <CalendarOutlined />,
    color: "#52c41a",
    tagColor: "success",
  },
  leave_rejected: {
    icon: <CalendarOutlined />,
    color: "#ff4d4f",
    tagColor: "error",
  },
  ot_approved: {
    icon: <ClockCircleOutlined />,
    color: "#1677ff",
    tagColor: "processing",
  },
  ot_rejected: {
    icon: <ClockCircleOutlined />,
    color: "#ff4d4f",
    tagColor: "error",
  },
  payslip: {
    icon: <DollarOutlined />,
    color: "#faad14",
    tagColor: "warning",
  },
};

const typeLabel: Record<NotificationType, string> = {
  leave_approved: "Nghỉ phép",
  leave_rejected: "Nghỉ phép",
  ot_approved: "Làm thêm",
  ot_rejected: "Làm thêm",
  payslip: "Lương",
};

/* ------------------------------------------------------------------ */
/* NotificationItem                                                     */
/* ------------------------------------------------------------------ */
interface NotificationItemProps {
  item: AppNotification;
  onRead: (id: string, link: string) => void;
}

const NotificationItem: React.FC<NotificationItemProps> = ({ item, onRead }) => {
  const cfg = typeConfig[item.type];
  return (
    <div
      onClick={() => onRead(item.id, item.link)}
      style={{
        display: "flex",
        gap: 12,
        padding: "12px 16px",
        cursor: "pointer",
        background: item.read ? "transparent" : "#f0f7ff",
        borderLeft: item.read ? "3px solid transparent" : `3px solid ${cfg.color}`,
        transition: "background 0.2s",
      }}
      className="hover:bg-gray-50"
    >
      {/* Icon vòng tròn */}
      <div
        style={{
          width: 36,
          height: 36,
          borderRadius: "50%",
          background: `${cfg.color}18`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: cfg.color,
          fontSize: 16,
          flexShrink: 0,
        }}
      >
        {cfg.icon}
      </div>

      {/* Nội dung */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontWeight: item.read ? 400 : 600,
            fontSize: 13,
            color: "#1a1a2e",
            lineHeight: 1.4,
            marginBottom: 2,
          }}
        >
          {item.title}
        </div>
        <div
          style={{
            fontSize: 12,
            color: "#666",
            lineHeight: 1.4,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {item.description}
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            marginTop: 4,
          }}
        >
          <Tag color={cfg.tagColor} style={{ margin: 0, fontSize: 10 }}>
            {typeLabel[item.type]}
          </Tag>
          <span style={{ fontSize: 11, color: "#999" }}>
            {relativeTime(item.time)}
          </span>
        </div>
      </div>

      {/* Dot chưa đọc */}
      {!item.read && (
        <div
          style={{
            width: 8,
            height: 8,
            borderRadius: "50%",
            background: cfg.color,
            flexShrink: 0,
            marginTop: 4,
          }}
        />
      )}
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* NotificationBell (main export)                                       */
/* ------------------------------------------------------------------ */
export const NotificationBell: React.FC = () => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const { notifications, unreadCount, isLoading, fetchNotifications, markAsRead, markAllAsRead } =
    useNotificationStore();

  // Fetch khi mount (chỉ 1 lần, có cache TTL)
  useEffect(() => {
    fetchNotifications();
  }, []);

  // Fetch lại mỗi khi mở dropdown
  const handleOpenChange = (flag: boolean) => {
    setOpen(flag);
    if (flag) {
      // Force refetch khi mở (reset cache)
      useNotificationStore.setState({ lastFetchedAt: null });
      fetchNotifications();
    }
  };

  const handleItemClick = (id: string, link: string) => {
    markAsRead(id);
    setOpen(false);
    router.push(link);
  };

  // Hiển thị tối đa 5 thông báo trong dropdown
  const preview = notifications.slice(0, 5);

  const dropdownContent = (
    <div
      style={{
        width: 360,
        background: "#fff",
        borderRadius: 12,
        boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
        overflow: "hidden",
        border: "1px solid #f0f0f0",
      }}
    >
      {/* Header dropdown */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "14px 16px",
          borderBottom: "1px solid #f5f5f5",
          background: "linear-gradient(135deg, #667eea08 0%, #764ba208 100%)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <BellOutlined style={{ color: "#1677ff", fontSize: 16 }} />
          <span style={{ fontWeight: 700, fontSize: 15, color: "#1a1a2e" }}>
            Thông báo
          </span>
          {unreadCount > 0 && (
            <span
              style={{
                background: "#ff4d4f",
                color: "#fff",
                borderRadius: 10,
                padding: "1px 7px",
                fontSize: 11,
                fontWeight: 700,
              }}
            >
              {unreadCount}
            </span>
          )}
        </div>
        <div style={{ display: "flex", gap: 4 }}>
          {unreadCount > 0 && (
            <Button
              type="text"
              size="small"
              icon={<CheckOutlined />}
              onClick={(e) => {
                e.stopPropagation();
                markAllAsRead();
              }}
              style={{ fontSize: 12, color: "#1677ff" }}
            >
              Đọc tất cả
            </Button>
          )}
          <Button
            type="text"
            size="small"
            icon={<ReloadOutlined />}
            loading={isLoading}
            onClick={(e) => {
              e.stopPropagation();
              useNotificationStore.setState({ lastFetchedAt: null });
              fetchNotifications();
            }}
            style={{ color: "#999" }}
          />
        </div>
      </div>

      {/* Danh sách */}
      <div style={{ maxHeight: 360, overflowY: "auto" }}>
        {isLoading && notifications.length === 0 ? (
          <div style={{ padding: "32px 0", textAlign: "center" }}>
            <Spin size="default" />
            <div style={{ marginTop: 8, color: "#999", fontSize: 13 }}>
              Đang tải thông báo...
            </div>
          </div>
        ) : preview.length === 0 ? (
          <div style={{ padding: "32px 16px" }}>
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description={
                <span style={{ color: "#999", fontSize: 13 }}>
                  Chưa có thông báo nào
                </span>
              }
            />
          </div>
        ) : (
          <div>
            {preview.map((item, idx) => (
              <div key={item.id}>
                <NotificationItem item={item} onRead={handleItemClick} />
                {idx < preview.length - 1 && (
                  <div style={{ borderBottom: "1px solid #f5f5f5" }} />
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div
        style={{
          borderTop: "1px solid #f5f5f5",
          padding: "10px 16px",
          textAlign: "center",
        }}
      >
        <Link
          href="/staff/notifications"
          onClick={() => setOpen(false)}
          style={{
            fontSize: 13,
            color: "#1677ff",
            fontWeight: 500,
            textDecoration: "none",
          }}
        >
          Xem tất cả thông báo →
        </Link>
      </div>
    </div>
  );

  return (
    <Dropdown
      open={open}
      onOpenChange={handleOpenChange}
      dropdownRender={() => dropdownContent}
      trigger={["click"]}
      placement="bottomRight"
    >
      <Badge
        count={unreadCount}
        size="small"
        color="#ff4d4f"
        overflowCount={99}
        style={{ cursor: "pointer" }}
      >
        <Button
          type="text"
          icon={
            <BellOutlined
              style={{
                fontSize: 18,
                color: unreadCount > 0 ? "#1677ff" : "#595959",
                transition: "color 0.2s",
              }}
            />
          }
          style={{
            width: 36,
            height: 36,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        />
      </Badge>
    </Dropdown>
  );
};

export default NotificationBell;
