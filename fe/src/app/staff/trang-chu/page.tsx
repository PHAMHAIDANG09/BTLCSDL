"use client";

import { Typography, Row, Col, Card, Statistic, Spin, Alert } from "antd";
import {
  ClockCircleOutlined,
  CalendarOutlined,
  DollarOutlined,
  BellOutlined,
} from "@ant-design/icons";
import { useEffect, useState } from "react";
import api from "@/services/api";
import dayjs from "dayjs";

const { Title, Text } = Typography;

export default function StaffHomePage() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    ngayCong: 0,
    ngayPhep: 0,
    luongThangTruoc: 0,
    ngayLeConLai: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const now = dayjs();
        const startOfMonth = now.startOf("month").format("YYYY-MM-DD");
        const endOfMonth = now.endOf("month").format("YYYY-MM-DD");

        const [attendanceRes, leaveRes, payslipRes, holidayRes] = await Promise.allSettled([
          api.get(`/cham-cong/lich-su?startDate=${startOfMonth}&endDate=${endOfMonth}`),
          api.get(`/nghi-phep/so-du?year=${now.year()}`),
          api.get("/luong/phieu-luong-cua-toi"),
          api.get("/system/holidays")
        ]);

        const extractData = (res: any) => res.status === 'fulfilled' ? (Array.isArray(res.value) ? res.value : res.value?.data || []) : [];

        const attendanceRecords = extractData(attendanceRes);
        const ngayCong = new Set(attendanceRecords.map((r: any) => r.NgayChamCong?.split("T")[0])).size;

        const balances = extractData(leaveRes);
        const ngayPhep = balances.reduce((sum: number, b: any) => sum + (b.TongNgayPhep - b.DaSuDung), 0);

        const payslips = extractData(payslipRes);
        const luongThangTruoc = payslips.length > 0 ? payslips[0].TongThuNhap : 0;

        const holidays = extractData(holidayRes);
        const ngayLeConLai = holidays.filter((h: any) => dayjs(h.NgayBatDau).isAfter(now)).length;

        setStats({ ngayCong, ngayPhep, luongThangTruoc, ngayLeConLai });
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu dashboard nhân viên:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div style={{ padding: "16px 24px", maxWidth: 1200, margin: "0 auto" }}>
      <div style={{ marginBottom: 32 }}>
        <Title level={2} style={{ margin: 0, fontWeight: 900, color: "#1e293b", fontSize: "32px", letterSpacing: "-0.5px" }}>
          Xin chào! 
        </Title>
        <Text style={{ fontSize: "16px", color: "#64748b", fontWeight: 500 }}>
          Dưới đây là tổng quan các thông tin cá nhân của bạn.
        </Text>
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: "50px 0" }}>
          <Spin size="large" tip="Đang tải dữ liệu..." />
        </div>
      ) : (
        <Row gutter={[24, 24]}>
          <Col xs={24} sm={12} lg={6}>
            <Card
              bordered={false}
              style={{
                borderRadius: 16,
                background: "linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)",
                boxShadow: "0 10px 25px -5px rgba(59, 130, 246, 0.1), 0 8px 10px -6px rgba(59, 130, 246, 0.1)",
                border: "1px solid #bfdbfe",
              }}
              bodyStyle={{ padding: 24 }}
            >
              <Statistic
                title={<span style={{ color: "#1e3a8a", fontWeight: 700, fontSize: 15, textTransform: "uppercase", letterSpacing: "0.5px" }}>Ngày công tháng này</span>}
                value={stats.ngayCong}
                suffix={<span style={{ fontSize: 18, fontWeight: 600 }}>/ 22 ngày</span>}
                prefix={<ClockCircleOutlined style={{ marginRight: 8 }} />}
                valueStyle={{ color: "#1d4ed8", fontWeight: 900, fontSize: 36 }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card
              bordered={false}
              style={{
                borderRadius: 16,
                background: "linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)",
                boxShadow: "0 10px 25px -5px rgba(34, 197, 94, 0.1), 0 8px 10px -6px rgba(34, 197, 94, 0.1)",
                border: "1px solid #bbf7d0",
              }}
              bodyStyle={{ padding: 24 }}
            >
              <Statistic
                title={<span style={{ color: "#14532d", fontWeight: 700, fontSize: 15, textTransform: "uppercase", letterSpacing: "0.5px" }}>Số ngày phép còn lại</span>}
                value={stats.ngayPhep}
                suffix={<span style={{ fontSize: 18, fontWeight: 600 }}>ngày</span>}
                prefix={<CalendarOutlined style={{ marginRight: 8 }} />}
                valueStyle={{ color: "#15803d", fontWeight: 900, fontSize: 36 }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card
              bordered={false}
              style={{
                borderRadius: 16,
                background: "linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)",
                boxShadow: "0 10px 25px -5px rgba(245, 158, 11, 0.1), 0 8px 10px -6px rgba(245, 158, 11, 0.1)",
                border: "1px solid #fde68a",
              }}
              bodyStyle={{ padding: 24 }}
            >
              <Statistic
                title={<span style={{ color: "#78350f", fontWeight: 700, fontSize: 15, textTransform: "uppercase", letterSpacing: "0.5px" }}>Lương tháng gần nhất</span>}
                value={stats.luongThangTruoc}
                suffix={<span style={{ fontSize: 18, fontWeight: 600 }}>đ</span>}
                prefix={<DollarOutlined style={{ marginRight: 8 }} />}
                valueStyle={{ color: "#b45309", fontWeight: 900, fontSize: 30 }}
                groupSeparator=","
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card
              bordered={false}
              style={{
                borderRadius: 16,
                background: "linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)",
                boxShadow: "0 10px 25px -5px rgba(239, 68, 68, 0.1), 0 8px 10px -6px rgba(239, 68, 68, 0.1)",
                border: "1px solid #fecaca",
              }}
              bodyStyle={{ padding: 24 }}
            >
              <Statistic
                title={<span style={{ color: "#7f1d1d", fontWeight: 700, fontSize: 15, textTransform: "uppercase", letterSpacing: "0.5px" }}>Ngày lễ sắp tới</span>}
                value={stats.ngayLeConLai}
                suffix={<span style={{ fontSize: 18, fontWeight: 600 }}>dịp lễ</span>}
                prefix={<BellOutlined style={{ marginRight: 8 }} />}
                valueStyle={{ color: "#b91c1c", fontWeight: 900, fontSize: 36 }}
              />
            </Card>
          </Col>
        </Row>
      )}
    </div>
  );
}
