"use client";

import React, { useEffect, useState } from "react";
import { Descriptions, Avatar, Space, Tag, Divider, Tabs, Table, Card } from "antd";
import { FileTextOutlined, UserOutlined, PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import { Employee, Contract, getEmployeeContractsApi, createContractApi, deleteContractApi } from "@/services/employee.service";
import Toast from "@/components/shared/Toast/Toast";
import Button from "@/components/shared/Button/Button";
import Modal from "@/components/shared/Modal/Modal";
import { Form, Input, DatePicker, InputNumber, Select, Popconfirm } from "antd";
import dayjs from "dayjs";

interface EmployeeDetailProps {
  employee: Employee | null;
}

const EmployeeDetail: React.FC<EmployeeDetailProps> = ({ employee }) => {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [loading, setLoading] = useState(false);
  const [isContractModalOpen, setIsContractModalOpen] = useState(false);
  const [contractForm] = Form.useForm();

  const fetchContracts = async () => {
    if (employee) {
      setLoading(true);
      try {
        const data = await getEmployeeContractsApi(employee.Id);
        setContracts(data);
      } catch (error) {
        Toast.error("Lỗi khi tải danh sách hợp đồng");
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchContracts();
  }, [employee]);

  const handleAddContract = async (values: any) => {
    try {
      const data = {
        ...values,
        MaNhanVienId: employee?.Id,
        NgayKy: values.NgayKy?.format("YYYY-MM-DD"),
        NgayBatDau: values.NgayBatDau?.format("YYYY-MM-DD"),
        NgayKetThuc: values.NgayKetThuc?.format("YYYY-MM-DD"),
        TrangThai: "Active"
      };
      await createContractApi(data);
      Toast.success("Thêm hợp đồng mới thành công");
      setIsContractModalOpen(false);
      contractForm.resetFields();
      fetchContracts();
    } catch (error) {
      Toast.error("Lỗi khi thêm hợp đồng");
    }
  };

  const handleDeleteContract = async (id: number) => {
    try {
      await deleteContractApi(id);
      Toast.success("Đã xóa hợp đồng");
      fetchContracts();
    } catch (error) {
      Toast.error("Lỗi khi xóa hợp đồng");
    }
  };

  if (!employee) return null;

  const contractColumns = [
    { title: "Loại hợp đồng", dataIndex: "LoaiHopDong", key: "LoaiHopDong" },
    { 
      title: "Ngày bắt đầu", 
      dataIndex: "NgayBatDau", 
      key: "NgayBatDau",
      render: (date: string) => new Date(date).toLocaleDateString("vi-VN")
    },
    { 
      title: "Ngày kết thúc", 
      dataIndex: "NgayKetThuc", 
      key: "NgayKetThuc",
      render: (date: string) => date ? new Date(date).toLocaleDateString("vi-VN") : "Không thời hạn"
    },
    { 
      title: "Lương cơ bản", 
      dataIndex: "LuongCoBan", 
      key: "LuongCoBan",
      render: (val: number) => val?.toLocaleString("vi-VN") + " VNĐ"
    },
    { 
      title: "Trạng thái", 
      dataIndex: "TrangThai", 
      key: "TrangThai",
      render: (status: string) => (
        <Tag color={status === "Active" ? "green" : "default"}>
          {status === "Active" ? "Đang hiệu lực" : "Hết hạn"}
        </Tag>
      )
    },
    {
      title: "Thao tác",
      key: "action",
      render: (_: any, record: Contract) => (
        <Popconfirm title="Xóa hợp đồng này?" onConfirm={() => handleDeleteContract(record.Id)}>
          <Button type="text" danger icon={<DeleteOutlined />} size="small" />
        </Popconfirm>
      )
    }
  ];

  return (
    <div className="p-2">
      <Tabs
        defaultActiveKey="1"
        items={[
          {
            key: "1",
            label: (
              <span>
                <UserOutlined /> Thông tin cá nhân
              </span>
            ),
            children: (
              <div className="pt-4 animate-in fade-in duration-500">
                <div className="flex items-center gap-4 mb-6 bg-gray-50 p-4 rounded-xl border border-dashed border-gray-200">
                  <Avatar size={80} style={{ backgroundColor: "#c41d1d" }}>
                    {employee.HoTen.charAt(0)}
                  </Avatar>
                  <div>
                    <h2 className="text-2xl font-black m-0 text-gray-800">{employee.HoTen}</h2>
                    <p className="text-gray-500 m-0 font-medium">{employee.Email}</p>
                    <Space className="mt-2">
                      <Tag color="red" className="font-bold">{employee.MaNhanVien}</Tag>
                      <Tag color="blue">{employee.vaiTro?.TenVaiTro || "Nhân viên"}</Tag>
                    </Space>
                  </div>
                </div>

                <Descriptions bordered column={1} size="small" className="mt-4">
                  <Descriptions.Item label="Họ và Tên" labelStyle={{ fontWeight: 600 }}>{employee.HoTen}</Descriptions.Item>
                  <Descriptions.Item label="Email" labelStyle={{ fontWeight: 600 }}>{employee.Email}</Descriptions.Item>
                  <Descriptions.Item label="Số điện thoại" labelStyle={{ fontWeight: 600 }}>{employee.SoDienThoai || "N/A"}</Descriptions.Item>
                  <Descriptions.Item label="Giới tính" labelStyle={{ fontWeight: 600 }}>{employee.GioiTinh || "N/A"}</Descriptions.Item>
                  <Descriptions.Item label="Địa chỉ" labelStyle={{ fontWeight: 600 }}>{employee.DiaChi || "N/A"}</Descriptions.Item>
                  <Descriptions.Item label="Phòng ban" labelStyle={{ fontWeight: 600 }}>{employee.phongBan?.TenPhong || "N/A"}</Descriptions.Item>
                  <Descriptions.Item label="Chức vụ" labelStyle={{ fontWeight: 600 }}>{employee.chucVu?.TenChucVu || "N/A"}</Descriptions.Item>
                  <Descriptions.Item label="Ngày vào làm" labelStyle={{ fontWeight: 600 }}>
                    {employee.NgayVaoLam ? new Date(employee.NgayVaoLam).toLocaleDateString("vi-VN") : "N/A"}
                  </Descriptions.Item>
                  <Descriptions.Item label="Trạng thái" labelStyle={{ fontWeight: 600 }}>
                    <Tag color={employee.TrangThai === "Active" ? "success" : "default"}>
                      {employee.TrangThai === "Active" ? "Đang làm việc" : "Nghỉ việc"}
                    </Tag>
                  </Descriptions.Item>
                </Descriptions>
              </div>
            ),
          },
          {
            key: "2",
            label: (
              <span>
                <FileTextOutlined /> Hợp đồng lao động
              </span>
            ),
            children: (
              <div className="pt-4 animate-in slide-in-from-right duration-500">
                <div className="flex justify-end mb-4">
                  <Button 
                    type="primary" 
                    icon={<PlusOutlined />} 
                    onClick={() => setIsContractModalOpen(true)}
                    size="small"
                  >
                    Thêm hợp đồng
                  </Button>
                </div>
                <Table
                  columns={contractColumns}
                  dataSource={contracts}
                  loading={loading}
                  rowKey="Id"
                  pagination={false}
                  size="small"
                  locale={{ emptyText: "Chưa có dữ liệu hợp đồng" }}
                />
              </div>
            ),
          },
        ]}
      />

      <Modal
        title="Thêm hợp đồng mới"
        open={isContractModalOpen}
        onCancel={() => setIsContractModalOpen(false)}
        onOk={() => contractForm.submit()}
        width={500}
      >
        <Form 
          form={contractForm} 
          layout="vertical" 
          onFinish={handleAddContract}
          initialValues={{ LoaiHopDong: "Hợp đồng chính thức" }}
        >
          <Form.Item name="LoaiHopDong" label="Loại hợp đồng" rules={[{ required: true }]}>
            <Select>
              <Select.Option value="Thử việc">Thử việc</Select.Option>
              <Select.Option value="Hợp đồng chính thức">Hợp đồng chính thức</Select.Option>
              <Select.Option value="Hợp đồng 1 năm">Hợp đồng 1 năm</Select.Option>
              <Select.Option value="Không thời hạn">Không thời hạn</Select.Option>
            </Select>
          </Form.Item>
          <div className="grid grid-cols-2 gap-4">
            <Form.Item name="NgayKy" label="Ngày ký" rules={[{ required: true }]}>
              <DatePicker className="w-full" format="DD/MM/YYYY" />
            </Form.Item>
            <Form.Item name="NgayBatDau" label="Ngày bắt đầu" rules={[{ required: true }]}>
              <DatePicker className="w-full" format="DD/MM/YYYY" />
            </Form.Item>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Form.Item name="NgayKetThuc" label="Ngày kết thúc">
              <DatePicker className="w-full" format="DD/MM/YYYY" />
            </Form.Item>
            <Form.Item name="LuongCoBan" label="Lương cơ bản" rules={[{ required: true }]}>
              <InputNumber className="w-full" formatter={v => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} />
            </Form.Item>
          </div>
          <Form.Item name="GhiChu" label="Ghi chú">
            <Input.TextArea rows={2} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default EmployeeDetail;
