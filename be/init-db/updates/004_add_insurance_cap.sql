USE NextHR;
GO

-- 1. Them cot MucTranDong neu chua co
IF NOT EXISTS (
    SELECT 1 
    FROM sys.columns 
    WHERE object_id = OBJECT_ID('dbo.CauHinhBaoHiem') 
      AND name = 'MucTranDong'
)
BEGIN
    ALTER TABLE dbo.CauHinhBaoHiem
    ADD MucTranDong DECIMAL(18,2) NULL;
    PRINT 'Da them cot MucTranDong vao bang dbo.CauHinhBaoHiem';
END
GO

-- 2. Them check constraint neu chua co
IF NOT EXISTS (
    SELECT 1 
    FROM sys.check_constraints 
    WHERE parent_object_id = OBJECT_ID('dbo.CauHinhBaoHiem') 
      AND name = 'CK_CauHinhBaoHiem_MucTranDong'
)
BEGIN
    ALTER TABLE dbo.CauHinhBaoHiem
    ADD CONSTRAINT CK_CauHinhBaoHiem_MucTranDong 
    CHECK (MucTranDong IS NULL OR MucTranDong >= 0);
    PRINT 'Da them check constraint CK_CauHinhBaoHiem_MucTranDong';
END
GO

-- 3. Cap nhat du lieu mau hien hanh cho cac cau hinh dang hieu luc (DangHieuLuc = 1)
UPDATE dbo.CauHinhBaoHiem
SET MucTranDong = 46800000
WHERE LoaiBaoHiem = 'BHXH' AND DangHieuLuc = 1;

UPDATE dbo.CauHinhBaoHiem
SET MucTranDong = 46800000
WHERE LoaiBaoHiem = 'BHYT' AND DangHieuLuc = 1;

UPDATE dbo.CauHinhBaoHiem
SET MucTranDong = 93600000
WHERE LoaiBaoHiem = 'BHTN' AND DangHieuLuc = 1;

PRINT 'Da cap nhat MucTranDong cho cac cau hinh bao hiem dang hieu luc';
GO
