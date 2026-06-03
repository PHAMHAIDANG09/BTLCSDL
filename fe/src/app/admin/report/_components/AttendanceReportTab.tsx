"use client";

import React from "react";
import { Row, Col, Card, Space, Table, theme } from "antd";
import { ClockCircleOutlined } from "@ant-design/icons";
import LatenessLineChart from "./LatenessLineChart";
import { MonthlyReportRow, getAttendanceColumns } from "./reportHelpers";

interface AttendanceReportTabProps {
  chartData: MonthlyReportRow[];
  tableData: MonthlyReportRow[];
}

export default function AttendanceReportTab({
  chartData,
  tableData,
}: AttendanceReportTabProps) {
  const { token } = theme.useToken();

  return (
    <div className="pt-4">
      <Row gutter={[24, 24]}>
        {/* Chart Card */}
        <Col xs={24} lg={12}>
          <Card
            title={
              <Space>
                <ClockCircleOutlined style={{ color: token.colorInfo }} />
                <span className="font-bold text-sm">
                  Tỷ lệ đi muộn của chấm công (%)
                </span>
              </Space>
            }
            className="shadow-sm border border-gray-100 rounded-2xl"
          >
            <div className="h-64 flex items-center justify-center">
              <LatenessLineChart chartData={chartData} />
            </div>
          </Card>
        </Col>

        {/* Table Card */}
        <Col xs={24} lg={12}>
          <Card
            title="Bảng chi tiết Lịch sử đi muộn"
            className="shadow-sm border border-gray-100 rounded-2xl"
          >
            <Table
              columns={getAttendanceColumns(token)}
              dataSource={tableData}
              pagination={{ pageSize: 5 }}
              className="admin-table"
              size="middle"
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
}

