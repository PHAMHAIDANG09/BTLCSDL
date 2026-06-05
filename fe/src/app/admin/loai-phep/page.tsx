"use client";

import React, { useState, useEffect } from "react";
import { Row, Col, Space, Typography, Form, theme } from "antd";
import { 
  SlidersOutlined, 
  PlusOutlined, 
  HomeOutlined,
  DollarOutlined,
  CalendarOutlined
} from "@ant-design/icons";
import Link from "next/link";

// Shared Components
import Button from "@/components/shared/Button/Button";
import Modal from "@/components/shared/Modal/Modal";
import Toast from "@/components/shared/Toast/Toast";
import ConfirmDialog from "@/components/shared/ConfirmDialog/ConfirmDialog";
import StatsCard from "@/components/shared/StatsCard/StatsCard";

// Sub Components
import LeaveTypeTable from "./_components/LeaveTypeTable";
import LeaveTypeForm from "./_components/LeaveTypeForm";

// API Services
import { LeaveService } from "@/services/leave.service";

const { Title, Text } = Typography;

export interface LeaveType {
  Id: number;
  TenLoaiPhep: string;
  CoHuongLuong: boolean;
  SoNgayToiDaNam: number;
  MoTa?: string;
}

export default function LeaveTypePage() {
  const { token } = theme.useToken();
  const [leaveTypes, setLeaveTypes] = useState<LeaveType[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [form] = Form.useForm();

  // Load data
  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await LeaveService.getLeaveTypes();
      setLeaveTypes(data);
    } catch (error) {
      console.error(error);
      Toast.error("Không thể tải cấu hình loại nghỉ phép");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // CRUD Actions
  const handleAdd = () => {
    setEditingId(null);
    form.resetFields();
    form.setFieldsValue({
      CoHuongLuong: true,
      SoNgayToiDaNam: 12
    });
    setIsModalOpen(true);
  };

  const handleEdit = (record: LeaveType) => {
    setEditingId(record.Id);
    form.setFieldsValue({
      TenLoaiPhep: record.TenLoaiPhep,
      CoHuongLuong: record.CoHuongLuong,
      SoNgayToiDaNam: record.SoNgayToiDaNam,
      MoTa: record.MoTa
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id: number) => {
    ConfirmDialog.show({
      title: "Xác nhận xóa?",
      content: "Bạn có chắc chắn muốn xóa loại nghỉ phép này? Việc xóa loại phép có thể ảnh hưởng đến lịch sử nghỉ phép hoặc đơn đang chờ duyệt.",
      type: "danger",
      onConfirm: async () => {
        try {
          await LeaveService.deleteLeaveType(id);
          Toast.success("Đã xóa loại nghỉ phép thành công");
          fetchData();
        } catch (error: any) {
          Toast.apiError(error);
        }
      }
    });
  };

  const handleFormFinish = async () => {
    try {
      const values = await form.validateFields();
      setSubmitting(true);
      
      const payload = {
        TenLoaiPhep: values.TenLoaiPhep,
        CoHuongLuong: !!values.CoHuongLuong,
        SoNgayToiDaNam: Number(values.SoNgayToiDaNam),
        MoTa: values.MoTa || undefined
      };

      if (editingId === null) {
        await LeaveService.createLeaveType(payload);
        Toast.success("Tạo loại nghỉ phép mới thành công");
      } else {
        await LeaveService.updateLeaveType(editingId, payload);
        Toast.success("Cập nhật loại nghỉ phép thành công");
      }
      
      setIsModalOpen(false);
      fetchData();
    } catch (error: any) {
      if (error?.errorFields) return; // validation error
      Toast.apiError(error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white min-h-screen pt-4 px-6">
      {/* Title */}
      <div className="mb-6 flex justify-between items-center">
        <div>
          <Title level={3} className="m-0 font-bold flex items-center gap-2">
            <SlidersOutlined style={{ color: "var(--primary-color)" }} />
            Cấu hình Loại phép
          </Title>
          <Text type="secondary">Quản lý định nghĩa các loại nghỉ phép và cấu hình chế độ hưởng lương tương ứng</Text>
        </div>
      </div>

      {/* Stats Section */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={8}>
          <StatsCard 
            label="TỔNG SỐ LOẠI PHÉP"
            value={leaveTypes.length}
            icon={<SlidersOutlined />}
            color={token.colorError}
            bg={token.colorErrorBg}
            size="small"
          />
        </Col>
        <Col xs={24} sm={8}>
          <StatsCard 
            label="LOẠI PHÉP HƯỞNG LƯƠNG"
            value={leaveTypes.filter(l => l.CoHuongLuong).length}
            icon={<DollarOutlined />}
            color={token.colorInfo}
            bg={token.colorInfoBg}
            size="small"
          />
        </Col>
        <Col xs={24} sm={8}>
          <StatsCard 
            label="LOẠI PHÉP KHÔNG HƯỞNG LƯƠNG"
            value={leaveTypes.filter(l => !l.CoHuongLuong).length}
            icon={<CalendarOutlined />}
            color={token.colorWarning}
            bg={token.colorWarningBg}
            size="small"
          />
        </Col>
      </Row>

      {/* Action Section */}
      <div style={{ marginTop: 24, marginBottom: 24 }} className="flex justify-end">
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleAdd}
          className="bg-red-700 hover:bg-red-800 border-none rounded-lg shadow-sm"
        >
          Thêm loại phép
        </Button>
      </div>

      {/* Table Section - NOT WRAPPED in Card */}
      <LeaveTypeTable
        leaveTypes={leaveTypes}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {/* Create/Edit Modal */}
      <Modal
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={handleFormFinish}
        loading={submitting}
        title={
          <Space size={8}>
            <SlidersOutlined style={{ color: 'var(--primary-color)', fontSize: '20px' }} />
            <span className="text-xl font-bold">
              {editingId === null ? "Thêm loại nghỉ phép mới" : "Cập nhật cấu hình loại nghỉ phép"}
            </span>
          </Space>
        }
        width={600}
      >
        <LeaveTypeForm
          form={form}
          editingId={editingId}
        />
      </Modal>
    </div>
  );
}
