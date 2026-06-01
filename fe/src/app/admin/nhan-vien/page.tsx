"use client";

import { useState, useEffect } from "react";
import { Space } from "antd";
import { 
  PlusOutlined, 
  FileExcelOutlined 
} from "@ant-design/icons";
import dayjs from "dayjs";
import { exportService } from "@/components/shared/utils/export";

// Shared Components
import Button from "@/components/shared/Button/Button";
import Toast from "@/components/shared/Toast/Toast";
import Modal from "@/components/shared/Modal/Modal";
import { 
  getEmployeesApi, 
  createEmployeeApi, 
  updateEmployeeApi, 
  deleteEmployeeApi,
  createContractApi,
  Employee 
} from "@/services/employee.service";

// Module Components
import EmployeeTable from "@/app/admin/nhan-vien/_components/EmployeeTable";
import BulkActions from "@/app/admin/nhan-vien/_components/BulkActions";
import DeleteConfirm from "@/app/admin/nhan-vien/_components/DeleteConfirm";
import EmployeeForm from "@/app/admin/nhan-vien/_components/EmployeeForm";
import EmployeeDetail from "@/app/admin/nhan-vien/_components/EmployeeDetail";

export default function EmployeePage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRowKeys, setSelectedRowKeys] = useState<any[]>([]);
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "edit" | "view">("add");
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const data = await getEmployeesApi();
      setEmployees(data);
    } catch (error) {
      Toast.error("Lỗi khi tải danh sách nhân viên");
    } finally {
      setLoading(false);
    }
  };

  const handleExportExcel = () => {
    if (!employees || employees.length === 0) {
      Toast.warning("Không có dữ liệu nhân viên để xuất");
      return;
    }
    const exportData = employees.map(emp => ({
      "Mã Nhân Viên": emp.MaNhanVien,
      "Họ Tên": emp.HoTen,
      "Email": emp.Email,
      "Số Điện Thoại": emp.SoDienThoai || "N/A",
      "Ngày Sinh": emp.NgaySinh ? dayjs(emp.NgaySinh).format("DD/MM/YYYY") : "N/A",
      "Giới Tính": emp.GioiTinh || "N/A",
      "Phòng Ban": emp.phongBan?.TenPhong || "N/A",
      "Chức Vụ": emp.chucVu?.TenChucVu || "N/A",
      "Vai Trò": emp.vaiTro?.TenVaiTro || "N/A",
      "Ngày Vào Làm": dayjs(emp.NgayVaoLam).format("DD/MM/YYYY"),
      "Trạng Thái": emp.TrangThai === "Active" ? "Đang làm việc" : emp.TrangThai === "Inactive" ? "Tạm nghỉ" : "Nghỉ việc",
    }));
    exportService.exportToExcel(exportData, "Danh_Sach_Nhan_Vien", "NhanVien");
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleAdd = () => {
    setModalMode("add");
    setSelectedEmployee(null);
    setIsModalOpen(true);
  };

  const handleEdit = (record: Employee) => {
    setModalMode("edit");
    setSelectedEmployee(record);
    setIsModalOpen(true);
  };

  const handleView = (record: Employee) => {
    setModalMode("view");
    setSelectedEmployee(record);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedEmployee(null);
  };

  const handleFormFinish = async (values: any) => {
    setLoading(true);
    try {
      if (modalMode === "add") {
        // Chỉ lấy đúng những trường được phép gửi khi thêm mới để khớp với CreateNhanVienDto
        const createData = {
          HoTen: values.HoTen,
          Email: values.Email,
          MatKhau: values.MatKhau,
          MaPhongId: values.MaPhongId,
          MaChucVuId: values.MaChucVuId,
          MaVaiTroId: values.MaVaiTroId,
          NgayVaoLam: values.NgayVaoLam,
          SoDienThoai: values.SoDienThoai,
          DiaChi: values.DiaChi,
          NgaySinh: values.NgaySinh,
          GioiTinh: values.GioiTinh,
          SoCCCD: values.SoCCCD,
          MaSoThue: values.MaSoThue,
          SoNguoiPhuThuoc: values.SoNguoiPhuThuoc,
          SoTaiKhoan: values.SoTaiKhoan,
          TenNganHang: values.TenNganHang,
          ChiNhanhNganHang: values.ChiNhanhNganHang,
        };
        
        const newEmp = await createEmployeeApi(createData);
        
        // Nếu có điền thông tin Lương cơ bản, tự động tạo Hợp đồng lao động ban đầu
        if (values.baseSalary && newEmp?.Id) {
          try {
            await createContractApi({
              MaNhanVienId: newEmp.Id,
              LoaiHopDong: values.contractType || "Xác định thời hạn",
              LuongCoBan: values.baseSalary,
              NgayKy: values.NgayVaoLam, // mặc định ngày ký là ngày vào làm
              NgayBatDau: values.NgayVaoLam, // ngày bắt đầu là ngày vào làm
              TrangThai: "Active",
            });
          } catch (contractError) {
            console.error("Lỗi tự động tạo hợp đồng:", contractError);
            Toast.warning("Tạo nhân viên thành công nhưng không thể tạo hợp đồng tự động.");
          }
        }
        
        Toast.success("Thêm nhân viên mới thành công");
      } else if (selectedEmployee) {
        // CHỈ LẤY đúng những trường được phép cập nhật để gửi lên Backend
        const updateData = {
          HoTen: values.HoTen,
          MaPhongId: values.MaPhongId,
          MaChucVuId: values.MaChucVuId,
          MaVaiTroId: values.MaVaiTroId,
          SoDienThoai: values.SoDienThoai,
          DiaChi: values.DiaChi,
          TrangThai: values.TrangThai,
          NgaySinh: values.NgaySinh,
          GioiTinh: values.GioiTinh,
          SoCCCD: values.SoCCCD,
          MaSoThue: values.MaSoThue,
          SoNguoiPhuThuoc: values.SoNguoiPhuThuoc,
          SoTaiKhoan: values.SoTaiKhoan,
          TenNganHang: values.TenNganHang,
          ChiNhanhNganHang: values.ChiNhanhNganHang,
        };
        
        await updateEmployeeApi(selectedEmployee.Id, updateData);
        Toast.success("Cập nhật thông tin thành công");
      }
      fetchEmployees();
      closeModal();
    } catch (error: any) {
      Toast.error(error.message || "Thao tác thất bại");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id: number) => {
    DeleteConfirm.show({
      onConfirm: async () => {
        try {
          await deleteEmployeeApi(id);
          Toast.success("Đã xoá nhân viên thành công");
          fetchEmployees();
        } catch (error) {
          Toast.error("Lỗi khi xóa nhân viên");
        }
      }
    });
  };

  const handleBulkDelete = () => {
    if (selectedRowKeys.length === 0) return;
    
    DeleteConfirm.show({
      title: "Xoá hàng loạt",
      content: `Bạn có chắc chắn muốn xoá ${selectedRowKeys.length} nhân viên đã chọn? Hành động này sẽ chuyển trạng thái của họ thành 'Nghỉ việc'.`,
      onConfirm: async () => {
        try {
          // Xóa từng nhân viên một (vì backend chưa có api xóa hàng loạt)
          await Promise.all(selectedRowKeys.map(id => deleteEmployeeApi(id)));
          Toast.success(`Đã xoá ${selectedRowKeys.length} nhân viên thành công`);
          setSelectedRowKeys([]);
          fetchEmployees();
        } catch (error) {
          Toast.error("Lỗi khi xóa một số nhân viên");
        }
      }
    });
  };

  const getModalTitle = () => {
    switch (modalMode) {
      case "add": return "Thêm nhân viên mới";
      case "edit": return "Chỉnh sửa thông tin";
      case "view": return "Chi tiết nhân viên";
      default: return "";
    }
  };

  return (
    <div className="max-w-[1600px] mx-auto animate-in fade-in duration-500 p-4">
      {/* Header Section */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight m-0" style={{ lineHeight: "1.1" }}>Nhân viên</h1>
          <p className="text-gray-400 font-medium text-sm m-0 mt-1">
            Quản lý và cập nhật thông tin nhân sự toàn hệ thống
          </p>
        </div>
        <Space size="middle">
          <Button icon={<FileExcelOutlined />} onClick={handleExportExcel} className="px-4">Xuất dữ liệu</Button>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd} className="px-6 h-10 font-bold">
            Thêm nhân viên
          </Button>
        </Space>
      </div>

      <div style={{ marginTop: '10px' }}>
        <EmployeeTable 
          data={employees}
          loading={loading}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onView={handleView}
          onSelectionChange={(keys: React.Key[]) => setSelectedRowKeys(keys as any[])}
        />
      </div>

      <div className="mt-4">
        <BulkActions 
          selectedCount={selectedRowKeys.length}
          onBulkDelete={handleBulkDelete}
          onBulkEdit={() => Toast.info("Chức năng đang phát triển")}
        />
      </div>

      <Modal
        title={getModalTitle()}
        open={isModalOpen}
        onCancel={closeModal}
        footer={null}
        width={modalMode === "view" ? 1000 : 800}
      >
        {modalMode === "view" ? (
          <EmployeeDetail employee={selectedEmployee} />
        ) : (
          <EmployeeForm 
            initialValues={selectedEmployee as any} 
            onFinish={handleFormFinish}
            onCancel={closeModal}
          />
        )}
      </Modal>
    </div>
  );
}
