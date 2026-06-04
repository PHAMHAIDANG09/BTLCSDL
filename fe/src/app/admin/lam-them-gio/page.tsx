"use client";

import React, { useState, useEffect } from "react";
import {
  Typography, Button, Tag, Space, Modal, Input,
  message, Spin, Popconfirm, Avatar, Segmented, Badge, Tooltip,
} from "antd";
import {
  CheckOutlined, CloseOutlined, UserOutlined,
  CalendarOutlined, HistoryOutlined, SearchOutlined,
} from "@ant-design/icons";
import Table from "@/components/shared/Table/Table";
import type { TableColumnsType } from "antd";
import { AttendanceService } from "@/services/attendance.service";
import dayjs from "dayjs";

const { Title, Text } = Typography;
const { TextArea } = Input;

/* ------------------------------------------------------------------ */
/* Helpers                                                              */
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

const getLoaiOTTag = (l: string) => {
  const map: Record<string, { color: string; label: string }> = {
    NgayThuong: { color: "default", label: "Ngày thường" },
    CuoiTuan:   { color: "orange",  label: "Cuối tuần"   },
    NgayLe:     { color: "red",     label: "Ngày lễ"     },
  };
  const cfg = map[l] || { color: "default", label: l };
  return <Tag color={cfg.color} bordered={false}>{cfg.label}</Tag>;
};

const employeeRender = (nv: any) => (
  <Space>
    <Avatar icon={<UserOutlined />} className="bg-orange-100 text-orange-600" />
    <span className="font-semibold text-gray-800">{nv?.HoTen}</span>
  </Space>
);

/* ================================================================== */
/* Page                                                                 */
/* ================================================================== */
export default function AdminOvertimePage() {
  const [otRequests, setOtRequests] = useState<any[]>([]);
  const [loading, setLoading]       = useState(false);
  const [viewMode, setViewMode]     = useState<"pending" | "history">("pending");

  // Reject modal
  const [rejectVisible, setRejectVisible] = useState(false);
  const [rejectId, setRejectId]           = useState<number | null>(null);
  const [rejectReason, setRejectReason]   = useState("");
  const [submitting, setSubmitting]       = useState(false);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const ots = await AttendanceService.getAllOTRequests();
      setOtRequests(ots || []);
    } catch (err) {
      console.error(err);
      message.error("Lỗi khi tải danh sách đơn làm thêm giờ");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: number) => {
    setLoading(true);
    try {
      await AttendanceService.approveOT(id, "Approved");
      message.success("Đã phê duyệt đơn OT thành công!");
      fetchData();
    } catch (err) {
      message.error("Lỗi khi duyệt đơn");
    } finally {
      setLoading(false);
    }
  };

  const openRejectModal = (id: number) => {
    setRejectId(id);
    setRejectReason("");
    setRejectVisible(true);
  };

  const handleRejectConfirm = async () => {
    if (!rejectReason.trim()) {
      message.warning("Vui lòng nhập lý do từ chối");
      return;
    }
    setSubmitting(true);
    try {
      await AttendanceService.approveOT(rejectId!, "Rejected");
      message.success("Đã từ chối đơn OT thành công!");
      setRejectVisible(false);
      fetchData();
    } catch (err) {
      message.error("Lỗi khi từ chối đơn");
    } finally {
      setSubmitting(false);
    }
  };

  /* ---------- Search filter helper ---------- */
  const getColumnSearchProps = (dataIndex: string, placeholder: string) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }: any) => (
      <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
        <Input
          placeholder={placeholder}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => confirm()}
          style={{ marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => confirm()}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Tìm
          </Button>
          <Button
            onClick={() => {
              clearFilters?.();
              confirm();
            }}
            size="small"
            style={{ width: 90 }}
          >
            Reset
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered: boolean) => (
      <SearchOutlined style={{ color: filtered ? '#1677ff' : undefined }} />
    ),
    onFilter: (value: any, record: any) => {
      const searchVal = String(value).toLowerCase();
      if (dataIndex === 'employee_name') {
        return record.nhanVien?.HoTen?.toLowerCase().includes(searchVal);
      }
      if (dataIndex === 'employee_code') {
        return record.nhanVien?.MaNhanVien?.toLowerCase().includes(searchVal);
      }
      return false;
    },
  });

  /* ---------- Columns ---------- */
  const baseColumns: TableColumnsType<any> = [
    {
      title: "Nhân viên",
      dataIndex: "nhanVien",
      key: "employee",
      width: 170,
      ...getColumnSearchProps('employee_name', 'Tìm tên...'),
      render: employeeRender,
    },
    {
      title: "Mã nhân viên",
      dataIndex: "nhanVien",
      key: "employeeCode",
      width: 130,
      ...getColumnSearchProps('employee_code', 'Tìm mã...'),
      render: (nv: any) => <Text className="font-mono text-gray-600">{nv?.MaNhanVien}</Text>,
    },
    {
      title: "Ngày làm thêm",
      key: "NgayLamThem",
      width: 140,
      render: (_, r) => (
        <Space direction="vertical" size={0}>
          <Text strong>
            <CalendarOutlined style={{ color: "#8c8c8c", marginRight: 6 }} />
            {dayjs(r.NgayLamThem).format("DD/MM/YYYY")}
          </Text>
          <Text type="secondary" style={{ fontSize: 12 }}>
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
      width: 110,
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
      width: 120,
      render: (l: string) => getLoaiOTTag(l),
      filters: [
        { text: "Ngày thường", value: "NgayThuong" },
        { text: "Cuối tuần",   value: "CuoiTuan"   },
        { text: "Ngày lễ",     value: "NgayLe"     },
      ],
      onFilter: (value: any, r: any) => r.LoaiOT === value,
    },
    {
      title: "Hệ số OT",
      dataIndex: "HeSoOT",
      key: "HeSoOT",
      width: 90,
      align: "center" as const,
      render: (h: number) => (
        <Text style={{ color: "#fa8c16", fontWeight: 700 }}>×{h}</Text>
      ),
    },
    {
      title: "Công việc",
      dataIndex: "LyDo",
      key: "LyDo",
      width: 220,
      render: (text: string) => (
        <div className="whitespace-normal break-words">
          <Text className="italic text-gray-600">{text || "—"}</Text>
        </div>
      ),
    },
    {
      title: "Ngày tạo",
      dataIndex: "NgayTao",
      key: "NgayTao",
      width: 130,
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
    },
  ];

  const getColumns = (): TableColumnsType<any> => {
    if (viewMode === "pending") {
      return [
        ...baseColumns,
        {
          title: "Thao tác",
          key: "action",
          width: 160,
          render: (_, record) => (
            <Space size="small">
              <Popconfirm
                title="Xác nhận duyệt đơn OT này?"
                onConfirm={() => handleApprove(record.Id)}
                okText="Duyệt"
                cancelText="Hủy"
              >
                <Button
                  type="primary"
                  size="small"
                  icon={<CheckOutlined />}
                  style={{ background: "#52c41a", borderColor: "#52c41a" }}
                >
                  Duyệt
                </Button>
              </Popconfirm>
              <Button
                danger
                size="small"
                icon={<CloseOutlined />}
                onClick={() => openRejectModal(record.Id)}
              >
                Từ chối
              </Button>
            </Space>
          ),
        },
      ];
    }
    return [
      ...baseColumns,
      {
        title: "Thời gian duyệt",
        dataIndex: "NgayDuyet",
        key: "approvalTime",
        width: 140,
        render: (d: string) =>
          d ? (
            <Tooltip title={dayjs(d).format("DD/MM/YYYY HH:mm:ss")}>
              <Text type="secondary" style={{ fontSize: 12 }}>
                {dayjs(d).format("DD/MM/YYYY")}
                <br />
                <span style={{ color: "#fa8c16" }}>{dayjs(d).format("HH:mm")}</span>
              </Text>
            </Tooltip>
          ) : "—",
        sorter: (a: any, b: any) =>
          a.NgayDuyet && b.NgayDuyet
            ? new Date(a.NgayDuyet).getTime() - new Date(b.NgayDuyet).getTime()
            : 0,
      },
      {
        title: "Trạng thái",
        key: "status",
        width: 140,
        render: (_, r) => getStatusBadge(r.TrangThai),
        filters: [
          { text: "Đã duyệt", value: "Approved" },
          { text: "Từ chối",  value: "Rejected" },
        ],
        onFilter: (value: any, r: any) => r.TrangThai === value,
      },
    ];
  };

  const pendingOTs = otRequests.filter((r) => r.TrangThai === "Pending");
  const historyOTs = otRequests.filter((r) => r.TrangThai !== "Pending");
  const displayData = viewMode === "pending" ? pendingOTs : historyOTs;

  /* ─────────── RENDER ─────────── */
  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-10">
        <div>
          <Title level={2} style={{ margin: 0 }}>
            Quản Lý Làm Thêm Giờ
          </Title>
          <Text type="secondary">
            Xem xét và phê duyệt đơn đăng ký làm thêm giờ của nhân viên
          </Text>
        </div>
        <Segmented
          options={[
            {
              label: (
                <span>
                  Chờ xử lý
                  {pendingOTs.length > 0 && (
                    <Badge
                      count={pendingOTs.length}
                      style={{ marginLeft: 6 }}
                      color="#fa8c16"
                    />
                  )}
                </span>
              ),
              value: "pending",
            },
            { label: "Lịch sử duyệt", value: "history" },
          ]}
          value={viewMode}
          onChange={(val) => setViewMode(val as any)}
          size="large"
          className="shadow-sm"
        />
      </div>

      {/* Bảng */}
      <div className="bg-white p-5 rounded-xl shadow-sm">
        <Spin spinning={loading}>
          <Table
            columns={getColumns()}
            dataSource={displayData}
            rowKey="Id"
            searchable={false}
            noScroll={true}
            totalText="đơn OT"
            locale={{
              emptyText:
                viewMode === "pending"
                  ? "Không có đơn OT nào đang chờ duyệt 🎉"
                  : "Chưa có lịch sử duyệt đơn OT",
            }}
          />
        </Spin>
      </div>

      {/* Modal từ chối */}
      <Modal
        title={
          <div className="flex items-center text-red-500">
            <CloseOutlined className="mr-2" /> Xác nhận từ chối đơn OT
          </div>
        }
        open={rejectVisible}
        onOk={handleRejectConfirm}
        onCancel={() => setRejectVisible(false)}
        confirmLoading={submitting}
        okText="Xác nhận từ chối"
        okButtonProps={{ danger: true }}
        cancelText="Hủy"
        centered
      >
        <div className="my-4">
          <Text className="mb-2 block">
            Vui lòng nhập lý do từ chối để nhân viên biết:
          </Text>
          <TextArea
            rows={4}
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            placeholder="Nhập lý do từ chối..."
            className="rounded-md"
          />
        </div>
      </Modal>
    </div>
  );
}
