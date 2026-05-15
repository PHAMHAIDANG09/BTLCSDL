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
} from "antd";
import {
  CalculatorOutlined,
  FileExcelOutlined,
  EyeOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import Table from "@/components/shared/Table/Table";
import type { TableColumnsType } from "antd";
import { PhieuLuong } from "@/types/payroll";
import payrollService from "@/services/payroll.service";
import PayrollDetailModal from "@/components/payroll/PayrollDetailModal";
import * as XLSX from "xlsx";
import confetti from "canvas-confetti";
import dayjs from "dayjs";

const { Title, Text } = Typography;
const { Option } = Select;

const fmt = (n: number) => n.toLocaleString("vi-VN") + " đ";

export default function AdminPayrollPage() {
  const [loading, setLoading] = useState(false);
  const [calculating, setCalculating] = useState(false);
  const [data, setData] = useState<PhieuLuong[]>([]);
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

  useEffect(() => {
    fetchPaySlips();
  }, [selectedMonth, selectedYear]);

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

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Payroll");
    XLSX.writeFile(wb, `Bang_Luong_${selectedMonth}_${selectedYear}.xlsx`);
  };

  const columns: TableColumnsType<PhieuLuong> = [
    {
      title: "Nhân viên",
      key: "employee",
      fixed: "left",
      width: 200,
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
      width: 120,
      render: (_, r) => `${r.Thang}/${r.Nam}`,
    },
    {
      title: "Lương cơ bản",
      dataIndex: "LuongCoBan",
      key: "baseSalary",
      width: 150,
      render: fmt,
    },
    {
      title: "Thực lĩnh",
      dataIndex: "LuongThucNhan",
      key: "netSalary",
      width: 150,
      render: (v) => <Text strong className="text-blue-600">{fmt(v)}</Text>,
    },
    {
      title: "Trạng thái",
      dataIndex: "TrangThai",
      key: "status",
      width: 130,
      render: (s) => (
        <Tag color={s === "Paid" ? "green" : "orange"}>
          {s === "Paid" ? "Đã thanh toán" : "Chờ xử lý"}
        </Tag>
      ),
    },
    {
      title: "Thao tác",
      key: "action",
      fixed: "right",
      width: 100,
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
      <Row gutter={[16, 16]} align="middle" justify="space-between" className="mb-6">
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

      <Card className="mb-6 shadow-sm">
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
      </Card>

      <Table<PhieuLuong>
        columns={columns}
        dataSource={data}
        loading={loading}
        rowKey="Id"
        totalText="phiếu lương"
      />

      <PayrollDetailModal
        visible={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        data={selectedItem}
      />
    </div>
  );
}
