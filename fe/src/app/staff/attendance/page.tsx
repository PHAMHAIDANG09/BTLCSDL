"use client";

import { Typography, Tag } from "antd";
import Table from "@/components/shared/Table/Table";
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

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <Title level={2} style={{ margin: 0 }}>Chấm công của tôi</Title>
        <Text type="secondary">Lịch sử chấm công cá nhân</Text>
      </div>
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
