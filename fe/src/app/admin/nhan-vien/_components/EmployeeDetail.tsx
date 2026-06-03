"use client";

import React, { useEffect, useState } from "react";
import { Descriptions, Avatar, Space, Tag, Tabs, Table } from "antd";
import { 
  FileTextOutlined, 
  UserOutlined, 
  PlusOutlined, 
  DeleteOutlined, 
  DollarOutlined, 
  SolutionOutlined, 
  HistoryOutlined, 
  EyeOutlined 
} from "@ant-design/icons";
import { 
  Employee, 
  Contract, 
  getEmployeeContractsApi, 
  createContractApi, 
  deleteContractApi 
} from "@/services/employee.service";
import payrollService from "@/services/payroll.service";
import { PhieuLuong, LichSuLuong } from "@/types/payroll";
import Toast from "@/components/shared/Toast/Toast";
import Button from "@/components/shared/Button/Button";
import Modal from "@/components/shared/Modal/Modal";
import { Form, Input, DatePicker, InputNumber, Select, Popconfirm } from "antd";
import PayrollDetailModal from "@/components/payroll/PayrollDetailModal";

interface EmployeeDetailProps {
  employee: Employee | null;
}

const EmployeeDetail: React.FC<EmployeeDetailProps> = ({ employee }) => {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [salaryHistory, setSalaryHistory] = useState<LichSuLuong[]>([]);
  const [payslips, setPayslips] = useState<PhieuLuong[]>([]);
  
  const [loading, setLoading] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [payslipsLoading, setPayslipsLoading] = useState(false);

  const [isContractModalOpen, setIsContractModalOpen] = useState(false);
  const [contractForm] = Form.useForm();
  const [isSalaryModalOpen, setIsSalaryModalOpen] = useState(false);
  const [updatingSalary, setUpdatingSalary] = useState(false);
  const [salaryForm] = Form.useForm();

  // State for opening specific monthly payslip breakdown modal
  const [selectedPayslip, setSelectedPayslip] = useState<PhieuLuong | null>(null);
  const [isPayslipModalOpen, setIsPayslipModalOpen] = useState(false);

  const handleUpdateSalary = async (values: any) => {
    if (!employee) return;
    setUpdatingSalary(true);
    try {
      await payrollService.updateSalary({
        MaNhanVienId: employee.Id,
        LuongCoBan: values.LuongCoBan,
        PhuCap: values.PhuCap,
        GhiChu: values.GhiChu,
      });
      Toast.success("Cập nhật mức lương thành công!");
      setIsSalaryModalOpen(false);
      salaryForm.resetFields();
      
      // Refresh contracts, history, and payslips
      fetchContracts();
      fetchSalaryAndPayslips();
    } catch (error: any) {
      Toast.error(error.message || "Lỗi khi cập nhật mức lương");
    } finally {
      setUpdatingSalary(false);
    }
  };

  const fetchContracts = async () => {
    if (employee) {
      setLoading(true);
      try {
        const data = await getEmployeeContractsApi(employee.Id);
        setContracts(data);
      } catch (error) {
        Toast.error("Lỗi khi tải danh sách hợp đồng");
      } finally {
        setLoading(false);
      }
    }
  };

  const fetchSalaryAndPayslips = async () => {
    if (employee) {
      setHistoryLoading(true);
      setPayslipsLoading(true);
      try {
        const [historyData, payslipsData] = await Promise.all([
          payrollService.getEmployeeSalaryHistory(employee.Id).catch(() => []),
          payrollService.getEmployeePaySlips(employee.Id).catch(() => []),
        ]);
        setSalaryHistory(historyData);
        setPayslips(payslipsData);
      } catch (err) {
        console.error("Lỗi khi tải lịch sử lương & phiếu lương:", err);
      } finally {
        setHistoryLoading(false);
        setPayslipsLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchContracts();
    fetchSalaryAndPayslips();
  }, [employee]);

  const handleAddContract = async (values: any) => {
    try {
      const data = {
        ...values,
        MaNhanVienId: employee?.Id,
        NgayKy: values.NgayKy?.format("YYYY-MM-DD"),
        NgayBatDau: values.NgayBatDau?.format("YYYY-MM-DD"),
        NgayKetThuc: values.NgayKetThuc ? values.NgayKetThuc.format("YYYY-MM-DD") : null,
        TrangThai: "Active"
      };
      await createContractApi(data);
      Toast.success("Thêm hợp đồng mới thành công");
      setIsContractModalOpen(false);
      contractForm.resetFields();
      
      fetchContracts();
      fetchSalaryAndPayslips();
    } catch (error: any) {
      console.error("Contract creation error:", error);
      const errorMsg = Array.isArray(error.message) ? error.message.join(", ") : error.message;
      Toast.error(errorMsg || "Lỗi khi thêm hợp đồng");
    }
  };

  const handleDeleteContract = async (id: number) => {
    try {
      await deleteContractApi(id);
      Toast.success("Đã xóa hợp đồng");
      fetchContracts();
    } catch (error: any) {
      Toast.error(error.message || "Lỗi khi xóa hợp đồng");
    }
  };

  if (!employee) return null;

  const contractColumns = [
    { 
      title: "Mã hợp đồng", 
      dataIndex: "MaHopDong", 
      key: "MaHopDong",
      width: 120,
      render: (code: string) => <Tag className="font-mono text-[10px]">{code}</Tag>
    },
    { title: "Loại hợp đồng", dataIndex: "LoaiHopDong", key: "LoaiHopDong" },
    { 
      title: "Ngày bắt đầu", 
      dataIndex: "NgayBatDau", 
      key: "NgayBatDau",
      render: (date: string) => date ? new Date(date).toLocaleDateString("vi-VN") : "N/A"
    },
    { 
      title: "Ngày kết thúc", 
      dataIndex: "NgayKetThuc", 
      key: "NgayKetThuc",
      render: (date: string) => date ? new Date(date).toLocaleDateString("vi-VN") : "Không thời hạn"
    },
    { 
      title: "Lương cơ bản", 
      dataIndex: "LuongCoBan", 
      key: "LuongCoBan",
      render: (val: number) => val?.toLocaleString("vi-VN") + " VNĐ"
    },
    { 
      title: "Trạng thái", 
      dataIndex: "TrangThai", 
      key: "TrangThai",
      render: (status: string) => (
        <Tag color={status === "Active" ? "green" : "default"}>
          {status === "Active" ? "Đang hiệu lực" : "Hết hạn"}
        </Tag>
      )
    },
    {
      title: "Thao tác",
      key: "action",
      width: 60,
      render: (_: any, record: Contract) => (
        <Popconfirm title="Xóa hợp đồng này?" onConfirm={() => handleDeleteContract(record.Id)}>
          <Button type="text" danger icon={<DeleteOutlined />} size="small" />
        </Popconfirm>
      )
    }
  ];

  const salaryHistoryColumns = [
    {
      title: "Ngày bắt đầu",
      dataIndex: "NgayBatDau",
      key: "NgayBatDau",
      render: (date: string) => date ? new Date(date).toLocaleDateString("vi-VN") : "N/A"
    },
    {
      title: "Ngày kết thúc",
      dataIndex: "NgayKetThuc",
      key: "NgayKetThuc",
      render: (date: string) => date ? new Date(date).toLocaleDateString("vi-VN") : "Hiện tại"
    },
    {
      title: "Lương cơ bản",
      dataIndex: "LuongCoBan",
      key: "LuongCoBan",
      render: (val: number) => val?.toLocaleString("vi-VN") + " VNĐ"
    },
    {
      title: "Phụ cấp",
      dataIndex: "PhuCap",
      key: "PhuCap",
      render: (val: number) => val?.toLocaleString("vi-VN") + " VNĐ"
    },
    {
      title: "Người thay đổi",
      key: "nguoiThayDoi",
      render: (_: any, record: LichSuLuong) => record.nguoiThayDoi?.HoTen || "Hệ thống"
    },
    {
      title: "Trạng thái",
      dataIndex: "DangHieuLuc",
      key: "DangHieuLuc",
      render: (active: boolean) => (
        <Tag color={active ? "green" : "default"}>
          {active ? "Đang hiệu lực" : "Hết hiệu lực"}
        </Tag>
      )
    },
    {
      title: "Ghi chú",
      dataIndex: "GhiChu",
      key: "GhiChu",
      render: (text: string) => text || "-"
    }
  ];

  const payslipColumns = [
    {
      title: "Kỳ lương",
      key: "period",
      render: (_: any, record: PhieuLuong) => `Tháng ${record.Thang}/${record.Nam}`
    },
    {
      title: "Lương cơ bản",
      dataIndex: "LuongCoBan",
      key: "LuongCoBan",
      render: (val: number) => val?.toLocaleString("vi-VN") + " VNĐ"
    },
    {
      title: "Tổng gộp (Gross)",
      dataIndex: "TongLuongGop",
      key: "TongLuongGop",
      render: (val: number) => val?.toLocaleString("vi-VN") + " VNĐ"
    },
    {
      title: "Thực nhận (Net)",
      dataIndex: "LuongThucNhan",
      key: "LuongThucNhan",
      render: (val: number) => <span className="font-semibold text-green-700">{val?.toLocaleString("vi-VN") + " VNĐ"}</span>
    },
    {
      title: "Trạng thái",
      dataIndex: "TrangThai",
      key: "TrangThai",
      filters: [
        { text: "Đã thanh toán", value: "Paid" },
        { text: "Đã duyệt", value: "Approved" },
        { text: "Chờ xử lý", value: "Draft" }
      ],
      onFilter: (value: any, record: PhieuLuong) => {
        if (value === "Draft") {
          return record.TrangThai !== "Paid" && record.TrangThai !== "Approved";
        }
        return record.TrangThai === value;
      },
      render: (status: string) => {
        const color = status === "Paid" ? "green" : (status === "Approved" ? "blue" : "orange");
        const text = status === "Paid" ? "Đã thanh toán" : (status === "Approved" ? "Đã duyệt" : "Chờ xử lý");
        return <Tag color={color}>{text}</Tag>;
      }
    },
    {
      title: "Xem chi tiết",
      key: "action",
      width: 100,
      render: (_: any, record: PhieuLuong) => (
        <Button
          type="text"
          icon={<EyeOutlined />}
          size="small"
          onClick={() => {
            setSelectedPayslip(record);
            setIsPayslipModalOpen(true);
          }}
        />
      )
    }
  ];

  return (
    <div className="p-2">
      {/* Profile Header Block */}
      <div className="flex items-center gap-5 mb-5 bg-gradient-to-r from-gray-50 to-gray-100 p-4 rounded-xl shadow-sm">
        {/* Beautiful Avatar */}
        <Avatar 
          size={64} 
          style={{ 
            backgroundColor: "#c41d1d", 
            fontWeight: "bold", 
            fontSize: "24px",
            boxShadow: "0 2px 8px rgba(196, 29, 29, 0.15)",
            border: "2px solid #fff"
          }}
        >
          {employee.HoTen.charAt(0).toUpperCase()}
        </Avatar>
        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
          <h2 style={{ fontSize: "20px", fontWeight: "800", margin: 0, padding: 0, lineHeight: "1.2", color: "#111827" }}>
            {employee.HoTen}
          </h2>
          <p style={{ fontSize: "14px", color: "#4b5563", margin: 0, padding: 0, lineHeight: "1.3" }}>
            {employee.Email}
          </p>
          <div style={{ display: "flex", gap: "8px", marginTop: "2px", alignItems: "center" }}>
            <Tag color="red" style={{ fontWeight: "bold", margin: 0, fontSize: "11px", padding: "1px 8px", borderRadius: "4px" }}>
              {employee.MaNhanVien}
            </Tag>
            <Tag color="blue" style={{ fontWeight: 500, margin: 0, fontSize: "11px", padding: "1px 8px", borderRadius: "4px" }}>
              {employee.vaiTro?.TenVaiTro || "Nhân viên"}
            </Tag>
          </div>
        </div>
      </div>

      <Tabs
        defaultActiveKey="1"
        items={[
          {
            key: "1",
            label: (
              <span>
                <UserOutlined /> Cá nhân
              </span>
            ),
            children: (
              <div className="pt-2 animate-in fade-in duration-500">
                <Descriptions 
                  column={1} 
                  size="middle" 
                  className="mt-2"
                  labelStyle={{ fontWeight: 600, fontSize: "14px", color: "#4b5563", width: "160px" }}
                  contentStyle={{ fontSize: "14px", color: "#1f2937" }}
                >
                  <Descriptions.Item label="Họ và Tên">{employee.HoTen}</Descriptions.Item>
                  <Descriptions.Item label="Email">{employee.Email}</Descriptions.Item>
                  <Descriptions.Item label="Số điện thoại">{employee.SoDienThoai || "N/A"}</Descriptions.Item>
                  <Descriptions.Item label="Giới tính">{employee.GioiTinh || "N/A"}</Descriptions.Item>
                  <Descriptions.Item label="Ngày sinh">
                    {employee.NgaySinh ? new Date(employee.NgaySinh).toLocaleDateString("vi-VN") : "N/A"}
                  </Descriptions.Item>
                  <Descriptions.Item label="Số CCCD">{employee.SoCCCD || "N/A"}</Descriptions.Item>
                  <Descriptions.Item label="Địa chỉ">{employee.DiaChi || "N/A"}</Descriptions.Item>
                </Descriptions>
              </div>
            ),
          },
          {
            key: "2",
            label: (
              <span>
                <SolutionOutlined /> Công tác
              </span>
            ),
            children: (
              <div className="pt-2 animate-in fade-in duration-500">
                <Descriptions 
                  column={1} 
                  size="middle"
                  labelStyle={{ fontWeight: 600, fontSize: "14px", color: "#4b5563", width: "160px" }}
                  contentStyle={{ fontSize: "14px", color: "#1f2937" }}
                >
                  <Descriptions.Item label="Mã nhân viên">
                    <Tag color="red" className="font-bold">{employee.MaNhanVien}</Tag>
                  </Descriptions.Item>
                  <Descriptions.Item label="Phòng ban">{employee.phongBan?.TenPhong || "N/A"}</Descriptions.Item>
                  <Descriptions.Item label="Chức vụ">{employee.chucVu?.TenChucVu || "N/A"}</Descriptions.Item>
                  <Descriptions.Item label="Ngày vào làm">
                    {employee.NgayVaoLam ? new Date(employee.NgayVaoLam).toLocaleDateString("vi-VN") : "N/A"}
                  </Descriptions.Item>
                  <Descriptions.Item label="Trạng thái">
                    <Tag color={employee.TrangThai === "Active" ? "success" : "default"}>
                      {employee.TrangThai === "Active" ? "Đang làm việc" : "Nghỉ việc"}
                    </Tag>
                  </Descriptions.Item>
                </Descriptions>
              </div>
            ),
          },
          {
            key: "3",
            label: (
              <span>
                <DollarOutlined /> Tài chính & Thuế
              </span>
            ),
            children: (
              <div className="pt-2 animate-in fade-in duration-500">
                <Descriptions 
                  column={1} 
                  size="middle"
                  labelStyle={{ fontWeight: 600, fontSize: "14px", color: "#4b5563", width: "160px" }}
                  contentStyle={{ fontSize: "14px", color: "#1f2937" }}
                >
                  <Descriptions.Item label="Mã số thuế (MST)">{employee.MaSoThue || "N/A"}</Descriptions.Item>
                  <Descriptions.Item label="Số người phụ thuộc">{employee.SoNguoiPhuThuoc !== undefined ? employee.SoNguoiPhuThuoc : "N/A"}</Descriptions.Item>
                  <Descriptions.Item label="Tài khoản ngân hàng">
                    {employee.SoTaiKhoan ? `${employee.SoTaiKhoan} - ${employee.TenNganHang || ""} ${employee.ChiNhanhNganHang ? `(${employee.ChiNhanhNganHang})` : ""}` : "Chưa cập nhật"}
                  </Descriptions.Item>
                </Descriptions>
                <div className="flex justify-end mt-4">
                  <Button
                    type="primary"
                    icon={<DollarOutlined />}
                    onClick={() => setIsSalaryModalOpen(true)}
                    size="small"
                  >
                    Điều chỉnh lương
                  </Button>
                </div>
              </div>
            ),
          },
          {
            key: "4",
            label: (
              <span>
                <HistoryOutlined /> Lịch sử lương
              </span>
            ),
            children: (
              <div className="pt-2 animate-in fade-in duration-500">
                 <Table
                  columns={salaryHistoryColumns}
                  dataSource={salaryHistory}
                  loading={historyLoading}
                  rowKey="Id"
                  pagination={{ pageSize: 5 }}
                  size="small"
                  locale={{ emptyText: "Chưa có lịch sử thay đổi lương" }}
                />
              </div>
            ),
          },
          {
            key: "5",
            label: (
              <span>
                <FileTextOutlined /> Phiếu lương
              </span>
            ),
            children: (
              <div className="pt-2 animate-in fade-in duration-500">
                <Table
                  columns={payslipColumns}
                  dataSource={payslips}
                  loading={payslipsLoading}
                  rowKey="Id"
                  pagination={{ pageSize: 5 }}
                  size="small"
                  locale={{ emptyText: "Chưa có dữ liệu phiếu lương" }}
                />
              </div>
            ),
          },
          {
            key: "6",
            label: (
              <span>
                <FileTextOutlined /> Hợp đồng lao động
              </span>
            ),
            children: (
              <div className="pt-2 animate-in slide-in-from-right duration-500">
                <div className="flex justify-end mb-4">
                  <Button 
                    type="primary" 
                    icon={<PlusOutlined />} 
                    onClick={() => setIsContractModalOpen(true)}
                    size="small"
                  >
                    Thêm hợp đồng
                  </Button>
                </div>
                <Table
                  columns={contractColumns}
                  dataSource={contracts}
                  loading={loading}
                  rowKey="Id"
                  pagination={false}
                  size="small"
                  locale={{ emptyText: "Chưa có dữ liệu hợp đồng" }}
                />
              </div>
            ),
          },
        ]}
      />


      <Modal
        title="Thêm hợp đồng mới"
        open={isContractModalOpen}
        onCancel={() => setIsContractModalOpen(false)}
        onOk={() => contractForm.submit()}
        width={500}
      >
        <Form 
          form={contractForm} 
          layout="vertical" 
          onFinish={handleAddContract}
          initialValues={{ LoaiHopDong: "Xác định thời hạn" }}
        >
          <Form.Item name="LoaiHopDong" label="Loại hợp đồng" rules={[{ required: true }]}>
            <Select>
              <Select.Option value="Thử việc">Thử việc</Select.Option>
              <Select.Option value="Xác định thời hạn">Xác định thời hạn</Select.Option>
              <Select.Option value="Không xác định thời hạn">Không xác định thời hạn</Select.Option>
            </Select>
          </Form.Item>
          <div className="grid grid-cols-2 gap-4">
            <Form.Item name="NgayKy" label="Ngày ký" rules={[{ required: true }]}>
              <DatePicker className="w-full" format="DD/MM/YYYY" />
            </Form.Item>
            <Form.Item name="NgayBatDau" label="Ngày bắt đầu" rules={[{ required: true }]}>
              <DatePicker className="w-full" format="DD/MM/YYYY" />
            </Form.Item>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Form.Item name="NgayKetThuc" label="Ngày kết thúc">
              <DatePicker className="w-full" format="DD/MM/YYYY" />
            </Form.Item>
            <Form.Item name="LuongCoBan" label="Lương cơ bản" rules={[{ required: true }]}>
              <InputNumber 
                className="w-full" 
                min={0}
                formatter={v => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} 
                parser={(value) => value!.replace(/\$\s?|(,*)/g, "") as any}
              />
            </Form.Item>
          </div>
          <Form.Item name="GhiChu" label="Ghi chú">
            <Input.TextArea rows={2} />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Điều chỉnh lương (SCD Loại 2)"
        open={isSalaryModalOpen}
        onCancel={() => {
          setIsSalaryModalOpen(false);
          salaryForm.resetFields();
        }}
        onOk={() => salaryForm.submit()}
        confirmLoading={updatingSalary}
        width={400}
      >
        <Form
          form={salaryForm}
          layout="vertical"
          onFinish={handleUpdateSalary}
        >
          <Form.Item
            name="LuongCoBan"
            label="Lương cơ bản mới"
            rules={[{ required: true, message: "Vui lòng nhập lương cơ bản" }]}
          >
            <InputNumber
              className="w-full"
              min={0}
              placeholder="Ví dụ: 15,000,000"
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
              placeholder="Ví dụ: 2,000,000"
              formatter={(v) => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
              parser={(value) => value!.replace(/\$\s?|(,*)/g, "") as any}
            />
          </Form.Item>

          <Form.Item name="GhiChu" label="Ghi chú điều chỉnh">
            <Input.TextArea rows={2} placeholder="Lý do điều chỉnh lương..." />
          </Form.Item>
        </Form>
      </Modal>

      {/* Monthly Payslip Breakdown Modal */}
      <PayrollDetailModal
        visible={isPayslipModalOpen}
        onClose={() => {
          setIsPayslipModalOpen(false);
          setSelectedPayslip(null);
        }}
        data={selectedPayslip}
      />
    </div>
  );
};

export default EmployeeDetail;
