import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      // Admin Routes
      { source: "/admin/bang-dieu-khien", destination: "/admin/dashboard" },
      { source: "/admin/nhan-vien", destination: "/admin/employee" },
      { source: "/admin/hop-dong", destination: "/admin/contract" },
      { source: "/admin/nghi-phep", destination: "/admin/leave" },
      { source: "/admin/nghi-phep/:path*", destination: "/admin/leave/:path*" },
      { source: "/admin/lam-them-gio", destination: "/admin/overtime" },
      { source: "/admin/luong", destination: "/admin/payroll" },
      { source: "/admin/luong/:path*", destination: "/admin/payroll/:path*" },
      { source: "/admin/lich-su-luong", destination: "/admin/salary-history" },
      { source: "/admin/bao-cao", destination: "/admin/report" },
      { source: "/admin/ngay-le", destination: "/admin/holiday" },
      { source: "/admin/nhat-ky", destination: "/admin/log" },
      { source: "/admin/ho-so", destination: "/admin/profile" },
      { source: "/admin/thong-bao", destination: "/admin/notifications" },
      { source: "/admin/cai-dat", destination: "/admin/settings" },
      
      // Staff Routes
      { source: "/staff/trang-chu", destination: "/staff/home" },
      { source: "/staff/phieu-luong", destination: "/staff/payslip" },
      { source: "/staff/ho-so", destination: "/staff/profile" },
      { source: "/staff/thong-bao", destination: "/staff/notifications" },
      { source: "/staff/don-cua-toi", destination: "/staff/my-requests" },
    ];
  },
};

export default nextConfig;
