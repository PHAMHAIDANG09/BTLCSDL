"use client";

import React from "react";
import { Table, Space, Typography, Tooltip, Tag, Input } from "antd";
import { EditOutlined, DeleteOutlined, CheckOutlined, CloseOutlined, SearchOutlined } from "@ant-design/icons";
import { LeaveType } from "../page";
import Button from "@/components/shared/Button/Button";

const { Text } = Typography;

interface LeaveTypeTableProps {
  leaveTypes: LeaveType[];
  loading: boolean;
  onEdit: (record: LeaveType) => void;
  onDelete: (id: number) => void;
}

export default function LeaveTypeTable({
  leaveTypes,
  loading,
  onEdit,
  onDelete,
}: LeaveTypeTableProps) {

  // Search filter helper for columns
  const getColumnSearchProps = (dataIndex: keyof LeaveType, placeholder: string) => ({
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
    onFilter: (value: any, record: LeaveType) => {
      const val = record[dataIndex];
      return val ? String(val).toLowerCase().includes(String(value).toLowerCase()) : false;
    },
  });

  const columns = [
    {
      title: "Tên loại nghỉ phép",
      dataIndex: "TenLoaiPhep",
      key: "TenLoaiPhep",
      width: "35%",
      ...getColumnSearchProps("TenLoaiPhep", "Tìm tên loại phép..."),
      render: (text: string) => <Text strong className="text-red-700">{text}</Text>,
    },
    {
      title: "Hưởng lương",
      dataIndex: "CoHuongLuong",
      key: "CoHuongLuong",
      width: "20%",
      align: "center" as const,
      render: (paid: boolean) => paid ? (
        <Tag color="success" icon={<CheckOutlined />}>Có hưởng lương</Tag>
      ) : (
        <Tag color="default" icon={<CloseOutlined />}>Không hưởng lương</Tag>
      ),
      sorter: (a: LeaveType, b: LeaveType) => (a.CoHuongLuong === b.CoHuongLuong ? 0 : a.CoHuongLuong ? 1 : -1),
    },
    {
      title: "Số ngày phép tối đa / năm",
      dataIndex: "SoNgayToiDaNam",
      key: "SoNgayToiDaNam",
      width: "20%",
      align: "center" as const,
      render: (days: number) => <Text strong>{days} ngày</Text>,
      sorter: (a: LeaveType, b: LeaveType) => a.SoNgayToiDaNam - b.SoNgayToiDaNam,
    },
    {
      title: "Mô tả",
      dataIndex: "MoTa",
      key: "MoTa",
      width: "15%",
      ...getColumnSearchProps("MoTa", "Tìm mô tả..."),
      render: (text: string) => text || <Text type="secondary">—</Text>,
    },
    {
      title: "Thao tác",
      key: "action",
      width: "10%",
      align: "center" as const,
      render: (_: any, record: LeaveType) => (
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
      dataSource={leaveTypes}
      columns={columns}
      rowKey="Id"
      loading={loading}
      pagination={{ pageSize: 10, showSizeChanger: true }}
      locale={{ emptyText: "Không tìm thấy loại nghỉ phép nào" }}
      className="bg-white rounded-lg overflow-hidden"
    />
  );
}
