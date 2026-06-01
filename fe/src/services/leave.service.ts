import api from './api';

export const LeaveService = {
  applyLeave: async (data: {
    MaLoaiPhepId: number;
    NgayBatDau: string;
    NgayKetThuc: string;
    TongSoNgay: number;
    LyDo?: string;
  }): Promise<any> => {
    const response = await api.post('/nghi-phep/gui-don', data);
    return response;
  },

  getLeaveHistory: async (): Promise<any[]> => {
    const response = await api.get('/nghi-phep/lich-su');
    return response as any;
  },

  getLeaveTypes: async (): Promise<any[]> => {
    const response = await api.get('/nghi-phep/loai-phep');
    return response as any;
  },

  getAllLeaveRequests: async (status?: string): Promise<any[]> => {
    const response = await api.get('/nghi-phep/tat-ca', { params: { status } });
    return response as any;
  },

  approveLeave: async (id: number, status: 'Approved' | 'Rejected', reason?: string): Promise<any> => {
    const response = await api.put(`/nghi-phep/${id}/duyet`, { status, reason });
    return response;
  },

  getLeaveBalances: async (year?: number): Promise<any[]> => {
    const response = await api.get('/nghi-phep/so-du', { params: { year } });
    return response as any;
  },
};
