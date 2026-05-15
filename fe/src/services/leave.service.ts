import api from './api';

export const LeaveService = {
  applyLeave: async (data: {
    MaLoaiPhepId: number;
    NgayBatDau: string;
    NgayKetThuc: string;
    TongSoNgay: number;
    LyDo?: string;
  }): Promise<any> => {
    const response = await api.post('/leave/apply', data);
    return response;
  },

  getLeaveHistory: async (): Promise<any[]> => {
    const response = await api.get('/leave/history');
    return response as any;
  },

  getLeaveTypes: async (): Promise<any[]> => {
    const response = await api.get('/leave/types');
    return response as any;
  },

  getAllLeaveRequests: async (status?: string): Promise<any[]> => {
    const response = await api.get('/leave/all', { params: { status } });
    return response as any;
  },

  approveLeave: async (id: number, status: 'Approved' | 'Rejected', reason?: string): Promise<any> => {
    const response = await api.put(`/leave/${id}/approve`, { status, reason });
    return response;
  },

  getLeaveBalances: async (year?: number): Promise<any[]> => {
    const response = await api.get('/leave/balances', { params: { year } });
    return response as any;
  },
};
