"use client";

import { Row, Col } from "antd";
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  MinusCircleOutlined,
  FileTextOutlined,
} from "@ant-design/icons";

interface AttendanceStatsProps {
  present: number;
  late: number;
  absent: number;
  onLeave: number;
}

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: number;
  backgroundColor: string;
  color: string;
}

function StatCard({
  icon,
  label,
  value,
  backgroundColor,
  color,
}: StatCardProps) {
  return (
    <div
      style={{
        backgroundColor,
        borderRadius: 8,
        padding: "12px 12px",
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        minHeight: 80,
      }}
    >
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div style={{ marginBottom: 6, fontSize: 18, color }}>{icon}</div>
        <div
          style={{
            fontSize: 12,
            color: "rgba(0,0,0,0.65)",
          }}
        >
          {label}
        </div>
      </div>
      <div
        style={{
          fontSize: 24,
          fontWeight: 600,
          color,
        }}
      >
        {value}
      </div>
    </div>
  );
}

export default function AttendanceStats({
  present,
  late,
  absent,
  onLeave,
}: AttendanceStatsProps) {
  return (
    <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
      <Col xs={24} sm={12} md={6}>
        <StatCard
          icon={<MinusCircleOutlined />}
          label="Tổng số"
          value={present + late + absent + onLeave}
          backgroundColor="#ffe7e7"
          color="#d4380d"
        />
      </Col>
      <Col xs={24} sm={12} md={6}>
        <StatCard
          icon={<CheckCircleOutlined />}
          label="Đã hoàn thành"
          value={present}
          backgroundColor="#f6ffed"
          color="#52c41a"
        />
      </Col>
      <Col xs={24} sm={12} md={6}>
        <StatCard
          icon={<ClockCircleOutlined />}
          label="Đang diễn ra"
          value={late}
          backgroundColor="#fffbe6"
          color="#faad14"
        />
      </Col>
      <Col xs={24} sm={12} md={6}>
        <StatCard
          icon={<FileTextOutlined />}
          label="Nghỉ phép"
          value={onLeave}
          backgroundColor="#e6f7ff"
          color="#1890ff"
        />
      </Col>
    </Row>
  );
}
