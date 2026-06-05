"use client";

import {
  Typography, Row, Col, Card, Statistic, Spin, Tag, Button,
  Modal, Form, DatePicker, Input, Select, InputNumber, message, theme, Space,
} from "antd";
import {
  RightOutlined, HistoryOutlined, DollarOutlined,
} from "@ant-design/icons";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/services/api";
import dayjs from "dayjs";
import { CheckInModal } from "@/components/attendance/CheckInModal";
import { AttendanceService } from "@/services/attendance.service";
import { LeaveService } from "@/services/leave.service";
import payrollService from "@/services/payroll.service";
import PayrollDetailModal from "@/components/payroll/PayrollDetailModal";
import StatsCard from "@/components/shared/StatsCard/StatsCard";
import { systemService } from "@/services/system.service";
import HolidayCalendar from "@/app/admin/ngay-le/_components/HolidayCalendar";
import type { NgayLe } from "@/types/system";

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;
const { TextArea } = Input;

/* ---------- helpers ---------- */
const fmt = (n: number) => n?.toLocaleString("vi-VN") + " đ";

const statusConfig: Record<string, { label: string; color: string }> = {
  "on-time":  { label: "Đúng giờ",  color: "green"  },
  late:       { label: "Đi muộn",   color: "orange" },
  absent:     { label: "Vắng mặt",  color: "red"    },
  "on-leave": { label: "Nghỉ phép", color: "blue"   },
};

const mapBackendStatus = (s: string) => {
  switch (s) {
    case "CoMat":    return "on-time";
    case "DiMuon":   return "late";
    case "VeSom":    return "late";
    case "Vang":     return "absent";
    case "NghiPhep": return "on-leave";
    default:         return "on-time";
  }
};

/* ============================================================ */
export default function StaffHomePage() {
  const router = useRouter();
  const { token } = theme.useToken();

  /* ---- summary stats ---- */
  const [loadingStats, setLoadingStats] = useState(true);
  const [stats, setStats] = useState({ ngayCong: 0, ngayPhep: 0, luongThangTruoc: 0, ngayLeConLai: 0 });
  const [latestPayslip, setLatestPayslip] = useState<any>(null);

  /* ---- recent attendance ---- */
  const [recentAttendance, setRecentAttendance] = useState<any[]>([]);

  /* ---- holidays for calendar ---- */
  const [holidays, setHolidays] = useState<NgayLe[]>([]);

  /* ---- modals ---- */
  const [checkInOpen,   setCheckInOpen]   = useState(false);
  const [leaveOpen,     setLeaveOpen]     = useState(false);
  const [otOpen,        setOtOpen]        = useState(false);
  const [payslipOpen,   setPayslipOpen]   = useState(false);
  const [selectedPayslip, setSelectedPayslip] = useState<any>(null);

  /* ---- forms ---- */
  const [leaveForm] = Form.useForm();
  const [otForm]    = Form.useForm();
  const [leaveTypes,      setLeaveTypes]      = useState<any[]>([]);
  const [submittingLeave, setSubmittingLeave] = useState(false);
  const [submittingOT,    setSubmittingOT]    = useState(false);

  /* ================================================================ */
  useEffect(() => {
    fetchAll();
    fetchLeaveTypes();
    fetchHolidays();
  }, []);

  const fetchHolidays = async () => {
    try {
      const data = await systemService.getHolidays();
      setHolidays(data);
    } catch {}
  };

  const fetchAll = async () => {
    try {
      const now   = dayjs();
      const start = now.startOf("month").format("YYYY-MM-DD");
      const end   = now.endOf("month").format("YYYY-MM-DD");

      const [attRes, leaveRes, payRes, holRes] = await Promise.allSettled([
        api.get(`/cham-cong/lich-su?startDate=${start}&endDate=${end}`),
        api.get(`/nghi-phep/so-du?year=${now.year()}`),
        api.get("/luong/phieu-luong-cua-toi"),
        api.get("/system/holidays"),
      ]);

      const extract = (r: any) =>
        r.status === "fulfilled"
          ? Array.isArray(r.value) ? r.value : r.value?.data || []
          : [];

      const attRecords: any[] = extract(attRes);
      const ngayCong   = new Set(attRecords.map((r) => r.NgayChamCong?.split("T")[0])).size;
      const balances: any[]   = extract(leaveRes);
      const ngayPhep   = balances.reduce((s, b) => s + (b.TongNgayPhep - b.DaSuDung), 0);
      const payslips: any[]   = extract(payRes);
      const validPayslips     = (payslips || []).filter((p: any) => (p.LuongThucNhan ?? 0) > 0);
      const latest            = validPayslips[0] || payslips[0] || null;
      const luongThangTruoc   = latest?.LuongThucNhan ?? 0;
      const allHolidays: any[]= extract(holRes);
      const ngayLeConLai       = allHolidays.filter((h) => dayjs(h.NgayLe ?? h.NgayBatDau).isAfter(now)).length;

      /* recent attendance – last 5 */
      const recent = attRecords
        .sort((a, b) => dayjs(b.NgayChamCong).unix() - dayjs(a.NgayChamCong).unix())
        .slice(0, 5)
        .map((item) => ({
          id:        item.Id,
          date:      dayjs(item.NgayChamCong ?? item.NgayLamViec).format("DD/MM"),
          checkIn:   item.GioVao  ? dayjs(item.GioVao).format("HH:mm")  : "—",
          checkOut:  item.GioRa   ? dayjs(item.GioRa).format("HH:mm")   : "—",
          workHours: item.SoGioLam ?? 0,
          status:    mapBackendStatus(item.TrangThai),
        }));

      if (latest) {
        setSelectedPayslip(latest);
        setLatestPayslip(latest);
      }

      setStats({ ngayCong, ngayPhep, luongThangTruoc, ngayLeConLai });
      setRecentAttendance(recent);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingStats(false);
    }
  };

  const fetchLeaveTypes = async () => {
    try {
      const types = await LeaveService.getLeaveTypes();
      setLeaveTypes(types || []);
    } catch {}
  };

  /* ---- submit leave ---- */
  const handleSubmitLeave = async (values: any) => {
    setSubmittingLeave(true);
    try {
      const [s, e] = values.dateRange;
      await LeaveService.applyLeave({
        MaLoaiPhepId: values.MaLoaiPhepId,
        NgayBatDau:   s.format("YYYY-MM-DD"),
        NgayKetThuc:  e.format("YYYY-MM-DD"),
        TongSoNgay:   values.TongSoNgay,
        LyDo:         values.LyDo,
      });
      message.success("Đã gửi đơn xin nghỉ phép!");
      leaveForm.resetFields();
      setLeaveOpen(false);
    } catch (err: any) {
      message.error(err?.message || "Không thể gửi đơn.");
    } finally {
      setSubmittingLeave(false);
    }
  };

  /* ---- submit OT ---- */
  const handleSubmitOT = async (values: any) => {
    setSubmittingOT(true);
    try {
      await AttendanceService.registerOT({
        NgayLamThem: values.NgayLamThem.format("YYYY-MM-DD"),
        GioBatDau:   values.GioBatDau.format("HH:mm"),
        GioKetThuc:  values.GioKetThuc.format("HH:mm"),
        TongSoGio:   values.TongSoGio,
        LyDo:        values.LyDo,
      });
      message.success("Đã gửi đơn làm thêm giờ!");
      otForm.resetFields();
      setOtOpen(false);
    } catch (err: any) {
      message.error(err?.message || "Không thể gửi đơn.");
    } finally {
      setSubmittingOT(false);
    }
  };

  const handleOTTimeChange = () => {
    const s = otForm.getFieldValue("GioBatDau");
    const e = otForm.getFieldValue("GioKetThuc");
    if (s && e) {
      const diff = e.diff(s, "minute") / 60;
      otForm.setFieldsValue({ TongSoGio: diff > 0 ? parseFloat(diff.toFixed(2)) : 0 });
    }
  };

  /* ============================================================ */
  /* RENDER                                                         */
  /* ============================================================ */
  const quickActions = [
    { label: "Chấm công vào/ra",        onClick: () => setCheckInOpen(true),  color: "#1677ff" },
    { label: "Gửi đơn nghỉ phép",       onClick: () => setLeaveOpen(true),    color: "#52c41a" },
    { label: "Đăng ký làm thêm giờ",    onClick: () => setOtOpen(true),       color: "#faad14" },
    { label: "Xem phiếu lương",          onClick: () => setPayslipOpen(true),  color: "#722ed1" },
  ];

  return (
    <div style={{ padding: 0 }}>
      {/* ── Heading ── */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 32, fontWeight: 900, color: "#1e293b", letterSpacing: "-0.5px", margin: 0 }}>
          Xin chào!
        </h1>
        <p style={{ fontSize: 16, color: "#64748b", fontWeight: 500, margin: "4px 0 0 0" }}>
          Dưới đây là tổng quan các thông tin cá nhân của bạn.
        </p>
      </div>

      {loadingStats ? (
        <div style={{ textAlign: "center", padding: "50px 0" }}>
          <Spin size="large" />
        </div>
      ) : (
        <>
          {/* ── Stats cards ── */}
          <Row gutter={[24, 24]} style={{ marginBottom: 32 }}>
            <Col xs={24} sm={12} lg={6}>
              <StatsCard label="Ngày công tháng này" value={`${stats.ngayCong} / 22`} color="#1677ff" bg="#e6f4ff" />
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <StatsCard label="Ngày phép còn lại" value={`${stats.ngayPhep} ngày`} color="#52c41a" bg="#f6ffed" />
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <StatsCard label="Lương tháng gần nhất" value={`${fmt(stats.luongThangTruoc)}`} color="#faad14" bg="#fffbe6" />
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <StatsCard label="Ngày lễ sắp tới" value={`${stats.ngayLeConLai} dịp`} color="#ff4d4f" bg="#fff2f0" />
            </Col>
          </Row>

          <Row gutter={[24, 24]}>
            {/* ── LEFT col: Holiday Calendar ── */}
            <Col xs={24} lg={15}>
              <Card
                bordered={true}
                style={{ borderRadius: 16 }}
                styles={{ body: { padding: 0 } }}
                title={<span style={{ fontWeight: 700, fontSize: 15 }}>Lịch ngày lễ</span>}
              >
                <HolidayCalendar holidays={holidays} height={600} />
              </Card>
            </Col>

            {/* ── RIGHT col: Quick actions & Recent Attendance ── */}
            <Col xs={24} lg={9} style={{ display: "flex", flexDirection: "column", gap: 24 }}>
              {/* Quick actions */}
              <Card
                bordered={true}
                style={{ borderRadius: 16 }}
                styles={{ body: { padding: "20px 24px" } }}
                title={<span style={{ fontWeight: 700, fontSize: 15 }}>Thao tác nhanh</span>}
              >
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {quickActions.map((a) => (
                    <button
                      key={a.label}
                      onClick={a.onClick}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                        padding: "14px 18px",
                        borderRadius: 12,
                        border: "1px solid #e8e8e8",
                        background: "#fff",
                        cursor: "pointer",
                        textAlign: "left",
                        fontSize: 14,
                        fontWeight: 500,
                        color: "#262626",
                        transition: "all 0.2s",
                        width: "100%",
                      }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLButtonElement).style.borderColor = a.color;
                        (e.currentTarget as HTMLButtonElement).style.background = `${a.color}08`;
                        (e.currentTarget as HTMLButtonElement).style.transform = "translateX(4px)";
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLButtonElement).style.borderColor = "#e8e8e8";
                        (e.currentTarget as HTMLButtonElement).style.background = "#fff";
                        (e.currentTarget as HTMLButtonElement).style.transform = "none";
                      }}
                    >
                      <span style={{ flex: 1 }}>{a.label}</span>
                      <RightOutlined style={{ color: "#bfbfbf", fontSize: 12 }} />
                    </button>
                  ))}
                </div>
              </Card>

              {/* Lương tháng gần nhất */}
              <Card
                bordered={true}
                style={{ borderRadius: 16 }}
                styles={{ body: { padding: "20px 24px" } }}
                title={
                  <Space>
                    <DollarOutlined style={{ color: "#faad14" }} />
                    <span style={{ fontWeight: 700, fontSize: 15 }}>Lương tháng gần nhất</span>
                  </Space>
                }
                extra={
                  latestPayslip && (
                    <Tag color="warning" style={{ borderRadius: 6, fontWeight: 600 }}>
                      Tháng {latestPayslip.Thang}/{latestPayslip.Nam}
                    </Tag>
                  )
                }
              >
                {!latestPayslip ? (
                  <div style={{ textAlign: "center", padding: "16px 0", color: "#64748b" }}>
                    Chưa có dữ liệu phiếu lương nào được ghi nhận.
                  </div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                    {/* Tổng thực lĩnh */}
                    <div style={{
                      textAlign: "center",
                      padding: "16px",
                      background: "#fffbe6",
                      borderRadius: 12,
                      border: "1px solid #ffe58f"
                    }}>
                      <div style={{ fontSize: 12, color: "#d46b08", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                        Thực Lĩnh Nhận Được
                      </div>
                      <div style={{ fontSize: 24, fontWeight: 800, color: "#d46b08", marginTop: 4 }}>
                        {fmt(Number(latestPayslip.LuongThucNhan))}
                      </div>
                    </div>

                    {/* Chi tiết cơ cấu lương */}
                    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
                        <span style={{ color: "#64748b" }}>Lương cơ bản:</span>
                        <span style={{ fontWeight: 600, color: "#1e293b" }}>{fmt(Number(latestPayslip.LuongCoBan))}</span>
                      </div>
                      
                      {Number(latestPayslip.PhuCap) > 0 && (
                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
                          <span style={{ color: "#64748b" }}>Phụ cấp:</span>
                          <span style={{ fontWeight: 600, color: "#1e293b" }}>{fmt(Number(latestPayslip.PhuCap))}</span>
                        </div>
                      )}

                      {Number(latestPayslip.TienLamThem) > 0 && (
                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
                          <span style={{ color: "#64748b" }}>Lương tăng ca (OT):</span>
                          <span style={{ fontWeight: 600, color: "#22c55e" }}>+{fmt(Number(latestPayslip.TienLamThem))}</span>
                        </div>
                      )}

                      {(Number(latestPayslip.BaoHiemXaHoi) + Number(latestPayslip.BaoHiemYTe) + Number(latestPayslip.BaoHiemThatNghiep)) > 0 && (
                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
                          <span style={{ color: "#64748b" }}>Khấu trừ bảo hiểm:</span>
                          <span style={{ fontWeight: 600, color: "#ef4444" }}>
                            -{fmt(Number(latestPayslip.BaoHiemXaHoi) + Number(latestPayslip.BaoHiemYTe) + Number(latestPayslip.BaoHiemThatNghiep))}
                          </span>
                        </div>
                      )}

                      {Number(latestPayslip.ThueTNCN) > 0 && (
                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
                          <span style={{ color: "#64748b" }}>Thuế TNCN:</span>
                          <span style={{ fontWeight: 600, color: "#ef4444" }}>-{fmt(Number(latestPayslip.ThueTNCN))}</span>
                        </div>
                      )}

                      {Number(latestPayslip.KhauTruDiMuon) > 0 && (
                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
                          <span style={{ color: "#64748b" }}>Khấu trừ đi muộn/về sớm:</span>
                          <span style={{ fontWeight: 600, color: "#ef4444" }}>-{fmt(Number(latestPayslip.KhauTruDiMuon))}</span>
                        </div>
                      )}
                    </div>

                    {/* Nút xem chi tiết */}
                    <Button
                      type="default"
                      icon={<HistoryOutlined />}
                      onClick={() => setPayslipOpen(true)}
                      style={{
                        width: "100%",
                        borderRadius: 10,
                        fontWeight: 600,
                        marginTop: 4,
                        borderColor: "#faad14",
                        color: "#d46b08",
                        backgroundColor: "#fffbe6"
                      }}
                    >
                      Xem chi tiết phiếu lương
                    </Button>
                  </div>
                )}
              </Card>

              {/* Recent Attendance */}
              <Card
                bordered={true}
                style={{ borderRadius: 16 }}
                styles={{ body: { padding: "20px 24px" } }}
                title={<span style={{ fontWeight: 700, fontSize: 15 }}>Chấm công gần đây</span>}
                extra={
                  <Button type="link" size="small" onClick={() => router.push("/staff/cham-cong")} style={{ padding: 0, fontWeight: 600 }}>
                    Xem tất cả <RightOutlined />
                  </Button>
                }
              >
                {recentAttendance.length === 0 ? (
                  <Text type="secondary" style={{ fontSize: 13 }}>Chưa có dữ liệu chấm công.</Text>
                ) : (
                  <div style={{ overflowX: "auto" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                      <thead>
                        <tr style={{ background: "#f8fafc" }}>
                          {["Ngày", "Vào", "Ra", "Trạng thái"].map((h) => (
                            <th key={h} style={{ padding: "8px 12px", textAlign: "left", fontWeight: 600, color: "#64748b", fontSize: 12, textTransform: "uppercase", borderBottom: "1px solid #e8e8e8" }}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {recentAttendance.map((row, idx) => (
                          <tr key={row.id} style={{ background: idx % 2 === 0 ? "#fff" : "#fafafa" }}>
                            <td style={{ padding: "10px 12px", fontWeight: 600, color: "#262626", borderBottom: "1px solid #f0f0f0" }}>{row.date}</td>
                            <td style={{ padding: "10px 12px", borderBottom: "1px solid #f0f0f0" }}>{row.checkIn}</td>
                            <td style={{ padding: "10px 12px", borderBottom: "1px solid #f0f0f0" }}>{row.checkOut}</td>
                            <td style={{ padding: "10px 12px", borderBottom: "1px solid #f0f0f0" }}>
                              <Tag color={statusConfig[row.status]?.color} style={{ margin: 0 }}>
                                {statusConfig[row.status]?.label}
                              </Tag>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </Card>
            </Col>
          </Row>
        </>
      )}

      {/* ═══════════════ MODALS ═══════════════ */}

      {/* Check-in modal */}
      <CheckInModal open={checkInOpen} onClose={() => setCheckInOpen(false)} onSuccess={fetchAll} />

      {/* Leave modal */}
      <Modal
        title={<span style={{ fontWeight: 700, fontSize: 17 }}>Tạo Đơn Xin Nghỉ Phép</span>}
        open={leaveOpen}
        onCancel={() => { setLeaveOpen(false); leaveForm.resetFields(); }}
        footer={null}
        width={640}
        centered
        destroyOnClose
      >
        <Form form={leaveForm} layout="vertical" onFinish={handleSubmitLeave} initialValues={{ TongSoNgay: 1 }} style={{ marginTop: 16 }}>
          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item name="MaLoaiPhepId" label="Loại nghỉ phép" rules={[{ required: true, message: "Vui lòng chọn loại phép" }]}>
                <Select placeholder="Chọn loại phép" options={leaveTypes.map((t) => ({ value: t.Id, label: t.TenLoaiPhep }))} />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item name="dateRange" label="Thời gian nghỉ" rules={[{ required: true, message: "Vui lòng chọn thời gian" }]}>
                <RangePicker
                  style={{ width: "100%" }} format="DD/MM/YYYY"
                  onChange={(dates) => {
                    if (dates?.[0] && dates?.[1])
                      leaveForm.setFieldsValue({ TongSoNgay: dates[1].diff(dates[0], "day") + 1 });
                  }}
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item name="TongSoNgay" label="Tổng số ngày nghỉ" rules={[{ required: true }]}>
                <InputNumber min={0.5} step={0.5} style={{ width: "100%" }} addonAfter="ngày" />
              </Form.Item>
            </Col>
            <Col xs={24}>
              <Form.Item name="LyDo" label="Lý do nghỉ" rules={[{ required: true, message: "Vui lòng nhập lý do" }]}>
                <TextArea rows={3} placeholder="Nhập lý do xin nghỉ chi tiết..." />
              </Form.Item>
            </Col>
          </Row>
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
            <Button onClick={() => { setLeaveOpen(false); leaveForm.resetFields(); }}>Hủy</Button>
            <Button type="primary" htmlType="submit" loading={submittingLeave}>Gửi đơn nghỉ</Button>
          </div>
        </Form>
      </Modal>

      {/* OT modal */}
      <Modal
        title={<span style={{ fontWeight: 700, fontSize: 17 }}>Đăng Ký Làm Thêm Giờ</span>}
        open={otOpen}
        onCancel={() => { setOtOpen(false); otForm.resetFields(); }}
        footer={null}
        width={620}
        centered
        destroyOnClose
      >
        <Form form={otForm} layout="vertical" onFinish={handleSubmitOT} style={{ marginTop: 16 }}>
          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item name="NgayLamThem" label="Ngày làm thêm" rules={[{ required: true, message: "Vui lòng chọn ngày" }]}>
                <DatePicker style={{ width: "100%" }} format="DD/MM/YYYY" />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item name="GioBatDau" label="Giờ bắt đầu" rules={[{ required: true, message: "Chọn giờ bắt đầu" }]}>
                <DatePicker.TimePicker format="HH:mm" style={{ width: "100%" }} minuteStep={15} onChange={handleOTTimeChange} />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item name="GioKetThuc" label="Giờ kết thúc" rules={[{ required: true, message: "Chọn giờ kết thúc" }]}>
                <DatePicker.TimePicker format="HH:mm" style={{ width: "100%" }} minuteStep={15} onChange={handleOTTimeChange} />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item name="TongSoGio" label="Tổng số giờ" rules={[{ required: true }]}>
                <InputNumber min={0.5} step={0.5} style={{ width: "100%" }} addonAfter="giờ" />
              </Form.Item>
            </Col>
            <Col xs={24}>
              <Form.Item name="LyDo" label="Công việc thực hiện" rules={[{ required: true, message: "Vui lòng mô tả công việc" }]}>
                <TextArea rows={3} placeholder="Mô tả chi tiết công việc..." />
              </Form.Item>
            </Col>
          </Row>
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
            <Button onClick={() => { setOtOpen(false); otForm.resetFields(); }}>Hủy</Button>
            <Button type="primary" htmlType="submit" loading={submittingOT} style={{ background: token.colorWarning, borderColor: token.colorWarning }}>
              Gửi đơn OT
            </Button>
          </div>
        </Form>
      </Modal>

      {/* Payslip modal */}
      {selectedPayslip ? (
        <PayrollDetailModal
          visible={payslipOpen}
          onClose={() => setPayslipOpen(false)}
          data={selectedPayslip}
        />
      ) : (
        <Modal
          title={<span style={{ fontWeight: 700, fontSize: 17 }}>Phiếu lương</span>}
          open={payslipOpen}
          onCancel={() => setPayslipOpen(false)}
          footer={<Button onClick={() => { setPayslipOpen(false); router.push("/staff/phieu-luong"); }}>Xem tất cả phiếu lương →</Button>}
          centered
        >
          <Text type="secondary">Chưa có phiếu lương nào. Hãy kiểm tra trang phiếu lương để biết thêm.</Text>
        </Modal>
      )}
    </div>
  );
}
