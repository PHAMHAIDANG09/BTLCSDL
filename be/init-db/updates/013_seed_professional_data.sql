USE NextHR;
GO

BEGIN TRANSACTION;

-- ============================================================
-- 1. CLEANUP DỮ LIỆU CŨ THÁNG 5/2026 ĐỂ ĐẢM BẢO CHẠY LẠI KHÔNG TRÙNG LẶP
-- ============================================================
DELETE FROM dbo.ChamCong WHERE NgayLamViec BETWEEN '2026-05-01' AND '2026-05-31';
DELETE FROM dbo.DonLamThem WHERE NgayLamThem BETWEEN '2026-05-01' AND '2026-05-31';
DELETE FROM dbo.DonNghiPhep WHERE NgayBatDau <= '2026-05-31' AND NgayKetThuc >= '2026-05-01';
DELETE FROM dbo.PhieuLuong WHERE Thang = 5 AND Nam = 2026;

-- Xóa dữ liệu của các nhân viên test có mã EMP-2026- để chèn mới hoàn toàn
DECLARE @TempEmpIds TABLE (Id INT);
INSERT INTO @TempEmpIds (Id)
SELECT Id FROM dbo.NhanVien WHERE MaNhanVien LIKE 'EMP-2026-%';

-- Hủy liên kết quản lý phòng ban để tránh lỗi khóa ngoại FK_PhongBan_QuanLy
UPDATE dbo.PhongBan SET MaQuanLy = NULL WHERE MaQuanLy IN (SELECT Id FROM @TempEmpIds);

DELETE FROM dbo.LichSuDieuChuyen WHERE MaNhanVienId IN (SELECT Id FROM @TempEmpIds) OR NguoiDuyetId IN (SELECT Id FROM @TempEmpIds);
DELETE FROM dbo.LichSuLuong WHERE MaNhanVienId IN (SELECT Id FROM @TempEmpIds) OR NguoiThayDoiId IN (SELECT Id FROM @TempEmpIds);
DELETE FROM dbo.HopDong WHERE MaNhanVienId IN (SELECT Id FROM @TempEmpIds);
DELETE FROM dbo.SoDuPhep WHERE MaNhanVienId IN (SELECT Id FROM @TempEmpIds);
DELETE FROM dbo.DonNghiPhep WHERE MaNhanVienId IN (SELECT Id FROM @TempEmpIds) OR NguoiDuyetId IN (SELECT Id FROM @TempEmpIds);
DELETE FROM dbo.DonLamThem WHERE MaNhanVienId IN (SELECT Id FROM @TempEmpIds) OR NguoiDuyetId IN (SELECT Id FROM @TempEmpIds);
DELETE FROM dbo.ChamCong WHERE MaNhanVienId IN (SELECT Id FROM @TempEmpIds);
DELETE FROM dbo.PhieuLuong WHERE MaNhanVienId IN (SELECT Id FROM @TempEmpIds) OR NguoiTaoId IN (SELECT Id FROM @TempEmpIds);
DELETE FROM dbo.NhanVien WHERE Id IN (SELECT Id FROM @TempEmpIds);

-- ============================================================
-- 2. KHỞI TẠO PHÒNG BAN MỚI (SALES) NẾU CHƯA CÓ
-- ============================================================
IF NOT EXISTS (SELECT 1 FROM dbo.PhongBan WHERE MaPhong = 'SALES')
BEGIN
    INSERT INTO dbo.PhongBan (TenPhong, MaPhong, MaPhongCha, MaQuanLy, DangHoatDong)
    VALUES (N'Phòng Kinh doanh', 'SALES', NULL, NULL, 1);
END;

-- ============================================================
-- 3. LẤY THÔNG TIN ID CÁC DANH MỤC ĐỂ CHÈN NHÂN VIÊN
-- ============================================================
DECLARE @HRId INT = (SELECT Id FROM dbo.PhongBan WHERE MaPhong = 'HR');
DECLARE @DEVId INT = (SELECT Id FROM dbo.PhongBan WHERE MaPhong = 'DEV');
DECLARE @ACCId INT = (SELECT Id FROM dbo.PhongBan WHERE MaPhong = 'ACC');
DECLARE @DEVBEId INT = (SELECT Id FROM dbo.PhongBan WHERE MaPhong = 'DEV-BE');
DECLARE @SALESId INT = (SELECT Id FROM dbo.PhongBan WHERE MaPhong = 'SALES');

DECLARE @AdminRoleId INT = (SELECT Id FROM dbo.VaiTro WHERE TenVaiTro = 'Admin');
DECLARE @ManagerRoleId INT = (SELECT Id FROM dbo.VaiTro WHERE TenVaiTro = 'Manager');
DECLARE @StaffRoleId INT = (SELECT Id FROM dbo.VaiTro WHERE TenVaiTro = 'Staff');

DECLARE @StaffPosId INT = (SELECT Id FROM dbo.ChucVu WHERE TenChucVu = N'Nhân viên');
DECLARE @ExpertPosId INT = (SELECT Id FROM dbo.ChucVu WHERE TenChucVu = N'Chuyên viên');
DECLARE @ManagerPosId INT = (SELECT Id FROM dbo.ChucVu WHERE TenChucVu = N'Trưởng phòng');

-- ============================================================
-- 4. THÊM 7 NHÂN VIÊN MỚI (MẬT KHẨU MẶC ĐỊNH: 123456)
-- ============================================================
-- 1. Lê Thị Mai (HR Staff)
INSERT INTO dbo.NhanVien (MaNhanVien, HoTen, Email, MatKhauHash, SoDienThoai, GioiTinh, NgaySinh, SoCCCD, DiaChi, MaSoThue, SoNguoiPhuThuoc, SoTaiKhoan, TenNganHang, ChiNhanhNganHang, MaPhongId, MaChucVuId, MaVaiTroId, NgayVaoLam, TrangThai)
VALUES ('EMP-2026-006', N'Lê Thị Mai', 'mai.le@nexthr.vn', '$2b$10$HW6PlpVsuh4BuxmEhh/pCuNLzu0ul5sooFxbGzSI.MS3WIcGRSdHq', '0901000006', N'Nữ', '1995-04-12', '012345678906', N'Hà Nội', 'MST006', 0, '100000006', N'Vietcombank', N'Cầu Giấy', @HRId, @StaffPosId, @StaffRoleId, '2026-01-15', N'Active');

-- 2. Nguyễn Minh Tuấn (ACC Staff)
INSERT INTO dbo.NhanVien (MaNhanVien, HoTen, Email, MatKhauHash, SoDienThoai, GioiTinh, NgaySinh, SoCCCD, DiaChi, MaSoThue, SoNguoiPhuThuoc, SoTaiKhoan, TenNganHang, ChiNhanhNganHang, MaPhongId, MaChucVuId, MaVaiTroId, NgayVaoLam, TrangThai)
VALUES ('EMP-2026-007', N'Nguyễn Minh Tuấn', 'tuan.nguyen@nexthr.vn', '$2b$10$HW6PlpVsuh4BuxmEhh/pCuNLzu0ul5sooFxbGzSI.MS3WIcGRSdHq', '0901000007', N'Nam', '1994-08-25', '012345678907', N'Hà Nội', 'MST007', 1, '100000007', N'BIDV', N'Hoàn Kiếm', @ACCId, @StaffPosId, @StaffRoleId, '2026-02-01', N'Active');

-- 3. Vũ Hoàng Long (DEV-BE Staff)
INSERT INTO dbo.NhanVien (MaNhanVien, HoTen, Email, MatKhauHash, SoDienThoai, GioiTinh, NgaySinh, SoCCCD, DiaChi, MaSoThue, SoNguoiPhuThuoc, SoTaiKhoan, TenNganHang, ChiNhanhNganHang, MaPhongId, MaChucVuId, MaVaiTroId, NgayVaoLam, TrangThai)
VALUES ('EMP-2026-008', N'Vũ Hoàng Long', 'long.vu@nexthr.vn', '$2b$10$HW6PlpVsuh4BuxmEhh/pCuNLzu0ul5sooFxbGzSI.MS3WIcGRSdHq', '0901000008', N'Nam', '1993-12-05', '012345678908', N'Hà Nội', 'MST008', 0, '100000008', N'Techcombank', N'Đống Đa', @DEVBEId, @ExpertPosId, @StaffRoleId, '2026-01-05', N'Active');

-- 4. Hoàng Thu Thảo (DEV Staff)
INSERT INTO dbo.NhanVien (MaNhanVien, HoTen, Email, MatKhauHash, SoDienThoai, GioiTinh, NgaySinh, SoCCCD, DiaChi, MaSoThue, SoNguoiPhuThuoc, SoTaiKhoan, TenNganHang, ChiNhanhNganHang, MaPhongId, MaChucVuId, MaVaiTroId, NgayVaoLam, TrangThai)
VALUES ('EMP-2026-009', N'Hoàng Thu Thảo', 'thao.hoang@nexthr.vn', '$2b$10$HW6PlpVsuh4BuxmEhh/pCuNLzu0ul5sooFxbGzSI.MS3WIcGRSdHq', '0901000009', N'Nữ', '1997-10-18', '012345678909', N'Hà Nội', 'MST009', 0, '100000009', N'Vietinbank', N'Ba Đình', @DEVId, @StaffPosId, @StaffRoleId, '2026-02-15', N'Active');

-- 5. Trần Văn Nam (SALES Manager)
INSERT INTO dbo.NhanVien (MaNhanVien, HoTen, Email, MatKhauHash, SoDienThoai, GioiTinh, NgaySinh, SoCCCD, DiaChi, MaSoThue, SoNguoiPhuThuoc, SoTaiKhoan, TenNganHang, ChiNhanhNganHang, MaPhongId, MaChucVuId, MaVaiTroId, NgayVaoLam, TrangThai)
VALUES ('EMP-2026-010', N'Trần Văn Nam', 'nam.tran@nexthr.vn', '$2b$10$HW6PlpVsuh4BuxmEhh/pCuNLzu0ul5sooFxbGzSI.MS3WIcGRSdHq', '0901000010', N'Nam', '1989-02-28', '012345678910', N'Hồ Chí Minh', 'MST010', 2, '100000010', N'Vietcombank', N'Quận 3', @SALESId, @ManagerPosId, @ManagerRoleId, '2026-01-10', N'Active');

-- 6. Nguyễn Thị Hương (SALES Staff)
INSERT INTO dbo.NhanVien (MaNhanVien, HoTen, Email, MatKhauHash, SoDienThoai, GioiTinh, NgaySinh, SoCCCD, DiaChi, MaSoThue, SoNguoiPhuThuoc, SoTaiKhoan, TenNganHang, ChiNhanhNganHang, MaPhongId, MaChucVuId, MaVaiTroId, NgayVaoLam, TrangThai)
VALUES ('EMP-2026-011', N'Nguyễn Thị Hương', 'huong.nguyen@nexthr.vn', '$2b$10$HW6PlpVsuh4BuxmEhh/pCuNLzu0ul5sooFxbGzSI.MS3WIcGRSdHq', '0901000011', N'Nữ', '1999-09-09', '012345678911', N'Hồ Chí Minh', 'MST011', 0, '100000011', N'Sacombank', N'Quận 5', @SALESId, @StaffPosId, @StaffRoleId, '2026-03-01', N'Active');

-- 7. Phạm Minh Đức (SALES Staff)
INSERT INTO dbo.NhanVien (MaNhanVien, HoTen, Email, MatKhauHash, SoDienThoai, GioiTinh, NgaySinh, SoCCCD, DiaChi, MaSoThue, SoNguoiPhuThuoc, SoTaiKhoan, TenNganHang, ChiNhanhNganHang, MaPhongId, MaChucVuId, MaVaiTroId, NgayVaoLam, TrangThai)
VALUES ('EMP-2026-012', N'Phạm Minh Đức', 'duc.pham@nexthr.vn', '$2b$10$HW6PlpVsuh4BuxmEhh/pCuNLzu0ul5sooFxbGzSI.MS3WIcGRSdHq', '0901000012', N'Nam', '1998-11-22', '012345678912', N'Hồ Chí Minh', 'MST012', 0, '100000012', N'MB Bank', N'Tân Bình', @SALESId, @StaffPosId, @StaffRoleId, '2026-03-15', N'Active');

-- Cập nhật Quản lý cho phòng Sales
DECLARE @NamId INT = (SELECT Id FROM dbo.NhanVien WHERE MaNhanVien = 'EMP-2026-010');
UPDATE dbo.PhongBan SET MaQuanLy = @NamId WHERE MaPhong = 'SALES';

-- ============================================================
-- 5. LẤY ID CỦA TOÀN BỘ 12 NHÂN SỰ ĐỂ CHÈN CÁC THÔNG TIN PHỤ THUỘC
-- ============================================================
DECLARE @HungId INT = (SELECT Id FROM dbo.NhanVien WHERE MaNhanVien = 'EMP-2025-001');
DECLARE @LanId INT = (SELECT Id FROM dbo.NhanVien WHERE MaNhanVien = 'EMP-2025-002');
DECLARE @KhoaId INT = (SELECT Id FROM dbo.NhanVien WHERE MaNhanVien = 'EMP-2025-003');
DECLARE @HaId INT = (SELECT Id FROM dbo.NhanVien WHERE MaNhanVien = 'EMP-2025-004');
DECLARE @BaoId INT = (SELECT Id FROM dbo.NhanVien WHERE MaNhanVien = 'EMP-2025-005');
DECLARE @MaiId INT = (SELECT Id FROM dbo.NhanVien WHERE MaNhanVien = 'EMP-2026-006');
DECLARE @TuanId INT = (SELECT Id FROM dbo.NhanVien WHERE MaNhanVien = 'EMP-2026-007');
DECLARE @LongId INT = (SELECT Id FROM dbo.NhanVien WHERE MaNhanVien = 'EMP-2026-008');
DECLARE @ThaoId INT = (SELECT Id FROM dbo.NhanVien WHERE MaNhanVien = 'EMP-2026-009');
DECLARE @HuongId INT = (SELECT Id FROM dbo.NhanVien WHERE MaNhanVien = 'EMP-2026-011');
DECLARE @DucId INT = (SELECT Id FROM dbo.NhanVien WHERE MaNhanVien = 'EMP-2026-012');

-- ============================================================
-- 6. THÊM HỢP ĐỒNG LAO ĐỘNG CHO 7 NHÂN VIÊN MỚI
-- ============================================================
INSERT INTO dbo.HopDong (MaNhanVienId, MaHopDong, LoaiHopDong, NgayBatDau, NgayKetThuc, NgayKy, LuongCoBan, GhiChu, TrangThai)
VALUES
(@MaiId, 'HDLD-2026-006', N'Xác định thời hạn', '2026-01-15', '2027-01-15', '2026-01-15', 12000000, N'Hợp đồng lao động chính thức', N'Active'),
(@TuanId, 'HDLD-2026-007', N'Xác định thời hạn', '2026-02-01', '2027-02-01', '2026-02-01', 13000000, N'Hợp đồng lao động chính thức', N'Active'),
(@LongId, 'HDLD-2026-008', N'Xác định thời hạn', '2026-01-05', '2027-01-05', '2026-01-05', 20000000, N'Hợp đồng lao động chính thức', N'Active'),
(@ThaoId, 'HDLD-2026-009', N'Xác định thời hạn', '2026-02-15', '2027-02-15', '2026-02-15', 17000000, N'Hợp đồng lao động chính thức', N'Active'),
(@NamId, 'HDLD-2026-010', N'Không xác định thời hạn', '2026-01-10', NULL, '2026-01-10', 22000000, N'Hợp đồng lao động chính thức', N'Active'),
(@HuongId, 'HDLD-2026-011', N'Xác định thời hạn', '2026-03-01', '2027-03-01', '2026-03-01', 11000000, N'Hợp đồng lao động chính thức', N'Active'),
(@DucId, 'HDLD-2026-012', N'Xác định thời hạn', '2026-03-15', '2027-03-15', '2026-03-15', 10500000, N'Hợp đồng lao động chính thức', N'Active');

-- ============================================================
-- 7. THÊM LỊCH SỬ LƯƠNG (SCD LOẠI 2) CHO 7 NHÂN VIÊN MỚI
-- ============================================================
INSERT INTO dbo.LichSuLuong (MaNhanVienId, LuongCoBan, PhuCap, NgayBatDau, NgayKetThuc, DangHieuLuc, NguoiThayDoiId, GhiChu)
VALUES
(@MaiId, 12000000, 1000000, '2026-01-15', NULL, 1, @HungId, N'Lương khởi tạo'),
(@TuanId, 13000000, 1000000, '2026-02-01', NULL, 1, @HungId, N'Lương khởi tạo'),
(@LongId, 20000000, 2000000, '2026-01-05', NULL, 1, @HungId, N'Lương khởi tạo'),
(@ThaoId, 17000000, 1500000, '2026-02-15', NULL, 1, @HungId, N'Lương khởi tạo'),
(@NamId, 22000000, 3000000, '2026-01-10', NULL, 1, @HungId, N'Lương khởi tạo'),
(@HuongId, 11000000, 1000000, '2026-03-01', NULL, 1, @HungId, N'Lương khởi tạo'),
(@DucId, 10500000, 1000000, '2026-03-15', NULL, 1, @HungId, N'Lương khởi tạo');

-- ============================================================
-- 8. THIẾT LẬP SỐ DƯ PHÉP NĂM 2026 CHO TOÀN BỘ 12 NHÂN SỰ
-- ============================================================
DELETE FROM dbo.SoDuPhep WHERE Nam = 2026;

DECLARE @PhepNamId INT = (SELECT Id FROM dbo.LoaiNghiPhep WHERE TenLoaiPhep = N'Nghỉ phép năm');
DECLARE @NghiOmId INT = (SELECT Id FROM dbo.LoaiNghiPhep WHERE TenLoaiPhep = N'Nghỉ ốm');

INSERT INTO dbo.SoDuPhep (MaNhanVienId, MaLoaiPhepId, Nam, TongNgayPhep, DaSuDung)
VALUES
(@HungId, @PhepNamId, 2026, 12, 0), (@HungId, @NghiOmId, 2026, 30, 0),
(@LanId, @PhepNamId, 2026, 12, 2),  (@LanId, @NghiOmId, 2026, 30, 0), -- Đã dùng 2 phép năm trong tháng 5
(@KhoaId, @PhepNamId, 2026, 12, 0), (@KhoaId, @NghiOmId, 2026, 30, 0),
(@HaId, @PhepNamId, 2026, 12, 0),   (@HaId, @NghiOmId, 2026, 30, 0),
(@BaoId, @PhepNamId, 2026, 12, 0),  (@BaoId, @NghiOmId, 2026, 30, 0),
(@MaiId, @PhepNamId, 2026, 12, 0),  (@MaiId, @NghiOmId, 2026, 30, 0),
(@TuanId, @PhepNamId, 2026, 12, 0), (@TuanId, @NghiOmId, 2026, 30, 0),
(@LongId, @PhepNamId, 2026, 12, 0), (@LongId, @NghiOmId, 2026, 30, 0),
(@ThaoId, @PhepNamId, 2026, 12, 0), (@ThaoId, @NghiOmId, 2026, 30, 0),
(@NamId, @PhepNamId, 2026, 12, 0),  (@NamId, @NghiOmId, 2026, 30, 0),
(@HuongId, @PhepNamId, 2026, 12, 0),(@HuongId, @NghiOmId, 2026, 30, 0),
(@DucId, @PhepNamId, 2026, 12, 0),  (@DucId, @NghiOmId, 2026, 30, 0);

-- ============================================================
-- 9. CHÈN ĐƠN XIN NGHỈ PHÉP (DONNGHIPHEP) MẪU
-- ============================================================
-- Lan: Nghỉ phép năm 2 ngày: 14/05/2026 - 15/05/2026 (Approved)
INSERT INTO dbo.DonNghiPhep (MaNhanVienId, MaLoaiPhepId, NgayBatDau, NgayKetThuc, TongSoNgay, LyDo, TrangThai, NguoiDuyetId, NgayDuyet)
VALUES
(@LanId, @PhepNamId, '2026-05-14', '2026-05-15', 2, N'Nghỉ phép năm đi du lịch gia đình', N'Approved', @HungId, '2026-05-10 09:00:00');

-- Bảo: Nghỉ không lương 2 ngày: 25/05/2026 - 26/05/2026 (Approved)
DECLARE @NghiKhongLuongId INT = (SELECT Id FROM dbo.LoaiNghiPhep WHERE TenLoaiPhep = N'Nghỉ không lương');
INSERT INTO dbo.DonNghiPhep (MaNhanVienId, MaLoaiPhepId, NgayBatDau, NgayKetThuc, TongSoNgay, LyDo, TrangThai, NguoiDuyetId, NgayDuyet)
VALUES
(@BaoId, @NghiKhongLuongId, '2026-05-25', '2026-05-26', 2, N'Giải quyết việc cá nhân gia đình', N'Approved', @HungId, '2026-05-20 14:30:00');

-- Tuấn: Nghỉ phép năm 1 ngày: 08/05/2026 (Rejected)
INSERT INTO dbo.DonNghiPhep (MaNhanVienId, MaLoaiPhepId, NgayBatDau, NgayKetThuc, TongSoNgay, LyDo, TrangThai, NguoiDuyetId, NgayDuyet, LyDoTuChoi)
VALUES
(@TuanId, @PhepNamId, '2026-05-08', '2026-05-08', 1, N'Nghỉ giải quyết việc riêng cá nhân', N'Rejected', @LanId, '2026-05-07 10:00:00', N'Dự án đang trong giai đoạn nước rút quyết toán sổ sách');

-- Mai: Nghỉ phép năm 2 ngày: 08/06/2026 - 09/06/2026 (Pending - chờ test duyệt)
INSERT INTO dbo.DonNghiPhep (MaNhanVienId, MaLoaiPhepId, NgayBatDau, NgayKetThuc, TongSoNgay, LyDo, TrangThai)
VALUES
(@MaiId, @PhepNamId, '2026-06-08', '2026-06-09', 2, N'Về quê giải quyết việc gia đình đột xuất', N'Pending');

-- ============================================================
-- 10. CHÈN ĐƠN LÀM THÊM GIỜ (DONLAMTHEM) MẪU
-- ============================================================
-- Hà: OT ngày thường 2h: 12/05/2026 18:00 - 20:00 (Approved)
INSERT INTO dbo.DonLamThem (MaNhanVienId, NgayLamThem, GioBatDau, GioKetThuc, TongSoGio, LoaiOT, HeSoOT, LyDo, TrangThai, NguoiDuyetId, NgayDuyet)
VALUES
(@HaId, '2026-05-12', '18:00:00', '20:00:00', 2, N'NgayThuong', 1.50, N'Hỗ trợ sửa lỗi gấp môi trường production hệ thống', N'Approved', @KhoaId, '2026-05-12 21:00:00');

-- Hà: OT ngày nghỉ 4h: 17/05/2026 (Chủ nhật) 08:00 - 12:00 (Approved)
INSERT INTO dbo.DonLamThem (MaNhanVienId, NgayLamThem, GioBatDau, GioKetThuc, TongSoGio, LoaiOT, HeSoOT, LyDo, TrangThai, NguoiDuyetId, NgayDuyet)
VALUES
(@HaId, '2026-05-17', '08:00:00', '12:00:00', 4, N'CuoiTuan', 2.00, N'Triển khai bản vá hệ thống dữ liệu cuối tuần', N'Approved', @KhoaId, '2026-05-17 13:00:00');

-- Long: OT ngày thường 3h: 05/06/2026 18:00 - 21:00 (Pending - chờ test duyệt)
INSERT INTO dbo.DonLamThem (MaNhanVienId, NgayLamThem, GioBatDau, GioKetThuc, TongSoGio, LoaiOT, HeSoOT, LyDo, TrangThai)
VALUES
(@LongId, '2026-06-05', '18:00:00', '21:00:00', 3, N'NgayThuong', 1.50, N'Tối ưu hóa cơ sở dữ liệu các bảng nghiệp vụ lớn của ứng dụng', N'Pending');

-- Thảo: OT ngày nghỉ 4h: 23/05/2026 08:00 - 12:00 (Rejected)
INSERT INTO dbo.DonLamThem (MaNhanVienId, NgayLamThem, GioBatDau, GioKetThuc, TongSoGio, LoaiOT, HeSoOT, LyDo, TrangThai, NguoiDuyetId, NgayDuyet)
VALUES
(@ThaoId, '2026-05-23', '08:00:00', '12:00:00', 4, N'CuoiTuan', 2.00, N'Lên thiết kế UI cho trang phân tích báo cáo dashboard mới', N'Rejected', @KhoaId, '2026-05-22 15:00:00');

-- ============================================================
-- 11. CHÈN DỮ LIỆU CHẤM CÔNG (CHAMCONG) CHO CẢ THÁNG 5/2026 (31 NGÀY)
-- ============================================================
DECLARE @d DATE = '2026-05-01';

WHILE @d <= '2026-05-31'
BEGIN
    DECLARE @wday INT = DATEPART(WEEKDAY, @d);
    
    -- Ngày 01/05/2026 là Quốc tế Lao động (Nghỉ lễ có lương, không chấm công hành chính)
    IF @d <> '2026-05-01' AND @wday <> 1 -- Không phải lễ và không phải Chủ nhật
    BEGIN
        DECLARE @standardHours FLOAT = CASE WHEN @wday = 7 THEN 4 ELSE 8 END;
        DECLARE @standardOutHour INT = CASE WHEN @wday = 7 THEN 12 ELSE 17 END;

        -- 1. HÙNG (EMP-2025-001): Đi làm đủ 100%
        INSERT INTO dbo.ChamCong (MaNhanVienId, NgayLamViec, GioVao, GioRa, SoGioLam, SoPhutDiMuon, TrangThai, NguonChamCong)
        VALUES (@HungId, @d, DATEADD(HOUR, 8, CAST(@d AS DATETIME)), DATEADD(HOUR, @standardOutHour, CAST(@d AS DATETIME)), @standardHours, 0, N'CoMat', N'Manual');

        -- 2. LAN (EMP-2025-002): Nghỉ phép năm có lương ngày 14/05 & 15/05 (Không chấm công)
        IF @d NOT IN ('2026-05-14', '2026-05-15')
        BEGIN
            INSERT INTO dbo.ChamCong (MaNhanVienId, NgayLamViec, GioVao, GioRa, SoGioLam, SoPhutDiMuon, TrangThai, NguonChamCong)
            VALUES (@LanId, @d, DATEADD(HOUR, 8, CAST(@d AS DATETIME)), DATEADD(HOUR, @standardOutHour, CAST(@d AS DATETIME)), @standardHours, 0, N'CoMat', N'Manual');
        END;

        -- 3. KHOA (EMP-2025-003): Đi làm đủ, nhưng đi muộn 3 lần:
        -- Ngày 06/05 muộn 20m, ngày 13/05 muộn 30m, ngày 20/05 muộn 45m
        DECLARE @lateMin INT = CASE 
            WHEN @d = '2026-05-06' THEN 20
            WHEN @d = '2026-05-13' THEN 30
            WHEN @d = '2026-05-20' THEN 45
            ELSE 0
        END;
        DECLARE @checkInTime DATETIME = DATEADD(MINUTE, @lateMin, DATEADD(HOUR, 8, CAST(@d AS DATETIME)));
        DECLARE @status NVARCHAR(20) = CASE WHEN @lateMin > 0 THEN N'DiMuon' ELSE N'CoMat' END;
        INSERT INTO dbo.ChamCong (MaNhanVienId, NgayLamViec, GioVao, GioRa, SoGioLam, SoPhutDiMuon, TrangThai, NguonChamCong)
        VALUES (@KhoaId, @d, @checkInTime, DATEADD(HOUR, @standardOutHour, CAST(@d AS DATETIME)), @standardHours, @lateMin, @status, N'Manual');

        -- 4. HÀ (EMP-2025-004): Đi làm đủ 100%
        INSERT INTO dbo.ChamCong (MaNhanVienId, NgayLamViec, GioVao, GioRa, SoGioLam, SoPhutDiMuon, TrangThai, NguonChamCong)
        VALUES (@HaId, @d, DATEADD(HOUR, 8, CAST(@d AS DATETIME)), DATEADD(HOUR, @standardOutHour, CAST(@d AS DATETIME)), @standardHours, 0, N'CoMat', N'Manual');

        -- 5. BẢO (EMP-2025-005): Nghỉ không lương 25/05, 26/05 & vắng không phép ngày 18/05
        IF @d NOT IN ('2026-05-18', '2026-05-25', '2026-05-26')
        BEGIN
            INSERT INTO dbo.ChamCong (MaNhanVienId, NgayLamViec, GioVao, GioRa, SoGioLam, SoPhutDiMuon, TrangThai, NguonChamCong)
            VALUES (@BaoId, @d, DATEADD(HOUR, 8, CAST(@d AS DATETIME)), DATEADD(HOUR, @standardOutHour, CAST(@d AS DATETIME)), @standardHours, 0, N'CoMat', N'Manual');
        END;

        -- 6. MAI (EMP-2026-006): Đi làm đủ 100%
        INSERT INTO dbo.ChamCong (MaNhanVienId, NgayLamViec, GioVao, GioRa, SoGioLam, SoPhutDiMuon, TrangThai, NguonChamCong)
        VALUES (@MaiId, @d, DATEADD(HOUR, 8, CAST(@d AS DATETIME)), DATEADD(HOUR, @standardOutHour, CAST(@d AS DATETIME)), @standardHours, 0, N'CoMat', N'Manual');

        -- 7. TUẤN (EMP-2026-007): Đi làm đủ 100%
        INSERT INTO dbo.ChamCong (MaNhanVienId, NgayLamViec, GioVao, GioRa, SoGioLam, SoPhutDiMuon, TrangThai, NguonChamCong)
        VALUES (@TuanId, @d, DATEADD(HOUR, 8, CAST(@d AS DATETIME)), DATEADD(HOUR, @standardOutHour, CAST(@d AS DATETIME)), @standardHours, 0, N'CoMat', N'Manual');

        -- 8. LONG (EMP-2026-008): Đi làm đủ 100%
        INSERT INTO dbo.ChamCong (MaNhanVienId, NgayLamViec, GioVao, GioRa, SoGioLam, SoPhutDiMuon, TrangThai, NguonChamCong)
        VALUES (@LongId, @d, DATEADD(HOUR, 8, CAST(@d AS DATETIME)), DATEADD(HOUR, @standardOutHour, CAST(@d AS DATETIME)), @standardHours, 0, N'CoMat', N'Manual');

        -- 9. THẢO (EMP-2026-009): Đi làm đủ 100%
        INSERT INTO dbo.ChamCong (MaNhanVienId, NgayLamViec, GioVao, GioRa, SoGioLam, SoPhutDiMuon, TrangThai, NguonChamCong)
        VALUES (@ThaoId, @d, DATEADD(HOUR, 8, CAST(@d AS DATETIME)), DATEADD(HOUR, @standardOutHour, CAST(@d AS DATETIME)), @standardHours, 0, N'CoMat', N'Manual');

        -- 10. NAM (EMP-2026-010): Đi làm đủ 100%
        INSERT INTO dbo.ChamCong (MaNhanVienId, NgayLamViec, GioVao, GioRa, SoGioLam, SoPhutDiMuon, TrangThai, NguonChamCong)
        VALUES (@NamId, @d, DATEADD(HOUR, 8, CAST(@d AS DATETIME)), DATEADD(HOUR, @standardOutHour, CAST(@d AS DATETIME)), @standardHours, 0, N'CoMat', N'Manual');

        -- 11. HƯƠNG (EMP-2026-011): Đi làm đủ 100%
        INSERT INTO dbo.ChamCong (MaNhanVienId, NgayLamViec, GioVao, GioRa, SoGioLam, SoPhutDiMuon, TrangThai, NguonChamCong)
        VALUES (@HuongId, @d, DATEADD(HOUR, 8, CAST(@d AS DATETIME)), DATEADD(HOUR, @standardOutHour, CAST(@d AS DATETIME)), @standardHours, 0, N'CoMat', N'Manual');

        -- 12. ĐỨC (EMP-2026-012): Đi làm đủ 100%
        INSERT INTO dbo.ChamCong (MaNhanVienId, NgayLamViec, GioVao, GioRa, SoGioLam, SoPhutDiMuon, TrangThai, NguonChamCong)
        VALUES (@DucId, @d, DATEADD(HOUR, 8, CAST(@d AS DATETIME)), DATEADD(HOUR, @standardOutHour, CAST(@d AS DATETIME)), @standardHours, 0, N'CoMat', N'Manual');
    END;

    SET @d = DATEADD(DAY, 1, @d);
END;

COMMIT TRANSACTION;
GO

PRINT N'Thành công: Đã chèn dữ liệu seed HRM chuyên nghiệp tháng 5/2026';
GO
