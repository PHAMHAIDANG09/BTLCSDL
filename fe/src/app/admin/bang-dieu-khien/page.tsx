"use client";

import { Card, Row, Col, Statistic } from "antd";
import {
  UserOutlined,
  ClockCircleOutlined,
  DollarOutlined,
  TeamOutlined,
} from "@ant-design/icons";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">
          Tổng quan về hệ thống quản lý nhân sự
        </p>
      </div>

      {/* Stats Cards */}
      <Row gutter={[24, 24]}>
        <Col xs={24} sm={12} lg={6}>
          <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
            <Statistic
              title="Tổng Nhân Viên"
              value={156}
              prefix={<UserOutlined className="text-blue-600" />}
              valueStyle={{ color: "#1890ff", fontSize: "28px" }}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
            <Statistic
              title="Hôm Nay Vắng"
              value={5}
              prefix={<ClockCircleOutlined className="text-red-600" />}
              valueStyle={{ color: "#ff4d4f", fontSize: "28px" }}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
            <Statistic
              title="Tháng Này Lương"
              value={45000000}
              prefix={<DollarOutlined className="text-green-600" />}
              suffix="VND"
              valueStyle={{ color: "#52c41a", fontSize: "24px" }}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
            <Statistic
              title="Đơn Chờ Duyệt"
              value={12}
              prefix={<TeamOutlined className="text-orange-600" />}
              valueStyle={{ color: "#faad14", fontSize: "28px" }}
            />
          </Card>
        </Col>
      </Row>

      {/* Charts & Tables Section */}
      <Row gutter={[24, 24]}>
        <Col xs={24} lg={12}>
          <Card
            title="Nhân Viên Theo Phòng Ban"
            className="border-0 shadow-sm"
            bodyStyle={{ height: "300px" }}
          >
            <div className="flex items-center justify-center h-full text-gray-400">
              📊 Biểu đồ sẽ được thêm sau
            </div>
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <Card
            title="Chi Phí Lương Theo Tháng"
            className="border-0 shadow-sm"
            bodyStyle={{ height: "300px" }}
          >
            <div className="flex items-center justify-center h-full text-gray-400">
              📈 Biểu đồ sẽ được thêm sau
            </div>
          </Card>
        </Col>
      </Row>

    </div>
  );
}
