/**
 * App Store - UI State Management
 * Quản lý UI state chung của toàn bộ ứng dụng
 * Sử dụng Zustand
 */

import { create } from "zustand";
import { persist } from "zustand/middleware";

/**
 * Theme type definition
 */
export type Theme = "light" | "dark";

/**
 * App Store Interface
 */
export interface AppStore {
  // Sidebar state
  isSidebarCollapsed: boolean;
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;

  // Theme state
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;

  // Modal/Dialog state
  isModalOpen: boolean;
  setIsModalOpen: (isOpen: boolean) => void;

  // Loading state
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
}

/**
 * Create App Store with Zustand
 * Persist middleware để lưu state vào localStorage
 */
export const useAppStore = create<AppStore>()(
  persist(
    (set, get) => ({
      // ============ SIDEBAR STATE ============
      isSidebarCollapsed: false,

      toggleSidebar: () => {
        set((state) => ({
          isSidebarCollapsed: !state.isSidebarCollapsed,
        }));
      },

      setSidebarCollapsed: (collapsed: boolean) => {
        set({ isSidebarCollapsed: collapsed });
      },

      // ============ THEME STATE ============
      theme: "light",

      setTheme: (theme: Theme) => {
        set({ theme });
        // Apply theme to document
        applyTheme(theme);
      },

      toggleTheme: () => {
        const currentTheme = get().theme;
        const newTheme = currentTheme === "light" ? "dark" : "light";
        set({ theme: newTheme });
        applyTheme(newTheme);
      },

      // ============ MODAL STATE ============
      isModalOpen: false,

      setIsModalOpen: (isOpen: boolean) => {
        set({ isModalOpen: isOpen });
      },

      // ============ LOADING STATE ============
      isLoading: false,

      setIsLoading: (isLoading: boolean) => {
        set({ isLoading });
      },
    }),
    {
      name: "app-store", // localStorage key
      partialize: (state) => ({
        isSidebarCollapsed: state.isSidebarCollapsed,
        theme: state.theme,
      }), // Chỉ persist những state này
    },
  ),
);

/**
 * Apply theme to document
 * Thêm/xoá class 'dark' vào HTML element
 */
const applyTheme = (theme: Theme) => {
  if (typeof window === "undefined") return;

  const htmlElement = document.documentElement;
  if (theme === "dark") {
    htmlElement.classList.add("dark");
  } else {
    htmlElement.classList.remove("dark");
  }
};

export default useAppStore;
