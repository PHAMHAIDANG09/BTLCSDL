/**
 * API Endpoints Configuration
 * Tập trung quản lý tất cả endpoint API từ backend
 */

// ============ AUTH ENDPOINTS ============
export const AUTH_ENDPOINTS = {
  LOGIN: "/auth/login",
  LOGOUT: "/auth/logout",
  PROFILE: "/auth/profile",
  REFRESH_TOKEN: "/auth/refresh",
} as const;

// ============ EMPLOYEE ENDPOINTS ============
export const EMPLOYEE_ENDPOINTS = {
  GET_ALL: "/employee",
  GET_BY_ID: (id: string | number) => `/employee/${id}`,
  CREATE: "/employee",
  UPDATE: (id: string | number) => `/employee/${id}`,
  DELETE: (id: string | number) => `/employee/${id}`,
  TRANSFER: (id: string | number) => `/employee/${id}/transfer`,
} as const;

// ============ ATTENDANCE ENDPOINTS ============
export const ATTENDANCE_ENDPOINTS = {
  GET_ALL: "/attendance",
  GET_BY_ID: (id: string | number) => `/attendance/${id}`,
  CREATE: "/attendance",
  GET_OT: (id: string | number) => `/attendance/${id}/ot`,
  CREATE_OT: (id: string | number) => `/attendance/${id}/ot`,
} as const;

// ============ LEAVE ENDPOINTS ============
export const LEAVE_ENDPOINTS = {
  GET_TYPES: "/leave/types",
  REQUEST_LEAVE: "/leave/request",
  GET_REQUESTS: "/leave/requests",
  UPDATE_REQUEST: (id: string | number) => `/leave/requests/${id}`,
  GET_BALANCE: "/leave/balance",
} as const;

// ============ PAYROLL ENDPOINTS ============
export const PAYROLL_ENDPOINTS = {
  GET_ALL: "/payroll",
  GET_BY_ID: (id: string | number) => `/payroll/${id}`,
  CALCULATE: "/payroll/calculate",
} as const;

// ============ APPROVAL ENDPOINTS ============
export const APPROVAL_ENDPOINTS = {
  GET_PENDING: "/approval/pending",
  APPROVE: (id: string | number) => `/approval/${id}/approve`,
  REJECT: (id: string | number) => `/approval/${id}/reject`,
} as const;

// ============ DASHBOARD ENDPOINTS ============
export const DASHBOARD_ENDPOINTS = {
  GET_STATS: "/dashboard/stats",
  GET_CHARTS: "/dashboard/charts",
  GET_ANALYTICS: "/dashboard/analytics",
} as const;

// ============ ORGANIZATION ENDPOINTS ============
export const ORGANIZATION_ENDPOINTS = {
  GET_TREE: "/organization/tree",
} as const;

// ============ NOTIFICATION ENDPOINTS ============
export const NOTIFICATION_ENDPOINTS = {
  GET_ALL: "/notification",
  MARK_AS_READ: (id: string | number) => `/notification/${id}/read`,
  DELETE: (id: string | number) => `/notification/${id}`,
} as const;

// ============ REPORT ENDPOINTS ============
export const REPORT_ENDPOINTS = {
  EMPLOYEES: "/report/employees",
  ATTENDANCE: "/report/attendance",
  PAYROLL: "/report/payroll",
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
