"use client";

import React from "react";
import { Row, Col, Card, Space, Badge, Table, theme } from "antd";
import { DollarOutlined } from "@ant-design/icons";
import PayrollBarChart from "./PayrollBarChart";
import { MonthlyReportRow, getPayrollColumns } from "./reportHelpers";

interface PayrollReportTabProps {
  chartData: MonthlyReportRow[];
  tableData: MonthlyReportRow[];
}

export default function PayrollReportTab({
  chartData,
  tableData,
}: PayrollReportTabProps) {
  const { token } = theme.useToken();

  return (
    <div className="pt-4">
      <Row gutter={[24, 24]}>
        {/* Chart Card */}
        <Col xs={24} lg={12}>
          <Card
            title={
              <Space>
                <DollarOutlined style={{ color: token.colorPrimary }} />
                <span className="font-bold text-sm">
                  Biểu đồ cơ cấu Quỹ Lương hàng tháng
                </span>
              </Space>
            }
            extra={
              <Space size="middle">
                <Badge color={token.colorPrimary} text="Thực nhận" />
                <Badge color={token.colorWarning} text="Làm thêm (OT)" />
              </Space>
            }
            className="shadow-sm border border-gray-100 rounded-2xl"
          >
            <div className="h-64 flex items-center justify-center">
              <PayrollBarChart chartData={chartData} />
            </div>
          </Card>
        </Col>

        {/* Table Card */}
        <Col xs={24} lg={12}>
          <Card
            title="Bảng số liệu Quỹ lương tổng hợp"
            className="shadow-sm border border-gray-100 rounded-2xl"
          >
            <Table
              columns={getPayrollColumns(token)}
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

