import api from "./api";
import { PhieuLuong, CalculatePayrollDto, LichSuLuong, UpdateSalaryDto } from "@/types/payroll";

export const payrollService = {
  /**
   * Tính toán bảng lương tháng
   */
  calculatePayroll: async (data: CalculatePayrollDto): Promise<PhieuLuong[]> => {
    return api.post("/payroll/calculate", data);
  },

  /**
   * Lấy danh sách toàn bộ phiếu lương (Admin/Manager)
   */
  getAllPaySlips: async (thang?: number, nam?: number): Promise<PhieuLuong[]> => {
    const params = { thang, nam };
    return api.get("/payroll/all-payslips", { params });
  },

  /**
   * Lấy danh sách phiếu lương cá nhân (Staff)
   */
  getMyPaySlips: async (): Promise<PhieuLuong[]> => {
    return api.get("/payroll/my-payslips");
  },

  /**
   * Cập nhật mức lương nhân viên (SCD Loại 2)
   */
  updateSalary: async (data: UpdateSalaryDto): Promise<any> => {
    return api.post("/payroll/update-salary", data);
  },

  /**
   * Lấy lịch sử thay đổi lương cá nhân
   */
  getMySalaryHistory: async (): Promise<LichSuLuong[]> => {
    return api.get("/payroll/my-salary-history");
  },

  /**
   * Lấy lịch sử thay đổi lương của nhân viên cụ thể (Admin)
   */
  getEmployeeSalaryHistory: async (employeeId: number): Promise<LichSuLuong[]> => {
    return api.get(`/payroll/history/${employeeId}`);
  },

  /**
   * Lấy danh sách phiếu lương của nhân viên cụ thể (Admin)
   */
  getEmployeePaySlips: async (employeeId: number): Promise<PhieuLuong[]> => {
    return api.get(`/payroll/employee-payslips/${employeeId}`);
  },
};

export default payrollService;
