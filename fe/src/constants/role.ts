/**
 * Role Constants
 * Định nghĩa các vai trò trong hệ thống NextHR
 * Phải khớp với dữ liệu TenVaiTro trong bảng VaiTro của database
 */

export const ROLES = {
  ADMIN: 'Admin',
  MANAGER: 'Manager',
  NHAN_VIEN: 'Staff',
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];

/** Các role có quyền truy cập Admin Portal */
export const ADMIN_ROLES: string[] = [ROLES.ADMIN, ROLES.MANAGER];

/** Các role chỉ truy cập Staff Portal */
export const STAFF_ROLES: string[] = [ROLES.NHAN_VIEN];

/** Redirect destination sau khi login theo role */
export const ROLE_HOME_MAP: Record<string, string> = {
  [ROLES.ADMIN]: '/admin/bang-dieu-khien',
  [ROLES.MANAGER]: '/admin/bang-dieu-khien',
  [ROLES.NHAN_VIEN]: '/staff/trang-chu',
};
