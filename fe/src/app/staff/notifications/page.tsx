"use client";

import { Typography, List, Badge, Tag } from "antd";
import { BellOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

const MOCK_NOTIFICATIONS = [
  { id: "1", title: "Phiếu lương tháng 4 đã sẵn sàng", time: "2 giờ trước", read: false, type: "payslip" },
  { id: "2", title: "Đơn xin nghỉ phép của bạn đã được duyệt", time: "1 ngày trước", read: false, type: "leave" },
  { id: "3", title: "Nhắc nhở: Cập nhật thông tin cá nhân", time: "3 ngày trước", read: true, type: "info" },
];

const typeColor: Record<string, string> = {
  payslip: "blue",
  leave: "green",
  info: "default",
};

export default function StaffNotificationsPage() {
  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <Title level={2} style={{ margin: 0 }}>Thông báo</Title>
        <Text type="secondary">Các thông báo dành cho bạn</Text>
      </div>

      <List
        itemLayout="horizontal"
        dataSource={MOCK_NOTIFICATIONS}
        renderItem={(item) => (
          <List.Item
            style={{
              background: item.read ? "#fff" : "#f0f5ff",
              padding: "16px 20px",
              borderRadius: 8,
              marginBottom: 8,
              border: "1px solid #f0f0f0",
            }}
          >
            <List.Item.Meta
              avatar={
                <Badge dot={!item.read}>
                  <BellOutlined style={{ fontSize: 20, color: "var(--primary-color)" }} />
                </Badge>
              }
              title={
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontWeight: item.read ? 400 : 600 }}>{item.title}</span>
                  <Tag color={typeColor[item.type]}>{item.type}</Tag>
                </div>
              }
              description={<Text type="secondary" style={{ fontSize: 12 }}>{item.time}</Text>}
            />
          </List.Item>
        )}
      />
    </div>
  );
}
