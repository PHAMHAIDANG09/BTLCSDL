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
  Popconfirm,
  Tooltip,
} from "antd";
import dayjs from "dayjs";
import { exportService } from "@/components/shared/utils/export";
import {
  ArrowLeftOutlined,
  EditOutlined,
  DownloadOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  MinusCircleOutlined,
  FileTextOutlined,
  DashboardOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import Button from "@/components/shared/Button/Button";
import Table from "@/components/shared/Table/Table";
import StatsCard from "@/components/shared/StatsCard/StatsCard";
import { useRouter, useParams } from "next/navigation";
import type { TableColumnsType } from "antd";
import { getEmployeeByIdApi } from "@/services/employee.service";
import { AttendanceService } from "@/services/attendance.service";

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

  const [employee, setEmployee] = useState<EmployeeDetail>({
    id: "",
    name: "Đang tải...",
    code: "...",
    department: "...",
    position: "...",
    email: "...",
    phone: "...",
  });
  const [history, setHistory] = useState<AttendanceDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRecord, setSelectedRecord] = useState<AttendanceDetail | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

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

  const mapToBackendStatus = (status: string) => {
    const map: any = {
      'on-time': 'CoMat',
      'late': 'DiMuon',
      'absent': 'Vang',
      'on-leave': 'Nghỉ Phep'
    };
    return map[status] || 'CoMat';
  };

  const loadData = async () => {
    if (!employeeId) return;
    setLoading(true);
    try {
      // 1. Fetch employee details
      const empData = await getEmployeeByIdApi(parseInt(employeeId));
      setEmployee({
        id: empData.Id.toString(),
        name: empData.HoTen,
        code: empData.MaNhanVien,
        department: empData.phongBan?.TenPhong || "N/A",
        position: empData.chucVu?.TenChucVu || "N/A",
        email: empData.Email,
        phone: empData.SoDienThoai || "N/A",
      });

      // 2. Fetch all history for this employee
      const today = dayjs();
      const start = today.subtract(365, 'day').format('YYYY-MM-DD'); // Load up to a year of data
      const end = today.format('YYYY-MM-DD');
      
      const allHistory = await AttendanceService.getAllHistory(start, end);
      const employeeHistory = allHistory.filter((item: any) => item.MaNhanVienId === parseInt(employeeId));
      
      const historyData: AttendanceDetail[] = employeeHistory.map((item: any) => ({
        id: item.Id.toString(),
        date: item.NgayLamViec,
        checkInTime: item.GioVao ? dayjs(item.GioVao).format("HH:mm") : "-",
        checkOutTime: item.GioRa ? dayjs(item.GioRa).format("HH:mm") : "-",
        workHours: item.SoGioLam || 0,
        lateMinutes: item.SoPhutDiMuon || 0,
        status: mapBackendStatus(item.TrangThai),
        source: item.NguonChamCong === 'Biometric' ? 'biometric' : (item.NguonChamCong === 'Mobile' ? 'mobile' : 'manual'),
        notes: item.GhiChu || "",
      }));
      setHistory(historyData);
    } catch (error) {
      console.error(error);
      setEmployee({
        id: "",
        name: "Không tìm thấy nhân viên",
        code: "N/A",
        department: "N/A",
        position: "N/A",
        email: "N/A",
        phone: "N/A",
      });
      message.error("Lỗi khi tải dữ liệu chấm công");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [employeeId]);

  const statsItems = [
    { label: "Có mặt", value: history.filter(h => h.status === "on-time").length, icon: <CheckCircleOutlined />, color: "var(--success-color)", bg: "#f6ffed" },
    { label: "Đi muộn", value: history.filter(h => h.status === "late").length, icon: <ClockCircleOutlined />, color: "var(--warning-color)", bg: "#fff7e6" },
    { label: "Vắng mặt", value: history.filter(h => h.status === "absent").length, icon: <MinusCircleOutlined />, color: "var(--error-color)", bg: "#fff1f0" },
    { label: "Nghỉ phép", value: history.filter(h => h.status === "on-leave").length, icon: <FileTextOutlined />, color: "var(--info-color)", bg: "#e6f7ff" },
    { 
      label: "Tổng giờ", 
      value: `${history.reduce((sum, h) => sum + (h.workHours || 0), 0).toFixed(1)} h`, 
      icon: <DashboardOutlined />, 
      color: "#262626", 
      bg: "#f5f5f5" 
    },
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
    { 
      title: "Thao tác", 
      key: "action", 
      width: 120, 
      align: "center" as const,
      render: (_, record) => (
        <Space size={0}>
          <Tooltip title="Chỉnh sửa">
            <Button 
              type="text" 
              size="small" 
              icon={<EditOutlined />} 
              onClick={() => openEditModal(record)} 
            />
          </Tooltip>
          <Popconfirm
            title="Xóa bản ghi"
            description="Bạn có chắc chắn muốn xóa bản ghi chấm công này?"
            onConfirm={() => handleDeleteRecord(record.id)}
            okText="Xóa"
            cancelText="Hủy"
            okButtonProps={{ danger: true }}
          >
            <Tooltip title="Xóa">
              <Button
                type="text"
                size="small"
                icon={<DeleteOutlined />}
                danger
              />
            </Tooltip>
          </Popconfirm>
        </Space>
      )
    },
  ];

  const openEditModal = (record: AttendanceDetail) => {
    setSelectedRecord(record);
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
    setSelectedRecord(null);
  };

  const handleSaveRecord = async (updatedRecord: AttendanceDetail) => {
    setLoading(true);
    try {
      const datePart = updatedRecord.date.split('T')[0];
      const updateData = {
        GioVao: updatedRecord.checkInTime && updatedRecord.checkInTime !== '-' ? `${datePart}T${updatedRecord.checkInTime}:00` : null,
        GioRa: updatedRecord.checkOutTime && updatedRecord.checkOutTime !== '-' ? `${datePart}T${updatedRecord.checkOutTime}:00` : null,
        TrangThai: mapToBackendStatus(updatedRecord.status)
      };

      await AttendanceService.updateAttendance(updatedRecord.id, updateData);
      message.success("Cập nhật chấm công thành công");
      loadData();
      closeModal();
    } catch (error) {
      console.error(error);
      message.error("Lỗi khi cập nhật bản ghi");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteRecord = async (id: string) => {
    setLoading(true);
    try {
      await AttendanceService.deleteAttendance(id);
      message.success("Xóa bản ghi chấm công thành công");
      loadData();
    } catch (error) {
      console.error(error);
      message.error("Lỗi khi xóa bản ghi");
    } finally {
      setLoading(false);
    }
  };

  const handleExport = () => {
    if (!history || history.length === 0) {
      message.warning("Không có dữ liệu chấm công để xuất");
      return;
    }
    const exportData = history.map(h => ({
      "Ngày": dayjs(h.date).format("DD/MM/YYYY"),
      "Giờ Vào": h.checkInTime || "-",
      "Giờ Ra": h.checkOutTime || "-",
      "Số Giờ": h.workHours,
      "Đi Muộn (Phút)": h.lateMinutes,
      "Trạng Thái": getStatusLabel(h.status),
      "Nguồn": getSourceLabel(h.source),
      "Ghi Chú": h.notes || ""
    }));
    exportService.exportToExcel(exportData, `Cham_Cong_${employee.name}_NV_${employee.code}`, "ChamCongNhanVien");
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
