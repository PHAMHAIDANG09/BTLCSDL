"use client";

import React, { useState, useEffect } from "react";
import {
  Typography, Button, Tag, Space, Modal, Input,
  message, Spin, Popconfirm, Avatar, Segmented, Badge, Tooltip,
} from "antd";
import {
  CheckOutlined, CloseOutlined, UserOutlined, CalendarOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import Table from "@/components/shared/Table/Table";
import type { TableColumnsType } from "antd";
import { LeaveService } from "@/services/leave.service";
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

const employeeRender = (nv: any) => (
  <Space>
    <Avatar icon={<UserOutlined />} className="bg-blue-100 text-blue-600" />
    <span className="font-semibold text-gray-800">{nv?.HoTen}</span>
  </Space>
);

/* ================================================================== */
/* Page                                                                 */
/* ================================================================== */
export default function AdminLeavePage() {
  const [leaveRequests, setLeaveRequests] = useState<any[]>([]);
  const [loading, setLoading]             = useState(false);
  const [viewMode, setViewMode]           = useState<"pending" | "history">("pending");

  // Reject modal
  const [rejectVisible, setRejectVisible] = useState(false);
  const [rejectId, setRejectId]           = useState<number | null>(null);
  const [rejectReason, setRejectReason]   = useState("");
  const [submitting, setSubmitting]       = useState(false);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const leaves = await LeaveService.getAllLeaveRequests();
      setLeaveRequests(leaves || []);
    } catch (err) {
      console.error(err);
      message.error("Lỗi khi tải danh sách đơn nghỉ phép");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: number) => {
    setLoading(true);
    try {
      await LeaveService.approveLeave(id, "Approved");
      message.success("Đã phê duyệt đơn nghỉ phép thành công!");
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
      await LeaveService.approveLeave(rejectId!, "Rejected", rejectReason);
      message.success("Đã từ chối đơn thành công!");
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
      title: "Loại phép",
      dataIndex: "loaiNghiPhep",
      key: "type",
      width: 140,
      render: (item: any) => (
        <Tag color="blue" bordered={false} className="px-2 py-1">
          {item?.TenLoaiPhep || "Khác"}
        </Tag>
      ),
    },
    {
      title: "Thời gian nghỉ",
      key: "time",
      width: 185,
      render: (_, r) => (
        <Text>
          <CalendarOutlined style={{ color: "#8c8c8c", marginRight: 4 }} />
          {dayjs(r.NgayBatDau).format("DD/MM/YYYY")} – {dayjs(r.NgayKetThuc).format("DD/MM/YYYY")}
        </Text>
      ),
      sorter: (a: any, b: any) =>
        new Date(a.NgayBatDau).getTime() - new Date(b.NgayBatDau).getTime(),
    },
    {
      title: "Số ngày nghỉ",
      dataIndex: "TongSoNgay",
      key: "TongSoNgay",
      width: 110,
      align: "center" as const,
      render: (days: number) => (
        <Tag color="blue" bordered={false} style={{ fontWeight: 600 }}>
          {days} ngày
        </Tag>
      ),
    },
    {
      title: "Lý do",
      dataIndex: "LyDo",
      key: "reason",
      width: 220,
      render: (text: string) => (
        <div className="whitespace-normal break-words">
          <Text className="italic text-gray-600">{text}</Text>
        </div>
      ),
    },
    {
      title: "Ngày tạo",
      dataIndex: "NgayTao",
      key: "NgayTao",
      width: 125,
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
  ];

  const getColumns = (): TableColumnsType<any> => {
    if (viewMode === "pending") {
      return [
        ...baseColumns,
        {
          title: "Thao tác",
          key: "action",
          width: 170,
          render: (_, record) => (
            <Space size="small">
              <Popconfirm
                title="Bạn có chắc chắn muốn duyệt đơn này?"
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
                <span style={{ color: "#52c41a" }}>{dayjs(d).format("HH:mm")}</span>
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
        render: (_, record) => (
          <Space direction="vertical" size={2} style={{ display: "flex" }}>
            <div>{getStatusBadge(record.TrangThai)}</div>
            {record.TrangThai === "Rejected" && record.LyDoTuChoi && (
              <Tooltip title={record.LyDoTuChoi}>
                <div
                  className="text-xs text-red-500 truncate max-w-[120px] italic cursor-help"
                >
                  Lý do: {record.LyDoTuChoi}
                </div>
              </Tooltip>
            )}
          </Space>
        ),
        filters: [
          { text: "Đã duyệt", value: "Approved" },
          { text: "Từ chối",  value: "Rejected" },
        ],
        onFilter: (value: any, r: any) => r.TrangThai === value,
      },
    ];
  };

  const pendingLeaves = leaveRequests.filter((r) => r.TrangThai === "Pending");
  const historyLeaves = leaveRequests.filter((r) => r.TrangThai !== "Pending");
  const displayData   = viewMode === "pending" ? pendingLeaves : historyLeaves;

  /* ─────────── RENDER ─────────── */
  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-10">
        <div>
          <Title level={2} style={{ margin: 0 }} >
            Quản Lý Nghỉ Phép
          </Title>
          <Text type="secondary">
            Xem xét và phê duyệt các đơn xin nghỉ phép của nhân viên
          </Text>
        </div>
        <Segmented
          options={[
            {
              label: (
                <span>
                  Chờ xử lý
                  {pendingLeaves.length > 0 && (
                    <Badge
                      count={pendingLeaves.length}
                      style={{ marginLeft: 6 }}
                      color="#f5222d"
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
            totalText="đơn"
            locale={{
              emptyText:
                viewMode === "pending"
                  ? "Không có đơn nghỉ phép nào đang chờ duyệt 🎉"
                  : "Chưa có lịch sử duyệt đơn",
            }}
          />
        </Spin>
      </div>

      {/* Modal từ chối */}
      <Modal
        title={
          <div className="flex items-center text-red-500">
            <CloseOutlined className="mr-2" /> Xác nhận từ chối đơn
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
            placeholder="Nhập lý do từ chối (VD: Do dự án đang gấp...)"
            className="rounded-md"
          />
        </div>
      </Modal>
    </div>
  );
}
