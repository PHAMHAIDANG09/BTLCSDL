'use client';

import { useState } from 'react';
import { Card, Button, Space } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { Table } from '@/components/shared/Table/Table';

interface Employee {
  id: number;
  name: string;
  email: string;
  department: string;
  position: string;
  status: 'active' | 'inactive';
}

// Mock data
const MOCK_EMPLOYEES: Employee[] = [
  {
    id: 1,
    name: 'Nguyễn Văn A',
    email: 'a@example.com',
    department: 'IT',
    position: 'Developer',
    status: 'active',
  },
  {
    id: 2,
    name: 'Trần Thị B',
    email: 'b@example.com',
    department: 'HR',
    position: 'Manager',
    status: 'active',
  },
  {
    id: 3,
    name: 'Lê Văn C',
    email: 'c@example.com',
    department: 'Finance',
    position: 'Accountant',
    status: 'inactive',
  },
];

export default function EmployeePage() {
  const [employees, setEmployees] = useState<Employee[]>(MOCK_EMPLOYEES);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const columns = [
    {
      title: 'Tên',
      dataIndex: 'name',
      key: 'name',
      width: 150,
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      width: 200,
    },
    {
      title: 'Phòng Ban',
      dataIndex: 'department',
      key: 'department',
      width: 120,
    },
    {
      title: 'Chức Vụ',
      dataIndex: 'position',
      key: 'position',
      width: 150,
    },
    {
      title: 'Trạng Thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <span
          className={`px-3 py-1 rounded-full text-sm font-medium ${
            status === 'active'
              ? 'bg-green-100 text-green-800'
              : 'bg-gray-100 text-gray-800'
          }`}
        >
          {status === 'active' ? 'Hoạt Động' : 'Không Hoạt Động'}
        </span>
      ),
      width: 130,
    },
    {
      title: 'Hành Động',
      key: 'action',
      render: (_, record) => (
        <Space size="small">
          <Button type="link" size="small">
            Sửa
          </Button>
          <Button type="link" danger size="small">
            Xoá
          </Button>
        </Space>
      ),
      width: 120,
    },
  ];

  const handlePageChange = (newPage: number, newPageSize: number) => {
    setPage(newPage);
    setPageSize(newPageSize);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Quản Lý Nhân Viên</h1>
          <p className="text-gray-600 mt-1">Danh sách tất cả nhân viên trong công ty</p>
        </div>
        <Button type="primary" icon={<PlusOutlined />} size="large">
          Thêm Nhân Viên
        </Button>
      </div>

      {/* Table Card */}
      <Card className="border-0 shadow-sm">
        <Table
          columns={columns}
          dataSource={employees}
          loading={loading}
          searchable
          searchPlaceholder="Tìm kiếm theo tên, email, phòng ban..."
          pagination={{
            current: page,
            pageSize: pageSize,
            total: employees.length,
            onChange: handlePageChange,
          }}
          rowKey="id"
        />
      </Card>
    </div>
  );
}
