"use client";

import { Typography, Descriptions, Avatar, Tag, Row, Col, Card, Modal, message, Space, Form, Input, App } from "antd";
import { 
  UserOutlined, 
  EditOutlined, 
  PhoneOutlined, 
  MailOutlined, 
  BankOutlined, 
  FileTextOutlined, 
  InfoCircleOutlined,
  LockOutlined
} from "@ant-design/icons";
import { useState } from "react";
import dayjs from "dayjs";
import Button from "@/components/shared/Button/Button";
import ProfileForm, { ProfileFormValues } from "./ProfileForm";
import ProfileDetailModal from "./ProfileDetailModal";
import { updateProfileApi, changePasswordApi } from "@/services/auth.service";

const { Title, Text } = Typography;

interface ProfileViewProps {
  data: any;
  isAdmin?: boolean;
  onRefresh?: () => void;
}

const formatSalary = (amount: number) =>
  amount ? amount.toLocaleString("vi-VN") + " đ" : "0 đ";

export default function ProfileView({ data, isAdmin = false, onRefresh }: ProfileViewProps) {
  const { message } = App.useApp();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [passForm] = Form.useForm();

  // Xử lý cập nhật hồ sơ cá nhân
  const handleUpdateProfile = async (values: ProfileFormValues) => {
    setLoading(true);
    try {
      // Mapping dữ liệu FE ngược về BE
      const updateData = {
        HoTen: values.fullName,
        SoDienThoai: values.phone,
        GioiTinh: values.gender === 'male' ? 'Nam' : values.gender === 'female' ? 'Nữ' : 'Khác',
        NgaySinh: values.dob ? values.dob.format('YYYY-MM-DD') : null,
        SoCCCD: values.identityCard,
        DiaChi: values.address,
        MaSoThue: values.taxCode,
        SoNguoiPhuThuoc: values.dependents,
        SoTaiKhoan: values.bankAccount,
        TenNganHang: values.bankName,
        ChiNhanhNganHang: values.bankBranch,
      };

      await updateProfileApi(updateData);
      message.success("Cập nhật hồ sơ thành công!");
      setIsEditModalOpen(false);
      onRefresh?.(); // Tải lại dữ liệu mới
    } catch (error: any) {
      message.error("Lỗi cập nhật: " + (error.message || "Không thể lưu thay đổi"));
    } finally {
      setLoading(false);
    }
  };

  // Xử lý đổi mật khẩu
  const handleChangePassword = async (values: any) => {
    if (values.newPassword !== values.confirmPassword) {
      return message.error("Mật khẩu xác nhận không khớp!");
    }
    
    setLoading(true);
    try {
      await changePasswordApi({
        oldPassword: values.oldPassword,
        newPassword: values.newPassword
      });
      message.success("Đổi mật khẩu thành công!");
      setIsPasswordModalOpen(false);
      passForm.resetFields();
    } catch (error: any) {
      message.error("Lỗi: " + (error.message || "Mật khẩu cũ không đúng"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
        <div>
          <Title level={2} style={{ margin: 0 }}>Hồ sơ cá nhân {isAdmin && "(Admin)"}</Title>
          <Text type="secondary">Quản lý thông tin định danh và xem chi tiết hồ sơ nhân sự</Text>
        </div>
        <Space>
          <Button 
            icon={<LockOutlined />} 
            onClick={() => setIsPasswordModalOpen(true)}
          >
            Đổi mật khẩu
          </Button>
          <Button 
            icon={<InfoCircleOutlined />} 
            onClick={() => setIsDetailModalOpen(true)}
          >
            Xem chi tiết
          </Button>
          <Button 
            type="primary" 
            icon={<EditOutlined />} 
            onClick={() => setIsEditModalOpen(true)}
          >
            Chỉnh sửa
          </Button>
        </Space>
      </div>

      {/* Overview Card */}
      <Card style={{ marginBottom: 24 }}>
        <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
          <Avatar
            size={88}
            icon={<UserOutlined />}
            style={{ backgroundColor: data.avatarColor || "#ab3e40", flexShrink: 0, fontSize: 36 }}
          />
          <div>
            <Title level={3} style={{ margin: 0 }}>{data.fullName}</Title>
            <Text type="secondary">
              {data.position} · {data.department}
            </Text>
            <div style={{ marginTop: 8 }}>
              {isAdmin && <Tag color="red">Quản trị viên</Tag>}
              <Tag color="green">{data.status}</Tag>
              <Tag color="blue">{data.employeeCode}</Tag>
            </div>
          </div>
        </div>
      </Card>

      <Row gutter={[16, 16]}>
        {/* Thông tin cá nhân */}
        <Col xs={24} lg={12}>
          <Card
            title={<span><UserOutlined style={{ marginRight: 8 }} />Thông tin cá nhân</span>}
            size="small"
            extra={<Button type="text" size="small" icon={<EditOutlined />} onClick={() => setIsEditModalOpen(true)}>Sửa</Button>}
          >
            <Descriptions column={1} size="small" labelStyle={{ fontWeight: 600, width: 140 }}>
              <Descriptions.Item label={<span><MailOutlined /> Email</span>}>{data.email}</Descriptions.Item>
              <Descriptions.Item label={<span><PhoneOutlined /> Số điện thoại</span>}>{data.phone}</Descriptions.Item>
              <Descriptions.Item label="Ngày sinh">{dayjs(data.dob).format("DD/MM/YYYY")}</Descriptions.Item>
              <Descriptions.Item label="Giới tính">{data.gender === 'male' ? 'Nam' : data.gender === 'female' ? 'Nữ' : 'Khác'}</Descriptions.Item>
              <Descriptions.Item label="CCCD/Hộ chiếu">{data.identityCard}</Descriptions.Item>
              <Descriptions.Item label="Mã số thuế">{data.taxCode}</Descriptions.Item>
              <Descriptions.Item label="Số người phụ thuộc">{data.dependents}</Descriptions.Item>
              <Descriptions.Item label="Tài khoản">{data.bankAccount} ({data.bankName})</Descriptions.Item>
              <Descriptions.Item label="Địa chỉ">{data.address}</Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>

        {/* Thông tin công tác */}
        <Col xs={24} lg={12}>
          <Card
            title={<span><BankOutlined style={{ marginRight: 8 }} />Thông tin công tác</span>}
            size="small"
          >
            <Descriptions column={1} size="small" labelStyle={{ fontWeight: 600, width: 140 }}>
              <Descriptions.Item label="Mã nhân viên"><Tag color={isAdmin ? "red" : "blue"}>{data.employeeCode}</Tag></Descriptions.Item>
              <Descriptions.Item label="Phòng ban">{data.department}</Descriptions.Item>
              <Descriptions.Item label="Chức vụ">{data.position}</Descriptions.Item>
              <Descriptions.Item label="Ngày bắt đầu">{dayjs(data.startDate).format("DD/MM/YYYY")}</Descriptions.Item>
              <Descriptions.Item label="Trạng thái"><Tag color="green">{data.status}</Tag></Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>

        {/* Hợp đồng & Lương */}
        <Col xs={24}>
          <Card
            title={<span><FileTextOutlined style={{ marginRight: 8 }} />Hợp đồng & Lương (Tham khảo)</span>}
            size="small"
          >
            <Descriptions column={{ xs: 1, sm: 2, md: 4 }} size="small" labelStyle={{ fontWeight: 600 }}>
              <Descriptions.Item label="Loại hợp đồng">{data.contractType}</Descriptions.Item>
              <Descriptions.Item label="Số hợp đồng"><Tag color="orange">{data.contractNumber}</Tag></Descriptions.Item>
              <Descriptions.Item label="Lương dự kiến"><span style={{ fontWeight: 700, color: "#ab3e40" }}>{formatSalary(data.baseSalary)}</span></Descriptions.Item>
              <Descriptions.Item label="Ngày vào">{dayjs(data.contractSignDate).format("DD/MM/YYYY")}</Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>
      </Row>

      {/* Modal Chỉnh sửa hồ sơ */}
      <Modal
        title="Chỉnh sửa hồ sơ cá nhân"
        open={isEditModalOpen}
        onCancel={() => setIsEditModalOpen(false)}
        footer={null}
        width={800}
        destroyOnClose
      >
        <ProfileForm 
          onlyPersonalInfo={true}
          initialValues={{
            ...data,
            dob: dayjs(data.dob),
          } as any} 
          onFinish={handleUpdateProfile}
          loading={loading}
          onCancel={() => setIsEditModalOpen(false)}
        />
      </Modal>

      {/* Modal Đổi mật khẩu */}
      <Modal
        title={<span><LockOutlined /> Đổi mật khẩu</span>}
        open={isPasswordModalOpen}
        onCancel={() => setIsPasswordModalOpen(false)}
        onOk={() => passForm.submit()}
        confirmLoading={loading}
        okText="Cập nhật mật khẩu"
        cancelText="Hủy"
        width={400}
      >
        <Form form={passForm} layout="vertical" onFinish={handleChangePassword} style={{ marginTop: 16 }}>
          <Form.Item name="oldPassword" label="Mật khẩu hiện tại" rules={[{ required: true, message: 'Nhập mật khẩu cũ' }]}>
            <Input.Password prefix={<LockOutlined />} />
          </Form.Item>
          <Form.Item name="newPassword" label="Mật khẩu mới" rules={[{ required: true, min: 6, message: 'Tối thiểu 6 ký tự' }]}>
            <Input.Password prefix={<LockOutlined />} />
          </Form.Item>
          <Form.Item name="confirmPassword" label="Xác nhận mật khẩu mới" rules={[{ required: true }]}>
            <Input.Password prefix={<LockOutlined />} />
          </Form.Item>
        </Form>
      </Modal>

      <ProfileDetailModal 
        open={isDetailModalOpen}
        onCancel={() => setIsDetailModalOpen(false)}
        data={data}
      />
    </div>
  );
}
