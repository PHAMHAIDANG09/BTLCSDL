"use client";

import React from "react";
import { Space, Tag, Avatar } from "antd";
import { EyeOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { Table } from "../../../../components/shared/Table/Table";
import Button from "../../../../components/shared/Button/Button";

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
  onEdit: (record: Employee) => void;
  onDelete: (id: number) => void;
  onView: (record: Employee) => void;
  onSelectionChange?: (selectedRowKeys: React.Key[]) => void;
}

const EmployeeTable: React.FC<EmployeeTableProps> = ({ data, loading, onEdit, onDelete, onView, onSelectionChange }) => {
  const [selectedRowKeys, setSelectedRowKeys] = React.useState<React.Key[]>([]);

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys);
    onSelectionChange?.(newSelectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };
  const columns = [
    {
      title: "NHÂN VIÊN",
      key: "employee",
      render: (_: any, record: Employee) => (
        <Space size="middle">
          <Avatar style={{ backgroundColor: record.avatarColor || '#ccc' }} size={32}>
            {record.fullName.charAt(0).toUpperCase()}
          </Avatar>
          <div className="flex flex-col">
            <span className="font-bold text-gray-900 leading-tight">{record.fullName}</span>
            <span className="text-gray-400 text-[11px]">{record.email}</span>
          </div>
        </Space>
      ),
      width: 220,
    },
    {
      title: "MÃ NV",
      dataIndex: "code",
      key: "code",
      render: (code: string) => <Tag className="rounded-full px-2 py-0 bg-gray-100 border-0 text-gray-600 text-[11px] font-medium">{code}</Tag>,
      width: 120,
    },
    { title: "PHÒNG BAN", dataIndex: "department", key: "department" },
    { title: "CHỨC VỤ", dataIndex: "position", key: "position" },
    {
      title: "VAI TRÒ",
      dataIndex: "role",
      key: "role",
      render: (role: string) => {
        let color = "default";
        if (role === "Admin") color = "purple";
        if (role === "Manager") color = "blue";
        if (role === "Staff") color = "success";
        return <Tag color={color} className="min-w-[70px] text-center rounded-full text-[11px] font-semibold border-0">{role}</Tag>;
      },
    },
    { title: "NGÀY VÀO", dataIndex: "joiningDate", key: "joiningDate" },
    {
      title: "TRẠNG THÁI",
      dataIndex: "status",
      key: "status",
      render: (status: string) => (
        <Tag color={status === "Đang làm" ? "success" : "default"} className="border-0 bg-opacity-10 px-2 rounded text-[11px] font-medium">
          {status}
        </Tag>
      ),
    },
    {
      title: "THAO TÁC",
      key: "action",
      width: 120,
      render: (_: any, record: Employee) => (
        <Space className="mt-1">
          <Button type="text" size="small" icon={<EyeOutlined style={{ color: '#d13538ff', fontSize: '14px' }} />} onClick={() => onView(record)} />
          <Button type="text" size="small" icon={<EditOutlined style={{ color: '#d13538ff', fontSize: '14px' }} />} onClick={() => onEdit(record)} />
          <Button type="text" size="small" icon={<DeleteOutlined style={{ color: '#d13538ff', fontSize: '14px' }} />} onClick={() => onDelete(record.id)} />
        </Space>
      ),
    },
  ];

  return (
    <div className="overflow-hidden">
      <Table
        className="admin-table"
        rowSelection={rowSelection}
        columns={columns}
        dataSource={data}
        loading={loading}
        searchable={false}
        rowKey="id"
      />
    </div>
  );
};

export default EmployeeTable;
