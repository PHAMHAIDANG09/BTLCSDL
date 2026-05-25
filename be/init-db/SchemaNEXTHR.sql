/*
WARNING:
File này dùng để dựng/reset database NextHR local từ đầu.
Chạy file này có thể xoá dữ liệu hiện tại trong các bảng và seed lại dữ liệu demo.
Chỉ chạy trên môi trường local/dev. Không chạy trên database có dữ liệu cần giữ nếu chưa backup.
*/
USE master;
GO

IF DB_ID('NextHR') IS NULL
BEGIN
    CREATE DATABASE NextHR;
END
GO

USE NextHR;
GO

-- =============================================
-- 1. RESET SCHEMA FOR FRESH DATABASE BUILD
-- =============================================
DECLARE @sql NVARCHAR(MAX) = N'';

SELECT @sql += N'ALTER TABLE ' 
    + QUOTENAME(OBJECT_SCHEMA_NAME(parent_object_id)) 
    + N'.' 
    + QUOTENAME(OBJECT_NAME(parent_object_id)) 
    + N' DROP CONSTRAINT ' 
    + QUOTENAME(name) 
    + N';' + CHAR(13)
FROM sys.foreign_keys;

EXEC sp_executesql @sql;
GO

DROP TABLE IF EXISTS dbo.NhatKyHeThong;
DROP TABLE IF EXISTS dbo.PhieuLuong;
DROP TABLE IF EXISTS dbo.DonLamThem;
DROP TABLE IF EXISTS dbo.DonNghiPhep;
DROP TABLE IF EXISTS dbo.SoDuPhep;
DROP TABLE IF EXISTS dbo.ChamCong;
DROP TABLE IF EXISTS dbo.LichSuLuong;
DROP TABLE IF EXISTS dbo.LichSuDieuChuyen;
DROP TABLE IF EXISTS dbo.HopDong;
DROP TABLE IF EXISTS dbo.NhanVien;
DROP TABLE IF EXISTS dbo.PhongBan;
DROP TABLE IF EXISTS dbo.NgayLe;
DROP TABLE IF EXISTS dbo.LoaiNghiPhep;
DROP TABLE IF EXISTS dbo.VaiTro;
DROP TABLE IF EXISTS dbo.ChucVu;
DROP TABLE IF EXISTS dbo.CauHinhOT;
DROP TABLE IF EXISTS dbo.CauHinhBaoHiem;
DROP TABLE IF EXISTS dbo.CauHinhLichLamViec;
GO

-- =============================================
-- 2. CORE TABLES
-- =============================================
CREATE TABLE dbo.ChucVu (
    Id INT IDENTITY(1,1) NOT NULL,
    TenChucVu NVARCHAR(100) NOT NULL,
    CapDo INT NOT NULL CONSTRAINT DF_ChucVu_CapDo DEFAULT (1),
    MoTa NVARCHAR(500) NULL,
    CONSTRAINT PK_ChucVu PRIMARY KEY (Id),
    CONSTRAINT CK_ChucVu_CapDo CHECK (CapDo BETWEEN 1 AND 10)
);
GO

CREATE TABLE dbo.VaiTro (
    Id INT IDENTITY(1,1) NOT NULL,
    TenVaiTro NVARCHAR(50) NOT NULL,
    MoTa NVARCHAR(255) NULL,
    CONSTRAINT PK_VaiTro PRIMARY KEY (Id),
    CONSTRAINT UQ_VaiTro_TenVaiTro UNIQUE (TenVaiTro)
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
    CONSTRAINT FK_PhongBan_PhongCha FOREIGN KEY (MaPhongCha) REFERENCES dbo.PhongBan(Id)
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
    CONSTRAINT CK_NhanVien_SoNguoiPhuThuoc CHECK (SoNguoiPhuThuoc >= 0),
    CONSTRAINT CK_NhanVien_TrangThai CHECK (TrangThai IN (N'Active', N'Inactive', N'Terminated'))
);
GO

ALTER TABLE dbo.PhongBan
ADD CONSTRAINT FK_PhongBan_QuanLy
FOREIGN KEY (MaQuanLy) REFERENCES dbo.NhanVien(Id);
GO

CREATE TABLE dbo.HopDong (
    Id INT IDENTITY(1,1) NOT NULL,
    MaNhanVienId INT NOT NULL,
    MaHopDong VARCHAR(50) NOT NULL,
    LoaiHopDong NVARCHAR(50) NOT NULL,
    NgayBatDau DATE NOT NULL,
    NgayKetThuc DATE NULL,
    NgayKy DATE NOT NULL,
    DuongDanFile NVARCHAR(500) NULL,
    LuongCoBan DECIMAL(18,2) NOT NULL CONSTRAINT DF_HopDong_LuongCoBan DEFAULT (0),
    GhiChu NVARCHAR(500) NULL,
    TrangThai NVARCHAR(20) NOT NULL CONSTRAINT DF_HopDong_TrangThai DEFAULT (N'Active'),
    NgayTao DATETIME NOT NULL CONSTRAINT DF_HopDong_NgayTao DEFAULT (GETDATE()),
    CONSTRAINT PK_HopDong PRIMARY KEY (Id),
    CONSTRAINT UQ_HopDong_MaHopDong UNIQUE (MaHopDong),
    CONSTRAINT FK_HopDong_NhanVien FOREIGN KEY (MaNhanVienId) REFERENCES dbo.NhanVien(Id),
    CONSTRAINT CK_HopDong_LuongCoBan CHECK (LuongCoBan >= 0),
    CONSTRAINT CK_HopDong_TrangThai CHECK (TrangThai IN (N'Active', N'Expired', N'Terminated'))
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
    CONSTRAINT FK_LSDC_NhanVien FOREIGN KEY (MaNhanVienId) REFERENCES dbo.NhanVien(Id),
    CONSTRAINT FK_LSDC_PhongBanCu FOREIGN KEY (PhongBanCuId) REFERENCES dbo.PhongBan(Id),
    CONSTRAINT FK_LSDC_PhongBanMoi FOREIGN KEY (PhongBanMoiId) REFERENCES dbo.PhongBan(Id),
    CONSTRAINT FK_LSDC_ChucVuCu FOREIGN KEY (ChucVuCuId) REFERENCES dbo.ChucVu(Id),
    CONSTRAINT FK_LSDC_ChucVuMoi FOREIGN KEY (ChucVuMoiId) REFERENCES dbo.ChucVu(Id),
    CONSTRAINT FK_LSDC_NguoiDuyet FOREIGN KEY (NguoiDuyetId) REFERENCES dbo.NhanVien(Id)
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
    CONSTRAINT CK_LichSuLuong_PhuCap CHECK (PhuCap >= 0)
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
    CONSTRAINT UQ_ChamCong_NhanVienNgay UNIQUE (MaNhanVienId, NgayLamViec),
    CONSTRAINT FK_ChamCong_NhanVien FOREIGN KEY (MaNhanVienId) REFERENCES dbo.NhanVien(Id),
    CONSTRAINT CK_ChamCong_SoGioLam CHECK (SoGioLam IS NULL OR SoGioLam >= 0),
    CONSTRAINT CK_ChamCong_SoPhutDiMuon CHECK (SoPhutDiMuon >= 0)
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
    CONSTRAINT CK_SoDuPhep_DaSuDung CHECK (DaSuDung >= 0)
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
    CONSTRAINT CK_DonNghiPhep_Ngay CHECK (NgayKetThuc >= NgayBatDau),
    CONSTRAINT CK_DonNghiPhep_TrangThai CHECK (TrangThai IN (N'Pending', N'Approved', N'Rejected', N'Cancelled'))
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
    SoNgayCongChuan FLOAT NOT NULL,
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
    NgayTao DATETIME NOT NULL CONSTRAINT DF_PhieuLuong_NgayTao DEFAULT (GETDATE()),
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

CREATE TABLE dbo.CauHinhLichLamViec (
    Id INT IDENTITY(1,1) NOT NULL,
    ThuTrongTuan INT NOT NULL,
    TenThu NVARCHAR(20) NOT NULL,
    LaNgayLamViec BIT NOT NULL CONSTRAINT DF_CauHinhLichLamViec_LaNgayLamViec DEFAULT (1),
    GioBatDau TIME NULL,
    GioKetThuc TIME NULL,
    SoGioLamViec FLOAT NOT NULL CONSTRAINT DF_CauHinhLichLamViec_SoGioLamViec DEFAULT (8),
    GhiChu NVARCHAR(255) NULL,
    NgayTao DATETIME NOT NULL CONSTRAINT DF_CauHinhLichLamViec_NgayTao DEFAULT (GETDATE()),
    CONSTRAINT PK_CauHinhLichLamViec PRIMARY KEY (Id),
    CONSTRAINT UQ_CauHinhLichLamViec_ThuTrongTuan UNIQUE (ThuTrongTuan),
    CONSTRAINT CK_CauHinhLichLamViec_ThuTrongTuan CHECK (ThuTrongTuan BETWEEN 2 AND 8),
    CONSTRAINT CK_CauHinhLichLamViec_SoGioLamViec CHECK (SoGioLamViec >= 0)
);
GO

CREATE TABLE dbo.CauHinhBaoHiem (
    Id INT IDENTITY(1,1) NOT NULL,
    LoaiBaoHiem NVARCHAR(20) NOT NULL,
    TyLeNhanVien DECIMAL(6,4) NOT NULL,
    TyLeCongTy DECIMAL(6,4) NOT NULL,
    NgayBatDau DATE NOT NULL,
    NgayKetThuc DATE NULL,
    DangHieuLuc BIT NOT NULL CONSTRAINT DF_CauHinhBaoHiem_DangHieuLuc DEFAULT (1),
    MucTranDong DECIMAL(18,2) NULL,
    GhiChu NVARCHAR(255) NULL,
    NgayTao DATETIME NOT NULL CONSTRAINT DF_CauHinhBaoHiem_NgayTao DEFAULT (GETDATE()),
    CONSTRAINT PK_CauHinhBaoHiem PRIMARY KEY CLUSTERED (Id),
    CONSTRAINT CK_CauHinhBaoHiem_TyLeNhanVien CHECK (TyLeNhanVien >= 0),
    CONSTRAINT CK_CauHinhBaoHiem_TyLeCongTy CHECK (TyLeCongTy >= 0),
    CONSTRAINT CK_CauHinhBaoHiem_MucTranDong CHECK (MucTranDong IS NULL OR MucTranDong >= 0),
    CONSTRAINT CK_CauHinhBaoHiem_LoaiBaoHiem CHECK (LoaiBaoHiem IN ('BHXH', 'BHYT', 'BHTN'))
);
GO

CREATE TABLE dbo.CauHinhOT (
    Id INT IDENTITY(1,1) NOT NULL,
    LoaiOT NVARCHAR(20) NOT NULL,
    HeSoOT DECIMAL(4,2) NOT NULL,
    MoTa NVARCHAR(255) NULL,
    DangHieuLuc BIT NOT NULL CONSTRAINT DF_CauHinhOT_DangHieuLuc DEFAULT (1),
    NgayTao DATETIME NOT NULL CONSTRAINT DF_CauHinhOT_NgayTao DEFAULT GETDATE(),
    CONSTRAINT PK_CauHinhOT PRIMARY KEY CLUSTERED (Id),
    CONSTRAINT UQ_CauHinhOT_LoaiOT UNIQUE (LoaiOT),
    CONSTRAINT CK_CauHinhOT_HeSoOT CHECK (HeSoOT > 0)
);
GO

-- =============================================
-- 3. INDEXES
-- =============================================
CREATE INDEX IDX_PhongBan_MaPhongCha ON dbo.PhongBan(MaPhongCha);
CREATE INDEX IDX_NhanVien_MaPhong ON dbo.NhanVien(MaPhongId);
CREATE INDEX IDX_NhanVien_TrangThai ON dbo.NhanVien(TrangThai);
CREATE INDEX IDX_HopDong_NhanVien ON dbo.HopDong(MaNhanVienId);
CREATE INDEX IDX_LichSuLuong_HienTai ON dbo.LichSuLuong(MaNhanVienId, DangHieuLuc);
CREATE INDEX IDX_ChamCong_Ngay_NhanVien ON dbo.ChamCong(NgayLamViec, MaNhanVienId);
CREATE INDEX IDX_DonNghiPhep_TrangThai_Ngay_NhanVien ON dbo.DonNghiPhep(TrangThai, NgayBatDau, NgayKetThuc, MaNhanVienId);
CREATE INDEX IDX_DonLamThem_TrangThai_Ngay_NhanVien ON dbo.DonLamThem(TrangThai, NgayLamThem, MaNhanVienId);
CREATE INDEX IDX_PhieuLuong_Nam_Thang ON dbo.PhieuLuong(Nam, Thang);
CREATE INDEX IDX_HopDong_TrangThai_NgayKetThuc ON dbo.HopDong(TrangThai, NgayKetThuc);
GO

-- =============================================
-- 4. SEED DATA
-- =============================================
INSERT INTO dbo.VaiTro (TenVaiTro, MoTa)
VALUES
(N'Admin', N'Quản trị hệ thống'),
(N'Manager', N'Quản lý phòng ban'),
(N'Staff', N'Nhân viên');
GO

INSERT INTO dbo.ChucVu (TenChucVu, CapDo, MoTa)
VALUES
(N'Nhân viên', 1, N'Nhân viên chuyên môn'),
(N'Chuyên viên', 2, N'Chuyên viên nghiệp vụ'),
(N'Trưởng phòng', 3, N'Quản lý phòng ban'),
(N'Giám đốc', 4, N'Ban giám đốc');
GO

INSERT INTO dbo.LoaiNghiPhep (TenLoaiPhep, CoHuongLuong, SoNgayToiDaNam, MoTa)
VALUES
(N'Nghỉ phép năm', 1, 12, N'Nghỉ phép năm có hưởng lương'),
(N'Nghỉ ốm', 1, 30, N'Nghỉ ốm có hưởng chế độ'),
(N'Nghỉ không lương', 0, 365, N'Nghỉ không hưởng lương');
GO

INSERT INTO dbo.NgayLe (NgayLe, TenNgayLe, LapLaiHangNam)
VALUES
('2026-01-01', N'Tết Dương lịch', 1),
('2026-02-16', N'Tết Nguyên Đán 2026 - Ngày nghỉ 1', 0),
('2026-02-17', N'Tết Nguyên Đán 2026 - Mùng 1', 0),
('2026-02-18', N'Tết Nguyên Đán 2026 - Mùng 2', 0),
('2026-02-19', N'Tết Nguyên Đán 2026 - Mùng 3', 0),
('2026-02-20', N'Tết Nguyên Đán 2026 - Ngày nghỉ 5', 0),
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
('EMP-2025-001', N'Nguyễn Văn Hùng', 'admin@nexthr.com', '$2b$10$HW6PlpVsuh4BuxmEhh/pCuNLzu0ul5sooFxbGzSI.MS3WIcGRSdHq', '0901000001', N'Nam', '1988-03-15', '012345678901', N'Hà Nội', 'MST001', 2, '100000001', N'Vietcombank', N'Hà Nội', 1, 4, 1, '2025-01-02', NULL, N'Active', GETDATE()),
('EMP-2025-002', N'Trần Thị Lan', 'lan.tran@nexthr.vn', '$2b$10$HW6PlpVsuh4BuxmEhh/pCuNLzu0ul5sooFxbGzSI.MS3WIcGRSdHq', '0901000002', N'Nữ', '1990-07-20', '012345678902', N'Hà Nội', 'MST002', 1, '100000002', N'ACB', N'Cầu Giấy', 2, 3, 2, '2025-01-05', NULL, N'Active', GETDATE()),
('EMP-2025-003', N'Lê Minh Khoa', 'khoa.le@nexthr.vn', '$2b$10$HW6PlpVsuh4BuxmEhh/pCuNLzu0ul5sooFxbGzSI.MS3WIcGRSdHq', '0901000003', N'Nam', '1992-11-10', '012345678903', N'Hồ Chí Minh', 'MST003', 0, '100000003', N'Techcombank', N'Quận 1', 3, 3, 2, '2025-01-10', NULL, N'Active', GETDATE()),
('EMP-2025-004', N'Phạm Thu Hà', 'ha.pham@nexthr.vn', '$2b$10$HW6PlpVsuh4BuxmEhh/pCuNLzu0ul5sooFxbGzSI.MS3WIcGRSdHq', '0901000004', N'Nữ', '1998-05-08', '012345678904', N'Đà Nẵng', 'MST004', 0, '100000004', N'MB Bank', N'Hải Châu', 5, 1, 3, '2025-02-01', NULL, N'Active', GETDATE()),
('EMP-2025-005', N'Đỗ Quốc Bảo', 'bao.do@nexthr.vn', '$2b$10$HW6PlpVsuh4BuxmEhh/pCuNLzu0ul5sooFxbGzSI.MS3WIcGRSdHq', '0901000005', N'Nam', '1996-09-12', '012345678905', N'Hà Nội', 'MST005', 1, '100000005', N'BIDV', N'Đống Đa', 4, 1, 3, '2025-02-15', NULL, N'Active', GETDATE());
GO

UPDATE dbo.PhongBan SET MaQuanLy = 1 WHERE Id = 1;
UPDATE dbo.PhongBan SET MaQuanLy = 2 WHERE Id = 2;
UPDATE dbo.PhongBan SET MaQuanLy = 3 WHERE Id = 3;
GO

INSERT INTO dbo.HopDong (MaNhanVienId, MaHopDong, LoaiHopDong, NgayBatDau, NgayKetThuc, NgayKy, LuongCoBan, GhiChu, TrangThai)
VALUES
(1, 'HDLD-2025-001', N'Không xác định thời hạn', '2025-01-02', NULL, '2025-01-02', 35000000, N'Hợp đồng quản lý', N'Active'),
(2, 'HDLD-2025-002', N'Không xác định thời hạn', '2025-01-05', NULL, '2025-01-05', 25000000, N'Hợp đồng quản lý', N'Active'),
(3, 'HDLD-2025-003', N'Không xác định thời hạn', '2025-01-10', NULL, '2025-01-10', 26000000, N'Hợp đồng quản lý', N'Active'),
(4, 'HDLD-2025-004', N'Xác định thời hạn', '2025-02-01', '2026-02-01', '2025-02-01', 16000000, N'Hợp đồng nhân viên', N'Active'),
(5, 'HDLD-2025-005', N'Xác định thời hạn', '2025-02-15', '2026-02-15', '2025-02-15', 15000000, N'Hợp đồng nhân viên', N'Active');
GO

INSERT INTO dbo.LichSuDieuChuyen (MaNhanVienId, PhongBanCuId, PhongBanMoiId, ChucVuCuId, ChucVuMoiId, NgayHieuLuc, LyDo, NguoiDuyetId)
VALUES
(4, 3, 5, 1, 1, '2025-02-01', N'Phân công vào nhóm Backend', 3);
GO

INSERT INTO dbo.LichSuLuong (MaNhanVienId, LuongCoBan, PhuCap, NgayBatDau, NgayKetThuc, DangHieuLuc, NguoiThayDoiId, GhiChu)
VALUES
(1, 35000000, 5000000, '2025-01-02', NULL, 1, 1, N'Lương khởi tạo'),
(2, 25000000, 3000000, '2025-01-05', NULL, 1, 1, N'Lương khởi tạo'),
(3, 26000000, 3000000, '2025-01-10', NULL, 1, 1, N'Lương khởi tạo'),
(4, 16000000, 1500000, '2025-02-01', NULL, 1, 1, N'Lương khởi tạo'),
(5, 15000000, 1500000, '2025-02-15', NULL, 1, 1, N'Lương khởi tạo');
GO

-- Demo chấm công tháng 3/2026
-- Lịch làm việc: Thứ 2 đến Thứ 6 = 8h, Thứ 7 = 4h, Chủ nhật nghỉ
-- Tháng 3/2026 có 24 công chuẩn theo cấu hình lịch làm việc hiện tại
DECLARE @d DATE = '2026-03-01';

WHILE @d <= '2026-03-31'
BEGIN
    IF DATEPART(WEEKDAY, @d) <> 1
    BEGIN
        DECLARE @standardHours FLOAT =
            CASE
                WHEN DATEPART(WEEKDAY, @d) = 7 THEN 4
                ELSE 8
            END;

        -- Hùng: đi làm đủ công
        INSERT INTO dbo.ChamCong (
            MaNhanVienId, NgayLamViec, GioVao, GioRa,
            SoGioLam, SoPhutDiMuon, TrangThai, NguonChamCong
        )
        VALUES (
            1, @d,
            DATEADD(HOUR, 8, CAST(@d AS DATETIME)),
            DATEADD(HOUR, CASE WHEN @standardHours = 4 THEN 12 ELSE 17 END, CAST(@d AS DATETIME)),
            @standardHours,
            0,
            N'CoMat',
            N'Manual'
        );

        -- Lan: nghỉ phép có lương ngày 10/03 nên không chấm công ngày đó
        IF @d <> '2026-03-10'
        BEGIN
            INSERT INTO dbo.ChamCong (
                MaNhanVienId, NgayLamViec, GioVao, GioRa,
                SoGioLam, SoPhutDiMuon, TrangThai, NguonChamCong
            )
            VALUES (
                2, @d,
                DATEADD(HOUR, 8, CAST(@d AS DATETIME)),
                DATEADD(HOUR, CASE WHEN @standardHours = 4 THEN 12 ELSE 17 END, CAST(@d AS DATETIME)),
                @standardHours,
                0,
                N'CoMat',
                N'Manual'
            );
        END;

        -- Khoa: đi làm đủ nhưng có các ngày đi muộn, và có OT cuối tuần trong DonLamThem
        INSERT INTO dbo.ChamCong (
            MaNhanVienId, NgayLamViec, GioVao, GioRa,
            SoGioLam, SoPhutDiMuon, TrangThai, NguonChamCong
        )
        VALUES (
            3, @d,
            DATEADD(MINUTE,
                CASE WHEN @d IN ('2026-03-02', '2026-03-09', '2026-03-18') THEN 30 ELSE 0 END,
                DATEADD(HOUR, 8, CAST(@d AS DATETIME))
            ),
            DATEADD(HOUR, CASE WHEN @standardHours = 4 THEN 12 ELSE 17 END, CAST(@d AS DATETIME)),
            @standardHours,
            CASE WHEN @d IN ('2026-03-02', '2026-03-09', '2026-03-18') THEN 30 ELSE 0 END,
            CASE WHEN @d IN ('2026-03-02', '2026-03-09', '2026-03-18') THEN N'DiMuon' ELSE N'CoMat' END,
            N'Manual'
        );

        -- Hà: đi làm đủ, có OT ngày thường trong DonLamThem
        INSERT INTO dbo.ChamCong (
            MaNhanVienId, NgayLamViec, GioVao, GioRa,
            SoGioLam, SoPhutDiMuon, TrangThai, NguonChamCong
        )
        VALUES (
            4, @d,
            DATEADD(HOUR, 8, CAST(@d AS DATETIME)),
            DATEADD(HOUR, CASE WHEN @standardHours = 4 THEN 12 ELSE 17 END, CAST(@d AS DATETIME)),
            @standardHours,
            0,
            N'CoMat',
            N'Manual'
        );

        -- Bảo: nghỉ không lương ngày 16/03, thiếu công không lý do ngày 23/03 và 24/03
        IF @d NOT IN ('2026-03-16', '2026-03-23', '2026-03-24')
        BEGIN
            INSERT INTO dbo.ChamCong (
                MaNhanVienId, NgayLamViec, GioVao, GioRa,
                SoGioLam, SoPhutDiMuon, TrangThai, NguonChamCong
            )
            VALUES (
                5, @d,
                DATEADD(HOUR, 8, CAST(@d AS DATETIME)),
                DATEADD(HOUR, CASE WHEN @standardHours = 4 THEN 12 ELSE 17 END, CAST(@d AS DATETIME)),
                @standardHours,
                0,
                N'CoMat',
                N'Manual'
            );
        END;
    END;

    SET @d = DATEADD(DAY, 1, @d);
END;
GO

INSERT INTO dbo.SoDuPhep (MaNhanVienId, MaLoaiPhepId, Nam, TongNgayPhep, DaSuDung)
VALUES
(1, 1, 2026, 12, 0), (2, 1, 2026, 12, 1), (3, 1, 2026, 12, 0), (4, 1, 2026, 12, 0), (5, 1, 2026, 12, 0),
(1, 2, 2026, 30, 0), (2, 2, 2026, 30, 0), (3, 2, 2026, 30, 0), (4, 2, 2026, 30, 0), (5, 2, 2026, 30, 0);
GO

INSERT INTO dbo.DonNghiPhep (MaNhanVienId, MaLoaiPhepId, NgayBatDau, NgayKetThuc, TongSoNgay, LyDo, TrangThai, NguoiDuyetId, NgayDuyet)
VALUES
(2, 1, '2026-03-10', '2026-03-10', 1, N'Nghỉ việc gia đình', N'Approved', 1, GETDATE()),
(5, 3, '2026-03-16', '2026-03-16', 1, N'Nghỉ việc cá nhân không lương', N'Approved', 1, GETDATE());
GO

INSERT INTO dbo.DonLamThem (MaNhanVienId, NgayLamThem, GioBatDau, GioKetThuc, TongSoGio, LoaiOT, HeSoOT, LyDo, TrangThai, NguoiDuyetId)
VALUES
(4, '2026-03-03', '18:00', '20:00', 2, N'NgayThuong', 1.50, N'Hoàn thành sprint', N'Approved', 3),
(3, '2026-03-08', '08:00', '12:00', 4, N'CuoiTuan', 2.00, N'Hỗ trợ triển khai hệ thống', N'Approved', 1);
GO

INSERT INTO dbo.PhieuLuong (
    MaNhanVienId, Thang, Nam, SoNgayCongChuan, SoNgayCongThucTe, SoNgayNghiHuongLuong, SoGioLamThem,
    LuongCoBan, PhuCap, TienLamThem, KhauTruDiMuon, BaoHiemXaHoi, BaoHiemYTe, BaoHiemThatNghiep,
    ThueTNCN, CacKhoanKhauTruKhac, TongLuongGop, LuongThucNhan, TrangThai, NguoiTaoId
)
VALUES
(1, 2, 2026, 24, 24, 0, 0, 35000000, 5000000, 0, 0, 2800000, 525000, 350000, 2332500, 0, 40000000, 34000000, N'Draft', 1),
(2, 2, 2026, 24, 23, 1, 0, 25000000, 3000000, 0, 0, 2000000, 375000, 250000, 897500, 0, 28000000, 24477500, N'Draft', 1);
GO

INSERT INTO dbo.NhatKyHeThong (TenBang, MaBanGhi, HanhDong, GiaTriCu, GiaTriMoi, MaNguoiThucHienId)
VALUES
('NhanVien', 1, N'INSERT', NULL, N'Seed admin user', 1),
('PhieuLuong', 1, N'INSERT', NULL, N'Seed payroll sample', 1);
GO

INSERT INTO dbo.CauHinhLichLamViec (ThuTrongTuan, TenThu, LaNgayLamViec, GioBatDau, GioKetThuc, SoGioLamViec)
VALUES
(2, N'Thứ 2', 1, '08:00', '17:00', 8),
(3, N'Thứ 3', 1, '08:00', '17:00', 8),
(4, N'Thứ 4', 1, '08:00', '17:00', 8),
(5, N'Thứ 5', 1, '08:00', '17:00', 8),
(6, N'Thứ 6', 1, '08:00', '17:00', 8),
(7, N'Thứ 7', 1, '08:00', '12:00', 4),
(8, N'Chủ nhật', 0, NULL, NULL, 0);
GO

INSERT INTO dbo.CauHinhBaoHiem (LoaiBaoHiem, TyLeNhanVien, TyLeCongTy, NgayBatDau, DangHieuLuc, MucTranDong)
VALUES
('BHXH', 0.0800, 0.1750, '2026-01-01', 1, 46800000),
('BHYT', 0.0150, 0.0300, '2026-01-01', 1, 46800000),
('BHTN', 0.0100, 0.0100, '2026-01-01', 1, 93600000);
GO

INSERT INTO dbo.CauHinhOT (LoaiOT, HeSoOT, MoTa, DangHieuLuc)
VALUES
(N'NgayThuong', 1.50, N'Làm thêm ngày thường', 1),
(N'CuoiTuan', 2.00, N'Làm thêm cuối tuần/ngày nghỉ', 1),
(N'NgayLe', 3.00, N'Làm thêm ngày lễ', 1);
GO

-- =============================================
-- 5. AUDIT TRIGGERS
-- =============================================
CREATE OR ALTER TRIGGER dbo.trg_Audit_NhanVien
ON dbo.NhanVien
AFTER INSERT, UPDATE, DELETE
AS
BEGIN
    SET NOCOUNT ON;

    INSERT INTO dbo.NhatKyHeThong (
        TenBang,
        MaBanGhi,
        HanhDong,
        GiaTriCu,
        GiaTriMoi,
        MaNguoiThucHienId
    )
    SELECT
        'NhanVien',
        i.Id,
        N'INSERT',
        NULL,
        (
            SELECT
                x.Id,
                x.MaNhanVien,
                x.HoTen,
                x.Email,
                N'***MASKED***' AS MatKhauHash,
                x.SoDienThoai,
                x.GioiTinh,
                x.NgaySinh,
                x.SoCCCD,
                x.DiaChi,
                x.MaSoThue,
                x.SoNguoiPhuThuoc,
                x.SoTaiKhoan,
                x.TenNganHang,
                x.ChiNhanhNganHang,
                x.MaPhongId,
                x.MaChucVuId,
                x.MaVaiTroId,
                x.NgayVaoLam,
                x.NgayNghiViec,
                x.TrangThai,
                x.NgayTao,
                x.NgayCapNhat
            FROM inserted x
            WHERE x.Id = i.Id
            FOR JSON PATH, WITHOUT_ARRAY_WRAPPER
        ),
        1
    FROM inserted i
    WHERE NOT EXISTS (SELECT 1 FROM deleted d WHERE d.Id = i.Id);

    INSERT INTO dbo.NhatKyHeThong (
        TenBang,
        MaBanGhi,
        HanhDong,
        GiaTriCu,
        GiaTriMoi,
        MaNguoiThucHienId
    )
    SELECT
        'NhanVien',
        i.Id,
        N'UPDATE',
        (
            SELECT
                x.Id,
                x.MaNhanVien,
                x.HoTen,
                x.Email,
                N'***MASKED***' AS MatKhauHash,
                x.SoDienThoai,
                x.GioiTinh,
                x.NgaySinh,
                x.SoCCCD,
                x.DiaChi,
                x.MaSoThue,
                x.SoNguoiPhuThuoc,
                x.SoTaiKhoan,
                x.TenNganHang,
                x.ChiNhanhNganHang,
                x.MaPhongId,
                x.MaChucVuId,
                x.MaVaiTroId,
                x.NgayVaoLam,
                x.NgayNghiViec,
                x.TrangThai,
                x.NgayTao,
                x.NgayCapNhat
            FROM deleted x
            WHERE x.Id = d.Id
            FOR JSON PATH, WITHOUT_ARRAY_WRAPPER
        ),
        (
            SELECT
                x.Id,
                x.MaNhanVien,
                x.HoTen,
                x.Email,
                N'***MASKED***' AS MatKhauHash,
                x.SoDienThoai,
                x.GioiTinh,
                x.NgaySinh,
                x.SoCCCD,
                x.DiaChi,
                x.MaSoThue,
                x.SoNguoiPhuThuoc,
                x.SoTaiKhoan,
                x.TenNganHang,
                x.ChiNhanhNganHang,
                x.MaPhongId,
                x.MaChucVuId,
                x.MaVaiTroId,
                x.NgayVaoLam,
                x.NgayNghiViec,
                x.TrangThai,
                x.NgayTao,
                x.NgayCapNhat
            FROM inserted x
            WHERE x.Id = i.Id
            FOR JSON PATH, WITHOUT_ARRAY_WRAPPER
        ),
        1
    FROM inserted i
    INNER JOIN deleted d ON d.Id = i.Id;

    INSERT INTO dbo.NhatKyHeThong (
        TenBang,
        MaBanGhi,
        HanhDong,
        GiaTriCu,
        GiaTriMoi,
        MaNguoiThucHienId
    )
    SELECT
        'NhanVien',
        d.Id,
        N'DELETE',
        (
            SELECT
                x.Id,
                x.MaNhanVien,
                x.HoTen,
                x.Email,
                N'***MASKED***' AS MatKhauHash,
                x.SoDienThoai,
                x.GioiTinh,
                x.NgaySinh,
                x.SoCCCD,
                x.DiaChi,
                x.MaSoThue,
                x.SoNguoiPhuThuoc,
                x.SoTaiKhoan,
                x.TenNganHang,
                x.ChiNhanhNganHang,
                x.MaPhongId,
                x.MaChucVuId,
                x.MaVaiTroId,
                x.NgayVaoLam,
                x.NgayNghiViec,
                x.TrangThai,
                x.NgayTao,
                x.NgayCapNhat
            FROM deleted x
            WHERE x.Id = d.Id
            FOR JSON PATH, WITHOUT_ARRAY_WRAPPER
        ),
        NULL,
        1
    FROM deleted d
    WHERE NOT EXISTS (SELECT 1 FROM inserted i WHERE i.Id = d.Id);
END;
GO

CREATE OR ALTER TRIGGER dbo.trg_Audit_DonNghiPhep
ON dbo.DonNghiPhep
AFTER INSERT, UPDATE, DELETE
AS
BEGIN
    SET NOCOUNT ON;

    INSERT INTO dbo.NhatKyHeThong (
        TenBang,
        MaBanGhi,
        HanhDong,
        GiaTriCu,
        GiaTriMoi,
        MaNguoiThucHienId
    )
    SELECT
        'DonNghiPhep',
        i.Id,
        N'INSERT',
        NULL,
        (
            SELECT *
            FROM inserted x
            WHERE x.Id = i.Id
            FOR JSON PATH, WITHOUT_ARRAY_WRAPPER
        ),
        1
    FROM inserted i
    WHERE NOT EXISTS (SELECT 1 FROM deleted d WHERE d.Id = i.Id);

    INSERT INTO dbo.NhatKyHeThong (
        TenBang,
        MaBanGhi,
        HanhDong,
        GiaTriCu,
        GiaTriMoi,
        MaNguoiThucHienId
    )
    SELECT
        'DonNghiPhep',
        i.Id,
        N'UPDATE',
        (
            SELECT *
            FROM deleted x
            WHERE x.Id = d.Id
            FOR JSON PATH, WITHOUT_ARRAY_WRAPPER
        ),
        (
            SELECT *
            FROM inserted x
            WHERE x.Id = i.Id
            FOR JSON PATH, WITHOUT_ARRAY_WRAPPER
        ),
        1
    FROM inserted i
    INNER JOIN deleted d ON d.Id = i.Id;

    INSERT INTO dbo.NhatKyHeThong (
        TenBang,
        MaBanGhi,
        HanhDong,
        GiaTriCu,
        GiaTriMoi,
        MaNguoiThucHienId
    )
    SELECT
        'DonNghiPhep',
        d.Id,
        N'DELETE',
        (
            SELECT *
            FROM deleted x
            WHERE x.Id = d.Id
            FOR JSON PATH, WITHOUT_ARRAY_WRAPPER
        ),
        NULL,
        1
    FROM deleted d
    WHERE NOT EXISTS (SELECT 1 FROM inserted i WHERE i.Id = d.Id);
END;
GO

CREATE OR ALTER TRIGGER dbo.trg_Audit_PhieuLuong
ON dbo.PhieuLuong
AFTER INSERT, UPDATE, DELETE
AS
BEGIN
    SET NOCOUNT ON;

    INSERT INTO dbo.NhatKyHeThong (
        TenBang,
        MaBanGhi,
        HanhDong,
        GiaTriCu,
        GiaTriMoi,
        MaNguoiThucHienId
    )
    SELECT
        'PhieuLuong',
        i.Id,
        N'INSERT',
        NULL,
        (
            SELECT *
            FROM inserted x
            WHERE x.Id = i.Id
            FOR JSON PATH, WITHOUT_ARRAY_WRAPPER
        ),
        1
    FROM inserted i
    WHERE NOT EXISTS (SELECT 1 FROM deleted d WHERE d.Id = i.Id);

    INSERT INTO dbo.NhatKyHeThong (
        TenBang,
        MaBanGhi,
        HanhDong,
        GiaTriCu,
        GiaTriMoi,
        MaNguoiThucHienId
    )
    SELECT
        'PhieuLuong',
        i.Id,
        N'UPDATE',
        (
            SELECT *
            FROM deleted x
            WHERE x.Id = d.Id
            FOR JSON PATH, WITHOUT_ARRAY_WRAPPER
        ),
        (
            SELECT *
            FROM inserted x
            WHERE x.Id = i.Id
            FOR JSON PATH, WITHOUT_ARRAY_WRAPPER
        ),
        1
    FROM inserted i
    INNER JOIN deleted d ON d.Id = i.Id;

    INSERT INTO dbo.NhatKyHeThong (
        TenBang,
        MaBanGhi,
        HanhDong,
        GiaTriCu,
        GiaTriMoi,
        MaNguoiThucHienId
    )
    SELECT
        'PhieuLuong',
        d.Id,
        N'DELETE',
        (
            SELECT *
            FROM deleted x
            WHERE x.Id = d.Id
            FOR JSON PATH, WITHOUT_ARRAY_WRAPPER
        ),
        NULL,
        1
    FROM deleted d
    WHERE NOT EXISTS (SELECT 1 FROM inserted i WHERE i.Id = d.Id);
END;
GO

-- =============================================
-- 6. VIEWS
-- =============================================
CREATE OR ALTER VIEW dbo.vw_OrgChart
AS
WITH OrgCTE AS (
    SELECT Id AS DepartmentId, TenPhong AS DepartmentName, MaPhongCha AS ParentId, 0 AS LevelDepth,
           CAST(TenPhong AS NVARCHAR(MAX)) AS FullPath
    FROM dbo.PhongBan
    WHERE MaPhongCha IS NULL
    UNION ALL
    SELECT pb.Id, pb.TenPhong, pb.MaPhongCha, octe.LevelDepth + 1,
           CAST(octe.FullPath + N' > ' + pb.TenPhong AS NVARCHAR(MAX))
    FROM dbo.PhongBan pb
    INNER JOIN OrgCTE octe ON pb.MaPhongCha = octe.DepartmentId
)
SELECT * FROM OrgCTE;
GO

CREATE OR ALTER VIEW dbo.vw_BangLuongTongHop
AS
SELECT
    pl.Id AS PhieuLuongId,
    pl.MaNhanVienId,
    nv.MaNhanVien,
    nv.HoTen,
    nv.Email,
    pb.Id AS PhongBanId,
    pb.MaPhong,
    pb.TenPhong,
    cv.Id AS ChucVuId,
    cv.TenChucVu,
    pl.Thang,
    pl.Nam,
    pl.SoNgayCongChuan,
    pl.SoNgayCongThucTe,
    pl.SoNgayNghiHuongLuong,
    pl.SoGioLamThem,
    pl.LuongCoBan,
    pl.PhuCap,
    pl.TienLamThem,
    pl.KhauTruDiMuon,
    pl.BaoHiemXaHoi,
    pl.BaoHiemYTe,
    pl.BaoHiemThatNghiep,
    pl.ThueTNCN,
    pl.CacKhoanKhauTruKhac,
    pl.TongLuongGop,
    pl.BaoHiemXaHoi + pl.BaoHiemYTe + pl.BaoHiemThatNghiep AS TongBaoHiem,
    pl.KhauTruDiMuon + pl.BaoHiemXaHoi + pl.BaoHiemYTe + pl.BaoHiemThatNghiep + pl.ThueTNCN + pl.CacKhoanKhauTruKhac AS TongKhauTru,
    pl.LuongThucNhan,
    pl.TrangThai,
    pl.NgayThanhToan,
    pl.NgayTao
FROM dbo.PhieuLuong pl
INNER JOIN dbo.NhanVien nv ON nv.Id = pl.MaNhanVienId
LEFT JOIN dbo.PhongBan pb ON pb.Id = nv.MaPhongId
LEFT JOIN dbo.ChucVu cv ON cv.Id = nv.MaChucVuId;
GO

CREATE OR ALTER VIEW dbo.vw_ChamCongThang
AS
SELECT
    cc.MaNhanVienId,
    nv.MaNhanVien,
    nv.HoTen,
    pb.Id AS PhongBanId,
    pb.MaPhong,
    pb.TenPhong,
    cv.Id AS ChucVuId,
    cv.TenChucVu,
    MONTH(cc.NgayLamViec) AS Thang,
    YEAR(cc.NgayLamViec) AS Nam,
    COUNT(*) AS SoNgayChamCong,
    SUM(CASE WHEN cc.TrangThai IN (N'CoMat', N'DiMuon', N'VeSom') THEN 1 ELSE 0 END) AS SoNgayCoMat,
    SUM(CASE WHEN cc.TrangThai = N'DiMuon' THEN 1 ELSE 0 END) AS SoNgayDiMuon,
    SUM(CASE WHEN cc.TrangThai = N'VeSom' THEN 1 ELSE 0 END) AS SoNgayVeSom,
    SUM(ISNULL(cc.SoGioLam, 0)) AS TongGioLam,
    SUM(ISNULL(cc.SoPhutDiMuon, 0)) AS TongPhutDiMuon,
    MIN(cc.GioVao) AS GioVaoSomNhat,
    MAX(cc.GioRa) AS GioRaMuonNhat
FROM dbo.ChamCong cc
INNER JOIN dbo.NhanVien nv ON nv.Id = cc.MaNhanVienId
LEFT JOIN dbo.PhongBan pb ON pb.Id = nv.MaPhongId
LEFT JOIN dbo.ChucVu cv ON cv.Id = nv.MaChucVuId
GROUP BY
    cc.MaNhanVienId,
    nv.MaNhanVien,
    nv.HoTen,
    pb.Id,
    pb.MaPhong,
    pb.TenPhong,
    cv.Id,
    cv.TenChucVu,
    MONTH(cc.NgayLamViec),
    YEAR(cc.NgayLamViec);
GO

CREATE OR ALTER VIEW dbo.vw_ThongKeNghiPhep
AS
SELECT
    dnp.MaNhanVienId,
    nv.MaNhanVien,
    nv.HoTen,
    pb.Id AS PhongBanId,
    pb.MaPhong,
    pb.TenPhong,
    cv.Id AS ChucVuId,
    cv.TenChucVu,
    dnp.MaLoaiPhepId,
    lnp.TenLoaiPhep,
    lnp.CoHuongLuong,
    MONTH(dnp.NgayBatDau) AS Thang,
    YEAR(dnp.NgayBatDau) AS Nam,
    dnp.TrangThai,
    COUNT(*) AS SoDon,
    SUM(dnp.TongSoNgay) AS TongSoNgay,
    SUM(CASE WHEN dnp.TrangThai = N'Approved' THEN dnp.TongSoNgay ELSE 0 END) AS SoNgayApproved,
    SUM(CASE WHEN dnp.TrangThai = N'Pending' THEN dnp.TongSoNgay ELSE 0 END) AS SoNgayPending,
    SUM(CASE WHEN dnp.TrangThai = N'Rejected' THEN dnp.TongSoNgay ELSE 0 END) AS SoNgayRejected,
    SUM(CASE WHEN dnp.TrangThai = N'Cancelled' THEN dnp.TongSoNgay ELSE 0 END) AS SoNgayCancelled
FROM dbo.DonNghiPhep dnp
INNER JOIN dbo.NhanVien nv ON nv.Id = dnp.MaNhanVienId
INNER JOIN dbo.LoaiNghiPhep lnp ON lnp.Id = dnp.MaLoaiPhepId
LEFT JOIN dbo.PhongBan pb ON pb.Id = nv.MaPhongId
LEFT JOIN dbo.ChucVu cv ON cv.Id = nv.MaChucVuId
GROUP BY
    dnp.MaNhanVienId,
    nv.MaNhanVien,
    nv.HoTen,
    pb.Id,
    pb.MaPhong,
    pb.TenPhong,
    cv.Id,
    cv.TenChucVu,
    dnp.MaLoaiPhepId,
    lnp.TenLoaiPhep,
    lnp.CoHuongLuong,
    MONTH(dnp.NgayBatDau),
    YEAR(dnp.NgayBatDau),
    dnp.TrangThai;
GO


-- =============================================
-- 7. STORED PROCEDURES
-- =============================================
CREATE OR ALTER PROCEDURE dbo.sp_CalculatePayroll
    @Month INT,
    @Year INT,
    @NguoiTaoId INT = 1
AS
BEGIN
    SET NOCOUNT ON;
    SET XACT_ABORT ON;
    SET DATEFIRST 7; -- Chủ nhật = 1, Thứ 2 = 2, Thứ 3 = 3, Thứ 4 = 4, Thứ 5 = 5, Thứ 6 = 6, Thứ 7 = 7 (Ổn định logic)

    BEGIN TRY
        BEGIN TRANSACTION;

        -- 1. CẤU HÌNH BIẾN CƠ BẢN
        DECLARE @StartDate DATE = DATEFROMPARTS(@Year, @Month, 1);
        DECLARE @EndDate DATE = EOMONTH(@StartDate);
        
        -- Cấu hình thuế TNCN (Tạm thời fix cứng theo yêu cầu)
        DECLARE @TaxRate DECIMAL(6,4) = 0.10; -- 10%
        DECLARE @PersonalDeduction DECIMAL(18,2) = 11000000; -- 11 triệu
        DECLARE @DependentDeduction DECIMAL(18,2) = 4400000; -- 4.4 triệu

        -- 2. LẤY SỐ GIỜ LÀM VIỆC CHUẨM MỘT NGÀY (@SoGioNgayChuan)
        -- Dựa trên giá trị lớn nhất trong lịch làm việc (thường là 8 giờ)
        DECLARE @SoGioNgayChuan FLOAT;
        SELECT @SoGioNgayChuan = MAX(SoGioLamViec) 
        FROM dbo.CauHinhLichLamViec 
        WHERE LaNgayLamViec = 1;

        IF @SoGioNgayChuan IS NULL OR @SoGioNgayChuan = 0
            THROW 50001, N'Lỗi: Không tìm thấy cấu hình số giờ làm việc chuẩn trong dbo.CauHinhLichLamViec.', 1;

        -- 3. LẤY TỶ LỆ VÀ TRẦN BẢO HIỂM HIỆN HÀNH
        DECLARE 
            @TyLeBHXH DECIMAL(6,4), 
            @TyLeBHYT DECIMAL(6,4), 
            @TyLeBHTN DECIMAL(6,4),
            @MucTranBHXH DECIMAL(18,2),
            @MucTranBHYT DECIMAL(18,2),
            @MucTranBHTN DECIMAL(18,2);
        
        SELECT 
            @TyLeBHXH = TyLeNhanVien,
            @MucTranBHXH = MucTranDong
        FROM dbo.CauHinhBaoHiem 
        WHERE LoaiBaoHiem = 'BHXH' AND DangHieuLuc = 1;

        SELECT 
            @TyLeBHYT = TyLeNhanVien,
            @MucTranBHYT = MucTranDong
        FROM dbo.CauHinhBaoHiem 
        WHERE LoaiBaoHiem = 'BHYT' AND DangHieuLuc = 1;

        SELECT 
            @TyLeBHTN = TyLeNhanVien,
            @MucTranBHTN = MucTranDong
        FROM dbo.CauHinhBaoHiem 
        WHERE LoaiBaoHiem = 'BHTN' AND DangHieuLuc = 1;

        IF @TyLeBHXH IS NULL OR @TyLeBHYT IS NULL OR @TyLeBHTN IS NULL
            THROW 50002, N'Lỗi: Thiếu cấu hình tỷ lệ bảo hiểm (BHXH, BHYT hoặc BHTN) trong dbo.CauHinhBaoHiem.', 1;

        -- 4. TÍNH SỐ NGÀY CÔNG CHUẨN (DỰA TRÊN LỊCH LÀM VIỆC VÀ NGÀY LỄ)
        -- Sử dụng Calendar CTE để tạo danh sách ngày trong tháng
        IF OBJECT_ID('tempdb..#MonthlyCalendar') IS NOT NULL DROP TABLE #MonthlyCalendar;
        
        ;WITH DateRange AS (
            SELECT @StartDate AS DateValue
            UNION ALL
            SELECT DATEADD(DAY, 1, DateValue)
            FROM DateRange
            WHERE DateValue < @EndDate
        ),
        Calendar AS (
            SELECT 
                d.DateValue,
                -- SQL Server WEEKDAY: Thứ 2 = 2, Thứ 3 = 3, Thứ 4 = 4, Thứ 5 = 5, Thứ 6 = 6, Thứ 7 = 7, Chủ nhật = 1. Chuyển Chủ nhật thành 8 để khớp CauHinhLichLamViec
                CASE WHEN DATEPART(WEEKDAY, d.DateValue) = 1 THEN 8 ELSE DATEPART(WEEKDAY, d.DateValue) END as ThuTrongTuan
            FROM DateRange d
        )
        SELECT 
            c.DateValue,
            lc.SoGioLamViec,
            lc.LaNgayLamViec,
            CASE WHEN hl.Id IS NOT NULL THEN 1 ELSE 0 END AS IsHoliday
        INTO #MonthlyCalendar
        FROM Calendar c
        JOIN dbo.CauHinhLichLamViec lc ON c.ThuTrongTuan = lc.ThuTrongTuan
        LEFT JOIN dbo.NgayLe hl ON (
            (hl.LapLaiHangNam = 1 AND MONTH(hl.NgayLe) = MONTH(c.DateValue) AND DAY(hl.NgayLe) = DAY(c.DateValue))
            OR
            (hl.LapLaiHangNam = 0 AND hl.NgayLe = c.DateValue)
        )
        OPTION (MAXRECURSION 31);

        DECLARE @SoNgayCongChuan FLOAT;
        -- Công chuẩn = Tổng giờ làm việc hợp lệ trong tháng (trừ ngày lễ) / Số giờ làm việc tiêu chuẩn của 1 ngày
        SELECT @SoNgayCongChuan = SUM(CASE WHEN IsHoliday = 1 THEN 0 ELSE SoGioLamViec END) / @SoGioNgayChuan
        FROM #MonthlyCalendar
        WHERE LaNgayLamViec = 1;

        IF @SoNgayCongChuan IS NULL OR @SoNgayCongChuan = 0
            THROW 50003, N'Lỗi: Số ngày công chuẩn bằng 0. Vui lòng kiểm tra lại cấu hình lịch làm việc.', 1;

        -- 5. TÍNH TOÁN LƯƠNG CHO TỪNG NHÂN VIÊN VÀ CẬP NHẬT PHIẾU LƯƠNG
        -- Sử dụng MERGE để xử lý đồng thời Insert hoặc Update
        MERGE dbo.PhieuLuong AS target
        USING (
            SELECT 
                nv.Id AS MaNhanVienId,
                @Month AS Thang,
                @Year AS Nam,
                ISNULL(emp_work.SoNgayCongChuanCaNhan, 0) AS SoNgayCongChuan,
                
                -- 5.1. Công thực tế (Quy đổi từ giờ)
                ISNULL(cc.TongSoGioLam, 0) / @SoGioNgayChuan AS SoNgayCongThucTe,
                ISNULL(cc.TongPhutDiMuon, 0) AS TongPhutDiMuon,
                
                -- 5.2. Nghỉ hưởng lương (Approved & CoHuongLuong = 1)
                ISNULL(np_hl.TongNgay, 0) AS SoNgayNghiHuongLuong,
                
                -- 5.3. Nghỉ không lương (Approved & CoHuongLuong = 0)
                ISNULL(np_kl.TongNgay, 0) AS SoNgayNghiKhongLuong,
                
                -- 5.4. Làm thêm (OT quy đổi theo hệ số)
                ISNULL(ot.SoGioOTQuyDoi, 0) AS SoGioLamThem,
                
                -- 5.5. Dữ liệu lương gốc
                lsl.LuongCoBan,
                lsl.PhuCap,
                
                CASE 
                    WHEN @MucTranBHXH IS NOT NULL AND lsl.LuongCoBan > @MucTranBHXH THEN @MucTranBHXH
                    ELSE lsl.LuongCoBan
                END AS LuongDongBHXH,

                CASE 
                    WHEN @MucTranBHYT IS NOT NULL AND lsl.LuongCoBan > @MucTranBHYT THEN @MucTranBHYT
                    ELSE lsl.LuongCoBan
                END AS LuongDongBHYT,

                CASE 
                    WHEN @MucTranBHTN IS NOT NULL AND lsl.LuongCoBan > @MucTranBHTN THEN @MucTranBHTN
                    ELSE lsl.LuongCoBan
                END AS LuongDongBHTN,
                
                -- 5.6. Các biến trung gian để tính toán
                -- LuongGio = LuongCoBan / SoNgayCongChuan / SoGioNgayChuan
                ISNULL(ISNULL(ot.SoGioOTQuyDoi, 0) * (lsl.LuongCoBan / NULLIF(ISNULL(emp_work.SoNgayCongChuanCaNhan, 0), 0) / @SoGioNgayChuan), 0) AS TienLamThem,
                
                ISNULL((ISNULL(cc.TongPhutDiMuon, 0) / 60.0) * (lsl.LuongCoBan / NULLIF(ISNULL(emp_work.SoNgayCongChuanCaNhan, 0), 0) / @SoGioNgayChuan), 0) AS KhauTruDiMuon,
                
                -- Khấu trừ khác = (Nghỉ không lương + Thiếu công không lý do) * Lương ngày
                ISNULL((
                    ISNULL(np_kl.TongNgay, 0)
                    + CASE
                        WHEN (ISNULL(emp_work.SoNgayCongChuanCaNhan, 0) 
                              - (ISNULL(cc.TongSoGioLam, 0) / @SoGioNgayChuan)
                              - ISNULL(np_hl.TongNgay, 0)
                              - ISNULL(np_kl.TongNgay, 0)) > 0
                        THEN (ISNULL(emp_work.SoNgayCongChuanCaNhan, 0) 
                              - (ISNULL(cc.TongSoGioLam, 0) / @SoGioNgayChuan)
                              - ISNULL(np_hl.TongNgay, 0)
                              - ISNULL(np_kl.TongNgay, 0))
                        ELSE 0
                      END
                ) * (lsl.LuongCoBan / NULLIF(ISNULL(emp_work.SoNgayCongChuanCaNhan, 0), 0)), 0) AS CacKhoanKhauTruKhac,
                
                nv.SoNguoiPhuThuoc

            FROM dbo.NhanVien nv
            INNER JOIN dbo.LichSuLuong lsl ON nv.Id = lsl.MaNhanVienId AND lsl.DangHieuLuc = 1
            
            -- Tổng hợp Chấm công
            LEFT JOIN (
                SELECT MaNhanVienId, 
                       SUM(ISNULL(SoGioLam, 0)) AS TongSoGioLam,
                       SUM(ISNULL(SoPhutDiMuon, 0)) AS TongPhutDiMuon
                FROM dbo.ChamCong
                WHERE MONTH(NgayLamViec) = @Month AND YEAR(NgayLamViec) = @Year
                GROUP BY MaNhanVienId
            ) cc ON nv.Id = cc.MaNhanVienId
            
            -- Tổng hợp Nghỉ hưởng lương
            LEFT JOIN (
                SELECT 
                    dnp.MaNhanVienId,
                    SUM(mc.SoGioLamViec / @SoGioNgayChuan) AS TongNgay
                FROM dbo.DonNghiPhep dnp
                JOIN dbo.LoaiNghiPhep lnp ON dnp.MaLoaiPhepId = lnp.Id
                JOIN #MonthlyCalendar mc
                    ON mc.DateValue BETWEEN dnp.NgayBatDau AND dnp.NgayKetThuc
                WHERE dnp.TrangThai = 'Approved'
                  AND lnp.CoHuongLuong = 1
                  AND mc.LaNgayLamViec = 1
                  AND mc.IsHoliday = 0
                GROUP BY dnp.MaNhanVienId
            ) np_hl ON nv.Id = np_hl.MaNhanVienId
            
            -- Tổng hợp Nghỉ không lương
            LEFT JOIN (
                SELECT 
                    dnp.MaNhanVienId,
                    SUM(mc.SoGioLamViec / @SoGioNgayChuan) AS TongNgay
                FROM dbo.DonNghiPhep dnp
                JOIN dbo.LoaiNghiPhep lnp ON dnp.MaLoaiPhepId = lnp.Id
                JOIN #MonthlyCalendar mc
                    ON mc.DateValue BETWEEN dnp.NgayBatDau AND dnp.NgayKetThuc
                WHERE dnp.TrangThai = 'Approved'
                  AND lnp.CoHuongLuong = 0
                  AND mc.LaNgayLamViec = 1
                  AND mc.IsHoliday = 0
                GROUP BY dnp.MaNhanVienId
            ) np_kl ON nv.Id = np_kl.MaNhanVienId
            
            -- Tổng hợp Làm thêm (OT)
            LEFT JOIN (
                SELECT MaNhanVienId, SUM(TongSoGio * HeSoOT) AS SoGioOTQuyDoi
                FROM dbo.DonLamThem
                WHERE TrangThai = 'Approved'
                AND NgayLamThem BETWEEN @StartDate AND @EndDate
                GROUP BY MaNhanVienId
            ) ot ON nv.Id = ot.MaNhanVienId
            
            CROSS APPLY (
                SELECT
                    CASE 
                        WHEN nv.NgayVaoLam > @StartDate THEN nv.NgayVaoLam 
                        ELSE @StartDate 
                    END AS EmployeeStartDate,
                    CASE 
                        WHEN nv.NgayNghiViec IS NOT NULL AND nv.NgayNghiViec < @EndDate THEN nv.NgayNghiViec 
                        ELSE @EndDate 
                    END AS EmployeeEndDate
            ) emp_range
            
            OUTER APPLY (
                SELECT 
                    SUM(CASE 
                        WHEN mc.IsHoliday = 1 THEN 0 
                        ELSE mc.SoGioLamViec 
                    END) / @SoGioNgayChuan AS SoNgayCongChuanCaNhan
                FROM #MonthlyCalendar mc
                WHERE mc.LaNgayLamViec = 1
                  AND mc.DateValue BETWEEN emp_range.EmployeeStartDate AND emp_range.EmployeeEndDate
            ) emp_work
            
            WHERE nv.NgayVaoLam <= @EndDate
              AND (nv.NgayNghiViec IS NULL OR nv.NgayNghiViec >= @StartDate)
        ) AS source
        ON (target.MaNhanVienId = source.MaNhanVienId AND target.Thang = source.Thang AND target.Nam = source.Nam)
        
        WHEN MATCHED AND ISNULL(target.TrangThai, '') <> 'Paid' THEN
            UPDATE SET 
                SoNgayCongChuan = source.SoNgayCongChuan,
                SoNgayCongThucTe = source.SoNgayCongThucTe,
                SoNgayNghiHuongLuong = source.SoNgayNghiHuongLuong,
                SoGioLamThem = source.SoGioLamThem,
                LuongCoBan = source.LuongCoBan,
                PhuCap = source.PhuCap,
                TienLamThem = source.TienLamThem,
                KhauTruDiMuon = source.KhauTruDiMuon,
                BaoHiemXaHoi = source.LuongDongBHXH * @TyLeBHXH,
                BaoHiemYTe = source.LuongDongBHYT * @TyLeBHYT,
                BaoHiemThatNghiep = source.LuongDongBHTN * @TyLeBHTN,
                CacKhoanKhauTruKhac = source.CacKhoanKhauTruKhac,
                TongLuongGop = source.LuongCoBan + source.PhuCap + source.TienLamThem,
                ThueTNCN = CASE 
                    WHEN (source.LuongCoBan + source.PhuCap + source.TienLamThem - (source.LuongDongBHXH * @TyLeBHXH + source.LuongDongBHYT * @TyLeBHYT + source.LuongDongBHTN * @TyLeBHTN) - @PersonalDeduction - source.SoNguoiPhuThuoc * @DependentDeduction) > 0 
                    THEN (source.LuongCoBan + source.PhuCap + source.TienLamThem - (source.LuongDongBHXH * @TyLeBHXH + source.LuongDongBHYT * @TyLeBHYT + source.LuongDongBHTN * @TyLeBHTN) - @PersonalDeduction - source.SoNguoiPhuThuoc * @DependentDeduction) * @TaxRate 
                    ELSE 0 END,
                LuongThucNhan = CASE
                    WHEN (
                        (source.LuongCoBan + source.PhuCap + source.TienLamThem)
                        - (source.LuongDongBHXH * @TyLeBHXH + source.LuongDongBHYT * @TyLeBHYT + source.LuongDongBHTN * @TyLeBHTN)
                        - (CASE
                            WHEN (source.LuongCoBan + source.PhuCap + source.TienLamThem - (source.LuongDongBHXH * @TyLeBHXH + source.LuongDongBHYT * @TyLeBHYT + source.LuongDongBHTN * @TyLeBHTN) - @PersonalDeduction - source.SoNguoiPhuThuoc * @DependentDeduction) > 0
                            THEN (source.LuongCoBan + source.PhuCap + source.TienLamThem - (source.LuongDongBHXH * @TyLeBHXH + source.LuongDongBHYT * @TyLeBHYT + source.LuongDongBHTN * @TyLeBHTN) - @PersonalDeduction - source.SoNguoiPhuThuoc * @DependentDeduction) * @TaxRate
                            ELSE 0 END)
                        - source.KhauTruDiMuon
                        - source.CacKhoanKhauTruKhac
                    ) < 0 THEN 0
                    ELSE
                        (source.LuongCoBan + source.PhuCap + source.TienLamThem)
                        - (source.LuongDongBHXH * @TyLeBHXH + source.LuongDongBHYT * @TyLeBHYT + source.LuongDongBHTN * @TyLeBHTN)
                        - (CASE
                            WHEN (source.LuongCoBan + source.PhuCap + source.TienLamThem - (source.LuongDongBHXH * @TyLeBHXH + source.LuongDongBHYT * @TyLeBHYT + source.LuongDongBHTN * @TyLeBHTN) - @PersonalDeduction - source.SoNguoiPhuThuoc * @DependentDeduction) > 0
                            THEN (source.LuongCoBan + source.PhuCap + source.TienLamThem - (source.LuongDongBHXH * @TyLeBHXH + source.LuongDongBHYT * @TyLeBHYT + source.LuongDongBHTN * @TyLeBHTN) - @PersonalDeduction - source.SoNguoiPhuThuoc * @DependentDeduction) * @TaxRate
                            ELSE 0 END)
                        - source.KhauTruDiMuon
                        - source.CacKhoanKhauTruKhac
                    END,
                NguoiTaoId = @NguoiTaoId
        
        WHEN NOT MATCHED THEN
            INSERT (
                MaNhanVienId, Thang, Nam, SoNgayCongChuan, SoNgayCongThucTe, SoNgayNghiHuongLuong, SoGioLamThem,
                LuongCoBan, PhuCap, TienLamThem, KhauTruDiMuon, BaoHiemXaHoi, BaoHiemYTe, BaoHiemThatNghiep,
                ThueTNCN, CacKhoanKhauTruKhac, TongLuongGop, LuongThucNhan, TrangThai, NguoiTaoId
            )
            VALUES (
                source.MaNhanVienId, source.Thang, source.Nam, source.SoNgayCongChuan, source.SoNgayCongThucTe, source.SoNgayNghiHuongLuong, source.SoGioLamThem,
                source.LuongCoBan, source.PhuCap, source.TienLamThem, source.KhauTruDiMuon, 
                source.LuongDongBHXH * @TyLeBHXH, source.LuongDongBHYT * @TyLeBHYT, source.LuongDongBHTN * @TyLeBHTN,
                -- Tính Thuế TNCN
                CASE 
                    WHEN (source.LuongCoBan + source.PhuCap + source.TienLamThem - (source.LuongDongBHXH * @TyLeBHXH + source.LuongDongBHYT * @TyLeBHYT + source.LuongDongBHTN * @TyLeBHTN) - @PersonalDeduction - source.SoNguoiPhuThuoc * @DependentDeduction) > 0 
                    THEN (source.LuongCoBan + source.PhuCap + source.TienLamThem - (source.LuongDongBHXH * @TyLeBHXH + source.LuongDongBHYT * @TyLeBHYT + source.LuongDongBHTN * @TyLeBHTN) - @PersonalDeduction - source.SoNguoiPhuThuoc * @DependentDeduction) * @TaxRate 
                    ELSE 0 END,
                source.CacKhoanKhauTruKhac,
                source.LuongCoBan + source.PhuCap + source.TienLamThem,
                -- Tính Lương thực nhận
                CASE
                    WHEN (
                        (source.LuongCoBan + source.PhuCap + source.TienLamThem)
                        - (source.LuongDongBHXH * @TyLeBHXH + source.LuongDongBHYT * @TyLeBHYT + source.LuongDongBHTN * @TyLeBHTN)
                        - (CASE
                            WHEN (source.LuongCoBan + source.PhuCap + source.TienLamThem - (source.LuongDongBHXH * @TyLeBHXH + source.LuongDongBHYT * @TyLeBHYT + source.LuongDongBHTN * @TyLeBHTN) - @PersonalDeduction - source.SoNguoiPhuThuoc * @DependentDeduction) > 0
                            THEN (source.LuongCoBan + source.PhuCap + source.TienLamThem - (source.LuongDongBHXH * @TyLeBHXH + source.LuongDongBHYT * @TyLeBHYT + source.LuongDongBHTN * @TyLeBHTN) - @PersonalDeduction - source.SoNguoiPhuThuoc * @DependentDeduction) * @TaxRate
                            ELSE 0 END)
                        - source.KhauTruDiMuon
                        - source.CacKhoanKhauTruKhac
                    ) < 0 THEN 0
                    ELSE
                        (source.LuongCoBan + source.PhuCap + source.TienLamThem)
                        - (source.LuongDongBHXH * @TyLeBHXH + source.LuongDongBHYT * @TyLeBHYT + source.LuongDongBHTN * @TyLeBHTN)
                        - (CASE
                            WHEN (source.LuongCoBan + source.PhuCap + source.TienLamThem - (source.LuongDongBHXH * @TyLeBHXH + source.LuongDongBHYT * @TyLeBHYT + source.LuongDongBHTN * @TyLeBHTN) - @PersonalDeduction - source.SoNguoiPhuThuoc * @DependentDeduction) > 0
                            THEN (source.LuongCoBan + source.PhuCap + source.TienLamThem - (source.LuongDongBHXH * @TyLeBHXH + source.LuongDongBHYT * @TyLeBHYT + source.LuongDongBHTN * @TyLeBHTN) - @PersonalDeduction - source.SoNguoiPhuThuoc * @DependentDeduction) * @TaxRate
                            ELSE 0 END)
                        - source.KhauTruDiMuon
                        - source.CacKhoanKhauTruKhac
                    END,
                'Draft', @NguoiTaoId
            );

        IF OBJECT_ID('tempdb..#MonthlyCalendar') IS NOT NULL DROP TABLE #MonthlyCalendar;
        
        COMMIT TRANSACTION;
        PRINT N'Thành công: Đã tính bảng lương cho tháng ' + CAST(@Month AS VARCHAR) + '/' + CAST(@Year AS VARCHAR);

    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0 ROLLBACK TRANSACTION;
        IF OBJECT_ID('tempdb..#MonthlyCalendar') IS NOT NULL DROP TABLE #MonthlyCalendar;
        
        DECLARE @ErrorMessage NVARCHAR(4000) = ERROR_MESSAGE();
        DECLARE @ErrorSeverity INT = ERROR_SEVERITY();
        DECLARE @ErrorState INT = ERROR_STATE();
        
        RAISERROR(@ErrorMessage, @ErrorSeverity, @ErrorState);
    END CATCH
END
GO
-- TEST SCRIPT
-- EXEC dbo.sp_CalculatePayroll @Month = 3, @Year = 2026, @NguoiTaoId = 1;
-- SELECT * FROM dbo.PhieuLuong WHERE Thang = 3 AND Nam = 2026;
