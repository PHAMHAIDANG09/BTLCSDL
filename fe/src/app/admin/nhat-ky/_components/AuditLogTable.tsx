"use client";

import React, { useState, useMemo } from "react";
import { Tag, Tooltip, Button, Select, Input, Space, Statistic, Row, Col, Card } from "antd";
import type { ColumnsType } from "antd/es/table";
import { NhatKyHeThong } from "@/types/system";
import Table from "@/components/shared/Table/Table";
import dayjs from "dayjs";
import {
  SyncOutlined,
  EyeOutlined,
  PlusCircleOutlined,
  EditOutlined,
  DeleteOutlined,
  DatabaseOutlined,
  SearchOutlined,
  FilterOutlined,
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

// Bỏ qua các bản ghi LOGIN — không phải thay đổi dữ liệu nghiệp vụ
const isLoginEntry = (d: { HanhDong: string }) => d.HanhDong?.toUpperCase() === "LOGIN";

const getActionCfg = (action: string) =>
  ACTION_CONFIG[action?.toUpperCase()] ?? { color: "#8c8c8c", icon: <DatabaseOutlined />, label: action, bg: "#fafafa" };

export default function AuditLogTable({ dataSource, loading, onRefresh }: AuditLogTableProps) {
  const [filterAction, setFilterAction] = useState<string | undefined>(undefined);
  const [filterTable, setFilterTable]   = useState<string | undefined>(undefined);
  const [searchId, setSearchId]         = useState("");

  // Loại bỏ LOGIN trước mọi xử lý
  const nonLoginData = useMemo(() => dataSource.filter((d) => !isLoginEntry(d)), [dataSource]);

  // Unique table names for filter dropdown
  const tableOptions = useMemo(() => {
    const names = [...new Set(nonLoginData.map((d) => d.TenBang))].sort();
    return names.map((n) => ({ label: n, value: n }));
  }, [nonLoginData]);

  // Stats
  const stats = useMemo(() => ({
    total:  nonLoginData.length,
    insert: nonLoginData.filter((d) => d.HanhDong?.toUpperCase() === "INSERT").length,
    update: nonLoginData.filter((d) => d.HanhDong?.toUpperCase() === "UPDATE").length,
    delete: nonLoginData.filter((d) => d.HanhDong?.toUpperCase() === "DELETE").length,
  }), [nonLoginData]);

  // Filtered data
  const filtered = useMemo(() => {
    let result = [...nonLoginData];
    if (filterAction) result = result.filter((d) => d.HanhDong?.toUpperCase() === filterAction);
    if (filterTable)  result = result.filter((d) => d.TenBang === filterTable);
    if (searchId)     result = result.filter((d) => String(d.MaBanGhi).includes(searchId) || String(d.Id).includes(searchId));
    return result;
  }, [nonLoginData, filterAction, filterTable, searchId]);

  const renderJsonValue = (value: string | null) => {
    if (!value) return <span style={{ color: "#bfbfbf", fontStyle: "italic" }}>—</span>;
    try {
      const parsed = JSON.parse(value);
      return (
        <Tooltip
          overlayStyle={{ maxWidth: 420 }}
          title={
            <pre style={{ fontSize: 11, maxHeight: 240, overflow: "auto", margin: 0 }}>
              {JSON.stringify(parsed, null, 2)}
            </pre>
          }
        >
          <span style={{ color: "#1677ff", cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}>
            <EyeOutlined /> Xem chi tiết
          </span>
        </Tooltip>
      );
    } catch {
      return (
        <Tooltip title={value}>
          <span>{value.length > 40 ? `${value.substring(0, 40)}…` : value}</span>
        </Tooltip>
      );
    }
  };

  const columns: ColumnsType<NhatKyHeThong> = [
    {
      title: "ID",
      dataIndex: "Id",
      key: "Id",
      width: 70,
      sorter: (a, b) => a.Id - b.Id,
      defaultSortOrder: "descend",
      render: (id: number) => <span style={{ color: "#8c8c8c", fontSize: 12 }}>#{id}</span>,
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
            {cfg.icon} {cfg.label}
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
        <Tag icon={<DatabaseOutlined />} color="geekblue" style={{ borderRadius: 6 }}>
          {text}
        </Tag>
      ),
    },
    {
      title: "Mã bản ghi",
      dataIndex: "MaBanGhi",
      key: "MaBanGhi",
      width: 110,
      render: (val: number) => (
        <span style={{ fontFamily: "monospace", background: "#f5f5f5", padding: "2px 8px", borderRadius: 4 }}>
          {val}
        </span>
      ),
    },
    {
      title: "Giá trị cũ",
      dataIndex: "GiaTriCu",
      key: "GiaTriCu",
      width: 140,
      render: renderJsonValue,
    },
    {
      title: "Giá trị mới",
      dataIndex: "GiaTriMoi",
      key: "GiaTriMoi",
      width: 140,
      render: renderJsonValue,
    },
    {
      title: "Người thực hiện",
      dataIndex: "MaNguoiThucHienId",
      key: "MaNguoiThucHienId",
      width: 140,
      render: (id: number) => (
        <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span
            style={{
              width: 26, height: 26, borderRadius: "50%",
              background: "linear-gradient(135deg,#667eea,#764ba2)",
              color: "#fff", fontSize: 11, fontWeight: 700,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}
          >
            {id}
          </span>
          <span style={{ color: "#595959", fontSize: 12 }}>NV #{id}</span>
        </span>
      ),
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
        {[
          { label: "Tổng nhật ký", value: stats.total,  color: "#1677ff", bg: "#e6f4ff" },
          { label: "Thêm mới",    value: stats.insert, color: "#52c41a", bg: "#f6ffed" },
          { label: "Cập nhật",    value: stats.update, color: "#1677ff", bg: "#e6f4ff" },
          { label: "Xóa",         value: stats.delete, color: "#ff4d4f", bg: "#fff1f0" },
        ].map((s) => (
          <Col key={s.label} xs={12} sm={8} md={6} lg={4}>
            <Card
              size="small"
              style={{ borderRadius: 12, border: `1px solid ${s.color}33`, background: s.bg, textAlign: "center" }}
              bodyStyle={{ padding: "12px 8px" }}
            >
              <Statistic
                title={<span style={{ fontSize: 11, color: "#8c8c8c" }}>{s.label}</span>}
                value={s.value}
                valueStyle={{ fontSize: 22, fontWeight: 700, color: s.color }}
              />
            </Card>
          </Col>
        ))}
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
          <FilterOutlined style={{ color: "#8c8c8c" }} />
          <Select
            allowClear
            placeholder="Hành động"
            style={{ width: 140 }}
            value={filterAction}
            onChange={setFilterAction}
            options={[
              { label: "➕ Thêm mới", value: "INSERT" },
              { label: "✏️ Cập nhật",  value: "UPDATE" },
              { label: "🗑️ Xóa",       value: "DELETE" },
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
          scroll={{ x: 1100 }}
        />
      </div>
    </div>
  );
}
