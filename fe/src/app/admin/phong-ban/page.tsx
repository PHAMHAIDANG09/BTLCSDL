"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Row, Col, Space, Typography, Form, theme } from "antd";
import { 
  PartitionOutlined, 
  PlusOutlined, 
  HomeOutlined,
  UserOutlined,
  ApartmentOutlined
} from "@ant-design/icons";
import Link from "next/link";

// Shared Components
import Button from "@/components/shared/Button/Button";
import Modal from "@/components/shared/Modal/Modal";
import Toast from "@/components/shared/Toast/Toast";
import ConfirmDialog from "@/components/shared/ConfirmDialog/ConfirmDialog";
import StatsCard from "@/components/shared/StatsCard/StatsCard";

// Sub Components
import DepartmentTable from "./_components/DepartmentTable";
import DepartmentForm from "./_components/DepartmentForm";

// API Services
import { 
  getDepartmentsApi, 
  createDepartmentApi, 
  updateDepartmentApi, 
  deleteDepartmentApi,
  Department
} from "@/services/organization.service";
import { getEmployeesApi, Employee } from "@/services/employee.service";

const { Title, Text } = Typography;

export default function DepartmentPage() {
  const { token } = theme.useToken();
  const [departments, setDepartments] = useState<Department[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [form] = Form.useForm();

  // Load data
  const fetchData = async () => {
    setLoading(true);
    try {
      const [deptList, empList] = await Promise.all([
        getDepartmentsApi(),
        getEmployeesApi()
      ]);
      setDepartments(deptList);
      setEmployees(empList);
    } catch (error) {
      console.error(error);
      Toast.error("Không thể tải danh sách phòng ban và nhân viên");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Map IDs to Names
  const employeeMap = useMemo(() => {
    const map = new Map<number, string>();
    employees.forEach(emp => map.set(emp.Id, emp.HoTen));
    return map;
  }, [employees]);

  const departmentMap = useMemo(() => {
    const map = new Map<number, string>();
    departments.forEach(dept => map.set(dept.Id, dept.TenPhong));
    return map;
  }, [departments]);

  // CRUD Actions
  const handleAdd = () => {
    setEditingId(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  const handleEdit = (record: Department) => {
    setEditingId(record.Id);
    form.setFieldsValue({
      TenPhong: record.TenPhong,
      MaPhong: record.MaPhong,
      MaPhongCha: record.MaPhongCha || undefined,
      MaQuanLy: record.MaQuanLy || undefined
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id: number) => {
    ConfirmDialog.show({
      title: "Xác nhận xóa?",
      content: "Bạn có chắc chắn muốn xóa phòng ban này? Hành động này có thể ảnh hưởng đến các nhân viên đang trực thuộc.",
      type: "danger",
      onConfirm: async () => {
        try {
          await deleteDepartmentApi(id);
          Toast.success("Đã xóa phòng ban thành công");
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
        TenPhong: values.TenPhong,
        MaPhong: values.MaPhong,
        MaPhongCha: values.MaPhongCha ? Number(values.MaPhongCha) : undefined,
        MaQuanLy: values.MaQuanLy ? Number(values.MaQuanLy) : undefined
      };

      if (editingId === null) {
        await createDepartmentApi(payload);
        Toast.success("Tạo phòng ban mới thành công");
      } else {
        await updateDepartmentApi(editingId, payload);
        Toast.success("Cập nhật phòng ban thành công");
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
            <PartitionOutlined style={{ color: "var(--primary-color)" }} />
            Quản lý Phòng ban
          </Title>
          <Text type="secondary">Quản lý cơ cấu phòng ban và sơ đồ tổ chức của doanh nghiệp</Text>
        </div>
      </div>

      {/* Stats Section */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={8}>
          <StatsCard 
            label="TỔNG SỐ PHÒNG BAN"
            value={departments.length}
            icon={<PartitionOutlined />}
            color={token.colorError}
            bg={token.colorErrorBg}
            size="small"
          />
        </Col>
        <Col xs={24} sm={8}>
          <StatsCard 
            label="PHÒNG BAN TRỰC THUỘC CHA"
            value={departments.filter(d => !d.MaPhongCha).length}
            icon={<ApartmentOutlined />}
            color={token.colorInfo}
            bg={token.colorInfoBg}
            size="small"
          />
        </Col>
        <Col xs={24} sm={8}>
          <StatsCard 
            label="ĐÃ BỔ NHIỆM TRƯỞNG PHÒNG"
            value={departments.filter(d => !!d.MaQuanLy).length}
            icon={<UserOutlined />}
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
          Thêm phòng ban
        </Button>
      </div>

      {/* Table Section - NOT WRAPPED in Card */}
      <DepartmentTable
        departments={departments}
        loading={loading}
        employeeMap={employeeMap}
        departmentMap={departmentMap}
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
            <PartitionOutlined style={{ color: 'var(--primary-color)', fontSize: '20px' }} />
            <span className="text-xl font-bold">
              {editingId === null ? "Thêm phòng ban mới" : "Cập nhật phòng ban"}
            </span>
          </Space>
        }
        width={600}
      >
        <DepartmentForm
          form={form}
          editingId={editingId}
          departments={departments}
          employees={employees}
        />
      </Modal>
    </div>
  );
}
