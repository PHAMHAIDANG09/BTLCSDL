"use client";

import React, { useState, useMemo } from "react";
import { Tag, Select, Input, Space, Row, Col, theme } from "antd";
import type { ColumnsType } from "antd/es/table";
import { NhatKyHeThong } from "@/types/system";
import Table from "@/components/shared/Table/Table";
import Button from "@/components/shared/Button/Button";
import Modal from "@/components/shared/Modal/Modal";
import StatsCard from "@/components/shared/StatsCard/StatsCard";
import dayjs from "dayjs";
import {
  SyncOutlined,
  EyeOutlined,
  PlusCircleOutlined,
  EditOutlined,
  DeleteOutlined,
  DatabaseOutlined,
  SearchOutlined,
  UserOutlined,
} from "@ant-design/icons";

interface AuditLogTableProps {
  dataSource: NhatKyHeThong[];
  loading: boolean;
  onRefresh: () => void;
}

const ACTION_CONFIG: Record<string, { color: string; icon: React.ReactNode; label: string; bg: string }> = {
  INSERT: { color: "#52c41a", icon: <PlusCircleOutlined />, label: "Thêm mới", bg: "#f6ffed" },
  UPDATE: { color: "#1677ff", icon: <EditOutlined />,       label: "Cập nhật", bg: "#e6f4ff" },
  DELETE: { color: "#ff4d4f", icon: <DeleteOutlined />,     label: "Xóa",      bg: "#fff1f0" },
};

const isLoginEntry = (d: { HanhDong: string }) => d.HanhDong?.toUpperCase() === "LOGIN";

const getActionCfg = (action: string) =>
  ACTION_CONFIG[action?.toUpperCase()] ?? { color: "#8c8c8c", icon: <DatabaseOutlined />, label: action, bg: "#fafafa" };

interface JsonModalState {
  open: boolean;
  title: string;
  data: any;
}

export default function AuditLogTable({ dataSource, loading, onRefresh }: AuditLogTableProps) {
  const { token } = theme.useToken();
  const [filterAction, setFilterAction] = useState<string | undefined>(undefined);
  const [filterTable, setFilterTable]   = useState<string | undefined>(undefined);
  const [searchId, setSearchId]         = useState("");
  const [modal, setModal] = useState<JsonModalState>({ open: false, title: "", data: null });

  const nonLoginData = useMemo(() => dataSource.filter((d) => !isLoginEntry(d)), [dataSource]);

  const tableOptions = useMemo(() => {
    const names = [...new Set(nonLoginData.map((d) => d.TenBang))].sort();
    return names.map((n) => ({ label: n, value: n }));
  }, [nonLoginData]);

  const stats = useMemo(() => ({
    total:  nonLoginData.length,
    insert: nonLoginData.filter((d) => d.HanhDong?.toUpperCase() === "INSERT").length,
    update: nonLoginData.filter((d) => d.HanhDong?.toUpperCase() === "UPDATE").length,
    delete: nonLoginData.filter((d) => d.HanhDong?.toUpperCase() === "DELETE").length,
  }), [nonLoginData]);

  const filtered = useMemo(() => {
    let result = [...nonLoginData];
    if (filterAction) result = result.filter((d) => d.HanhDong?.toUpperCase() === filterAction);
    if (filterTable)  result = result.filter((d) => d.TenBang === filterTable);
    if (searchId)     result = result.filter((d) => String(d.Id).includes(searchId));
    return result;
  }, [nonLoginData, filterAction, filterTable, searchId]);

  const openJsonModal = (title: string, rawValue: string | null) => {
    if (!rawValue) return;
    try {
      setModal({ open: true, title, data: JSON.parse(rawValue) });
    } catch {
      setModal({ open: true, title, data: rawValue });
    }
  };

  const renderJsonValue = (value: string | null, label: string) => {
    if (!value) return <span style={{ color: "#bfbfbf", fontStyle: "italic" }}>—</span>;
    return (
      <span
        onClick={() => openJsonModal(label, value)}
        style={{ color: "#1677ff", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 4, userSelect: "none" }}
      >
        <EyeOutlined /> Xem chi tiết
      </span>
    );
  };

  const columns: ColumnsType<NhatKyHeThong> = [
    {
      title: "ID",
      dataIndex: "Id",
      key: "Id",
      width: 70,
      sorter: (a, b) => a.Id - b.Id,
      defaultSortOrder: "descend",
      render: (id: number) => <span style={{ color: "#262626", fontSize: 13, fontWeight: 700 }}>{id}</span>,
    },
    {
      title: "Hành động",
      dataIndex: "HanhDong",
      key: "HanhDong",
      width: 130,
      render: (text: string) => {
        const cfg = getActionCfg(text);
        return (
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 5,
              padding: "3px 10px",
              borderRadius: 20,
              fontSize: 12,
              fontWeight: 600,
              color: cfg.color,
              background: cfg.bg,
              border: `1px solid ${cfg.color}33`,
            }}
          >
            {cfg.label}
          </span>
        );
      },
    },
    {
      title: "Bảng dữ liệu",
      dataIndex: "TenBang",
      key: "TenBang",
      width: 140,
      render: (text: string) => (
        <Tag color="geekblue" style={{ borderRadius: 6 }}>
          {text}
        </Tag>
      ),
    },
    {
      title: "Giá trị cũ",
      dataIndex: "GiaTriCu",
      key: "GiaTriCu",
      width: 140,
      render: (value: string | null) => renderJsonValue(value, "Giá trị cũ"),
    },
    {
      title: "Giá trị mới",
      dataIndex: "GiaTriMoi",
      key: "GiaTriMoi",
      width: 140,
      render: (value: string | null) => renderJsonValue(value, "Giá trị mới"),
    },
    {
      title: "Người thực hiện",
      dataIndex: "nguoiThucHien",
      key: "nguoiThucHien",
      width: 180,
      render: (_: any, record: NhatKyHeThong) => {
        const nv = record.nguoiThucHien;
        const hoTen = nv?.HoTen ?? "—";
        const maNV  = nv?.MaNhanVien ?? String(record.MaNguoiThucHienId ?? "");
        const initials = hoTen !== "—" ? hoTen.split(" ").map((w) => w[0]).slice(-2).join("").toUpperCase() : "?";
        return (
          <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span
              style={{
                width: 30, height: 30, borderRadius: "50%",
                background: "linear-gradient(135deg,#667eea,#764ba2)",
                color: "#fff", fontSize: 11, fontWeight: 700,
                display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0,
              }}
            >
              {initials}
            </span>
            <span>
              <div style={{ color: "#262626", fontSize: 13, fontWeight: 600, lineHeight: 1.3 }}>{hoTen}</div>
              <div style={{ color: "#8c8c8c", fontSize: 11 }}>{maNV}</div>
            </span>
          </span>
        );
      },
    },
    {
      title: "Thời gian",
      dataIndex: "NgayThucHien",
      key: "NgayThucHien",
      width: 170,
      sorter: (a, b) => dayjs(a.NgayThucHien).unix() - dayjs(b.NgayThucHien).unix(),
      render: (text: string) => (
        <span style={{ fontSize: 12 }}>
          <span style={{ color: "#262626", fontWeight: 500 }}>{dayjs(text).format("DD/MM/YYYY")}</span>
          <br />
          <span style={{ color: "#8c8c8c" }}>{dayjs(text).format("HH:mm:ss")}</span>
        </span>
      ),
    },
  ];

  return (
    <div>
      {/* Stats Row */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} md={6}>
          <StatsCard
            label="Tổng nhật ký"
            value={stats.total}
            icon={<DatabaseOutlined />}
            color={token.colorInfo}
            bg={token.colorInfoBg}
          />
        </Col>
        <Col xs={24} sm={12} md={6}>
          <StatsCard
            label="Thêm mới"
            value={stats.insert}
            icon={<PlusCircleOutlined />}
            color={token.colorSuccess}
            bg={token.colorSuccessBg}
          />
        </Col>
        <Col xs={24} sm={12} md={6}>
          <StatsCard
            label="Cập nhật"
            value={stats.update}
            icon={<EditOutlined />}
            color={token.colorWarning}
            bg={token.colorWarningBg}
          />
        </Col>
        <Col xs={24} sm={12} md={6}>
          <StatsCard
            label="Xóa"
            value={stats.delete}
            icon={<DeleteOutlined />}
            color={token.colorError}
            bg={token.colorErrorBg}
          />
        </Col>
      </Row>

      {/* Filter Bar */}
      <div
        style={{
          background: "#fff",
          padding: "16px 20px",
          borderRadius: "12px 12px 0 0",
          borderBottom: "1px solid #f0f0f0",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 12,
        }}
      >
        <Space wrap size={10}>
          <Select
            allowClear
            placeholder="Hành động"
            style={{ width: 140 }}
            value={filterAction}
            onChange={setFilterAction}
            options={[
              { label: "Thêm mới", value: "INSERT" },
              { label: "Cập nhật",  value: "UPDATE" },
              { label: "Xóa",       value: "DELETE" },
            ]}
          />
          <Select
            allowClear
            placeholder="Bảng dữ liệu"
            style={{ width: 180 }}
            showSearch
            value={filterTable}
            onChange={setFilterTable}
            options={tableOptions}
          />
          <Input
            placeholder="Tìm theo ID..."
            prefix={<SearchOutlined style={{ color: "#bfbfbf" }} />}
            style={{ width: 160 }}
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
            allowClear
          />
          {(filterAction || filterTable || searchId) && (
            <Button
              size="small"
              onClick={() => { setFilterAction(undefined); setFilterTable(undefined); setSearchId(""); }}
            >
              Xóa lọc
            </Button>
          )}
        </Space>
        <Button icon={<SyncOutlined />} onClick={onRefresh} loading={loading} type="primary" ghost>
          Làm mới
        </Button>
      </div>

      {/* Table */}
      <div style={{ background: "#fff", borderRadius: "0 0 12px 12px", overflow: "hidden" }}>
        <Table
          columns={columns}
          dataSource={filtered}
          rowKey="Id"
          loading={loading}
          searchable={false}
          scroll={{ x: 1000 }}
        />
      </div>

      {/* JSON Detail Modal */}
      <Modal
        open={modal.open}
        title={<span style={{ fontWeight: 700, fontSize: 15 }}>{modal.title}</span>}
        onCancel={() => setModal({ open: false, title: "", data: null })}
        footer={null}
        width={640}
        centered
        styles={{ body: { padding: "16px 20px" } }}
      >
        {modal.data !== null && (
          <div style={{ maxHeight: 500, overflowY: "auto", borderRadius: 8, border: "1px solid #e8e8e8" }}>
            {typeof modal.data === "object" ? (
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                <thead style={{ position: "sticky", top: 0, zIndex: 1 }}>
                  <tr>
                    <th style={{ textAlign: "left", padding: "8px 14px", background: "#f5f5f5", fontWeight: 600, color: "#595959", width: "38%", borderBottom: "1px solid #e8e8e8" }}>
                      Trường
                    </th>
                    <th style={{ textAlign: "left", padding: "8px 14px", background: "#f5f5f5", fontWeight: 600, color: "#595959", borderBottom: "1px solid #e8e8e8" }}>
                      Giá trị
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(modal.data).map(([key, val], idx) => (
                    <tr key={key} style={{ background: idx % 2 === 0 ? "#fff" : "#fafafa" }}>
                      <td style={{ padding: "8px 14px", borderTop: "1px solid #f0f0f0", color: "#1677ff", fontWeight: 600, fontFamily: "monospace", fontSize: 12 }}>
                        {key}
                      </td>
                      <td style={{ padding: "8px 14px", borderTop: "1px solid #f0f0f0", color: "#262626", wordBreak: "break-all", fontSize: 13 }}>
                        {val === null || val === undefined
                          ? <span style={{ color: "#bfbfbf", fontStyle: "italic" }}>null</span>
                          : typeof val === "object"
                            ? <pre style={{ margin: 0, fontSize: 11, whiteSpace: "pre-wrap" }}>{JSON.stringify(val, null, 2)}</pre>
                            : String(val)
                        }
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <pre style={{ background: "#f8f9fa", padding: 16, fontSize: 12, margin: 0, whiteSpace: "pre-wrap", wordBreak: "break-all" }}>
                {String(modal.data)}
              </pre>
            )}
          </div>
        )}
        <div style={{ textAlign: "right", marginTop: 16 }}>
          <Button onClick={() => setModal({ open: false, title: "", data: null })}>
            Đóng
          </Button>
        </div>
      </Modal>
    </div>
  );
}
