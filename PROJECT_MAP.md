# 🗺️ NextHR Project Map (Bản đồ Dự án)

Tài liệu này đóng vai trò như một mục lục và bản đồ tra cứu nhanh cho toàn bộ hệ thống NextHR, phản ánh cấu trúc thư mục, cơ sở dữ liệu và các module nghiệp vụ.

---

## 🏗️ Cấu trúc Thư mục Chính

- `init-db/`: Chứa script khởi tạo cơ sở dữ liệu (`SchemaNEXTHR.sql`).
- `DB_INIT_DOC.md`: Tài liệu hướng dẫn chi tiết quy trình khởi tạo, Migration và Seeding dữ liệu.
- `PROJECT_MAP.md`: Bản đồ dự án (Tài liệu này).
- `src/`: Mã nguồn chính của ứng dụng NestJS.
    - `modules/`: Chứa các module nghiệp vụ của hệ thống (Auth, Employee, Payroll...).
    - `config/`: Cấu hình hệ thống (Database, Redis, Mail, v.v.).
    - `common/`: Các tiện ích, interceptors, filters, decorators dùng chung.
- `test/`: Chứa các file kiểm thử E2E.
- `docker-compose.yml`: Cấu hình Docker cho SQL Server và Redis.

---

## 🗄️ Cơ sở Dữ liệu (SQL Server)

File định nghĩa: `init-db/SchemaNEXTHR.sql`

### 1. Danh mục & Cấu hình
- `ChucVu`, `VaiTro`: Định nghĩa cấp bậc và quyền hạn.
- `LoaiNghiPhep`, `NgayLe`: Cấu hình lịch nghỉ.

### 2. Quản lý Nhân sự & Tổ chức
- `PhongBan`: Cơ cấu tổ chức phân cấp.
- `NhanVien`: Hồ sơ nhân sự cốt lõi (**Strict Null Safety**).
- `HopDong`: Quản lý hợp đồng lao động.
- `LichSuDieuChuyen`: Lưu vết thuyên chuyển nhân sự.
- `LichSuLuong`: Lưu vết biến động lương (**SCD Type 2**).

### 3. Nghiệp vụ & Lương
- `ChamCong`, `DonLamThem` (OT): Dữ liệu thời gian làm việc.
- `DonNghiPhep`, `SoDuPhep`: Quản lý nghỉ phép.
- `PhieuLuong`: Kết quả tính toán thu nhập hàng tháng.
- `NhatKyHeThong`: Audit Log theo dõi mọi hành động trên DB.

---

## 🧩 Các Modules Ứng dụng (NestJS)

1.  **auth**: Đăng nhập, JWT, phân quyền (Admin/Manager/Staff).
2.  **organization**: Quản lý phòng ban, sơ đồ tổ chức đệ quy (`vw_OrgChart`).
3.  **employee**: Quản lý hồ sơ, hợp đồng, lịch sử điều chuyển. Hỗ trợ **import nhân viên hàng loạt từ Excel** với cấu trúc 7 cột. Đã tích hợp **Safe Cell Extraction** và cơ chế **Raw Bulk Insert (QueryBuilder)** với `callListeners(false)` để tối ưu hiệu năng và đảm bảo không bị lỗi Subscriber.
4.  **attendance**: Quản lý chấm công và đơn làm thêm giờ (OT).
5.  **leave**: Quy trình nghỉ phép, tự động kiểm tra số dư phép (`trg_UpdateLeaveBalance`).
6.  **payroll**: Tính lương tự động (**Cron job**), thực thi Stored Procedure tối ưu.
7.  **mail**: Tự động gửi thông báo lương qua email (Handlebars templates).
8.  **report**: Xuất báo cáo nhân sự, bảng lương (Excel/PDF).
9.  **dashboard**: Thống kê dữ liệu tổng quan cho quản trị viên.
10. **redis**: Caching dữ liệu để tăng tốc độ truy xuất.

---

## ✨ Tính năng Kỹ thuật Nổi bật

- **Tối ưu hóa Truy vấn:** Sử dụng `CROSS APPLY` trong SQL Server để tính toán lương hàng loạt hiệu quả.
- **Dữ liệu Lịch sử:** Áp dụng mô hình **SCD Type 2** (Slowly Changing Dimension) để theo dõi lịch sử thay đổi lương mà không mất dữ liệu cũ.
- **Xử lý Đệ quy:** Dùng **Recursive CTE** để hiển thị sơ đồ tổ chức không giới hạn cấp độ.
- **An toàn Dữ liệu:** Tất cả Entity được định nghĩa theo chuẩn **Strict Null Safety**, đồng nhất kiểu dữ liệu giữa TypeScript và SQL Server.
- **Tự động hóa:** Hệ thống tự động tính lương và gửi mail vào cuối tháng thông qua tác vụ lập lịch (Cron job).

---

## 🚀 Công nghệ Sử dụng

- **Backend:** NestJS (TypeScript)
- **Database:** MS SQL Server 2022
- **ORM:** TypeORM
- **Caching:** Redis
- **Container:** Docker & Docker Compose
- **Utilities:** exceljs (Xử lý Excel), Handlebars (Mail templates), Bcrypt (Bảo mật).

---

## 🛠️ Lệnh Cơ bản

- `npm run start:dev`: Chạy ứng dụng (Development mode).
- `docker compose up -d`: Khởi chạy Database & Redis.
- `api/docs`: Truy cập Swagger API Documentation.
