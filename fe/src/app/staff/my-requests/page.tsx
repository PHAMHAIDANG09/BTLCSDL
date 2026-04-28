"use client";

import { Typography, Tag, Row, Col } from "antd";
import { 
  MinusCircleOutlined, 
  CheckCircleOutlined, 
  ClockCircleOutlined, 
  FileTextOutlined 
} from "@ant-design/icons";
import Table from "@/components/shared/Table/Table";
import StatsCard from "@/components/shared/StatsCard/StatsCard";
import type { TableColumnsType } from "antd";

const { Title, Text } = Typography;

interface MyRequest {
  id: string;
  type: string;
  submittedAt: string;
  status: "pending" | "approved" | "rejected";
  note?: string;
}

const MOCK_DATA: MyRequest[] = [
  { id: "1", type: "Đơn xin nghỉ phép", submittedAt: "2024-04-20", status: "approved" },
  { id: "2", type: "Đơn xin làm thêm giờ", submittedAt: "2024-04-15", status: "pending" },
  { id: "3", type: "Đơn xin cập nhật thông tin", submittedAt: "2024-04-01", status: "rejected", note: "Thiếu tài liệu đính kèm" },
];

const statusConfig: Record<string, { label: string; color: string }> = {
  pending: { label: "Chờ duyệt", color: "orange" },
  approved: { label: "Đã duyệt", color: "green" },
  rejected: { label: "Từ chối", color: "red" },
};

export default function MyRequestsPage() {
  const columns: TableColumnsType<MyRequest> = [
    { title: "Loại đơn", dataIndex: "type", key: "type" },
    {
      title: "Ngày gửi", dataIndex: "submittedAt", key: "submittedAt", width: 120,
      render: (d) => new Date(d).toLocaleDateString("vi-VN"),
    },
    {
      title: "Trạng thái", dataIndex: "status", key: "status", width: 120,
      render: (s: string) => <Tag color={statusConfig[s]?.color}>{statusConfig[s]?.label}</Tag>,
    },
    { title: "Ghi chú", dataIndex: "note", key: "note", render: (n) => n || "-" },
  ];

  const stats = [
    { label: "Tổng số", value: 5, icon: <MinusCircleOutlined />, color: "#e00c10ff", bg: "#fff1f0" },
    { label: "Đã hoàn thành", value: 1, icon: <CheckCircleOutlined />, color: "#13940cff", bg: "#f6ffed" },
    { label: "Đang diễn ra", value: 2, icon: <ClockCircleOutlined />, color: "#dba211ff", bg: "#fff7e6" },
    { label: "Nghỉ phép", value: 1, icon: <FileTextOutlined />, color: "#1572c9ff", bg: "#e6f7ff" },
  ];

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <Title level={2} style={{ margin: 0 }}>Đơn của tôi</Title>
        <Text type="secondary">Theo dõi trạng thái các đơn bạn đã gửi</Text>
      </div>

      {/* Stats Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        {stats.map((item, idx) => (
          <Col xs={24} sm={12} lg={6} key={idx}>
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

      <Table<MyRequest>
        columns={columns}
        dataSource={MOCK_DATA}
        rowKey="id"
        searchable={false}
        totalText="đơn"
        locale={{ emptyText: "Bạn chưa gửi đơn nào" }}
      />
    </div>
  );
}
