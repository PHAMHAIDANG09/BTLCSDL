"use client";

import { Typography, Tag, Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import Table from "@/components/shared/Table/Table";
import type { TableColumnsType } from "antd";
import Link from "next/link";

const { Title, Text } = Typography;

interface LeaveRequest {
  id: string;
  type: string;
  fromDate: string;
  toDate: string;
  days: number;
  reason: string;
  status: "pending" | "approved" | "rejected";
}

const MOCK_DATA: LeaveRequest[] = [
  { id: "1", type: "Nghỉ phép năm", fromDate: "2024-04-10", toDate: "2024-04-11", days: 2, reason: "Việc cá nhân", status: "approved" },
  { id: "2", type: "Nghỉ ốm", fromDate: "2024-03-20", toDate: "2024-03-20", days: 1, reason: "Bệnh", status: "approved" },
  { id: "3", type: "Nghỉ phép năm", fromDate: "2024-05-01", toDate: "2024-05-03", days: 3, reason: "Du lịch", status: "pending" },
];

const statusConfig: Record<string, { label: string; color: string }> = {
  pending: { label: "Chờ duyệt", color: "orange" },
  approved: { label: "Đã duyệt", color: "green" },
  rejected: { label: "Từ chối", color: "red" },
};

export default function StaffLeavePage() {
  const columns: TableColumnsType<LeaveRequest> = [
    { title: "Loại phép", dataIndex: "type", key: "type", width: 140 },
    { title: "Từ ngày", dataIndex: "fromDate", key: "fromDate", width: 110, render: (d) => new Date(d).toLocaleDateString("vi-VN") },
    { title: "Đến ngày", dataIndex: "toDate", key: "toDate", width: 110, render: (d) => new Date(d).toLocaleDateString("vi-VN") },
    { title: "Số ngày", dataIndex: "days", key: "days", width: 80, render: (d) => `${d} ngày` },
    { title: "Lý do", dataIndex: "reason", key: "reason" },
    {
      title: "Trạng thái", dataIndex: "status", key: "status", width: 120,
      render: (s: string) => <Tag color={statusConfig[s]?.color}>{statusConfig[s]?.label}</Tag>,
    },
  ];

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
        <div>
          <Title level={2} style={{ margin: 0 }}>Nghỉ phép</Title>
          <Text type="secondary">Quản lý đơn xin nghỉ phép của bạn</Text>
        </div>
        <Link href="/staff/nghi-phep/request">
          <Button type="primary" icon={<PlusOutlined />}>Tạo đơn xin phép</Button>
        </Link>
      </div>
      <Table<LeaveRequest>
        columns={columns}
        dataSource={MOCK_DATA}
        rowKey="id"
        searchable={false}
        totalText="đơn"
        locale={{ emptyText: "Chưa có đơn xin phép nào" }}
      />
    </div>
  );
}
