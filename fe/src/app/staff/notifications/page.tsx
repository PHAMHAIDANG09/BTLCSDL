"use client";

import React, { useEffect } from "react";
import { Typography, Divider } from "antd";
import { BellOutlined } from "@ant-design/icons";
import { useNotificationStore } from "@/store/notificationStore";
import { NotificationList } from "./_components/NotificationList";

const { Title, Text } = Typography;

export default function StaffNotificationsPage() {
  const { fetchNotifications, unreadCount, notifications } = useNotificationStore();

  useEffect(() => {
    // Force fresh fetch khi vào trang
    useNotificationStore.setState({ lastFetchedAt: null });
    fetchNotifications();
  }, []);

  return (
    <div>
      {/* Page Header */}
      <div
        style={{
          marginBottom: 24,
          padding: "24px 28px",
          background: "linear-gradient(135deg, #1677ff 0%, #4096ff 100%)",
          borderRadius: 16,
          color: "#fff",
          display: "flex",
          alignItems: "center",
          gap: 16,
        }}
      >
        <div
          style={{
            width: 52,
            height: 52,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.2)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 26,
          }}
        >
          <BellOutlined />
        </div>
        <div>
          <Title level={3} style={{ margin: 0, color: "#fff", fontWeight: 700 }}>
            Thông báo của tôi
          </Title>
          <Text style={{ color: "rgba(255,255,255,0.85)", fontSize: 14 }}>
            {notifications.length === 0
              ? "Chưa có thông báo nào"
              : unreadCount > 0
                ? `Bạn có ${unreadCount} thông báo chưa đọc`
                : `Tất cả ${notifications.length} thông báo đã được đọc`}
          </Text>
        </div>
      </div>

      <Divider style={{ margin: "0 0 20px 0" }} />

      {/* Danh sách thông báo */}
      <NotificationList />
    </div>
  );
}
