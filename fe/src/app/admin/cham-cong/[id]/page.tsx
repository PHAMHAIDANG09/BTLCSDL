"use client";

import { useState, useEffect } from "react";
import {
  Space,
  Row,
  Col,
  Tag,
  Modal,
  message,
  TimePicker,
  Select,
  Input,
} from "antd";
import dayjs from "dayjs";
import {
  ArrowLeftOutlined,
  EditOutlined,
  DownloadOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  MinusCircleOutlined,
  FileTextOutlined,
  DashboardOutlined,
} from "@ant-design/icons";
import Button from "@/components/shared/Button/Button";
import Table from "@/components/shared/Table/Table";
import StatsCard from "@/components/shared/StatsCard/StatsCard";
import { useRouter, useParams } from "next/navigation";
import type { TableColumnsType } from "antd";

interface EmployeeDetail {
  id: string;
  name: string;
  code: string;
  department: string;
  position: string;
  email: string;
  phone: string;
}

interface AttendanceDetail {
  id: string;
  date: string;
  checkInTime: string;
  checkOutTime: string;
  workHours: number;
  lateMinutes: number;
  status: "on-time" | "late" | "absent" | "on-leave";
  source: "biometric" | "manual" | "mobile";
  notes?: string;
}

// Mock data
const MOCK_EMPLOYEE: EmployeeDetail = {
  id: "1",
  name: "Nguyễn Văn A",
  code: "NV001",
  department: "IT",
  position: "Senior Developer",
  email: "a.nguyen@company.com",
  phone: "0901234567",
};

const MOCK_ATTENDANCE_HISTORY: AttendanceDetail[] = [
  { id: "1", date: "2024-04-27", checkInTime: "08:00", checkOutTime: "17:30", workHours: 8.5, lateMinutes: 0, status: "on-time", source: "biometric" },
  { id: "2", date: "2024-04-26", checkInTime: "08:15", checkOutTime: "17:45", workHours: 8.5, lateMinutes: 15, status: "late", source: "biometric", notes: "Giao thông" },
  { id: "3", date: "2024-04-25", checkInTime: "08:10", checkOutTime: "17:00", workHours: 8.5, lateMinutes: 10, status: "late", source: "mobile" },
  { id: "4", date: "2024-04-24", checkInTime: "08:00", checkOutTime: "17:30", workHours: 8.5, lateMinutes: 0, status: "on-time", source: "biometric" },
  { id: "5", date: "2024-04-23", checkInTime: "-", checkOutTime: "-", workHours: 0, lateMinutes: 0, status: "on-leave", source: "manual", notes: "Nghỉ phép" },
];

const getStatusColor = (status: string) => {
  const colorMap: Record<string, string> = { "on-time": "green", late: "orange", absent: "red", "on-leave": "blue" };
  return colorMap[status] || "default";
};

const getStatusLabel = (status: string) => {
  const labelMap: Record<string, string> = { "on-time": "Đúng giờ", late: "Đi muộn", absent: "Vắng mặt", "on-leave": "Nghỉ phép" };
  return labelMap[status] || status;
};

const getSourceLabel = (source: string) => {
  const labelMap: Record<string, string> = { biometric: "Máy chấm công", manual: "Nhập tay", mobile: "Mobile" };
  return labelMap[source] || source;
};

export default function AttendanceDetailPage() {
  const router = useRouter();
  const params = useParams();
  const employeeId = params?.id as string;

  const [employee, setEmployee] = useState<EmployeeDetail>(MOCK_EMPLOYEE);
  const [history, setHistory] = useState<AttendanceDetail[]>(MOCK_ATTENDANCE_HISTORY);
  const [loading, setLoading] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<AttendanceDetail | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const statsItems = [
    { label: "Có mặt", value: 2, icon: <CheckCircleOutlined />, color: "var(--success-color)", bg: "#f6ffed" },
    { label: "Đi muộn", value: 2, icon: <ClockCircleOutlined />, color: "var(--warning-color)", bg: "#fff7e6" },
    { label: "Vắng mặt", value: 0, icon: <MinusCircleOutlined />, color: "var(--error-color)", bg: "#fff1f0" },
    { label: "Nghỉ phép", value: 1, icon: <FileTextOutlined />, color: "var(--info-color)", bg: "#e6f7ff" },
    { label: "Tổng giờ", value: "34 h", icon: <DashboardOutlined />, color: "#262626", bg: "#f5f5f5" },
  ];

  const columns: TableColumnsType<AttendanceDetail> = [
    { title: "Ngày", dataIndex: "date", key: "date", width: 100, render: (date) => dayjs(date).format("DD/MM/YYYY"), sorter: (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime() },
    { title: "Giờ vào", dataIndex: "checkInTime", key: "checkInTime", width: 80, render: (time) => time || "-" },
    { title: "Giờ ra", dataIndex: "checkOutTime", key: "checkOutTime", width: 80, render: (time) => time || "-" },
    { title: "Số giờ", dataIndex: "workHours", key: "workHours", width: 70, render: (hours) => `${hours}h`, sorter: (a, b) => a.workHours - b.workHours },
    {
      title: "Muộn (phút)", dataIndex: "lateMinutes", key: "lateMinutes", width: 100,
      render: (minutes) => minutes === 0 ? <span style={{ color: "#52c41a" }}>0 phút</span> : <span style={{ color: "#faad14" }}>{minutes} phút</span>,
    },
    { title: "Trạng thái", dataIndex: "status", key: "status", width: 100, render: (status: string) => <Tag color={getStatusColor(status)}>{getStatusLabel(status)}</Tag> },
    { title: "Nguồn", dataIndex: "source", key: "source", width: 120, render: (source: string) => getSourceLabel(source) },
    { title: "Thao tác", key: "action", width: 80, render: (_, record) => <Button type="text" size="small" icon={<EditOutlined />} onClick={() => openEditModal(record)} /> },
  ];

  const openEditModal = (record: AttendanceDetail) => {
    setSelectedRecord(record);
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
    setSelectedRecord(null);
  };

  const handleSaveRecord = (updatedRecord: AttendanceDetail) => {
    setLoading(true);
    setTimeout(() => {
      setHistory(history.map((h) => (h.id === updatedRecord.id ? updatedRecord : h)));
      setLoading(false);
      message.success("Cập nhật chấm công thành công");
      closeModal();
    }, 500);
  };

  const handleExport = () => {
    message.info("Chức năng xuất Excel đang được phát triển");
  };

  return (
    <div style={{ background: "#fff", minHeight: "100vh", padding: 24 }}>
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <Button type="text" icon={<ArrowLeftOutlined />} onClick={() => router.back()} style={{ paddingLeft: 0 }}>
          Quay lại
        </Button>
      </div>

      {/* Employee Info */}
      <div style={{ marginBottom: 32 }}>
        <Row gutter={[32, 16]}>
          <Col xs={24} sm={12} md={6}>
            <div style={{ color: "#999", fontSize: 13, marginBottom: 8 }}>Nhân viên</div>
            <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>{employee.name}</h3>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <div style={{ color: "#999", fontSize: 13, marginBottom: 8 }}>Mã số</div>
            <p style={{ margin: 0, fontSize: 16 }}>{employee.code}</p>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <div style={{ color: "#999", fontSize: 13, marginBottom: 8 }}>Phòng ban</div>
            <p style={{ margin: 0, fontSize: 16 }}>{employee.department}</p>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <div style={{ color: "#999", fontSize: 13, marginBottom: 8 }}>Chức vụ</div>
            <p style={{ margin: 0, fontSize: 16 }}>{employee.position}</p>
          </Col>
        </Row>
      </div>

      {/* Monthly Stats */}
      <div style={{ marginBottom: 40 }}>
        <Row gutter={[12, 12]}>
          {statsItems.map((item, idx) => (
            <Col xs={12} sm={8} md={4.8} key={idx}>
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
      </div>

      {/* Attendance History */}
      <div>
        <div style={{ marginBottom: 16, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h3 style={{ margin: 0, fontWeight: 700 }}>Lịch chấm công tháng 4/2024</h3>
          <Button type="primary" icon={<DownloadOutlined />} onClick={handleExport} style={{ borderRadius: 6 }}>
            Xuất Excel
          </Button>
        </div>
        <Table<AttendanceDetail>
          columns={columns}
          dataSource={history}
          rowKey="id"
          loading={loading}
          searchable={false}
          pagination={false}
          totalText="bản ghi"
          scroll={{ x: 1000 }}
          locale={{ emptyText: "Không có dữ liệu" }}
        />
      </div>

      {/* Edit Modal */}
      <AttendanceEditModal
        visible={isModalVisible}
        record={selectedRecord}
        onClose={closeModal}
        onSave={handleSaveRecord}
        loading={loading}
      />
    </div>
  );
}

// AttendanceEditModal component...
function AttendanceEditModal({ visible, record, onClose, onSave, loading }: any) {
  const [formData, setFormData] = useState<any>(null);
  useEffect(() => { if (record) setFormData(record); }, [record]);
  if (!formData) return null;
  const handleInputChange = (field: string, value: any) => setFormData({ ...formData, [field]: value });
  return (
    <Modal
      title={`Chỉnh sửa chấm công - ${dayjs(formData.date).format("DD/MM/YYYY")}`}
      open={visible}
      onCancel={onClose}
      width={500}
      footer={[
        <Button key="cancel" onClick={onClose}>Hủy</Button>,
        <Button key="save" type="primary" loading={loading} onClick={() => onSave(formData)}>Lưu</Button>,
      ]}
    >
      <Space direction="vertical" style={{ width: "100%" }} size={16}>
        <Row gutter={16}>
          <Col span={12}>
            <label style={{ fontWeight: 600, display: "block", marginBottom: 8 }}>Giờ vào:</label>
            <TimePicker value={formData.checkInTime ? dayjs(formData.checkInTime, "HH:mm") : null} onChange={(time) => handleInputChange("checkInTime", time ? time.format("HH:mm") : "")} format="HH:mm" style={{ width: "100%" }} />
          </Col>
          <Col span={12}>
            <label style={{ fontWeight: 600, display: "block", marginBottom: 8 }}>Giờ ra:</label>
            <TimePicker value={formData.checkOutTime ? dayjs(formData.checkOutTime, "HH:mm") : null} onChange={(time) => handleInputChange("checkOutTime", time ? time.format("HH:mm") : "")} format="HH:mm" style={{ width: "100%" }} />
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <label style={{ fontWeight: 600, display: "block", marginBottom: 8 }}>Trạng thái:</label>
            <Select value={formData.status} onChange={(value) => handleInputChange("status", value)} options={[{ label: "Đúng giờ", value: "on-time" }, { label: "Đi muộn", value: "late" }, { label: "Vắng mặt", value: "absent" }, { label: "Nghỉ phép", value: "on-leave" }]} style={{ width: "100%" }} />
          </Col>
          <Col span={12}>
            <label style={{ fontWeight: 600, display: "block", marginBottom: 8 }}>Muộn (phút):</label>
            <Input type="number" value={formData.lateMinutes} onChange={(e) => handleInputChange("lateMinutes", parseInt(e.target.value) || 0)} />
          </Col>
        </Row>
        <div>
          <label style={{ fontWeight: 600, display: "block", marginBottom: 8 }}>Ghi chú:</label>
          <Input.TextArea value={formData.notes || ""} onChange={(e) => handleInputChange("notes", e.target.value)} placeholder="Nhập ghi chú..." rows={4} />
        </div>
      </Space>
    </Modal>
  );
}
