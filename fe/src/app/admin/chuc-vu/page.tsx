"use client";

import React, { useState, useEffect } from "react";
import { Row, Col, Space, Typography, Form, theme } from "antd";
import { 
  SolutionOutlined, 
  PlusOutlined, 
  HomeOutlined,
  SlidersOutlined,
  SafetyOutlined
} from "@ant-design/icons";
import Link from "next/link";

// Shared Components
import Button from "@/components/shared/Button/Button";
import Modal from "@/components/shared/Modal/Modal";
import Toast from "@/components/shared/Toast/Toast";
import ConfirmDialog from "@/components/shared/ConfirmDialog/ConfirmDialog";
import StatsCard from "@/components/shared/StatsCard/StatsCard";

// Sub Components
import PositionTable from "./_components/PositionTable";
import PositionForm from "./_components/PositionForm";

// API Services
import { 
  getPositionsApi, 
  createPositionApi, 
  updatePositionApi, 
  deletePositionApi,
  Position
} from "@/services/organization.service";

const { Title, Text } = Typography;

export default function PositionPage() {
  const { token } = theme.useToken();
  const [positions, setPositions] = useState<Position[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [form] = Form.useForm();

  // Load data
  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await getPositionsApi();
      setPositions(data);
    } catch (error) {
      console.error(error);
      Toast.error("Không thể tải danh sách chức vụ");
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
    setIsModalOpen(true);
  };

  const handleEdit = (record: Position) => {
    setEditingId(record.Id);
    form.setFieldsValue({
      TenChucVu: record.TenChucVu,
      CapDo: record.CapDo,
      MoTa: record.MoTa
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id: number) => {
    ConfirmDialog.show({
      title: "Xác nhận xóa?",
      content: "Bạn có chắc chắn muốn xóa chức vụ này? Hành động này có thể ảnh hưởng đến các nhân viên đang nắm giữ chức vụ này.",
      type: "danger",
      onConfirm: async () => {
        try {
          await deletePositionApi(id);
          Toast.success("Đã xóa chức vụ thành công");
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
        TenChucVu: values.TenChucVu,
        CapDo: Number(values.CapDo),
        MoTa: values.MoTa || undefined
      };

      if (editingId === null) {
        await createPositionApi(payload);
        Toast.success("Tạo chức vụ mới thành công");
      } else {
        await updatePositionApi(editingId, payload);
        Toast.success("Cập nhật chức vụ thành công");
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
            <SolutionOutlined style={{ color: token.colorPrimary }} />
            Quản lý Chức vụ
          </Title>
          <Text type="secondary">Quản lý các vị trí chức vụ, cấp bậc và vai trò chuyên môn trong doanh nghiệp</Text>
        </div>
      </div>

      {/* Stats Section */}
      <Row gutter={[16, 16]} style={{ marginBottom: 0 }}>
        <Col xs={24} sm={8}>
          <StatsCard 
            label="TỔNG SỐ CHỨC VỤ"
            value={positions.length}
            icon={<SolutionOutlined />}
            color={token.colorError}
            bg={token.colorErrorBg}
            size="small"
          />
        </Col>
        <Col xs={24} sm={8}>
          <StatsCard 
            label="CHỨC VỤ QUẢN LÝ (CẤP >= 5)"
            value={positions.filter(p => p.CapDo >= 5).length}
            icon={<SafetyOutlined />}
            color={token.colorInfo}
            bg={token.colorInfoBg}
            size="small"
          />
        </Col>
        <Col xs={24} sm={8}>
          <StatsCard 
            label="CHỨC VỤ CHUYÊN MÔN (CẤP < 5)"
            value={positions.filter(p => p.CapDo < 5).length}
            icon={<SlidersOutlined />}
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
          className="rounded-lg shadow-sm"
        >
          Thêm chức vụ
        </Button>
      </div>

      {/* Table Section - NOT WRAPPED in Card */}
      <PositionTable
        positions={positions}
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
            <SolutionOutlined style={{ color: 'var(--primary-color)', fontSize: '20px' }} />
            <span className="text-xl font-bold">
              {editingId === null ? "Thêm chức vụ mới" : "Cập nhật chức vụ"}
            </span>
          </Space>
        }
        width={600}
      >
        <PositionForm
          form={form}
          editingId={editingId}
        />
      </Modal>
    </div>
  );
}
