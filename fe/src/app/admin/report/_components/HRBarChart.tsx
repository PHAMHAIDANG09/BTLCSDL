"use client";

import React from "react";
import { theme } from "antd";
import { MonthlyReportRow } from "./reportHelpers";

interface HRBarChartProps {
  chartData: MonthlyReportRow[];
}

export default function HRBarChart({ chartData }: HRBarChartProps) {
  const { token } = theme.useToken();
  const maxVal = Math.max(
    ...chartData.map((d) => Math.max(d.tuyenMoi, d.nghiViec, 4))
  );
  const height = 200;
  const width = 500;
  const padding = 30;

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full">
      {/* Y Axis Grid Lines */}
      {[0, 0.25, 0.5, 0.75, 1].map((r, i) => {
        const y = padding + (height - padding * 2) * (1 - r);
        const gridVal = Math.round(maxVal * r);
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
              x={padding * 1.2}
              y={y + 4}
              textAnchor="end"
              fontSize="10"
              fill={token.colorTextDescription || "#9ca3af"}
            >
              {gridVal}
            </text>
          </g>
        );
      })}

      {/* Chart Bars */}
      {chartData.map((d, idx) => {
        const colWidth = (width - padding * 2.5) / chartData.length;
        const xCenter = padding * 2 + colWidth * idx + colWidth / 2;
        const barWidth = 12;

        const h1 = ((height - padding * 2) * d.tuyenMoi) / maxVal;
        const h2 = ((height - padding * 2) * d.nghiViec) / maxVal;

        const y1 = height - padding - h1;
        const y2 = height - padding - h2;

        return (
          <g key={idx}>
            {/* Recruits Bar (Success Green) */}
            <rect
              x={xCenter - barWidth - 2}
              y={y1}
              width={barWidth}
              height={h1}
              fill="url(#greenGrad)"
              rx="3"
              className="transition-all duration-500 ease-out cursor-pointer hover:opacity-85"
            >
              <title>{`Tuyển mới: ${d.tuyenMoi} người`}</title>
            </rect>

            {/* Resignations Bar (Brand Red) */}
            <rect
              x={xCenter + 2}
              y={y2}
              width={barWidth}
              height={h2}
              fill="url(#redGrad)"
              rx="3"
              className="transition-all duration-500 ease-out cursor-pointer hover:opacity-85"
            >
              <title>{`Nghỉ việc: ${d.nghiViec} người`}</title>
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

      {/* Gradients */}
      <defs>
        <linearGradient id="greenGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={token.colorSuccess} />
          <stop offset="100%" stopColor={token.colorSuccessActive || "#73d13d"} />
        </linearGradient>
        <linearGradient id="redGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={token.colorPrimary} />
          <stop offset="100%" stopColor={token.colorPrimaryActive || "#ff7875"} />
        </linearGradient>
      </defs>
    </svg>
  );
}

