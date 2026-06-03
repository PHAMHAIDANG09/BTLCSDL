"use client";

import {
  Form,
  Input,
  Select,
  DatePicker,
  Space,
  Row,
  Col,
  message,
} from "antd";
import Button from "@/components/shared/Button/Button";
import {
  SearchOutlined,
  ClearOutlined,
  DownloadOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import { RangePickerProps } from "antd/es/date-picker";

interface FilterValues {
  employeeName?: string;
  department?: string;
  status?: string;
  dateRange?: [dayjs.Dayjs, dayjs.Dayjs];
}

interface AttendanceFilterProps {
  onFilter: (values: FilterValues) => void;
  onClear: () => void;
  onExport: () => void;
}

export default function AttendanceFilter({
  onFilter,
  onClear,
  onExport,
}: AttendanceFilterProps) {
  const [form] = Form.useForm();

  const handleSearch = async () => {
    try {
      const values = await form.validateFields();
      onFilter({
        employeeName: values.employeeName,
        department: values.department,
        status: values.status,
        dateRange: values.dateRange,
      });
    } catch (error) {
      console.error("Validation failed:", error);
    }
  };

  const handleClear = () => {
    form.resetFields();
    onClear();
  };

  const handleExport = () => {
    onExport();
  };

  const disabledDate: RangePickerProps["disabledDate"] = (current) => {
    return current && current > dayjs().endOf("day");
  };

  return (
    <Form form={form} layout="vertical" style={{ marginBottom: 24 }}>
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={6}>
          <Form.Item
            name="employeeName"
            label="Tên nhân viên"
            style={{ marginBottom: 0 }}
          >
            <Input placeholder="Tìm kiếm nhân viên..." allowClear />
          </Form.Item>
        </Col>

        <Col xs={24} sm={12} md={6}>
          <Form.Item
            name="department"
            label="Phòng ban"
            style={{ marginBottom: 0 }}
          >
            <Select
              placeholder="Chọn phòng ban"
              allowClear
              options={[
                { value: "IT", label: "IT" },
                { value: "HR", label: "HR" },
                { value: "Sales", label: "Sales" },
                { value: "Finance", label: "Finance" },
              ]}
            />
          </Form.Item>
        </Col>

        <Col xs={24} sm={12} md={6}>
          <Form.Item
            name="status"
            label="Trạng thái"
            style={{ marginBottom: 0 }}
          >
            <Select
              placeholder="Chọn trạng thái"
              allowClear
              options={[
                { value: "on-time", label: "Đúng giờ" },
                { value: "late", label: "Đi muộn" },
                { value: "absent", label: "Vắng mặt" },
                { value: "on-leave", label: "Nghỉ phép" },
              ]}
            />
          </Form.Item>
        </Col>

        <Col xs={24} sm={12} md={6}>
          <Form.Item
            name="dateRange"
            label="Khoảng ngày"
            style={{ marginBottom: 0 }}
          >
            <DatePicker.RangePicker
              style={{ width: "100%" }}
              disabledDate={disabledDate}
              placeholder={["Từ ngày", "Đến ngày"]}
            />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={[8, 8]} justify="end" style={{ marginTop: 16 }}>
        <Col>
          <Space>
            <Button
              type="primary"
              icon={<SearchOutlined />}
              onClick={handleSearch}
            >
              Tìm kiếm
            </Button>
            <Button icon={<DownloadOutlined />} onClick={handleExport}>
              Xuất Excel
            </Button>
            <Button icon={<ClearOutlined />} onClick={handleClear}>
              Xóa bộ lọc
            </Button>
          </Space>
        </Col>
      </Row>
    </Form>
  );
}
