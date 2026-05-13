"use client";

import React, { useState, useEffect } from "react";
import { 
  Form, 
  Input, 
  DatePicker, 
  Select, 
  InputNumber, 
  Row, 
  Col, 
  Divider,
  Space,
  Alert
} from "antd";
import { 
  SaveOutlined, 
  ArrowLeftOutlined,
  FileProtectOutlined,
  UserOutlined 
} from "@ant-design/icons";
import dayjs from "dayjs";
import Button from "@/components/shared/Button/Button";
import { getEmployeesApi } from "@/services/employee.service";
import { CommonRules } from "@/utils/validators";

const { Option } = Select;

interface ContractFormProps {
  initialValues?: any;
  onFinish: (values: any) => void;
  loading: boolean;
  onCancel: () => void;
  isViewOnly?: boolean;
}

const ContractForm: React.FC<ContractFormProps> = ({
  initialValues,
  onFinish,
  loading,
  onCancel,
  isViewOnly = false,
}) => {
  const [form] = Form.useForm();
  const [employees, setEmployees] = useState<any[]>([]);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const data = await getEmployeesApi();
        setEmployees(data);
      } catch (error) {
        console.error("Failed to fetch employees:", error);
      }
    };
    fetchEmployees();
  }, []);

  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue({
        ...initialValues,
        NgayKy: initialValues.NgayKy ? dayjs(initialValues.NgayKy) : null,
        NgayBatDau: initialValues.NgayBatDau ? dayjs(initialValues.NgayBatDau) : null,
        NgayKetThuc: initialValues.NgayKetThuc ? dayjs(initialValues.NgayKetThuc) : null,
      });
    } else {
      form.resetFields();
    }
  }, [initialValues, form]);

  const handleSubmit = (values: any) => {
    if (isViewOnly) return;
    // Format dates before sending một cách an toàn nhất
    const formattedValues = {
      ...values,
      NgayKy: values.NgayKy ? dayjs(values.NgayKy).format("YYYY-MM-DD") : null,
      NgayBatDau: values.NgayBatDau ? dayjs(values.NgayBatDau).format("YYYY-MM-DD") : null,
      NgayKetThuc: values.NgayKetThuc ? dayjs(values.NgayKetThuc).format("YYYY-MM-DD") : null,
    };
    onFinish(formattedValues);
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleSubmit}
      className="contract-form py-4"
      disabled={isViewOnly}
    >
      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-800 m-0">Thông tin Hợp đồng Lao động</h3>
        <p className="text-gray-500 text-sm m-0 mt-1">Chi tiết các thông tin pháp lý của hợp đồng</p>
      </div>

      <Row gutter={24}>
        <Col xs={24} md={12}>
          <Form.Item
            name="MaNhanVienId"
            label="Nhân viên thụ hưởng"
            rules={[CommonRules.required("Nhân viên")]}
          >
            <Select 
              showSearch
              placeholder="Chọn nhân viên"
              optionFilterProp="children"
              filterOption={(input, option) =>
                (option?.children as unknown as string).toLowerCase().includes(input.toLowerCase())
              }
            >
              {employees.map(emp => (
                <Option key={emp.Id} value={emp.Id}>{emp.HoTen} ({emp.Email})</Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        {/* MaHopDong được tự động sinh tại Backend */}

        <Col xs={24} md={12}>
          <Form.Item
            name="LoaiHopDong"
            label="Loại hợp đồng"
            rules={[CommonRules.required("Loại hợp đồng")]}
          >
            <Select placeholder="Chọn loại hợp đồng">
              <Option value="Thử việc">Thử việc</Option>
              <Option value="Xác định thời hạn">Xác định thời hạn</Option>
              <Option value="Không xác định thời hạn">Không xác định thời hạn</Option>
            </Select>
          </Form.Item>
        </Col>
        <Col xs={24} md={12}>
          <Form.Item
            name="LuongCoBan"
            label="Mức lương cơ bản (VND)"
            rules={[CommonRules.required("Mức lương")]}
          >
            <InputNumber 
              className="w-full"
              min={0}
              placeholder="Ví dụ: 15,000,000"
              formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
              parser={(value) => value!.replace(/\$\s?|(,*)/g, "") as any}
            />
          </Form.Item>
        </Col>

        <Col xs={24} md={8}>
          <Form.Item
            name="NgayKy"
            label="Ngày ký kết"
            rules={[CommonRules.required("Ngày ký")]}
          >
            <DatePicker className="w-full" format="DD/MM/YYYY" />
          </Form.Item>
        </Col>
        <Col xs={24} md={8}>
          <Form.Item
            name="NgayBatDau"
            label="Ngày bắt đầu"
            rules={[CommonRules.required("Ngày bắt đầu")]}
          >
            <DatePicker className="w-full" format="DD/MM/YYYY" />
          </Form.Item>
        </Col>
        <Col xs={24} md={8}>
          <Form.Item
            name="NgayKetThuc"
            label="Ngày hết hạn"
          >
            <DatePicker className="w-full" format="DD/MM/YYYY" />
          </Form.Item>
        </Col>

        <Col xs={24} md={24}>
          <Form.Item
            name="TrangThai"
            label="Trạng thái hợp đồng"
            initialValue="Active"
          >
            <Select>
              <Option value="Active">Đang hiệu lực</Option>
              <Option value="Expired">Hết hiệu lực</Option>
              <Option value="Terminated">Chấm dứt trước hạn</Option>
            </Select>
          </Form.Item>
        </Col>

        <Col xs={24}>
          <Form.Item
            name="GhiChu"
            label="Ghi chú / Điều khoản bổ sung"
          >
            <Input.TextArea rows={4} placeholder="Các thỏa thuận riêng, phụ lục đi kèm..." />
          </Form.Item>
        </Col>
      </Row>

      <Divider />

      <div className="flex justify-end items-center mt-6">
        <Space size={12}>
          <Button 
            icon={<ArrowLeftOutlined />} 
            variant="text" 
            onClick={onCancel}
          >
            {isViewOnly ? "Đóng" : "Hủy bỏ"}
          </Button>
          {!isViewOnly && (
            <Button
              type="primary"
              htmlType="submit"
              icon={<SaveOutlined />}
              loading={loading}
              className="px-10 shadow-lg shadow-blue-100"
            >
              {initialValues ? "Cập nhật Hợp đồng" : "Tạo Hợp đồng mới"}
            </Button>
          )}
        </Space>
      </div>
    </Form>
  );
};

export default ContractForm;
