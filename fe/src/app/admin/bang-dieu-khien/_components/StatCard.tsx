"use client";

import React from "react";
import { Skeleton } from "antd";
import type { ReactNode } from "react";

interface StatCardProps {
  title: string;
  value: number | string | undefined;
  icon: ReactNode;
  /** Hex color cho số và icon */
  color: string;
  /** CSS gradient string cho dải màu trên đỉnh card */
  gradient: string;
  suffix?: string;
  loading?: boolean;
  description?: string;
}

/**
 * StatCard v2 – Thẻ thống kê premium với gradient accent bar
 */
export default function StatCard({
  title,
  value,
  icon,
  color,
  gradient,
  suffix,
  loading = false,
  description,
}: StatCardProps) {
  const displayValue =
    value !== undefined
      ? typeof value === "number"
        ? value.toLocaleString("vi-VN")
        : value
      : "–";

  return (
    <div
      style={{
        borderRadius: 16,
        background: "#ffffff",
        overflow: "hidden",
        boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
        border: "1px solid #f0f0f0",
        transition: "all 0.3s ease",
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = "translateY(-4px)";
        e.currentTarget.style.boxShadow = "0 8px 30px rgba(0,0,0,0.08)";
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = "none";
        e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,0.05)";
      }}
    >
      {/* Dải màu gradient trên đỉnh */}
      <div style={{ height: 6, width: "100%", background: gradient }} />

      <div style={{ padding: 20, display: "flex", flexDirection: "column", flex: 1 }}>
        {/* Header: title + icon */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 12 }}>
          <p
            style={{
              fontSize: 12,
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              color: "#8c8c8c",
              margin: 0,
            }}
          >
            {title}
          </p>
          {/* Icon box */}
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 12,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 18,
              flexShrink: 0,
              background: `${color}1A`, // 10% opacity
              color,
            }}
          >
            {icon}
          </div>
        </div>

        {/* Giá trị chính */}
        {loading ? (
          <Skeleton.Input active size="default" style={{ width: 80, height: 36 }} />
        ) : (
          <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginTop: "auto" }}>
            <span
              style={{
                fontSize: 32,
                fontWeight: 900,
                color,
                fontVariantNumeric: "tabular-nums",
                lineHeight: 1,
              }}
            >
              {displayValue}
            </span>
            {suffix && (
              <span style={{ fontSize: 13, fontWeight: 500, color: "#8c8c8c" }}>{suffix}</span>
            )}
          </div>
        )}

        {description && !loading && (
          <p style={{ marginTop: 8, fontSize: 12, color: "#8c8c8c", margin: "8px 0 0 0" }}>{description}</p>
        )}
      </div>
    </div>
  );
}

