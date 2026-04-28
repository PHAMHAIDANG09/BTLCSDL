"use client";

import { Typography, Tag } from "antd";
import Table from "@/components/shared/Table/Table";
import type { TableColumnsType } from "antd";
import Link from "next/link";

const { Title, Text } = Typography;

interface Payslip {
  id: string;
  month: string;
  baseSalary: number;
  allowance: number;
  deduction: number;
  netSalary: number;
  status: "paid" | "pending";
}

const MOCK_DATA: Payslip[] = [
  { id: "1", month: "Tháng 4/2024", baseSalary: 15000000, allowance: 2000000, deduction: 1500000, netSalary: 15500000, status: "paid" },
  { id: "2", month: "Tháng 3/2024", baseSalary: 15000000, allowance: 2000000, deduction: 1500000, netSalary: 15500000, status: "paid" },
  { id: "3", month: "Tháng 2/2024", baseSalary: 15000000, allowance: 1500000, deduction: 1500000, netSalary: 15000000, status: "paid" },
];

const fmt = (n: number) => n.toLocaleString("vi-VN") + "đ";

export default function StaffPayslipPage() {
  const columns: TableColumnsType<Payslip> = [
    { title: "Tháng", dataIndex: "month", key: "month", width: 140 },
    { title: "Lương cơ bản", dataIndex: "baseSalary", key: "baseSalary", width: 140, render: fmt },
    { title: "Phụ cấp", dataIndex: "allowance", key: "allowance", width: 110, render: fmt },
    { title: "Khấu trừ", dataIndex: "deduction", key: "deduction", width: 110, render: fmt },
    { title: "Thực nhận", dataIndex: "netSalary", key: "netSalary", width: 140, render: (v) => <b style={{ color: "#1d4ed8" }}>{fmt(v)}</b> },
    {
      title: "Trạng thái", dataIndex: "status", key: "status", width: 110,
      render: (s: string) => <Tag color={s === "paid" ? "green" : "orange"}>{s === "paid" ? "Đã thanh toán" : "Chờ xử lý"}</Tag>,
    },
    {
      title: "Chi tiết", key: "action", width: 90,
      render: (_, r) => <Link href={`/staff/payslip/${r.id}`} style={{ color: "var(--primary-color)" }}>Xem</Link>,
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <Title level={2} style={{ margin: 0 }}>Phiếu lương</Title>
        <Text type="secondary">Lịch sử phiếu lương của bạn</Text>
      </div>
      <Table<Payslip>
        columns={columns}
        dataSource={MOCK_DATA}
        rowKey="id"
        searchable={false}
        totalText="phiếu"
        locale={{ emptyText: "Chưa có phiếu lương" }}
      />
    </div>
  );
}
