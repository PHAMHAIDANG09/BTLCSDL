"use client";

import React from "react";
import { Row, Col } from "antd";
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  MinusCircleOutlined,
  FileTextOutlined,
} from "@ant-design/icons";
import StatsCard from "@/components/shared/StatsCard/StatsCard";

interface AttendanceStatsProps {
  present: number;
  late: number;
  absent: number;
  onLeave: number;
}

export default function AttendanceStats({
  present,
  late,
  absent,
  onLeave,
}: AttendanceStatsProps) {
  const total = present + late + absent + onLeave;

  return (
    <Row gutter={[16, 16]}>
      <Col xs={24} sm={12} md={6}>
        <StatsCard 
          label="Tổng số"
          value={total}
          icon={<MinusCircleOutlined />}
          color="#e00c10ff"
          bg="#fff1f0"
          size="small"
        />
      </Col>
      <Col xs={24} sm={12} md={6}>
        <StatsCard 
          label="Đúng giờ"
          value={present}
          icon={<CheckCircleOutlined />}
          color="#13940cff"
          bg="#f6ffed"
          size="small"
        />
      </Col>
      <Col xs={24} sm={12} md={6}>
        <StatsCard 
          label="Đi muộn"
          value={late}
          icon={<ClockCircleOutlined />}
          color="#dba211ff"
          bg="#fff7e6"
          size="small"
        />
      </Col>
      <Col xs={24} sm={12} md={6}>
        <StatsCard 
          label="Nghỉ phép"
          value={onLeave}
          icon={<FileTextOutlined />}
          color="#1545c9ff"
          bg="#e6f7ff"
          size="small"
        />
      </Col>
    </Row>
  );
}
