"use client";

import React, { useState, useEffect } from "react";
import { Typography, Tag, Button, Tabs, message, Spin, Badge, Space } from "antd";
import { PlusOutlined, CalendarOutlined, ClockCircleOutlined } from "@ant-design/icons";
import Table from "@/components/shared/Table/Table";
import type { TableColumnsType } from "antd";
import Link from "next/link";
import { LeaveService } from "@/services/leave.service";
import { AttendanceService } from "@/services/attendance.service";
import dayjs from "dayjs";
import CreateRequestModal from "./_components/CreateRequestModal";

const { Title, Text } = Typography;

const getStatusBadge = (status: string) => {
  switch (status) {
    case "Pending":
    case "pending":
      return <Badge status="warning" text={<Text type="warning" strong>Chờ duyệt</Text>} />;
    case "Approved":
    case "approved":
      return <Badge status="success" text={<Text type="success" strong>Đã duyệt</Text>} />;
    case "Rejected":
    case "rejected":
      return <Badge status="error" text={<Text type="danger" strong>Từ chối</Text>} />;
    default:
      return <Badge status="default" text={status} />;
  }
};

export default function StaffLeavePage() {
  const [leaveRequests, setLeaveRequests] = useState<any[]>([]);
  const [otRequests, setOtRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("1");
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [leaves, ots] = await Promise.all([
        LeaveService.getLeaveHistory(),
        AttendanceService.getOTHistory()
      ]);
      setLeaveRequests(leaves || []);
      setOtRequests(ots || []);
    } catch (error) {
      console.error(error);
      message.error("Lỗi khi tải dữ liệu đơn từ");
    } finally {
      setLoading(false);
    }
  };

  const leaveColumns: TableColumnsType<any> = [
    { 
      title: "Loại phép", 
      dataIndex: "loaiNghiPhep", 
      key: "type", 
      width: 160,
      render: (item) => <Tag color="blue" bordered={false} className="px-2 py-1">{item?.TenLoaiPhep || "Khác"}</Tag>
    },
    { 
      title: "Thời gian nghỉ", 
      key: "time", 
      render: (_, r) => (
        <Space direction="vertical" size={0}>
          <Text>
            <CalendarOutlined style={{ color: '#8c8c8c', marginRight: 8 }} /> 
            {dayjs(r.NgayBatDau).format("DD/MM/YYYY")} - {dayjs(r.NgayKetThuc).format("DD/MM/YYYY")}
          </Text>
          <Text style={{ color: '#1890ff', fontSize: 12, fontWeight: 500 }}>
            Tổng cộng: {r.TongSoNgay} ngày
          </Text>
        </Space>
      )
    },
    { 
      title: "Lý do xin nghỉ", 
      dataIndex: "LyDo", 
      key: "reason",
      render: (text) => <Text className="italic text-gray-600">{text}</Text>
    },
    {
      title: "Trạng thái", 
      key: "status", 
      width: 160,
      render: (_, r) => (
        <div>
          {getStatusBadge(r.TrangThai)}
          {r.TrangThai === "Rejected" && r.LyDoTuChoi && (
            <div className="text-xs text-red-500 mt-1 truncate max-w-[150px]" title={r.LyDoTuChoi}>
              Lý do: {r.LyDoTuChoi}
            </div>
          )}
        </div>
      )
    },
  ];

  const otColumns: TableColumnsType<any> = [
    { 
      title: "Thời gian làm thêm", 
      key: "time", 
      width: 250,
      render: (_, r) => (
        <Space direction="vertical" size={0}>
          <Text strong>
            <CalendarOutlined style={{ color: '#8c8c8c', marginRight: 8 }} />
            {dayjs(r.NgayLamThem).format("DD/MM/YYYY")}
          </Text>
          <Text type="secondary" style={{ fontSize: 12 }}>
            <ClockCircleOutlined style={{ marginRight: 4 }} />
            {r.GioBatDau} - {r.GioKetThuc} <Text style={{ color: '#fa8c16', fontWeight: 500, marginLeft: 4 }}>({r.TongSoGio}h)</Text>
          </Text>
        </Space>
      )
    },
    { 
      title: "Phân loại", 
      dataIndex: "LoaiOT", 
      key: "LoaiOT", 
      width: 140,
      render: (l: string) => (
        <Tag color={l === 'NgayThuong' ? 'default' : l === 'CuoiTuan' ? 'orange' : 'red'} bordered={false}>
          {l === 'NgayThuong' ? 'Ngày thường' : l === 'CuoiTuan' ? 'Cuối tuần' : 'Ngày lễ'}
        </Tag>
      )
    },
    { 
      title: "Công việc", 
      dataIndex: "LyDo", 
      key: "LyDo",
      render: (text) => <Text className="italic text-gray-600">{text}</Text>
    },
    {
      title: "Trạng thái", 
      key: "status", 
      width: 160,
      render: (_, r) => (
        <div>
          {getStatusBadge(r.TrangThai)}
        </div>
      )
    },
  ];

  return (
    <div>
      <div className="flex justify-between items-start mb-6">
        <div>
          <Title level={2} style={{ margin: 0 }}>Đơn Từ Của Tôi</Title>
          <Text type="secondary">Quản lý và theo dõi trạng thái các đơn bạn đã tạo</Text>
        </div>
        <Button 
          type="primary" 
          size="large" 
          icon={<PlusOutlined />} 
          className="shadow-sm"
          onClick={() => setIsModalOpen(true)}
        >
          Tạo đơn mới
        </Button>
      </div>

      <div className="bg-white p-5 rounded-xl shadow-sm">
        <Spin spinning={loading}>
          <Tabs 
            activeKey={activeTab}
            onChange={setActiveTab}
            size="large"
            items={[
              {
                key: '1',
                label: 'Đơn Nghỉ Phép',
                children: (
                  <div className="mt-2">
                    <Table
                      columns={leaveColumns}
                      dataSource={leaveRequests}
                      rowKey="Id"
                      searchable={false}
                      totalText="đơn"
                      locale={{ emptyText: "Chưa có đơn xin phép nào" }}
                    />
                  </div>
                )
              },
              {
                key: '2',
                label: 'Đơn Làm Thêm Giờ',
                children: (
                  <div className="mt-2">
                    <Table
                      columns={otColumns}
                      dataSource={otRequests}
                      rowKey="Id"
                      searchable={false}
                      totalText="đơn"
                      locale={{ emptyText: "Chưa có đơn làm thêm nào" }}
                    />
                  </div>
                )
              }
            ]} 
          />
        </Spin>
      </div>

      <CreateRequestModal 
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onSuccess={() => {
          setIsModalOpen(false);
          fetchData();
        }}
        defaultTab={activeTab}
      />
    </div>
  );
}
