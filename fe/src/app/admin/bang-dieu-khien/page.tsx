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
import EmployeeChart from "./_components/EmployeeChart";
import PayrollChart from "./_components/PayrollChart";

const { Title, Text } = Typography;

const STAT_CARDS = [
  {
    key: "totalEmployees",
    title: "Tổng số",
    suffix: "nhân viên",
    icon: <TeamOutlined style={{ fontSize: 18 }} />,
    color: "#dc2626",
    bg: "#fef2f2",
    border: "#fecaca",
  },
  {
    key: "presentToday",
    title: "Có mặt hôm nay",
    suffix: "người",
    icon: <ClockCircleOutlined style={{ fontSize: 18 }} />,
    color: "#16a34a",
    bg: "#f0fdf4",
    border: "#bbf7d0",
  },
  {
    key: "pendingLeaves",
    title: "Đơn chờ duyệt",
    suffix: "đơn",
    icon: <FileTextOutlined style={{ fontSize: 18 }} />,
    color: "#d97706",
    bg: "#fffbeb",
    border: "#fde68a",
  },
  {
    key: "expiringContracts",
    title: "HĐ sắp hết hạn",
    suffix: "hợp đồng",
    icon: <WarningOutlined style={{ fontSize: 18 }} />,
    color: "#0284c7",
    bg: "#f0f9ff",
    border: "#bae6fd",
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
              <Card
                bordered={false}
                style={{
                  background: card.bg,
                  border: `1px solid ${card.border}`,
                  borderRadius: 12,
                  height: "100%",
                  cursor: "default",
                }}
                styles={{ body: { padding: "18px 20px" } }}
              >
                {/* Icon + label row */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    marginBottom: 10,
                  }}
                >
                  <span style={{ color: card.color }}>{card.icon}</span>
                  <Text
                    style={{
                      color: card.color,
                      fontWeight: 600,
                      fontSize: 13,
                    }}
                  >
                    {card.title}
                  </Text>
                </div>

                {/* Số lớn */}
                {loading ? (
                  <Skeleton.Input active size="large" style={{ width: 80, height: 40 }} />
                ) : (
                  <div
                    style={{
                      fontSize: 40,
                      fontWeight: 900,
                      color: card.color,
                      lineHeight: 1,
                      fontVariantNumeric: "tabular-nums",
                    }}
                  >
                    {(value ?? 0).toLocaleString("vi-VN")}
                  </div>
                )}
              </Card>
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
