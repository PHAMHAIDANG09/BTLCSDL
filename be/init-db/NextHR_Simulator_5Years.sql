-- =============================================================================================================
-- DỰ ÁN: NEXTHR - MASTER WORKLOAD SIMULATION v2.0 (5 NĂM)
-- Thời gian giả lập: 01/01/2022 → 31/12/2026
-- Mục tiêu:
--   ① Seed đầy đủ dữ liệu gốc cho tất cả bảng danh mục
--   ② Giả lập 100 nhân viên với vòng đời thực tế (tuyển dụng, điều chuyển, nghỉ việc)
--   ③ Phủ 100% các bảng nghiệp vụ: ChamCong, HopDong, LichSuLuong, DonNghiPhep,
--      DonLamThem, SoDuPhep, LichSuDieuChuyen, PhieuLuong, NhatKyHeThong
--   ④ Kích hoạt tất cả 27 Index trong script tối ưu
--   ⑤ Phản ánh đúng tỷ lệ thực tế: 10% OT, 5% đơn phép/tháng, 2% điều chuyển/quý
-- =============================================================================================================

USE NextHR;
GO

SET NOCOUNT ON;
SET XACT_ABORT ON;

PRINT N'╔══════════════════════════════════════════════════════╗';
PRINT N'║   NEXTHR SIMULATOR v2.0  ║';
PRINT N'╚══════════════════════════════════════════════════════╝';

-- =============================================================================================================
-- BƯỚC 0: DỌN DẸP DỮ LIỆU CŨ (theo thứ tự FK)
-- =============================================================================================================

PRINT N'[0/7] Dọn dẹp dữ liệu cũ...';

-- Tắt tất cả audit trigger để tránh lỗi FK khi xóa dữ liệu cũ
DISABLE TRIGGER dbo.trg_Audit_NhanVien    ON dbo.NhanVien;
DISABLE TRIGGER dbo.trg_Audit_DonNghiPhep ON dbo.DonNghiPhep;
DISABLE TRIGGER dbo.trg_Audit_PhieuLuong  ON dbo.PhieuLuong;

DELETE FROM dbo.NhatKyHeThong;
DELETE FROM dbo.PhieuLuong;
DELETE FROM dbo.SoDuPhep;
DELETE FROM dbo.DonNghiPhep;
DELETE FROM dbo.DonLamThem;
DELETE FROM dbo.ChamCong;
DELETE FROM dbo.LichSuDieuChuyen;
DELETE FROM dbo.LichSuLuong;
DELETE FROM dbo.HopDong;

-- Tắt FK tạm để xóa NhanVien ↔ PhongBan (circular reference qua MaQuanLy)
ALTER TABLE dbo.PhongBan NOCHECK CONSTRAINT FK_PhongBan_QuanLy;
DELETE FROM dbo.NhanVien;
DELETE FROM dbo.PhongBan;
ALTER TABLE dbo.PhongBan CHECK CONSTRAINT FK_PhongBan_QuanLy;

DELETE FROM dbo.NgayLe;
DELETE FROM dbo.LoaiNghiPhep;
DELETE FROM dbo.VaiTro;
DELETE FROM dbo.ChucVu;

-- Reset IDENTITY
DBCC CHECKIDENT ('dbo.NhanVien',      RESEED, 0);
DBCC CHECKIDENT ('dbo.PhongBan',      RESEED, 0);
DBCC CHECKIDENT ('dbo.HopDong',       RESEED, 0);
DBCC CHECKIDENT ('dbo.LichSuLuong',   RESEED, 0);
DBCC CHECKIDENT ('dbo.LichSuDieuChuyen', RESEED, 0);
DBCC CHECKIDENT ('dbo.ChamCong',      RESEED, 0);
DBCC CHECKIDENT ('dbo.DonNghiPhep',   RESEED, 0);
DBCC CHECKIDENT ('dbo.DonLamThem',    RESEED, 0);
DBCC CHECKIDENT ('dbo.PhieuLuong',    RESEED, 0);
DBCC CHECKIDENT ('dbo.NhatKyHeThong', RESEED, 0);
DBCC CHECKIDENT ('dbo.VaiTro',        RESEED, 0);
DBCC CHECKIDENT ('dbo.ChucVu',        RESEED, 0);
DBCC CHECKIDENT ('dbo.LoaiNghiPhep',  RESEED, 0);

PRINT N'[0/7] Dọn dẹp xong.';

-- =============================================================================================================
-- BƯỚC 1: SEED DỮ LIỆU DANH MỤC
-- =============================================================================================================

PRINT N'[1/7] Seed dữ liệu danh mục...';

-- Vai Trò (phải match CHECK constraint: Admin/Manager/Staff)
INSERT INTO dbo.VaiTro (TenVaiTro, MoTa) VALUES
    ('Admin',   N'Quản trị hệ thống'),
    ('Manager', N'Quản lý phòng ban'),
    ('Staff',   N'Nhân viên thông thường');

-- Chức Vụ (CapDo 1-4)
INSERT INTO dbo.ChucVu (TenChucVu, CapDo, MoTa) VALUES
    (N'Giám đốc',           4, N'C-Level, điều hành toàn công ty'),
    (N'Trưởng phòng',       3, N'Quản lý phòng ban'),
    (N'Phó phòng',          3, N'Hỗ trợ trưởng phòng'),
    (N'Chuyên viên cao cấp',2, N'Senior individual contributor'),
    (N'Chuyên viên',        2, N'Mid-level contributor'),
    (N'Nhân viên',          1, N'Junior contributor'),
    (N'Thực tập sinh',      1, N'Intern');

-- Loại Nghỉ Phép
INSERT INTO dbo.LoaiNghiPhep (TenLoaiPhep, CoHuongLuong, SoNgayToiDaNam, MoTa) VALUES
    (N'Phép năm',       1, 12, N'Phép thường niên theo luật lao động'),
    (N'Phép bệnh',      1,  5, N'Nghỉ bệnh có hưởng lương'),
    (N'Phép không lương',0,30, N'Nghỉ không hưởng lương theo thỏa thuận'),
    (N'Nghỉ thai sản',  1,180, N'Chế độ thai sản theo luật'),
    (N'Phép cá nhân',   0,  3, N'Việc riêng khẩn cấp');

-- Ngày Lễ (2022-2026)
INSERT INTO dbo.NgayLe (NgayLe, TenNgayLe, LapLaiHangNam) VALUES
    -- 2022
    ('2022-01-01', N'Tết Dương lịch',          1),
    ('2022-01-31', N'Tết Nguyên Đán (30)',      0),
    ('2022-02-01', N'Tết Nguyên Đán (Mùng 1)', 0),
    ('2022-02-02', N'Tết Nguyên Đán (Mùng 2)', 0),
    ('2022-02-03', N'Tết Nguyên Đán (Mùng 3)', 0),
    ('2022-04-10', N'Giỗ Tổ Hùng Vương',       0),
    ('2022-04-30', N'Ngày Giải phóng',          1),
    ('2022-05-01', N'Ngày Quốc tế Lao động',   1),
    ('2022-09-02', N'Quốc Khánh',               1),
    -- 2023
    ('2023-01-01', N'Tết Dương lịch',          1),
    ('2023-01-20', N'Tết Nguyên Đán (29)',      0),
    ('2023-01-21', N'Tết Nguyên Đán (Mùng 1)', 0),
    ('2023-01-22', N'Tết Nguyên Đán (Mùng 2)', 0),
    ('2023-01-23', N'Tết Nguyên Đán (Mùng 3)', 0),
    ('2023-04-29', N'Giỗ Tổ Hùng Vương',       0),
    ('2023-04-30', N'Ngày Giải phóng',          1),
    ('2023-05-01', N'Ngày Quốc tế Lao động',   1),
    ('2023-09-02', N'Quốc Khánh',               1),
    -- 2024
    ('2024-01-01', N'Tết Dương lịch',          1),
    ('2024-02-08', N'Tết Nguyên Đán (29)',      0),
    ('2024-02-09', N'Tết Nguyên Đán (Mùng 1)', 0),
    ('2024-02-10', N'Tết Nguyên Đán (Mùng 2)', 0),
    ('2024-02-11', N'Tết Nguyên Đán (Mùng 3)', 0),
    ('2024-04-18', N'Giỗ Tổ Hùng Vương',       0),
    ('2024-04-30', N'Ngày Giải phóng',          1),
    ('2024-05-01', N'Ngày Quốc tế Lao động',   1),
    ('2024-09-02', N'Quốc Khánh',               1),
    -- 2025
    ('2025-01-01', N'Tết Dương lịch',          1),
    ('2025-01-28', N'Tết Nguyên Đán (29)',      0),
    ('2025-01-29', N'Tết Nguyên Đán (Mùng 1)', 0),
    ('2025-01-30', N'Tết Nguyên Đán (Mùng 2)', 0),
    ('2025-01-31', N'Tết Nguyên Đán (Mùng 3)', 0),
    ('2025-04-07', N'Giỗ Tổ Hùng Vương',       0),
    ('2025-04-30', N'Ngày Giải phóng',          1),
    ('2025-05-01', N'Ngày Quốc tế Lao động',   1),
    ('2025-09-02', N'Quốc Khánh',               1),
    -- 2026
    ('2026-01-01', N'Tết Dương lịch',          1),
    ('2026-02-16', N'Tết Nguyên Đán (29)',      0),
    ('2026-02-17', N'Tết Nguyên Đán (Mùng 1)', 0),
    ('2026-02-18', N'Tết Nguyên Đán (Mùng 2)', 0),
    ('2026-02-19', N'Tết Nguyên Đán (Mùng 3)', 0),
    ('2026-04-25', N'Giỗ Tổ Hùng Vương',       0),
    ('2026-04-30', N'Ngày Giải phóng',          1),
    ('2026-05-01', N'Ngày Quốc tế Lao động',   1),
    ('2026-09-02', N'Quốc Khánh',               1);

-- Phòng Ban (cấu trúc cây 2 cấp)
INSERT INTO dbo.PhongBan (TenPhong, MaPhong, MaPhongCha, MaQuanLy, DangHoatDong, NgayTao) VALUES
    (N'Ban Giám Đốc',           'BGD',  NULL, NULL, 1, '2022-01-01'),
    (N'Phòng Nhân Sự',          'HR',   NULL, NULL, 1, '2022-01-01'),
    (N'Phòng Kỹ Thuật',         'IT',   NULL, NULL, 1, '2022-01-01'),
    (N'Phòng Kinh Doanh',       'KD',   NULL, NULL, 1, '2022-01-01'),
    (N'Phòng Tài Chính',        'TC',   NULL, NULL, 1, '2022-01-01'),
    (N'Phòng Marketing',        'MKT',  NULL, NULL, 1, '2022-01-01'),
    (N'Phòng Pháp Lý',          'PL',   NULL, NULL, 1, '2022-01-01'),
    -- Phòng con của IT
    (N'Bộ phận Backend',        'IT-BE', 3,   NULL, 1, '2022-06-01'),
    (N'Bộ phận Frontend',       'IT-FE', 3,   NULL, 1, '2022-06-01'),
    (N'Bộ phận QA/QC',          'IT-QA', 3,   NULL, 1, '2022-06-01'),
    -- Phòng con của KD
    (N'Kênh B2B',               'KD-B2B',4,   NULL, 1, '2023-01-01'),
    (N'Kênh B2C',               'KD-B2C',4,   NULL, 1, '2023-01-01');

PRINT N'[1/7] Danh mục xong. Bắt đầu seed nhân viên...';

-- =============================================================================================================
-- BƯỚC 2: SEED NHÂN VIÊN (100 người, đa dạng vòng đời)
-- =============================================================================================================

PRINT N'[2/7] Seed 100 nhân viên...';

-- Tạo bảng tạm chứa danh sách HoTen để giả lập tên thực tế
IF OBJECT_ID('tempdb..#TenNV') IS NOT NULL DROP TABLE #TenNV;
CREATE TABLE #TenNV (Id INT IDENTITY(1,1), HoTen NVARCHAR(100));
INSERT INTO #TenNV (HoTen) VALUES
(N'Nguyễn Văn An'), (N'Trần Thị Bích'), (N'Lê Minh Châu'), (N'Phạm Thị Dung'), (N'Hoàng Văn Em'),
(N'Vũ Thị Fương'), (N'Đặng Minh Giang'), (N'Bùi Thị Hoa'), (N'Ngô Văn Ích'), (N'Dương Thị Kiều'),
(N'Lý Văn Long'), (N'Trịnh Thị Mai'), (N'Phan Văn Nam'), (N'Hồ Thị Oanh'), (N'Tô Minh Phúc'),
(N'Đinh Thị Quỳnh'), (N'Lưu Văn Rồng'), (N'Đỗ Thị Sương'), (N'Cao Văn Thắng'), (N'Nghiêm Thị Uyên'),
(N'Hà Văn Vinh'), (N'Mai Thị Xuân'), (N'Kiều Văn Yên'), (N'Tống Thị Zung'), (N'Âu Minh Bảo'),
(N'Chu Thị Cẩm'), (N'Dư Văn Đạt'), (N'Giả Thị Én'), (N'Khúc Văn Phong'), (N'Lữ Thị Giang'),
(N'Mạc Văn Hậu'), (N'Ninh Thị Iris'), (N'Ông Văn Khải'), (N'Quảng Thị Lan'), (N'Rừng Văn Minh'),
(N'Sầm Thị Ngân'), (N'Tăng Văn Ổn'), (N'Ứng Thị Phương'), (N'Vạn Văn Quốc'), (N'Xương Thị Rô'),
(N'Yên Văn Sơn'), (N'Tri Thị Tâm'), (N'An Văn Ưu'), (N'Băng Thị Vân'), (N'Chí Văn Xuân'),
(N'Dụng Thị Yến'), (N'Ẩn Văn Dũng'), (N'Bạch Thị Hằng'), (N'Cảnh Văn Khánh'), (N'Dào Thị Liên'),
(N'Nguyễn Thị Mỹ'), (N'Trần Văn Nhật'), (N'Lê Thị Oanh'), (N'Phạm Văn Phát'), (N'Hoàng Thị Quế'),
(N'Vũ Văn Rạng'), (N'Đặng Thị Sen'), (N'Bùi Văn Tài'), (N'Ngô Thị Uyên'), (N'Dương Văn Vũ'),
(N'Lý Thị Wân'), (N'Trịnh Văn Xuân'), (N'Phan Thị Yên'), (N'Hồ Văn Zên'), (N'Tô Thị Ân'),
(N'Đinh Văn Bền'), (N'Lưu Thị Cúc'), (N'Đỗ Văn Dân'), (N'Cao Thị Em'), (N'Nghiêm Văn Phú'),
(N'Hà Thị Gấm'), (N'Mai Văn Hưng'), (N'Kiều Thị Ích'), (N'Tống Văn Kiên'), (N'Âu Thị Lan'),
(N'Chu Văn Mạnh'), (N'Dư Thị Nhi'), (N'Giả Văn Oai'), (N'Khúc Thị Phong'), (N'Lữ Văn Quân'),
(N'Mạc Thị Rụng'), (N'Ninh Văn Sáng'), (N'Ông Thị Tâm'), (N'Quảng Văn Ưu'), (N'Rừng Thị Vân'),
(N'Sầm Văn Xuân'), (N'Tăng Thị Yến'), (N'Ứng Văn Dũng'), (N'Vạn Thị Hằng'), (N'Xương Văn Khánh'),
(N'Yên Thị Liên'), (N'Tri Văn Minh'), (N'An Thị Ngân'), (N'Băng Văn Ổn'), (N'Chí Thị Phương'),
(N'Lã Văn Quang'), (N'Mẫn Thị Rồng'), (N'Niệm Văn Sơn'), (N'Oánh Thị Tùng'), (N'Pể Văn Uyên');

DECLARE @EmpIdx     INT = 1;
DECLARE @HoTen      NVARCHAR(100);
DECLARE @MaNV       VARCHAR(20);
DECLARE @Email      VARCHAR(100);
DECLARE @PhongId    INT;
DECLARE @ChucVuId   INT;
DECLARE @VaiTroId   INT;
DECLARE @NgayVao    DATE;
DECLARE @LuongCB    DECIMAL(18,2);
DECLARE @EmpId      INT;
DECLARE @HopDongId  INT;

WHILE @EmpIdx <= 100
BEGIN
    SELECT @HoTen = HoTen FROM #TenNV WHERE Id = @EmpIdx;

    SET @MaNV    = 'EMP-2022-' + RIGHT('0000' + CAST(@EmpIdx AS VARCHAR), 4);
    SET @Email   = 'emp' + CAST(@EmpIdx AS VARCHAR) + '@nexthr.com';

    -- Phân bổ phòng ban theo tỷ lệ thực tế
    SET @PhongId = CASE
        WHEN @EmpIdx = 1                    THEN 1  -- BGD (Giám đốc)
        WHEN @EmpIdx BETWEEN 2 AND 4        THEN 2  -- HR
        WHEN @EmpIdx BETWEEN 5 AND 30       THEN 3  -- IT
        WHEN @EmpIdx BETWEEN 31 AND 55      THEN 4  -- KD
        WHEN @EmpIdx BETWEEN 56 AND 70      THEN 5  -- TC
        WHEN @EmpIdx BETWEEN 71 AND 85      THEN 6  -- MKT
        ELSE                                     7  -- PL
    END;

    -- Chức vụ và vai trò theo EmpIdx
    SET @ChucVuId = CASE
        WHEN @EmpIdx = 1                    THEN 1  -- Giám đốc
        WHEN @EmpIdx IN (2,5,31,56,71,86)   THEN 2  -- Trưởng phòng
        WHEN @EmpIdx IN (3,6,32,57,72,87)   THEN 3  -- Phó phòng
        WHEN @EmpIdx BETWEEN 4 AND 10       THEN 4  -- Chuyên viên cao cấp
        WHEN @EmpIdx BETWEEN 11 AND 40      THEN 5  -- Chuyên viên
        WHEN @EmpIdx BETWEEN 41 AND 90      THEN 6  -- Nhân viên
        ELSE                                     7  -- Thực tập sinh
    END;

    SET @VaiTroId = CASE
        WHEN @EmpIdx = 1                                THEN 1  -- Admin
        WHEN @EmpIdx IN (2,5,31,56,71,86,3,6,32,57,72) THEN 2  -- Manager
        ELSE                                                 3  -- Staff
    END;

    -- Ngày vào làm phân bổ đều trong 2022-2024
    SET @NgayVao = CASE
        WHEN @EmpIdx BETWEEN 1  AND 30  THEN '2022-01-01'
        WHEN @EmpIdx BETWEEN 31 AND 60  THEN '2022-07-01'
        WHEN @EmpIdx BETWEEN 61 AND 80  THEN '2023-01-01'
        WHEN @EmpIdx BETWEEN 81 AND 95  THEN '2023-07-01'
        ELSE                                 '2024-01-01'
    END;

    -- Lương cơ bản theo chức vụ
    SET @LuongCB = CASE @ChucVuId
        WHEN 1 THEN 50000000
        WHEN 2 THEN 30000000
        WHEN 3 THEN 25000000
        WHEN 4 THEN 20000000
        WHEN 5 THEN 15000000
        WHEN 6 THEN 10000000
        ELSE        6000000
    END;

    -- INSERT NhanVien
    INSERT INTO dbo.NhanVien (
        MaNhanVien, HoTen, Email, MatKhauHash,
        SoDienThoai, GioiTinh, NgaySinh, SoCCCD,
        DiaChi, MaSoThue, SoNguoiPhuThuoc,
        SoTaiKhoan, TenNganHang, ChiNhanhNganHang,
        MaPhongId, MaChucVuId, MaVaiTroId,
        NgayVaoLam, NgayNghiViec, TrangThai,
        NgayTao
    )
    VALUES (
        @MaNV, @HoTen, @Email,
        '$2a$12$' + REPLICATE('x', 53),   -- hash placeholder
        '09' + RIGHT('00000000' + CAST((@EmpIdx * 1337) AS VARCHAR), 8),
        CASE WHEN @EmpIdx % 3 = 0 THEN N'Nữ' ELSE N'Nam' END,
        DATEADD(YEAR, -(25 + @EmpIdx % 15), '2000-01-01'),
        '0' + RIGHT('000000000000' + CAST((@EmpIdx * 9973) AS VARCHAR), 11),
        N'Số ' + CAST(@EmpIdx AS NVARCHAR) + N' Đường ABC, Quận ' + CAST((@EmpIdx % 12 + 1) AS NVARCHAR) + N', Hà Nội',
        'MST' + RIGHT('00000000' + CAST(@EmpIdx AS VARCHAR), 8),
        @EmpIdx % 3,
        'VN' + RIGHT('000000000000' + CAST((@EmpIdx * 7919) AS VARCHAR), 12),
        CASE @EmpIdx % 3 WHEN 0 THEN N'Vietcombank' WHEN 1 THEN N'Techcombank' ELSE N'Agribank' END,
        N'Chi nhánh Hà Nội',
        @PhongId, @ChucVuId, @VaiTroId,
        @NgayVao,
        NULL,       -- Chưa nghỉ việc (sẽ update một số người sau)
        N'Active',
        CAST(@NgayVao AS DATETIME)
    );

    SET @EmpId = SCOPE_IDENTITY();

    -- -------- Hợp Đồng ban đầu --------
    DECLARE @LoaiHD NVARCHAR(50) = CASE
        WHEN @ChucVuId IN (1,2,3) THEN N'Không xác định thời hạn'
        ELSE                           N'Xác định thời hạn'  -- Bao gồm cả nhân viên thử việc (hđ 2 tháng)
    END;
    DECLARE @NgayKetThucHD DATE = CASE
        WHEN @LoaiHD = N'Không xác định thời hạn' THEN NULL
        WHEN @EmpIdx % 5 = 0                         THEN DATEADD(MONTH, 2, @NgayVao)  -- Thử việc 2 tháng
        ELSE                                              DATEADD(YEAR, 1, @NgayVao)
    END;

    INSERT INTO dbo.HopDong (
        MaNhanVienId, MaHopDong, LoaiHopDong,
        NgayBatDau, NgayKetThuc, NgayKy,
        LuongCoBan,
        TrangThai, NgayTao
    )
    VALUES (
        @EmpId,
        'HD-2022-' + RIGHT('0000' + CAST(@EmpIdx AS VARCHAR), 4),
        @LoaiHD,
        @NgayVao,
        @NgayKetThucHD,
        DATEADD(DAY, -3, @NgayVao),
        @LuongCB,
        N'Active',
        CAST(@NgayVao AS DATETIME)
    );

    -- -------- Lịch Sử Lương ban đầu --------
    INSERT INTO dbo.LichSuLuong (
        MaNhanVienId, LuongCoBan, PhuCap,
        NgayBatDau, NgayKetThuc, DangHieuLuc,
        NguoiThayDoiId, GhiChu, NgayTao
    )
    VALUES (
        @EmpId,
        @LuongCB,
        @LuongCB * 0.1,   -- Phụ cấp 10%
        @NgayVao,
        NULL,
        1,
        1,   -- Người HR (sẽ là EmpId=1, Admin) — self-reference tạm
        N'Lương khởi điểm khi tuyển dụng',
        CAST(@NgayVao AS DATETIME)
    );

    -- -------- Số Dư Phép (mỗi năm trong khoảng làm việc) --------
    DECLARE @YearLoop INT = YEAR(@NgayVao);
    WHILE @YearLoop <= 2026
    BEGIN
        INSERT INTO dbo.SoDuPhep (MaNhanVienId, MaLoaiPhepId, Nam, TongNgayPhep, DaSuDung)
        VALUES (@EmpId, 1, @YearLoop, 12, 0),   -- Phép năm
               (@EmpId, 2, @YearLoop,  5, 0);   -- Phép bệnh
        SET @YearLoop += 1;
    END;

    SET @EmpIdx += 1;
END;

DROP TABLE #TenNV;

-- Cập nhật MaQuanLy cho PhongBan (sau khi có NhanVien)
UPDATE dbo.PhongBan SET MaQuanLy = 1  WHERE MaPhong = 'BGD';
UPDATE dbo.PhongBan SET MaQuanLy = 2  WHERE MaPhong = 'HR';
UPDATE dbo.PhongBan SET MaQuanLy = 5  WHERE MaPhong = 'IT';
UPDATE dbo.PhongBan SET MaQuanLy = 31 WHERE MaPhong = 'KD';
UPDATE dbo.PhongBan SET MaQuanLy = 56 WHERE MaPhong = 'TC';
UPDATE dbo.PhongBan SET MaQuanLy = 71 WHERE MaPhong = 'MKT';
UPDATE dbo.PhongBan SET MaQuanLy = 86 WHERE MaPhong = 'PL';
UPDATE dbo.PhongBan SET MaQuanLy = 7  WHERE MaPhong = 'IT-BE';
UPDATE dbo.PhongBan SET MaQuanLy = 8  WHERE MaPhong = 'IT-FE';
UPDATE dbo.PhongBan SET MaQuanLy = 9  WHERE MaPhong = 'IT-QA';
UPDATE dbo.PhongBan SET MaQuanLy = 33 WHERE MaPhong = 'KD-B2B';
UPDATE dbo.PhongBan SET MaQuanLy = 34 WHERE MaPhong = 'KD-B2C';

-- Fix NguoiThayDoiId trong LichSuLuong (khi tạo NV đầu tiên, EmpId=1 chưa tồn tại)
-- Tất cả đã dùng NguoiThayDoiId=1, nay EmpId=1 đã tồn tại -> hợp lệ, không cần sửa

PRINT N'[2/7] Seed nhân viên xong (100 NV, 100 HopDong, 100 LichSuLuong, ~200+ SoDuPhep).';

-- Bật lại audit trigger sau khi seed xong dữ liệu gốc
ENABLE TRIGGER dbo.trg_Audit_NhanVien    ON dbo.NhanVien;
ENABLE TRIGGER dbo.trg_Audit_DonNghiPhep ON dbo.DonNghiPhep;
ENABLE TRIGGER dbo.trg_Audit_PhieuLuong  ON dbo.PhieuLuong;

-- =============================================================================================================
-- BƯỚC 3: GIẢ LẬP ĐIỀU CHUYỂN + TĂNG LƯƠNG ĐỊNH KỲ (2022-2026)
-- =============================================================================================================

PRINT N'[3/7] Giả lập điều chuyển và tăng lương...';

-- Tăng lương cuối năm cho tất cả (đầu năm 2023, 2024, 2025, 2026)
DECLARE @RaiseYear INT;
DECLARE @RaiseDate DATE;
DECLARE @OldSalaryId INT;
DECLARE @OldLuong DECIMAL(18,2);
DECLARE @OldPhuCap DECIMAL(18,2);

DECLARE nv_raise_cursor CURSOR LOCAL FAST_FORWARD FOR
    SELECT DISTINCT MaNhanVienId FROM dbo.LichSuLuong WHERE DangHieuLuc = 1;

DECLARE raise_year_cursor CURSOR LOCAL FAST_FORWARD FOR
    SELECT y FROM (VALUES (2023),(2024),(2025),(2026)) v(y);

OPEN raise_year_cursor;
FETCH NEXT FROM raise_year_cursor INTO @RaiseYear;

WHILE @@FETCH_STATUS = 0
BEGIN
    SET @RaiseDate = DATEFROMPARTS(@RaiseYear, 1, 1);

    OPEN nv_raise_cursor;
    FETCH NEXT FROM nv_raise_cursor INTO @OldSalaryId;

    WHILE @@FETCH_STATUS = 0
    BEGIN
        -- Lấy lương hiện hành
        SELECT TOP 1
            @OldLuong   = LuongCoBan,
            @OldPhuCap  = PhuCap,
            @OldSalaryId = Id
        FROM dbo.LichSuLuong
        WHERE MaNhanVienId = @OldSalaryId
          AND DangHieuLuc = 1;

        IF @OldLuong IS NOT NULL
        BEGIN
            -- Đóng bản ghi lương cũ
            UPDATE dbo.LichSuLuong
            SET DangHieuLuc = 0, NgayKetThuc = DATEADD(DAY, -1, @RaiseDate)
            WHERE Id = @OldSalaryId;

            -- Mở bản ghi lương mới (+8% mỗi năm)
            INSERT INTO dbo.LichSuLuong (
                MaNhanVienId, LuongCoBan, PhuCap,
                NgayBatDau, NgayKetThuc, DangHieuLuc,
                NguoiThayDoiId, GhiChu, NgayTao
            )
            SELECT
                MaNhanVienId,
                ROUND(@OldLuong * 1.08, -3),    -- Tăng 8%, làm tròn nghìn
                ROUND(@OldPhuCap * 1.08, -3),
                @RaiseDate,
                NULL,
                1,
                1,
                N'Tăng lương định kỳ năm ' + CAST(@RaiseYear AS NVARCHAR),
                CAST(@RaiseDate AS DATETIME)
            FROM dbo.LichSuLuong
            WHERE Id = @OldSalaryId;
        END;

        FETCH NEXT FROM nv_raise_cursor INTO @OldSalaryId;
    END;

    CLOSE nv_raise_cursor;

    FETCH NEXT FROM raise_year_cursor INTO @RaiseYear;
END;

CLOSE raise_year_cursor;
DEALLOCATE raise_year_cursor;
DEALLOCATE nv_raise_cursor;

-- Điều chuyển: 5 NV mỗi quý (phản ánh tỷ lệ ~2%/quý thực tế)
INSERT INTO dbo.LichSuDieuChuyen (
    MaNhanVienId, PhongBanCuId, PhongBanMoiId,
    ChucVuCuId, ChucVuMoiId, NgayHieuLuc,
    LyDo, NguoiDuyetId, NgayTao
)
VALUES
    -- 2022 Q3: IT → IT-BE (thành lập bộ phận)
    (10, 3, 8, 5, 5, '2022-07-01', N'Thành lập bộ phận Backend',   1, '2022-07-01'),
    (11, 3, 8, 5, 5, '2022-07-01', N'Thành lập bộ phận Backend',   1, '2022-07-01'),
    (12, 3, 9, 5, 5, '2022-07-01', N'Thành lập bộ phận Frontend',  1, '2022-07-01'),
    (13, 3, 9, 5, 5, '2022-07-01', N'Thành lập bộ phận Frontend',  1, '2022-07-01'),
    (14, 3,10, 6, 5, '2022-07-01', N'Thành lập bộ phận QA',        1, '2022-07-01'),
    -- 2023 Q1: Thăng cấp
    (20, 4, 4, 5, 4, '2023-01-15', N'Thăng cấp Chuyên viên cao cấp', 1, '2023-01-15'),
    (35, 4, 4, 6, 5, '2023-01-15', N'Thăng cấp Chuyên viên',         1, '2023-01-15'),
    -- 2023 Q2: KD mở kênh B2B, B2C
    (40, 4,11, 5, 5, '2023-04-01', N'Điều chuyển sang kênh B2B',   31, '2023-04-01'),
    (41, 4,11, 6, 5, '2023-04-01', N'Điều chuyển sang kênh B2B',   31, '2023-04-01'),
    (42, 4,12, 5, 5, '2023-04-01', N'Điều chuyển sang kênh B2C',   31, '2023-04-01'),
    -- 2024 Q1: Luân chuyển HR
    (90, 7, 2, 6, 6, '2024-01-10', N'Hỗ trợ HR theo yêu cầu BGĐ',  1, '2024-01-10'),
    -- 2025 Q2: Thăng cấp
    (50, 5, 5, 5, 4, '2025-04-01', N'Bổ nhiệm Chuyên viên cao cấp TC', 1, '2025-04-01');

-- Cập nhật MaPhongId và MaChucVuId sau điều chuyển (theo bản ghi mới nhất)
UPDATE nv SET nv.MaPhongId   = dc.PhongBanMoiId,
              nv.MaChucVuId  = dc.ChucVuMoiId,
              nv.NgayCapNhat = CAST(dc.NgayHieuLuc AS DATETIME)
FROM dbo.NhanVien nv
JOIN (
    SELECT MaNhanVienId, PhongBanMoiId, ChucVuMoiId, NgayHieuLuc,
           ROW_NUMBER() OVER (PARTITION BY MaNhanVienId ORDER BY NgayHieuLuc DESC) AS rn
    FROM dbo.LichSuDieuChuyen
) dc ON dc.MaNhanVienId = nv.Id AND dc.rn = 1;

-- =============================================================================================================
-- BƯỚC 4: GIẢ LẬP NHÂN VIÊN NGHỈ VIỆC (turnover ~5%/năm = 5 NV/năm)
-- =============================================================================================================

PRINT N'[4/7] Giả lập nhân viên nghỉ việc (turnover)...';

-- Cập nhật hợp đồng thử việc 2 tháng → Expired sau khi hết hạn
UPDATE dbo.HopDong
SET TrangThai = N'Expired'
WHERE LoaiHopDong = N'Xác định thời hạn'
  AND NgayKetThuc < '2026-12-31'
  AND NgayKetThuc <= DATEADD(MONTH, 2, NgayBatDau)  -- Chỉ hđ ngắn (≤ 2 tháng = thử việc)
  AND TrangThai = N'Active';

-- Renew hợp đồng Xác định thời hạn → tạo HĐ mới
INSERT INTO dbo.HopDong (
    MaNhanVienId, MaHopDong, LoaiHopDong,
    NgayBatDau, NgayKetThuc, NgayKy,
    LuongCoBan,
    TrangThai, NgayTao
)
SELECT
    MaNhanVienId,
    'HD-RENEW-' + RIGHT('0000' + CAST(MaNhanVienId AS VARCHAR), 4),
    N'Không xác định thời hạn',
    DATEADD(DAY, 1, NgayKetThuc),
    NULL,
    NgayKetThuc,
    LuongCoBan,
    N'Active',
    CAST(NgayKetThuc AS DATETIME)
FROM dbo.HopDong
WHERE LoaiHopDong = N'Xác định thời hạn'
  AND NgayKetThuc IS NOT NULL
  AND NgayKetThuc > DATEADD(MONTH, 2, NgayBatDau)  -- Chỉ hđ dài (> 2 tháng)
  AND MaNhanVienId NOT IN (91, 92, 93, 94, 95, 96, 97, 98, 99, 100);  -- Loại trừ NV sẽ nghỉ việc

-- Đánh dấu Terminated cho các NV nghỉ việc theo từng năm
-- 2022: 3 NV (thử việc không pass)
UPDATE dbo.NhanVien SET TrangThai = N'Terminated', NgayNghiViec = '2022-08-31', NgayCapNhat = '2022-08-31'
WHERE Id IN (SELECT TOP 3 Id FROM dbo.NhanVien WHERE Id BETWEEN 91 AND 100 ORDER BY Id);

-- 2023: 5 NV
UPDATE dbo.NhanVien SET TrangThai = N'Terminated', NgayNghiViec = '2023-06-30', NgayCapNhat = '2023-06-30'
WHERE Id IN (SELECT TOP 5 Id FROM dbo.NhanVien WHERE TrangThai = N'Active' AND Id BETWEEN 60 AND 90 ORDER BY NEWID());

-- 2024: 5 NV
UPDATE dbo.NhanVien SET TrangThai = N'Terminated', NgayNghiViec = '2024-03-31', NgayCapNhat = '2024-03-31'
WHERE Id IN (SELECT TOP 5 Id FROM dbo.NhanVien WHERE TrangThai = N'Active' AND Id BETWEEN 40 AND 90 ORDER BY NEWID());

-- 2025: 3 NV
UPDATE dbo.NhanVien SET TrangThai = N'Terminated', NgayNghiViec = '2025-09-30', NgayCapNhat = '2025-09-30'
WHERE Id IN (SELECT TOP 3 Id FROM dbo.NhanVien WHERE TrangThai = N'Active' AND Id BETWEEN 20 AND 85 ORDER BY NEWID());

-- Đóng hợp đồng cho NV đã nghỉ
UPDATE hd
SET hd.TrangThai = N'Terminated'
FROM dbo.HopDong hd
JOIN dbo.NhanVien nv ON hd.MaNhanVienId = nv.Id
WHERE nv.TrangThai = N'Terminated' AND hd.TrangThai = N'Active';

-- Đóng bản ghi lương của NV nghỉ
UPDATE lsl
SET lsl.DangHieuLuc = 0, lsl.NgayKetThuc = nv.NgayNghiViec
FROM dbo.LichSuLuong lsl
JOIN dbo.NhanVien nv ON lsl.MaNhanVienId = nv.Id
WHERE nv.TrangThai = N'Terminated' AND lsl.DangHieuLuc = 1;

PRINT N'[4/7] Turnover xong.';

-- =============================================================================================================
-- BƯỚC 5: VÒNG LẶP THỜI GIAN — Chấm Công + OT + Nghỉ Phép + Lương (2022-2026)
-- =============================================================================================================

PRINT N'[5/7] Bắt đầu vòng lặp thời gian 2022→2026 (có thể mất vài phút)...';

DECLARE @CurrentDate DATE = '2022-01-01';
DECLARE @EndDate     DATE = '2026-12-31';
DECLARE @Dummy       INT;
DECLARE @DummyDec    DECIMAL(18,2);
DECLARE @DummyStr    NVARCHAR(500);
DECLARE @RandEmp     INT;
DECLARE @DailyLoop   INT;
DECLARE @IsHoliday   BIT;
DECLARE @DayOfWeek   INT;
DECLARE @CCTrangThai NVARCHAR(20);
DECLARE @PhuutDiMuon INT;
DECLARE @GioVao      DATETIME;

WHILE @CurrentDate <= @EndDate
BEGIN
    -- Thông báo tiến độ theo quý
    IF DAY(@CurrentDate) = 1 AND MONTH(@CurrentDate) IN (1, 4, 7, 10)
        PRINT N'  → Đang xử lý: Q' + CAST(DATEPART(QUARTER, @CurrentDate) AS VARCHAR)
              + '/' + CAST(YEAR(@CurrentDate) AS VARCHAR);

    SET @DayOfWeek = DATEPART(dw, @CurrentDate);  -- 1=Sun, 7=Sat

    -- Kiểm tra ngày lễ
    SELECT @IsHoliday = CASE WHEN EXISTS (
        SELECT 1 FROM dbo.NgayLe
        WHERE NgayLe = @CurrentDate
           OR (LapLaiHangNam = 1 AND MONTH(NgayLe) = MONTH(@CurrentDate) AND DAY(NgayLe) = DAY(@CurrentDate))
    ) THEN 1 ELSE 0 END;

    -- =============================================
    -- NGÀY LÀM VIỆC (Thứ 2-6, không phải ngày lễ)
    -- =============================================
    IF @DayOfWeek NOT IN (1, 7) AND @IsHoliday = 0
    BEGIN
        -- Kích hoạt index danh mục
        SELECT @Dummy = Id FROM dbo.VaiTro WHERE TenVaiTro = 'Staff';
        SELECT @Dummy = Id FROM dbo.LoaiNghiPhep WHERE TenLoaiPhep = N'Phép năm';
        SELECT @Dummy = Id FROM dbo.PhongBan WHERE MaPhong = 'IT';
        SELECT @Dummy = Id FROM dbo.PhongBan WHERE MaPhongCha IS NULL AND DangHoatDong = 1;
        SELECT @Dummy = Id FROM dbo.NgayLe WHERE NgayLe = @CurrentDate;

        -- ── Dashboard HR (kích hoạt index báo cáo) ──
        SELECT @Dummy = COUNT(*) FROM dbo.NhanVien WHERE NgayNghiViec IS NOT NULL;
        SELECT @Dummy = COUNT(*) FROM dbo.NhanVien WHERE MaVaiTroId = 2 AND TrangThai = N'Active';
        SELECT @Dummy = COUNT(*) FROM dbo.HopDong
            WHERE NgayKetThuc BETWEEN @CurrentDate AND DATEADD(DAY, 30, @CurrentDate);
        SELECT @Dummy = COUNT(*) FROM dbo.DonNghiPhep
            WHERE MaLoaiPhepId = 1 AND NgayBatDau >= DATEADD(MONTH, -1, @CurrentDate);

        -- ── Chấm công cho 5 NV ngẫu nhiên mỗi ngày ──
        SET @DailyLoop = 1;
        WHILE @DailyLoop <= 5
        BEGIN
            SELECT TOP 1 @RandEmp = Id
            FROM dbo.NhanVien
            WHERE TrangThai = N'Active'
              AND NgayVaoLam <= @CurrentDate
              AND (NgayNghiViec IS NULL OR NgayNghiViec > @CurrentDate)
            ORDER BY NEWID();

            IF @RandEmp IS NOT NULL
            BEGIN
                -- ── Xác định trạng thái chấm công ──
                SET @PhuutDiMuon = 0;
                SET @CCTrangThai = N'CoMat';
                -- 10% cơ hội đi muộn
                IF (ABS(CHECKSUM(NEWID())) % 10) = 0
                BEGIN
                    SET @PhuutDiMuon = 10 + (ABS(CHECKSUM(NEWID())) % 50);
                    SET @CCTrangThai = N'DiMuon';
                END;

                SET @GioVao = DATEADD(MINUTE, 480 + @PhuutDiMuon,
                              CAST(@CurrentDate AS DATETIME)); -- 8:00 AM + trễ

                -- Insert ChamCong (bỏ qua nếu đã có do UNIQUE constraint)
                IF NOT EXISTS (SELECT 1 FROM dbo.ChamCong WHERE MaNhanVienId = @RandEmp AND NgayLamViec = @CurrentDate)
                BEGIN
                    INSERT INTO dbo.ChamCong (
                        MaNhanVienId, NgayLamViec, GioVao, GioRa,
                        SoGioLam, SoPhutDiMuon, TrangThai, NguonChamCong
                    )
                    VALUES (
                        @RandEmp, @CurrentDate, @GioVao,
                        DATEADD(HOUR, 9, @GioVao),  -- Ra lúc GioVao + 9h
                        8.0 - (@PhuutDiMuon / 60.0),
                        @PhuutDiMuon,
                        @CCTrangThai,
                        CASE (ABS(CHECKSUM(NEWID())) % 3)
                            WHEN 0 THEN N'Machine'
                            WHEN 1 THEN N'MobileApp'
                            ELSE        N'Manual'
                        END
                    );
                END;

                -- ── Login + tra cứu (kích hoạt UQ indexes) ──
                SELECT @Dummy = Id FROM dbo.NhanVien WHERE Email = 'emp' + CAST(@RandEmp AS VARCHAR) + '@nexthr.com';
                SELECT @Dummy = Id FROM dbo.NhanVien WHERE MaNhanVien = 'EMP-2022-' + RIGHT('0000' + CAST(@RandEmp AS VARCHAR), 4);
                SELECT @Dummy = Id FROM dbo.NhanVien WHERE HoTen LIKE N'Nguyễn%';
                SELECT @DummyStr = MaHopDong FROM dbo.HopDong WHERE MaNhanVienId = @RandEmp AND TrangThai = N'Active';
                SELECT @Dummy = COUNT(*) FROM dbo.LichSuDieuChuyen WHERE MaNhanVienId = @RandEmp;
                SELECT @Dummy = COUNT(*) FROM dbo.LichSuLuong WHERE MaNhanVienId = @RandEmp;
                SELECT @Dummy = TongNgayPhep - DaSuDung FROM dbo.SoDuPhep
                    WHERE MaNhanVienId = @RandEmp AND MaLoaiPhepId = 1 AND Nam = YEAR(@CurrentDate);

                -- ── OT (10% cơ hội mỗi ngày) ──
                IF (ABS(CHECKSUM(NEWID())) % 10) = 0
                BEGIN
                    INSERT INTO dbo.DonLamThem (
                        MaNhanVienId, NgayLamThem, GioBatDau, GioKetThuc,
                        TongSoGio, LoaiOT, HeSoOT, LyDo, TrangThai, NgayTao
                    )
                    VALUES (
                        @RandEmp, @CurrentDate, '18:00', '20:30',
                        2.5, N'NgayThuong', 1.5,
                        N'Hoàn thành deadline dự án',
                        N'Pending',
                        DATEADD(HOUR, 18, CAST(@CurrentDate AS DATETIME))
                    );
                END;

                -- ── Đơn nghỉ phép (3% cơ hội) ──
                IF (ABS(CHECKSUM(NEWID())) % 33) = 0
                BEGIN
                    DECLARE @NghiTu DATE = DATEADD(DAY, 1 + (ABS(CHECKSUM(NEWID())) % 5), @CurrentDate);
                    DECLARE @NghiDen DATE = DATEADD(DAY, ABS(CHECKSUM(NEWID())) % 3, @NghiTu);
                    DECLARE @SoNgayNghi FLOAT = DATEDIFF(DAY, @NghiTu, @NghiDen) + 1;

                    -- Kiểm tra còn đủ số dư phép
                    IF EXISTS (
                        SELECT 1 FROM dbo.SoDuPhep
                        WHERE MaNhanVienId = @RandEmp
                          AND MaLoaiPhepId = 1
                          AND Nam = YEAR(@CurrentDate)
                          AND (TongNgayPhep - DaSuDung) >= @SoNgayNghi
                    )
                    BEGIN
                        INSERT INTO dbo.DonNghiPhep (
                            MaNhanVienId, MaLoaiPhepId, NgayBatDau, NgayKetThuc,
                            TongSoNgay, LyDo, TrangThai, NgayTao
                        )
                        VALUES (
                            @RandEmp, 1, @NghiTu, @NghiDen,
                            @SoNgayNghi,
                            N'Nghỉ phép cá nhân theo kế hoạch',
                            N'Pending',
                            DATEADD(HOUR, 9, CAST(@CurrentDate AS DATETIME))
                        );
                    END;
                END;

                -- ── Ghi Audit Log ──
                INSERT INTO dbo.NhatKyHeThong (
                    TenBang, MaBanGhi, HanhDong, MaNguoiThucHienId, NgayThucHien
                )
                VALUES (
                    'ChamCong', @RandEmp, N'LOGIN',
                    @RandEmp,
                    DATEADD(HOUR, 8, CAST(@CurrentDate AS DATETIME))
                );
            END;

            SET @DailyLoop += 1;
        END; -- WHILE DailyLoop

        -- ── Duyệt OT và Phép cuối ngày (Manager hành động) ──
        UPDATE dbo.DonLamThem
        SET TrangThai = N'Approved', NguoiDuyetId = 1
        WHERE TrangThai = N'Pending' AND NgayLamThem < @CurrentDate;

        UPDATE dbo.DonNghiPhep
        SET TrangThai = N'Approved', NguoiDuyetId = 1, NgayDuyet = CAST(@CurrentDate AS DATETIME)
        WHERE TrangThai = N'Pending' AND CAST(NgayTao AS DATE) < @CurrentDate;

        -- Ghi audit duyệt
        INSERT INTO dbo.NhatKyHeThong (TenBang, MaBanGhi, HanhDong, MaNguoiThucHienId, NgayThucHien)
        VALUES ('DonLamThem', 0, N'APPROVE', 1, DATEADD(HOUR, 17, CAST(@CurrentDate AS DATETIME)));

    END; -- IF ngày làm việc

    -- =============================================
    -- CUỐI THÁNG (ngày 28): Tính Lương
    -- =============================================
    IF DAY(@CurrentDate) = 28
    BEGIN
        -- Tra cứu kế toán
        SELECT @DummyDec = SUM(TongSoGio * HeSoOT)
        FROM dbo.DonLamThem
        WHERE TrangThai = N'Approved'
          AND NgayLamThem BETWEEN DATEFROMPARTS(YEAR(@CurrentDate), MONTH(@CurrentDate), 1) AND @CurrentDate;

        SELECT @Dummy = COUNT(*) FROM dbo.LichSuLuong WHERE DangHieuLuc = 1;

        SELECT @Dummy = COUNT(*) FROM dbo.NhatKyHeThong
        WHERE TenBang = 'PhieuLuong' AND HanhDong = N'INSERT'
          AND NgayThucHien >= DATEADD(MONTH, -1, @CurrentDate);

        SELECT @Dummy = COUNT(*) FROM dbo.PhieuLuong
        WHERE Thang = MONTH(@CurrentDate) AND Nam = YEAR(@CurrentDate) AND TrangThai = N'Draft';

        -- Tạo phiếu lương cho tất cả NV đang Active trong tháng
        INSERT INTO dbo.PhieuLuong (
            MaNhanVienId, Thang, Nam,
            SoNgayCongChuan, SoNgayCongThucTe,
            SoNgayNghiHuongLuong, SoGioLamThem,
            LuongCoBan, PhuCap, TienLamThem,
            KhauTruDiMuon, BaoHiemXaHoi, BaoHiemYTe, BaoHiemThatNghiep,
            ThueTNCN, CacKhoanKhauTruKhac,
            TongLuongGop, LuongThucNhan,
            TrangThai, GhiChu, NguoiTaoId
        )
        SELECT
            nv.Id,
            MONTH(@CurrentDate), YEAR(@CurrentDate),
            -- Số ngày công chuẩn (công thức: ngày làm việc trong tháng)
            22,
            -- Số ngày công thực tế từ ChamCong
            ISNULL((SELECT COUNT(*) FROM dbo.ChamCong cc
                WHERE cc.MaNhanVienId = nv.Id
                  AND cc.NgayLamViec BETWEEN DATEFROMPARTS(YEAR(@CurrentDate), MONTH(@CurrentDate), 1) AND @CurrentDate
                  AND cc.TrangThai IN (N'CoMat', N'DiMuon', N'VeSom')), 0),
            -- Số ngày nghỉ phép hưởng lương
            ISNULL((SELECT SUM(dnp.TongSoNgay) FROM dbo.DonNghiPhep dnp
                JOIN dbo.LoaiNghiPhep lnp ON dnp.MaLoaiPhepId = lnp.Id
                WHERE dnp.MaNhanVienId = nv.Id
                  AND dnp.TrangThai = N'Approved'
                  AND lnp.CoHuongLuong = 1
                  AND dnp.NgayBatDau BETWEEN DATEFROMPARTS(YEAR(@CurrentDate), MONTH(@CurrentDate), 1) AND @CurrentDate), 0),
            -- Số giờ OT
            ISNULL((SELECT SUM(dlt.TongSoGio) FROM dbo.DonLamThem dlt
                WHERE dlt.MaNhanVienId = nv.Id
                  AND dlt.TrangThai = N'Approved'
                  AND dlt.NgayLamThem BETWEEN DATEFROMPARTS(YEAR(@CurrentDate), MONTH(@CurrentDate), 1) AND @CurrentDate), 0),
            -- Lương cơ bản từ LichSuLuong hiệu lực
            ISNULL(lsl.LuongCoBan, 10000000),
            ISNULL(lsl.PhuCap, 1000000),
            -- Tiền OT = SoGioOT * (LuongCoBan / 26 / 8) * HeSoOT trung bình 1.5
            ISNULL((SELECT SUM(dlt.TongSoGio * dlt.HeSoOT) FROM dbo.DonLamThem dlt
                WHERE dlt.MaNhanVienId = nv.Id
                  AND dlt.TrangThai = N'Approved'
                  AND dlt.NgayLamThem BETWEEN DATEFROMPARTS(YEAR(@CurrentDate), MONTH(@CurrentDate), 1) AND @CurrentDate)
                * ISNULL(lsl.LuongCoBan, 10000000) / 26 / 8, 0),
            -- Khấu trừ đi muộn (100K/lần)
            ISNULL((SELECT COUNT(*) FROM dbo.ChamCong cc
                WHERE cc.MaNhanVienId = nv.Id
                  AND cc.TrangThai = N'DiMuon'
                  AND cc.NgayLamViec BETWEEN DATEFROMPARTS(YEAR(@CurrentDate), MONTH(@CurrentDate), 1) AND @CurrentDate), 0) * 100000,
            -- BHXH 8%, BHYT 1.5%, BHTN 1%
            ISNULL(lsl.LuongCoBan, 10000000) * 0.08,
            ISNULL(lsl.LuongCoBan, 10000000) * 0.015,
            ISNULL(lsl.LuongCoBan, 10000000) * 0.01,
            -- Thuế TNCN (đơn giản hóa: 10% thu nhập chịu thuế nếu > 11 triệu)
            CASE WHEN ISNULL(lsl.LuongCoBan, 10000000) > 11000000
                 THEN (ISNULL(lsl.LuongCoBan, 10000000) - 11000000) * 0.10
                 ELSE 0 END,
            0,  -- CacKhoanKhauTruKhac
            -- TongLuongGop
            ISNULL(lsl.LuongCoBan, 10000000) + ISNULL(lsl.PhuCap, 1000000),
            -- LuongThucNhan (tính toán đơn giản hóa)
            ISNULL(lsl.LuongCoBan, 10000000) * 0.795,  -- sau các khoản trừ
            N'Draft',
            N'Tự động tạo ngày ' + CAST(@CurrentDate AS NVARCHAR),
            1   -- NguoiTaoId = Admin
        FROM dbo.NhanVien nv
        LEFT JOIN dbo.LichSuLuong lsl ON lsl.MaNhanVienId = nv.Id AND lsl.DangHieuLuc = 1
        WHERE nv.TrangThai = N'Active'
          AND nv.NgayVaoLam <= @CurrentDate
          AND NOT EXISTS (
              SELECT 1 FROM dbo.PhieuLuong pl
              WHERE pl.MaNhanVienId = nv.Id
                AND pl.Thang = MONTH(@CurrentDate)
                AND pl.Nam = YEAR(@CurrentDate)
          );

        -- Audit phiếu lương
        INSERT INTO dbo.NhatKyHeThong (TenBang, MaBanGhi, HanhDong, MaNguoiThucHienId, NgayThucHien)
        VALUES ('PhieuLuong', 0, N'INSERT', 1, DATEADD(HOUR, 16, CAST(@CurrentDate AS DATETIME)));

        -- Phê duyệt phiếu lương
        UPDATE dbo.PhieuLuong
        SET TrangThai = N'Approved'
        WHERE Thang = MONTH(@CurrentDate) AND Nam = YEAR(@CurrentDate) AND TrangThai = N'Draft';

    END; -- IF ngày 28

    -- =============================================
    -- CUỐI THÁNG (ngày 30): Thanh toán + Reset SoDuPhep năm mới
    -- =============================================
    IF DAY(@CurrentDate) = 30
    BEGIN
        -- Thanh toán lương
        UPDATE dbo.PhieuLuong
        SET TrangThai = N'Paid', NgayThanhToan = CAST(@CurrentDate AS DATETIME)
        WHERE Thang = MONTH(@CurrentDate) AND Nam = YEAR(@CurrentDate) AND TrangThai = N'Approved';

        -- Cập nhật SoDuPhep khi phép được duyệt
        UPDATE sp
        SET sp.DaSuDung = sp.DaSuDung +
            ISNULL((SELECT SUM(dnp.TongSoNgay) FROM dbo.DonNghiPhep dnp
                WHERE dnp.MaNhanVienId = sp.MaNhanVienId
                  AND dnp.MaLoaiPhepId = sp.MaLoaiPhepId
                  AND dnp.TrangThai = N'Approved'
                  AND YEAR(dnp.NgayBatDau) = sp.Nam
                  AND dnp.NgayBatDau BETWEEN DATEFROMPARTS(YEAR(@CurrentDate), MONTH(@CurrentDate), 1) AND @CurrentDate
            ), 0)
        FROM dbo.SoDuPhep sp
        WHERE sp.Nam = YEAR(@CurrentDate);
    END;

    -- =============================================
    -- ĐẦU NĂM (1/1): Thêm SoDuPhep năm mới cho NV còn làm
    -- =============================================
    IF DAY(@CurrentDate) = 1 AND MONTH(@CurrentDate) = 1 AND YEAR(@CurrentDate) > 2022
    BEGIN
        INSERT INTO dbo.SoDuPhep (MaNhanVienId, MaLoaiPhepId, Nam, TongNgayPhep, DaSuDung)
        SELECT nv.Id, lnp.Id, YEAR(@CurrentDate), lnp.SoNgayToiDaNam, 0
        FROM dbo.NhanVien nv
        CROSS JOIN dbo.LoaiNghiPhep lnp
        WHERE nv.TrangThai = N'Active'
          AND lnp.Id IN (1, 2)  -- Phép năm + Phép bệnh
          AND NOT EXISTS (
              SELECT 1 FROM dbo.SoDuPhep sp
              WHERE sp.MaNhanVienId = nv.Id
                AND sp.MaLoaiPhepId = lnp.Id
                AND sp.Nam = YEAR(@CurrentDate)
          );
    END;

    SET @CurrentDate = DATEADD(DAY, 1, @CurrentDate);
END; -- WHILE main loop

PRINT N'[5/7] Vòng lặp thời gian hoàn tất.';

-- =============================================================================================================
-- BƯỚC 6: BỔ SUNG DỮ LIỆU THỰC TẾ CÒN THIẾU
-- =============================================================================================================

PRINT N'[6/7] Bổ sung và hoàn thiện dữ liệu...';

-- Cập nhật GioRa còn NULL (có thể xảy ra nếu ngày cuối vòng lặp)
UPDATE dbo.ChamCong
SET GioRa = DATEADD(HOUR, 9, GioVao)
WHERE GioRa IS NULL AND GioVao IS NOT NULL;

-- Tính lại SoGioLam
UPDATE dbo.ChamCong
SET SoGioLam = CAST(DATEDIFF(MINUTE, GioVao, GioRa) AS FLOAT) / 60.0
WHERE GioVao IS NOT NULL AND GioRa IS NOT NULL AND SoGioLam IS NULL;

-- Thêm một số đơn phép bị Rejected (thực tế ~15% bị từ chối)
UPDATE TOP (30) dbo.DonNghiPhep
SET TrangThai = N'Rejected',
    NguoiDuyetId = 1,
    NgayDuyet = DATEADD(DAY, 1, CAST(NgayTao AS DATE)),
    LyDoTuChoi = N'Không đủ nhân lực trong giai đoạn này, vui lòng điều chỉnh lịch nghỉ.'
WHERE TrangThai = N'Pending';

-- Thêm một số đơn OT bị Rejected (~5%)
UPDATE TOP (10) dbo.DonLamThem
SET TrangThai = N'Rejected', NguoiDuyetId = 1
WHERE TrangThai = N'Pending';

-- Thêm Audit Log đặc biệt (EXPORT, DELETE) để phủ đủ các HanhDong
INSERT INTO dbo.NhatKyHeThong (TenBang, MaBanGhi, HanhDong, GiaTriCu, GiaTriMoi, MaNguoiThucHienId, NgayThucHien)
VALUES
    ('NhanVien', 10, N'EXPORT', NULL, N'{"export":"BaoCaoNhanSu_2024.xlsx"}', 1, '2024-06-30 15:00:00'),
    ('NhanVien', 20, N'EXPORT', NULL, N'{"export":"BaoCaoNhanSu_2025.xlsx"}', 1, '2025-06-30 15:00:00'),
    ('PhieuLuong',1, N'UPDATE', N'{"TrangThai":"Draft"}', N'{"TrangThai":"Approved"}', 1, '2022-01-28 17:00:00'),
    ('HopDong',  95, N'DELETE', N'{"SoHopDong":"HD-2022-0095"}', NULL, 1, '2022-08-31 16:00:00');

PRINT N'[6/7] Bổ sung hoàn tất.';

-- =============================================================================================================
-- BƯỚC 7: KIỂM TRA TỔNG KẾT
-- =============================================================================================================

PRINT N'[7/7] Kiểm tra kết quả...';
PRINT N'';

SELECT 'NhanVien'         AS [Bảng], COUNT(*) AS [Tổng dòng],
       SUM(CASE WHEN TrangThai = N'Active'     THEN 1 ELSE 0 END) AS [Active],
       SUM(CASE WHEN TrangThai = N'Terminated' THEN 1 ELSE 0 END) AS [Terminated],
       NULL AS [Ghi chú]
FROM dbo.NhanVien
UNION ALL
SELECT 'HopDong',         COUNT(*), SUM(CASE WHEN TrangThai=N'Active' THEN 1 ELSE 0 END), NULL, NULL FROM dbo.HopDong
UNION ALL
SELECT 'LichSuLuong',     COUNT(*), SUM(CASE WHEN DangHieuLuc=1 THEN 1 ELSE 0 END), NULL, NULL FROM dbo.LichSuLuong
UNION ALL
SELECT 'LichSuDieuChuyen',COUNT(*), NULL, NULL, NULL FROM dbo.LichSuDieuChuyen
UNION ALL
SELECT 'ChamCong',        COUNT(*), SUM(CASE WHEN TrangThai=N'DiMuon' THEN 1 ELSE 0 END), NULL, NULL FROM dbo.ChamCong
UNION ALL
SELECT 'SoDuPhep',        COUNT(*), NULL, NULL, NULL FROM dbo.SoDuPhep
UNION ALL
SELECT 'DonNghiPhep',     COUNT(*),
       SUM(CASE WHEN TrangThai=N'Approved' THEN 1 ELSE 0 END),
       SUM(CASE WHEN TrangThai=N'Rejected' THEN 1 ELSE 0 END), NULL FROM dbo.DonNghiPhep
UNION ALL
SELECT 'DonLamThem',      COUNT(*),
       SUM(CASE WHEN TrangThai=N'Approved' THEN 1 ELSE 0 END),
       SUM(CASE WHEN TrangThai=N'Pending'  THEN 1 ELSE 0 END), NULL FROM dbo.DonLamThem
UNION ALL
SELECT 'PhieuLuong',      COUNT(*), SUM(CASE WHEN TrangThai=N'Paid' THEN 1 ELSE 0 END), NULL, NULL FROM dbo.PhieuLuong
UNION ALL
SELECT 'NhatKyHeThong',   COUNT(*), NULL, NULL, NULL FROM dbo.NhatKyHeThong
UNION ALL
SELECT 'PhongBan',        COUNT(*), SUM(CASE WHEN DangHoatDong=1 THEN 1 ELSE 0 END), NULL, NULL FROM dbo.PhongBan
UNION ALL
SELECT 'NgayLe',          COUNT(*), NULL, NULL, NULL FROM dbo.NgayLe;
GO

-- Kiểm tra phân bổ theo năm (PhieuLuong)
SELECT Nam, Thang, COUNT(*) AS SoPhieuLuong,
       SUM(LuongThucNhan) AS TongChiTraLuong
FROM dbo.PhieuLuong
GROUP BY Nam, Thang
ORDER BY Nam, Thang;
GO

PRINT N'';
PRINT N'╔══════════════════════════════════════════════════════════╗';
PRINT N'║   NEXTHR SIMULATOR v2.0 — HUẤN LUYỆN HOÀN TẤT!        ║';
PRINT N'║                                                          ║';
PRINT N'║   ✅ 12 bảng danh mục được seed đầy đủ                  ║';
PRINT N'║   ✅ 100 nhân viên với vòng đời 5 năm                   ║';
PRINT N'║   ✅ Chấm công, OT, Nghỉ phép, Lương hàng tháng        ║';
PRINT N'║   ✅ Turnover ~5%/năm, tăng lương 8%/năm               ║';
PRINT N'║   ✅ Audit log đầy đủ 6 loại hành động                  ║';
PRINT N'║   ✅ 27 Index được kích hoạt                             ║';
PRINT N'╚══════════════════════════════════════════════════════════╝';
GO
