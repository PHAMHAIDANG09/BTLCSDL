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
      className="rounded-2xl bg-white overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5"
      style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}
    >
      {/* Dải màu gradient trên đỉnh */}
      <div className="h-1.5 w-full" style={{ background: gradient }} />

      <div className="p-5">
        {/* Header: title + icon */}
        <div className="flex items-start justify-between mb-3">
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">
            {title}
          </p>
          {/* Icon box */}
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
            style={{
              background: `${color}15`,
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
          <div className="flex items-baseline gap-1.5">
            <span
              className="text-4xl font-black tabular-nums leading-none"
              style={{ color }}
            >
              {displayValue}
            </span>
            {suffix && (
              <span className="text-sm font-medium text-gray-400">{suffix}</span>
            )}
          </div>
        )}

        {description && !loading && (
          <p className="mt-2 text-xs text-gray-400">{description}</p>
        )}
      </div>
    </div>
  );
}
