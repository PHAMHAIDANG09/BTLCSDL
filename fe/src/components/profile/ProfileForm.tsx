"use client";

import React, { useState } from "react";
import {
  Form,
  Input,
  DatePicker,
  Upload,
  Select,
  InputNumber,
  Tabs,
  Row,
  Col,
  Avatar,
  Divider,
  Space,
  message,
} from "antd";
import {
  UserOutlined,
  CameraOutlined,
  SaveOutlined,
  ArrowLeftOutlined,
  SolutionOutlined,
  FileTextOutlined,
} from "@ant-design/icons";
import type { UploadFile, UploadProps } from "antd/es/upload/interface";
import type { Dayjs } from "dayjs";
import Button from "@/components/shared/Button/Button";
import Link from "next/link";

const { Option } = Select;

export interface ProfileFormValues {
  // Tab 1
  fullName: string;
  email: string;
  phone: string;
  dob: Dayjs;
  gender: "male" | "female" | "other";
  address?: string;
  avatar?: UploadFile[];

  // Tab 1 extended
  identityCard?: string;
  taxCode?: string;
  dependents?: number;
  bankAccount?: string;
  bankName?: string;
  bankBranch?: string;

  // Tab 2
  employeeCode: string;
  department: string;
  position: string;
  startDate: Dayjs;

  // Tab 3
  contractType: string;
  baseSalary: number;
  contractSignDate: Dayjs;
  contractExpiredDate?: Dayjs;
}

interface ProfileFormProps {
  initialValues?: Partial<ProfileFormValues>;
  onFinish?: (values: ProfileFormValues) => void;
  loading?: boolean;
  onCancel?: () => void;
  onlyPersonalInfo?: boolean;
}

const DEPARTMENTS = [
  { value: "IT", label: "Phòng Công nghệ" },
  { value: "HR", label: "Phòng Nhân sự" },
  { value: "FIN", label: "Phòng Tài chính" },
  { value: "SALES", label: "Phòng Kinh doanh" },
  { value: "OPS", label: "Phòng Vận hành" },
];

const POSITIONS = [
  { value: "DEV", label: "Developer" },
  { value: "SDEV", label: "Senior Developer" },
  { value: "MGR", label: "Manager" },
  { value: "DIR", label: "Director" },
];

const CONTRACT_TYPES = [
  { value: "probation", label: "Thử việc" },
  { value: "1year", label: "Hợp đồng 1 năm" },
  { value: "indefinite", label: "Không thời hạn" },
];

export default function ProfileForm({
  initialValues,
  onFinish,
  loading = false,
  onCancel,
  onlyPersonalInfo = false,
}: ProfileFormProps) {
  const [form] = Form.useForm<ProfileFormValues>();
  const [activeTab, setActiveTab] = useState("1");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  const handleSubmit = (values: ProfileFormValues) => {
    onFinish?.(values);
  };

  const beforeUpload: UploadProps["beforeUpload"] = (file) => {
    const isImage = file.type.startsWith("image/");
    if (!isImage) {
      message.error("Chỉ được tải lên file ảnh!");
      return Upload.LIST_IGNORE;
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error("Ảnh phải nhỏ hơn 2MB!");
      return Upload.LIST_IGNORE;
    }
    const reader = new FileReader();
    reader.onload = (e) => setAvatarUrl(e.target?.result as string);
    reader.readAsDataURL(file);
    return false;
  };

  const tabItems = [
    {
      key: "1",
      label: (
        <span>
          <UserOutlined /> Thông tin cá nhân
        </span>
      ),
      children: (
        <div style={{ paddingTop: 24 }}>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 32 }}>
            <Form.Item name="avatar" valuePropName="fileList" getValueFromEvent={(e) => e?.fileList} noStyle>
              <Upload showUploadList={false} beforeUpload={beforeUpload} accept="image/*" maxCount={1}>
                <div style={{ cursor: "pointer", textAlign: "center" }}>
                  <Avatar
                    size={100}
                    src={avatarUrl}
                    icon={!avatarUrl && <UserOutlined />}
                    style={{
                      backgroundColor: avatarUrl ? "transparent" : "var(--primary-color)",
                      marginBottom: 8,
                      display: "block",
                    }}
                  />
                  <Button size="small" icon={<CameraOutlined />}>
                    Đổi ảnh đại diện
                  </Button>
                </div>
              </Upload>
            </Form.Item>
          </div>

          <Row gutter={24}>
            <Col xs={24} md={12}>
              <Form.Item name="fullName" label="Họ và tên" rules={[{ required: true, message: "Vui lòng nhập họ và tên" }]}>
                <Input placeholder="Ví dụ: Nguyễn Văn A" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item name="email" label="Email" rules={[{ required: true, type: "email" }]}>
                <Input placeholder="example@company.com" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item name="phone" label="Số điện thoại" rules={[{ required: true }]}>
                <Input placeholder="09xxxxxxxx" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item name="gender" label="Giới tính" rules={[{ required: true }]}>
                <Select placeholder="Chọn giới tính">
                  <Option value="male">Nam</Option>
                  <Option value="female">Nữ</Option>
                  <Option value="other">Khác</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item name="identityCard" label="Số CCCD/Hộ chiếu">
                <Input placeholder="Nhập số CCCD hoặc hộ chiếu" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item name="taxCode" label="Mã số thuế">
                <Input placeholder="Nhập mã số thuế cá nhân" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item name="dependents" label="Số người phụ thuộc">
                <InputNumber min={0} style={{ width: "100%" }} />
              </Form.Item>
            </Col>
            <Col xs={24}>
              <div style={{ margin: "16px 0 8px", fontWeight: 600, color: "var(--primary-color)", fontSize: 14, borderLeft: "4px solid var(--primary-color)", paddingLeft: 12 }}>
                Thông tin ngân hàng
              </div>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item name="bankAccount" label="Số tài khoản">
                <Input placeholder="Nhập số tài khoản ngân hàng" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item name="bankName" label="Tên ngân hàng">
                <Input placeholder="Ví dụ: Vietcombank, Techcombank..." />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item name="bankBranch" label="Chi nhánh">
                <Input placeholder="Nhập chi nhánh ngân hàng" />
              </Form.Item>
            </Col>
            <Col xs={24}>
              <Form.Item name="address" label="Địa chỉ thường trú">
                <Input.TextArea rows={3} placeholder="Số nhà, đường, phường/xã..." />
              </Form.Item>
            </Col>
          </Row>
        </div>
      ),
    },
    {
      key: "2",
      label: (
        <span>
          <SolutionOutlined /> Công tác
        </span>
      ),
      children: (
        <div style={{ paddingTop: 24 }}>
          <Row gutter={24}>
            <Col xs={24} md={12}>
              <Form.Item name="employeeCode" label="Mã nhân viên">
                <Input placeholder="EMP001" disabled />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item name="startDate" label="Ngày bắt đầu">
                <DatePicker style={{ width: "100%" }} format="DD/MM/YYYY" disabled />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item name="department" label="Phòng ban">
                <Select placeholder="Chọn phòng ban" disabled>
                  {DEPARTMENTS.map((d) => (
                    <Option key={d.value} value={d.value}>
                      {d.label}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item name="position" label="Chức vụ">
                <Select placeholder="Chọn chức vụ" disabled>
                  {POSITIONS.map((p) => (
                    <Option key={p.value} value={p.value}>
                      {p.label}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>
        </div>
      ),
    },
    {
      key: "3",
      label: (
        <span>
          <FileTextOutlined /> Hợp đồng & Lương
        </span>
      ),
      children: (
        <div style={{ paddingTop: 24 }}>
          <Row gutter={24}>
            <Col xs={24} md={12}>
              <Form.Item name="contractType" label="Loại hợp đồng">
                <Select placeholder="Chọn loại hợp đồng" disabled>
                  {CONTRACT_TYPES.map((t) => (
                    <Option key={t.value} value={t.value}>
                      {t.label}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item name="baseSalary" label="Lương cơ bản (VNĐ)">
                <InputNumber
                  placeholder="Ví dụ: 15,000,000"
                  style={{ width: "100%" }}
                  formatter={(v) => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                  parser={(v) => v!.replace(/,*/g, "") as any}
                  disabled
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item name="contractSignDate" label="Ngày ký kết">
                <DatePicker style={{ width: "100%" }} format="DD/MM/YYYY" disabled />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item name="contractExpiredDate" label="Ngày hết hạn">
                <DatePicker style={{ width: "100%" }} format="DD/MM/YYYY" disabled />
              </Form.Item>
            </Col>
          </Row>
        </div>
      ),
    },
  ];

  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={initialValues as any}
      onFinish={handleSubmit}
      requiredMark="optional"
    >
      {onlyPersonalInfo ? (
        tabItems[0].children
      ) : (
        <Tabs activeKey={activeTab} onChange={setActiveTab} type="line" items={tabItems} />
      )}

      <Divider />

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Button icon={<ArrowLeftOutlined />} onClick={onCancel}>
          Hủy bỏ
        </Button>
        <Button type="primary" htmlType="submit" icon={<SaveOutlined />} loading={loading}>
          Lưu thông tin
        </Button>
      </div>
    </Form>
  );
}
