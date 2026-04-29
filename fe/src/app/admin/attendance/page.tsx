"use client";

import { useState, useEffect } from "react";
import {
  Modal,
  message,
  TimePicker,
  Select,
  Input,
  Space,
  Row,
  Col,
} from "antd";
import dayjs from "dayjs";
import AttendanceStats from "./_components/AttendanceStats";
import AttendanceFilter from "./_components/AttendanceFilter";
import AttendanceTable from "./_components/AttendanceTable";
import LateAlert from "./_components/LateAlert";
import Button from "@/components/shared/Button/Button";
import { useRouter } from "next/navigation";

interface AttendanceRecord {
  id: string;
  employeeName: string;
  date: string;
  checkIn: string;
  checkOut: string;
  workHours: number;
  lateMinutes: number;
  status: "on-time" | "late" | "absent" | "on-leave";
  source: "biometric" | "manual" | "mobile";
  department?: string;
}

// Mock data
const MOCK_ATTENDANCE: AttendanceRecord[] = [
  {
    id: "1",
    employeeName: "Nguyễn Văn A",
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
  const [attendance, setAttendance] =
    useState<AttendanceRecord[]>(MOCK_ATTENDANCE);
  const [filteredData, setFilteredData] =
    useState<AttendanceRecord[]>(MOCK_ATTENDANCE);
  const [loading, setLoading] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<AttendanceRecord | null>(
    null,
  );
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

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
    setLoading(true);
    // Simulate API call delay
    setTimeout(() => {
      let filtered = [...attendance];

      if (values.employeeName) {
        filtered = filtered.filter((a) =>
          a.employeeName
            .toLowerCase()
            .includes(values.employeeName!.toLowerCase()),
        );
      }

      if (values.department) {
        filtered = filtered.filter((a) => a.department === values.department);
      }

      if (values.status) {
        filtered = filtered.filter((a) => a.status === values.status);
      }

      if (values.dateRange && values.dateRange.length === 2) {
        const [start, end] = values.dateRange;
        filtered = filtered.filter((a) => {
          const date = new Date(a.date);
          return date >= start.toDate() && date <= end.toDate();
        });
      }

      setFilteredData(filtered);
      setLoading(false);
      message.success(`Tìm thấy ${filtered.length} bản ghi`);
    }, 300);
  };

  const handleClear = () => {
    setFilteredData(attendance);
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

  const handleSaveRecord = (updatedRecord: AttendanceRecord) => {
    // Simulate API call
    setLoading(true);
    setTimeout(() => {
      setAttendance(
        attendance.map((a) => (a.id === updatedRecord.id ? updatedRecord : a)),
      );
      setFilteredData(
        filteredData.map((a) =>
          a.id === updatedRecord.id ? updatedRecord : a,
        ),
      );
      setLoading(false);
      message.success("Cập nhật chấm công thành công");
      handleModalClose();
    }, 500);
  };

  const handleViewDetail = (id: string) => {
    router.push(`/admin/cham-cong/${id}`);
  };

  return (
    <div style={{ background: "#fff", minHeight: "100vh", padding: "24px" }}>
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

      {/* Bộ lọc + Table */}
      <div>
        <AttendanceFilter onFilter={handleFilter} onClear={handleClear} />
        <AttendanceTable
          data={filteredData}
          loading={loading}
          onView={handleViewRecord}
          onEdit={handleEditRecord}
        />
      </div>

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
