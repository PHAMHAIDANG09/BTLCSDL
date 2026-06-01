"use client";

import React from "react";
import { theme } from "antd";
import { MonthlyReportRow } from "./reportHelpers";

interface LatenessLineChartProps {
  chartData: MonthlyReportRow[];
}

export default function LatenessLineChart({ chartData }: LatenessLineChartProps) {
  const { token } = theme.useToken();
  const maxVal = Math.max(...chartData.map((d) => d.diMuonRate), 10);
  const height = 200;
  const width = 500;
  const padding = 30;

  const points = chartData.map((d, idx) => {
    const colWidth = (width - padding * 2.5) / chartData.length;
    const x = padding * 2 + colWidth * idx + colWidth / 2;
    const y =
      height - padding - ((height - padding * 2) * d.diMuonRate) / maxVal;
    return { x, y, label: `${d.month}/${d.year}`, val: d.diMuonRate };
  });

  const pathD = points.reduce((acc, p, idx) => {
    return acc + `${idx === 0 ? "M" : "L"} ${p.x} ${p.y} `;
  }, "");

  const areaD =
    points.length > 0
      ? `${pathD} L ${points[points.length - 1].x} ${height - padding} L ${points[0].x} ${height - padding} Z`
      : "";

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full">
      {/* Y Axis Grid Lines */}
      {[0, 0.25, 0.5, 0.75, 1].map((r, i) => {
        const y = padding + (height - padding * 2) * (1 - r);
        const gridVal = (maxVal * r).toFixed(1) + "%";
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

      {/* Area under Line */}
      {areaD && <path d={areaD} fill="url(#blueAreaGrad)" />}

      {/* Main Line Path */}
      {pathD && (
        <path d={pathD} fill="none" stroke={token.colorInfo} strokeWidth="3" />
      )}

      {/* Data Points */}
      {points.map((p, idx) => (
        <g key={idx}>
          <circle
            cx={p.x}
            cy={p.y}
            r="5"
            fill={token.colorBgContainer || "#fff"}
            stroke={token.colorInfo}
            strokeWidth="2"
            className="cursor-pointer transition-all"
          >
            <title>{`Tỷ lệ đi muộn: ${p.val}%`}</title>
          </circle>
          <text
            x={p.x}
            y={p.y - 10}
            textAnchor="middle"
            fontSize="9"
            fontWeight="bold"
            fill={token.colorInfo}
          >
            {p.val}%
          </text>
          <text
            x={p.x}
            y={height - 10}
            textAnchor="middle"
            fontSize="10"
            fill={token.colorTextSecondary || "#6b7280"}
          >
            {p.label}
          </text>
        </g>
      ))}

      <defs>
        <linearGradient id="blueAreaGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={token.colorInfo} stopOpacity="0.25" />
          <stop offset="100%" stopColor={token.colorInfo} stopOpacity="0.0" />
        </linearGradient>
      </defs>
    </svg>
  );
}

