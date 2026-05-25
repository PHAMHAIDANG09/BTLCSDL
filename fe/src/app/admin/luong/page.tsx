"use client";

import React, { useState, useEffect } from "react";
import {
  Typography,
  Button,
  Space,
  Select,
  Tag,
  message,
  Card,
  Row,
  Col,
  Tooltip,
  Modal,
  Form,
  Input,
  InputNumber,
} from "antd";
import {
  CalculatorOutlined,
  FileExcelOutlined,
  EyeOutlined,
  ReloadOutlined,
  DollarOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import Table from "@/components/shared/Table/Table";
import type { TableColumnsType } from "antd";
import { PhieuLuong } from "@/types/payroll";
import payrollService from "@/services/payroll.service";
import { getEmployeesApi, Employee } from "@/services/employee.service";
import PayrollDetailModal from "@/components/payroll/PayrollDetailModal";
import exportService from "@/components/shared/utils/export";
import confetti from "canvas-confetti";
import dayjs from "dayjs";

const { Title, Text } = Typography;
const { Option } = Select;

const fmt = (n: number) => n.toLocaleString("vi-VN") + " đ";

export default function AdminPayrollPage() {
  const [loading, setLoading] = useState(false);
  const [calculating, setCalculating] = useState(false);
  const [data, setData] = useState<PhieuLuong[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isSalaryModalOpen, setIsSalaryModalOpen] = useState(false);
  const [updatingSalary, setUpdatingSalary] = useState(false);
  const [salaryForm] = Form.useForm();
  const [selectedMonth, setSelectedMonth] = useState(dayjs().month() + 1);
  const [selectedYear, setSelectedYear] = useState(dayjs().year());
  const [selectedItem, setSelectedItem] = useState<PhieuLuong | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchPaySlips = async () => {
    setLoading(true);
    try {
      const res = await payrollService.getAllPaySlips(selectedMonth, selectedYear);
      setData(res);
    } catch (error: any) {
      message.error(error.message || "Không thể tải danh sách phiếu lương");
    } finally {
      setLoading(false);
    }
  };

  const fetchEmployees = async () => {
    try {
      const res = await getEmployeesApi();
      setEmployees(res.filter((e) => e.TrangThai === "Active"));
    } catch (error: any) {
      console.error("Không thể tải danh sách nhân viên", error);
    }
  };

  useEffect(() => {
    fetchPaySlips();
    fetchEmployees();
  }, [selectedMonth, selectedYear]);

  const handleUpdateSalary = async (values: any) => {
    setUpdatingSalary(true);
    try {
      await payrollService.updateSalary({
        MaNhanVienId: values.MaNhanVienId,
        LuongCoBan: values.LuongCoBan,
        PhuCap: values.PhuCap,
        GhiChu: values.GhiChu,
      });
      message.success("Cập nhật mức lương thành công!");
      setIsSalaryModalOpen(false);
      salaryForm.resetFields();
      fetchPaySlips();
    } catch (error: any) {
      message.error(error.message || "Lỗi khi cập nhật mức lương");
    } finally {
      setUpdatingSalary(false);
    }
  };

  const handleCalculate = async () => {
    setCalculating(true);
    try {
      await payrollService.calculatePayroll({
        Thang: selectedMonth,
        Nam: selectedYear,
      });
      message.success(`Đã tính xong lương tháng ${selectedMonth}/${selectedYear}`);
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
      });
      fetchPaySlips();
    } catch (error: any) {
      message.error(error.message || "Lỗi khi tính lương");
    } finally {
      setCalculating(false);
    }
  };

  const handleExportExcel = () => {
    if (data.length === 0) {
      message.warning("Không có dữ liệu để xuất");
      return;
    }

    const exportData = data.map((item) => ({
      "Mã NV": item.nhanVien?.MaNhanVien,
      "Họ tên": item.nhanVien?.HoTen,
      "Tháng": item.Thang,
      "Năm": item.Nam,
      "Lương cơ bản": item.LuongCoBan,
      "Phụ cấp": item.PhuCap,
      "Tiền OT": item.TienLamThem,
      "BHXH": item.BaoHiemXaHoi,
      "BHYT": item.BaoHiemYTe,
      "BHTN": item.BaoHiemThatNghiep,
      "Thuế TNCN": item.ThueTNCN,
      "Khấu trừ khác": item.CacKhoanKhauTruKhac,
      "Tổng lương gộp": item.TongLuongGop,
      "Thực lĩnh": item.LuongThucNhan,
      "Trạng thái": item.TrangThai === "Paid" ? "Đã thanh toán" : "Chờ xử lý",
    }));

    exportService.exportToExcel(exportData, `Bang_Luong_${selectedMonth}_${selectedYear}`, "Payroll");
  };

  const columns: TableColumnsType<PhieuLuong> = [
    {
      title: "Nhân viên",
      key: "employee",
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
        <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
          <Input
            placeholder="Tìm tên hoặc mã NV..."
            value={selectedKeys[0] as string}
            onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
            onPressEnter={() => confirm()}
            style={{ marginBottom: 8, display: "block", width: 220 }}
          />
          <Space>
            <Button
              type="primary"
              onClick={() => confirm()}
              icon={<SearchOutlined />}
              size="small"
              style={{ width: 90 }}
              className="bg-blue-600 border-none hover:bg-blue-700"
            >
              Tìm
            </Button>
            <Button
              onClick={() => {
                clearFilters && clearFilters();
                confirm();
              }}
              size="small"
              style={{ width: 90 }}
            >
              Xóa
            </Button>
          </Space>
        </div>
      ),
      filterIcon: (filtered) => (
        <SearchOutlined style={{ color: filtered ? "#1677ff" : undefined }} />
      ),
      onFilter: (value, record) => {
        const hoTen = record.nhanVien?.HoTen || "";
        const maNV = record.nhanVien?.MaNhanVien || "";
        return (
          hoTen.toLowerCase().includes((value as string).toLowerCase()) ||
          maNV.toLowerCase().includes((value as string).toLowerCase())
        );
      },
      render: (_, r) => (
        <Space direction="vertical" size={0}>
          <Text strong>{r.nhanVien?.HoTen}</Text>
          <Text type="secondary">{r.nhanVien?.MaNhanVien}</Text>
        </Space>
      ),
    },
    {
      title: "Tháng/Năm",
      key: "period",
      render: (_, r) => `${r.Thang}/${r.Nam}`,
    },
    {
      title: "Lương cơ bản",
      dataIndex: "LuongCoBan",
      key: "baseSalary",
      render: fmt,
    },
    {
      title: "Thực lĩnh",
      dataIndex: "LuongThucNhan",
      key: "netSalary",
      render: (v) => <Text strong className="text-blue-600">{fmt(v)}</Text>,
    },
    {
      title: "Trạng thái",
      dataIndex: "TrangThai",
      key: "status",
      filters: [
        { text: "Đã thanh toán", value: "Paid" },
        { text: "Chờ xử lý", value: "Draft" },
      ],
      onFilter: (value: any, record: PhieuLuong) => {
        if (value === "Draft") {
          return record.TrangThai !== "Paid";
        }
        return record.TrangThai === value;
      },
      render: (s) => (
        <Tag color={s === "Paid" ? "green" : "orange"}>
          {s === "Paid" ? "Đã thanh toán" : "Chờ xử lý"}
        </Tag>
      ),
    },
    {
      title: "Thao tác",
      key: "action",
      width: 80,
      render: (_, r) => (
        <Tooltip title="Xem chi tiết">
          <Button
            type="text"
            icon={<EyeOutlined />}
            onClick={() => {
              setSelectedItem(r);
              setIsModalOpen(true);
            }}
          />
        </Tooltip>
      ),
    },
  ];

  return (
    <div className="p-6">
      <Row gutter={[16, 16]} align="middle" justify="space-between" className="mb-0">
        <Col>
          <Title level={2} className="m-0">Quản lý lương</Title>
          <Text type="secondary">Tính toán và theo dõi bảng lương hàng tháng</Text>
        </Col>
        <Col>
          <Space>
            <Button
              icon={<ReloadOutlined />}
              onClick={fetchPaySlips}
              loading={loading}
            >
              Làm mới
            </Button>
            <Button
              type="primary"
              icon={<DollarOutlined />}
              onClick={() => setIsSalaryModalOpen(true)}
              className="bg-green-600 hover:bg-green-700 border-none"
            >
              Cập nhật mức lương
            </Button>
            <Button
              type="primary"
              icon={<CalculatorOutlined />}
              onClick={handleCalculate}
              loading={calculating}
              className="bg-blue-600"
            >
              Tính lương tháng
            </Button>
            <Button
              icon={<FileExcelOutlined />}
              onClick={handleExportExcel}
              disabled={data.length === 0}
            >
              Xuất Excel
            </Button>
          </Space>
        </Col>
      </Row>

      <div style={{ height: "32px" }} />

      <div className="mb-0">
        <Space size="large">
          <div>
            <Text strong className="mr-2">Chọn tháng:</Text>
            <Select
              value={selectedMonth}
              onChange={setSelectedMonth}
              style={{ width: 120 }}
            >
              {Array.from({ length: 12 }, (_, i) => (
                <Option key={i + 1} value={i + 1}>Tháng {i + 1}</Option>
              ))}
            </Select>
          </div>
          <div>
            <Text strong className="mr-2">Chọn năm:</Text>
            <Select
              value={selectedYear}
              onChange={setSelectedYear}
              style={{ width: 100 }}
            >
              {[2024, 2025, 2026].map(y => (
                <Option key={y} value={y}>{y}</Option>
              ))}
            </Select>
          </div>
        </Space>
      </div>

      <div style={{ height: "32px" }} />

      <Table<PhieuLuong>
        columns={columns}
        dataSource={data}
        loading={loading}
        rowKey="Id"
        totalText="phiếu lương"
        noScroll={true}
        searchable={false}
      />

      <PayrollDetailModal
        visible={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        data={selectedItem}
      />

      <Modal
        title="Cập nhật mức lương nhân viên (SCD Loại 2)"
        open={isSalaryModalOpen}
        onCancel={() => {
          setIsSalaryModalOpen(false);
          salaryForm.resetFields();
        }}
        onOk={() => salaryForm.submit()}
        confirmLoading={updatingSalary}
        okText="Cập nhật"
        cancelText="Hủy"
        width={500}
      >
        <Form
          form={salaryForm}
          layout="vertical"
          onFinish={handleUpdateSalary}
        >
          <Form.Item
            name="MaNhanVienId"
            label="Chọn nhân viên"
            rules={[{ required: true, message: "Vui lòng chọn nhân viên" }]}
          >
            <Select
              placeholder="Chọn nhân viên cần điều chỉnh lương"
              showSearch
              filterOption={(input, option) =>
                (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
              }
              options={employees.map((e) => ({
                value: e.Id,
                label: `${e.HoTen} (${e.MaNhanVien}) - ${e.phongBan?.TenPhong || ""}`,
              }))}
            />
          </Form.Item>

          <Form.Item
            name="LuongCoBan"
            label="Lương cơ bản mới"
            rules={[{ required: true, message: "Vui lòng nhập lương cơ bản" }]}
          >
            <InputNumber
              className="w-full"
              min={0}
              placeholder="Ví dụ: 10,000,000"
              formatter={(v) => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
              parser={(value) => value!.replace(/\$\s?|(,*)/g, "") as any}
            />
          </Form.Item>

          <Form.Item
            name="PhuCap"
            label="Phụ cấp mới"
            rules={[{ required: true, message: "Vui lòng nhập phụ cấp" }]}
          >
            <InputNumber
              className="w-full"
              min={0}
              placeholder="Ví dụ: 1,000,000"
              formatter={(v) => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
              parser={(value) => value!.replace(/\$\s?|(,*)/g, "") as any}
            />
          </Form.Item>

          <Form.Item name="GhiChu" label="Ghi chú điều chỉnh">
            <Input.TextArea rows={3} placeholder="Lý do điều chỉnh lương..." />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
