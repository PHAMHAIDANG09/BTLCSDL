/**
 * Dashboard Service
 * Gọi API thống kê tổng quan cho trang Admin Dashboard
 * BE endpoint: GET /api/dashboard/stats
 */

import api from './api';

// ─── Types ───────────────────────────────────────────────────────────────────

export interface DashboardStats {
  totalEmployees: number;
  presentToday: number;
  pendingLeaves: number;
  expiringContracts: number;
}

/** Dữ liệu 1 tháng trong quỹ lương (từ vw_BangLuongTongHop) */
export interface PayrollMonthData {
  Nam: number;
  Thang: number;
  TongLuongCoBan: number;
  TongTienLamThem: number;
  TongThucNhan: number;
}

/** Dữ liệu biến động nhân sự 1 tháng */
export interface HrMonthData {
  Nam: number;
  Thang: number;
  SoTuyenMoi: number;
}

/** Response từ GET /reports/thong-ke */
export interface ChartStatsResponse {
  quyLuong: PayrollMonthData[];
  diMuon: any[];
  bienDong: HrMonthData[];
  nghiViec: any[];
}

// ─── Service ─────────────────────────────────────────────────────────────────

export const dashboardService = {
  /**
   * Lấy thống kê tổng quan: tổng NV, có mặt hôm nay, đơn chờ duyệt, HĐ sắp hết hạn.
   * BE: GET /api/dashboard/stats
   */
  getStats: async (): Promise<DashboardStats> => {
    const data = await api.get<DashboardStats>('/dashboard/stats');
    return data as unknown as DashboardStats;
  },

  /**
   * Lấy dữ liệu biểu đồ (quỹ lương 6 tháng, biến động nhân sự, chấm công).
   * BE: GET /api/reports/thong-ke
   */
  getChartStats: async (): Promise<ChartStatsResponse> => {
    const data = await api.get<ChartStatsResponse>('/reports/thong-ke');
    return data as unknown as ChartStatsResponse;
  },
};

export default dashboardService;
