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
import { Badge, Button, Dropdown, Empty, Spin, Tag, theme, Flex, Space, Card, Typography } from "antd";
import {
  BellOutlined,
  CheckOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  DollarOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useNotificationStore } from "@/store/notificationStore";
import { relativeTime } from "@/services/notification.service";
import type { AppNotification, NotificationType } from "@/types/notification";

const { Text } = Typography;

/* ------------------------------------------------------------------ */
/* Icon & màu theo loại thông báo                                       */
/* ------------------------------------------------------------------ */
const getTypeLabel = (type: NotificationType) => {
  const map: Record<NotificationType, string> = {
    leave_approved: "Nghỉ phép",
    leave_rejected: "Nghỉ phép",
    ot_approved: "Làm thêm",
    ot_rejected: "Làm thêm",
    payslip: "Lương",
  };
  return map[type] || "Thông báo";
};

const getTypeTagColor = (type: NotificationType) => {
  const map: Record<NotificationType, string> = {
    leave_approved: "success",
    leave_rejected: "error",
    ot_approved: "processing",
    ot_rejected: "error",
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
    case "payslip":
      return token.colorWarning;
    default:
      return token.colorPrimary;
  }
};

/* ------------------------------------------------------------------ */
/* NotificationItem                                                     */
/* ------------------------------------------------------------------ */
interface NotificationItemProps {
  item: AppNotification;
  onRead: (id: string, link: string) => void;
}

const NotificationItem: React.FC<NotificationItemProps> = ({ item, onRead }) => {
  const { token } = theme.useToken();
  const color = getTypeColor(item.type, token);
  const tagColor = getTypeTagColor(item.type);
  const label = getTypeLabel(item.type);

  return (
    <div onClick={() => onRead(item.id, item.link)} style={{ cursor: "pointer" }}>
      <Flex
        gap={12}
        align="start"
        style={{
          padding: "12px 16px",
          background: item.read ? "transparent" : token.colorInfoBg,
          borderBottom: `1px solid ${token.colorBorderSecondary}`,
          transition: "background 0.2s",
        }}
      >
        {/* Nội dung */}
        <Flex vertical style={{ flex: 1, minWidth: 0 }}>
          <Text
            style={{
              fontWeight: item.read ? 400 : 600,
              fontSize: 13,
              color: token.colorText,
              lineHeight: 1.4,
              marginBottom: 2,
            }}
          >
            {item.title}
          </Text>
          <Text
            style={{
              fontSize: 12,
              color: token.colorTextDescription,
              lineHeight: 1.4,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {item.description}
          </Text>
          <Flex align="center" gap={6} style={{ marginTop: 4 }}>
            <Tag color={tagColor} style={{ margin: 0, fontSize: 10 }}>
              {label}
            </Tag>
            <Text type="secondary" style={{ fontSize: 11 }}>
              {relativeTime(item.time)}
            </Text>
          </Flex>
        </Flex>

        {/* Dot chưa đọc */}
        {!item.read && (
          <Badge
            status="processing"
            color={color}
            style={{ flexShrink: 0, marginTop: 4 }}
          />
        )}
      </Flex>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* NotificationBell (main export)                                       */
/* ------------------------------------------------------------------ */
export const NotificationBell: React.FC = () => {
  const { token } = theme.useToken();
  const router = useRouter();
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");
  const allNotificationsLink = isAdmin ? "/admin/notifications" : "/staff/notifications";
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

  const handleItemClick = (id: string, _link: string) => {
    markAsRead(id);
    setOpen(false);
    router.push(allNotificationsLink);
  };

  // Hiển thị tối đa 5 thông báo trong dropdown
  const preview = notifications.slice(0, 5);

  const dropdownContent = (
    <Card
      style={{
        width: 360,
        boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
        overflow: "hidden",
        border: `1px solid ${token.colorBorderSecondary}`,
        borderRadius: 12,
      }}
      styles={{ body: { padding: 0 } }}
    >
      {/* Header dropdown */}
      <Flex
        align="center"
        justify="space-between"
        style={{
          padding: "14px 16px",
          borderBottom: `1px solid ${token.colorBorderSecondary}`,
          background: "linear-gradient(135deg, #667eea08 0%, #764ba208 100%)",
        }}
      >
        <Flex align="center" gap={8}>
          <BellOutlined style={{ color: token.colorPrimary, fontSize: 16 }} />
          <Text style={{ fontWeight: 700, fontSize: 15, color: token.colorText }}>
            Thông báo
          </Text>
          {unreadCount > 0 && (
            <Badge
              count={unreadCount}
              color={token.colorError}
              style={{ fontSize: 11 }}
            />
          )}
        </Flex>
        <Space size={4}>
          {unreadCount > 0 && (
            <Button
              type="text"
              size="small"
              icon={<CheckOutlined />}
              onClick={(e) => {
                e.stopPropagation();
                markAllAsRead();
              }}
              style={{ fontSize: 12, color: token.colorPrimary }}
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
            style={{ color: token.colorTextDescription }}
          />
        </Space>
      </Flex>

      {/* Danh sách */}
      <div style={{ maxHeight: 360, overflowY: "auto" }}>
        {isLoading && notifications.length === 0 ? (
          <Flex vertical align="center" justify="center" style={{ padding: "32px 0" }}>
            <Spin size="default" />
            <Text style={{ marginTop: 8, color: token.colorTextDescription, fontSize: 13 }}>
              Đang tải thông báo...
            </Text>
          </Flex>
        ) : preview.length === 0 ? (
          <div style={{ padding: "32px 16px" }}>
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description={
                <Text style={{ color: token.colorTextDescription, fontSize: 13 }}>
                  Chưa có thông báo nào
                </Text>
              }
            />
          </div>
        ) : (
          <Flex vertical>
            {preview.map((item, idx) => (
              <div key={item.id}>
                <NotificationItem item={item} onRead={handleItemClick} />
                {idx < preview.length - 1 && (
                  <div style={{ borderBottom: `1px solid ${token.colorBorderSecondary}` }} />
                )}
              </div>
            ))}
          </Flex>
        )}
      </div>

      {/* Footer */}
      <Flex
        justify="center"
        align="center"
        style={{
          borderTop: `1px solid ${token.colorBorderSecondary}`,
          padding: "10px 16px",
        }}
      >
        <Button
          type="link"
          onClick={() => {
            setOpen(false);
            router.push(allNotificationsLink);
          }}
          style={{
            fontSize: 13,
            fontWeight: 500,
            padding: 0,
            height: "auto",
          }}
        >
          Xem tất cả thông báo →
        </Button>
      </Flex>
    </Card>
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
        color={token.colorError}
        overflowCount={99}
        style={{ cursor: "pointer" }}
      >
        <Button
          type="text"
          icon={
            <BellOutlined
              style={{
                fontSize: 18,
                color: unreadCount > 0 ? token.colorPrimary : token.colorTextDescription,
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
