"use client";

import { Typography, Tag, Row, Col, Tabs, DatePicker, Space } from "antd";
import { 
  MinusCircleOutlined, 
  ClockCircleOutlined, 
  CheckCircleOutlined, 
  FileTextOutlined,
  DashboardOutlined 
} from "@ant-design/icons";
import Table from "@/components/shared/Table/Table";
import { Table as AntTable } from "antd";
import StatsCard from "@/components/shared/StatsCard/StatsCard";
import type { TableColumnsType } from "antd";
import Button from "@/components/shared/Button/Button";
import { CheckInModal } from "@/components/attendance/CheckInModal";
import { useState, useEffect, useMemo } from "react";
import { AttendanceService } from "@/services/attendance.service";
import dayjs from "dayjs";

const { RangePicker } = DatePicker;
const { Text } = Typography;

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
        workHours: item.SoGioLam || 0,
        late: item.SoPhutDiMuon || 0,
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
    { title: "Số giờ", dataIndex: "workHours", key: "workHours", render: (h) => `${h}h` },
    { title: "Muộn", dataIndex: "late", key: "late", render: (m) => m > 0 ? `${m} phút` : "-" },
    {
      title: "Trạng thái", dataIndex: "status", key: "status",
      render: (s: string) => <Tag color={statusConfig[s]?.color}>{statusConfig[s]?.label}</Tag>,
    },
  ];

  const mainStats = [
    { label: "Có mặt", value: history.filter(h => h.status === 'on-time').length, icon: <CheckCircleOutlined />, color: "var(--success-color)", bg: "#f6ffed" },
    { label: "Đi muộn", value: history.filter(h => h.status === 'late').length, icon: <ClockCircleOutlined />, color: "var(--warning-color)", bg: "#fff7e6" },
    { label: "Vắng mặt", value: history.filter(h => h.status === 'absent').length, icon: <MinusCircleOutlined />, color: "var(--error-color)", bg: "#fff1f0" },
    { label: "Nghỉ phép", value: history.filter(h => h.status === 'on-leave').length, icon: <FileTextOutlined />, color: "var(--info-color)", bg: "#e6f7ff" },
  ];

  const totalHoursStat = { 
    label: "Tổng giờ", 
    value: `${history.reduce((a, b) => a + (b.workHours || 0), 0).toFixed(1)} h`, 
    icon: <DashboardOutlined />, 
    color: "#9c074fff", 
    bg: "#fcedf2ff" 
  };

  const summaryData = useMemo(() => {
    // ... logic giữ nguyên
    const totalHours = history.reduce((acc, curr) => acc + parseFloat(curr.workHours || 0), 0);
    const totalLate = history.reduce((acc, curr) => acc + (curr.late || 0), 0);
    const lateDays = history.filter(h => h.status === 'late').length;
    const workDays = history.filter(h => h.status === 'on-time' || h.status === 'late').length;

    return [{
      key: '1',
      month: dateRange[0].format('MM/YYYY'),
      totalWorkHours: totalHours.toFixed(1),
      totalLateMinutes: totalLate,
      lateDays: lateDays,
      workDays: workDays
    }];
  }, [history, dateRange]);

  const summaryColumns = [
    { title: "Tháng", dataIndex: "month", key: "month" },
    { title: "Tổng ngày công", dataIndex: "workDays", key: "workDays" },
    { title: "Tổng giờ làm", dataIndex: "totalWorkHours", key: "totalWorkHours", render: (h: string) => <b>{h}h</b> },
    { title: "Số ngày đi muộn", dataIndex: "lateDays", key: "lateDays", render: (d: number) => <span style={{ color: '#ff4d4f', fontWeight: 600 }}>{d} ngày</span> },
    { title: "Tổng phút muộn", dataIndex: "totalLateMinutes", key: "totalLateMinutes", render: (m: number) => <span style={{ color: m > 0 ? '#ff4d4f' : '#52c41a' }}>{m} phút</span> },
  ];

  const tabItems = [
    // ... logic giữ nguyên
    {
      key: '1',
      label: 'Nhật ký chấm công',
      children: (
        <Table<any>
          columns={columns}
          dataSource={history}
          loading={loading}
          pagination={{ pageSize: 10 }}
          searchable={false}
          rowKey="id"
          scroll={{ x: 'max-content' }}
        />
      )
    },
    {
      key: '2',
      label: 'Tổng hợp tháng',
      children: (
        <div style={{ marginTop: 8 }}>
          <div style={{ marginBottom: 16 }}>
            <Text type="secondary">Thống kê dữ liệu từ <b style={{ color: '#cb1414' }}>{dateRange[0].format('DD/MM/YYYY')}</b> đến <b style={{ color: '#cb1414' }}>{dateRange[1].format('DD/MM/YYYY')}</b></Text>
          </div>
          <AntTable 
            columns={summaryColumns} 
            dataSource={summaryData} 
            pagination={false}
            rowKey="month"
            scroll={{ x: 'max-content' }}
          />
        </div>
      )
    }
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
            onClick={() => setIsCheckInModalVisible(true)}
            style={{ height: '40px', padding: '0 24px', fontWeight: 600, borderRadius: '8px' }}
          >
            Điểm danh ngay
          </Button>
        </div>
      </div>

      {/* 4 Thẻ chính trên 1 hàng */}
      <Row gutter={[16, 16]} style={{ marginBottom: 20 }}>
        {mainStats.map((item, idx) => (
          <Col xs={12} sm={6} key={idx}>
            <StatsCard {...item} />
          </Col>
        ))}
      </Row>

      {/* Bộ lọc + Tổng giờ (Không bọc xám, Tổng giờ lên đầu) */}
      <div style={{ 
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "24px",
        padding: "0 4px"
      }}>
        <Space size="large" align="center">
          <div style={{ width: 'calc(25% - 12px)', minWidth: '250px' }}>
            <StatsCard {...totalHoursStat} />
          </div>
          <Space align="center" style={{ marginTop: -4 }}>
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
        </Space>
        
        <Button 
          type="primary" 
          style={{ 
            background: '#cb1414', 
            borderColor: '#cb1414',
            borderRadius: '8px',
            fontSize: '12px',
            height: '32px',
            padding: '0 12px'
          }}
        >
          Hiển thị {history.length} bản ghi
        </Button>
      </div>

      <Tabs defaultActiveKey="1" items={tabItems} style={{ marginTop: 8 }} />

      <CheckInModal 
        open={isCheckInModalVisible} 
        onClose={() => setIsCheckInModalVisible(false)} 
        onSuccess={fetchHistory}
      />
    </div>
  );
}
