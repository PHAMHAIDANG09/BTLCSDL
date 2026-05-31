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
          padding: "24px 28px",
          backgroundColor: token.colorBgContainer,
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.02)",
        }}
      >
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
          <DownloadOutlined style={{ fontSize: 20, color: token.colorPrimary }} />
          <span style={{ fontSize: 17, fontWeight: 800, color: token.colorText }}>
            Xuất Báo Cáo Excel
          </span>
        </div>
        <Text style={{ color: token.colorTextDescription, fontSize: 13, display: "block", marginBottom: 24 }}>
          Thực hiện <b>3 bước</b> đơn giản để tải file Excel về máy của bạn.
        </Text>

        {/* Steps */}
        <Row gutter={[0, 0]} align="stretch">

          {/* STEP 1 — Chọn kỳ */}
          <Col xs={24} md={8}>
            <div
              style={{
                background: "transparent",
                padding: "12px 24px 12px 0",
                height: "100%",
                borderRight: `1px dashed ${token.colorBorderSecondary}`,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
                <div
                  style={{
                    width: 26, height: 26, borderRadius: "50%",
                    background: token.colorPrimary,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 13, fontWeight: 800, color: "#fff", flexShrink: 0,
                  }}
                >
                  1
                </div>
                <Text strong style={{ fontSize: 14, color: token.colorText }}>
                  Chọn kỳ báo cáo
                </Text>
              </div>
              <div style={{ display: "flex", gap: 10 }}>
                <Select
                  value={selectedMonth}
                  onChange={setSelectedMonth}
                  style={{ flex: 1 }}
                  size="large"
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
                  size="large"
                >
                  {[2024, 2025, 2026].map((y) => (
                    <Option key={y} value={y}>{y}</Option>
                  ))}
                </Select>
              </div>
              <div style={{ marginTop: 12, display: "flex", alignItems: "center", gap: 6 }}>
                <CheckCircleFilled style={{ color: token.colorSuccess, fontSize: 13 }} />
                <Text style={{ fontSize: 12, color: token.colorSuccess, fontWeight: 600 }}>
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
                padding: "12px 24px",
                height: "100%",
                borderRight: `1px dashed ${token.colorBorderSecondary}`,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
                <div
                  style={{
                    width: 26, height: 26, borderRadius: "50%",
                    background: token.colorPrimary,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 13, fontWeight: 800, color: "#fff", flexShrink: 0,
                  }}
                >
                  2
                </div>
                <Text strong style={{ fontSize: 14, color: token.colorText }}>
                  Chọn loại báo cáo cần tải
                </Text>
              </div>
              <Row gutter={[10, 10]}>
                {/* Bảng Công */}
                <Col span={24}>
                  <div
                    style={{
                      border: `1.5px solid ${token.colorSuccessBorder || "#b7eb8f"}`,
                      borderRadius: 10,
                      background: token.colorSuccessBg || "#f6ffed",
                      padding: "10px 14px",
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                    }}
                  >
                    <FileExcelOutlined style={{ fontSize: 22, color: token.colorSuccess, flexShrink: 0 }} />
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: token.colorSuccessText || token.colorSuccess }}>
                        Bảng Công
                      </div>
                      <div style={{ fontSize: 11, color: token.colorSuccess }}>
                        Chấm công · Số giờ công · Số phút đi muộn
                      </div>
                    </div>
                    <Tag color="success" style={{ marginLeft: "auto", fontSize: 11 }}>
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
                      padding: "10px 14px",
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                    }}
                  >
                    <FileExcelOutlined style={{ fontSize: 22, color: token.colorPrimary, flexShrink: 0 }} />
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: token.colorErrorText || token.colorPrimaryText || token.colorPrimary }}>
                        Bảng Lương
                      </div>
                      <div style={{ fontSize: 11, color: token.colorError || token.colorPrimary }}>
                        Lương cơ bản · OT · Bảo hiểm · Thực lĩnh
                      </div>
                    </div>
                    <Tag color="error" style={{ marginLeft: "auto", fontSize: 11 }}>
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
                padding: "12px 0 12px 24px",
                height: "100%",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
                <div
                  style={{
                    width: 26, height: 26, borderRadius: "50%",
                    background: token.colorPrimary,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 13, fontWeight: 800, color: "#fff", flexShrink: 0,
                  }}
                >
                  3
                </div>
                <Text strong style={{ fontSize: 14, color: token.colorText }}>
                  Bấm tải xuống
                </Text>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10, flex: 1 }}>
                <Button
                  block
                  size="large"
                  loading={loadingType === "attendance"}
                  loadingText="Đang xuất..."
                  onClick={() => handleDownload("attendance")}
                  icon={<DownloadOutlined />}
                  style={{
                    flex: 1,
                    height: 48,
                    borderRadius: 10,
                    border: "none",
                    backgroundColor: token.colorSuccess,
                    color: "#fff",
                    fontWeight: 700,
                    fontSize: 13,
                    boxShadow: `0 2px 8px ${token.colorSuccess}55`,
                  }}
                >
                  Xuất Bảng Công
                </Button>
                <Button
                  block
                  size="large"
                  loading={loadingType === "payroll"}
                  loadingText="Đang xuất..."
                  onClick={() => handleDownload("payroll")}
                  icon={<DownloadOutlined />}
                  style={{
                    flex: 1,
                    height: 48,
                    borderRadius: 10,
                    border: "none",
                    backgroundColor: token.colorPrimary,
                    color: "#fff",
                    fontWeight: 700,
                    fontSize: 13,
                    boxShadow: `0 2px 8px ${token.colorPrimary}4D`,
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

