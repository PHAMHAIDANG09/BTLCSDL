"use client";

import React, { useEffect } from "react";
import { Typography } from "antd";
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
      {/* ── Heading ── */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 32, fontWeight: 900, color: "#1e293b", letterSpacing: "-0.5px", margin: 0 }}>
          Thông báo
        </h1>
        <Text style={{ fontSize: 16, color: "#64748b", marginTop: 8, display: "block" }}>
          {notifications.length === 0
            ? "Chưa có thông báo nào"
            : unreadCount > 0
              ? `Bạn có ${unreadCount} thông báo chưa đọc`
              : `Tất cả ${notifications.length} thông báo đã được đọc`}
        </Text>
      </div>

      {/* Danh sách thông báo */}
      <NotificationList />
    </div>
  );
}
