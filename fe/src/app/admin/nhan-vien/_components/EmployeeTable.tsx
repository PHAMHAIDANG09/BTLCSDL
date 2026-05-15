"use client";

import React, { useState } from "react";
import { Space, Tag, Avatar, Tooltip } from "antd";
import { EyeOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import type { TableColumnsType } from "antd";
import Button from "@/components/shared/Button/Button";
import Table from "@/components/shared/Table/Table";

import { 
  Employee 
} from "@/services/employee.service";

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
      sorter: (a, b) => a.HoTen.localeCompare(b.HoTen),
      render: (_, record) => (
        <Space size="middle">
          <Avatar style={{ backgroundColor: "#cc1212ff" }} size={32}>
            {record.HoTen.charAt(0).toUpperCase()}
          </Avatar>
          <div>
            <div style={{ fontWeight: 600, lineHeight: 1.3 }}>{record.HoTen}</div>
            <div style={{ color: "#999", fontSize: 11 }}>{record.Email}</div>
          </div>
        </Space>
      ),
    },
    {
      title: "Mã NV",
      dataIndex: "MaNhanVien",
      key: "MaNhanVien",
      width: 100,
      sorter: (a, b) => a.MaNhanVien.localeCompare(b.MaNhanVien),
      render: (code: string) => (
        <Tag style={{ borderRadius: 12, fontSize: 11, fontWeight: 500 }}>{code}</Tag>
      ),
    },
    {
      title: "Phòng ban",
      key: "department",
      width: 120,
      render: (_, record) => record.phongBan?.TenPhong || "N/A",
    },
    {
      title: "Chức vụ",
      key: "position",
      width: 140,
      render: (_, record) => record.chucVu?.TenChucVu || "N/A",
    },
    {
      title: "Vai trò",
      key: "role",
      width: 100,
      render: (_, record) => (
        <Tag color={getRoleColor(record.vaiTro?.TenVaiTro || "Staff")}>
          {record.vaiTro?.TenVaiTro || "Nhân viên"}
        </Tag>
      ),
    },
    {
      title: "Ngày vào",
      dataIndex: "NgayVaoLam",
      key: "NgayVaoLam",
      width: 110,
      render: (date: string) => date ? new Date(date).toLocaleDateString("vi-VN") : "N/A",
    },
    {
      title: "Trạng thái",
      dataIndex: "TrangThai",
      key: "TrangThai",
      width: 110,
      render: (status: string) => {
        const isActive = status === "Active" || status === "Đang làm";
        return (
          <Tag color={isActive ? "success" : "error"} className="font-medium">
            {isActive ? "Đang làm" : "Nghỉ việc"}
          </Tag>
        );
      },
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
                onClick={() => onDelete(record.Id)}
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
      rowKey="Id"
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
