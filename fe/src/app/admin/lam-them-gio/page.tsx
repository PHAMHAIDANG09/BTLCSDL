"use client";

import React, { useState, useEffect } from "react";
import {
  Typography, Button, Tag, Space, Input,
  message, Spin, Popconfirm, Avatar, Tabs, Badge, Tooltip,
  theme,
} from "antd";
import {
  CheckOutlined, CloseOutlined, UserOutlined,
  CalendarOutlined, HistoryOutlined, SearchOutlined, EyeOutlined,
} from "@ant-design/icons";
import Modal from "@/components/shared/Modal/Modal";
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
    CuoiTuan: { color: "orange", label: "Cuối tuần" },
    NgayLe: { color: "red", label: "Ngày lễ" },
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
  const { token } = theme.useToken();
  const [otRequests, setOtRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState<"pending" | "history">("pending");

  // Reject modal
  const [rejectVisible, setRejectVisible] = useState(false);
  const [rejectId, setRejectId] = useState<number | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Detail modal
  const [detailVisible, setDetailVisible] = useState(false);
  const [selectedOT, setSelectedOT] = useState<any>(null);

  useEffect(() => {
    fetchData();
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("tab") === "history") {
        setViewMode("history");
      }
    }
  }, []);

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
      <SearchOutlined style={{ color: filtered ? token.colorPrimary : undefined }} />
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
        { text: "Cuối tuần", value: "CuoiTuan" },
        { text: "Ngày lễ", value: "NgayLe" },
      ],
      onFilter: (value: any, r: any) => r.LoaiOT === value,
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
  ];

  const getColumns = (): TableColumnsType<any> => {
    if (viewMode === "pending") {
      return [
        ...baseColumns,
        {
          title: "Thao tác",
          key: "action",
          width: 240,
          render: (_, record) => (
            <Space size="small">
              <Button
                type="default"
                size="small"
                icon={<EyeOutlined />}
                onClick={() => {
                  setSelectedOT(record);
                  setDetailVisible(true);
                }}
              >
                Xem
              </Button>
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
                  style={{ background: token.colorSuccess, borderColor: token.colorSuccess }}
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
        title: "Trạng thái",
        key: "status",
        width: 160,
        render: (_, record) => getStatusBadge(record.TrangThai),
        filters: [
          { text: "Đã duyệt", value: "Approved" },
          { text: "Từ chối", value: "Rejected" },
        ],
        onFilter: (value: any, r: any) => r.TrangThai === value,
      },
    ];
  };

  const pendingOTs = otRequests.filter((r) => r.TrangThai === "Pending");
  const historyOTs = otRequests.filter((r) => r.TrangThai !== "Pending");
  const displayData = viewMode === "pending" ? pendingOTs : historyOTs;

  const tabItems = [
    {
      key: "pending",
      label: (
        <span>
          Chờ xử lý
          {pendingOTs.length > 0 && (
            <Badge
              count={pendingOTs.length}
              style={{ marginLeft: 6 }}
              color={token.colorWarning}
            />
          )}
        </span>
      ),
    },
    {
      key: "history",
      label: "Lịch sử duyệt",
    },
  ];

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
      </div>

      {/* Bảng */}
      <div className="bg-white p-5 rounded-xl shadow-sm">
        <Tabs
          activeKey={viewMode}
          onChange={(val) => setViewMode(val as any)}
          items={tabItems}
          className="mb-4"
        />
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
            onRow={(record) => {
              if (viewMode === "history") {
                return {
                  onClick: () => {
                    setSelectedOT(record);
                    setDetailVisible(true);
                  },
                  style: { cursor: "pointer" },
                };
              }
              return {};
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

      {/* Modal xem chi tiết */}
      {selectedOT && (
        <Modal
          title={
            <div style={{ display: "flex", alignItems: "center", gap: 8, color: token.colorPrimary }}>
              <CalendarOutlined />
              <span>Chi Tiết Yêu Cầu Làm Thêm Giờ</span>
            </div>
          }
          open={detailVisible}
          onCancel={() => {
            setDetailVisible(false);
            setSelectedOT(null);
          }}
          width={600}
          footer={[
            <Button
              key="close"
              type="primary"
              onClick={() => {
                setDetailVisible(false);
                setSelectedOT(null);
              }}
            >
              Đóng
            </Button>
          ]}
        >
          <div style={{ padding: "12px 0" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px 24px", marginBottom: 20 }}>
              <div>
                <span style={{ display: "block", color: "#8c8c8c", fontSize: 12, fontWeight: 600, textTransform: "uppercase" }}>Nhân viên</span>
                <span style={{ fontWeight: 600, fontSize: 14 }}>{selectedOT.nhanVien?.HoTen}</span>
              </div>
              <div>
                <span style={{ display: "block", color: "#8c8c8c", fontSize: 12, fontWeight: 600, textTransform: "uppercase" }}>Mã nhân viên</span>
                <span style={{ fontFamily: "monospace", fontSize: 14 }}>{selectedOT.nhanVien?.MaNhanVien}</span>
              </div>
              <div>
                <span style={{ display: "block", color: "#8c8c8c", fontSize: 12, fontWeight: 600, textTransform: "uppercase" }}>Phòng ban</span>
                <span>{selectedOT.nhanVien?.phongBan?.TenPhong || "N/A"}</span>
              </div>
              <div>
                <span style={{ display: "block", color: "#8c8c8c", fontSize: 12, fontWeight: 600, textTransform: "uppercase" }}>Phân loại</span>
                <div>{getLoaiOTTag(selectedOT.LoaiOT)}</div>
              </div>
              <div>
                <span style={{ display: "block", color: "#8c8c8c", fontSize: 12, fontWeight: 600, textTransform: "uppercase" }}>Ngày làm thêm</span>
                <span>{dayjs(selectedOT.NgayLamThem).format("DD/MM/YYYY")}</span>
              </div>
              <div>
                <span style={{ display: "block", color: "#8c8c8c", fontSize: 12, fontWeight: 600, textTransform: "uppercase" }}>Thời gian làm</span>
                <span>{selectedOT.GioBatDau} – {selectedOT.GioKetThuc}</span>
              </div>
              <div>
                <span style={{ display: "block", color: "#8c8c8c", fontSize: 12, fontWeight: 600, textTransform: "uppercase" }}>Tổng số giờ</span>
                <span style={{ fontWeight: 600 }}>{selectedOT.TongSoGio} giờ</span>
              </div>
              <div>
                <span style={{ display: "block", color: "#8c8c8c", fontSize: 12, fontWeight: 600, textTransform: "uppercase" }}>Hệ số OT</span>
                <span style={{ color: token.colorWarning, fontWeight: 700 }}>×{selectedOT.HeSoOT}</span>
              </div>
              <div>
                <span style={{ display: "block", color: "#8c8c8c", fontSize: 12, fontWeight: 600, textTransform: "uppercase" }}>Ngày tạo đơn</span>
                <span>{selectedOT.NgayTao ? dayjs(selectedOT.NgayTao).format("DD/MM/YYYY HH:mm") : "—"}</span>
              </div>
              <div>
                <span style={{ display: "block", color: "#8c8c8c", fontSize: 12, fontWeight: 600, textTransform: "uppercase" }}>Trạng thái</span>
                <div>{getStatusBadge(selectedOT.TrangThai)}</div>
              </div>
            </div>

            <div style={{ marginBottom: 20 }}>
              <span style={{ display: "block", color: "#8c8c8c", fontSize: 12, fontWeight: 600, textTransform: "uppercase", marginBottom: 4 }}>Công việc</span>
              <div style={{ background: "#f8f9fa", padding: "10px 14px", borderRadius: 8, border: "1px solid #f0f0f0", fontStyle: "italic" }}>
                {selectedOT.LyDo || "Không có nội dung"}
              </div>
            </div>

            {(selectedOT.TrangThai === "Approved" || selectedOT.TrangThai === "Rejected") && (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px 24px", marginTop: 20, paddingTop: 16, borderTop: "1px dashed #f0f0f0" }}>
                <div>
                  <span style={{ display: "block", color: "#8c8c8c", fontSize: 12, fontWeight: 600, textTransform: "uppercase" }}>Người duyệt</span>
                  <span>{selectedOT.nguoiDuyet?.HoTen || `Quản lý (ID: ${selectedOT.NguoiDuyetId || "—"})`}</span>
                </div>
                <div>
                  <span style={{ display: "block", color: "#8c8c8c", fontSize: 12, fontWeight: 600, textTransform: "uppercase" }}>Thời gian duyệt</span>
                  <span>{selectedOT.NgayDuyet ? dayjs(selectedOT.NgayDuyet).format("DD/MM/YYYY HH:mm") : "—"}</span>
                </div>
              </div>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
}
