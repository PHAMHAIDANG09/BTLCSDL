"use client";

import React from "react";
import { Row, Col, Card, Space, Badge, Table, theme } from "antd";
import { TeamOutlined } from "@ant-design/icons";
import HRBarChart from "./HRBarChart";
import { MonthlyReportRow, getHrColumns } from "./reportHelpers";

interface HRReportTabProps {
  chartData: MonthlyReportRow[];
  tableData: MonthlyReportRow[];
}

export default function HRReportTab({ chartData, tableData }: HRReportTabProps) {
  const { token } = theme.useToken();

  return (
    <div className="pt-4">
      <Row gutter={[24, 24]}>
        {/* Chart Card */}
        <Col xs={24} lg={12}>
          <Card
            title={
              <Space>
                <TeamOutlined style={{ color: token.colorPrimary }} />
                <span className="font-bold text-sm">
                  Biểu đồ Tuyển mới & Nghỉ việc
                </span>
              </Space>
            }
            extra={
              <Space size="middle">
                <Badge color={token.colorSuccess} text="Tuyển mới" />
                <Badge color={token.colorPrimary} text="Nghỉ việc" />
              </Space>
            }
            className="shadow-sm border border-gray-100 rounded-2xl"
          >
            <div className="h-64 flex items-center justify-center">
               <HRBarChart chartData={chartData} />
            </div>
          </Card>
        </Col>

        {/* Table Card */}
        <Col xs={24} lg={12}>
          <Card
            title="Số liệu chi tiết Biến động nhân sự"
            className="shadow-sm border border-gray-100 rounded-2xl"
          >
            <Table
              columns={getHrColumns(token)}
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

