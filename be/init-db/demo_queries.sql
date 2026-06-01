USE NextHR;
GO

-- =============================================
-- 1. KIEM TRA BANG VA COT QUAN TRONG
-- =============================================
SELECT
    c.TABLE_NAME,
    c.COLUMN_NAME,
    c.DATA_TYPE,
    c.IS_NULLABLE,
    c.COLUMN_DEFAULT
FROM INFORMATION_SCHEMA.COLUMNS c
WHERE
    (c.TABLE_NAME = 'PhieuLuong' AND c.COLUMN_NAME IN ('NgayTao', 'SoNgayCongChuan'))
    OR (c.TABLE_NAME = 'CauHinhBaoHiem' AND c.COLUMN_NAME = 'MucTranDong')
ORDER BY c.TABLE_NAME, c.COLUMN_NAME;
GO

SELECT
    LoaiBaoHiem,
    TyLeNhanVien,
    TyLeCongTy,
    MucTranDong,
    DangHieuLuc
FROM dbo.CauHinhBaoHiem
ORDER BY LoaiBaoHiem;
GO

SELECT
    LoaiOT,
    HeSoOT,
    MoTa,
    DangHieuLuc
FROM dbo.CauHinhOT
ORDER BY LoaiOT;
GO

-- =============================================
-- 2. CHAY STORED PROCEDURE TINH LUONG THANG 3/2026
-- =============================================
EXEC dbo.sp_CalculatePayroll @Month = 3, @Year = 2026, @NguoiTaoId = 1;
GO

SELECT
    pl.Id,
    nv.MaNhanVien,
    nv.HoTen,
    pl.Thang,
    pl.Nam,
    pl.SoNgayCongChuan,
    pl.SoNgayCongThucTe,
    pl.SoNgayNghiHuongLuong,
    pl.SoGioLamThem,
    pl.TongLuongGop,
    pl.LuongThucNhan,
    pl.TrangThai,
    pl.NgayTao
FROM dbo.PhieuLuong pl
INNER JOIN dbo.NhanVien nv ON nv.Id = pl.MaNhanVienId
WHERE pl.Thang = 3 AND pl.Nam = 2026
ORDER BY nv.MaNhanVien;
GO

-- =============================================
-- 3. VIEW BAO CAO LUONG TONG HOP
-- =============================================
SELECT TOP 20 *
FROM dbo.vw_BangLuongTongHop
WHERE Thang = 3 AND Nam = 2026
ORDER BY MaNhanVien;
GO

-- =============================================
-- 4. VIEW BAO CAO CHAM CONG THANG
-- =============================================
SELECT TOP 20 *
FROM dbo.vw_ChamCongThang
WHERE Thang = 3 AND Nam = 2026
ORDER BY MaNhanVien;
GO

-- =============================================
-- 5. VIEW THONG KE NGHI PHEP
-- =============================================
SELECT TOP 20 *
FROM dbo.vw_ThongKeNghiPhep
WHERE Thang = 3 AND Nam = 2026
ORDER BY MaNhanVien;
GO

-- =============================================
-- 6. TEST AUDIT TRIGGER NHANVIEN TRONG TRANSACTION ROLLBACK
-- =============================================
DECLARE @BeforeNhanVienLogId INT;

SELECT @BeforeNhanVienLogId = ISNULL(MAX(Id), 0)
FROM dbo.NhatKyHeThong;

BEGIN TRANSACTION;

UPDATE dbo.NhanVien
SET SoDienThoai = '0999999999'
WHERE Id = 1;

SELECT
    Id,
    TenBang,
    MaBanGhi,
    HanhDong,
    GiaTriCu,
    GiaTriMoi,
    MaNguoiThucHienId,
    NgayThucHien
FROM dbo.NhatKyHeThong
WHERE Id > @BeforeNhanVienLogId
ORDER BY Id;

ROLLBACK TRANSACTION;
GO

-- =============================================
-- 7. TEST AUDIT TRIGGER PHIEULUONG TRONG TRANSACTION ROLLBACK
-- =============================================
DECLARE @BeforePhieuLuongLogId INT;
DECLARE @PhieuLuongId INT;

SELECT @BeforePhieuLuongLogId = ISNULL(MAX(Id), 0)
FROM dbo.NhatKyHeThong;

SELECT TOP 1 @PhieuLuongId = Id
FROM dbo.PhieuLuong
WHERE Thang = 3 AND Nam = 2026
ORDER BY Id;

BEGIN TRANSACTION;

UPDATE dbo.PhieuLuong
SET GhiChu = N'Demo audit trigger PhieuLuong'
WHERE Id = @PhieuLuongId;

SELECT
    Id,
    TenBang,
    MaBanGhi,
    HanhDong,
    GiaTriCu,
    GiaTriMoi,
    MaNguoiThucHienId,
    NgayThucHien
FROM dbo.NhatKyHeThong
WHERE Id > @BeforePhieuLuongLogId
ORDER BY Id;

ROLLBACK TRANSACTION;
GO

-- =============================================
-- 8. TEST CHECK CONSTRAINT PHIEULUONG.THANG TRONG TRY/CATCH VA ROLLBACK
-- =============================================
BEGIN TRY
    BEGIN TRANSACTION;

    INSERT INTO dbo.PhieuLuong (
        MaNhanVienId,
        Thang,
        Nam,
        SoNgayCongChuan,
        SoNgayCongThucTe,
        SoNgayNghiHuongLuong,
        SoGioLamThem,
        LuongCoBan,
        PhuCap,
        TienLamThem,
        KhauTruDiMuon,
        BaoHiemXaHoi,
        BaoHiemYTe,
        BaoHiemThatNghiep,
        ThueTNCN,
        CacKhoanKhauTruKhac,
        TongLuongGop,
        LuongThucNhan,
        TrangThai,
        NgayThanhToan,
        GhiChu,
        NguoiTaoId
    )
    VALUES (
        1,
        13,
        2026,
        24,
        24,
        0,
        0,
        35000000,
        5000000,
        0,
        0,
        2808000,
        702000,
        350000,
        0,
        0,
        40000000,
        36140000,
        N'Draft',
        NULL,
        N'Demo CHECK constraint Thang',
        1
    );

    ROLLBACK TRANSACTION;
END TRY
BEGIN CATCH
    IF XACT_STATE() <> 0
    BEGIN
        ROLLBACK TRANSACTION;
    END;

    SELECT
        ERROR_NUMBER() AS ErrorNumber,
        ERROR_MESSAGE() AS ErrorMessage;
END CATCH;
GO

-- =============================================
-- 9. TEST UNIQUE CONSTRAINT CHAMCONG TRONG TRY/CATCH VA ROLLBACK
-- =============================================
DECLARE @MaNhanVienId INT;
DECLARE @NgayLamViec DATE;

SELECT TOP 1
    @MaNhanVienId = MaNhanVienId,
    @NgayLamViec = NgayLamViec
FROM dbo.ChamCong
WHERE NgayLamViec BETWEEN '2026-03-01' AND '2026-03-31'
ORDER BY MaNhanVienId, NgayLamViec;

BEGIN TRY
    BEGIN TRANSACTION;

    INSERT INTO dbo.ChamCong (
        MaNhanVienId,
        NgayLamViec,
        GioVao,
        GioRa,
        SoGioLam,
        SoPhutDiMuon,
        TrangThai,
        NguonChamCong
    )
    VALUES (
        @MaNhanVienId,
        @NgayLamViec,
        DATEADD(HOUR, 8, CAST(@NgayLamViec AS DATETIME)),
        DATEADD(HOUR, 17, CAST(@NgayLamViec AS DATETIME)),
        8,
        0,
        N'CoMat',
        N'Manual'
    );

    ROLLBACK TRANSACTION;
END TRY
BEGIN CATCH
    IF XACT_STATE() <> 0
    BEGIN
        ROLLBACK TRANSACTION;
    END;

    SELECT
        ERROR_NUMBER() AS ErrorNumber,
        ERROR_MESSAGE() AS ErrorMessage;
END CATCH;
GO
