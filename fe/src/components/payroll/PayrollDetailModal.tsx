"use client";

import React from "react";
import { Modal, Descriptions, Divider, Tag, Typography, Space, Row, Col, Card } from "antd";
import { PhieuLuong } from "@/types/payroll";
import { DollarOutlined, SafetyCertificateOutlined, ExceptionOutlined } from "@ant-design/icons";
import { useAuthStore } from "@/store/authStore";

const { Title, Text } = Typography;

interface PayrollDetailModalProps {
  visible: boolean;
  onClose: () => void;
  data: PhieuLuong | null;
}

const fmt = (n: number | undefined) => (n || 0).toLocaleString("vi-VN") + " đ";

const PayrollDetailModal: React.FC<PayrollDetailModalProps> = ({ visible, onClose, data }) => {
  const { user } = useAuthStore();

  if (!data) return null;

  return (
    <Modal
      title={
        <Space>
          <DollarOutlined style={{ color: "var(--primary-color)" }} />
          <span>Chi tiết phiếu lương - Tháng {data.Thang}/{data.Nam}</span>
        </Space>
      }
      open={visible}
      onCancel={onClose}
      footer={null}
      width={800}
      centered
    >
      <div className="py-4">
        <Descriptions bordered column={2} size="small">
          <Descriptions.Item label="Mã nhân viên">{data.nhanVien?.MaNhanVien || user?.maNhanVien || "N/A"}</Descriptions.Item>
          <Descriptions.Item label="Họ và tên">{data.nhanVien?.HoTen || user?.hoTen || "N/A"}</Descriptions.Item>
          <Descriptions.Item label="Số ngày công chuẩn">{data.SoNgayCongChuan} ngày</Descriptions.Item>
          <Descriptions.Item label="Số ngày công thực tế">{data.SoNgayCongThucTe} ngày</Descriptions.Item>
          <Descriptions.Item label="Số giờ làm thêm">{data.SoGioLamThem} giờ</Descriptions.Item>
          <Descriptions.Item label="Trạng thái">
            <Tag color={data.TrangThai === "Paid" ? "green" : "orange"}>
              {data.TrangThai === "Paid" ? "Đã thanh toán" : "Chờ xử lý"}
            </Tag>
          </Descriptions.Item>
        </Descriptions>

        <Divider orientation={"left" as any}>
          <Space>
            <DollarOutlined />
            <Text strong>Các khoản thu nhập</Text>
          </Space>
        </Divider>

        <Row gutter={16}>
          <Col span={12}>
            <div className="flex justify-between mb-2">
              <Text>Lương cơ bản:</Text>
              <Text strong>{fmt(data.LuongCoBan)}</Text>
            </div>
            <div className="flex justify-between mb-2">
              <Text>Phụ cấp:</Text>
              <Text strong>{fmt(data.PhuCap)}</Text>
            </div>
            <div className="flex justify-between mb-2">
              <Text>Tiền làm thêm (OT):</Text>
              <Text strong>{fmt(data.TienLamThem)}</Text>
            </div>
          </Col>
          <Col span={12}>
            <Card size="small" className="bg-blue-50 border-blue-100">
              <div className="flex justify-between">
                <Text strong>Tổng thu nhập (Gross):</Text>
                <Title level={5} className="m-0 text-blue-600">{fmt(data.TongLuongGop)}</Title>
              </div>
            </Card>
          </Col>
        </Row>

        <Divider orientation={"left" as any}>
          <Space>
            <SafetyCertificateOutlined />
            <Text strong>Các khoản khấu trừ & Bảo hiểm</Text>
          </Space>
        </Divider>

        <Row gutter={16}>
          <Col span={12}>
            <div className="flex justify-between mb-2">
              <Text>BH Xã hội (8%):</Text>
              <Text type="danger">{fmt(data.BaoHiemXaHoi)}</Text>
            </div>
            <div className="flex justify-between mb-2">
              <Text>BH Y tế (1.5%):</Text>
              <Text type="danger">{fmt(data.BaoHiemYTe)}</Text>
            </div>
            <div className="flex justify-between mb-2">
              <Text>BH Thất nghiệp (1%):</Text>
              <Text type="danger">{fmt(data.BaoHiemThatNghiep)}</Text>
            </div>
          </Col>
          <Col span={12}>
            <div className="flex justify-between mb-2">
              <Text>Thuế TNCN:</Text>
              <Text type="danger">{fmt(data.ThueTNCN)}</Text>
            </div>
            <div className="flex justify-between mb-2">
              <Text>Khấu trừ đi muộn:</Text>
              <Text type="danger">{fmt(data.KhauTruDiMuon)}</Text>
            </div>
            <div className="flex justify-between mb-2">
              <Text>Khấu trừ khác:</Text>
              <Text type="danger">{fmt(data.CacKhoanKhauTruKhac)}</Text>
            </div>
          </Col>
        </Row>

        <Divider />

        <Card size="small" className="bg-green-50 border-green-200">
          <div className="flex justify-between items-center">
            <Title level={4} className="m-0">LƯƠNG THỰC NHẬN (NET):</Title>
            <Title level={3} className="m-0 text-green-600">{fmt(data.LuongThucNhan)}</Title>
          </div>
        </Card>

        {data.GhiChu && (
          <div className="mt-4">
            <Text italic type="secondary">Ghi chú: {data.GhiChu}</Text>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default PayrollDetailModal;
