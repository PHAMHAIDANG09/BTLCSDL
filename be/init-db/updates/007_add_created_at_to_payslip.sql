USE NextHR;
GO

IF COL_LENGTH('dbo.PhieuLuong', 'NgayTao') IS NULL
BEGIN
    ALTER TABLE dbo.PhieuLuong
    ADD NgayTao DATETIME NOT NULL
        CONSTRAINT DF_PhieuLuong_NgayTao DEFAULT (GETDATE());
END;
GO