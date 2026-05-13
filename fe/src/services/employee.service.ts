/**
 * Employee Service
 * Quản lý nhân viên và các thông tin liên quan (Hợp đồng, Chấm công, Lương)
 * Tất cả các route được chuyển sang Tiếng Việt theo yêu cầu
 */

import api from './api';

export interface Employee {
  Id: number;
  MaNhanVien: string;
  HoTen: string;
  Email: string;
  SoDienThoai: string;
  NgayVaoLam: string;
  NgaySinh?: string;
  GioiTinh: string;
  DiaChi?: string;
  MaPhongId: number;
  MaChucVuId: number;
  MaVaiTroId: number;
  TrangThai: 'Active' | 'Inactive' | 'Terminated';
  phongBan?: { TenPhong: string };
  chucVu?: { TenChucVu: string };
  vaiTro?: { TenVaiTro: string };
}

export interface Contract {
  Id: number;
  MaHopDong: string;
  LoaiHopDong: string;
  NgayKy: string;
  NgayBatDau: string;
  NgayKetThuc?: string;
  LuongCoBan: number;
  TrangThai: string;
  MaNhanVienId: number;
  nhanVien?: Employee;
}

/**
 * Lấy danh sách tất cả nhân viên
 */
export const getEmployeesApi = async (): Promise<Employee[]> => {
  const response = await api.get<Employee[]>('/nhan-vien');
  return response as unknown as Employee[];
};

/**
 * Lấy thông tin chi tiết một nhân viên
 */
export const getEmployeeByIdApi = async (id: number): Promise<Employee> => {
  const response = await api.get<Employee>(`/nhan-vien/${id}`);
  return response as unknown as Employee;
};

/**
 * Tạo mới nhân viên
 */
export const createEmployeeApi = async (data: any): Promise<Employee> => {
  const response = await api.post<Employee>('/nhan-vien', data);
  return response as unknown as Employee;
};

/**
 * Cập nhật thông tin nhân viên
 */
export const updateEmployeeApi = async (id: number, data: any): Promise<Employee> => {
  const response = await api.put<Employee>(`/nhan-vien/${id}`, data);
  return response as unknown as Employee;
};

/**
 * Xóa nhân viên (Soft delete - chuyển trạng thái)
 */
export const deleteEmployeeApi = async (id: number): Promise<void> => {
  await api.delete(`/nhan-vien/${id}`);
};

/**
 * Điều chuyển công tác
 */
export const transferEmployeeApi = async (id: number, data: any): Promise<any> => {
  const response = await api.post(`/nhan-vien/${id}/transfer`, data);
  return response;
};

// ─── CONTRACT APIS ──────────────────────────────────────────────

/**
 * Lấy tất cả hợp đồng trong hệ thống
 */
export const getContractsApi = async (): Promise<Contract[]> => {
  const response = await api.get<Contract[]>('/nhan-vien/hop-dong/tat-ca');
  return response as unknown as Contract[];
};

/**
 * Lấy danh sách hợp đồng của một nhân viên
 */
export const getEmployeeContractsApi = async (employeeId: number): Promise<Contract[]> => {
  const response = await api.get<Contract[]>(`/nhan-vien/${employeeId}/hop-dong`);
  return response as unknown as Contract[];
};

/**
 * Tạo mới hợp đồng
 */
export const createContractApi = async (data: any): Promise<Contract> => {
  const response = await api.post<Contract>('/nhan-vien/hop-dong', data);
  return response as unknown as Contract;
};

/**
 * Cập nhật hợp đồng
 */
export const updateContractApi = async (id: number, data: any): Promise<Contract> => {
  const response = await api.put<Contract>(`/nhan-vien/hop-dong/${id}`, data);
  return response as unknown as Contract;
};

/**
 * Xóa hợp đồng
 */
export const deleteContractApi = async (id: number): Promise<void> => {
  await api.delete(`/nhan-vien/hop-dong/${id}`);
};

/**
 * Lấy danh sách hợp đồng sắp hết hạn
 */
export const getExpiringContractsApi = async (): Promise<Contract[]> => {
  const response = await api.get<Contract[]>('/nhan-vien/hop-dong/het-han');
  return response as unknown as Contract[];
};
