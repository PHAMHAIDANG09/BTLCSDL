/**
 * Notification Service (FE-only)
 * Đọc dữ liệu từ các API hiện có, chuyển thành danh sách thông báo.
 * Không cần backend mới, không cần bảng ThongBao.
 */

import api from './api';
import type { AppNotification, NotificationType } from '@/types/notification';

/** Key lưu trạng thái đã đọc trong localStorage */
const READ_KEY = 'nexhr_read_notifications';

/** Đọc danh sách ID đã đọc từ localStorage */
const getReadIds = (): Set<string> => {
  if (typeof window === 'undefined') return new Set();
  try {
    const raw = localStorage.getItem(READ_KEY);
    return raw ? new Set(JSON.parse(raw) as string[]) : new Set();
  } catch {
    return new Set();
  }
};

/** Lưu danh sách ID đã đọc vào localStorage */
const saveReadIds = (ids: Set<string>): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(READ_KEY, JSON.stringify(Array.from(ids)));
};

/** Định dạng mô tả thời gian tương đối */
const relativeTime = (date: Date): string => {
  const now = Date.now();
  const diff = now - date.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return 'Vừa xong';
  if (minutes < 60) return `${minutes} phút trước`;
  if (hours < 24) return `${hours} giờ trước`;
  if (days < 7) return `${days} ngày trước`;
  return date.toLocaleDateString('vi-VN');
};

export { relativeTime };

/**
 * Lấy toàn bộ thông báo từ các API có sẵn
 * và gán trạng thái đọc từ localStorage.
 */
export const NotificationService = {
  /**
   * Tổng hợp thông báo từ:
   * - /nghi-phep/lich-su (đơn nghỉ phép đã Approved/Rejected)
   * - /cham-cong/lam-them/lich-su (đơn OT đã Approved/Rejected)
   * - /luong/phieu-luong-cua-toi (phiếu lương mới)
   */
  fetchAll: async (): Promise<AppNotification[]> => {
    const readIds = getReadIds();
    const notifications: AppNotification[] = [];

    // ---- 1. Đơn nghỉ phép ----
    try {
      const leaves: any[] = (await api.get('/nghi-phep/lich-su')) as any;
      if (Array.isArray(leaves)) {
        for (const leave of leaves) {
          const status: string = leave.TrangThai;
          if (status !== 'Approved' && status !== 'Rejected') continue;

          const id = `leave_${leave.Id}`;
          const type: NotificationType =
            status === 'Approved' ? 'leave_approved' : 'leave_rejected';
          const time = new Date(leave.NgayDuyet || leave.NgayTao);
          const tenLoaiPhep =
            leave.loaiNghiPhep?.TenLoaiPhep ||
            leave.LoaiNghiPhep?.TenLoaiPhep ||
            'Nghỉ phép';
          const from = new Date(leave.NgayBatDau).toLocaleDateString('vi-VN');
          const to = new Date(leave.NgayKetThuc).toLocaleDateString('vi-VN');

          notifications.push({
            id,
            type,
            title:
              status === 'Approved'
                ? '✅ Đơn nghỉ phép được duyệt'
                : '❌ Đơn nghỉ phép bị từ chối',
            description:
              status === 'Approved'
                ? `${tenLoaiPhep} từ ${from} đến ${to} đã được phê duyệt.`
                : `${tenLoaiPhep} từ ${from} đến ${to} bị từ chối.${leave.LyDoTuChoi ? ' Lý do: ' + leave.LyDoTuChoi : ''}`,
            time,
            link: '/staff/nghi-phep',
            read: readIds.has(id),
          });
        }
      }
    } catch {
      // Không throw — cứ bỏ qua nếu API lỗi
    }

    // ---- 2. Đơn làm thêm giờ (OT) ----
    try {
      const otList: any[] = (await api.get('/cham-cong/lam-them/lich-su')) as any;
      if (Array.isArray(otList)) {
        for (const ot of otList) {
          const status: string = ot.TrangThai;
          if (status !== 'Approved' && status !== 'Rejected') continue;

          const id = `ot_${ot.Id}`;
          const type: NotificationType =
            status === 'Approved' ? 'ot_approved' : 'ot_rejected';
          const time = new Date(ot.NgayTao);
          const ngay = new Date(ot.NgayLamThem).toLocaleDateString('vi-VN');

          notifications.push({
            id,
            type,
            title:
              status === 'Approved'
                ? '✅ Đơn làm thêm giờ được duyệt'
                : '❌ Đơn làm thêm giờ bị từ chối',
            description:
              status === 'Approved'
                ? `OT ngày ${ngay} (${ot.TongSoGio}h) đã được phê duyệt.`
                : `OT ngày ${ngay} (${ot.TongSoGio}h) bị từ chối.`,
            time,
            link: '/staff/cham-cong',
            read: readIds.has(id),
          });
        }
      }
    } catch {
      // Bỏ qua nếu lỗi
    }

    // ---- 3. Phiếu lương mới ----
    try {
      const payslips: any[] = (await api.get('/luong/phieu-luong-cua-toi')) as any;
      if (Array.isArray(payslips)) {
        for (const slip of payslips) {
          const id = `payslip_${slip.Id}`;
          const time = new Date(slip.NgayTao || slip.NgayThanhToan || Date.now());

          // Chỉ tạo thông báo cho phiếu lương trong 3 tháng gần nhất
          const threeMonthsAgo = Date.now() - 90 * 24 * 3600 * 1000;
          if (time.getTime() < threeMonthsAgo) continue;

          const formatter = new Intl.NumberFormat('vi-VN');
          const soTien = formatter.format(slip.LuongThucNhan || 0);

          notifications.push({
            id,
            type: 'payslip',
            title: '💰 Phiếu lương đã sẵn sàng',
            description: `Phiếu lương tháng ${slip.Thang}/${slip.Nam} — Thực nhận: ${soTien}đ`,
            time,
            link: '/staff/phieu-luong',
            read: readIds.has(id),
          });
        }
      }
    } catch {
      // Bỏ qua nếu lỗi
    }

    // Sắp xếp mới nhất lên đầu
    notifications.sort((a, b) => b.time.getTime() - a.time.getTime());

    return notifications;
  },

  /** Đánh dấu 1 thông báo đã đọc (lưu vào localStorage) */
  markAsRead: (id: string): void => {
    const ids = getReadIds();
    ids.add(id);
    saveReadIds(ids);
  },

  /** Đánh dấu tất cả đã đọc */
  markAllAsRead: (ids: string[]): void => {
    const readIds = getReadIds();
    ids.forEach((id) => readIds.add(id));
    saveReadIds(readIds);
  },

  /** Xóa trạng thái đã đọc (khi logout) */
  clearReadState: (): void => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(READ_KEY);
    }
  },
};
