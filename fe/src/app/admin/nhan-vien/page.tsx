"use client";

import { useState } from "react";
import { Space } from "antd";
import { 
  PlusOutlined, 
  FileExcelOutlined 
} from "@ant-design/icons";

// Shared Components
import Button from "@/components/shared/Button/Button";
import Toast from "@/components/shared/Toast/Toast";
import Modal from "@/components/shared/Modal/Modal";
import { useEffect } from "react";
import { 
  getEmployeesApi, 
  createEmployeeApi, 
  updateEmployeeApi, 
  deleteEmployeeApi,
  Employee 
} from "@/services/employee.service";

// Module Components
import EmployeeTable from "@/app/admin/nhan-vien/_components/EmployeeTable";
import SearchFilter from "@/app/admin/nhan-vien/_components/SearchFilter";
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
        // Gửi toàn bộ values vì form đã format ngày tháng rồi
        await createEmployeeApi(values);
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
      <div className="mb-6">
        <h1 className="text-3xl font-black text-gray-900 tracking-tight m-0">Nhân viên</h1>
        <div className="flex items-center justify-between mt-1">
          <p className="text-gray-400 font-medium text-sm m-0">
            Quản lý và cập nhật thông tin nhân sự toàn hệ thống
          </p>
          <Space size="middle">
            <Button icon={<FileExcelOutlined />} className="px-4">Xuất dữ liệu</Button>
            <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd} className="px-6 h-10 font-bold">
              Thêm nhân viên
            </Button>
          </Space>
        </div>
      </div>

      <SearchFilter 
        onSearch={(v: string) => console.log('Search:', v)}
        onFilterChange={(n: string, v: string) => console.log('Filter:', n, v)}
      />

      <div className="h-4" />

      <div style={{ marginTop: '20px' }}>
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
        width={modalMode === "view" ? 600 : 800}
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
