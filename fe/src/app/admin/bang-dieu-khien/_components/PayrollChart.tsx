"use client";

import React, { useEffect, useState } from "react";
import { Card, Empty, Spin, Tag, Typography, Divider } from "antd";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import dashboardService, { type PayrollMonthData } from "@/services/dashboard.service";

const { Text } = Typography;

// ─── Helpers ─────────────────────────────────────────────────────────────────

const fmtMillions = (v: number) => {
  if (!v) return "0";
  return `${(v / 1_000_000).toLocaleString("vi-VN", { maximumFractionDigits: 1 })}tr`;
};

const fmtVND = (v: number) =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(v);

/**
 * Tạo mảng 6 tháng gần nhất (từ tháng xa đến tháng gần),
 * điền data thực nếu có, còn lại để 0.
 * Lấy mốc là tháng mới nhất có dữ liệu (hoặc hiện tại nếu không có).
 */
const buildSixMonthWindow = (rawData: PayrollMonthData[]) => {
  let baseDate = new Date();
  
  if (rawData && rawData.length > 0) {
    // Tìm tháng mới nhất trong dữ liệu
    const latest = rawData.reduce((max, curr) => {
      if (curr.Nam > max.Nam || (curr.Nam === max.Nam && curr.Thang > max.Thang)) {
        return curr;
      }
      return max;
    }, rawData[0]);
    
    // Date object (month 0-indexed)
    baseDate = new Date(latest.Nam, latest.Thang - 1, 1);
  }

  const result = [];

  for (let i = 5; i >= 0; i--) {
    const d = new Date(baseDate.getFullYear(), baseDate.getMonth() - i, 1);
    const year = d.getFullYear();
    const month = d.getMonth() + 1;

    const found = rawData.find((r) => r.Nam === year && r.Thang === month);
    result.push({
      label: `T${month}/${String(year).slice(-2)}`,
      luongCoBan: Math.round(found?.TongLuongCoBan || 0),
      thucNhan: Math.round(found?.TongThucNhan || 0),
      hasData: !!found,
    });
  }

  return result;
};

// ─── Custom Tooltip ───────────────────────────────────────────────────────────

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  const hasData = payload.some((p: any) => p.value > 0);

  return (
    <div
      style={{
        background: "#fff",
        border: "1px solid #f0f0f0",
        borderRadius: 10,
        padding: "10px 14px",
        boxShadow: "0 4px 20px rgba(0,0,0,0.10)",
        minWidth: 180,
      }}
    >
      <div
        style={{
          fontWeight: 700,
          color: "#374151",
          fontSize: 13,
          marginBottom: 6,
          paddingBottom: 6,
          borderBottom: "1px solid #f3f4f6",
        }}
      >
        {label}
      </div>
      {!hasData ? (
        <Text style={{ fontSize: 12, color: "#9ca3af" }}>Chưa tính lương</Text>
      ) : (
        payload.map((p: any, i: number) => (
          <div
            key={i}
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: 16,
              marginBottom: 3,
              alignItems: "center",
            }}
          >
            <span
              style={{
                display: "flex",
                alignItems: "center",
                gap: 5,
                fontSize: 12,
                color: "#6b7280",
              }}
            >
              <span
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: 2,
                  background: p.fill,
                  display: "inline-block",
                  flexShrink: 0,
                }}
              />
              {p.dataKey === "luongCoBan" ? "Lương cơ bản" : "Thực nhận"}
            </span>
            <span style={{ fontWeight: 700, fontSize: 12, color: p.fill }}>
              {fmtVND(p.value)}
            </span>
          </div>
        ))
      )}
    </div>
  );
};

// ─── Legend ──────────────────────────────────────────────────────────────────

const ChartLegend = () => (
  <div
    style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      gap: 20,
      marginTop: 8,
    }}
  >
    {[
      { color: "#93c5fd", label: "Lương cơ bản" },
      { color: "#2563eb", label: "Thực nhận" },
    ].map((item) => (
      <span
        key={item.label}
        style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#6b7280" }}
      >
        <span
          style={{
            width: 12,
            height: 12,
            borderRadius: 3,
            background: item.color,
            display: "inline-block",
          }}
        />
        {item.label}
      </span>
    ))}
    <span
      style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#9ca3af" }}
    >
      <span
        style={{
          width: 12,
          height: 12,
          borderRadius: 3,
          background: "#e5e7eb",
          display: "inline-block",
        }}
      />
      Chưa có dữ liệu
    </span>
  </div>
);

// ─── Custom Bar (xám nếu không có data) ──────────────────────────────────────

const ColoredBar = (props: any) => {
  const { hasData, fill, ...rest } = props;
  return <rect {...rest} fill={hasData ? fill : "#e5e7eb"} />;
};

// ─── Main ────────────────────────────────────────────────────────────────────

interface ChartRow {
  label: string;
  luongCoBan: number;
  thucNhan: number;
  hasData: boolean;
}

export default function PayrollChart() {
  const [data, setData] = useState<ChartRow[]>([]);
  const [rawData, setRawData] = useState<PayrollMonthData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    dashboardService
      .getChartStats()
      .then((stats) => {
        const quyLuong = stats?.quyLuong ?? [];
        setRawData(quyLuong);
        // Luôn build đủ 6 tháng, tháng thiếu = 0
        setData(buildSixMonthWindow(quyLuong));
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  const latestWithData = rawData[rawData.length - 1];
  const totalPayroll = rawData.reduce((s, r) => s + (r.TongThucNhan || 0), 0);
  const monthsWithData = data.filter((d) => d.hasData).length;

  const cardExtra = !loading && latestWithData && (
    <Tag
      color="green"
      style={{ borderRadius: 20, fontWeight: 600, fontSize: 12, padding: "2px 10px" }}
    >
      Tháng {latestWithData.Thang}/{latestWithData.Nam}:{" "}
      {fmtMillions(latestWithData.TongThucNhan)} đ
    </Tag>
  );

  return (
    <Card
      bordered={false}
      style={{
        borderRadius: 12,
        boxShadow: "0 1px 8px rgba(0,0,0,0.07)",
        height: "100%",
      }}
      title={
        <div>
          <div style={{ fontWeight: 700, fontSize: 14, color: "#111827" }}>
            Biến Động Chi Phí Lương
          </div>
          <div style={{ fontSize: 12, color: "#9ca3af", fontWeight: 400 }}>
            6 tháng gần nhất
          </div>
        </div>
      }
      extra={cardExtra}
      styles={{
        header: { borderBottom: "1px solid #f3f4f6" },
        body: { paddingTop: 12 },
      }}
    >
      {loading ? (
        <div
          style={{ height: 240, display: "flex", alignItems: "center", justifyContent: "center" }}
        >
          <Spin size="large" />
        </div>
      ) : error ? (
        <div
          style={{ height: 240, display: "flex", alignItems: "center", justifyContent: "center" }}
        >
          <Empty description="Không thể tải dữ liệu" />
        </div>
      ) : (
        <>
          {/* Ghi chú nếu chưa đủ data */}
          {monthsWithData === 0 && (
            <div style={{ textAlign: "center", marginBottom: 8 }}>
              <Text style={{ fontSize: 12, color: "#9ca3af" }}>
                Admin hãy tính lương để xem biểu đồ
              </Text>
            </div>
          )}
          {monthsWithData > 0 && monthsWithData < 6 && (
            <div style={{ textAlign: "center", marginBottom: 8 }}>
              <Text style={{ fontSize: 12, color: "#9ca3af" }}>
                Có dữ liệu {monthsWithData}/6 tháng — tháng màu xám chưa tính lương
              </Text>
            </div>
          )}

          {/* BarChart luôn hiện 6 tháng */}
          <ResponsiveContainer width="100%" height={240}>
            <BarChart
              data={data}
              margin={{ top: 4, right: 8, left: 0, bottom: 4 }}
              barCategoryGap="28%"
              barGap={3}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
              <XAxis
                dataKey="label"
                tick={{ fontSize: 11, fill: "#9ca3af" }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fill: "#9ca3af" }}
                tickLine={false}
                axisLine={false}
                tickFormatter={fmtMillions}
                width={44}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: "#f8fafc" }} />

              {/* Lương cơ bản */}
              <Bar dataKey="luongCoBan" radius={[4, 4, 0, 0]} maxBarSize={26}>
                {data.map((entry, i) => (
                  <Cell key={i} fill={entry.hasData ? "#93c5fd" : "#e5e7eb"} />
                ))}
              </Bar>

              {/* Thực nhận */}
              <Bar dataKey="thucNhan" radius={[4, 4, 0, 0]} maxBarSize={26}>
                {data.map((entry, i) => (
                  <Cell key={i} fill={entry.hasData ? "#2563eb" : "#e5e7eb"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>

          <ChartLegend />

          {totalPayroll > 0 && (
            <>
              <Divider style={{ margin: "12px 0 8px" }} />
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <Text style={{ fontSize: 12, color: "#6b7280" }}>
                  Tổng thực nhận ({monthsWithData} tháng có data):{" "}
                  <strong style={{ color: "#374151" }}>{fmtMillions(totalPayroll)} đ</strong>
                </Text>
                <Text style={{ fontSize: 11, color: "#d1d5db" }}>Nguồn: PhieuLuong</Text>
              </div>
            </>
          )}
        </>
      )}
    </Card>
  );
}
