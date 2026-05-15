import api from "./api";
import { PhieuLuong, CalculatePayrollDto } from "@/types/payroll";

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
};

export default payrollService;
