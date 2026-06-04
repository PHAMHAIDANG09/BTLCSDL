"use client";

import React, { useState, useEffect } from "react";
import {
  Typography, Tag, Button, message, Spin, Badge, Space,
  Modal, Form, DatePicker, Input, InputNumber, Row, Col, Tooltip,
  theme,
} from "antd";
import {
  PlusOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  HistoryOutlined,
} from "@ant-design/icons";
import Table from "@/components/shared/Table/Table";
import type { TableColumnsType } from "antd";
import { AttendanceService } from "@/services/attendance.service";
import dayjs from "dayjs";

const { Title, Text } = Typography;
const { TextArea } = Input;

/* ------------------------------------------------------------------ */
/* Badge trạng thái                                                     */
/* ------------------------------------------------------------------ */
const getStatusBadge = (status: string) => {
  switch (status) {
    case "Pending":
      return <Tag color="warning" style={{ margin: 0, fontWeight: 600 }}>Chờ duyệt</Tag>;
    case "Approved":
      return <Tag color="success" style={{ margin: 0, fontWeight: 600 }}>Đã duyệt</Tag>;
    case "Rejected":
      return <Tag color="error" style={{ margin: 0, fontWeight: 600 }}>Từ chối</Tag>;
    default:
      return <Tag color="default" style={{ margin: 0, fontWeight: 600 }}>{status}</Tag>;
  }
};

/* ------------------------------------------------------------------ */
/* Tag phân loại OT                                                     */
/* ------------------------------------------------------------------ */
const getLoaiOTTag = (loai: string) => {
  const map: Record<string, { color: string; label: string }> = {
    NgayThuong: { color: "default", label: "Ngày thường" },
    CuoiTuan:   { color: "orange",  label: "Cuối tuần"   },
    NgayLe:     { color: "red",     label: "Ngày lễ"     },
  };
  const cfg = map[loai] || { color: "default", label: loai };
  return <Tag color={cfg.color} bordered={false}>{cfg.label}</Tag>;
};

/* ================================================================== */
/* Page                                                                 */
/* ================================================================== */
export default function StaffOvertimePage() {
  const { token } = theme.useToken();
  const [otForm] = Form.useForm();
  const [otRequests, setOtRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const ots = await AttendanceService.getOTHistory();
      setOtRequests(ots || []);
    } catch (err) {
      console.error(err);
      message.error("Lỗi khi tải danh sách đơn làm thêm giờ");
    } finally {
      setLoading(false);
    }
  };

  /* ---------- Submit đơn OT ---------- */
  const handleSubmitOT = async (values: any) => {
    setSubmitting(true);
    try {
      await AttendanceService.registerOT({
        NgayLamThem: values.NgayLamThem.format("YYYY-MM-DD"),
        GioBatDau:   values.GioBatDau.format("HH:mm"),
        GioKetThuc:  values.GioKetThuc.format("HH:mm"),
        TongSoGio:   values.TongSoGio,
        LyDo:        values.LyDo,
        // LoaiOT không gửi — backend tự tính từ ngày
      });
      message.success("Đã gửi đơn đăng ký làm thêm giờ thành công!");
      otForm.resetFields();
      setModalOpen(false);
      fetchData();
    } catch (err: any) {
      message.error(err?.message || "Không thể gửi đơn, vui lòng thử lại.");
    } finally {
      setSubmitting(false);
    }
  };

  /* ---------- Tự tính TongSoGio khi chọn giờ ---------- */
  const handleTimeChange = () => {
    const start = otForm.getFieldValue("GioBatDau");
    const end   = otForm.getFieldValue("GioKetThuc");
    if (start && end) {
      const diff = end.diff(start, "minute") / 60;
      otForm.setFieldsValue({ TongSoGio: diff > 0 ? parseFloat(diff.toFixed(2)) : 0 });
    }
  };

  /* ---------- Columns ---------- */
  const columns: TableColumnsType<any> = [
    {
      title: "Ngày làm thêm",
      key: "NgayLamThem",
      width: 160,
      render: (_, r) => (
        <Space direction="vertical" size={0}>
          <Text strong>
            <CalendarOutlined style={{ color: token.colorTextDescription, marginRight: 6 }} />
            {dayjs(r.NgayLamThem).format("DD/MM/YYYY")}
          </Text>
          <Text type="secondary" style={{ fontSize: 12 }}>
            <ClockCircleOutlined style={{ marginRight: 4 }} />
            {r.GioBatDau} – {r.GioKetThuc}
          </Text>
        </Space>
      ),
      sorter: (a: any, b: any) =>
        new Date(a.NgayLamThem).getTime() - new Date(b.NgayLamThem).getTime(),
    },
    {
      title: "Số giờ",
      dataIndex: "TongSoGio",
      key: "TongSoGio",
      width: 100,
      align: "center" as const,
      render: (h: number) => (
        <Tag color="blue" bordered={false} style={{ fontWeight: 600 }}>
          {h}h
        </Tag>
      ),
    },
    {
      title: "Phân loại",
      dataIndex: "LoaiOT",
      key: "LoaiOT",
      width: 130,
      render: (l: string) => getLoaiOTTag(l),
    },
    {
      title: "Hệ số OT",
      dataIndex: "HeSoOT",
      key: "HeSoOT",
      width: 100,
      align: "center" as const,
      render: (h: number) => (
        <Text style={{ color: token.colorWarning, fontWeight: 600 }}>×{h}</Text>
      ),
    },
    {
      title: "Công việc thực hiện",
      dataIndex: "LyDo",
      key: "LyDo",
      width: 280,
      render: (text: string) => (
        <div className="whitespace-normal break-words">
          <Text className="text-gray-600 italic">{text || "—"}</Text>
        </div>
      ),
    },
    {
      title: "Ngày tạo",
      dataIndex: "NgayTao",
      key: "NgayTao",
      width: 140,
      render: (d: string) =>
        d ? (
          <Tooltip title={dayjs(d).format("DD/MM/YYYY HH:mm:ss")}>
            <Text type="secondary" style={{ fontSize: 12 }}>
              {dayjs(d).format("DD/MM/YYYY")}
              <br />
              <span style={{ color: token.colorInfo }}>{dayjs(d).format("HH:mm")}</span>
            </Text>
          </Tooltip>
        ) : "—",
      sorter: (a: any, b: any) =>
        new Date(a.NgayTao).getTime() - new Date(b.NgayTao).getTime(),
    },
    {
      title: "Trạng thái",
      key: "status",
      width: 140,
      render: (_, r) => getStatusBadge(r.TrangThai),
      filters: [
        { text: "Chờ duyệt", value: "Pending"  },
        { text: "Đã duyệt",  value: "Approved" },
        { text: "Từ chối",   value: "Rejected" },
      ],
      onFilter: (value: any, r: any) => r.TrangThai === value,
    },
  ];

  /* ─────────────────── RENDER ─────────────────── */
  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-start mb-10">
        <div>
          <Title level={2} style={{ margin: 0 }}>
            Làm Thêm Giờ
          </Title>
          <Text type="secondary">
            Đăng ký và theo dõi lịch sử làm thêm giờ của bạn
          </Text>
        </div>
        <Button
          type="primary"
          size="large"
          icon={<PlusOutlined />}
          className="shadow-sm"
          onClick={() => setModalOpen(true)}
          style={{ background: token.colorWarning, borderColor: token.colorWarning }}
        >
          Đăng ký OT
        </Button>
      </div>

      {/* Bảng danh sách */}
      <div className="bg-white p-5 rounded-xl shadow-sm">
        <Spin spinning={loading}>
          <Table
            columns={columns}
            dataSource={otRequests}
            rowKey="Id"
            searchable={false}
            noScroll={true}
            totalText="đơn OT"
            locale={{ emptyText: "Chưa có đơn làm thêm giờ nào" }}
          />
        </Spin>
      </div>

      {/* Modal đăng ký OT */}
      <Modal
        title={
          <span style={{ fontWeight: 700, fontSize: 18 }}>
            <HistoryOutlined style={{ marginRight: 8, color: token.colorWarning }} />
            Đăng Ký Làm Thêm Giờ
          </span>
        }
        open={modalOpen}
        onCancel={() => { setModalOpen(false); otForm.resetFields(); }}
        footer={null}
        width={620}
        centered
        destroyOnClose
      >
        <Form
          form={otForm}
          layout="vertical"
          onFinish={handleSubmitOT}
          className="mt-4"
        >
          <Row gutter={16}>
            {/* Ngày làm thêm */}
            <Col xs={24} md={12}>
              <Form.Item
                name="NgayLamThem"
                label="Ngày làm thêm"
                rules={[{ required: true, message: "Vui lòng chọn ngày" }]}
              >
                <DatePicker style={{ width: "100%" }} format="DD/MM/YYYY" />
              </Form.Item>
            </Col>

            {/* Loại OT - tự động */}
            <Col xs={24} md={12}>
              <Form.Item label="Phân loại OT">
                <span style={{ color: token.colorTextDescription, fontSize: 13 }}>
                  🤖 Hệ thống tự xác định dựa theo ngày
                  <br />
                  <span style={{ fontSize: 11 }}>
                    (Ngày thường / Cuối tuần / Ngày lễ)
                  </span>
                </span>
              </Form.Item>
            </Col>

            {/* Giờ bắt đầu */}
            <Col xs={24} md={8}>
              <Form.Item
                name="GioBatDau"
                label="Giờ bắt đầu"
                rules={[{ required: true, message: "Chọn giờ bắt đầu" }]}
              >
                <DatePicker.TimePicker
                  format="HH:mm"
                  style={{ width: "100%" }}
                  minuteStep={15}
                  onChange={handleTimeChange}
                />
              </Form.Item>
            </Col>

            {/* Giờ kết thúc */}
            <Col xs={24} md={8}>
              <Form.Item
                name="GioKetThuc"
                label="Giờ kết thúc"
                rules={[{ required: true, message: "Chọn giờ kết thúc" }]}
              >
                <DatePicker.TimePicker
                  format="HH:mm"
                  style={{ width: "100%" }}
                  minuteStep={15}
                  onChange={handleTimeChange}
                />
              </Form.Item>
            </Col>

            {/* Tổng số giờ */}
            <Col xs={24} md={8}>
              <Form.Item
                name="TongSoGio"
                label="Tổng số giờ"
                rules={[{ required: true, message: "Nhập số giờ" }]}
              >
                <InputNumber
                  min={0.5}
                  step={0.5}
                  style={{ width: "100%" }}
                  addonAfter="giờ"
                />
              </Form.Item>
            </Col>

            {/* Công việc */}
            <Col xs={24}>
              <Form.Item
                name="LyDo"
                label="Công việc thực hiện"
                rules={[{ required: true, message: "Vui lòng mô tả công việc" }]}
              >
                <TextArea
                  rows={3}
                  placeholder="Mô tả chi tiết công việc sẽ thực hiện trong thời gian làm thêm..."
                />
              </Form.Item>
            </Col>
          </Row>

          <div className="flex justify-end gap-2 mt-2">
            <Button onClick={() => { setModalOpen(false); otForm.resetFields(); }}>
              Hủy
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={submitting}
              style={{ background: token.colorWarning, borderColor: token.colorWarning }}
            >
              Gửi đơn OT
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
}
