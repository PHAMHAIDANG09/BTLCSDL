"use client";

import React, { useState, useEffect } from "react";
import { Typography, Tabs, Button, Tag, Space, Modal, Input, message, Spin, Popconfirm, Avatar, Segmented, Badge } from "antd";
import { CheckOutlined, CloseOutlined, UserOutlined, ClockCircleOutlined, CalendarOutlined } from "@ant-design/icons";
import Table from "@/components/shared/Table/Table";
import type { TableColumnsType } from "antd";
import { LeaveService } from "@/services/leave.service";
import { AttendanceService } from "@/services/attendance.service";
import dayjs from "dayjs";

const { Title, Text } = Typography;
const { TextArea } = Input;

export default function ApprovalPage() {
  const [leaveRequests, setLeaveRequests] = useState<any[]>([]);
  const [otRequests, setOtRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState<"pending" | "history">("pending");

  // Modal từ chối
  const [rejectModalVisible, setRejectModalVisible] = useState(false);
  const [rejectType, setRejectType] = useState<"leave" | "ot" | null>(null);
  const [rejectId, setRejectId] = useState<number | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchAllRequests();
  }, []);

  const fetchAllRequests = async () => {
    setLoading(true);
    try {
      const [leaves, ots] = await Promise.all([
        LeaveService.getAllLeaveRequests(),
        AttendanceService.getAllOTRequests()
      ]);
      setLeaveRequests(leaves || []);
      setOtRequests(ots || []);
    } catch (error) {
      console.error(error);
      message.error("Lỗi khi tải danh sách đơn từ");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (type: "leave" | "ot", id: number) => {
    setLoading(true);
    try {
      if (type === "leave") {
        await LeaveService.approveLeave(id, "Approved");
      } else {
        await AttendanceService.approveOT(id, "Approved");
      }
      message.success("Đã phê duyệt đơn thành công!");
      fetchAllRequests();
    } catch (error) {
      console.error(error);
      message.error("Lỗi khi duyệt đơn");
    } finally {
      setLoading(false);
    }
  };

  const openRejectModal = (type: "leave" | "ot", id: number) => {
    setRejectType(type);
    setRejectId(id);
    setRejectReason("");
    setRejectModalVisible(true);
  };

  const handleRejectConfirm = async () => {
    if (!rejectReason.trim()) {
      message.warning("Vui lòng nhập lý do từ chối");
      return;
    }
    
    setSubmitting(true);
    try {
      if (rejectType === "leave") {
        await LeaveService.approveLeave(rejectId!, "Rejected", rejectReason);
      } else {
        await AttendanceService.approveOT(rejectId!, "Rejected");
      }
      message.success("Đã từ chối đơn thành công!");
      setRejectModalVisible(false);
      fetchAllRequests();
    } catch (error) {
      console.error(error);
      message.error("Lỗi khi từ chối đơn");
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Pending":
        return <Badge status="warning" text={<Text type="warning" strong>Chờ duyệt</Text>} />;
      case "Approved":
        return <Badge status="success" text={<Text type="success" strong>Đã duyệt</Text>} />;
      case "Rejected":
        return <Badge status="error" text={<Text type="danger" strong>Từ chối</Text>} />;
      default:
        return <Badge status="default" text={status} />;
    }
  };

  const employeeRender = (nv: any) => (
    <Space>
      <Avatar icon={<UserOutlined />} className="bg-blue-100 text-blue-600" />
      <div>
        <div className="font-semibold text-gray-800">{nv?.HoTen}</div>
        <div className="text-xs text-gray-400">{nv?.MaNhanVien}</div>
      </div>
    </Space>
  );

  const leaveColumns: TableColumnsType<any> = [
    { 
      title: "Nhân viên", 
      dataIndex: "nhanVien", 
      key: "employee", 
      render: employeeRender
    },
    { 
      title: "Loại phép", 
      dataIndex: "loaiNghiPhep", 
      key: "type", 
      render: (item) => <Tag color="blue" bordered={false} className="px-2 py-1">{item?.TenLoaiPhep || "Khác"}</Tag>
    },
    { 
      title: "Thời gian nghỉ", 
      key: "time", 
      render: (_, r) => (
        <Space direction="vertical" size={0}>
          <Text>
            <CalendarOutlined style={{ color: '#8c8c8c', marginRight: 4 }} /> 
            {dayjs(r.NgayBatDau).format("DD/MM/YYYY")} - {dayjs(r.NgayKetThuc).format("DD/MM/YYYY")}
          </Text>
          <Text style={{ color: '#1890ff', fontSize: 12, fontWeight: 500 }}>
            Tổng: {r.TongSoNgay} ngày
          </Text>
        </Space>
      )
    },
    { 
      title: "Lý do", 
      dataIndex: "LyDo", 
      key: "reason",
      render: (text) => <Text className="italic text-gray-600">{text}</Text>
    },
  ];

  const otColumns: TableColumnsType<any> = [
    { 
      title: "Nhân viên", 
      dataIndex: "nhanVien", 
      key: "employee", 
      render: employeeRender
    },
    { 
      title: "Thời gian làm thêm", 
      key: "time", 
      render: (_, r) => (
        <Space direction="vertical" size={0}>
          <Text strong>
            <CalendarOutlined style={{ color: '#8c8c8c', marginRight: 4 }} />
            {dayjs(r.NgayLamThem).format("DD/MM/YYYY")}
          </Text>
          <Text type="secondary" style={{ fontSize: 12 }}>
            <ClockCircleOutlined style={{ marginRight: 4 }} />
            {r.GioBatDau} - {r.GioKetThuc} <Text style={{ color: '#fa8c16', fontWeight: 500, marginLeft: 4 }}>({r.TongSoGio} giờ)</Text>
          </Text>
        </Space>
      )
    },
    { 
      title: "Phân loại", 
      dataIndex: "LoaiOT", 
      key: "LoaiOT", 
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
  ];

  // Thêm cột thao tác/trạng thái tùy theo viewMode
  const getDynamicLeaveColumns = () => {
    const cols = [...leaveColumns];
    if (viewMode === "pending") {
      cols.push({
        title: "Thao tác",
        key: "action",
        width: 180,
        render: (_, record) => (
          <Space size="small">
            <Popconfirm
              title="Bạn có chắc chắn muốn duyệt đơn này?"
              onConfirm={() => handleApprove("leave", record.Id)}
              okText="Duyệt"
              cancelText="Hủy"
            >
              <Button type="primary" size="small" icon={<CheckOutlined />} className="bg-green-600 hover:bg-green-500 border-none shadow-sm">Duyệt</Button>
            </Popconfirm>
            <Button danger size="small" icon={<CloseOutlined />} onClick={() => openRejectModal("leave", record.Id)} className="shadow-sm">Từ chối</Button>
          </Space>
        ),
      });
    } else {
      cols.push({
        title: "Trạng thái",
        key: "status",
        width: 150,
        render: (_, record) => (
          <div>
            {getStatusBadge(record.TrangThai)}
            {record.TrangThai === "Rejected" && record.LyDoTuChoi && (
              <div className="text-xs text-red-500 mt-1 truncate max-w-[120px]" title={record.LyDoTuChoi}>
                Lý do: {record.LyDoTuChoi}
              </div>
            )}
            <div className="text-xs text-gray-400 mt-1">
              Duyệt: {record.NgayDuyet ? dayjs(record.NgayDuyet).format("DD/MM HH:mm") : "-"}
            </div>
          </div>
        )
      });
    }
    return cols;
  };

  const getDynamicOTColumns = () => {
    const cols = [...otColumns];
    if (viewMode === "pending") {
      cols.push({
        title: "Thao tác",
        key: "action",
        width: 180,
        render: (_, record) => (
          <Space size="small">
            <Popconfirm
              title="Bạn có chắc chắn muốn duyệt đơn này?"
              onConfirm={() => handleApprove("ot", record.Id)}
              okText="Duyệt"
              cancelText="Hủy"
            >
              <Button type="primary" size="small" icon={<CheckOutlined />} className="bg-green-600 hover:bg-green-500 border-none shadow-sm">Duyệt</Button>
            </Popconfirm>
            <Button danger size="small" icon={<CloseOutlined />} onClick={() => openRejectModal("ot", record.Id)} className="shadow-sm">Từ chối</Button>
          </Space>
        ),
      });
    } else {
      cols.push({
        title: "Trạng thái",
        key: "status",
        width: 150,
        render: (_, record) => (
          <div>
            {getStatusBadge(record.TrangThai)}
          </div>
        )
      });
    }
    return cols;
  };

  const pendingLeaves = leaveRequests.filter(r => r.TrangThai === "Pending");
  const historyLeaves = leaveRequests.filter(r => r.TrangThai !== "Pending");
  
  const pendingOTs = otRequests.filter(r => r.TrangThai === "Pending");
  const historyOTs = otRequests.filter(r => r.TrangThai !== "Pending");

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <Title level={2} style={{ margin: 0 }}>Quản Lý Đơn Từ</Title>
          <Text type="secondary">Xem xét và phê duyệt các yêu cầu xin nghỉ phép, làm thêm giờ của nhân viên</Text>
        </div>
        <Segmented 
          options={[
            { label: 'Chờ xử lý', value: 'pending' },
            { label: 'Lịch sử duyệt', value: 'history' },
          ]} 
          value={viewMode}
          onChange={(val) => setViewMode(val as any)}
          size="large"
          className="shadow-sm"
        />
      </div>

      <div className="bg-white p-5 rounded-xl shadow-sm">
        <Spin spinning={loading}>
          <Tabs 
            defaultActiveKey="1" 
            size="large"
            items={[
              {
                key: '1',
                label: (
                  <span className="px-2">
                    Đơn Nghỉ Phép 
                    {viewMode === "pending" && pendingLeaves.length > 0 && (
                      <Badge count={pendingLeaves.length} className="ml-2" color="#f5222d" />
                    )}
                  </span>
                ),
                children: (
                  <div className="mt-2">
                    <Table
                      columns={getDynamicLeaveColumns()}
                      dataSource={viewMode === "pending" ? pendingLeaves : historyLeaves}
                      rowKey="Id"
                      searchable={true}
                      totalText="đơn"
                      locale={{ emptyText: viewMode === "pending" ? "Không có đơn nghỉ phép nào đang chờ duyệt" : "Chưa có lịch sử duyệt đơn" }}
                    />
                  </div>
                )
              },
              {
                key: '2',
                label: (
                  <span className="px-2">
                    Đơn Làm Thêm Giờ 
                    {viewMode === "pending" && pendingOTs.length > 0 && (
                      <Badge count={pendingOTs.length} className="ml-2" color="#faad14" />
                    )}
                  </span>
                ),
                children: (
                  <div className="mt-2">
                    <Table
                      columns={getDynamicOTColumns()}
                      dataSource={viewMode === "pending" ? pendingOTs : historyOTs}
                      rowKey="Id"
                      searchable={true}
                      totalText="đơn"
                      locale={{ emptyText: viewMode === "pending" ? "Không có đơn làm thêm nào đang chờ duyệt" : "Chưa có lịch sử duyệt đơn" }}
                    />
                  </div>
                )
              }
            ]} 
          />
        </Spin>
      </div>

      <Modal
        title={
          <div className="flex items-center text-red-500">
            <CloseOutlined className="mr-2" /> Xác nhận từ chối đơn
          </div>
        }
        open={rejectModalVisible}
        onOk={handleRejectConfirm}
        onCancel={() => setRejectModalVisible(false)}
        confirmLoading={submitting}
        okText="Xác nhận từ chối"
        okButtonProps={{ danger: true, className: "bg-red-500" }}
        cancelText="Hủy"
        centered
      >
        <div className="my-4">
          <Text className="mb-2 block">Vui lòng nhập lý do từ chối để nhân viên biết:</Text>
          <TextArea 
            rows={4} 
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            placeholder="Nhập lý do từ chối (VD: Do dự án đang gấp...)"
            className="rounded-md"
          />
        </div>
      </Modal>
    </div>
  );
}
