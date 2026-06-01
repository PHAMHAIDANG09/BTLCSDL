import api from './api';

export interface AttendanceRecord {
  Id: number;
  MaNhanVienId: number;
  NgayLamViec: string;
  GioVao: string | null;
  GioRa: string | null;
  SoPhutDiMuon: number;
  SoGioLam: number;
  TrangThai: string;
  GhiChu: string | null;
}

export const AttendanceService = {
  getTodayStatus: async (): Promise<AttendanceRecord | null> => {
    try {
      const response = await api.get('/cham-cong/hom-nay');
      return response as any;
    } catch (error) {
      console.error('Error fetching today attendance:', error);
      return null;
    }
  },

  checkInOut: async (): Promise<AttendanceRecord> => {
    const response = await api.post('/cham-cong/diem-danh');
    return response as any;
  },

  getAllHistory: async (startDate: string, endDate: string): Promise<any[]> => {
    const response = await api.get('/cham-cong/tat-ca-lich-su', {
      params: { startDate, endDate },
    });
    return response as any;
  },

  getHistory: async (startDate?: string, endDate?: string): Promise<AttendanceRecord[]> => {
    const response = await api.get('/cham-cong/lich-su', {
      params: { startDate, endDate },
    });
    return response as any;
  },

  deleteAttendance: async (id: string): Promise<void> => {
    await api.delete(`/cham-cong/${id}`);
  },

  updateAttendance: async (id: string, data: any): Promise<AttendanceRecord> => {
    const response = await api.put(`/cham-cong/${id}`, data);
    return response as any;
  },

  getMonthlySummary: async (month: number, year: number): Promise<any[]> => {
    const response = await api.get('/cham-cong/tong-hop', { params: { month, year } });
    return response as any;
  },

  // --- OT APIs ---
  registerOT: async (data: {
    NgayLamThem: string;
    GioBatDau: string;
    GioKetThuc: string;
    TongSoGio: number;
    LyDo?: string;
    LoaiOT?: string;
  }): Promise<any> => {
    const response = await api.post('/cham-cong/lam-them', data);
    return response;
  },

  approveOT: async (id: number, status: 'Approved' | 'Rejected'): Promise<any> => {
    const response = await api.put(`/cham-cong/lam-them/${id}/duyet`, { status });
    return response;
  },

  getAllOTRequests: async (status?: string): Promise<any[]> => {
    const response = await api.get('/cham-cong/lam-them', { params: { status } });
    return response as any;
  },

  getOTHistory: async (): Promise<any[]> => {
    const response = await api.get('/cham-cong/lam-them/lich-su');
    return response as any;
  },
};
