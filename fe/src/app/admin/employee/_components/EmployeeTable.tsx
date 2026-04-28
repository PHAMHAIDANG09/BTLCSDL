"use client";

import React, { useState } from "react";
import { Space, Tag, Avatar, Tooltip } from "antd";
import { EyeOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import type { TableColumnsType } from "antd";
import Button from "@/components/shared/Button/Button";
import Table from "@/components/shared/Table/Table";

interface Employee {
  id: number;
  fullName: string;
  email: string;
  code: string;
  department: string;
  position: string;
  role: "Admin" | "Manager" | "Staff";
  joiningDate: string;
  status: "Đang làm" | "Nghỉ việc";
  avatarColor?: string;
}

interface EmployeeTableProps {
  data: Employee[];
  loading?: boolean;
  onEdit?: (record: Employee) => void;
  onDelete?: (id: number) => void;
  onView?: (record: Employee) => void;
  rowSelection?: any;
  onSelectionChange?: (selectedRowKeys: React.Key[]) => void;
}

const getRoleColor = (role: string) => {
  const colorMap: Record<string, string> = {
    Admin: "purple",
    Manager: "blue",
    Staff: "green",
  };
  return colorMap[role] || "default";
};

export default function EmployeeTable({
  data,
  loading,
  onView,
  onEdit,
  onDelete,
  rowSelection: externalRowSelection,
  onSelectionChange,
}: EmployeeTableProps) {
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys);
    onSelectionChange?.(newSelectedRowKeys);
  };

  const rowSelection = externalRowSelection || {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const columns: TableColumnsType<Employee> = [
    {
      title: "Nhân viên",
      key: "employee",
      width: 220,
      sorter: (a, b) => a.fullName.localeCompare(b.fullName),
      render: (_, record) => (
        <Space size="middle">
          <Avatar style={{ backgroundColor: record.avatarColor || "#ccc" }} size={32}>
            {record.fullName.charAt(0).toUpperCase()}
          </Avatar>
          <div>
            <div style={{ fontWeight: 600, lineHeight: 1.3 }}>{record.fullName}</div>
            <div style={{ color: "#999", fontSize: 11 }}>{record.email}</div>
          </div>
        </Space>
      ),
    },
    {
      title: "Mã NV",
      dataIndex: "code",
      key: "code",
      width: 100,
      sorter: (a, b) => a.code.localeCompare(b.code),
      render: (code: string) => (
        <Tag style={{ borderRadius: 12, fontSize: 11, fontWeight: 500 }}>{code}</Tag>
      ),
    },
    {
      title: "Phòng ban",
      dataIndex: "department",
      key: "department",
      width: 120,
      sorter: (a, b) => a.department.localeCompare(b.department),
    },
    {
      title: "Chức vụ",
      dataIndex: "position",
      key: "position",
      width: 140,
      sorter: (a, b) => a.position.localeCompare(b.position),
    },
    {
      title: "Vai trò",
      dataIndex: "role",
      key: "role",
      width: 100,
      render: (role: string) => (
        <Tag color={getRoleColor(role)}>{role}</Tag>
      ),
    },
    {
      title: "Ngày vào",
      dataIndex: "joiningDate",
      key: "joiningDate",
      width: 110,
      sorter: (a, b) =>
        new Date(a.joiningDate).getTime() - new Date(b.joiningDate).getTime(),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: 110,
      render: (status: string) => (
        <Tag color={status === "Đang làm" ? "green" : "default"}>{status}</Tag>
      ),
    },
    {
      title: "Thao tác",
      key: "action",
      width: 120,
      render: (_, record) => (
        <Space size="small">
          {onView && (
            <Tooltip title="Xem chi tiết">
              <Button
                type="text"
                size="small"
                icon={<EyeOutlined />}
                onClick={() => onView(record)}
              />
            </Tooltip>
          )}
          {onEdit && (
            <Tooltip title="Chỉnh sửa">
              <Button
                type="text"
                size="small"
                icon={<EditOutlined />}
                onClick={() => onEdit(record)}
              />
            </Tooltip>
          )}
          {onDelete && (
            <Tooltip title="Xóa">
              <Button
                type="text"
                size="small"
                icon={<DeleteOutlined />}
                onClick={() => onDelete(record.id)}
              />
            </Tooltip>
          )}
        </Space>
      ),
    },
  ];

  return (
    <Table<Employee>
      columns={columns}
      dataSource={data}
      loading={loading}
      rowKey="id"
      searchable={false}
      rowSelection={rowSelection}
      pagination={undefined}
      totalText="nhân viên"
      scroll={{ x: 1000 }}
      locale={{
        emptyText: "Không có dữ liệu",
      }}
    />
  );
}
