"use client";

import { Typography, Descriptions, Avatar, Tag, Row, Col, Card, Modal, message, Space } from "antd";
import { 
  UserOutlined, 
  EditOutlined, 
  PhoneOutlined, 
  MailOutlined, 
  BankOutlined, 
  FileTextOutlined, 
  InfoCircleOutlined 
} from "@ant-design/icons";
import { useState } from "react";
import dayjs from "dayjs";
import Button from "@/components/shared/Button/Button";
import ProfileForm, { ProfileFormValues } from "./ProfileForm";
import ProfileDetailModal from "./ProfileDetailModal";

const { Title, Text } = Typography;

interface ProfileViewProps {
  data: any;
  isAdmin?: boolean;
}

const formatSalary = (amount: number) =>
  amount.toLocaleString("vi-VN") + " đ";

export default function ProfileView({ data, isAdmin = false }: ProfileViewProps) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleUpdateProfile = (values: ProfileFormValues) => {
    setLoading(true);
    setTimeout(() => {
      console.log("Updated profile:", values);
      message.success("Cập nhật hồ sơ thành công!");
      setLoading(false);
      setIsEditModalOpen(false);
    }, 1000);
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
            icon={<InfoCircleOutlined />} 
            onClick={() => setIsDetailModalOpen(true)}
          >
            Xem chi tiết hồ sơ
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

      {/* Avatar + Tên Overview */}
      <Card style={{ marginBottom: 24 }}>
        <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
          <Avatar
            size={88}
            icon={<UserOutlined />}
            style={{ backgroundColor: data.avatarColor || "var(--primary-color)", flexShrink: 0, fontSize: 36 }}
          />
          <div>
            <Title level={3} style={{ margin: 0 }}>{data.fullName}</Title>
            <Text type="secondary">
              {data.position === 'SDEV' ? 'Senior Developer' : data.position} · {data.department === 'IT' ? 'Phòng Công nghệ' : data.department}
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
              <Descriptions.Item label={<span><MailOutlined /> Email</span>}>
                {data.email}
              </Descriptions.Item>
              <Descriptions.Item label={<span><PhoneOutlined /> Số điện thoại</span>}>
                {data.phone}
              </Descriptions.Item>
              <Descriptions.Item label="Ngày sinh">
                {dayjs(data.dob).format("DD/MM/YYYY")}
              </Descriptions.Item>
              <Descriptions.Item label="Giới tính">
                {data.gender === 'male' ? 'Nam' : data.gender === 'female' ? 'Nữ' : 'Khác'}
              </Descriptions.Item>
              <Descriptions.Item label="CCCD/Hộ chiếu">
                {data.identityCard}
              </Descriptions.Item>
              <Descriptions.Item label="Mã số thuế">
                {data.taxCode}
              </Descriptions.Item>
              <Descriptions.Item label="Số người phụ thuộc">
                {data.dependents}
              </Descriptions.Item>
              <Descriptions.Item label="Tài khoản ngân hàng">
                {data.bankAccount} ({data.bankName} - {data.bankBranch})
              </Descriptions.Item>
              <Descriptions.Item label="Địa chỉ" span={1}>
                {data.address}
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>

        {/* Thông tin công tác */}
        <Col xs={24} lg={12}>
          <Card
            title={<span><BankOutlined style={{ marginRight: 8 }} />Thông tin công tác</span>}
            size="small"
            extra={<Button type="text" size="small" icon={<InfoCircleOutlined />} onClick={() => setIsDetailModalOpen(true)}>Chi tiết</Button>}
          >
            <Descriptions column={1} size="small" labelStyle={{ fontWeight: 600, width: 140 }}>
              <Descriptions.Item label="Mã nhân viên">
                <Tag color={isAdmin ? "red" : "blue"}>{data.employeeCode}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Phòng ban">
                {data.department === 'IT' ? 'Phòng Công nghệ' : data.department}
              </Descriptions.Item>
              <Descriptions.Item label="Chức vụ">
                {data.position === 'SDEV' ? 'Senior Developer' : data.position}
              </Descriptions.Item>
              <Descriptions.Item label="Ngày bắt đầu">
                {dayjs(data.startDate).format("DD/MM/YYYY")}
              </Descriptions.Item>
              <Descriptions.Item label="Trạng thái">
                <Tag color="green">{data.status}</Tag>
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>

        {/* Hợp đồng & Lương */}
        <Col xs={24}>
          <Card
            title={<span><FileTextOutlined style={{ marginRight: 8 }} />Hợp đồng & Lương</span>}
            size="small"
            extra={<Button type="text" size="small" icon={<InfoCircleOutlined />} onClick={() => setIsDetailModalOpen(true)}>Chi tiết</Button>}
          >
            <Descriptions column={{ xs: 1, sm: 2, md: 4 }} size="small" labelStyle={{ fontWeight: 600 }}>
              <Descriptions.Item label="Loại hợp đồng">
                {data.contractType === '1year' ? 'Hợp đồng 1 năm' : data.contractType === 'indefinite' ? 'Không thời hạn' : data.contractType}
              </Descriptions.Item>
              <Descriptions.Item label="Số hợp đồng">
                <Tag color="orange">{data.contractNumber}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Lương cơ bản">
                <span style={{ fontWeight: 700, color: "var(--primary-color)" }}>
                  {formatSalary(data.baseSalary)}
                </span>
              </Descriptions.Item>
              <Descriptions.Item label="Ngày ký hợp đồng">
                {dayjs(data.contractSignDate).format("DD/MM/YYYY")}
              </Descriptions.Item>
              <Descriptions.Item label="Ngày hết hạn">
                {data.contractExpiredDate ? dayjs(data.contractExpiredDate).format("DD/MM/YYYY") : "-"}
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>
      </Row>

      {/* Modals */}
      <Modal
        title={`Chỉnh sửa hồ sơ cá nhân ${isAdmin ? "(Admin)" : ""}`}
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
            startDate: dayjs(data.startDate),
            contractSignDate: dayjs(data.contractSignDate),
            contractExpiredDate: data.contractExpiredDate ? dayjs(data.contractExpiredDate) : undefined,
          } as any} 
          onFinish={handleUpdateProfile}
          loading={loading}
          onCancel={() => setIsEditModalOpen(false)}
        />
      </Modal>

      <ProfileDetailModal 
        open={isDetailModalOpen}
        onCancel={() => setIsDetailModalOpen(false)}
        data={data}
      />
    </div>
  );
}
