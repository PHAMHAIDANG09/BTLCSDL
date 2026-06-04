"use client";

import React, { useState, useEffect } from "react";
import {
  Typography, Tag, Button, message, Spin, Badge, Space,
  Modal, Form, DatePicker, Input, Select, InputNumber, Row, Col, Tooltip,
} from "antd";
import {
  PlusOutlined, CalendarOutlined,
} from "@ant-design/icons";
import Table from "@/components/shared/Table/Table";
import type { TableColumnsType } from "antd";
import { LeaveService } from "@/services/leave.service";
import dayjs from "dayjs";

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;
const { TextArea } = Input;

/* ------------------------------------------------------------------ */
/* Badge trạng thái                                                     */
/* ------------------------------------------------------------------ */
const getStatusBadge = (status: string) => {
  switch (status) {
    case "Pending":
      return <Badge status="warning" text={<Text type="warning" strong>Chờ duyệt</Text>} />;
    case "Approved":
      return <Badge status="success" text={<Text type="success" strong>Đã duyệt</Text>} />;
    case "Rejected":
      return <Badge status="error" text={<Text type="danger" strong>Từ chối</Text>} />;
    default:
      return <Badge status="default" text={status} />;
  }
};

/* ================================================================== */
/* Page                                                                 */
/* ================================================================== */
export default function StaffLeavePage() {
  const [leaveForm] = Form.useForm();
  const [leaveRequests, setLeaveRequests] = useState<any[]>([]);
  const [leaveTypes, setLeaveTypes] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetchingTypes, setFetchingTypes] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchData();
    fetchLeaveTypes();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const leaves = await LeaveService.getLeaveHistory();
      setLeaveRequests(leaves || []);
    } catch (err) {
      console.error(err);
      message.error("Lỗi khi tải danh sách đơn nghỉ phép");
    } finally {
      setLoading(false);
    }
  };

  const fetchLeaveTypes = async () => {
    try {
      const types = await LeaveService.getLeaveTypes();
      setLeaveTypes(types || []);
    } catch (err) {
      console.error(err);
    } finally {
      setFetchingTypes(false);
    }
  };

  /* ---------- Submit ---------- */
  const handleSubmitLeave = async (values: any) => {
    setSubmitting(true);
    try {
      const [start, end] = values.dateRange;
      await LeaveService.applyLeave({
        MaLoaiPhepId: values.MaLoaiPhepId,
        NgayBatDau:   start.format("YYYY-MM-DD"),
        NgayKetThuc:  end.format("YYYY-MM-DD"),
        TongSoNgay:   values.TongSoNgay,
        LyDo:         values.LyDo,
      });
      message.success("Đã gửi đơn xin nghỉ phép thành công!");
      leaveForm.resetFields();
      setModalOpen(false);
      fetchData();
    } catch (err: any) {
      message.error(err?.message || "Không thể gửi đơn, vui lòng thử lại.");
    } finally {
      setSubmitting(false);
    }
  };

  /* ---------- Tự tính TongSoNgay ---------- */
  const handleDateRangeChange = (dates: any) => {
    if (dates && dates.length === 2) {
      const diff = dates[1].diff(dates[0], "day") + 1;
      leaveForm.setFieldsValue({ TongSoNgay: diff });
    } else {
      leaveForm.setFieldsValue({ TongSoNgay: null });
    }
  };

  /* ---------- Columns ---------- */
  const columns: TableColumnsType<any> = [
    {
      title: "Loại phép",
      dataIndex: "loaiNghiPhep",
      key: "type",
      width: 160,
      render: (item: any) => (
        <Tag color="blue" bordered={false} className="px-2 py-1">
          {item?.TenLoaiPhep || "Khác"}
        </Tag>
      ),
    },
    {
      title: "Thời gian nghỉ",
      key: "time",
      render: (_, r) => (
        <Space direction="vertical" size={0}>
          <Text>
            <CalendarOutlined style={{ color: "#8c8c8c", marginRight: 8 }} />
            {dayjs(r.NgayBatDau).format("DD/MM/YYYY")} – {dayjs(r.NgayKetThuc).format("DD/MM/YYYY")}
          </Text>
          <Text style={{ color: "#1890ff", fontSize: 12, fontWeight: 500 }}>
            Tổng cộng: {r.TongSoNgay} ngày
          </Text>
        </Space>
      ),
    },
    {
      title: "Lý do xin nghỉ",
      dataIndex: "LyDo",
      key: "reason",
      render: (text: string) => (
        <Text className="italic text-gray-600">{text}</Text>
      ),
    },
    {
      title: "Ngày tạo",
      dataIndex: "NgayTao",
      key: "NgayTao",
      width: 155,
      render: (d: string) =>
        d ? (
          <Tooltip title={dayjs(d).format("DD/MM/YYYY HH:mm:ss")}>
            <Text type="secondary" style={{ fontSize: 12 }}>
              {dayjs(d).format("DD/MM/YYYY")}
              <br />
              <span style={{ color: "#1677ff" }}>{dayjs(d).format("HH:mm")}</span>
            </Text>
          </Tooltip>
        ) : "—",
      sorter: (a: any, b: any) =>
        new Date(a.NgayTao).getTime() - new Date(b.NgayTao).getTime(),
      defaultSortOrder: "descend" as const,
    },
    {
      title: "Trạng thái",
      key: "status",
      width: 160,
      render: (_, r) => (
        <div>
          {getStatusBadge(r.TrangThai)}
          {r.TrangThai === "Rejected" && r.LyDoTuChoi && (
            <div
              className="text-xs text-red-500 mt-1 truncate max-w-[150px]"
              title={r.LyDoTuChoi}
            >
              Lý do: {r.LyDoTuChoi}
            </div>
          )}
        </div>
      ),
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
      <div className="flex justify-between items-start mb-6">
        <div>
          <Title level={2} style={{ margin: 0 }}>
            <CalendarOutlined style={{ marginRight: 10, color: "#1677ff" }} />
            Nghỉ Phép
          </Title>
          <Text type="secondary">
            Quản lý và theo dõi trạng thái các đơn xin nghỉ phép
          </Text>
        </div>
        <Button
          type="primary"
          size="large"
          icon={<PlusOutlined />}
          className="shadow-sm"
          onClick={() => setModalOpen(true)}
        >
          Tạo đơn nghỉ
        </Button>
      </div>

      {/* Bảng danh sách */}
      <div className="bg-white p-5 rounded-xl shadow-sm">
        <Spin spinning={loading}>
          <Table
            columns={columns}
            dataSource={leaveRequests}
            rowKey="Id"
            searchable={false}
            totalText="đơn"
            locale={{ emptyText: "Chưa có đơn xin phép nào" }}
          />
        </Spin>
      </div>

      {/* Modal tạo đơn */}
      <Modal
        title={
          <span style={{ fontWeight: 700, fontSize: 18 }}>
            <CalendarOutlined style={{ marginRight: 8, color: "#1677ff" }} />
            Tạo Đơn Xin Nghỉ Phép
          </span>
        }
        open={modalOpen}
        onCancel={() => { setModalOpen(false); leaveForm.resetFields(); }}
        footer={null}
        width={640}
        centered
        destroyOnClose
      >
        <Form
          form={leaveForm}
          layout="vertical"
          onFinish={handleSubmitLeave}
          initialValues={{ TongSoNgay: 1 }}
          className="mt-4"
        >
          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item
                name="MaLoaiPhepId"
                label="Loại nghỉ phép"
                rules={[{ required: true, message: "Vui lòng chọn loại phép" }]}
              >
                <Select
                  placeholder="Chọn loại phép"
                  loading={fetchingTypes}
                  options={leaveTypes.map((t) => ({
                    value: t.Id,
                    label: t.TenLoaiPhep,
                  }))}
                />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item
                name="dateRange"
                label="Thời gian nghỉ"
                rules={[{ required: true, message: "Vui lòng chọn thời gian" }]}
              >
                <RangePicker
                  style={{ width: "100%" }}
                  format="DD/MM/YYYY"
                  onChange={handleDateRangeChange}
                />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item
                name="TongSoNgay"
                label="Tổng số ngày nghỉ"
                rules={[{ required: true, message: "Nhập số ngày" }]}
              >
                <InputNumber min={0.5} step={0.5} style={{ width: "100%" }} addonAfter="ngày" />
              </Form.Item>
            </Col>

            <Col xs={24}>
              <Form.Item
                name="LyDo"
                label="Lý do nghỉ"
                rules={[{ required: true, message: "Vui lòng nhập lý do" }]}
              >
                <TextArea rows={3} placeholder="Nhập lý do xin nghỉ chi tiết..." />
              </Form.Item>
            </Col>
          </Row>

          <div className="flex justify-end gap-2 mt-2">
            <Button onClick={() => { setModalOpen(false); leaveForm.resetFields(); }}>
              Hủy
            </Button>
            <Button type="primary" htmlType="submit" loading={submitting}>
              Gửi đơn nghỉ
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
}
