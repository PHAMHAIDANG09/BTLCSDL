"use client";

import { Typography, Tag, Row, Col } from "antd";
import { 
  MinusCircleOutlined, 
  ClockCircleOutlined, 
  CheckCircleOutlined, 
  FileTextOutlined,
  DashboardOutlined 
} from "@ant-design/icons";
import Table from "@/components/shared/Table/Table";
import StatsCard from "@/components/shared/StatsCard/StatsCard";
import type { TableColumnsType } from "antd";

const { Title, Text } = Typography;

interface AttendanceRecord {
  id: string;
  date: string;
  checkIn: string;
  checkOut: string;
  workHours: number;
  lateMinutes: number;
  status: "on-time" | "late" | "absent" | "on-leave";
}

const MOCK_DATA: AttendanceRecord[] = [
  { id: "1", date: "2024-04-27", checkIn: "08:00", checkOut: "17:30", workHours: 8.5, lateMinutes: 0, status: "on-time" },
  { id: "2", date: "2024-04-26", checkIn: "08:15", checkOut: "17:45", workHours: 8.5, lateMinutes: 15, status: "late" },
  { id: "3", date: "2024-04-25", checkIn: "-", checkOut: "-", workHours: 0, lateMinutes: 0, status: "on-leave" },
];

const statusConfig: Record<string, { label: string; color: string }> = {
  "on-time": { label: "Đúng giờ", color: "green" },
  late: { label: "Đi muộn", color: "orange" },
  absent: { label: "Vắng mặt", color: "red" },
  "on-leave": { label: "Nghỉ phép", color: "blue" },
};

export default function StaffAttendancePage() {
  const columns: TableColumnsType<AttendanceRecord> = [
    {
      title: "Ngày", dataIndex: "date", key: "date", width: 110,
      render: (d) => new Date(d).toLocaleDateString("vi-VN"),
      sorter: (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
    },
    { title: "Giờ vào", dataIndex: "checkIn", key: "checkIn", width: 90, render: (t) => t || "-" },
    { title: "Giờ ra", dataIndex: "checkOut", key: "checkOut", width: 90, render: (t) => t || "-" },
    { title: "Số giờ", dataIndex: "workHours", key: "workHours", width: 80, render: (h) => `${h}h` },
    {
      title: "Muộn", dataIndex: "lateMinutes", key: "lateMinutes", width: 90,
      render: (m) => m === 0 ? <span style={{ color: "#52c41a" }}>0 phút</span> : <span style={{ color: "#faad14" }}>{m} phút</span>,
    },
    {
      title: "Trạng thái", dataIndex: "status", key: "status", width: 120,
      render: (s: string) => <Tag color={statusConfig[s]?.color}>{statusConfig[s]?.label}</Tag>,
    },
  ];

  const stats = [
    { label: "Có mặt", value: 2, icon: <CheckCircleOutlined />, color: "#13940cff", bg: "#f6ffed" },
    { label: "Đi muộn", value: 2, icon: <ClockCircleOutlined />, color: "#dba211ff", bg: "#fff7e6" },
    { label: "Vắng mặt", value: 0, icon: <MinusCircleOutlined />, color: "#e00c10ff", bg: "#fff1f0" },
    { label: "Nghỉ phép", value: 1, icon: <FileTextOutlined />, color: "#1572c9ff", bg: "#e6f7ff" },
    { label: "Tổng giờ", value: "34 h", icon: <DashboardOutlined />, color: "#262626", bg: "#f5f5f5" },
  ];

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <Title level={2} style={{ margin: 0 }}>Chấm công của tôi</Title>
        <Text type="secondary">Lịch sử chấm công cá nhân và thống kê tháng này</Text>
      </div>

      {/* Stats Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        {stats.map((item, idx) => (
          <Col xs={24} sm={12} md={idx === 4 ? 8 : 4} key={idx}>
            <StatsCard 
              label={item.label}
              value={item.value}
              icon={item.icon}
              color={item.color}
              bg={item.bg}
              size="small"
            />
          </Col>
        ))}
      </Row>

      <Table<AttendanceRecord>
        columns={columns}
        dataSource={MOCK_DATA}
        rowKey="id"
        searchable={false}
        totalText="bản ghi"
        locale={{ emptyText: "Không có dữ liệu" }}
      />
    </div>
  );
}
