import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      // Admin Routes
      { source: "/admin/bang-dieu-khien", destination: "/admin/dashboard" },
      { source: "/admin/nhan-vien", destination: "/admin/employee" },
      { source: "/admin/cham-cong", destination: "/admin/attendance" },
      { source: "/admin/cham-cong/:path*", destination: "/admin/attendance/:path*" },
      { source: "/admin/nghi-phep", destination: "/admin/leave" },
      { source: "/admin/nghi-phep/:path*", destination: "/admin/leave/:path*" },
      { source: "/admin/luong", destination: "/admin/payroll" },
      { source: "/admin/luong/:path*", destination: "/admin/payroll/:path*" },
      { source: "/admin/ho-so", destination: "/admin/profile" },
      { source: "/admin/thong-bao", destination: "/admin/notifications" },
      { source: "/admin/cai-dat", destination: "/admin/settings" },
      
      // Staff Routes
      { source: "/staff/trang-chu", destination: "/staff/home" },
      { source: "/staff/cham-cong", destination: "/staff/attendance" },
      { source: "/staff/nghi-phep", destination: "/staff/leave" },
      { source: "/staff/phieu-luong", destination: "/staff/payslip" },
      { source: "/staff/ho-so", destination: "/staff/profile" },
      { source: "/staff/thong-bao", destination: "/staff/notifications" },
      { source: "/staff/don-cua-toi", destination: "/staff/my-requests" },
    ];
  },
};

export default nextConfig;
