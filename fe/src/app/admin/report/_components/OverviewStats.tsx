"use client";

import React from "react";
import { Row, Col, Badge, theme } from "antd";
import {
  DollarOutlined,
  ClockCircleOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import StatsCard from "@/components/shared/StatsCard/StatsCard";
import { formatVND, MonthlyReportRow } from "./reportHelpers";

interface OverviewStatsProps {
  latestMonthData: MonthlyReportRow;
}

export default function OverviewStats({ latestMonthData }: OverviewStatsProps) {
  const { token } = theme.useToken();

  return (
    <Row gutter={[24, 24]} className="mb-8">
      {/* Quỹ Lương */}
      <Col xs={24} sm={12} lg={8}>
        <StatsCard
          label="Quỹ Lương Thực Lĩnh Tháng Này"
          value={formatVND(latestMonthData.tongThucNhan)}
          icon={<DollarOutlined />}
          color={token.colorPrimary}
          bg={token.colorPrimaryBg || "#fff1f0"}
          size="default"
          subtitle={
            <>
              Lương làm thêm (OT):{" "}
              <span style={{ fontWeight: 700, color: token.colorWarningActive || token.colorWarning }}>
                {formatVND(latestMonthData.tongTienOT)}
              </span>
            </>
          }
        />
      </Col>

      {/* Tỷ Lệ Đi Muộn */}
      <Col xs={24} sm={12} lg={8}>
        <StatsCard
          label="Tỷ Lệ Đi Muộn Tháng Này"
          value={`${latestMonthData.diMuonRate}%`}
          icon={<ClockCircleOutlined />}
          color={token.colorInfo}
          bg={token.colorInfoBg || "#e6f7ff"}
          size="default"
          subtitle={
            <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
              Status:{" "}
              {latestMonthData.diMuonRate > 10 ? (
                <Badge status="error" text="Tỷ lệ đi muộn cao" />
              ) : (
                <Badge status="success" text="Tỷ lệ trong mức an toàn" />
              )}
            </span>
          }
        />
      </Col>

      {/* Biến Động Nhân Sự */}
      <Col xs={24} sm={12} lg={8}>
        <StatsCard
          label="Biến Động Nhân Sự Tháng Này"
          value={`${latestMonthData.netChange >= 0 ? "+" : ""}${latestMonthData.netChange} người`}
          icon={<TeamOutlined />}
          color={
            latestMonthData.netChange >= 0
              ? token.colorSuccess
              : token.colorError
          }
          bg={
            latestMonthData.netChange >= 0 
              ? (token.colorSuccessBg || "#f6ffed") 
              : (token.colorPrimaryBg || "#fff1f0")
          }
          size="default"
          subtitle={
            <>
              Tuyển mới:{" "}
              <span style={{ color: token.colorSuccess, fontWeight: 600 }}>
                +{latestMonthData.tuyenMoi}
              </span>
              {" | "}
              Nghỉ việc:{" "}
              <span style={{ color: token.colorPrimary, fontWeight: 600 }}>
                -{latestMonthData.nghiViec}
              </span>
            </>
          }
        />
      </Col>
    </Row>
  );
}

