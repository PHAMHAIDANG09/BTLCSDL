/**
 * Notification Store (Zustand)
 * Quản lý state thông báo: danh sách, số chưa đọc, loading.
 * Trạng thái "đã đọc" được persist vào localStorage qua NotificationService.
 */

import { create } from 'zustand';
import type { AppNotification, NotificationState } from '@/types/notification';
import { NotificationService } from '@/services/notification.service';

/** Thời gian cache trước khi refetch (5 phút) */
const CACHE_TTL_MS = 5 * 60 * 1000;

export const useNotificationStore = create<NotificationState>((set, get) => ({
  notifications: [],
  unreadCount: 0,
  isLoading: false,
  lastFetchedAt: null,

  fetchNotifications: async () => {
    const { isLoading, lastFetchedAt } = get();

    // Không fetch nếu đang loading hoặc cache còn fresh
    if (isLoading) return;
    if (lastFetchedAt && Date.now() - lastFetchedAt < CACHE_TTL_MS) return;

    set({ isLoading: true });
    try {
      const notifications = await NotificationService.fetchAll();
      const unreadCount = notifications.filter((n) => !n.read).length;
      set({
        notifications,
        unreadCount,
        isLoading: false,
        lastFetchedAt: Date.now(),
      });
    } catch (err) {
      console.error('[NotificationStore] fetchNotifications error:', err);
      set({ isLoading: false });
    }
  },

  markAsRead: (id: string) => {
    NotificationService.markAsRead(id);
    set((state) => {
      const notifications = state.notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n
      );
      const unreadCount = notifications.filter((n) => !n.read).length;
      return { notifications, unreadCount };
    });
  },

  markAllAsRead: () => {
    const { notifications } = get();
    const allIds = notifications.map((n) => n.id);
    NotificationService.markAllAsRead(allIds);
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, read: true })),
      unreadCount: 0,
    }));
  },

  reset: () => {
    NotificationService.clearReadState();
    set({
      notifications: [],
      unreadCount: 0,
      isLoading: false,
      lastFetchedAt: null,
    });
  },
}));

export default useNotificationStore;
