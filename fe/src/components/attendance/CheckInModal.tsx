"use client";

import React, { useState, useEffect } from "react";
import { Modal, Typography, Space, Tag, Spin } from "antd";
import { ClockCircleOutlined, CheckCircleOutlined, LogoutOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { AttendanceService, AttendanceRecord } from "../../services/attendance.service";
import { Toast } from "../shared/Toast/Toast";
import Button from "../shared/Button/Button";

const { Title, Text } = Typography;

interface CheckInModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const CheckInModal: React.FC<CheckInModalProps> = ({ open, onClose, onSuccess }) => {
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [loading, setLoading] = useState(false);
  const [record, setRecord] = useState<AttendanceRecord | null>(null);
  const [initialLoading, setInitialLoading] = useState(true);

  // Clock tick
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Fetch today's status when modal opens
  useEffect(() => {
    if (open) {
      fetchStatus();
    }
  }, [open]);

  const fetchStatus = async () => {
    setInitialLoading(true);
    try {
      const data = await AttendanceService.getTodayStatus();
      setRecord(data);
    } catch (error) {
      console.error(error);
    } finally {
      setInitialLoading(false);
    }
  };

  const handleCheckInOut = async () => {
    setLoading(true);
    try {
      const newRecord = await AttendanceService.checkInOut();
      setRecord(newRecord);
      Toast.success(newRecord.GioRa ? "Check-out thành công!" : "Check-in thành công!");
      if (onSuccess) onSuccess();
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || error.message || "Có lỗi xảy ra, vui lòng thử lại!";
      Toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const isCheckedIn = !!record?.GioVao;
  const isCheckedOut = !!record?.GioRa;

  return (
    <Modal
      title="Điểm danh thời gian thực"
      open={open}
      onCancel={onClose}
      footer={null}
      width={400}
      centered
    >
      <div style={{ textAlign: "center", padding: "20px 0" }}>
        {initialLoading ? (
          <Spin size="large" />
        ) : (
          <Space direction="vertical" size="large" style={{ width: "100%" }}>
            {/* Clock */}
            <div style={{ background: "#f0f2f5", padding: "24px", borderRadius: "12px" }}>
              <Title level={2} style={{ margin: 0,  letterSpacing: "2px" }}>
                {dayjs(currentTime).format("HH:mm:ss")}
              </Title>
              <Text type="secondary">{dayjs(currentTime).format("dddd, DD/MM/YYYY")}</Text>
            </div>

            {/* Status */}
            <div>
              <Text strong>Trạng thái hôm nay: </Text>
              {!isCheckedIn ? (
                <Tag color="default">Chưa chấm công</Tag>
              ) : isCheckedOut ? (
                <Tag color="green">Đã chấm công</Tag>
              ) : (
                <Tag color="blue">Đang làm việc</Tag>
              )}
            </div>

            {/* Timestamps */}
            {isCheckedIn && (
              <Space direction="vertical" size="small">
                <Text>
                  <CheckCircleOutlined style={{ color: "#52c41a", marginRight: 8 }} />
                  Giờ vào: <b>{dayjs(record.GioVao).format("HH:mm")}</b>
                </Text>
                {isCheckedOut && (
                  <Text>
                    <LogoutOutlined style={{ color: "#faad14", marginRight: 8 }} />
                    Giờ ra: <b>{dayjs(record.GioRa).format("HH:mm")}</b>
                  </Text>
                )}
              </Space>
            )}

            {/* Action Button */}
            <Button
              type="primary"
              size="large"
              shape="round"
              icon={!isCheckedIn ? <ClockCircleOutlined /> : <LogoutOutlined />}
              onClick={handleCheckInOut}
              loading={loading}
              disabled={isCheckedOut}
              danger={isCheckedIn && !isCheckedOut}
              style={{ width: "80%", height: "50px", fontSize: "16px", marginTop: "16px" }}
            >
              {!isCheckedIn
                ? "Check In Ngay"
                : isCheckedOut
                ? "Đã Check Out"
                : "Check Out Ngay"}
            </Button>
          </Space>
        )}
      </div>
    </Modal>
  );
};
