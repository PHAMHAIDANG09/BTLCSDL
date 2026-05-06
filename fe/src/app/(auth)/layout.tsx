/**
 * Auth Group Layout
 * Không có sidebar, chỉ render children trực tiếp
 */

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Đăng Nhập – NextHR',
  description: 'Đăng nhập vào hệ thống quản trị nhân sự NextHR',
};

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
