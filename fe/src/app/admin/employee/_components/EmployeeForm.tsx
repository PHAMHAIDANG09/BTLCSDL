'use client';

/**
 * Complex Employee Form Component
 * Dùng chung cho Admin (thêm/sửa) và Staff (cập nhật hồ sơ)
 */

import React, { useState } from 'react';
import {
  Form,
  Input,
  DatePicker,
  Upload,
  Select,
  InputNumber,
  Tabs,
  Space,
  Card,
  Row,
  Col,
  Divider,
} from 'antd';
import { 
  UploadOutlined, 
  SaveOutlined, 
  ArrowLeftOutlined,
  UserOutlined,
  SolutionOutlined,
  FileTextOutlined,
  CameraOutlined
} from '@ant-design/icons';
import type { UploadFile } from 'antd/es/upload/interface';
import Link from 'next/link';

// Import Shared Components & Utils
import Button from '../../../../components/shared/Button/Button';
import Toast from '../../../../components/shared/Toast/Toast';
import ConfirmDialog from '../../../../components/shared/ConfirmDialog/ConfirmDialog';
import { CommonRules } from '../../../../utils/validators';

const { Option } = Select;
const { TextArea } = Input;

export interface EmployeeFormValues {
  // Tab 1: Basic Info
  fullName: string;
  email: string;
  phone: string;
  dob: any;
  address?: string;
  gender: 'male' | 'female' | 'other';

  // Tab 2: Work Info
  departmentId: string;
  positionId: string;
  employeeCode: string;
  startDate: any;

  // Tab 3: Contract Info
  contractType: string;
  baseSalary: number;
  contractSignDate: any;
  contractExpiredDate?: any;

  // Tab 4: Media
  avatar?: any;
}

interface EmployeeFormProps {
  initialValues?: Partial<EmployeeFormValues>;
  onFinish?: (values: EmployeeFormValues) => void;
  loading?: boolean;
  isAdmin?: boolean; // Phân quyền: Admin được sửa tất cả, Staff chỉ sửa thông tin cá nhân
  onCancel?: () => void;
}

const EmployeeForm: React.FC<EmployeeFormProps> = ({
  initialValues,
  onFinish,
  loading = false,
  isAdmin = true,
  onCancel,
}) => {
  const [form] = Form.useForm();
  const [activeTab, setActiveTab] = useState('1');

  const handleSubmit = (values: any) => {
    if (onFinish) {
      onFinish(values);
    } else {
      console.log('Final Form Values:', values);
      Toast.success('Đã ghi nhận thông tin nhân viên (Demo)');
    }
  };

  const normFile = (e: any) => {
    if (Array.isArray(e)) return e;
    return e?.fileList;
  };

  const handleCancelAction = () => {
    if (form.isFieldsTouched()) {
      ConfirmDialog.show({
        title: 'Hủy bỏ thay đổi?',
        content: 'Bạn đã có thay đổi trên biểu mẫu. Nếu hủy bỏ, các thông tin này sẽ không được lưu. Bạn có chắc chắn?',
        type: 'warning',
        okText: 'Đồng ý hủy',
        cancelText: 'Tiếp tục nhập',
        onConfirm: () => {
          if (onCancel) onCancel();
        }
      });
    } else {
      if (onCancel) onCancel();
    }
  };

  return (
    <div className="employee-form-container">
      <Form
        form={form}
        layout="vertical"
        initialValues={initialValues || ({ gender: 'male', baseSalary: 0 } as any)}
        onFinish={handleSubmit}
        requiredMark="optional"
      >
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          type="line"
          className="admin-complex-tabs"
          items={[
            {
              key: '1',
              label: (
                <span>
                  <UserOutlined /> Thông tin cá nhân
                </span>
              ),
              children: (
                <div className="py-4 animate-in fade-in duration-500">
                  <Row gutter={24}>
                    <Col xs={24} md={12}>
                      <Form.Item
                        name="fullName"
                        label="Họ và Tên"
                        rules={[CommonRules.required('Họ tên')]}
                      >
                        <Input placeholder="Ví dụ: Nguyễn Văn A" />
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                      <Form.Item
                        name="email"
                        label="Email công việc"
                        rules={[CommonRules.required('Email'), CommonRules.email()]}
                      >
                        <Input placeholder="nva@nexthr.com" disabled={!isAdmin} />
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                      <Form.Item
                        name="phone"
                        label="Số điện thoại"
                        rules={[CommonRules.required('Số điện thoại'), CommonRules.phone()]}
                      >
                        <Input placeholder="09xxxxxxxx" />
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                      <Form.Item
                        name="dob"
                        label="Ngày sinh"
                        rules={[CommonRules.required('Ngày sinh')]}
                      >
                        <DatePicker className="w-full" format="DD/MM/YYYY" />
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                      <Form.Item name="gender" label="Giới tính">
                        <Select>
                          <Option value="male">Nam</Option>
                          <Option value="female">Nữ</Option>
                          <Option value="other">Khác</Option>
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col xs={24}>
                      <Form.Item name="address" label="Địa chỉ thường trú">
                        <TextArea rows={3} placeholder="Số nhà, đường, phường/xã..." />
                      </Form.Item>
                    </Col>
                  </Row>
                </div>
              ),
            },
            {
              key: '2',
              label: (
                <span>
                  <SolutionOutlined /> Công tác
                </span>
              ),
              disabled: !isAdmin && activeTab !== '2', // Staff có thể xem nhưng không chắc được sửa
              children: (
                <div className="py-4">
                  <Row gutter={24}>
                    <Col xs={24} md={12}>
                      <Form.Item
                        name="employeeCode"
                        label="Mã nhân viên"
                        rules={[CommonRules.required('Mã nhân viên')]}
                      >
                        <Input placeholder="EMP001" disabled={!isAdmin} />
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                      <Form.Item
                        name="startDate"
                        label="Ngày thử việc/Bắt đầu"
                        rules={[CommonRules.required('Ngày bắt đầu')]}
                      >
                        <DatePicker className="w-full" format="DD/MM/YYYY" disabled={!isAdmin} />
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                      <Form.Item
                        name="departmentId"
                        label="Phòng ban"
                        rules={[CommonRules.required('Phòng ban')]}
                      >
                        <Select placeholder="Chọn phòng ban" disabled={!isAdmin}>
                          <Option value="IT">Phòng Công nghệ</Option>
                          <Option value="HR">Phòng Nhân sự</Option>
                          <Option value="FIN">Phòng Tài chính</Option>
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                      <Form.Item
                        name="positionId"
                        label="Chức vụ"
                        rules={[CommonRules.required('Chức vụ')]}
                      >
                        <Select placeholder="Chọn chức vụ" disabled={!isAdmin}>
                          <Option value="DEV">Developer</Option>
                          <Option value="MGR">Manager</Option>
                          <Option value="DIR">Director</Option>
                        </Select>
                      </Form.Item>
                    </Col>
                  </Row>
                </div>
              ),
            },
            {
              key: '3',
              label: (
                <span>
                  <FileTextOutlined /> Hợp đồng & Lương
                </span>
              ),
              disabled: !isAdmin, // Chỉ Admin mới được can thiệp vào lương/hợp đồng
              children: (
                <div className="py-4">
                  <Row gutter={24}>
                    <Col xs={24} md={12}>
                      <Form.Item
                        name="contractType"
                        label="Loại hợp đồng"
                        rules={[CommonRules.required('Loại hợp đồng')]}
                      >
                        <Select>
                          <Option value="probation">Thử việc</Option>
                          <Option value="1year">Hợp đồng 1 năm</Option>
                          <Option value="indefinite">Không thời hạn</Option>
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                      <Form.Item
                        name="baseSalary"
                        label="Lương cơ bản (VND)"
                        rules={[CommonRules.required('Lương cơ bản')]}
                      >
                        <InputNumber
                          className="w-full"
                          formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                          parser={(value) => value!.replace(/\$\s?|(,*)/g, '') as any}
                          min={0}
                        />
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                      <Form.Item name="contractSignDate" label="Ngày ký kết">
                        <DatePicker className="w-full" format="DD/MM/YYYY" />
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                      <Form.Item name="contractExpiredDate" label="Ngày hết hạn">
                        <DatePicker className="w-full" format="DD/MM/YYYY" />
                      </Form.Item>
                    </Col>
                  </Row>
                </div>
              ),
            },
            {
              key: '4',
              label: (
                <span>
                  <CameraOutlined /> Ảnh đại diện
                </span>
              ),
              children: (
                <div className="py-8 flex flex-col items-center justify-center">
                  <Form.Item
                    name="avatar"
                    valuePropName="fileList"
                    getValueFromEvent={normFile}
                    noStyle
                  >
                    <Upload
                      listType="picture-card"
                      maxCount={1}
                      beforeUpload={() => false}
                      className="avatar-uploader"
                    >
                      <div>
                        <UploadOutlined />
                        <div style={{ marginTop: 8 }}>Tải ảnh</div>
                      </div>
                    </Upload>
                  </Form.Item>
                  <p className="text-gray-400 mt-4 text-sm">
                    Định dạng: JPG, PNG. Dung lượng tối đa: 2MB
                  </p>
                </div>
              ),
            },
          ]}
        />

        <Divider />

        <div className="flex justify-between items-center mt-6">
          {onCancel ? (
            <Button icon={<ArrowLeftOutlined />} variant="text" size="middle" onClick={handleCancelAction}>
              Hủy bỏ
            </Button>
          ) : (
            <Link href="/admin/nhan-vien">
              <Button icon={<ArrowLeftOutlined />} variant="text" size="middle">
                Quay lại danh sách
              </Button>
            </Link>
          )}
          
          <Space size="middle">
            <Button
              type="primary"
              htmlType="submit"
              icon={<SaveOutlined />}
              size="middle"
              loading={loading}
              className="px-6"
            >
              {initialValues ? 'Cập nhật thông tin' : 'Thêm mới nhân viên'}
            </Button>
          </Space>
        </div>
      </Form>
    </div>
  );
};

export default EmployeeForm;
