"use client";

import React, { useState } from "react";
import {
  Row,
  Col,
  Select,
  Typography,
  message,
  Alert,
  Tag,
  theme,
} from "antd";
import {
  FileExcelOutlined,
  CalendarOutlined,
  DownloadOutlined,
  InfoCircleOutlined,
  CheckCircleFilled,
} from "@ant-design/icons";
import dayjs from "dayjs";
import reportService from "@/services/report.service";
import Button from "@/components/shared/Button/Button";

const { Text } = Typography;
const { Option } = Select;

export default function ExportSection() {
  const [selectedMonth, setSelectedMonth] = useState(dayjs().month() + 1);
  const [selectedYear, setSelectedYear] = useState(dayjs().year());
  const [loadingType, setLoadingType] = useState<"attendance" | "payroll" | null>(null);
  
  const { token } = theme.useToken();

  const handleDownload = async (type: "attendance" | "payroll") => {
    setLoadingType(type);
    try {
      message.loading({ content: "Đang xuất báo cáo...", key: "download", duration: 0 });

      let blob: Blob;
      let filename: string;

      if (type === "attendance") {
        blob = await reportService.exportAttendance(selectedMonth, selectedYear);
        filename = `Bang_Cong_Thang_${selectedMonth}_${selectedYear}.xlsx`;
      } else {
        blob = await reportService.exportPayroll(selectedMonth, selectedYear);
        filename = `Bang_Luong_Thang_${selectedMonth}_${selectedYear}.xlsx`;
      }

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);

      message.success({ content: "Tải báo cáo thành công!", key: "download", duration: 2 });
    } catch (error: any) {
      console.error(error);
      message.error({ content: error.message || "Lỗi khi tải báo cáo", key: "download", duration: 2 });
    } finally {
      setLoadingType(null);
    }
  };

  return (
    <>
      {/* Info alert */}
      <Alert
        message="Hướng dẫn tải báo cáo"
        description="Báo cáo được kết xuất trực tiếp từ các view SQL Server chính thức của cơ sở dữ liệu. Vui lòng chọn thời kỳ mong muốn bên dưới để kết xuất file Excel định dạng chuẩn."
        type="info"
        showIcon
        icon={<InfoCircleOutlined style={{ color: token.colorInfo }} />}
        className="mb-6 rounded-2xl"
        style={{
          border: `1px solid ${token.colorInfoBorder || "#bae7ff"}`,
          background: token.colorInfoBg || "#e6f7ff",
          marginBottom: 32,
        }}
      />

      {/* Export container (Card layout instead of gray gradient wrapper) */}
      <div
        style={{
          border: `1px solid ${token.colorBorderSecondary}`,
          borderRadius: 16,
          padding: "16px 20px",
          backgroundColor: token.colorBgContainer,
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.02)",
        }}
      >
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
          <DownloadOutlined style={{ fontSize: 18, color: token.colorPrimary }} />
          <span style={{ fontSize: 16, fontWeight: 800, color: token.colorText }}>
            Xuất Báo Cáo Excel
          </span>
        </div>
        <Text style={{ color: token.colorTextDescription, fontSize: 12.5, display: "block", marginBottom: 16 }}>
          Thực hiện <b>3 bước</b> đơn giản để tải file Excel về máy của bạn.
        </Text>

        {/* Steps */}
        <Row gutter={[0, 0]} align="stretch">

          {/* STEP 1 — Chọn kỳ */}
          <Col xs={24} md={8}>
            <div
              style={{
                background: "transparent",
                padding: "4px 16px 4px 0",
                height: "100%",
                borderRight: `1px dashed ${token.colorBorderSecondary}`,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                <div
                  style={{
                    width: 22, height: 22, borderRadius: "50%",
                    background: token.colorPrimary,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 11, fontWeight: 800, color: "#fff", flexShrink: 0,
                  }}
                >
                  1
                </div>
                <Text strong style={{ fontSize: 13, color: token.colorText }}>
                  Chọn kỳ báo cáo
                </Text>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <Select
                  value={selectedMonth}
                  onChange={setSelectedMonth}
                  style={{ flex: 1 }}
                  suffixIcon={<CalendarOutlined style={{ color: token.colorPrimary }} />}
                >
                  {Array.from({ length: 12 }, (_, i) => (
                    <Option key={i + 1} value={i + 1}>Tháng {i + 1}</Option>
                  ))}
                </Select>
                <Select
                  value={selectedYear}
                  onChange={setSelectedYear}
                  style={{ flex: 1 }}
                >
                  {[2024, 2025, 2026].map((y) => (
                    <Option key={y} value={y}>{y}</Option>
                  ))}
                </Select>
              </div>
              <div style={{ marginTop: 8, display: "flex", alignItems: "center", gap: 6 }}>
                <CheckCircleFilled style={{ color: token.colorSuccess, fontSize: 12 }} />
                <Text style={{ fontSize: 11.5, color: token.colorSuccess, fontWeight: 600 }}>
                  Đã chọn: Tháng {selectedMonth} / {selectedYear}
                </Text>
              </div>
            </div>
          </Col>

          {/* STEP 2 — Chọn loại */}
          <Col xs={24} md={10}>
            <div
              style={{
                background: "transparent",
                padding: "4px 16px",
                height: "100%",
                borderRight: `1px dashed ${token.colorBorderSecondary}`,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                <div
                  style={{
                    width: 22, height: 22, borderRadius: "50%",
                    background: token.colorPrimary,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 11, fontWeight: 800, color: "#fff", flexShrink: 0,
                  }}
                >
                  2
                </div>
                <Text strong style={{ fontSize: 13, color: token.colorText }}>
                  Chọn loại báo cáo cần tải
                </Text>
              </div>
              <Row gutter={[8, 8]}>
                {/* Bảng Công */}
                <Col span={24}>
                  <div
                    style={{
                      border: `1.5px solid ${token.colorSuccessBorder || "#b7eb8f"}`,
                      borderRadius: 10,
                      background: token.colorSuccessBg || "#f6ffed",
                      padding: "8px 12px",
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                    }}
                  >
                    <FileExcelOutlined style={{ fontSize: 18, color: token.colorSuccess, flexShrink: 0 }} />
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 700, color: token.colorSuccessText || token.colorSuccess }}>
                        Bảng Công
                      </div>
                      <div style={{ fontSize: 10.5, color: token.colorSuccess }}>
                        Chấm công · Số giờ công · Số phút đi muộn
                      </div>
                    </div>
                    <Tag color="success" style={{ marginLeft: "auto", fontSize: 10 }}>
                      .xlsx
                    </Tag>
                  </div>
                </Col>
                {/* Bảng Lương */}
                <Col span={24}>
                  <div
                    style={{
                      border: `1.5px solid ${token.colorErrorBorder || token.colorPrimaryBorder || "#ffccc7"}`,
                      borderRadius: 10,
                      background: token.colorErrorBg || token.colorPrimaryBg || "#fff1f0",
                      padding: "8px 12px",
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                    }}
                  >
                    <FileExcelOutlined style={{ fontSize: 18, color: token.colorPrimary, flexShrink: 0 }} />
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 700, color: token.colorErrorText || token.colorPrimaryText || token.colorPrimary }}>
                        Bảng Lương
                      </div>
                      <div style={{ fontSize: 10.5, color: token.colorError || token.colorPrimary }}>
                        Lương cơ bản · OT · Bảo hiểm · Thực lĩnh
                      </div>
                    </div>
                    <Tag color="error" style={{ marginLeft: "auto", fontSize: 10 }}>
                      .xlsx
                    </Tag>
                  </div>
                </Col>
              </Row>
            </div>
          </Col>

          {/* STEP 3 — Tải xuống */}
          <Col xs={24} md={6}>
            <div
              style={{
                background: "transparent",
                padding: "4px 0 4px 16px",
                height: "100%",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                <div
                  style={{
                    width: 22, height: 22, borderRadius: "50%",
                    background: token.colorPrimary,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 11, fontWeight: 800, color: "#fff", flexShrink: 0,
                  }}
                >
                  3
                </div>
                <Text strong style={{ fontSize: 13, color: token.colorText }}>
                  Bấm tải xuống
                </Text>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8, flex: 1, justifyContent: "center" }}>
                <Button
                  block
                  loading={loadingType === "attendance"}
                  loadingText="Đang xuất..."
                  onClick={() => handleDownload("attendance")}
                  icon={<DownloadOutlined />}
                  style={{
                    height: 36,
                    borderRadius: token.borderRadius,
                    border: "none",
                    backgroundColor: token.colorSuccess,
                    color: "#fff",
                    fontWeight: 700,
                    fontSize: 12,
                    boxShadow: `0 2px 6px ${token.colorSuccess}4D`,
                  }}
                >
                  Xuất Bảng Công
                </Button>
                <Button
                  block
                  loading={loadingType === "payroll"}
                  loadingText="Đang xuất..."
                  onClick={() => handleDownload("payroll")}
                  icon={<DownloadOutlined />}
                  style={{
                    height: 36,
                    borderRadius: token.borderRadius,
                    border: "none",
                    backgroundColor: token.colorPrimary,
                    color: "#fff",
                    fontWeight: 700,
                    fontSize: 12,
                    boxShadow: `0 2px 6px ${token.colorPrimary}4D`,
                  }}
                >
                  Xuất Bảng Lương
                </Button>
              </div>
            </div>
          </Col>

        </Row>
      </div>
    </>
  );
}

