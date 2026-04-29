"use client";

import { useState } from "react";
import { Space } from "antd";
import { 
  PlusOutlined, 
  FileExcelOutlined 
} from "@ant-design/icons";

// Shared Components
import Button from "../../../components/shared/Button/Button";
import Toast from "../../../components/shared/Toast/Toast";
import Modal from "../../../components/shared/Modal/Modal";

// Module Components
import EmployeeTable from "./_components/EmployeeTable";
import SearchFilter from "./_components/SearchFilter";
import BulkActions from "./_components/BulkActions";
import DeleteConfirm from "./_components/DeleteConfirm";
import EmployeeForm from "./_components/EmployeeForm";
import EmployeeDetail from "./_components/EmployeeDetail";

interface Employee {
  id: number;
  fullName: string;
  email: string;
  code: string;
  department: string;
  position: string;
  role: "Admin" | "Manager" | "Staff";
  joiningDate: string;
  status: "Đang làm" | "Nghỉ việc";
  avatarColor?: string;
}

const MOCK_EMPLOYEES: Employee[] = [
  { id: 1, fullName: "Nguyễn Văn Hùng", email: "admin@nexthr.com", code: "EMP-2025-001", department: "Ban Giám đốc", position: "Giám đốc", role: "Admin", joiningDate: "2/1/2025", status: "Đang làm", avatarColor: "#9c27b0" },
  { id: 2, fullName: "Trần Thị Lan", email: "lan.tran@nexthr.vn", code: "EMP-2025-002", department: "Phòng Nhân sự", position: "Trưởng phòng", role: "Manager", joiningDate: "5/1/2025", status: "Đang làm", avatarColor: "#f44336" },
  { id: 3, fullName: "Lê Minh Khoa", email: "khoa.le@nexthr.vn", code: "EMP-2025-003", department: "Phòng Công nghệ", position: "Trưởng phòng", role: "Manager", joiningDate: "10/1/2025", status: "Đang làm", avatarColor: "#2196f3" },
  { id: 4, fullName: "Phạm Thu Hà", email: "ha.pham@nexthr.vn", code: "EMP-2025-004", department: "Nhóm Backend", position: "Nhân viên", role: "Staff", joiningDate: "1/2/2025", status: "Đang làm", avatarColor: "#e91e63" },
  { id: 5, fullName: "Đỗ Quốc Bảo", email: "bao.do@nexthr.vn", code: "EMP-2025-005", department: "Phòng Kế toán", position: "Nhân viên", role: "Staff", joiningDate: "15/2/2025", status: "Đang làm", avatarColor: "#ff9800" },
];

export default function EmployeePage() {
  const [employees, setEmployees] = useState<Employee[]>(MOCK_EMPLOYEES);
  const [loading, setLoading] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState<any[]>([]);
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "edit" | "view">("add");
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);

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

  const handleFormFinish = (values: any) => {
    console.log("Form Values:", values);
    if (modalMode === "add") {
      const newEmp = {
        ...values,
        id: employees.length + 1,
        joiningDate: values.startDate?.format("DD/MM/YYYY") || "N/A",
        status: "Đang làm",
        avatarColor: "#" + Math.floor(Math.random()*16777215).toString(16)
      };
      setEmployees([newEmp, ...employees]);
      Toast.success("Thêm nhân viên mới thành công");
    } else {
      setEmployees(employees.map(emp => emp.id === selectedEmployee?.id ? { ...emp, ...values } : emp));
      Toast.success("Cập nhật thông tin thành công");
    }
    closeModal();
  };

  const handleDelete = (id: number) => {
    DeleteConfirm.show({
      onConfirm: () => {
        setEmployees(employees.filter(emp => emp.id !== id));
        Toast.success("Đã xoá nhân viên thành công");
      }
    });
  };

  const handleBulkDelete = () => {
    DeleteConfirm.show({
      title: "Xoá hàng loạt",
      content: `Bạn có chắc chắn muốn xoá ${selectedRowKeys.length} nhân viên đã chọn?`,
      onConfirm: () => {
        setEmployees(employees.filter(emp => !selectedRowKeys.includes(emp.id)));
        setSelectedRowKeys([]);
        Toast.success(`Đã xoá ${selectedRowKeys.length} nhân viên`);
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

      {/* Search & Filter Bar */}
      <SearchFilter 
        onSearch={(v) => console.log('Search:', v)}
        onFilterChange={(n, v) => console.log('Filter:', n, v)}
      />

      {/* Extreme Physical spacer to ensure separation */}
      <div className="h-20" />

      <div style={{ marginTop: '20px' }}>
        {/* Employee Table */}
        <EmployeeTable 
          data={employees}
          loading={loading}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onView={handleView}
          onSelectionChange={(keys) => setSelectedRowKeys(keys)}
        />
      </div>

      {/* Bulk Actions Menu */}
      <div className="mt-4">
        <BulkActions 
          selectedCount={selectedRowKeys.length}
          onBulkDelete={handleBulkDelete}
          onBulkEdit={() => Toast.info("Chức năng đang phát triển")}
        />
      </div>

      {/* Reusable Modal */}
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
