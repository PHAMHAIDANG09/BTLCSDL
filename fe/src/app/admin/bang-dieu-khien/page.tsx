"use client";

import { useEffect, useState } from "react";
import { Row, Col, Card, Typography, Alert, Skeleton, List, Button, Tag, Space, Tooltip, message } from "antd";
import {
  TeamOutlined,
  ClockCircleOutlined,
  FileTextOutlined,
  WarningOutlined,
  CheckOutlined,
  CloseOutlined,
  FileProtectOutlined,
} from "@ant-design/icons";
import dashboardService, { type DashboardStats } from "@/services/dashboard.service";
import { AttendanceService } from "@/services/attendance.service";
import { LeaveService } from "@/services/leave.service";
import { getExpiringContractsApi } from "@/services/employee.service";
import StatsCard from "@/components/shared/StatsCard/StatsCard";
import EmployeeChart from "./_components/EmployeeChart";
import PayrollChart from "./_components/PayrollChart";
import Link from "next/link";
import dayjs from "dayjs";

const { Title, Text } = Typography;

const STAT_CARDS = [
  {
    key: "totalEmployees",
    title: "Tổng số",
    icon: <TeamOutlined />,
    color: "var(--primary-color)",
    bg: "var(--primary-bg)",
  },
  {
    key: "presentToday",
    title: "Có mặt hôm nay",
    icon: <ClockCircleOutlined />,
    color: "var(--success-color)",
    bg: "#f6ffed",
  },
  {
    key: "pendingLeaves",
    title: "Đơn chờ duyệt",
    icon: <FileTextOutlined />,
    color: "var(--warning-color)",
    bg: "#fff7e6",
  },
  {
    key: "expiringContracts",
    title: "HĐ sắp hết hạn",
    icon: <WarningOutlined />,
    color: "var(--info-color)",
    bg: "#e6f7ff",
  },
];

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [pendingOT, setPendingOT] = useState(0);
  const [pendingRequests, setPendingRequests] = useState<any[]>([]);
  const [expiringContractsList, setExpiringContractsList] = useState<any[]>([]);
  const [actionLoading, setActionLoading] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchPendingRequests = async () => {
    try {
      const [leavesData, otsData] = await Promise.all([
        LeaveService.getAllLeaveRequests("Pending"),
        AttendanceService.getAllOTRequests("Pending"),
      ]);

      const leaves = (leavesData || []).map((l: any) => ({
        id: l.Id,
        type: "leave",
        employeeName: l.nhanVien?.HoTen || "Nhân viên",
        requestType: l.loaiNghiPhep?.TenLoaiPhep || "Nghỉ phép",
        details: `${dayjs(l.NgayBatDau).format("DD/MM/YYYY")} - ${dayjs(l.NgayKetThuc).format("DD/MM/YYYY")} (${l.TongSoNgay} ngày)`,
        reason: l.LyDo || "Không có lý do",
        date: l.NgayTao || l.NgayBatDau,
      }));

      const ots = (otsData || []).map((o: any) => ({
        id: o.Id,
        type: "ot",
        employeeName: o.nhanVien?.HoTen || "Nhân viên",
        requestType: "Làm thêm giờ",
        details: `${dayjs(o.NgayLamThem).format("DD/MM/YYYY")} (${o.GioBatDau} - ${o.GioKetThuc}: ${o.TongSoGio} giờ)`,
        reason: o.LyDo || "Không có lý do",
        date: o.NgayTao || o.NgayLamThem,
      }));

      const combined = [...leaves, ...ots].sort(
        (a, b) => dayjs(b.date).unix() - dayjs(a.date).unix()
      );
      setPendingRequests(combined);
    } catch (error) {
      console.error("Failed to fetch pending requests:", error);
    }
  };

  const fetchExpiringContracts = async () => {
    try {
      const data = await getExpiringContractsApi();
      setExpiringContractsList(data || []);
    } catch (error) {
      console.error("Failed to fetch expiring contracts:", error);
    }
  };

  useEffect(() => {
    Promise.all([
      dashboardService.getStats(),
      AttendanceService.getAllOTRequests("Pending"),
    ])
      .then(([statsData, otData]) => {
        setStats(statsData);
        setPendingOT(otData ? otData.length : 0);
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));

    fetchPendingRequests();
    fetchExpiringContracts();
  }, []);

  const handleApprove = async (id: number, type: "leave" | "ot") => {
    const key = `${type}-${id}`;
    setActionLoading((prev) => ({ ...prev, [key]: true }));
    try {
      if (type === "leave") {
        await LeaveService.approveLeave(id, "Approved");
        message.success("Đã duyệt đơn nghỉ phép");
      } else {
        await AttendanceService.approveOT(id, "Approved");
        message.success("Đã duyệt đơn làm thêm giờ");
      }
      const statsData = await dashboardService.getStats();
      const otData = await AttendanceService.getAllOTRequests("Pending");
      setStats(statsData);
      setPendingOT(otData ? otData.length : 0);
      await fetchPendingRequests();
    } catch (error: any) {
      message.error("Thao tác thất bại: " + (error?.message || "Lỗi hệ thống"));
    } finally {
      setActionLoading((prev) => ({ ...prev, [key]: false }));
    }
  };

  const handleReject = async (id: number, type: "leave" | "ot") => {
    const key = `${type}-${id}`;
    setActionLoading((prev) => ({ ...prev, [key]: true }));
    try {
      if (type === "leave") {
        await LeaveService.approveLeave(id, "Rejected", "Không phê duyệt từ Dashboard");
        message.success("Đã từ chối đơn nghỉ phép");
      } else {
        await AttendanceService.approveOT(id, "Rejected");
        message.success("Đã từ chối đơn làm thêm giờ");
      }
      const statsData = await dashboardService.getStats();
      const otData = await AttendanceService.getAllOTRequests("Pending");
      setStats(statsData);
      setPendingOT(otData ? otData.length : 0);
      await fetchPendingRequests();
    } catch (error: any) {
      message.error("Thao tác thất bại: " + (error?.message || "Lỗi hệ thống"));
    } finally {
      setActionLoading((prev) => ({ ...prev, [key]: false }));
    }
  };

  return (
    <div>
      {/* ── Tiêu đề ── */}
      <div style={{ marginBottom: 24 }}>
        <Title level={2} style={{ margin: 0, fontWeight: 800, color: "#111827" }}>
          Dashboard
        </Title>
      </div>

      {error && (
        <Alert
          type="warning"
          message="Không thể tải số liệu. Kiểm tra kết nối backend."
          showIcon
          closable
          style={{ marginBottom: 16, borderRadius: 10 }}
        />
      )}

      {/* ── Thẻ thống kê ── */}
      <Row gutter={[16, 16]} style={{ marginBottom: 20 }}>
        {STAT_CARDS.map((card) => {
          let value = stats ? (stats as any)[card.key] : undefined;
          if (card.key === "pendingLeaves" && value !== undefined) {
            value += pendingOT;
          }

          return (
            <Col key={card.key} xs={24} sm={12} xl={6}>
              <StatsCard
                label={card.title}
                value={loading ? "..." : (value ?? 0).toLocaleString("vi-VN")}
                color={card.color}
                bg={card.bg}
                icon={card.icon}
              />
            </Col>
          );
        })}
      </Row>

      {/* ── Container đơn chờ duyệt nhanh & Hợp đồng sắp hết hạn ── */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} xl={12}>
          <Card
            bordered={true}
            title={
              <Space>
                <FileTextOutlined style={{ color: "var(--warning-color)" }} />
                <span className="font-bold">Danh sách Đơn chờ duyệt</span>
                {pendingRequests.length > 0 && (
                  <Tag color="warning" className="ml-2 font-bold" style={{ borderRadius: 6 }}>
                    {pendingRequests.length} đơn
                  </Tag>
                )}
              </Space>
            }
            extra={
              <Space style={{ fontSize: "13px" }}>
                <Link href="/admin/nghi-phep" className="text-blue-600 hover:text-blue-800 font-medium">Nghỉ phép</Link>
                <span className="text-gray-300">|</span>
                <Link href="/admin/lam-them-gio" className="text-blue-600 hover:text-blue-800 font-medium">Làm thêm</Link>
              </Space>
            }
            className="rounded-lg"
            styles={{ body: { padding: "16px 24px", maxHeight: "350px", overflowY: "auto" } }}
          >
            {pendingRequests.length === 0 ? (
              <div className="py-8 text-center text-gray-500">
                Không có đơn nghỉ phép hoặc làm thêm giờ nào đang chờ phê duyệt.
              </div>
            ) : (
              <List
                itemLayout="horizontal"
                dataSource={pendingRequests}
                renderItem={(item) => (
                  <List.Item
                    actions={[
                      <Tooltip title="Phê duyệt" key="approve">
                        <Button
                          type="primary"
                          shape="circle"
                          icon={<CheckOutlined />}
                          onClick={() => handleApprove(item.id, item.type)}
                          loading={actionLoading[`${item.type}-${item.id}`]}
                          style={{ backgroundColor: "var(--success-color)", borderColor: "var(--success-color)" }}
                          size="small"
                        />
                      </Tooltip>,
                      <Tooltip title="Từ chối" key="reject">
                        <Button
                          type="primary"
                          danger
                          shape="circle"
                          icon={<CloseOutlined />}
                          onClick={() => handleReject(item.id, item.type)}
                          loading={actionLoading[`${item.type}-${item.id}`]}
                          size="small"
                        />
                      </Tooltip>,
                    ]}
                  >
                    <List.Item.Meta
                      title={
                        <Space size={8}>
                          <span className="font-bold text-gray-800">{item.employeeName}</span>
                          <Tag color={item.type === "leave" ? "blue" : "orange"} style={{ borderRadius: 4 }}>
                            {item.requestType}
                          </Tag>
                        </Space>
                      }
                      description={
                        <div className="flex flex-col sm:flex-row sm:gap-6 text-xs text-gray-500 mt-1">
                          <div><span className="font-semibold">Chi tiết:</span> {item.details}</div>
                          <div><span className="font-semibold">Lý do:</span> {item.reason}</div>
                        </div>
                      }
                    />
                  </List.Item>
                )}
              />
            )}
          </Card>
        </Col>

        <Col xs={24} xl={12}>
          <Card
            bordered={true}
            title={
              <Space>
                <WarningOutlined style={{ color: "var(--warning-color)" }} />
                <span className="font-bold">Hợp đồng sắp hết hạn (30 ngày)</span>
                {expiringContractsList.length > 0 && (
                  <Tag color="error" className="ml-2 font-bold" style={{ borderRadius: 6 }}>
                    {expiringContractsList.length} HĐ
                  </Tag>
                )}
              </Space>
            }
            extra={
              <Link href="/admin/hop-dong" className="text-blue-600 hover:text-blue-800 font-medium" style={{ fontSize: '13px' }}>
                Xem tất cả
              </Link>
            }
            className="rounded-lg"
            styles={{ body: { padding: "16px 24px", maxHeight: "350px", overflowY: "auto" } }}
          >
            {expiringContractsList.length === 0 ? (
              <div className="py-8 text-center text-gray-500">
                Không có hợp đồng nào sắp hết hạn trong 30 ngày tới.
              </div>
            ) : (
              <List
                itemLayout="horizontal"
                dataSource={expiringContractsList}
                renderItem={(item) => {
                  const today = dayjs().startOf('day');
                  const endDate = dayjs(item.NgayKetThuc).startOf('day');
                  const remainingDays = endDate.diff(today, 'day');
                  const tagColor = remainingDays <= 7 ? "error" : remainingDays <= 15 ? "warning" : "default";

                  return (
                    <List.Item
                      actions={[
                        <Link href="/admin/hop-dong" key="view">
                          <Button type="link" size="small" style={{ fontWeight: 500 }}>
                            Chi tiết
                          </Button>
                        </Link>
                      ]}
                    >
                      <List.Item.Meta
                        avatar={
                          <div style={{
                            width: 36,
                            height: 36,
                            borderRadius: '50%',
                            backgroundColor: '#fffbe6',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            border: '1px solid #ffe58f'
                          }}>
                            <FileProtectOutlined style={{ color: '#d46b08', fontSize: 18 }} />
                          </div>
                        }
                        title={
                          <Space size={8}>
                            <span className="font-bold text-gray-800">{item.nhanVien?.HoTen || "Nhân viên"}</span>
                            <Tag color="orange" style={{ borderRadius: 4, fontWeight: 500 }}>
                              {item.MaHopDong}
                            </Tag>
                          </Space>
                        }
                        description={
                          <div className="flex flex-col sm:flex-row sm:gap-6 text-xs text-gray-500 mt-1">
                            <div><span className="font-semibold">Loại:</span> {item.LoaiHopDong}</div>
                            <div>
                              <span className="font-semibold">Hết hạn:</span>{" "}
                              <span className="text-red-500 font-medium">
                                {dayjs(item.NgayKetThuc).format("DD/MM/YYYY")}
                              </span>{" "}
                              <Tag color={tagColor} style={{ marginLeft: 8, borderRadius: 4, fontWeight: 600 }}>
                                Còn {remainingDays} ngày
                              </Tag>
                            </div>
                          </div>
                        }
                      />
                    </List.Item>
                  );
                }}
              />
            )}
          </Card>
        </Col>
      </Row>

      {/* ── Biểu đồ ── */}
      <Row gutter={[16, 16]}>
        <Col xs={24} xl={12}>
          <EmployeeChart />
        </Col>
        <Col xs={24} xl={12}>
          <PayrollChart />
        </Col>
      </Row>
    </div>
  );
}
