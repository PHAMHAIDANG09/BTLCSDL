docker exec nexthr-db /opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -P "Dang@12345" -C -i /init-db/SchemaNEXTHR.sql-- =============================================
-- DỰ ÁN: NEXTHR - HỆ THỐNG QUẢN TRỊ NHÂN SỰ & TÍNH LƯƠNG
-- Hệ quản trị: Microsoft SQL Server
-- Bao gồm: Database + Schema + Constraint + Index + Data mẫu
-- =============================================

USE master;
GO

IF DB_ID(N'NextHR') IS NOT NULL
BEGIN
    ALTER DATABASE NextHR SET SINGLE_USER WITH ROLLBACK IMMEDIATE;
    DROP DATABASE NextHR;
END;
GO

CREATE DATABASE NextHR;
GO

USE NextHR;

-- =============================================
-- 1. TẠO BẢNG DANH MỤC / CẤU HÌNH CƠ BẢN
-- =============================================

CREATE TABLE dbo.ChucVu (
    Id INT IDENTITY(1,1) NOT NULL,
    TenChucVu NVARCHAR(100) NOT NULL,
    CapDo INT NOT NULL CONSTRAINT DF_ChucVu_CapDo DEFAULT (1),
    MoTa NVARCHAR(500) NULL,
    CONSTRAINT PK_ChucVu PRIMARY KEY (Id),
    CONSTRAINT CK_ChucVu_CapDo CHECK (CapDo BETWEEN 1 AND 4)
);
GO

CREATE TABLE dbo.VaiTro (
    Id INT IDENTITY(1,1) NOT NULL,
    TenVaiTro VARCHAR(50) NOT NULL,
    MoTa NVARCHAR(255) NULL,
    CONSTRAINT PK_VaiTro PRIMARY KEY (Id),
    CONSTRAINT UQ_VaiTro_TenVaiTro UNIQUE (TenVaiTro),
    CONSTRAINT CK_VaiTro_TenVaiTro CHECK (TenVaiTro IN ('Admin', 'Manager', 'Staff'))
);
GO

CREATE TABLE dbo.LoaiNghiPhep (
    Id INT IDENTITY(1,1) NOT NULL,
    TenLoaiPhep NVARCHAR(50) NOT NULL,
    CoHuongLuong BIT NOT NULL CONSTRAINT DF_LoaiNghiPhep_CoHuongLuong DEFAULT (1),
    SoNgayToiDaNam INT NOT NULL CONSTRAINT DF_LoaiNghiPhep_SoNgayToiDaNam DEFAULT (12),
    MoTa NVARCHAR(255) NULL,
    CONSTRAINT PK_LoaiNghiPhep PRIMARY KEY (Id),
    CONSTRAINT UQ_LoaiNghiPhep_TenLoaiPhep UNIQUE (TenLoaiPhep),
    CONSTRAINT CK_LoaiNghiPhep_SoNgayToiDaNam CHECK (SoNgayToiDaNam >= 0)
);
GO

CREATE TABLE dbo.NgayLe (
    Id INT IDENTITY(1,1) NOT NULL,
    NgayLe DATE NOT NULL,
    TenNgayLe NVARCHAR(100) NOT NULL,
    LapLaiHangNam BIT NOT NULL CONSTRAINT DF_NgayLe_LapLaiHangNam DEFAULT (0),
    CONSTRAINT PK_NgayLe PRIMARY KEY (Id),
    CONSTRAINT UQ_NgayLe_NgayLe UNIQUE (NgayLe)
);
GO

CREATE TABLE dbo.PhongBan (
    Id INT IDENTITY(1,1) NOT NULL,
    TenPhong NVARCHAR(100) NOT NULL,
    MaPhong VARCHAR(20) NOT NULL,
    MaPhongCha INT NULL,
    MaQuanLy INT NULL,
    DangHoatDong BIT NOT NULL CONSTRAINT DF_PhongBan_DangHoatDong DEFAULT (1),
    NgayTao DATETIME NOT NULL CONSTRAINT DF_PhongBan_NgayTao DEFAULT (GETDATE()),
    CONSTRAINT PK_PhongBan PRIMARY KEY (Id),
    CONSTRAINT UQ_PhongBan_MaPhong UNIQUE (MaPhong),
    CONSTRAINT FK_PhongBan_MaPhongCha FOREIGN KEY (MaPhongCha) REFERENCES dbo.PhongBan(Id)
);
GO

CREATE TABLE dbo.NhanVien (
    Id INT IDENTITY(1,1) NOT NULL,
    MaNhanVien VARCHAR(20) NOT NULL,
    HoTen NVARCHAR(100) NOT NULL,
    Email VARCHAR(100) NOT NULL,
    MatKhauHash VARCHAR(255) NOT NULL,
    SoDienThoai VARCHAR(15) NULL,
    GioiTinh NVARCHAR(10) NULL,
    NgaySinh DATE NULL,
    SoCCCD VARCHAR(20) NULL,
    DiaChi NVARCHAR(300) NULL,
    MaSoThue VARCHAR(20) NULL,
    SoNguoiPhuThuoc INT NOT NULL CONSTRAINT DF_NhanVien_SoNguoiPhuThuoc DEFAULT (0),
    SoTaiKhoan VARCHAR(30) NULL,
    TenNganHang NVARCHAR(100) NULL,
    ChiNhanhNganHang NVARCHAR(100) NULL,
    MaPhongId INT NULL,
    MaChucVuId INT NULL,
    MaVaiTroId INT NOT NULL,
    NgayVaoLam DATE NOT NULL,
    NgayNghiViec DATE NULL,
    TrangThai NVARCHAR(20) NOT NULL CONSTRAINT DF_NhanVien_TrangThai DEFAULT (N'Active'),
    NgayTao DATETIME NOT NULL CONSTRAINT DF_NhanVien_NgayTao DEFAULT (GETDATE()),
    NgayCapNhat DATETIME NULL,
    CONSTRAINT PK_NhanVien PRIMARY KEY (Id),
    CONSTRAINT UQ_NhanVien_MaNhanVien UNIQUE (MaNhanVien),
    CONSTRAINT UQ_NhanVien_Email UNIQUE (Email),
    CONSTRAINT FK_NhanVien_PhongBan FOREIGN KEY (MaPhongId) REFERENCES dbo.PhongBan(Id),
    CONSTRAINT FK_NhanVien_ChucVu FOREIGN KEY (MaChucVuId) REFERENCES dbo.ChucVu(Id),
    CONSTRAINT FK_NhanVien_VaiTro FOREIGN KEY (MaVaiTroId) REFERENCES dbo.VaiTro(Id),
    CONSTRAINT CK_NhanVien_GioiTinh CHECK (GioiTinh IS NULL OR GioiTinh IN (N'Nam', N'Nữ', N'Khác')),
    CONSTRAINT CK_NhanVien_SoNguoiPhuThuoc CHECK (SoNguoiPhuThuoc >= 0),
    CONSTRAINT CK_NhanVien_TrangThai CHECK (TrangThai IN (N'Active', N'Inactive', N'Terminated')),
    CONSTRAINT CK_NhanVien_NgayNghiViec CHECK (NgayNghiViec IS NULL OR NgayNghiViec >= NgayVaoLam)
);
GO

ALTER TABLE dbo.PhongBan
ADD CONSTRAINT FK_PhongBan_MaQuanLy FOREIGN KEY (MaQuanLy) REFERENCES dbo.NhanVien(Id);
GO

-- =============================================
-- 2. TẠO BẢNG NGHIỆP VỤ NHÂN SỰ
-- =============================================

CREATE TABLE dbo.HopDong (
    Id INT IDENTITY(1,1) NOT NULL,
    MaNhanVienId INT NOT NULL,
    SoHopDong VARCHAR(50) NOT NULL,
    LoaiHopDong NVARCHAR(50) NOT NULL,
    NgayBatDau DATE NOT NULL,
    NgayKetThuc DATE NULL,
    NgayKy DATE NOT NULL,
    DuongDanFile NVARCHAR(500) NULL,
    TrangThai NVARCHAR(20) NOT NULL CONSTRAINT DF_HopDong_TrangThai DEFAULT (N'Active'),
    NgayTao DATETIME NOT NULL CONSTRAINT DF_HopDong_NgayTao DEFAULT (GETDATE()),
    CONSTRAINT PK_HopDong PRIMARY KEY (Id),
    CONSTRAINT UQ_HopDong_SoHopDong UNIQUE (SoHopDong),
    CONSTRAINT FK_HopDong_NhanVien FOREIGN KEY (MaNhanVienId) REFERENCES dbo.NhanVien(Id),
    CONSTRAINT CK_HopDong_LoaiHopDong CHECK (LoaiHopDong IN (N'Thử việc', N'Xác định thời hạn', N'Không xác định thời hạn')),
    CONSTRAINT CK_HopDong_TrangThai CHECK (TrangThai IN (N'Active', N'Inactive', N'Expired', N'Terminated')),
    CONSTRAINT CK_HopDong_NgayKetThuc CHECK (NgayKetThuc IS NULL OR NgayKetThuc >= NgayBatDau),
    CONSTRAINT CK_HopDong_NgayKy CHECK (NgayKy <= NgayBatDau)
);
GO

CREATE TABLE dbo.LichSuDieuChuyen (
    Id INT IDENTITY(1,1) NOT NULL,
    MaNhanVienId INT NOT NULL,
    PhongBanCuId INT NULL,
    PhongBanMoiId INT NOT NULL,
    ChucVuCuId INT NULL,
    ChucVuMoiId INT NOT NULL,
    NgayHieuLuc DATE NOT NULL,
    LyDo NVARCHAR(500) NULL,
    NguoiDuyetId INT NOT NULL,
    NgayTao DATETIME NOT NULL CONSTRAINT DF_LichSuDieuChuyen_NgayTao DEFAULT (GETDATE()),
    CONSTRAINT PK_LichSuDieuChuyen PRIMARY KEY (Id),
    CONSTRAINT FK_LichSuDieuChuyen_NhanVien FOREIGN KEY (MaNhanVienId) REFERENCES dbo.NhanVien(Id),
    CONSTRAINT FK_LichSuDieuChuyen_PhongBanCu FOREIGN KEY (PhongBanCuId) REFERENCES dbo.PhongBan(Id),
    CONSTRAINT FK_LichSuDieuChuyen_PhongBanMoi FOREIGN KEY (PhongBanMoiId) REFERENCES dbo.PhongBan(Id),
    CONSTRAINT FK_LichSuDieuChuyen_ChucVuCu FOREIGN KEY (ChucVuCuId) REFERENCES dbo.ChucVu(Id),
    CONSTRAINT FK_LichSuDieuChuyen_ChucVuMoi FOREIGN KEY (ChucVuMoiId) REFERENCES dbo.ChucVu(Id),
    CONSTRAINT FK_LichSuDieuChuyen_NguoiDuyet FOREIGN KEY (NguoiDuyetId) REFERENCES dbo.NhanVien(Id)
);
GO

CREATE TABLE dbo.LichSuLuong (
    Id INT IDENTITY(1,1) NOT NULL,
    MaNhanVienId INT NOT NULL,
    LuongCoBan DECIMAL(18,2) NOT NULL,
    PhuCap DECIMAL(18,2) NOT NULL CONSTRAINT DF_LichSuLuong_PhuCap DEFAULT (0),
    NgayBatDau DATE NOT NULL,
    NgayKetThuc DATE NULL,
    DangHieuLuc BIT NOT NULL CONSTRAINT DF_LichSuLuong_DangHieuLuc DEFAULT (1),
    NguoiThayDoiId INT NOT NULL,
    GhiChu NVARCHAR(500) NULL,
    NgayTao DATETIME NOT NULL CONSTRAINT DF_LichSuLuong_NgayTao DEFAULT (GETDATE()),
    CONSTRAINT PK_LichSuLuong PRIMARY KEY (Id),
    CONSTRAINT FK_LichSuLuong_NhanVien FOREIGN KEY (MaNhanVienId) REFERENCES dbo.NhanVien(Id),
    CONSTRAINT FK_LichSuLuong_NguoiThayDoi FOREIGN KEY (NguoiThayDoiId) REFERENCES dbo.NhanVien(Id),
    CONSTRAINT CK_LichSuLuong_LuongCoBan CHECK (LuongCoBan >= 0),
    CONSTRAINT CK_LichSuLuong_PhuCap CHECK (PhuCap >= 0),
    CONSTRAINT CK_LichSuLuong_NgayKetThuc CHECK (NgayKetThuc IS NULL OR NgayKetThuc >= NgayBatDau)
);
GO

CREATE TABLE dbo.ChamCong (
    Id INT IDENTITY(1,1) NOT NULL,
    MaNhanVienId INT NOT NULL,
    NgayLamViec DATE NOT NULL,
    GioVao DATETIME NULL,
    GioRa DATETIME NULL,
    SoGioLam FLOAT NULL,
    SoPhutDiMuon INT NOT NULL CONSTRAINT DF_ChamCong_SoPhutDiMuon DEFAULT (0),
    TrangThai NVARCHAR(20) NOT NULL,
    NguonChamCong NVARCHAR(20) NOT NULL CONSTRAINT DF_ChamCong_NguonChamCong DEFAULT (N'Manual'),
    CONSTRAINT PK_ChamCong PRIMARY KEY (Id),
    CONSTRAINT FK_ChamCong_NhanVien FOREIGN KEY (MaNhanVienId) REFERENCES dbo.NhanVien(Id),
    CONSTRAINT UQ_ChamCong_NhanVienNgay UNIQUE (MaNhanVienId, NgayLamViec),
    CONSTRAINT CK_ChamCong_SoGioLam CHECK (SoGioLam IS NULL OR SoGioLam >= 0),
    CONSTRAINT CK_ChamCong_SoPhutDiMuon CHECK (SoPhutDiMuon >= 0),
    CONSTRAINT CK_ChamCong_TrangThai CHECK (TrangThai IN (N'CoMat', N'DiMuon', N'VeSom', N'Vang', N'NghiPhep')),
    CONSTRAINT CK_ChamCong_NguonChamCong CHECK (NguonChamCong IN (N'Manual', N'Machine', N'MobileApp')),
    CONSTRAINT CK_ChamCong_GioRa CHECK (GioRa IS NULL OR GioVao IS NULL OR GioRa >= GioVao)
);
GO

CREATE TABLE dbo.SoDuPhep (
    MaNhanVienId INT NOT NULL,
    MaLoaiPhepId INT NOT NULL,
    Nam INT NOT NULL,
    TongNgayPhep INT NOT NULL CONSTRAINT DF_SoDuPhep_TongNgayPhep DEFAULT (12),
    DaSuDung INT NOT NULL CONSTRAINT DF_SoDuPhep_DaSuDung DEFAULT (0),
    CONSTRAINT PK_SoDuPhep PRIMARY KEY (MaNhanVienId, MaLoaiPhepId, Nam),
    CONSTRAINT FK_SoDuPhep_NhanVien FOREIGN KEY (MaNhanVienId) REFERENCES dbo.NhanVien(Id),
    CONSTRAINT FK_SoDuPhep_LoaiNghiPhep FOREIGN KEY (MaLoaiPhepId) REFERENCES dbo.LoaiNghiPhep(Id),
    CONSTRAINT CK_SoDuPhep_Nam CHECK (Nam >= 2000),
    CONSTRAINT CK_SoDuPhep_TongNgayPhep CHECK (TongNgayPhep >= 0),
    CONSTRAINT CK_SoDuPhep_DaSuDung CHECK (DaSuDung >= 0 AND DaSuDung <= TongNgayPhep)
);
GO

CREATE TABLE dbo.DonNghiPhep (
    Id INT IDENTITY(1,1) NOT NULL,
    MaNhanVienId INT NOT NULL,
    MaLoaiPhepId INT NOT NULL,
    NgayBatDau DATE NOT NULL,
    NgayKetThuc DATE NOT NULL,
    TongSoNgay FLOAT NOT NULL,
    LyDo NVARCHAR(500) NULL,
    TrangThai NVARCHAR(20) NOT NULL CONSTRAINT DF_DonNghiPhep_TrangThai DEFAULT (N'Pending'),
    NguoiDuyetId INT NULL,
    NgayDuyet DATETIME NULL,
    LyDoTuChoi NVARCHAR(500) NULL,
    NgayTao DATETIME NOT NULL CONSTRAINT DF_DonNghiPhep_NgayTao DEFAULT (GETDATE()),
    CONSTRAINT PK_DonNghiPhep PRIMARY KEY (Id),
    CONSTRAINT FK_DonNghiPhep_NhanVien FOREIGN KEY (MaNhanVienId) REFERENCES dbo.NhanVien(Id),
    CONSTRAINT FK_DonNghiPhep_LoaiNghiPhep FOREIGN KEY (MaLoaiPhepId) REFERENCES dbo.LoaiNghiPhep(Id),
    CONSTRAINT FK_DonNghiPhep_NguoiDuyet FOREIGN KEY (NguoiDuyetId) REFERENCES dbo.NhanVien(Id),
    CONSTRAINT CK_DonNghiPhep_TongSoNgay CHECK (TongSoNgay > 0),
    CONSTRAINT CK_DonNghiPhep_TrangThai CHECK (TrangThai IN (N'Pending', N'Approved', N'Rejected', N'Cancelled')),
    CONSTRAINT CK_DonNghiPhep_Ngay CHECK (NgayKetThuc >= NgayBatDau)
);
GO

CREATE TABLE dbo.DonLamThem (
    Id INT IDENTITY(1,1) NOT NULL,
    MaNhanVienId INT NOT NULL,
    NgayLamThem DATE NOT NULL,
    GioBatDau TIME NOT NULL,
    GioKetThuc TIME NOT NULL,
    TongSoGio FLOAT NOT NULL,
    LoaiOT NVARCHAR(20) NOT NULL CONSTRAINT DF_DonLamThem_LoaiOT DEFAULT (N'NgayThuong'),
    HeSoOT DECIMAL(4,2) NOT NULL CONSTRAINT DF_DonLamThem_HeSoOT DEFAULT (1.5),
    LyDo NVARCHAR(500) NULL,
    TrangThai NVARCHAR(20) NOT NULL CONSTRAINT DF_DonLamThem_TrangThai DEFAULT (N'Pending'),
    NguoiDuyetId INT NULL,
    NgayTao DATETIME NOT NULL CONSTRAINT DF_DonLamThem_NgayTao DEFAULT (GETDATE()),
    CONSTRAINT PK_DonLamThem PRIMARY KEY (Id),
    CONSTRAINT FK_DonLamThem_NhanVien FOREIGN KEY (MaNhanVienId) REFERENCES dbo.NhanVien(Id),
    CONSTRAINT FK_DonLamThem_NguoiDuyet FOREIGN KEY (NguoiDuyetId) REFERENCES dbo.NhanVien(Id),
    CONSTRAINT CK_DonLamThem_TongSoGio CHECK (TongSoGio > 0),
    CONSTRAINT CK_DonLamThem_HeSoOT CHECK (HeSoOT >= 1.0),
    CONSTRAINT CK_DonLamThem_LoaiOT CHECK (LoaiOT IN (N'NgayThuong', N'CuoiTuan', N'NgayLe')),
    CONSTRAINT CK_DonLamThem_TrangThai CHECK (TrangThai IN (N'Pending', N'Approved', N'Rejected', N'Cancelled')),
    CONSTRAINT CK_DonLamThem_Gio CHECK (GioKetThuc > GioBatDau)
);
GO

CREATE TABLE dbo.PhieuLuong (
    Id INT IDENTITY(1,1) NOT NULL,
    MaNhanVienId INT NOT NULL,
    Thang INT NOT NULL,
    Nam INT NOT NULL,
    SoNgayCongChuan INT NOT NULL,
    SoNgayCongThucTe FLOAT NOT NULL,
    SoNgayNghiHuongLuong FLOAT NOT NULL CONSTRAINT DF_PhieuLuong_SoNgayNghiHuongLuong DEFAULT (0),
    SoGioLamThem FLOAT NOT NULL CONSTRAINT DF_PhieuLuong_SoGioLamThem DEFAULT (0),
    LuongCoBan DECIMAL(18,2) NOT NULL,
    PhuCap DECIMAL(18,2) NOT NULL,
    TienLamThem DECIMAL(18,2) NOT NULL,
    KhauTruDiMuon DECIMAL(18,2) NOT NULL,
    BaoHiemXaHoi DECIMAL(18,2) NOT NULL,
    BaoHiemYTe DECIMAL(18,2) NOT NULL,
    BaoHiemThatNghiep DECIMAL(18,2) NOT NULL,
    ThueTNCN DECIMAL(18,2) NOT NULL,
    CacKhoanKhauTruKhac DECIMAL(18,2) NOT NULL,
    TongLuongGop DECIMAL(18,2) NOT NULL,
    LuongThucNhan DECIMAL(18,2) NOT NULL,
    TrangThai NVARCHAR(20) NOT NULL CONSTRAINT DF_PhieuLuong_TrangThai DEFAULT (N'Draft'),
    NgayThanhToan DATETIME NULL,
    GhiChu NVARCHAR(500) NULL,
    NguoiTaoId INT NOT NULL,
    CONSTRAINT PK_PhieuLuong PRIMARY KEY (Id),
    CONSTRAINT FK_PhieuLuong_NhanVien FOREIGN KEY (MaNhanVienId) REFERENCES dbo.NhanVien(Id),
    CONSTRAINT FK_PhieuLuong_NguoiTao FOREIGN KEY (NguoiTaoId) REFERENCES dbo.NhanVien(Id),
    CONSTRAINT UQ_PhieuLuong_KyLuong UNIQUE (MaNhanVienId, Thang, Nam),
    CONSTRAINT CK_PhieuLuong_Thang CHECK (Thang BETWEEN 1 AND 12),
    CONSTRAINT CK_PhieuLuong_Nam CHECK (Nam >= 2000),
    CONSTRAINT CK_PhieuLuong_SoNgayCongChuan CHECK (SoNgayCongChuan >= 0),
    CONSTRAINT CK_PhieuLuong_SoNgayCongThucTe CHECK (SoNgayCongThucTe >= 0),
    CONSTRAINT CK_PhieuLuong_SoNgayNghiHuongLuong CHECK (SoNgayNghiHuongLuong >= 0),
    CONSTRAINT CK_PhieuLuong_SoGioLamThem CHECK (SoGioLamThem >= 0),
    CONSTRAINT CK_PhieuLuong_LuongCoBan CHECK (LuongCoBan >= 0),
    CONSTRAINT CK_PhieuLuong_PhuCap CHECK (PhuCap >= 0),
    CONSTRAINT CK_PhieuLuong_TienLamThem CHECK (TienLamThem >= 0),
    CONSTRAINT CK_PhieuLuong_KhauTruDiMuon CHECK (KhauTruDiMuon >= 0),
    CONSTRAINT CK_PhieuLuong_BHXH CHECK (BaoHiemXaHoi >= 0),
    CONSTRAINT CK_PhieuLuong_BHYT CHECK (BaoHiemYTe >= 0),
    CONSTRAINT CK_PhieuLuong_BHTN CHECK (BaoHiemThatNghiep >= 0),
    CONSTRAINT CK_PhieuLuong_ThueTNCN CHECK (ThueTNCN >= 0),
    CONSTRAINT CK_PhieuLuong_KhauTruKhac CHECK (CacKhoanKhauTruKhac >= 0),
    CONSTRAINT CK_PhieuLuong_TongLuongGop CHECK (TongLuongGop >= 0),
    CONSTRAINT CK_PhieuLuong_LuongThucNhan CHECK (LuongThucNhan >= 0),
    CONSTRAINT CK_PhieuLuong_TrangThai CHECK (TrangThai IN (N'Draft', N'Approved', N'Paid'))
);
GO

CREATE TABLE dbo.NhatKyHeThong (
    Id INT IDENTITY(1,1) NOT NULL,
    TenBang VARCHAR(100) NOT NULL,
    MaBanGhi INT NOT NULL,
    HanhDong NVARCHAR(20) NOT NULL,
    GiaTriCu NVARCHAR(MAX) NULL,
    GiaTriMoi NVARCHAR(MAX) NULL,
    MaNguoiThucHienId INT NOT NULL,
    NgayThucHien DATETIME NOT NULL CONSTRAINT DF_NhatKyHeThong_NgayThucHien DEFAULT (GETDATE()),
    CONSTRAINT PK_NhatKyHeThong PRIMARY KEY (Id),
    CONSTRAINT FK_NhatKyHeThong_NguoiThucHien FOREIGN KEY (MaNguoiThucHienId) REFERENCES dbo.NhanVien(Id),
    CONSTRAINT CK_NhatKyHeThong_HanhDong CHECK (HanhDong IN (N'INSERT', N'UPDATE', N'DELETE', N'APPROVE', N'LOGIN', N'EXPORT'))
);
GO

-- =============================================
-- 3. TẠO INDEX
-- =============================================

CREATE INDEX IDX_PhongBan_MaPhongCha ON dbo.PhongBan(MaPhongCha);
GO

CREATE INDEX IDX_NhanVien_MaPhong ON dbo.NhanVien(MaPhongId);
GO

CREATE INDEX IDX_NhanVien_TrangThai ON dbo.NhanVien(TrangThai);
GO

CREATE INDEX IDX_HopDong_NhanVien ON dbo.HopDong(MaNhanVienId);
GO

CREATE INDEX IDX_LichSuLuong_HienTai ON dbo.LichSuLuong(MaNhanVienId, DangHieuLuc);
GO

-- =============================================
-- 4. DỮ LIỆU MẪU
-- =============================================

INSERT INTO dbo.VaiTro (TenVaiTro, MoTa)
VALUES
('Admin', N'Quản trị toàn hệ thống'),
('Manager', N'Quản lý phòng ban / bộ phận'),
('Staff', N'Nhân viên');
GO

INSERT INTO dbo.ChucVu (TenChucVu, CapDo, MoTa)
VALUES
(N'Nhân viên', 1, N'Nhân viên chuyên môn'),
(N'Trưởng nhóm', 2, N'Quản lý nhóm nhỏ'),
(N'Trưởng phòng', 3, N'Quản lý phòng ban'),
(N'Giám đốc', 4, N'Điều hành doanh nghiệp');
GO

INSERT INTO dbo.LoaiNghiPhep (TenLoaiPhep, CoHuongLuong, SoNgayToiDaNam, MoTa)
VALUES
(N'Phép năm', 1, 12, N'Nghỉ phép năm theo chế độ'),
(N'Nghỉ ốm', 1, 30, N'Nghỉ do ốm đau'),
(N'Thai sản', 1, 180, N'Nghỉ thai sản'),
(N'Nghỉ không lương', 0, 30, N'Nghỉ cá nhân không hưởng lương');
GO

INSERT INTO dbo.NgayLe (NgayLe, TenNgayLe, LapLaiHangNam)
VALUES
('2026-01-01', N'Tết Dương lịch', 1),
('2026-04-30', N'Giải phóng miền Nam', 1),
('2026-05-01', N'Quốc tế Lao động', 1),
('2026-09-02', N'Quốc khánh', 1);
GO

INSERT INTO dbo.PhongBan (TenPhong, MaPhong, MaPhongCha, MaQuanLy, DangHoatDong)
VALUES
(N'Ban Giám đốc', 'BOD', NULL, NULL, 1),
(N'Phòng Nhân sự', 'HR', NULL, NULL, 1),
(N'Phòng Công nghệ', 'DEV', NULL, NULL, 1),
(N'Phòng Kế toán', 'ACC', NULL, NULL, 1),
(N'Nhóm Backend', 'DEV-BE', 3, NULL, 1);
GO

INSERT INTO dbo.NhanVien (
    MaNhanVien, HoTen, Email, MatKhauHash, SoDienThoai, GioiTinh, NgaySinh, SoCCCD,
    DiaChi, MaSoThue, SoNguoiPhuThuoc, SoTaiKhoan, TenNganHang, ChiNhanhNganHang,
    MaPhongId, MaChucVuId, MaVaiTroId, NgayVaoLam, NgayNghiViec, TrangThai, NgayCapNhat
)
VALUES
('EMP-2025-001', N'Nguyễn Văn Hùng', 'admin@nexthr.com', '$2b$10$IU/vOOAuMxFRe9EdhNJE2evKDp/EllM7byKpOjrKIygHzgcw0tQMu', '0901000001', N'Nam', '1988-03-15', '012345678901',
 N'Hà Nội', 'MST001', 2, '100000001', N'Vietcombank', N'Hà Nội',
 1, 4, 1, '2025-01-02', NULL, N'Active', GETDATE()),

('EMP-2025-002', N'Trần Thị Lan', 'lan.tran@nexthr.vn', 'HASH_MANAGER_HR', '0901000002', N'Nữ', '1990-07-20', '012345678902',
 N'Hà Nội', 'MST002', 1, '100000002', N'ACB', N'Cầu Giấy',
 2, 3, 2, '2025-01-05', NULL, N'Active', GETDATE()),

('EMP-2025-003', N'Lê Minh Khoa', 'khoa.le@nexthr.vn', 'HASH_MANAGER_DEV', '0901000003', N'Nam', '1992-11-10', '012345678903',
 N'Hồ Chí Minh', 'MST003', 0, '100000003', N'Techcombank', N'Quận 1',
 3, 3, 2, '2025-01-10', NULL, N'Active', GETDATE()),

('EMP-2025-004', N'Phạm Thu Hà', 'ha.pham@nexthr.vn', 'HASH_STAFF_001', '0901000004', N'Nữ', '1998-05-08', '012345678904',
 N'Hồ Chí Minh', 'MST004', 0, '100000004', N'MB Bank', N'Quận 3',
 5, 1, 3, '2025-02-01', NULL, N'Active', GETDATE()),

('EMP-2025-005', N'Đỗ Quốc Bảo', 'bao.do@nexthr.vn', 'HASH_ACC_001', '0901000005', N'Nam', '1995-12-01', '012345678905',
 N'Đà Nẵng', 'MST005', 1, '100000005', N'BIDV', N'Hải Châu',
 4, 1, 3, '2025-02-15', NULL, N'Active', GETDATE());
GO

UPDATE dbo.PhongBan
SET MaQuanLy = CASE MaPhong
    WHEN 'BOD' THEN 1
    WHEN 'HR' THEN 2
    WHEN 'DEV' THEN 3
    WHEN 'ACC' THEN 5
    WHEN 'DEV-BE' THEN 3
END;
GO

INSERT INTO dbo.HopDong (
    MaNhanVienId, SoHopDong, LoaiHopDong, NgayBatDau, NgayKetThuc, NgayKy, DuongDanFile, TrangThai
)
VALUES
(1, 'HD-2025-001', N'Không xác định thời hạn', '2025-01-02', NULL, '2024-12-28', N'/contracts/HD-2025-001.pdf', N'Active'),
(2, 'HD-2025-002', N'Xác định thời hạn', '2025-01-05', '2026-01-04', '2024-12-30', N'/contracts/HD-2025-002.pdf', N'Active'),
(3, 'HD-2025-003', N'Xác định thời hạn', '2025-01-10', '2026-01-09', '2025-01-03', N'/contracts/HD-2025-003.pdf', N'Active'),
(4, 'HD-2025-004', N'Thử việc', '2025-02-01', '2025-04-30', '2025-01-25', N'/contracts/HD-2025-004.pdf', N'Expired'),
(5, 'HD-2025-005', N'Xác định thời hạn', '2025-02-15', '2026-02-14', '2025-02-10', N'/contracts/HD-2025-005.pdf', N'Active');
GO

INSERT INTO dbo.LichSuDieuChuyen (
    MaNhanVienId, PhongBanCuId, PhongBanMoiId, ChucVuCuId, ChucVuMoiId, NgayHieuLuc, LyDo, NguoiDuyetId
)
VALUES
(4, 3, 5, 1, 1, '2025-03-01', N'Thành lập nhóm Backend chuyên trách', 3),
(3, 3, 3, 2, 3, '2025-02-01', N'Bổ nhiệm trưởng phòng công nghệ', 1);
GO

INSERT INTO dbo.LichSuLuong (
    MaNhanVienId, LuongCoBan, PhuCap, NgayBatDau, NgayKetThuc, DangHieuLuc, NguoiThayDoiId, GhiChu
)
VALUES
(1, 50000000, 10000000, '2025-01-02', NULL, 1, 1, N'Lương giám đốc'),
(2, 25000000, 5000000, '2025-01-05', NULL, 1, 1, N'Lương trưởng phòng nhân sự'),
(3, 30000000, 7000000, '2025-01-10', NULL, 1, 1, N'Lương trưởng phòng công nghệ'),
(4, 15000000, 2000000, '2025-02-01', NULL, 1, 3, N'Lương nhân viên backend'),
(5, 14000000, 1500000, '2025-02-15', NULL, 1, 2, N'Lương nhân viên kế toán');
GO

INSERT INTO dbo.ChamCong (
    MaNhanVienId, NgayLamViec, GioVao, GioRa, SoGioLam, SoPhutDiMuon, TrangThai, NguonChamCong
)
VALUES
(2, '2026-03-01', '2026-03-01T08:00:00', '2026-03-01T17:30:00', 8.5, 0, N'CoMat', N'Machine'),
(3, '2026-03-01', '2026-03-01T08:10:00', '2026-03-01T17:40:00', 8.5, 10, N'DiMuon', N'Machine'),
(4, '2026-03-01', '2026-03-01T08:00:00', '2026-03-01T18:00:00', 9.0, 0, N'CoMat', N'MobileApp'),
(5, '2026-03-01', '2026-03-01T08:05:00', '2026-03-01T17:15:00', 8.17, 5, N'DiMuon', N'Machine');
GO

INSERT INTO dbo.SoDuPhep (MaNhanVienId, MaLoaiPhepId, Nam, TongNgayPhep, DaSuDung)
VALUES
(2, 1, 2026, 12, 2),
(3, 1, 2026, 12, 1),
(4, 1, 2026, 12, 3),
(4, 2, 2026, 30, 1),
(5, 1, 2026, 12, 0);
GO

INSERT INTO dbo.DonNghiPhep (
    MaNhanVienId, MaLoaiPhepId, NgayBatDau, NgayKetThuc, TongSoNgay, LyDo, TrangThai, NguoiDuyetId, NgayDuyet, LyDoTuChoi
)
VALUES
(4, 1, '2026-03-10', '2026-03-11', 2, N'Nghỉ phép cá nhân', N'Approved', 3, '2026-03-05T09:00:00', NULL),
(5, 1, '2026-03-20', '2026-03-20', 1, N'Giải quyết việc gia đình', N'Pending', NULL, NULL, NULL),
(2, 2, '2026-02-15', '2026-02-16', 2, N'Nghỉ ốm', N'Approved', 1, '2026-02-14T15:00:00', NULL);
GO

INSERT INTO dbo.DonLamThem (
    MaNhanVienId, NgayLamThem, GioBatDau, GioKetThuc, TongSoGio, LoaiOT, HeSoOT, LyDo, TrangThai, NguoiDuyetId
)
VALUES
(4, '2026-03-02', '18:00:00', '21:00:00', 3, N'NgayThuong', 1.5, N'Hoàn thành API payroll', N'Approved', 3),
(3, '2026-03-08', '09:00:00', '12:00:00', 3, N'CuoiTuan', 2.0, N'Hỗ trợ deploy hệ thống', N'Approved', 1),
(5, '2026-03-15', '18:30:00', '20:30:00', 2, N'NgayThuong', 1.5, N'Đối soát sổ sách cuối tháng', N'Pending', 2);
GO

INSERT INTO dbo.PhieuLuong (
    MaNhanVienId, Thang, Nam, SoNgayCongChuan, SoNgayCongThucTe, SoNgayNghiHuongLuong, SoGioLamThem,
    LuongCoBan, PhuCap, TienLamThem, KhauTruDiMuon, BaoHiemXaHoi, BaoHiemYTe, BaoHiemThatNghiep,
    ThueTNCN, CacKhoanKhauTruKhac, TongLuongGop, LuongThucNhan, TrangThai, NgayThanhToan, GhiChu, NguoiTaoId
)
VALUES
(2, 3, 2026, 26, 24, 2, 0,
 25000000, 5000000, 0, 0, 2000000, 375000, 250000,
 1200000, 0, 30000000, 26175000, N'Paid', '2026-03-31T17:00:00', N'Đã thanh toán tháng 3/2026', 1),

(3, 3, 2026, 26, 25, 1, 3,
 30000000, 7000000, 1500000, 200000, 2400000, 450000, 300000,
 2500000, 0, 38500000, 32650000, N'Paid', '2026-03-31T17:00:00', N'Có OT cuối tuần', 1),

(4, 3, 2026, 26, 23, 2, 3,
 15000000, 2000000, 450000, 0, 1200000, 225000, 150000,
 300000, 0, 17450000, 15575000, N'Approved', NULL, N'Chờ chuyển khoản', 3),

(5, 3, 2026, 26, 25, 0, 2,
 14000000, 1500000, 250000, 100000, 1120000, 210000, 140000,
 150000, 0, 15750000, 14030000, N'Draft', NULL, N'Đang rà soát', 2);
GO

INSERT INTO dbo.NhatKyHeThong (
    TenBang, MaBanGhi, HanhDong, GiaTriCu, GiaTriMoi, MaNguoiThucHienId
)
VALUES
('NhanVien', 4, N'UPDATE', N'{"MaPhongId":3}', N'{"MaPhongId":5}', 3),
('DonNghiPhep', 1, N'APPROVE', NULL, N'{"TrangThai":"Approved"}', 3),
('PhieuLuong', 1, N'EXPORT', NULL, N'{"Thang":3,"Nam":2026}', 1);
GO

-- =============================================
-- 5. KIỂM TRA NHANH DỮ LIỆU MẪU
-- =============================================

SELECT TOP 5 * FROM dbo.PhongBan ORDER BY Id;
SELECT TOP 5 * FROM dbo.NhanVien ORDER BY Id;
SELECT TOP 5 * FROM dbo.PhieuLuong ORDER BY Id;
GO
