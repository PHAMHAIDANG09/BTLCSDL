USE NextHR;
GO

IF NOT EXISTS (
    SELECT * FROM sys.columns 
    WHERE object_id = OBJECT_ID(N'[dbo].[DonLamThem]') 
    AND name = 'NgayDuyet'
)
BEGIN
    ALTER TABLE [dbo].[DonLamThem] ADD [NgayDuyet] DATETIME NULL;
END
GO
