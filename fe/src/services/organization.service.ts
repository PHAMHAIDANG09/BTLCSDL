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
  const response = await api.get<Department[]>('/organization/phong-ban');
  return response as unknown as Department[];
};

export const getPositionsApi = async (): Promise<Position[]> => {
  const response = await api.get<Position[]>('/organization/chuc-vu');
  return response as unknown as Position[];
};
