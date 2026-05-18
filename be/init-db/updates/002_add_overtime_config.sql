USE NextHR;
GO

-- 1. Tạo bảng dbo.CauHinhOT nếu chưa tồn tại
IF OBJECT_ID('dbo.CauHinhOT', 'U') IS NULL
BEGIN
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
    PRINT 'Đã tạo bảng dbo.CauHinhOT';
END
ELSE
BEGIN
    -- 2. Thêm các constraint nếu bảng đã tồn tại nhưng chưa có các constraint đó
    -- Check unique constraint UQ_CauHinhOT_LoaiOT
    IF NOT EXISTS (
        SELECT 1 
        FROM sys.objects 
        WHERE parent_object_id = OBJECT_ID('dbo.CauHinhOT') 
          AND name = 'UQ_CauHinhOT_LoaiOT' 
          AND type = 'UQ'
    )
    BEGIN
        ALTER TABLE dbo.CauHinhOT 
        ADD CONSTRAINT UQ_CauHinhOT_LoaiOT UNIQUE (LoaiOT);
        PRINT 'Đã thêm UNIQUE constraint UQ_CauHinhOT_LoaiOT';
    END

    -- Check check constraint CK_CauHinhOT_HeSoOT
    IF NOT EXISTS (
        SELECT 1 
        FROM sys.objects 
        WHERE parent_object_id = OBJECT_ID('dbo.CauHinhOT') 
          AND name = 'CK_CauHinhOT_HeSoOT' 
          AND type = 'C'
    )
    BEGIN
        ALTER TABLE dbo.CauHinhOT 
        ADD CONSTRAINT CK_CauHinhOT_HeSoOT CHECK (HeSoOT > 0);
        PRINT 'Đã thêm CHECK constraint CK_CauHinhOT_HeSoOT';
    END
END
GO

-- 3. Seed dữ liệu mẫu nếu chưa tồn tại dữ liệu tương ứng
IF NOT EXISTS (SELECT 1 FROM dbo.CauHinhOT WHERE LoaiOT = N'NgayThuong')
BEGIN
    INSERT INTO dbo.CauHinhOT (LoaiOT, HeSoOT, MoTa, DangHieuLuc)
    VALUES (N'NgayThuong', 1.50, N'Làm thêm ngày thường', 1);
    PRINT 'Đã thêm dữ liệu mẫu NgayThuong';
END

IF NOT EXISTS (SELECT 1 FROM dbo.CauHinhOT WHERE LoaiOT = N'CuoiTuan')
BEGIN
    INSERT INTO dbo.CauHinhOT (LoaiOT, HeSoOT, MoTa, DangHieuLuc)
    VALUES (N'CuoiTuan', 2.00, N'Làm thêm cuối tuần/ngày nghỉ', 1);
    PRINT 'Đã thêm dữ liệu mẫu CuoiTuan';
END

IF NOT EXISTS (SELECT 1 FROM dbo.CauHinhOT WHERE LoaiOT = N'NgayLe')
BEGIN
    INSERT INTO dbo.CauHinhOT (LoaiOT, HeSoOT, MoTa, DangHieuLuc)
    VALUES (N'NgayLe', 3.00, N'Làm thêm ngày lễ', 1);
    PRINT 'Đã thêm dữ liệu mẫu NgayLe';
END
GO
