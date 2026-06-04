"use client";

import React, { useEffect, useState } from "react";
import { Card, Empty, Spin, Tag, Typography } from "antd";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  LabelList,
} from "recharts";
import { getEmployeesApi, type Employee } from "@/services/employee.service";

const { Text } = Typography;

const COLORS = [
  "#4f46e5", "#7c3aed", "#0891b2", "#059669",
  "#d97706", "#dc2626", "#db2777", "#0284c7",
  "#65a30d", "#9333ea",
];

interface DeptData {
  name: string;
  soNhanVien: number;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div
      style={{
        background: "#fff",
        border: "1px solid #f0f0f0",
        borderRadius: 10,
        padding: "10px 14px",
        boxShadow: "0 4px 20px rgba(0,0,0,0.12)",
      }}
    >
      <div style={{ fontWeight: 600, color: "#374151", marginBottom: 4, fontSize: 13 }}>
        {label}
      </div>
      <div style={{ color: "#4f46e5", fontWeight: 700, fontSize: 15 }}>
        {payload[0].value}
        <Text style={{ color: "#9ca3af", fontWeight: 400, fontSize: 12, marginLeft: 4 }}>
          nhân viên
        </Text>
      </div>
    </div>
  );
};

export default function EmployeeChart() {
  const [data, setData] = useState<DeptData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    getEmployeesApi()
      .then((employees: Employee[]) => {
        const map: Record<string, number> = {};
        for (const emp of employees) {
          if (emp.TrangThai !== "Active") continue;
          const name =
            emp.phongBan?.TenPhong ??
            (emp.MaPhongId ? `Phòng #${emp.MaPhongId}` : "Chưa phân công");
          map[name] = (map[name] || 0) + 1;
        }
        setData(
          Object.entries(map)
            .map(([name, soNhanVien]) => ({ name, soNhanVien }))
            .sort((a, b) => b.soNhanVien - a.soNhanVien)
        );
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  const total = data.reduce((s, d) => s + d.soNhanVien, 0);
  const chartH = Math.max(220, data.length * 50);

  return (
    <Card
      bordered={false}
      style={{ borderRadius: 14, boxShadow: "0 2px 10px rgba(0,0,0,0.07)", height: "100%" }}
      title={
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontWeight: 700, fontSize: 14, color: "#111827" }}>
              Nhân Viên Theo Phòng Ban
            </div>
            <div style={{ fontSize: 12, color: "#9ca3af", fontWeight: 400 }}>
              Nhân viên đang hoạt động
            </div>
          </div>
          {!loading && total > 0 && (
            <Tag
              color="purple"
              style={{ borderRadius: 20, fontWeight: 600, fontSize: 12, padding: "2px 10px" }}
            >
              {total} người
            </Tag>
          )}
        </div>
      }
      styles={{ header: { borderBottom: "1px solid #f9fafb" }, body: { paddingTop: 8 } }}
    >
      {loading ? (
        <div style={{ height: 220, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Spin size="large" />
        </div>
      ) : error || data.length === 0 ? (
        <div style={{ height: 220, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Empty description={error ? "Không thể tải dữ liệu" : "Chưa có dữ liệu"} />
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={chartH}>
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 4, right: 48, left: 4, bottom: 4 }}
          >
            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f3f4f6" />
            <XAxis
              type="number"
              tick={{ fontSize: 11, fill: "#d1d5db" }}
              tickLine={false}
              axisLine={false}
              allowDecimals={false}
            />
            <YAxis
              type="category"
              dataKey="name"
              tick={{ fontSize: 12, fill: "#374151" }}
              tickLine={false}
              axisLine={false}
              width={120}
              tickFormatter={(v: string) => (v.length > 16 ? v.slice(0, 15) + "…" : v)}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: "#f5f3ff" }} />
            <Bar dataKey="soNhanVien" radius={[0, 8, 8, 0]} maxBarSize={24}>
              {data.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
              <LabelList
                dataKey="soNhanVien"
                position="right"
                style={{ fontSize: 12, fontWeight: 700, fill: "#6b7280" }}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}
    </Card>
  );
}
