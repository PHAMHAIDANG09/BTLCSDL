USE NextHR;
GO

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
        'NhanVien',
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
        'NhanVien',
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

SELECT name, parent_class_desc, OBJECT_NAME(parent_id) AS TableName
FROM sys.triggers
WHERE name IN (
    'trg_Audit_NhanVien',
    'trg_Audit_DonNghiPhep',
    'trg_Audit_PhieuLuong'
);
GO
