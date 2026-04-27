import type { Metadata, Viewport } from "next";
import { AntdProvider } from "./providers";
import "./globals.css";

export const metadata: Metadata = {
  title: "NextHR - Hệ Thống Quản Trị Nhân Sự",
  description: "Quản lý nhân sự toàn diện - NextHR",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1.0,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className="h-full">
      <body className="min-h-full">
        <AntdProvider>{children}</AntdProvider>
      </body>
    </html>
  );
}
