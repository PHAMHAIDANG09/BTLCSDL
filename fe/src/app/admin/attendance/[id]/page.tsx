"use client";

import { useState, useEffect } from "react";
import {
  Space,
  Row,
  Col,
  Statistic,
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
} from "@ant-design/icons";
import Button from "@/components/shared/Button/Button";
import Table from "@/components/shared/Table/Table";
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
  {
    id: "1",
    date: "2024-04-27",
    checkInTime: "08:00",
    checkOutTime: "17:30",
    workHours: 8.5,
    lateMinutes: 0,
    status: "on-time",
    source: "biometric",
  },
  {
    id: "2",
    date: "2024-04-26",
    checkInTime: "08:15",
    checkOutTime: "17:45",
    workHours: 8.5,
    lateMinutes: 15,
    status: "late",
    source: "biometric",
    notes: "Giao thông",
  },
  {
    id: "3",
    date: "2024-04-25",
    checkInTime: "08:10",
    checkOutTime: "17:00",
    workHours: 8.5,
    lateMinutes: 10,
    status: "late",
    source: "mobile",
  },
  {
    id: "4",
    date: "2024-04-24",
    checkInTime: "08:00",
    checkOutTime: "17:30",
    workHours: 8.5,
    lateMinutes: 0,
    status: "on-time",
    source: "biometric",
  },
  {
    id: "5",
    date: "2024-04-23",
    checkInTime: "-",
    checkOutTime: "-",
    workHours: 0,
    lateMinutes: 0,
    status: "on-leave",
    source: "manual",
    notes: "Nghỉ phép",
  },
];

const getStatusColor = (status: string) => {
  const colorMap: Record<string, string> = {
    "on-time": "green",
    late: "orange",
    absent: "red",
    "on-leave": "blue",
  };
  return colorMap[status] || "default";
};

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

export default function AttendanceDetailPage() {
  const router = useRouter();
  const params = useParams();
  const employeeId = params?.id as string;

  const [employee, setEmployee] = useState<EmployeeDetail>(MOCK_EMPLOYEE);
  const [history, setHistory] = useState<AttendanceDetail[]>(
    MOCK_ATTENDANCE_HISTORY,
  );
  const [loading, setLoading] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<AttendanceDetail | null>(
    null,
  );
  const [isModalVisible, setIsModalVisible] = useState(false);

  // Calculate monthly stats
  const monthlyStats = {
    present: history.filter((h) => h.status === "on-time").length,
    late: history.filter((h) => h.status === "late").length,
    absent: history.filter((h) => h.status === "absent").length,
    onLeave: history.filter((h) => h.status === "on-leave").length,
    totalHours: history.reduce((sum, h) => sum + h.workHours, 0),
  };

  const columns: TableColumnsType<AttendanceDetail> = [
    {
      title: "Ngày",
      dataIndex: "date",
      key: "date",
      width: 100,
      render: (date) => new Date(date).toLocaleDateString("vi-VN"),
      sorter: (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
    },
    {
      title: "Giờ vào",
      dataIndex: "checkInTime",
      key: "checkInTime",
      width: 80,
      render: (time) => time || "-",
    },
    {
      title: "Giờ ra",
      dataIndex: "checkOutTime",
      key: "checkOutTime",
      width: 80,
      render: (time) => time || "-",
    },
    {
      title: "Số giờ",
      dataIndex: "workHours",
      key: "workHours",
      width: 70,
      render: (hours) => `${hours}h`,
      sorter: (a, b) => a.workHours - b.workHours,
    },
    {
      title: "Muộn (phút)",
      dataIndex: "lateMinutes",
      key: "lateMinutes",
      width: 100,
      render: (minutes) => {
        if (minutes === 0)
          return <span style={{ color: "#52c41a" }}>0 phút</span>;
        return <span style={{ color: "#faad14" }}>{minutes} phút</span>;
      },
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: 100,
      render: (status: string) => (
        <Tag color={getStatusColor(status)}>{getStatusLabel(status)}</Tag>
      ),
    },
    {
      title: "Nguồn",
      dataIndex: "source",
      key: "source",
      width: 120,
      render: (source: string) => getSourceLabel(source),
    },
    {
      title: "Thao tác",
      key: "action",
      width: 80,
      render: (_, record) => (
        <Button
          type="text"
          size="small"
          icon={<EditOutlined />}
          onClick={() => openEditModal(record)}
        />
      ),
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

  const handleSaveRecord = (updatedRecord: AttendanceDetail) => {
    setLoading(true);
    setTimeout(() => {
      setHistory(
        history.map((h) => (h.id === updatedRecord.id ? updatedRecord : h)),
      );
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
      <div style={{ marginBottom: 24 }}>
        <Button
          type="text"
          icon={<ArrowLeftOutlined />}
          onClick={() => router.back()}
        >
          Quay lại
        </Button>
      </div>

      {/* Employee Info */}
      <div style={{ marginBottom: 24 }}>
        <Row gutter={[32, 16]}>
          <Col xs={24} sm={12} md={6}>
            <div style={{ marginBottom: 8 }}>
              <span style={{ color: "#999", fontSize: 12 }}>Nhân viên</span>
            </div>
            <h3 style={{ margin: 0 }}>{employee.name}</h3>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <div style={{ marginBottom: 8 }}>
              <span style={{ color: "#999", fontSize: 12 }}>Mã số</span>
            </div>
            <p style={{ margin: 0 }}>{employee.code}</p>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <div style={{ marginBottom: 8 }}>
              <span style={{ color: "#999", fontSize: 12 }}>Phòng ban</span>
            </div>
            <p style={{ margin: 0 }}>{employee.department}</p>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <div style={{ marginBottom: 8 }}>
              <span style={{ color: "#999", fontSize: 12 }}>Chức vụ</span>
            </div>
            <p style={{ margin: 0 }}>{employee.position}</p>
          </Col>
        </Row>
      </div>

      {/* Monthly Stats */}
      <div style={{ marginBottom: 24 }}>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} md={4.8}>
            <Statistic
              title="Có mặt"
              value={monthlyStats.present}
              valueStyle={{ color: "#52c41a" }}
            />
          </Col>
          <Col xs={24} sm={12} md={4.8}>
            <Statistic
              title="Đi muộn"
              value={monthlyStats.late}
              valueStyle={{ color: "#faad14" }}
            />
          </Col>
          <Col xs={24} sm={12} md={4.8}>
            <Statistic
              title="Vắng mặt"
              value={monthlyStats.absent}
              valueStyle={{ color: "#f5222d" }}
            />
          </Col>
          <Col xs={24} sm={12} md={4.8}>
            <Statistic
              title="Nghỉ phép"
              value={monthlyStats.onLeave}
              valueStyle={{ color: "#1890ff" }}
            />
          </Col>
          <Col xs={24} sm={12} md={4.8}>
            <Statistic
              title="Tổng giờ"
              value={monthlyStats.totalHours}
              suffix="h"
            />
          </Col>
        </Row>
      </div>

      {/* Attendance History */}
      <div>
        <div
          style={{
            marginBottom: 16,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h3 style={{ margin: 0 }}>Lịch chấm công tháng 4/2024</h3>
          <Button
            type="primary"
            icon={<DownloadOutlined />}
            onClick={handleExport}
          >
            Xuất Excel
          </Button>
        </div>
        <Table<AttendanceDetail>
          columns={columns}
          dataSource={history}
          rowKey="id"
          loading={loading}
          searchable={false}
          pagination={undefined}
          totalText="bản ghi"
          scroll={{ x: 1000 }}
          locale={{
            emptyText: "Không có dữ liệu",
          }}
        />
      </div>

      {/* Edit Modal (Tái sử dụng) */}
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

// Component Modal tái sử dụng (cùng logic với page.tsx)
interface AttendanceEditModalProps {
  visible: boolean;
  record: AttendanceDetail | null;
  onClose: () => void;
  onSave: (record: AttendanceDetail) => void;
  loading: boolean;
}

function AttendanceEditModal({
  visible,
  record,
  onClose,
  onSave,
  loading,
}: AttendanceEditModalProps) {
  const [formData, setFormData] = useState<AttendanceDetail | null>(null);

  useEffect(() => {
    if (record) {
      setFormData(record);
    }
  }, [record]);

  if (!formData) return null;

  const handleInputChange = (field: keyof AttendanceDetail, value: any) => {
    setFormData({
      ...formData,
      [field]: value,
    });
  };

  const handleSave = () => {
    onSave(formData);
  };

  return (
    <Modal
      title={`Chỉnh sửa chấm công - ${new Date(formData.date).toLocaleDateString("vi-VN")}`}
      open={visible}
      onCancel={onClose}
      width={500}
      footer={[
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
      ]}
    >
      <Space direction="vertical" style={{ width: "100%" }} size={16}>
        <Row gutter={16}>
          <Col span={12}>
            <div>
              <label
                style={{ fontWeight: 600, display: "block", marginBottom: 8 }}
              >
                Giờ vào:
              </label>
              <TimePicker
                value={
                  formData.checkInTime
                    ? dayjs(formData.checkInTime, "HH:mm")
                    : null
                }
                onChange={(time) =>
                  handleInputChange(
                    "checkInTime",
                    time ? time.format("HH:mm") : "",
                  )
                }
                format="HH:mm"
                style={{ width: "100%" }}
              />
            </div>
          </Col>
          <Col span={12}>
            <div>
              <label
                style={{ fontWeight: 600, display: "block", marginBottom: 8 }}
              >
                Giờ ra:
              </label>
              <TimePicker
                value={
                  formData.checkOutTime
                    ? dayjs(formData.checkOutTime, "HH:mm")
                    : null
                }
                onChange={(time) =>
                  handleInputChange(
                    "checkOutTime",
                    time ? time.format("HH:mm") : "",
                  )
                }
                format="HH:mm"
                style={{ width: "100%" }}
              />
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
              <Select
                value={formData.status}
                onChange={(value) =>
                  handleInputChange(
                    "status",
                    value as AttendanceDetail["status"],
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
            </div>
          </Col>
          <Col span={12}>
            <div>
              <label
                style={{ fontWeight: 600, display: "block", marginBottom: 8 }}
              >
                Muộn (phút):
              </label>
              <Input
                type="number"
                value={formData.lateMinutes}
                onChange={(e) =>
                  handleInputChange(
                    "lateMinutes",
                    parseInt(e.target.value) || 0,
                  )
                }
              />
            </div>
          </Col>
        </Row>

        <div>
          <label style={{ fontWeight: 600, display: "block", marginBottom: 8 }}>
            Ghi chú:
          </label>
          <Input.TextArea
            value={formData.notes || ""}
            onChange={(e) => handleInputChange("notes", e.target.value)}
            placeholder="Nhập ghi chú..."
            rows={4}
          />
        </div>
      </Space>
    </Modal>
  );
}
