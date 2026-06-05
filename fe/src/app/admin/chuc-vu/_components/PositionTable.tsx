"use client";

import React from "react";
import { Table, Space, Typography, Tooltip, Input, theme } from "antd";
import { EditOutlined, DeleteOutlined, SearchOutlined } from "@ant-design/icons";
import { Position } from "@/services/organization.service";
import Button from "@/components/shared/Button/Button";

const { Text } = Typography;

interface PositionTableProps {
  positions: Position[];
  loading: boolean;
  onEdit: (record: Position) => void;
  onDelete: (id: number) => void;
}

export default function PositionTable({
  positions,
  loading,
  onEdit,
  onDelete,
}: PositionTableProps) {
  const { token } = theme.useToken();

  // Search filter helper for columns
  const getColumnSearchProps = (dataIndex: keyof Position, placeholder: string) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }: any) => (
      <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
        <Input
          placeholder={placeholder}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => confirm()}
          style={{ marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => confirm()}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Tìm
          </Button>
          <Button
            onClick={() => {
              clearFilters?.();
              confirm();
            }}
            size="small"
            style={{ width: 90 }}
          >
            Reset
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered: boolean) => (
      <SearchOutlined style={{ color: filtered ? "var(--primary-color)" : undefined }} />
    ),
    onFilter: (value: any, record: Position) => {
      const val = record[dataIndex];
      return val ? String(val).toLowerCase().includes(String(value).toLowerCase()) : false;
    },
  });

  const columns = [
    {
      title: "Tên chức vụ",
      dataIndex: "TenChucVu",
      key: "TenChucVu",
      width: "35%",
      ...getColumnSearchProps("TenChucVu", "Tìm tên chức vụ..."),
      render: (text: string) => <Text strong style={{ color: token.colorPrimary }}>{text}</Text>,
    },
    {
      title: "Cấp độ",
      dataIndex: "CapDo",
      key: "CapDo",
      width: "15%",
      align: "center" as const,
      render: (level: number) => <Text strong>{level}</Text>,
      sorter: (a: Position, b: Position) => a.CapDo - b.CapDo,
    },
    {
      title: "Mô tả chức vụ",
      dataIndex: "MoTa",
      key: "MoTa",
      width: "40%",
      ...getColumnSearchProps("MoTa", "Tìm mô tả chức vụ..."),
      render: (text: string) => text || <Text type="secondary">—</Text>,
    },
    {
      title: "Thao tác",
      key: "action",
      width: "10%",
      align: "center" as const,
      render: (_: any, record: Position) => (
        <Space size="middle">
          <Tooltip title="Chỉnh sửa">
            <Button
              type="text"
              icon={<EditOutlined style={{ color: "var(--primary-color)" }} />}
              onClick={() => onEdit(record)}
            />
          </Tooltip>
          <Tooltip title="Xóa">
            <Button
              type="text"
              danger
              icon={<DeleteOutlined style={{ color: "var(--error-color)" }} />}
              onClick={() => onDelete(record.Id)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <Table
      dataSource={positions}
      columns={columns}
      rowKey="Id"
      loading={loading}
      pagination={{ pageSize: 10, showSizeChanger: true }}
      locale={{ emptyText: "Không tìm thấy chức vụ nào" }}
      className="bg-white rounded-lg overflow-hidden"
    />
  );
}
