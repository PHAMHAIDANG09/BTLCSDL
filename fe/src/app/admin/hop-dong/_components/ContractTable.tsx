"use client";

import React from "react";
import { Tag, Space, Typography, Avatar, Tooltip, Popconfirm } from "antd";
import { 
  EditOutlined, 
  DeleteOutlined, 
  EyeOutlined,
  UserOutlined,
  HistoryOutlined 
} from "@ant-design/icons";
import dayjs from "dayjs";
import Table from "@/components/shared/Table/Table";
import Button from "@/components/shared/Button/Button";

const { Text } = Typography;

interface ContractTableProps {
  loading: boolean;
  contracts: any[];
  onEdit: (contract: any) => void;
  onDelete: (id: number) => void;
  onView: (contract: any) => void;
}

const ContractTable: React.FC<ContractTableProps> = ({
  loading,
  contracts,
  onEdit,
  onDelete,
  onView,
}) => {
  const columns = [
    {
      title: "Nhân viên",
      key: "nhanVien",
      fixed: "left" as const,
      width: 200,
      render: (_: any, record: any) => (
        <Space size="middle">
          <Avatar 
            icon={<UserOutlined />} 
            src={record.nhanVien?.Avatar} 
            className="bg-red-50 text-red-500 border border-red-100"
          />
          <div className="flex flex-col">
            <Text strong className="text-gray-900 leading-none mb-1">{record.nhanVien?.HoTen}</Text>
            <Text type="secondary" style={{ fontSize: 11 }}>{record.nhanVien?.MaNhanVien || "NV-000"}</Text>
          </div>
        </Space>
      ),
    },
    {
      title: "Số hợp đồng",
      dataIndex: "MaHopDong",
      key: "MaHopDong",
      width: 150,
      render: (val: string) => <Text strong className="text-blue-700">{val}</Text>,
    },
    {
      title: "Loại hợp đồng",
      dataIndex: "LoaiHopDong",
      key: "LoaiHopDong",
    },
    {
      title: "Ngày ký",
      dataIndex: "NgayKy",
      key: "NgayKy",
      align: 'center' as const,
      render: (date: string) => dayjs(date).format("DD/MM/YYYY"),
    },
    {
      title: "Ngày bắt đầu",
      dataIndex: "NgayBatDau",
      key: "NgayBatDau",
      align: 'center' as const,
      render: (date: string) => dayjs(date).format("DD/MM/YYYY"),
    },
    {
      title: "Ngày kết thúc",
      dataIndex: "NgayKetThuc",
      key: "NgayKetThuc",
      align: 'center' as const,
      render: (date: string) => date ? dayjs(date).format("DD/MM/YYYY") : <Text type="secondary">Vô thời hạn</Text>,
    },
    {
      title: "Lương cơ bản",
      dataIndex: "LuongCoBan",
      key: "LuongCoBan",
      align: 'right' as const,
      render: (val: any) => (
        <Text strong className="text-gray-800">
          {Number(val || 0).toLocaleString('vi-VN')}đ
        </Text>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "TrangThai",
      key: "TrangThai",
      align: 'center' as const,
      render: (status: string, record: any) => {
        const today = dayjs();
        const endDate = record.NgayKetThuc ? dayjs(record.NgayKetThuc) : null;
        
        let color = "success";
        let label = "Đang hiệu lực";

        if (endDate) {
          if (endDate.isBefore(today, 'day')) {
            color = "error";
            label = "Đã hết hạn";
          } else if (endDate.diff(today, 'day') <= 30) {
            color = "warning";
            label = "Sắp hết hạn";
          }
        }

        // Ưu tiên trạng thái Terminated nếu có
        if (status === "Terminated") {
          color = "default";
          label = "Đã chấm dứt";
        }

        return (
          <Tag color={color} className="rounded-full px-3 border-none font-medium">
            {label}
          </Tag>
        );
      },
    },
    {
      title: "Nguồn",
      key: "source",
      render: () => <Text type="secondary" style={{ fontSize: 12 }}>Hợp đồng giấy</Text>
    },
    {
      title: "Thao tác",
      key: "actions",
      fixed: "right" as const,
      align: 'center' as const,
      width: 100,
      render: (_: any, record: any) => (
        <Space size={0}>
          <Tooltip title="Xem">
            <Button 
              type="text" 
              icon={<EyeOutlined />} 
              onClick={() => onView(record)} 
            />
          </Tooltip>
          <Tooltip title="Sửa">
            <Button 
              type="text" 
              icon={<EditOutlined />} 
              onClick={() => onEdit(record)} 
            />
          </Tooltip>
          <Popconfirm
            title="Xóa hợp đồng"
            description="Bạn có chắc chắn muốn xóa hợp đồng này?"
            onConfirm={() => onDelete(record.Id)}
            okText="Xóa"
            cancelText="Hủy"
            okButtonProps={{ danger: true }}
          >
            <Tooltip title="Xóa">
              <Button 
                type="text" 
                icon={<DeleteOutlined />} 
                className="hover:text-red-600"
              />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={contracts}
      rowKey="Id"
      loading={loading}
      searchable={false}
      className="contract-table-attendance"
      totalText="hợp đồng"
    />
  );
};

export default ContractTable;
