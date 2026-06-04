"use client";

/**
 * NotificationList Component
 * Hiển thị toàn bộ danh sách thông báo trên trang /staff/notifications
 */

import React from "react";
import {
  Badge,
  Button,
  Empty,
  List,
  Skeleton,
  Tag,
  Typography,
} from "antd";
import {
  BellOutlined,
  CalendarOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  DollarOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { useNotificationStore } from "@/store/notificationStore";
import { relativeTime } from "@/services/notification.service";
import type { AppNotification, NotificationType } from "@/types/notification";

const { Text } = Typography;

/* ------------------------------------------------------------------ */
/* Cấu hình theo loại thông báo                                         */
/* ------------------------------------------------------------------ */
const typeConfig: Record<
  NotificationType,
  {
    icon: React.ReactNode;
    color: string;
    tagColor: string;
    label: string;
  }
> = {
  leave_approved: {
    icon: <CalendarOutlined />,
    color: "#52c41a",
    tagColor: "success",
    label: "Nghỉ phép",
  },
  leave_rejected: {
    icon: <CalendarOutlined />,
    color: "#ff4d4f",
    tagColor: "error",
    label: "Nghỉ phép",
  },
  ot_approved: {
    icon: <ClockCircleOutlined />,
    color: "#1677ff",
    tagColor: "processing",
    label: "Làm thêm",
  },
  ot_rejected: {
    icon: <ClockCircleOutlined />,
    color: "#ff4d4f",
    tagColor: "error",
    label: "Làm thêm",
  },
  payslip: {
    icon: <DollarOutlined />,
    color: "#faad14",
    tagColor: "warning",
    label: "Lương",
  },
};

/* ------------------------------------------------------------------ */
/* NotificationList                                                     */
/* ------------------------------------------------------------------ */
export const NotificationList: React.FC = () => {
  const router = useRouter();
  const {
    notifications,
    unreadCount,
    isLoading,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
  } = useNotificationStore();

  const handleItemClick = (item: AppNotification) => {
    if (!item.read) {
      markAsRead(item.id);
    }
    router.push(item.link);
  };

  const handleRefresh = () => {
    useNotificationStore.setState({ lastFetchedAt: null });
    fetchNotifications();
  };

  if (isLoading && notifications.length === 0) {
    return (
      <div style={{ padding: "0 4px" }}>
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            style={{
              background: "#fff",
              borderRadius: 12,
              padding: "16px 20px",
              marginBottom: 10,
              border: "1px solid #f0f0f0",
            }}
          >
            <Skeleton avatar active paragraph={{ rows: 2 }} />
          </div>
        ))}
      </div>
    );
  }

  if (notifications.length === 0) {
    return (
      <div
        style={{
          background: "#fff",
          borderRadius: 16,
          padding: "60px 24px",
          textAlign: "center",
          border: "1px solid #f0f0f0",
        }}
      >
        <Empty
          image={
            <BellOutlined
              style={{ fontSize: 64, color: "#d9d9d9" }}
            />
          }
          imageStyle={{ height: "auto" }}
          description={
            <div>
              <div
                style={{
                  fontSize: 16,
                  fontWeight: 600,
                  color: "#8c8c8c",
                  marginBottom: 8,
                }}
              >
                Chưa có thông báo nào
              </div>
              <div style={{ fontSize: 13, color: "#bfbfbf", marginBottom: 16 }}>
                Thông báo sẽ xuất hiện khi đơn của bạn được xử lý
              </div>
              <Button
                icon={<ReloadOutlined />}
                onClick={handleRefresh}
                loading={isLoading}
              >
                Làm mới
              </Button>
            </div>
          }
        />
      </div>
    );
  }

  return (
    <div>
      {/* Toolbar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 16,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Text style={{ color: "#595959", fontSize: 14 }}>
            {notifications.length} thông báo
          </Text>
          {unreadCount > 0 && (
            <Badge
              count={`${unreadCount} chưa đọc`}
              color="#1677ff"
              style={{ fontSize: 11 }}
            />
          )}
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          {unreadCount > 0 && (
            <Button
              size="small"
              icon={<CheckCircleOutlined />}
              onClick={markAllAsRead}
              style={{ borderRadius: 8, fontSize: 12 }}
            >
              Đọc tất cả
            </Button>
          )}
          <Button
            size="small"
            icon={<ReloadOutlined />}
            loading={isLoading}
            onClick={handleRefresh}
            style={{ borderRadius: 8, fontSize: 12 }}
          />
        </div>
      </div>

      {/* Danh sách */}
      <List
        dataSource={notifications}
        renderItem={(item) => {
          const cfg = typeConfig[item.type];
          return (
            <List.Item
              key={item.id}
              onClick={() => handleItemClick(item)}
              style={{
                background: item.read ? "#fff" : "#f0f7ff",
                borderRadius: 12,
                marginBottom: 10,
                padding: "16px 20px",
                border: item.read
                  ? "1px solid #f0f0f0"
                  : `1px solid ${cfg.color}33`,
                borderLeft: `4px solid ${item.read ? "#f0f0f0" : cfg.color}`,
                cursor: "pointer",
                transition: "all 0.2s ease",
                boxShadow: item.read
                  ? "none"
                  : "0 2px 8px rgba(22,119,255,0.08)",
              }}
              className="notification-item"
            >
              <List.Item.Meta
                avatar={
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: "50%",
                      background: `${cfg.color}18`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: cfg.color,
                      fontSize: 20,
                      flexShrink: 0,
                    }}
                  >
                    {cfg.icon}
                  </div>
                }
                title={
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      flexWrap: "wrap",
                    }}
                  >
                    <span
                      style={{
                        fontWeight: item.read ? 500 : 700,
                        fontSize: 14,
                        color: "#1a1a2e",
                      }}
                    >
                      {item.title}
                    </span>
                    <Tag color={cfg.tagColor} style={{ margin: 0, fontSize: 11 }}>
                      {cfg.label}
                    </Tag>
                    {!item.read && (
                      <span
                        style={{
                          width: 8,
                          height: 8,
                          borderRadius: "50%",
                          background: cfg.color,
                          display: "inline-block",
                        }}
                      />
                    )}
                  </div>
                }
                description={
                  <div>
                    <div
                      style={{
                        fontSize: 13,
                        color: "#595959",
                        marginBottom: 6,
                        lineHeight: 1.5,
                      }}
                    >
                      {item.description}
                    </div>
                    <Text
                      type="secondary"
                      style={{ fontSize: 12 }}
                    >
                      🕐 {relativeTime(item.time)} &nbsp;·&nbsp;{" "}
                      {item.time.toLocaleDateString("vi-VN", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </Text>
                  </div>
                }
              />
            </List.Item>
          );
        }}
      />

      <style>{`
        .notification-item:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 16px rgba(0,0,0,0.08) !important;
        }
      `}</style>
    </div>
  );
};

export default NotificationList;
