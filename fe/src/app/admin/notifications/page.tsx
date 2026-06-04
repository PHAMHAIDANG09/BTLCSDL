"use client";

import React, { useEffect } from "react";
import { Typography, Divider, Card, Flex, Avatar } from "antd";
import { BellOutlined } from "@ant-design/icons";
import { useNotificationStore } from "@/store/notificationStore";
import { NotificationList } from "@/app/staff/notifications/_components/NotificationList";

const { Title, Text } = Typography;

export default function AdminNotificationsPage() {
  const { fetchNotifications, unreadCount, notifications } = useNotificationStore();

  useEffect(() => {
    // Force fresh fetch when entering the page
    useNotificationStore.setState({ lastFetchedAt: null });
    fetchNotifications();
  }, []);

  return (
    <div>
      {/* Page Header */}
      <Card
        style={{
          marginBottom: 24,
          background: "linear-gradient(135deg, #ff4d4f 0%, #ff7875 100%)",
          borderRadius: 16,
          border: "none",
        }}
        styles={{
          body: {
            padding: "24px 28px",
          },
        }}
      >
        <Flex align="center" gap={16}>
          <Avatar
            size={52}
            icon={<BellOutlined />}
            style={{
              background: "rgba(255,255,255,0.2)",
              color: "#fff",
              fontSize: 26,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          />
          <Flex vertical>
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
          </Flex>
        </Flex>
      </Card>

      <Divider style={{ margin: "0 0 20px 0" }} />

      {/* Danh sách thông báo */}
      <NotificationList />
    </div>
  );
}
