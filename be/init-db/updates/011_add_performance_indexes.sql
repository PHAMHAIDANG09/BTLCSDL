USE NextHR;
GO

IF NOT EXISTS (
    SELECT 1
    FROM sys.indexes
    WHERE name = 'IDX_ChamCong_Ngay_NhanVien'
      AND object_id = OBJECT_ID('dbo.ChamCong')
)
BEGIN
    CREATE INDEX IDX_ChamCong_Ngay_NhanVien
    ON dbo.ChamCong (NgayLamViec, MaNhanVienId);
END
GO

IF NOT EXISTS (
    SELECT 1
    FROM sys.indexes
    WHERE name = 'IDX_DonNghiPhep_TrangThai_Ngay_NhanVien'
      AND object_id = OBJECT_ID('dbo.DonNghiPhep')
)
BEGIN
    CREATE INDEX IDX_DonNghiPhep_TrangThai_Ngay_NhanVien
    ON dbo.DonNghiPhep (TrangThai, NgayBatDau, NgayKetThuc, MaNhanVienId);
END
GO

IF NOT EXISTS (
    SELECT 1
    FROM sys.indexes
    WHERE name = 'IDX_DonLamThem_TrangThai_Ngay_NhanVien'
      AND object_id = OBJECT_ID('dbo.DonLamThem')
)
BEGIN
    CREATE INDEX IDX_DonLamThem_TrangThai_Ngay_NhanVien
    ON dbo.DonLamThem (TrangThai, NgayLamThem, MaNhanVienId);
END
GO

IF NOT EXISTS (
    SELECT 1
    FROM sys.indexes
    WHERE name = 'IDX_PhieuLuong_Nam_Thang'
      AND object_id = OBJECT_ID('dbo.PhieuLuong')
)
BEGIN
    CREATE INDEX IDX_PhieuLuong_Nam_Thang
    ON dbo.PhieuLuong (Nam, Thang);
END
GO

IF NOT EXISTS (
    SELECT 1
    FROM sys.indexes
    WHERE name = 'IDX_HopDong_TrangThai_NgayKetThuc'
      AND object_id = OBJECT_ID('dbo.HopDong')
)
BEGIN
    CREATE INDEX IDX_HopDong_TrangThai_NgayKetThuc
    ON dbo.HopDong (TrangThai, NgayKetThuc);
END
GO

SELECT
    i.name AS IndexName,
    OBJECT_NAME(i.object_id) AS TableName,
    i.type_desc AS IndexType,
    i.is_unique AS IsUnique
FROM sys.indexes i
WHERE i.name IN (
    'IDX_ChamCong_Ngay_NhanVien',
    'IDX_DonNghiPhep_TrangThai_Ngay_NhanVien',
    'IDX_DonLamThem_TrangThai_Ngay_NhanVien',
    'IDX_PhieuLuong_Nam_Thang',
    'IDX_HopDong_TrangThai_NgayKetThuc'
)
ORDER BY TableName, IndexName;
GO
