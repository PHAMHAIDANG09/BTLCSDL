"use client";

import { useEffect, useState } from "react";
import { Row, Col, Card, Typography, Alert, Skeleton } from "antd";
import {
  TeamOutlined,
  ClockCircleOutlined,
  FileTextOutlined,
  WarningOutlined,
} from "@ant-design/icons";
import dashboardService, { type DashboardStats } from "@/services/dashboard.service";
import { AttendanceService } from "@/services/attendance.service";
import StatsCard from "@/components/shared/StatsCard/StatsCard";
import EmployeeChart from "./_components/EmployeeChart";
import PayrollChart from "./_components/PayrollChart";

const { Title, Text } = Typography;

const STAT_CARDS = [
  {
    key: "totalEmployees",
    title: "Tổng số",
    icon: <TeamOutlined />,
    color: "var(--primary-color)",
    bg: "var(--primary-bg)",
  },
  {
    key: "presentToday",
    title: "Có mặt hôm nay",
    icon: <ClockCircleOutlined />,
    color: "var(--success-color)",
    bg: "#f6ffed",
  },
  {
    key: "pendingLeaves",
    title: "Đơn chờ duyệt",
    icon: <FileTextOutlined />,
    color: "var(--warning-color)",
    bg: "#fff7e6",
  },
  {
    key: "expiringContracts",
    title: "HĐ sắp hết hạn",
    icon: <WarningOutlined />,
    color: "var(--info-color)",
    bg: "#e6f7ff",
  },
];

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [pendingOT, setPendingOT] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    Promise.all([
      dashboardService.getStats(),
      AttendanceService.getAllOTRequests("Pending"),
    ])
      .then(([statsData, otData]) => {
        setStats(statsData);
        setPendingOT(otData ? otData.length : 0);
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      {/* ── Tiêu đề ── */}
      <div style={{ marginBottom: 24 }}>
        <Title level={2} style={{ margin: 0, fontWeight: 800, color: "#111827" }}>
          Dashboard
        </Title>
      </div>

      {error && (
        <Alert
          type="warning"
          message="Không thể tải số liệu. Kiểm tra kết nối backend."
          showIcon
          closable
          style={{ marginBottom: 16, borderRadius: 10 }}
        />
      )}

      {/* ── Thẻ thống kê – style giống trang chấm công ── */}
      <Row gutter={[16, 16]} style={{ marginBottom: 20 }}>
        {STAT_CARDS.map((card) => {
          let value = stats ? (stats as any)[card.key] : undefined;
          // Cộng thêm đơn làm thêm giờ vào đơn chờ duyệt
          if (card.key === "pendingLeaves" && value !== undefined) {
            value += pendingOT;
          }

          return (
            <Col key={card.key} xs={24} sm={12} xl={6}>
              <StatsCard
                label={card.title}
                value={loading ? "..." : (value ?? 0).toLocaleString("vi-VN")}
                color={card.color}
                bg={card.bg}
                icon={card.icon}
              />
            </Col>
          );
        })}
      </Row>

      {/* ── Biểu đồ ── */}
      <Row gutter={[16, 16]}>
        <Col xs={24} xl={12}>
          <EmployeeChart />
        </Col>
        <Col xs={24} xl={12}>
          <PayrollChart />
        </Col>
      </Row>
    </div>
  );
}
