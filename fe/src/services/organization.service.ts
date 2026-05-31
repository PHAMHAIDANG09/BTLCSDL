/**
 * Organization Service
 * Lấy thông tin phòng ban, chức vụ
 */

import api from './api';

export interface Department {
  Id: number;
  TenPhong: string;
  MaPhong: string;
}

export interface Position {
  Id: number;
  TenChucVu: string;
  MaChucVu: string;
}

export const getDepartmentsApi = async (): Promise<Department[]> => {
  const response = await api.get<Department[]>('/co-cau-to-chuc/phong-ban');
  return response as unknown as Department[];
};

export const getPositionsApi = async (): Promise<Position[]> => {
  const response = await api.get<Position[]>('/co-cau-to-chuc/chuc-vu');
  return response as unknown as Position[];
};
