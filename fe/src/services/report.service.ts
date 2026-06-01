import api from "./api";

export const reportService = {
  /**
   * Lấy dữ liệu thống kê biểu đồ cho Reporting Center
   */
  getChartStats: async (): Promise<any> => {
    return api.get("/reports/thong-ke");
  },

  /**
   * Xuất báo cáo bảng công ra file Excel từ backend
   */
  exportAttendance: async (month: number, year: number): Promise<Blob> => {
    return api.get("/reports/bang-cong/export", {
      params: { thang: month, nam: year },
      responseType: "blob",
    });
  },

  /**
   * Xuất báo cáo bảng lương ra file Excel từ backend
   */
  exportPayroll: async (month: number, year: number): Promise<Blob> => {
    return api.get("/reports/phieu-luong/export", {
      params: { thang: month, nam: year },
      responseType: "blob",
    });
  },
};

export default reportService;
