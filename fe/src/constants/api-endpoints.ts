/**
 * API Endpoints Configuration
 * Tập trung quản lý tất cả endpoint API từ backend
 */

// ============ AUTH ENDPOINTS ============
export const AUTH_ENDPOINTS = {
  LOGIN: "/xac-thuc/dang-nhap",
  LOGOUT: "/xac-thuc/dang-xuat",
  PROFILE: "/xac-thuc/ho-so",
  REFRESH_TOKEN: "/xac-thuc/lam-moi",
} as const;

// ============ EMPLOYEE ENDPOINTS ============
export const EMPLOYEE_ENDPOINTS = {
  GET_ALL: "/nhan-vien",
  GET_BY_ID: (id: string | number) => `/nhan-vien/${id}`,
  CREATE: "/nhan-vien",
  UPDATE: (id: string | number) => `/nhan-vien/${id}`,
  DELETE: (id: string | number) => `/nhan-vien/${id}`,
  TRANSFER: (id: string | number) => `/nhan-vien/${id}/dieu-chuyen`,
} as const;

// ============ ATTENDANCE ENDPOINTS ============
export const ATTENDANCE_ENDPOINTS = {
  GET_ALL: "/cham-cong",
  GET_BY_ID: (id: string | number) => `/cham-cong/${id}`,
  CREATE: "/cham-cong",
  GET_OT: (id: string | number) => `/cham-cong/${id}/tang-ca`,
  CREATE_OT: (id: string | number) => `/cham-cong/${id}/tang-ca`,
} as const;

// ============ LEAVE ENDPOINTS ============
export const LEAVE_ENDPOINTS = {
  GET_TYPES: "/nghi-phep/loai",
  REQUEST_LEAVE: "/nghi-phep/yeu-cau",
  GET_REQUESTS: "/nghi-phep/danh-sach-yeu-cau",
  UPDATE_REQUEST: (id: string | number) => `/nghi-phep/yeu-cau/${id}`,
  GET_BALANCE: "/nghi-phep/so-du",
} as const;

// ============ PAYROLL ENDPOINTS ============
export const PAYROLL_ENDPOINTS = {
  GET_ALL: "/luong",
  GET_BY_ID: (id: string | number) => `/luong/${id}`,
  CALCULATE: "/luong/tinh-luong",
} as const;

// ============ APPROVAL ENDPOINTS ============
export const APPROVAL_ENDPOINTS = {
  GET_PENDING: "/phe-duyet/cho-duyet",
  APPROVE: (id: string | number) => `/phe-duyet/${id}/dong-y`,
  REJECT: (id: string | number) => `/phe-duyet/${id}/tu-choi`,
} as const;

// ============ DASHBOARD ENDPOINTS ============
export const DASHBOARD_ENDPOINTS = {
  GET_STATS: "/bang-dieu-khien/thong-ke",
  GET_CHARTS: "/bang-dieu-khien/bieu-do",
  GET_ANALYTICS: "/bang-dieu-khien/phan-tich",
} as const;

// ============ ORGANIZATION ENDPOINTS ============
export const ORGANIZATION_ENDPOINTS = {
  GET_TREE: "/co-cau-to-chuc/so-do",
} as const;

// ============ NOTIFICATION ENDPOINTS ============
export const NOTIFICATION_ENDPOINTS = {
  GET_ALL: "/thong-bao",
  MARK_AS_READ: (id: string | number) => `/thong-bao/${id}/da-doc`,
  DELETE: (id: string | number) => `/thong-bao/${id}`,
} as const;

// ============ REPORT ENDPOINTS ============
export const REPORT_ENDPOINTS = {
  EMPLOYEES: "/bao-cao/nhan-vien",
  ATTENDANCE: "/bao-cao/cham-cong",
  PAYROLL: "/bao-cao/luong",
} as const;

// ============ HTTP STATUS CODES ============
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
} as const;
