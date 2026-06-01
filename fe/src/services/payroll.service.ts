import api from "./api";
import { PhieuLuong, CalculatePayrollDto, LichSuLuong, UpdateSalaryDto } from "@/types/payroll";

export const payrollService = {
  /**
   * Tính toán bảng lương tháng
   */
  calculatePayroll: async (data: CalculatePayrollDto): Promise<PhieuLuong[]> => {
    return api.post("/luong/tinh-luong", data);
  },

  /**
   * Lấy danh sách toàn bộ phiếu lương (Admin/Manager)
   */
  getAllPaySlips: async (thang?: number, nam?: number): Promise<PhieuLuong[]> => {
    const params = { thang, nam };
    return api.get("/luong/tat-ca-phieu-luong", { params });
  },

  /**
   * Lấy danh sách phiếu lương cá nhân (Staff)
   */
  getMyPaySlips: async (): Promise<PhieuLuong[]> => {
    return api.get("/luong/phieu-luong-cua-toi");
  },

  /**
   * Cập nhật mức lương nhân viên (SCD Loại 2)
   */
  updateSalary: async (data: UpdateSalaryDto): Promise<any> => {
    return api.post("/luong/cap-nhat-luong", data);
  },

  /**
   * Lấy lịch sử thay đổi lương cá nhân
   */
  getMySalaryHistory: async (): Promise<LichSuLuong[]> => {
    return api.get("/luong/lich-su-luong-cua-toi");
  },

  /**
   * Lấy lịch sử thay đổi lương của nhân viên cụ thể (Admin)
   */
  getEmployeeSalaryHistory: async (employeeId: number): Promise<LichSuLuong[]> => {
    return api.get(`/luong/lich-su/${employeeId}`);
  },

  /**
   * Lấy danh sách phiếu lương của nhân viên cụ thể (Admin)
   */
  getEmployeePaySlips: async (employeeId: number): Promise<PhieuLuong[]> => {
    return api.get(`/luong/phieu-luong-nhan-vien/${employeeId}`);
  },

  /**
   * Cập nhật trạng thái phiếu lương
   */
  updatePaySlipStatus: async (id: number, status: string): Promise<PhieuLuong> => {
    return api.put(`/luong/${id}`, { TrangThai: status });
  },

  /**
   * Xóa phiếu lương
   */
  deletePaySlip: async (id: number): Promise<any> => {
    return api.delete(`/luong/${id}`);
  },
};

export default payrollService;
