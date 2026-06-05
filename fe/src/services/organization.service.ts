/**
 * Organization Service
 * Lấy thông tin phòng ban, chức vụ
 */

import api from './api';

export interface Department {
  Id: number;
  TenPhong: string;
  MaPhong: string;
  MaPhongCha?: number;
  MaQuanLy?: number;
  children?: Department[];
}

export interface Position {
  Id: number;
  TenChucVu: string;
  CapDo: number;
  MoTa?: string;
}

export const getDepartmentsApi = async (): Promise<Department[]> => {
  const response = await api.get<Department[]>('/co-cau-to-chuc/phong-ban');
  return response as unknown as Department[];
};

export const getOrganizationTreeApi = async (): Promise<Department[]> => {
  const response = await api.get<Department[]>('/co-cau-to-chuc/phong-ban/tree');
  return response as unknown as Department[];
};

export const createDepartmentApi = async (dto: {
  TenPhong: string;
  MaPhong: string;
  MaPhongCha?: number;
  MaQuanLy?: number;
}): Promise<Department> => {
  const response = await api.post<Department>('/co-cau-to-chuc/phong-ban', dto);
  return response as unknown as Department;
};

export const updateDepartmentApi = async (
  id: number,
  dto: {
    TenPhong?: string;
    MaPhong?: string;
    MaPhongCha?: number;
    MaQuanLy?: number;
  }
): Promise<Department> => {
  const response = await api.put<Department>(`/co-cau-to-chuc/phong-ban/${id}`, dto);
  return response as unknown as Department;
};

export const deleteDepartmentApi = async (id: number): Promise<void> => {
  await api.delete(`/co-cau-to-chuc/phong-ban/${id}`);
};

export const getPositionsApi = async (): Promise<Position[]> => {
  const response = await api.get<Position[]>('/co-cau-to-chuc/chuc-vu');
  return response as unknown as Position[];
};

export const createPositionApi = async (dto: {
  TenChucVu: string;
  CapDo: number;
  MoTa?: string;
}): Promise<Position> => {
  const response = await api.post<Position>('/co-cau-to-chuc/chuc-vu', dto);
  return response as unknown as Position;
};

export const updatePositionApi = async (
  id: number,
  dto: {
    TenChucVu?: string;
    CapDo?: number;
    MoTa?: string;
  }
): Promise<Position> => {
  const response = await api.put<Position>(`/co-cau-to-chuc/chuc-vu/${id}`, dto);
  return response as unknown as Position;
};

export const deletePositionApi = async (id: number): Promise<void> => {
  await api.delete(`/co-cau-to-chuc/chuc-vu/${id}`);
};
