USE NextHR;
GO

-- Seed kỳ nghỉ dài / Tết / nghỉ bù năm 2026
-- Lưu ý: Tết âm lịch và nghỉ bù dùng LapLaiHangNam = 0 vì ngày thay đổi theo từng năm.

IF NOT EXISTS (SELECT 1 FROM dbo.NgayLe WHERE NgayLe = '2026-02-16')
BEGIN
    INSERT INTO dbo.NgayLe (NgayLe, TenNgayLe, LapLaiHangNam)
    VALUES ('2026-02-16', N'Tết Nguyên Đán 2026 - Ngày nghỉ 1', 0);
END;

IF NOT EXISTS (SELECT 1 FROM dbo.NgayLe WHERE NgayLe = '2026-02-17')
BEGIN
    INSERT INTO dbo.NgayLe (NgayLe, TenNgayLe, LapLaiHangNam)
    VALUES ('2026-02-17', N'Tết Nguyên Đán 2026 - Mùng 1', 0);
END;

IF NOT EXISTS (SELECT 1 FROM dbo.NgayLe WHERE NgayLe = '2026-02-18')
BEGIN
    INSERT INTO dbo.NgayLe (NgayLe, TenNgayLe, LapLaiHangNam)
    VALUES ('2026-02-18', N'Tết Nguyên Đán 2026 - Mùng 2', 0);
END;

IF NOT EXISTS (SELECT 1 FROM dbo.NgayLe WHERE NgayLe = '2026-02-19')
BEGIN
    INSERT INTO dbo.NgayLe (NgayLe, TenNgayLe, LapLaiHangNam)
    VALUES ('2026-02-19', N'Tết Nguyên Đán 2026 - Mùng 3', 0);
END;

IF NOT EXISTS (SELECT 1 FROM dbo.NgayLe WHERE NgayLe = '2026-02-20')
BEGIN
    INSERT INTO dbo.NgayLe (NgayLe, TenNgayLe, LapLaiHangNam)
    VALUES ('2026-02-20', N'Tết Nguyên Đán 2026 - Ngày nghỉ 5', 0);
END;
GO

SELECT *
FROM dbo.NgayLe
WHERE NgayLe BETWEEN '2026-02-01' AND '2026-02-28'
ORDER BY NgayLe;
GO