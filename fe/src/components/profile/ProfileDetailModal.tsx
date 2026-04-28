"use client";

import React from "react";
import { Modal, Tabs, Descriptions, Tag, Empty } from "antd";
import { 
  SolutionOutlined, 
  FileTextOutlined, 
  HistoryOutlined, 
  SafetyCertificateOutlined,
  DollarOutlined
} from "@ant-design/icons";
import Table from "@/components/shared/Table/Table";
import dayjs from "dayjs";

interface ProfileDetailModalProps {
  open: boolean;
  onCancel: () => void;
  data: any;
}

// 10 Dữ liệu mẫu cho Lịch sử lương (Biến động lương cơ bản)
const MOCK_SALARY_HISTORY = [
  { id: 1, amount: 15000000, allowance: 2000000, startDate: "2024-01-01", endDate: null, isActive: true, note: "Điều chỉnh lương định kỳ năm 2024" },
  { id: 2, amount: 14000000, allowance: 1500000, startDate: "2023-07-01", endDate: "2023-12-31", isActive: false, note: "Tăng lương sau thử việc" },
  { id: 3, amount: 12000000, allowance: 1000000, startDate: "2023-01-01", endDate: "2023-06-30", isActive: false, note: "Thử việc" },
  { id: 4, amount: 11000000, allowance: 1000000, startDate: "2022-06-01", endDate: "2022-12-31", isActive: false, note: "Điều chỉnh lương năm 2022" },
  { id: 5, amount: 10000000, allowance: 500000, startDate: "2021-12-01", endDate: "2022-05-31", isActive: false, note: "Tăng lương thâm niên" },
  { id: 6, amount: 9000000, allowance: 500000, startDate: "2021-06-01", endDate: "2021-11-30", isActive: false, note: "Điều chỉnh lương định kỳ" },
  { id: 7, amount: 8500000, allowance: 500000, startDate: "2021-01-01", endDate: "2021-05-31", isActive: false, note: "Tăng lương định kỳ" },
  { id: 8, amount: 8000000, allowance: 0, startDate: "2020-07-01", endDate: "2020-12-31", isActive: false, note: "Sau thử việc (2020)" },
  { id: 9, amount: 7000000, allowance: 0, startDate: "2020-04-01", endDate: "2020-06-30", isActive: false, note: "Thử việc (2020)" },
  { id: 10, amount: 6500000, allowance: 0, startDate: "2020-01-01", endDate: "2020-03-31", isActive: false, note: "Lương khởi điểm ban đầu" },
];

// 10 Dữ liệu mẫu cho Phiếu lương hàng tháng
const MOCK_PAYSLIPS = [
  { id: 1, month: 4, year: 2024, standardWorkDays: 22, actualWorkDays: 22, overtimeHours: 4, baseSalary: 15000000, allowance: 2000000, overtimePay: 500000, deductions: 0, insurance: 1500000, tax: 450000, netSalary: 15550000, status: "Đã thanh toán" },
  { id: 2, month: 3, year: 2024, standardWorkDays: 21, actualWorkDays: 21, overtimeHours: 2, baseSalary: 15000000, allowance: 2000000, overtimePay: 250000, deductions: 50000, insurance: 1500000, tax: 400000, netSalary: 15300000, status: "Đã thanh toán" },
  { id: 3, month: 2, year: 2024, standardWorkDays: 20, actualWorkDays: 18, overtimeHours: 0, baseSalary: 15000000, allowance: 2000000, overtimePay: 0, deductions: 0, insurance: 1500000, tax: 350000, netSalary: 15150000, status: "Đã thanh toán" },
  { id: 4, month: 1, year: 2024, standardWorkDays: 22, actualWorkDays: 22, overtimeHours: 10, baseSalary: 15000000, allowance: 2000000, overtimePay: 1200000, deductions: 0, insurance: 1500000, tax: 600000, netSalary: 16100000, status: "Đã thanh toán" },
  { id: 5, month: 12, year: 2023, standardWorkDays: 21, actualWorkDays: 21, overtimeHours: 0, baseSalary: 14000000, allowance: 1500000, overtimePay: 0, deductions: 0, insurance: 1400000, tax: 300000, netSalary: 13800000, status: "Đã thanh toán" },
  { id: 6, month: 11, year: 2023, standardWorkDays: 22, actualWorkDays: 22, overtimeHours: 5, baseSalary: 14000000, allowance: 1500000, overtimePay: 600000, deductions: 0, insurance: 1400000, tax: 350000, netSalary: 14350000, status: "Đã thanh toán" },
  { id: 7, month: 10, year: 2023, standardWorkDays: 22, actualWorkDays: 22, overtimeHours: 0, baseSalary: 14000000, allowance: 1500000, overtimePay: 0, deductions: 100000, insurance: 1400000, tax: 250000, netSalary: 13750000, status: "Đã thanh toán" },
  { id: 8, month: 9, year: 2023, standardWorkDays: 21, actualWorkDays: 21, overtimeHours: 2, baseSalary: 14000000, allowance: 1500000, overtimePay: 250000, deductions: 0, insurance: 1400000, tax: 280000, netSalary: 14070000, status: "Đã thanh toán" },
  { id: 9, month: 8, year: 2023, standardWorkDays: 23, actualWorkDays: 23, overtimeHours: 0, baseSalary: 14000000, allowance: 1500000, overtimePay: 0, deductions: 0, insurance: 1400000, tax: 250000, netSalary: 13850000, status: "Đã thanh toán" },
  { id: 10, month: 7, year: 2023, standardWorkDays: 21, actualWorkDays: 21, overtimeHours: 4, baseSalary: 14000000, allowance: 1500000, overtimePay: 500000, deductions: 0, insurance: 1400000, tax: 320000, netSalary: 14280000, status: "Đã thanh toán" },
];

export default function ProfileDetailModal({ open, onCancel, data }: ProfileDetailModalProps) {
  const historyColumns = [
    { title: "Từ ngày", dataIndex: "startDate", key: "startDate", render: (val: string) => dayjs(val).format("DD/MM/YYYY") },
    { title: "Đến ngày", dataIndex: "endDate", key: "endDate", render: (val: string | null) => val ? dayjs(val).format("DD/MM/YYYY") : "Hiện tại" },
    { title: "Lương cơ bản", dataIndex: "amount", key: "amount", render: (val: number) => val.toLocaleString("vi-VN") + " đ" },
    { title: "Phụ cấp", dataIndex: "allowance", key: "allowance", render: (val: number) => val.toLocaleString("vi-VN") + " đ" },
    { title: "Trạng thái", dataIndex: "isActive", key: "isActive", render: (active: boolean) => <Tag color={active ? "green" : "gray"}>{active ? "Đang hiệu lực" : "Hết hiệu lực"}</Tag> },
    { title: "Ghi chú", dataIndex: "note", key: "note" },
  ];

  const payslipColumns = [
    { title: "Kỳ lương", key: "period", render: (_: any, record: any) => `${record.month}/${record.year}` },
    { title: "Công (Thực tế/Chuẩn)", key: "days", render: (_: any, record: any) => `${record.actualWorkDays}/${record.standardWorkDays}` },
    { 
      title: "Thu nhập (Lương+PC+OT)", 
      key: "gross", 
      render: (_: any, record: any) => (record.baseSalary + record.allowance + record.overtimePay).toLocaleString("vi-VN") + " đ" 
    },
    { 
      title: "Khấu trừ (Thuế+BH)", 
      key: "deductions", 
      render: (_: any, record: any) => <span style={{ color: "#cf1322" }}>-{(record.tax + record.insurance + record.deductions).toLocaleString("vi-VN")} đ</span> 
    },
    { title: "Thực nhận", dataIndex: "netSalary", key: "netSalary", render: (val: number) => <span style={{ fontWeight: 700, color: "var(--primary-color)" }}>{val.toLocaleString("vi-VN")} đ</span> },
    { title: "Trạng thái", dataIndex: "status", key: "status", render: (status: string) => <Tag color="green">{status}</Tag> },
  ];

  const items = [
    {
      key: "work",
      label: <span><SolutionOutlined style={{ marginRight: 8 }} />Công tác</span>,
      children: (
        <div style={{ paddingTop: 16 }}>
          <Descriptions column={1} bordered size="small" labelStyle={{ background: '#fafafa', width: 160, fontWeight: 600 }}>
            <Descriptions.Item label="Mã nhân viên">{data.employeeCode}</Descriptions.Item>
            <Descriptions.Item label="Phòng ban">{data.department === 'IT' ? 'Phòng Công nghệ' : data.department}</Descriptions.Item>
            <Descriptions.Item label="Chức vụ">{data.position === 'SDEV' ? 'Senior Developer' : data.position}</Descriptions.Item>
            <Descriptions.Item label="Ngày bắt đầu">{dayjs(data.startDate).format("DD/MM/YYYY")}</Descriptions.Item>
            <Descriptions.Item label="Trạng thái"><Tag color="green">{data.status}</Tag></Descriptions.Item>
          </Descriptions>
        </div>
      ),
    },
    {
      key: "contract-info",
      label: <span><FileTextOutlined style={{ marginRight: 8 }} />Hợp đồng & Lương</span>,
      children: (
        <div style={{ paddingTop: 16 }}>
          <Descriptions column={1} bordered size="small" labelStyle={{ background: '#fafafa', width: 160, fontWeight: 600 }}>
            <Descriptions.Item label="Số hợp đồng"><Tag color="orange">{data.contractNumber || "HĐ-2025-001"}</Tag></Descriptions.Item>
            <Descriptions.Item label="Loại hợp đồng">{data.contractType === '1year' ? 'Hợp đồng 1 năm' : data.contractType}</Descriptions.Item>
            <Descriptions.Item label="Lương cơ bản"><span style={{ fontWeight: 700, color: 'var(--primary-color)' }}>{data.baseSalary.toLocaleString("vi-VN")} đ</span></Descriptions.Item>
            <Descriptions.Item label="Ngày ký hợp đồng">{dayjs(data.contractSignDate).format("DD/MM/YYYY")}</Descriptions.Item>
            <Descriptions.Item label="Ngày hết hạn">{data.contractExpiredDate ? dayjs(data.contractExpiredDate).format("DD/MM/YYYY") : "Không thời hạn"}</Descriptions.Item>
          </Descriptions>
        </div>
      ),
    },
    {
      key: "history",
      label: <span><HistoryOutlined style={{ marginRight: 8 }} />Lịch sử lương</span>,
      children: (
        <div style={{ paddingTop: 16 }}>
          <div style={{ marginBottom: 12, fontWeight: 600, fontSize: 14 }}>Biến động lương cơ bản (10 bản ghi gần nhất)</div>
          <Table columns={historyColumns} dataSource={MOCK_SALARY_HISTORY} searchable={false} pagination={{ pageSize: 5 }} size="small" />
        </div>
      ),
    },
    {
      key: "payslips",
      label: <span><DollarOutlined style={{ marginRight: 8 }} />Phiếu lương</span>,
      children: (
        <div style={{ paddingTop: 16 }}>
          <div style={{ marginBottom: 12, fontWeight: 600, fontSize: 14 }}>Lịch sử nhận lương hàng tháng (10 tháng gần nhất)</div>
          <Table columns={payslipColumns} dataSource={MOCK_PAYSLIPS} searchable={false} pagination={{ pageSize: 5 }} size="small" />
        </div>
      ),
    },
    {
      key: "contract",
      label: <span><SafetyCertificateOutlined style={{ marginRight: 8 }} />Thông tin hợp đồng</span>,
      children: (
        <div style={{ paddingTop: 32, paddingBottom: 32 }}><Empty description="Hiện tại chưa có dữ liệu hợp đồng chi tiết" /></div>
      ),
    },
  ];

  return (
    <Modal title={<span style={{ fontWeight: 700 }}>Chi tiết hồ sơ nhân sự</span>} open={open} onCancel={onCancel} footer={null} width={1000} destroyOnClose centered>
      <Tabs defaultActiveKey="work" items={items} />
    </Modal>
  );
}
