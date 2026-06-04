import { api } from "./api";
import { NgayLe, CreateNgayLeDto, NhatKyHeThong } from "../types/system";

export const systemService = {
  getLogs: async (limit?: number): Promise<NhatKyHeThong[]> => {
    const response = await api.get('/system/logs', { params: { limit } });
    return response as any;
  },

  getHolidays: async (): Promise<NgayLe[]> => {
    const response = await api.get('/system/holidays');
    return response as any;
  },

  createHoliday: async (data: CreateNgayLeDto): Promise<NgayLe> => {
    const response = await api.post('/system/holidays', data);
    return response as any;
  }
};
