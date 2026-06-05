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
  theme,
  Flex,
  Space,
  Card,
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
const getTypeLabel = (type: NotificationType) => {
  const map: Record<NotificationType, string> = {
    leave_approved: "Nghỉ phép",
    leave_rejected: "Nghỉ phép",
    leave_pending: "Nghỉ phép",
    ot_approved: "Làm thêm",
    ot_rejected: "Làm thêm",
    ot_pending: "Làm thêm",
    payslip: "Lương",
  };
  return map[type] || "Thông báo";
};

const getTypeTagColor = (type: NotificationType) => {
  const map: Record<NotificationType, string> = {
    leave_approved: "success",
    leave_rejected: "error",
    leave_pending: "warning",
    ot_approved: "processing",
    ot_rejected: "error",
    ot_pending: "warning",
    payslip: "warning",
  };
  return map[type] || "default";
};

const getTypeColor = (type: NotificationType, token: any) => {
  switch (type) {
    case "leave_approved":
      return token.colorSuccess;
    case "leave_rejected":
    case "ot_rejected":
      return token.colorError;
    case "ot_approved":
      return token.colorInfo;
    case "leave_pending":
    case "ot_pending":
    case "payslip":
      return token.colorWarning;
    default:
      return token.colorPrimary;
  }
};

/* ------------------------------------------------------------------ */
/* NotificationList                                                     */
/* ------------------------------------------------------------------ */
export const NotificationList: React.FC = () => {
  const { token } = theme.useToken();
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
      <Flex vertical gap={10} style={{ padding: "0 4px" }}>
        {[1, 2, 3, 4].map((i) => (
          <Card
            key={i}
            bordered
            style={{ borderRadius: 12 }}
            styles={{ body: { padding: "16px 20px" } }}
          >
            <Skeleton active paragraph={{ rows: 2 }} />
          </Card>
        ))}
      </Flex>
    );
  }

  if (notifications.length === 0) {
    return (
      <Card
        bordered
        style={{
          borderRadius: 16,
        }}
        styles={{
          body: {
            padding: "60px 24px",
            textAlign: "center",
          },
        }}
      >
        <Empty
          image={
            <BellOutlined
              style={{ fontSize: 64, color: token.colorTextDisabled }}
            />
          }
          imageStyle={{ height: "auto" }}
          description={
            <Flex vertical gap={8} align="center">
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: 600,
                  color: token.colorTextSecondary,
                }}
              >
                Chưa có thông báo nào
              </Text>
              <Text style={{ fontSize: 13, color: token.colorTextDescription, marginBottom: 16 }}>
                Thông báo sẽ xuất hiện khi đơn của bạn được xử lý
              </Text>
              <Button
                icon={<ReloadOutlined />}
                onClick={handleRefresh}
                loading={isLoading}
              >
                Làm mới
              </Button>
            </Flex>
          }
        />
      </Card>
    );
  }

  return (
    <div>
      {/* Toolbar */}
      <Flex justify="space-between" align="center" style={{ marginBottom: 16 }}>
        <Space size={10} align="center">
          <Text style={{ color: token.colorTextSecondary, fontSize: 14 }}>
            {notifications.length} thông báo
          </Text>
          {unreadCount > 0 && (
            <Badge
              count={`${unreadCount} chưa đọc`}
              color={token.colorPrimary}
              style={{ fontSize: 11 }}
            />
          )}
        </Space>
        <Space size={8}>
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
        </Space>
      </Flex>

      {/* Danh sách */}
      <List
        dataSource={notifications}
        renderItem={(item) => {
          const tagColor = getTypeTagColor(item.type);
          const label = getTypeLabel(item.type);
          const color = getTypeColor(item.type, token);
          return (
            <List.Item
              key={item.id}
              onClick={() => handleItemClick(item)}
              style={{
                background: item.read ? "#fff" : token.colorInfoBg,
                borderRadius: 12,
                marginBottom: 10,
                padding: "16px 20px",
                border: item.read ? `1px solid ${token.colorBorderSecondary}` : `1px solid ${token.colorPrimaryBg}`,
                cursor: "pointer",
                transition: "all 0.2s ease",
                boxShadow: item.read
                  ? "none"
                  : "0 2px 8px rgba(22,119,255,0.04)",
              }}
              className="notification-item"
            >
              <List.Item.Meta
                title={
                  <Flex align="center" gap={8} wrap="wrap">
                    <Text
                      style={{
                        fontWeight: item.read ? 500 : 700,
                        fontSize: 14,
                        color: token.colorText,
                      }}
                    >
                      {item.title}
                    </Text>
                    <Tag color={tagColor} style={{ margin: 0, fontSize: 11 }}>
                      {label}
                    </Tag>
                    {!item.read && (
                      <Badge status="processing" color={color} style={{ marginInlineStart: 4 }} />
                    )}
                  </Flex>
                }
                description={
                  <Flex vertical gap={6}>
                    <Text
                      style={{
                        fontSize: 13,
                        color: token.colorTextSecondary,
                        lineHeight: 1.5,
                      }}
                    >
                      {item.description}
                    </Text>
                    <Text
                      type="secondary"
                      style={{ fontSize: 12 }}
                    >
                      {relativeTime(item.time)} &nbsp;·&nbsp;{" "}
                      {item.time.toLocaleDateString("vi-VN", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </Text>
                  </Flex>
                }
              />
            </List.Item>
          );
        }}
      />

      <style>{`
        .notification-item:hover {
          background-color: #f8fafc;
        }
      `}</style>
    </div>
  );
};

export default NotificationList;
