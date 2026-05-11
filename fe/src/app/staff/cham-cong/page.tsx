"use client";

import { Typography, Tag, Row, Col } from "antd";
import { 
  MinusCircleOutlined, 
  ClockCircleOutlined, 
  CheckCircleOutlined, 
  FileTextOutlined,
  DashboardOutlined 
} from "@ant-design/icons";
import Table from "@/components/shared/Table/Table";
import StatsCard from "@/components/shared/StatsCard/StatsCard";
import type { TableColumnsType } from "antd";
import Button from "@/components/shared/Button/Button";
import { CheckInModal } from "@/components/attendance/CheckInModal";
import { useState, useEffect, useMemo } from "react";
import { AttendanceService } from "@/services/attendance.service";
import { DatePicker, Space, Empty } from "antd";
import dayjs from "dayjs";
import { SearchOutlined } from "@ant-design/icons";

const { RangePicker } = DatePicker;

const { Title, Text } = Typography;

interface AttendanceRecord {
  id: string;
  date: string;
  checkIn: string;
  checkOut: string;
  workHours: number;
  lateMinutes: number;
  status: "on-time" | "late" | "absent" | "on-leave";
}

const MOCK_DATA: AttendanceRecord[] = [
  { id: "1", date: "2024-04-27", checkIn: "08:00", checkOut: "17:30", workHours: 8.5, lateMinutes: 0, status: "on-time" },
  { id: "2", date: "2024-04-26", checkIn: "08:15", checkOut: "17:45", workHours: 8.5, lateMinutes: 15, status: "late" },
  { id: "3", date: "2024-04-25", checkIn: "-", checkOut: "-", workHours: 0, lateMinutes: 0, status: "on-leave" },
];

const statusConfig: Record<string, { label: string; color: string }> = {
  "on-time": { label: "Đúng giờ", color: "green" },
  late: { label: "Đi muộn", color: "orange" },
  absent: { label: "Vắng mặt", color: "red" },
  "on-leave": { label: "Nghỉ phép", color: "blue" },
};

export default function StaffAttendancePage() {
  const [isCheckInModalVisible, setIsCheckInModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<any[]>([]);
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs, dayjs.Dayjs]>([
    dayjs().startOf('month'),
    dayjs().endOf('month')
  ]);

  useEffect(() => {
    fetchHistory();
  }, [dateRange]);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const start = dateRange[0].format('YYYY-MM-DD');
      const end = dateRange[1].format('YYYY-MM-DD');
      const data = await AttendanceService.getHistory(start, end);
      
      const mapped = data.map((item: any) => ({
        id: item.Id.toString(),
        date: dayjs(item.NgayLamViec).format("DD/MM/YYYY"),
        checkIn: item.GioVao ? dayjs(item.GioVao).format("HH:mm") : "-",
        checkOut: item.GioRa ? dayjs(item.GioRa).format("HH:mm") : "-",
        workHours: item.SoGioLam ? `${item.SoGioLam}h` : "0h",
        late: item.SoPhutDiMuon ? `${item.SoPhutDiMuon} phút` : "-",
        status: mapBackendStatus(item.TrangThai),
      }));
      setHistory(mapped);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const mapBackendStatus = (status: string): any => {
    switch (status) {
      case 'CoMat': return 'on-time';
      case 'DiMuon': return 'late';
      case 'Vang': return 'absent';
      case 'NghiPhep': return 'on-leave';
      case 'VeSom': return 'late';
      default: return 'on-time';
    }
  };

  const columns: TableColumnsType<any> = [
    { title: "Ngày", dataIndex: "date", key: "date" },
    { title: "Giờ vào", dataIndex: "checkIn", key: "checkIn" },
    { title: "Giờ ra", dataIndex: "checkOut", key: "checkOut" },
    { title: "Số giờ", dataIndex: "workHours", key: "workHours" },
    { title: "Muộn", dataIndex: "late", key: "late" },
    {
      title: "Trạng thái", dataIndex: "status", key: "status",
      render: (s: string) => <Tag color={statusConfig[s]?.color}>{statusConfig[s]?.label}</Tag>,
    },
  ];

  const stats = [
    { label: "Có mặt", value: 2, icon: <CheckCircleOutlined />, color: "var(--success-color)", bg: "#f6ffed" },
    { label: "Đi muộn", value: 2, icon: <ClockCircleOutlined />, color: "var(--warning-color)", bg: "#fff7e6" },
    { label: "Vắng mặt", value: 0, icon: <MinusCircleOutlined />, color: "var(--error-color)", bg: "#fff1f0" },
    { label: "Nghỉ phép", value: 1, icon: <FileTextOutlined />, color: "var(--info-color)", bg: "#e6f7ff" },
    { label: "Tổng giờ", value: "34 h", icon: <DashboardOutlined />, color: "#262626", bg: "#f5f5f5" },
  ];

  return (
    <div style={{ maxWidth: '1600px', margin: '0 auto', padding: '16px' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '30px', fontWeight: 900, color: '#111827', letterSpacing: '-0.025em', margin: 0 }}>
          Chấm công của tôi
        </h1>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '4px' }}>
          <p style={{ color: '#9ca3af', fontWeight: 500, fontSize: '14px', margin: 0 }}>
            Lịch sử chấm công cá nhân và thống kê hiệu suất làm việc
          </p>
          <Button 
            type="primary" 
            size="large" 
            onClick={() => setIsCheckInModalVisible(true)}
            style={{ padding: '0 24px', height: '40px', fontWeight: 'bold' }}
          >
            Điểm danh ngay
          </Button>
        </div>
      </div>

      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        {stats.map((item, idx) => (
          <Col xs={24} sm={12} md={idx === 4 ? 8 : 4} key={idx}>
            <StatsCard 
              label={item.label}
              value={item.value}
              icon={item.icon}
              color={item.color}
              bg={item.bg}
              size="small"
            />
          </Col>
        ))}
      </Row>

      {/* Filter Section - Minimalist */}
      <div style={{ 
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "20px",
      }}>
        <Space size="middle">
          <Text strong>Bộ lọc thời gian:</Text>
          <RangePicker 
            value={dateRange}
            onChange={(dates) => {
              if (dates && dates[0] && dates[1]) {
                setDateRange([dates[0], dates[1]]);
              }
            }}
            format="DD/MM/YYYY"
            style={{ borderRadius: "8px" }}
          />
        </Space>
        <Text type="secondary">
          Hiển thị <b>{history.length}</b> bản ghi
        </Text>
      </div>

      {/* Table Section - Direct */}
      <Table<any>
        columns={columns}
        dataSource={history}
        loading={loading}
        pagination={{ pageSize: 10 }}
        searchable={false}
        rowKey="id"
        scroll={{ x: 'max-content' }}
      />

      <CheckInModal 
        open={isCheckInModalVisible} 
        onClose={() => setIsCheckInModalVisible(false)} 
        onSuccess={fetchHistory}
      />
    </div>
  );
}
