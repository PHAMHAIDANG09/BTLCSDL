/**
 * Next.js Middleware – Route Protection
 * Chạy trên Edge Runtime, kiểm tra auth_token và user_role cookie
 * Bảo vệ các route /admin/* và /staff/*
 */

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Các role được phép vào Admin Portal
const ADMIN_ROLES = ['Admin', 'Manager'];

// Các role được phép vào Staff Portal
const STAFF_ROLES = ['Staff'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Lấy token và role từ cookie (được set bởi authStore.setAuth)
  const token = request.cookies.get('auth_token')?.value;
  const role = request.cookies.get('user_role')?.value;

  const isLoggedIn = !!token;

  // ─── Bảo vệ Admin Routes ───────────────────────────────────────────────────
  if (pathname.startsWith('/admin')) {
    if (!isLoggedIn) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }

    if (role && !ADMIN_ROLES.includes(role)) {
      // Đã login nhưng không có quyền admin → redirect về staff hoặc forbidden
      if (STAFF_ROLES.includes(role)) {
        return NextResponse.redirect(new URL('/staff/home', request.url));
      }
      return NextResponse.redirect(new URL('/forbidden', request.url));
    }
  }

  // ─── Bảo vệ Staff Routes ───────────────────────────────────────────────────
  if (pathname.startsWith('/staff')) {
    if (!isLoggedIn) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }

    if (role && !STAFF_ROLES.includes(role) && !ADMIN_ROLES.includes(role)) {
      return NextResponse.redirect(new URL('/forbidden', request.url));
    }

    // Admin/Manager được xem staff portal nếu cần (tùy chính sách)
    // Nếu muốn chặn hoàn toàn, bỏ comment dòng dưới:
    // if (role && ADMIN_ROLES.includes(role)) {
    //   return NextResponse.redirect(new URL('/admin/bang-dieu-khien', request.url));
    // }
  }

  // ─── Redirect root / về login nếu chưa login ──────────────────────────────
  if (pathname === '/') {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    // Đã login → redirect theo role
    if (role && ADMIN_ROLES.includes(role)) {
      return NextResponse.redirect(new URL('/admin/bang-dieu-khien', request.url));
    }
    return NextResponse.redirect(new URL('/staff/home', request.url));
  }

  // ─── Nếu đã login mà vào /login → redirect về đúng trang ─────────────────
  if (pathname === '/login' && isLoggedIn && role) {
    if (ADMIN_ROLES.includes(role)) {
      return NextResponse.redirect(new URL('/admin/bang-dieu-khien', request.url));
    }
    if (STAFF_ROLES.includes(role)) {
      return NextResponse.redirect(new URL('/staff/home', request.url));
    }
  }

  return NextResponse.next();
}

/**
 * Chỉ chạy middleware cho các path này
 * Không chạy cho _next/static, _next/image, favicon.ico, api
 */
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|api).*)',
  ],
};
