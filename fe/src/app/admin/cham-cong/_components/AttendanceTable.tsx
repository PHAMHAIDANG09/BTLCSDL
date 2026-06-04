"use client";

import React, { useState } from "react";
import { Tag, Space, Tooltip, Popconfirm, theme, Input } from "antd";
import { EditOutlined, EyeOutlined, DeleteOutlined, SearchOutlined } from "@ant-design/icons";
import type { TableColumnsType } from "antd";
import Button from "@/components/shared/Button/Button";
import Table from "@/components/shared/Table/Table";

interface AttendanceRecord {
  id: string;
  employeeId?: number;
  employeeName: string;
  employeeCode: string; // Thêm
  date: string;
  checkIn: string;
  checkOut: string;
  workHours: number;
  lateMinutes: number;
  status: "on-time" | "late" | "absent" | "on-leave";
  source: "biometric" | "manual" | "mobile";
  department: string; // Thêm
}

interface AttendanceTableProps {
  data: AttendanceRecord[];
  loading?: boolean;
  onView?: (record: AttendanceRecord) => void;
  onEdit?: (record: AttendanceRecord) => void;
  onDelete?: (id: string) => void;
  rowSelection?: any;
  onSelectionChange?: (selectedRowKeys: React.Key[]) => void;
}

const getStatusColor = (status: string) => {
  const colorMap: Record<string, string> = {
    "on-time": "green",
    late: "orange",
    absent: "red",
    "on-leave": "blue",
  };
  return colorMap[status] || "default";
};

const getStatusLabel = (status: string) => {
  const labelMap: Record<string, string> = {
    "on-time": "Đúng giờ",
    late: "Đi muộn",
    absent: "Vắng mặt",
    "on-leave": "Nghỉ phép",
  };
  return labelMap[status] || status;
};

const getSourceLabel = (source: string) => {
  const labelMap: Record<string, string> = {
    biometric: "Máy chấm công",
    manual: "Nhập tay",
    mobile: "Mobile",
  };
  return labelMap[source] || source;
};

export default function AttendanceTable({
  data,
  loading,
  onView,
  onEdit,
  onDelete,
  rowSelection: externalRowSelection,
  onSelectionChange,
}: AttendanceTableProps) {
  const { token } = theme.useToken();
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  const getColumnSearchProps = (dataIndex: keyof AttendanceRecord, placeholder: string) => ({
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
      <SearchOutlined style={{ color: filtered ? token.colorPrimary : undefined }} />
    ),
    onFilter: (value: any, record: AttendanceRecord) => {
      if (dataIndex === 'employeeName') {
        const searchVal = String(value).toLowerCase();
        return (
          record.employeeName.toLowerCase().includes(searchVal) ||
          record.employeeCode.toLowerCase().includes(searchVal)
        );
      }
      const val = record[dataIndex];
      return val ? String(val).toLowerCase().includes(String(value).toLowerCase()) : false;
    },
  });

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys);
    onSelectionChange?.(newSelectedRowKeys);
  };

  const rowSelection = externalRowSelection || {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const columns: TableColumnsType<AttendanceRecord> = [
    {
      title: "Nhân viên",
      key: "employeeName",
      width: 200,
      fixed: "left" as const,
      sorter: (a, b) => a.employeeName.localeCompare(b.employeeName),
      ...getColumnSearchProps("employeeName", "Tìm tên hoặc mã..."),
      render: (_, record) => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          <span style={{ fontWeight: 600, fontSize: '14px' }}>{record.employeeName}</span>
          <span style={{ fontSize: '12px', color: '#8c8c8c', fontStyle: 'italic' }}>
            ID: {record.employeeCode || 'N/A'}
          </span>
        </div>
      )
    },
    {
      title: "Phòng ban",
      dataIndex: "department",
      key: "department",
      width: 150,
      sorter: (a, b) => a.department.localeCompare(b.department),
      ...getColumnSearchProps("department", "Tìm phòng ban..."),
    },
    {
      title: "Ngày",
      dataIndex: "date",
      key: "date",
      width: 110,
      sorter: (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
      render: (date) => new Date(date).toLocaleDateString("vi-VN"),
    },
    {
      title: "Giờ vào",
      dataIndex: "checkIn",
      key: "checkIn",
      width: 100,
      render: (time) => time || "-",
    },
    {
      title: "Giờ ra",
      dataIndex: "checkOut",
      key: "checkOut",
      width: 100,
      render: (time) => time || "-",
    },
    {
      title: "Số giờ",
      dataIndex: "workHours",
      key: "workHours",
      width: 90,
      render: (hours) => `${hours}h`,
      sorter: (a, b) => a.workHours - b.workHours,
    },
    {
      title: "Muộn (phút)",
      dataIndex: "lateMinutes",
      key: "lateMinutes",
      width: 110,
      render: (minutes) => {
        if (minutes === 0)
          return <span style={{ color: "#52c41a" }}>0 phút</span>;
        return <span style={{ color: "#faad14" }}>{minutes} phút</span>;
      },
      sorter: (a, b) => a.lateMinutes - b.lateMinutes,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: 120,
      filters: [
        { text: "Đúng giờ", value: "on-time" },
        { text: "Đi muộn", value: "late" },
        { text: "Vắng mặt", value: "absent" },
        { text: "Nghỉ phép", value: "on-leave" },
      ],
      onFilter: (value, record) => record.status === value,
      render: (status: string) => (
        <Tag color={getStatusColor(status)}>{getStatusLabel(status)}</Tag>
      ),
    },
    {
      title: "Nguồn",
      dataIndex: "source",
      key: "source",
      width: 130,
      render: (source: string) => getSourceLabel(source),
    },
    {
      title: "Thao tác",
      key: "action",
      width: 130,
      fixed: "right" as const,
      align: "center" as const,
      render: (_, record) => (
        <Space size={0}>
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
            <Popconfirm
              title="Xóa bản ghi"
              description="Bạn có chắc chắn muốn xóa bản ghi chấm công này?"
              onConfirm={() => onDelete(record.id)}
              okText="Xóa"
              cancelText="Hủy"
              okButtonProps={{ danger: true }}
            >
              <Tooltip title="Xóa">
                <Button
                  type="text"
                  size="small"
                  icon={<DeleteOutlined />}
                  danger
                />
              </Tooltip>
            </Popconfirm>
          )}
        </Space>
      ),
    },
  ];



  return (
    <Table<AttendanceRecord>
      columns={columns}
      dataSource={data}
      loading={loading}
      rowKey="id"
      searchable={false}
      rowSelection={rowSelection}
      pagination={undefined}
      totalText="bản ghi"
      scroll={{ x: 1200 }}
      locale={{
        emptyText: "Không có dữ liệu",
      }}
    />
  );
}
