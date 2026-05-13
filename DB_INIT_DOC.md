# TÀI LIỆU KHỞI TẠO CƠ SỞ DỮ LIỆU NEXTHR (DATABASE INITIALIZATION)

Tài liệu này hướng dẫn quy trình, cấu trúc và các thành phần logic cốt lõi được sử dụng để thiết lập cơ sở dữ liệu cho hệ thống quản trị nhân sự NextHR.

---

## 1. Quy trình khởi tạo (Initialization Workflow)

Hệ thống sử dụng cơ chế tự động hóa hoàn toàn thông qua Docker để đảm bảo môi trường phát triển và thực tế đồng nhất.

- **Công cụ sử dụng:** Docker, Docker Compose, SQL Server 2022 (phiên bản Linux-based).
- **Cơ chế tự động:** File `SchemaNEXTHR.sql` được đặt trong thư mục `/docker-entrypoint-initdb.d/`. Khi container SQL Server khởi động lần đầu, một script entrypoint sẽ quét thư mục này và thực thi các file `.sql` để tạo schema và nạp dữ liệu mẫu.
- **Ưu điểm:** Loại bỏ tình trạng "chạy được trên máy tôi nhưng không chạy được trên server", giúp việc onboarding thành viên mới chỉ mất vài giây.

---

## 2. Tài liệu Migration (Cấu trúc bảng)

Quy trình tạo bảng được thiết kế nghiêm ngặt để đảm bảo tính toàn vẹn dữ liệu và tránh lỗi xung đột Khóa ngoại (Foreign Key).

### 2.1. Migration Up (Khởi tạo cấu trúc)

Thứ tự thực thi được chia thành các nhóm phụ thuộc:

1.  **Nhóm Danh mục (Independent):**
    - `ChucVu`: Định nghĩa các cấp bậc (Giám đốc, Trưởng phòng, Nhân viên).
    - `VaiTro`: Phân quyền hệ thống (Admin, Manager, Staff).
    - `LoaiNghiPhep`: Các loại hình nghỉ (Phép năm, Ốm, Thai sản).
    - `NgayLe`: Cấu hình các ngày nghỉ lễ trong năm.

2.  **Nhóm Tổ chức & Nhân sự cốt lõi:**
    - `PhongBan`: Tạo bảng trước. Lưu ý: Cột `MaQuanLy` (FK đến `NhanVien`) sẽ được thêm bằng lệnh `ALTER TABLE` sau khi bảng `NhanVien` được tạo để tránh lỗi vòng lặp (circular dependency).
    - `NhanVien`: Lưu trữ thông tin định danh, tài khoản và liên kết đến Phòng ban, Chức vụ, Vai trò.
    - `HopDong`: Lưu thông tin pháp lý giữa nhân viên và doanh nghiệp.

3.  **Nhóm Nghiệp vụ & Lịch sử:**
    - `LichSuDieuChuyen`, `LichSuLuong`: Theo dõi biến động nhân sự.
    - `ChamCong`, `SoDuPhep`: Quản lý thời gian làm việc.
    - `DonNghiPhep`, `DonLamThem`: Các quy trình phê duyệt (Workflow).
    - `PhieuLuong`: Kết quả cuối cùng của quy trình tính lương.
    - `NhatKyHeThong`: Lưu vết mọi thao tác nhạy cảm trên DB.

### 2.2. Migration Down (Hủy bỏ cấu trúc)

Khi cần làm sạch database để khởi động lại, các bảng phải được xóa theo thứ tự ngược lại (bảng con chứa FK xóa trước, bảng cha xóa sau):

```sql
-- 1. Xóa các đối tượng logic
DROP PROCEDURE IF EXISTS dbo.sp_CalculatePayroll;
DROP TRIGGER IF EXISTS dbo.trg_UpdateLeaveBalance;
DROP VIEW IF EXISTS dbo.vw_OrgChart;

-- 2. Xóa các bảng nghiệp vụ (Tables with FKs)
DROP TABLE IF EXISTS dbo.NhatKyHeThong;
DROP TABLE IF EXISTS dbo.PhieuLuong;
DROP TABLE IF EXISTS dbo.DonLamThem;
DROP TABLE IF EXISTS dbo.DonNghiPhep;
DROP TABLE IF EXISTS dbo.SoDuPhep;
DROP TABLE IF EXISTS dbo.ChamCong;
DROP TABLE IF EXISTS dbo.LichSuLuong;
DROP TABLE IF EXISTS dbo.LichSuDieuChuyen;
DROP TABLE IF EXISTS dbo.HopDong;

-- 3. Xóa bảng nhân sự & tổ chức (Xóa Constraint trước nếu cần)
ALTER TABLE dbo.PhongBan DROP CONSTRAINT IF EXISTS FK_PhongBan_MaQuanLy;
DROP TABLE IF EXISTS dbo.NhanVien;
DROP TABLE IF EXISTS dbo.PhongBan;

-- 4. Xóa các bảng danh mục
DROP TABLE IF EXISTS dbo.NgayLe;
DROP TABLE IF EXISTS dbo.LoaiNghiPhep;
DROP TABLE IF EXISTS dbo.VaiTro;
DROP TABLE IF EXISTS dbo.ChucVu;
```

---

## 3. Tài liệu Seeding (Dữ liệu mẫu)

Hệ thống được cung cấp sẵn bộ dữ liệu để có thể vận hành thử nghiệm ngay lập tức:

-   **Hệ thống:** 3 Vai trò (Admin, Manager, Staff) và 4 loại hình nghỉ phép phổ biến.
-   **Tổ chức:** 5 phòng ban mẫu theo cấu trúc phân cấp:
    -   *Ban Giám đốc (BOD)*
    -   *Phòng Nhân sự (HR)*
    -   *Phòng Công nghệ (DEV)* -> Chứa *Nhóm Backend (DEV-BE)*
    -   *Phòng Kế toán (ACC)*
-   **Nhân sự:** 5 nhân viên tiêu biểu (từ Giám đốc đến nhân viên Backend) với đầy đủ:
    -   Hợp đồng lao động đang hiệu lực.
    -   Lịch sử lương (Lương cứng + Phụ cấp).
    -   Dữ liệu chấm công và đơn từ mẫu để kiểm tra tính năng tính lương.

---

## 4. Các đối tượng Logic nâng cao

Để tối ưu hiệu năng và đảm bảo quy tắc nghiệp vụ ở mức CSDL, 3 thành phần quan trọng đã được khởi tạo:

1.  **View `vw_OrgChart` (Sơ đồ tổ chức):**
    - *Vai trò:* Sử dụng **Recursive CTE** để duyệt qua cây phân cấp phòng ban.
    - *Ứng dụng:* Hiển thị cấu trúc công ty nhiều cấp mà không cần thực hiện nhiều câu lệnh Join phức tạp ở tầng Code.

2.  **Trigger `trg_UpdateLeaveBalance` (Tự động trừ phép):**
    - *Vai trò:* Tự động kiểm tra số dư phép khi một đơn nghỉ được chuyển sang trạng thái 'Approved'.
    - *Ứng dụng:* Đảm bảo tính nhất quán dữ liệu. Nếu nhân viên không đủ ngày nghỉ, Trigger sẽ thực hiện `ROLLBACK` và báo lỗi ngay lập tức.

3.  **Stored Procedure `sp_CalculatePayroll` (Hàm tính lương):**
    - *Vai trò:* Xử lý logic tính toán lương tập trung bằng SQL. Sử dụng `CROSS APPLY` để tối ưu các bước tính thuế TNCN, BHXH và tiền làm thêm (OT).
    - *Ứng dụng:* Cho phép tính lương hàng loạt cho hàng ngàn nhân viên chỉ trong vài giây, tránh việc xử lý từng dòng ở phía Server App gây nghẽn cổ chai.

---

## 5. Minh chứng khởi tạo thành công

Sau khi khởi chạy Docker, hệ thống có thể kiểm chứng qua:

-   **Logs:** Lệnh `docker logs nexthr-db` sẽ hiển thị dòng chữ `PRINT N'Đã hoàn thành tính lương...'` (nếu chạy SP) hoặc không có lỗi SQL nào xuất hiện trong quá trình entrypoint.
-   **Dữ liệu:** Câu lệnh `SELECT TOP 5 * FROM dbo.vw_OrgChart` trả về đầy đủ đường dẫn cấp bậc (ví dụ: `Ban Giám đốc > Phòng Công nghệ > Nhóm Backend`).
-   **Tính toàn vẹn:** Thử nghiệm Approve một đơn nghỉ phép vượt quá số dư sẽ nhận được lỗi: *"Số ngày nghỉ vượt quá số dư phép còn lại."*

---
*Tài liệu được biên soạn phục vụ báo cáo Bài tập lớn môn Cơ sở dữ liệu.*
