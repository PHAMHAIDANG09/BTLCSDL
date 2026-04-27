'use client';

import { useState } from 'react';
import { Card, Button, Space, Badge } from 'antd';
import { Table } from '@/components/shared/Table/Table';

interface Attendance {
  id: number;
  employeeName: string;
  checkIn: string;
  checkOut: string;
  status: 'on-time' | 'late' | 'absent';
  date: string;
}

const MOCK_ATTENDANCE: Attendance[] = [
  {
    id: 1,
    employeeName: 'Nguyễn Văn A',
    checkIn: '08:00',
    checkOut: '17:30',
    status: 'on-time',
    date: '2024-04-27',
  },
  {
    id: 2,
    employeeName: 'Trần Thị B',
    checkIn: '08:15',
    checkOut: '17:45',
    status: 'late',
    date: '2024-04-27',
  },
  {
    id: 3,
    employeeName: 'Lê Văn C',
    checkIn: '-',
    checkOut: '-',
    status: 'absent',
    date: '2024-04-27',
  },
];

export default function AttendancePage() {
  const [attendance, setAttendance] = useState<Attendance[]>(MOCK_ATTENDANCE);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const columns = [
    {
      title: 'Tên Nhân Viên',
      dataIndex: 'employeeName',
      key: 'employeeName',
      width: 150,
    },
    {
      title: 'Ngày',
      dataIndex: 'date',
      key: 'date',
      width: 130,
    },
    {
      title: 'Giờ Vào',
      dataIndex: 'checkIn',
      key: 'checkIn',
      width: 100,
    },
    {
      title: 'Giờ Ra',
      dataIndex: 'checkOut',
      key: 'checkOut',
      width: 100,
    },
    {
      title: 'Trạng Thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        let color = 'green';
        let label = 'Đúng Giờ';

        if (status === 'late') {
          color = 'orange';
          label = 'Muộn';
        } else if (status === 'absent') {
          color = 'red';
          label = 'Vắng';
        }

        return <Badge status={color as any} text={label} />;
      },
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
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Chấm Công</h1>
        <p className="text-gray-600 mt-1">Theo dõi giờ làm việc của nhân viên</p>
      </div>

      {/* Table Card */}
      <Card className="border-0 shadow-sm">
        <Table
          columns={columns}
          dataSource={attendance}
          loading={loading}
          searchable
          searchPlaceholder="Tìm kiếm theo tên nhân viên..."
          pagination={{
            current: page,
            pageSize: pageSize,
            total: attendance.length,
            onChange: handlePageChange,
          }}
          rowKey="id"
        />
      </Card>
    </div>
  );
}
