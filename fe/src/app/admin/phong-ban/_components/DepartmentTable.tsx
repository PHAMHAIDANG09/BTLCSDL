"use client";

import React from "react";
import { Table, Space, Typography, Tooltip, Input } from "antd";
import { EditOutlined, DeleteOutlined, UserOutlined, SearchOutlined } from "@ant-design/icons";
import { Department } from "@/services/organization.service";
import Button from "@/components/shared/Button/Button";

const { Text } = Typography;

interface DepartmentTableProps {
  departments: Department[];
  loading: boolean;
  employeeMap: Map<number, string>;
  departmentMap: Map<number, string>;
  onEdit: (record: Department) => void;
  onDelete: (id: number) => void;
}

export default function DepartmentTable({
  departments,
  loading,
  employeeMap,
  departmentMap,
  onEdit,
  onDelete,
}: DepartmentTableProps) {

  // Search filter helper for columns
  const getColumnSearchProps = (dataIndex: keyof Department, placeholder: string) => ({
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
    onFilter: (value: any, record: Department) => {
      const val = record[dataIndex];
      return val ? String(val).toLowerCase().includes(String(value).toLowerCase()) : false;
    },
  });

  const columns = [
    {
      title: "Mã phòng",
      dataIndex: "MaPhong",
      key: "MaPhong",
      width: "15%",
      ...getColumnSearchProps("MaPhong", "Tìm mã phòng..."),
      render: (text: string) => <Text strong className="text-red-700">{text}</Text>,
    },
    {
      title: "Tên phòng ban",
      dataIndex: "TenPhong",
      key: "TenPhong",
      width: "35%",
      ...getColumnSearchProps("TenPhong", "Tìm tên phòng..."),
    },
    {
      title: "Phòng ban cha",
      dataIndex: "MaPhongCha",
      key: "MaPhongCha",
      width: "20%",
      render: (parentDeptId: number) => departmentMap.get(parentDeptId) || <Text type="secondary">—</Text>,
    },
    {
      title: "Trưởng phòng (Quản lý)",
      dataIndex: "MaQuanLy",
      key: "MaQuanLy",
      width: "20%",
      render: (managerId: number) => {
        const name = employeeMap.get(managerId);
        return name ? (
          <Space>
            <UserOutlined style={{ color: "#8c8c8c" }} />
            <span>{name}</span>
          </Space>
        ) : (
          <Text type="secondary">—</Text>
        );
      },
    },
    {
      title: "Thao tác",
      key: "action",
      width: "10%",
      align: "center" as const,
      render: (_: any, record: Department) => (
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
      dataSource={departments}
      columns={columns}
      rowKey="Id"
      loading={loading}
      pagination={{ pageSize: 10, showSizeChanger: true }}
      locale={{ emptyText: "Không tìm thấy phòng ban nào" }}
      className="bg-white rounded-lg overflow-hidden"
    />
  );
}
