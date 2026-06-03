'use client';

import React, { useState, useEffect } from 'react';
import {
  Form,
  Input,
  DatePicker,
  Select,
  InputNumber,
  Tabs,
  Space,
  Row,
  Col,
  Divider,
} from 'antd';
import { 
  SaveOutlined, 
  ArrowLeftOutlined,
  UserOutlined,
  SolutionOutlined,
  FileTextOutlined,
  LockOutlined as PasswordIcon
} from '@ant-design/icons';
import { getDepartmentsApi, getPositionsApi, Department, Position } from '@/services/organization.service';
import dayjs from 'dayjs';

// Import Shared Components
import Button from '@/components/shared/Button/Button';
import Toast from '@/components/shared/Toast/Toast';
import ConfirmDialog from '@/components/shared/ConfirmDialog/ConfirmDialog';
import { CommonRules } from '@/utils/validators';

const { Option } = Select;
const { TextArea } = Input;

interface EmployeeFormProps {
  initialValues?: any;
  onFinish?: (values: any) => void;
  loading?: boolean;
  isAdmin?: boolean;
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
  const [departments, setDepartments] = useState<Department[]>([]);
  const [positions, setPositions] = useState<Position[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [deptData, posData] = await Promise.all([
          getDepartmentsApi().catch(() => []),
          getPositionsApi().catch(() => [])
        ]);
        setDepartments(deptData || []);
        setPositions(posData || []);
      } catch (error) {
        console.error("Org data error:", error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (initialValues && typeof initialValues === 'object' && Object.keys(initialValues).length > 0) {
      try {
        const mapped = {
          ...initialValues,
          NgaySinh: initialValues.NgaySinh ? dayjs(initialValues.NgaySinh) : null,
          NgayVaoLam: initialValues.NgayVaoLam ? dayjs(initialValues.NgayVaoLam) : null,
        };
        form.setFieldsValue(mapped);
      } catch (e) {
        console.error("Mapping error:", e);
      }
    } else {
      form.resetFields();
    }
  }, [initialValues, form]);

  const handleSubmit = (values: any) => {
    // Chuyển đổi ngày tháng sang chuỗi YYYY-MM-DD một cách chắc chắn nhất
    const NgaySinh = values.NgaySinh ? dayjs(values.NgaySinh).format('YYYY-MM-DD') : null;
    const NgayVaoLam = values.NgayVaoLam ? dayjs(values.NgayVaoLam).format('YYYY-MM-DD') : null;

    const finalValues = {
      ...values,
      NgaySinh,
      NgayVaoLam,
    };
    
    onFinish?.(finalValues);
  };

  const handleCancelAction = () => {
    if (form.isFieldsTouched()) {
      ConfirmDialog.show({
        title: 'Hủy bỏ?',
        content: 'Các thay đổi sẽ không được lưu lại.',
        onConfirm: () => onCancel?.()
      });
    } else {
      onCancel?.();
    }
  };

  return (
    <div className="employee-form">
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        autoComplete="off"
      >
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={[
            {
              key: '1',
              label: (<span><UserOutlined /> Cá nhân</span>),
              children: (
                <div className="py-4">
                  <Row gutter={16}>
                    <Col span={12}>
                      <Form.Item name="HoTen" label="Họ tên" rules={[CommonRules.required('Họ tên')]}>
                        <Input placeholder="Nguyễn Văn A" />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item name="Email" label="Email" rules={[CommonRules.required('Email'), CommonRules.email()]}>
                        <Input placeholder="a@nexthr.vn" disabled={!!initialValues} />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item name="SoDienThoai" label="Số điện thoại" rules={[CommonRules.required('SĐT')]}>
                        <Input placeholder="09xxx" />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item name="NgaySinh" label="Ngày sinh" rules={[CommonRules.required('Ngày sinh')]}>
                        <DatePicker className="w-full" format="DD/MM/YYYY" placeholder="Chọn ngày" />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item name="GioiTinh" label="Giới tính" initialValue="Nam">
                        <Select>
                          <Option value="Nam">Nam</Option>
                          <Option value="Nữ">Nữ</Option>
                          <Option value="Khác">Khác</Option>
                        </Select>
                      </Form.Item>
                    </Col>
                    {!initialValues && (
                      <Col span={12}>
                        <Form.Item name="MatKhau" label="Mật khẩu ban đầu" rules={[CommonRules.required('Mật khẩu')]}>
                          <Input.Password prefix={<PasswordIcon />} />
                        </Form.Item>
                      </Col>
                    )}
                    <Col span={12}>
                      <Form.Item name="SoCCCD" label="Số CCCD">
                        <Input placeholder="Nhập số CCCD" />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item name="MaSoThue" label="Mã số thuế (MST)">
                        <Input placeholder="Nhập mã số thuế" />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item name="SoNguoiPhuThuoc" label="Số người phụ thuộc" initialValue={0}>
                        <InputNumber className="w-full" min={0} placeholder="Ví dụ: 0, 1, 2" />
                      </Form.Item>
                    </Col>
                    <Col span={24}>
                      <Form.Item name="DiaChi" label="Địa chỉ liên hệ">
                        <TextArea rows={2} placeholder="Địa chỉ thường trú..." />
                      </Form.Item>
                    </Col>
                  </Row>
                </div>
              ),
            },
            {
              key: '2',
              label: (<span><SolutionOutlined /> Công tác</span>),
              children: (
                <div className="py-4">
                  <Row gutter={16}>
                    {initialValues && (
                      <Col span={12}>
                        <Form.Item name="MaNhanVien" label="Mã nhân viên">
                          <Input disabled />
                        </Form.Item>
                      </Col>
                    )}
                    <Col span={12}>
                      <Form.Item name="NgayVaoLam" label="Ngày vào làm" rules={[CommonRules.required('Ngày vào')]}>
                        <DatePicker className="w-full" format="DD/MM/YYYY" disabled={!!initialValues} />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item name="MaPhongId" label="Phòng ban" rules={[CommonRules.required('Phòng ban')]}>
                        <Select placeholder="Chọn phòng">
                          {departments.map(d => <Option key={d.Id} value={d.Id}>{d.TenPhong}</Option>)}
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item name="MaChucVuId" label="Chức vụ" rules={[CommonRules.required('Chức vụ')]}>
                        <Select placeholder="Chọn chức vụ">
                          {positions.map(p => <Option key={p.Id} value={p.Id}>{p.TenChucVu}</Option>)}
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item name="MaVaiTroId" label="Vai trò hệ thống" initialValue={3}>
                        <Select disabled={!isAdmin}>
                          <Option value={1}>Admin</Option>
                          <Option value={2}>Manager</Option>
                          <Option value={3}>Staff</Option>
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item name="TrangThai" label="Trạng thái" initialValue="Active">
                        <Select disabled={!isAdmin}>
                          <Option value="Active">Đang làm</Option>
                          <Option value="Inactive">Nghỉ việc</Option>
                        </Select>
                      </Form.Item>
                    </Col>
                  </Row>
                </div>
              ),
            },
            {
              key: '3',
              label: (<span><FileTextOutlined /> Hợp đồng & Lương</span>),
              children: (
                <div className="py-4">
                  <Row gutter={16}>
                    <Col span={24}>
                      <p className="text-gray-500 mb-4 italic text-sm">
                        * Quản lý thông tin hợp đồng và lương cơ bản hiện tại của nhân viên.
                      </p>
                    </Col>
                    <Col span={12}>
                      <Form.Item name="contractType" label="Loại hợp đồng">
                        <Select placeholder="Chọn loại hợp đồng">
                          <Option value="Thử việc">Thử việc</Option>
                          <Option value="Chính thức">Chính thức</Option>
                          <Option value="Cộng tác viên">Cộng tác viên</Option>
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item name="baseSalary" label="Lương cơ bản">
                        <InputNumber 
                          className="w-full" 
                          formatter={v => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                          placeholder="Nhập số tiền"
                        />
                      </Form.Item>
                    </Col>
                    <Col span={24}>
                      <Divider orientation={"left" as any} style={{ margin: '12px 0' }}>Thông tin tài khoản ngân hàng</Divider>
                    </Col>
                    <Col span={12}>
                      <Form.Item name="SoTaiKhoan" label="Số tài khoản">
                        <Input placeholder="Nhập số tài khoản" />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item name="TenNganHang" label="Tên ngân hàng">
                        <Input placeholder="Ví dụ: Vietcombank, Techcombank" />
                      </Form.Item>
                    </Col>
                    <Col span={24}>
                      <Form.Item name="ChiNhanhNganHang" label="Chi nhánh ngân hàng">
                        <Input placeholder="Ví dụ: Chi nhánh Hà Nội" />
                      </Form.Item>
                    </Col>
                  </Row>
                </div>
              ),
            }
          ]}
        />
        <Divider />
        <div className="flex justify-between items-center">
          <Button icon={<ArrowLeftOutlined />} variant="text" onClick={handleCancelAction}>Quay lại</Button>
          <Button 
            type="primary" 
            htmlType="submit" 
            icon={<SaveOutlined />} 
            loading={loading}
            className="px-8"
          >
            {initialValues ? 'Lưu thay đổi' : 'Thêm nhân viên'}
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default EmployeeForm;
