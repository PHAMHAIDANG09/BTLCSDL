"use client";

import React from "react";
import { theme } from "antd";
import { MonthlyReportRow, formatVNDShort } from "./reportHelpers";

interface PayrollBarChartProps {
  chartData: MonthlyReportRow[];
}

export default function PayrollBarChart({ chartData }: PayrollBarChartProps) {
  const { token } = theme.useToken();
  const maxVal = Math.max(
    ...chartData.map((d) => d.tongThucNhan + d.tongTienOT),
    50000000
  );
  const height = 200;
  const width = 500;
  const padding = 40;

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full">
      {/* Y Axis Grid Lines */}
      {[0, 0.25, 0.5, 0.75, 1].map((r, i) => {
        const y = padding + (height - padding * 2) * (1 - r);
        const gridVal = formatVNDShort(maxVal * r);
        return (
          <g key={i}>
            <line
              x1={padding * 1.5}
              y1={y}
              x2={width - padding}
              y2={y}
              stroke={token.colorBorderSecondary || "#f3f4f6"}
              strokeDasharray="3"
            />
            <text
              x={padding * 1.3}
              y={y + 4}
              textAnchor="end"
              fontSize="9"
              fill={token.colorTextDescription || "#9ca3af"}
            >
              {gridVal}
            </text>
          </g>
        );
      })}

      {/* Stacked Bars */}
      {chartData.map((d, idx) => {
        const colWidth = (width - padding * 2.5) / chartData.length;
        const xCenter = padding * 2 + colWidth * idx + colWidth / 2;
        const barWidth = 18;

        const h1 = ((height - padding * 2) * d.tongThucNhan) / maxVal;
        const h2 = ((height - padding * 2) * d.tongTienOT) / maxVal;

        const y1 = height - padding - h1;
        const y2 = y1 - h2;

        return (
          <g key={idx}>
            {/* Base/Net Salary (Brand Red) */}
            <rect
              x={xCenter - barWidth / 2}
              y={y1}
              width={barWidth}
              height={h1}
              fill="url(#brandRedGrad)"
              className="transition-all duration-500 ease-out cursor-pointer hover:opacity-85"
            >
              <title>{`Thực lĩnh: ${d.tongThucNhan.toLocaleString("vi-VN")} đ`}</title>
            </rect>

            {/* OT Salary (Warning Yellow) */}
            <rect
              x={xCenter - barWidth / 2}
              y={y2}
              width={barWidth}
              height={h2}
              fill="url(#warningYellowGrad)"
              className="transition-all duration-500 ease-out cursor-pointer hover:opacity-85"
            >
              <title>{`Làm thêm (OT): ${d.tongTienOT.toLocaleString("vi-VN")} đ`}</title>
            </rect>

            {/* X Axis Labels */}
            <text
              x={xCenter}
              y={height - 10}
              textAnchor="middle"
              fontSize="10"
              fill={token.colorTextSecondary || "#6b7280"}
            >
              {d.month}/{d.year}
            </text>
          </g>
        );
      })}

      <defs>
        <linearGradient id="brandRedGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={token.colorPrimary} />
          <stop offset="100%" stopColor={token.colorPrimaryActive || "#ff7875"} />
        </linearGradient>
        <linearGradient id="warningYellowGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={token.colorWarning} />
          <stop offset="100%" stopColor={token.colorWarningOutline || "#ffe58f"} />
        </linearGradient>
      </defs>
    </svg>
  );
}

