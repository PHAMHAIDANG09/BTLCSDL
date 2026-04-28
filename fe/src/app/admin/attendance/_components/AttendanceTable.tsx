"use client";

import React from "react";

import { Tag, Space, Tooltip } from "antd";
import { EditOutlined, EyeOutlined } from "@ant-design/icons";
import type { TableColumnsType } from "antd";
import { useState } from "react";
import Button from "@/components/shared/Button/Button";
import Table from "@/components/shared/Table/Table";

interface AttendanceRecord {
  id: string;
  employeeName: string;
  date: string;
  checkIn: string;
  checkOut: string;
  workHours: number;
  lateMinutes: number;
  status: "on-time" | "late" | "absent" | "on-leave";
  source: "biometric" | "manual" | "mobile";
}

interface AttendanceTableProps {
  data: AttendanceRecord[];
  loading?: boolean;
  onView?: (record: AttendanceRecord) => void;
  onEdit?: (record: AttendanceRecord) => void;
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
  rowSelection: externalRowSelection,
  onSelectionChange,
}: AttendanceTableProps) {
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

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
      dataIndex: "employeeName",
      key: "employeeName",
      width: 150,
      sorter: (a, b) => a.employeeName.localeCompare(b.employeeName),
    },
    {
      title: "Ngày",
      dataIndex: "date",
      key: "date",
      width: 100,
      sorter: (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
      render: (date) => new Date(date).toLocaleDateString("vi-VN"),
    },
    {
      title: "Giờ vào",
      dataIndex: "checkIn",
      key: "checkIn",
      width: 80,
      render: (time) => time || "-",
    },
    {
      title: "Giờ ra",
      dataIndex: "checkOut",
      key: "checkOut",
      width: 80,
      render: (time) => time || "-",
    },
    {
      title: "Số giờ",
      dataIndex: "workHours",
      key: "workHours",
      width: 70,
      render: (hours) => `${hours}h`,
      sorter: (a, b) => a.workHours - b.workHours,
    },
    {
      title: "Muộn (phút)",
      dataIndex: "lateMinutes",
      key: "lateMinutes",
      width: 100,
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
      width: 100,
      render: (status: string) => (
        <Tag color={getStatusColor(status)}>{getStatusLabel(status)}</Tag>
      ),
    },
    {
      title: "Nguồn",
      dataIndex: "source",
      key: "source",
      width: 120,
      render: (source: string) => getSourceLabel(source),
    },
    {
      title: "Thao tác",
      key: "action",
      width: 100,
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
