"use client";

import { Typography, Row, Col, Card, Statistic } from "antd";
import {
  ClockCircleOutlined,
  CalendarOutlined,
  DollarOutlined,
  BellOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;

export default function StaffHomePage() {
  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <Title level={2} style={{ margin: 0 }}>Xin chào! 👋</Title>
        <Text type="secondary">Đây là trang tổng quan của bạn.</Text>
      </div>

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Ngày công tháng này"
              value={18}
              suffix="/ 22 ngày"
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: "#1d4ed8" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Số ngày phép còn lại"
              value={8}
              suffix="ngày"
              prefix={<CalendarOutlined />}
              valueStyle={{ color: "#52c41a" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Lương tháng trước"
              value={15000000}
              suffix="đ"
              prefix={<DollarOutlined />}
              valueStyle={{ color: "#faad14" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Thông báo chưa đọc"
              value={3}
              prefix={<BellOutlined />}
              valueStyle={{ color: "#ff4d4f" }}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
}
