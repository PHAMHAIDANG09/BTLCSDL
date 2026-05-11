"use client";

import { useState, useEffect } from "react";
import {
  Modal,
  message,
  Tabs,
  Table as AntTable,
  DatePicker,
  Space,
  Typography,
  Row,
  Col,
  TimePicker,
  Select,
  Input,
} from "antd";
import {
  ClockCircleOutlined,
  SearchOutlined,
  DashboardOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import AttendanceStats from "./_components/AttendanceStats";
import AttendanceFilter from "./_components/AttendanceFilter";
import AttendanceTable from "./_components/AttendanceTable";
import LateAlert from "./_components/LateAlert";
import Button from "@/components/shared/Button/Button";
import { useRouter } from "next/navigation";
import { CheckInModal } from "@/components/attendance/CheckInModal";
import { AttendanceService } from "@/services/attendance.service";

interface AttendanceRecord {
  id: string;
  employeeName: string;
  employeeCode: string; // Thêm
  date: string;
  checkIn: string;
  checkOut: string;
  workHours: number;
  lateMinutes: number;
  status: "on-time" | "late" | "absent" | "on-leave";
  source: "biometric" | "manual" | "mobile";
  department: string; // Bắt buộc
}

// Mock data
const MOCK_ATTENDANCE: AttendanceRecord[] = [
  {
    id: "1",
    employeeName: "Nguyễn Văn A",
    employeeCode: "NV001",
    date: "2024-04-27",
    checkIn: "08:00",
    checkOut: "17:30",
    workHours: 8.5,
    lateMinutes: 0,
    status: "on-time",
    source: "biometric",
    department: "IT",
  },
  {
    id: "2",
    employeeName: "Trần Thị B",
    employeeCode: "NV002",
    date: "2024-04-27",
    checkIn: "08:15",
    checkOut: "17:45",
    workHours: 8.5,
    lateMinutes: 15,
    status: "late",
    source: "biometric",
    department: "HR",
  },
  {
    id: "3",
    employeeName: "Lê Văn C",
    employeeCode: "NV003",
    date: "2024-04-27",
    checkIn: "-",
    checkOut: "-",
    workHours: 0,
    lateMinutes: 0,
    status: "absent",
    source: "manual",
    department: "Sales",
  },
  {
    id: "4",
    employeeName: "Phạm Hữu D",
    employeeCode: "NV004",
    date: "2024-04-27",
    checkIn: "-",
    checkOut: "-",
    workHours: 0,
    lateMinutes: 0,
    status: "on-leave",
    source: "manual",
    department: "Finance",
  },
  {
    id: "5",
    employeeName: "Vũ Thị E",
    employeeCode: "NV005",
    date: "2024-04-27",
    checkIn: "08:45",
    checkOut: "17:15",
    workHours: 8,
    lateMinutes: 45,
    status: "late",
    source: "mobile",
    department: "IT",
  },
];

interface FilterValues {
  employeeName?: string;
  department?: string;
  status?: string;
  dateRange?: any;
}

export default function AttendancePage() {
  const router = useRouter();
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [filteredData, setFilteredData] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(false);
  
  // State cho báo cáo tổng hợp
  const [summaryData, setSummaryData] = useState<any[]>([]);
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(dayjs());

  const fetchSummary = async (date: dayjs.Dayjs) => {
    setSummaryLoading(true);
    try {
      const data = await AttendanceService.getMonthlySummary(
        date.month() + 1,
        date.year()
      );
      setSummaryData(data);
    } catch (error) {
      console.error(error);
      message.error("Lỗi khi lấy báo cáo tổng hợp");
    } finally {
      setSummaryLoading(false);
    }
  };

  const summaryColumns = [
    { 
      title: 'Nhân viên', 
      key: 'emp', 
      fixed: 'left' as const,
      render: (_: any, record: any) => (
        <div>
          <div style={{ fontWeight: 600, color: '#cb1414ff' }}>{record.employeeName}</div>
          <div style={{ fontSize: '12px', color: '#8c8c8c' }}>{record.employeeCode}</div>
        </div>
      )
    },
    { title: 'Phòng ban', dataIndex: 'department', key: 'department' },
    { 
      title: 'Tổng giờ làm', 
      dataIndex: 'totalWorkHours', 
      key: 'totalWorkHours',
      render: (h: number) => <b>{h.toFixed(1)}h</b>,
      sorter: (a: any, b: any) => a.totalWorkHours - b.totalWorkHours
    },
    { 
      title: 'Tổng phút muộn', 
      dataIndex: 'totalLateMinutes', 
      key: 'totalLateMinutes',
      render: (m: number) => <span style={{ color: m > 0 ? '#ff4d4f' : '#52c41a' }}>{m} phút</span>,
      sorter: (a: any, b: any) => a.totalLateMinutes - b.totalLateMinutes
    },
    { title: 'Số ngày đi muộn', dataIndex: 'lateDays', key: 'lateDays', sorter: (a: any, b: any) => a.lateDays - b.lateDays },
    { title: 'Số ngày về sớm', dataIndex: 'earlyLeaveDays', key: 'earlyLeaveDays' },
    { title: 'Tổng công', dataIndex: 'totalDays', key: 'totalDays' },
  ];
  const [selectedRecord, setSelectedRecord] = useState<AttendanceRecord | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isCheckInModalVisible, setIsCheckInModalVisible] = useState(false);

  useEffect(() => {
    fetchAttendance();
    fetchSummary(currentMonth);
  }, []);

  const fetchAttendance = async (values?: FilterValues) => {
    setLoading(true);
    try {
      // Mặc định lấy dữ liệu trong tháng này nếu không có bộ lọc ngày
      const start = values?.dateRange?.[0] ? values.dateRange[0].format('YYYY-MM-DD') : dayjs().startOf('month').format('YYYY-MM-DD');
      const end = values?.dateRange?.[1] ? values.dateRange[1].format('YYYY-MM-DD') : dayjs().endOf('month').format('YYYY-MM-DD');
      
      const data = await AttendanceService.getAllHistory(start, end);
      
      const mappedData: AttendanceRecord[] = data.map((item: any) => ({
        id: item.Id.toString(),
        employeeName: item.nhanVien?.HoTen || 'Không xác định',
        employeeCode: item.nhanVien?.MaNhanVien || 'N/A', // Thêm mã nhân viên
        date: item.NgayLamViec,
        checkIn: item.GioVao ? dayjs(item.GioVao).format('HH:mm') : '-',
        checkOut: item.GioRa ? dayjs(item.GioRa).format('HH:mm') : '-',
        workHours: item.SoGioLam || 0,
        lateMinutes: item.SoPhutDiMuon || 0,
        status: mapBackendStatus(item.TrangThai),
        source: item.NguonChamCong === 'Biometric' ? 'biometric' : (item.NguonChamCong === 'Mobile' ? 'mobile' : 'manual'),
        department: item.nhanVien?.phongBan?.TenPhong || 'N/A'
      }));
      
      setAttendance(mappedData);
      
      // Áp dụng thêm bộ lọc client-side cho tên nhân viên và phòng ban nếu có
      let filtered = [...mappedData];
      if (values?.employeeName) {
        filtered = filtered.filter(a => a.employeeName.toLowerCase().includes(values.employeeName!.toLowerCase()));
      }
      if (values?.department) {
        filtered = filtered.filter(a => a.department === values.department);
      }
      if (values?.status) {
        filtered = filtered.filter(a => a.status === values.status);
      }
      
      setFilteredData(filtered);
    } catch (error) {
      console.error(error);
      message.error("Lỗi khi tải dữ liệu chấm công");
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
      case 'VeSom': return 'late'; // Map về late hoặc một trạng thái khác phù hợp
      default: return 'on-time';
    }
  };

  // Calculate stats
  const stats = {
    present: attendance.filter((a) => a.status === "on-time").length,
    late: attendance.filter((a) => a.status === "late").length,
    absent: attendance.filter((a) => a.status === "absent").length,
    onLeave: attendance.filter((a) => a.status === "on-leave").length,
  };

  // Get late employees for alert
  const lateEmployees = attendance
    .filter((a) => a.status === "late" && a.lateMinutes > 0)
    .map((a) => ({
      id: a.id,
      employeeName: a.employeeName,
      lateMinutes: a.lateMinutes,
      checkInTime: a.checkIn,
    }));

  const handleFilter = (values: FilterValues) => {
    fetchAttendance(values);
  };

  const handleClear = () => {
    fetchAttendance();
    message.info("Đã xóa bộ lọc");
  };

  const handleViewRecord = (record: AttendanceRecord) => {
    setSelectedRecord(record);
    setIsEditMode(false);
    setIsModalVisible(true);
  };

  const handleEditRecord = (record: AttendanceRecord) => {
    setSelectedRecord(record);
    setIsEditMode(true);
    setIsModalVisible(true);
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
    setSelectedRecord(null);
    setIsEditMode(false);
  };

  const handleSaveRecord = async (updatedRecord: AttendanceRecord) => {
    setLoading(true);
    try {
      // Backend expects full ISO string or similar for GioVao/GioRa
      // Since updatedRecord has 'HH:mm', we need to combine it with the date
      const datePart = updatedRecord.date.split('T')[0];
      
      const updateData = {
        GioVao: updatedRecord.checkIn !== '-' ? `${datePart}T${updatedRecord.checkIn}:00` : null,
        GioRa: updatedRecord.checkOut !== '-' ? `${datePart}T${updatedRecord.checkOut}:00` : null,
        TrangThai: mapToBackendStatus(updatedRecord.status)
      };

      await AttendanceService.updateAttendance(updatedRecord.id, updateData);
      message.success("Cập nhật chấm công thành công");
      fetchAttendance(); // Refresh table
      handleModalClose();
    } catch (error) {
      console.error(error);
      message.error("Lỗi khi cập nhật bản ghi");
    } finally {
      setLoading(false);
    }
  };

  const mapToBackendStatus = (status: string) => {
    const map: any = {
      'on-time': 'CoMat',
      'late': 'DiMuon',
      'absent': 'Vang',
      'on-leave': 'NghiPhep'
    };
    return map[status] || 'CoMat';
  };

  const handleDeleteRecord = async (id: string) => {
    setLoading(true);
    try {
      await AttendanceService.deleteAttendance(id);
      message.success("Đã xóa bản ghi chấm công");
      fetchAttendance(); // Refresh data
    } catch (error) {
      console.error(error);
      message.error("Lỗi khi xóa bản ghi");
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetail = (id: string) => {
    router.push(`/admin/cham-cong/${id}`);
  };

  return (
    <div style={{ maxWidth: '1600px', margin: '0 auto', padding: '16px' }}>
      {/* Header Section */}
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ 
          fontSize: '30px', 
          fontWeight: 900, 
          letterSpacing: '-0.025em', 
          margin: 0 
        }}>
          Quản lý chấm công
        </h1>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between', 
          marginTop: '4px' 
        }}>
          <p >
            Theo dõi và quản lý lịch sử điểm danh của toàn bộ nhân viên
          </p>
          <Space size="middle">
            <Button 
              type="primary" 
              size="large" 
              onClick={() => setIsCheckInModalVisible(true)}
              style={{ padding: '0 24px', height: '40px', fontWeight: 'bold' }}
            >
              Điểm danh ngay
            </Button>
          </Space>
        </div>
      </div>

      {/* Thống kê */}
      <div style={{ marginBottom: 24 }}>
        <AttendanceStats
          present={stats.present}
          late={stats.late}
          absent={stats.absent}
          onLeave={stats.onLeave}
        />
      </div>

      {/* Cảnh báo đi muộn */}
      {lateEmployees.length > 0 && (
        <div style={{ marginBottom: 24 }}>
          <LateAlert lateEmployees={lateEmployees} />
        </div>
      )}

      {/* Tabs section */}
      <Tabs
        defaultActiveKey="1"
        type="card"
        items={[
          {
            key: '1',
            label: 'Lịch sử chi tiết',
            children: (
              <div>
                <AttendanceFilter onFilter={handleFilter} onClear={handleClear} />
                <AttendanceTable
                  data={filteredData}
                  loading={loading}
                  onView={handleViewRecord}
                  onEdit={handleEditRecord}
                  onDelete={handleDeleteRecord}
                />
              </div>
            ),
          },
          {
            key: '2',
            label: 'Báo cáo tổng hợp',
            children: (
              <div style={{ background: '#fff', padding: '24px', borderRadius: '8px' }}>
                <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Space size="middle">
                    <Typography.Text strong>Tháng báo cáo:</Typography.Text>
                    <DatePicker 
                      picker="month" 
                      value={currentMonth} 
                      onChange={(date) => {
                        if(date) {
                          setCurrentMonth(date);
                          fetchSummary(date);
                        }
                      }}
                      format="MM/YYYY"
                    />
                    <Button type="primary" onClick={() => fetchSummary(currentMonth)}>Lấy dữ liệu</Button>
                  </Space>
                </div>
                
                <AntTable 
                  dataSource={summaryData} 
                  columns={summaryColumns} 
                  loading={summaryLoading}
                  rowKey="employeeId"
                  pagination={{ pageSize: 10 }}
                  scroll={{ x: 1000 }}
                />
              </div>
            ),
          },
        ]}
      />

      {/* Modal xem/sửa chấm công */}
      <AttendanceDetailModal
        visible={isModalVisible}
        record={selectedRecord}
        isEditMode={isEditMode}
        onClose={handleModalClose}
        onSave={handleSaveRecord}
        onViewDetail={handleViewDetail}
        loading={loading}
      />

      {/* Modal Điểm danh */}
      <CheckInModal 
        open={isCheckInModalVisible} 
        onClose={() => setIsCheckInModalVisible(false)} 
      />
    </div>
  );
}

// Component Modal tái sử dụng
interface AttendanceDetailModalProps {
  visible: boolean;
  record: AttendanceRecord | null;
  isEditMode: boolean;
  onClose: () => void;
  onSave: (record: AttendanceRecord) => void;
  onViewDetail: (id: string) => void;
  loading: boolean;
}

function AttendanceDetailModal({
  visible,
  record,
  isEditMode,
  onClose,
  onSave,
  onViewDetail,
  loading,
}: AttendanceDetailModalProps) {
  const [formData, setFormData] = useState<AttendanceRecord | null>(null);

  useEffect(() => {
    if (record) {
      setFormData(record);
    }
  }, [record]);

  if (!formData) return null;

  const handleInputChange = (field: keyof AttendanceRecord, value: any) => {
    setFormData({
      ...formData,
      [field]: value,
    });
  };

  const handleSave = () => {
    onSave(formData);
  };

  const handleViewFull = () => {
    onClose();
    onViewDetail(formData.id);
  };

  return (
    <Modal
      title={`${isEditMode ? "Chỉnh sửa" : "Chi tiết"} chấm công - ${formData.employeeName}`}
      open={visible}
      onCancel={onClose}
      width={600}
      footer={
        isEditMode
          ? [
              <Button key="cancel" onClick={onClose}>
                Hủy
              </Button>,
              <Button
                key="save"
                type="primary"
                loading={loading}
                onClick={handleSave}
              >
                Lưu
              </Button>,
            ]
          : [
              <Button key="viewFull" type="primary" onClick={handleViewFull}>
                Xem chi tiết đầy đủ
              </Button>,
              <Button key="close" onClick={onClose}>
                Đóng
              </Button>,
            ]
      }
    >
      <Space direction="vertical" style={{ width: "100%" }} size={16}>
        <Row gutter={16}>
          <Col span={12}>
            <div>
              <label
                style={{ fontWeight: 600, display: "block", marginBottom: 8 }}
              >
                Nhân viên:
              </label>
              <p style={{ margin: 0 }}>{formData.employeeName}</p>
            </div>
          </Col>
          <Col span={12}>
            <div>
              <label
                style={{ fontWeight: 600, display: "block", marginBottom: 8 }}
              >
                Ngày:
              </label>
              <p style={{ margin: 0 }}>
                {new Date(formData.date).toLocaleDateString("vi-VN")}
              </p>
            </div>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <div>
              <label
                style={{ fontWeight: 600, display: "block", marginBottom: 8 }}
              >
                Giờ vào:
              </label>
              {isEditMode ? (
                <TimePicker
                  value={
                    formData.checkIn ? dayjs(formData.checkIn, "HH:mm") : null
                  }
                  onChange={(time) =>
                    handleInputChange(
                      "checkIn",
                      time ? time.format("HH:mm") : "",
                    )
                  }
                  format="HH:mm"
                  style={{ width: "100%" }}
                />
              ) : (
                <p style={{ margin: 0 }}>{formData.checkIn || "-"}</p>
              )}
            </div>
          </Col>
          <Col span={12}>
            <div>
              <label
                style={{ fontWeight: 600, display: "block", marginBottom: 8 }}
              >
                Giờ ra:
              </label>
              {isEditMode ? (
                <TimePicker
                  value={
                    formData.checkOut ? dayjs(formData.checkOut, "HH:mm") : null
                  }
                  onChange={(time) =>
                    handleInputChange(
                      "checkOut",
                      time ? time.format("HH:mm") : "",
                    )
                  }
                  format="HH:mm"
                  style={{ width: "100%" }}
                />
              ) : (
                <p style={{ margin: 0 }}>{formData.checkOut || "-"}</p>
              )}
            </div>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <div>
              <label
                style={{ fontWeight: 600, display: "block", marginBottom: 8 }}
              >
                Số giờ:
              </label>
              <p style={{ margin: 0 }}>{formData.workHours}h</p>
            </div>
          </Col>
          <Col span={12}>
            <div>
              <label
                style={{ fontWeight: 600, display: "block", marginBottom: 8 }}
              >
                Muộn (phút):
              </label>
              <p style={{ margin: 0 }}>{formData.lateMinutes} phút</p>
            </div>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <div>
              <label
                style={{ fontWeight: 600, display: "block", marginBottom: 8 }}
              >
                Trạng thái:
              </label>
              {isEditMode ? (
                <Select
                  value={formData.status}
                  onChange={(value) =>
                    handleInputChange(
                      "status",
                      value as AttendanceRecord["status"],
                    )
                  }
                  options={[
                    { label: "Đúng giờ", value: "on-time" },
                    { label: "Đi muộn", value: "late" },
                    { label: "Vắng mặt", value: "absent" },
                    { label: "Nghỉ phép", value: "on-leave" },
                  ]}
                  style={{ width: "100%" }}
                />
              ) : (
                <p style={{ margin: 0 }}>{getStatusLabel(formData.status)}</p>
              )}
            </div>
          </Col>
          <Col span={12}>
            <div>
              <label
                style={{ fontWeight: 600, display: "block", marginBottom: 8 }}
              >
                Nguồn:
              </label>
              <p style={{ margin: 0 }}>{getSourceLabel(formData.source)}</p>
            </div>
          </Col>
        </Row>
      </Space>
    </Modal>
  );
}

const getStatusLabel = (status: string) => {
  const labelMap: Record<string, string> = {
    "on-time": "Đúng giờ",
    late: "Đi muộn",
    absent: "Vắng mặt",
    "on-leave": "Nghỉ phép",
  };
  return labelMap[status] || status;
};

const getSourceLabel = (source: string) => {
  const labelMap: Record<string, string> = {
    biometric: "Máy chấm công",
    manual: "Nhập tay",
    mobile: "Mobile",
  };
  return labelMap[source] || source;
};
