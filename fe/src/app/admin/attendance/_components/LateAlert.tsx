"use client";

import { Alert, Space, Empty } from "antd";
import { WarningOutlined, ClockCircleOutlined } from "@ant-design/icons";

interface LateEmployee {
  id: string;
  employeeName: string;
  lateMinutes: number;
  checkInTime: string;
}

interface LateAlertProps {
  lateEmployees: LateEmployee[];
  earlyCheckOutEmployees?: LateEmployee[];
}

export default function LateAlert({
  lateEmployees,
  earlyCheckOutEmployees = [],
}: LateAlertProps) {
  if (lateEmployees.length === 0 && earlyCheckOutEmployees.length === 0) {
    return <Empty description="Không có cảnh báo" />;
  }

  return (
    <Space direction="vertical" style={{ width: "100%" }} size="large">
      {lateEmployees.length > 0 && (
        <Alert
          message="Cảnh báo Đi muộn"
          description={
            <ul style={{ marginBottom: 0, marginTop: 8 }}>
              {lateEmployees.map((emp) => (
                <li key={emp.id}>
                  <strong>{emp.employeeName}</strong> - Đi muộn{" "}
                  <strong>{emp.lateMinutes} phút</strong> (Vào lúc{" "}
                  {emp.checkInTime})
                </li>
              ))}
            </ul>
          }
          type="warning"
          icon={<WarningOutlined />}
          showIcon
        />
      )}

      {earlyCheckOutEmployees.length > 0 && (
        <Alert
          message="Cảnh báo Về sớm"
          description={
            <ul style={{ marginBottom: 0, marginTop: 8 }}>
              {earlyCheckOutEmployees.map((emp) => (
                <li key={emp.id}>
                  <strong>{emp.employeeName}</strong> - Về sớm{" "}
                  <strong>{emp.lateMinutes} phút</strong> (Ra lúc{" "}
                  {emp.checkInTime})
                </li>
              ))}
            </ul>
          }
          type="info"
          icon={<ClockCircleOutlined />}
          showIcon
        />
      )}
    </Space>
  );
}
