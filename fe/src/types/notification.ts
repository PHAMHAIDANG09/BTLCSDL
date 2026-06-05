/**
 * Notification Types
 * Hệ thống thông báo FE-only: đọc dữ liệu từ API có sẵn,
 * chuyển thành thông báo và lưu trạng thái đọc ở localStorage
 */

export type NotificationType =
  | 'leave_approved'
  | 'leave_rejected'
  | 'leave_pending'
  | 'ot_approved'
  | 'ot_rejected'
  | 'ot_pending'
  | 'payslip';

export interface AppNotification {
  /** ID ổn định: "leave_123", "ot_456", "payslip_789" */
  id: string;
  type: NotificationType;
  title: string;
  description: string;
  /** Thời điểm xảy ra sự kiện (NgayDuyet / NgayTao) */
  time: Date;
  /** Đường dẫn điều hướng khi click */
  link: string;
  read: boolean;
}

export interface NotificationState {
  notifications: AppNotification[];
  unreadCount: number;
  isLoading: boolean;
  lastFetchedAt: number | null;
  /** Fetch + rebuild notifications từ API */
  fetchNotifications: () => Promise<void>;
  /** Đánh dấu 1 thông báo đã đọc */
  markAsRead: (id: string) => void;
  /** Đánh dấu tất cả đã đọc */
  markAllAsRead: () => void;
  /** Reset khi logout */
  reset: () => void;
}
