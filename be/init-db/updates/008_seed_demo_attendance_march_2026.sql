USE NextHR;
GO

BEGIN TRANSACTION;

-- Xoá dữ liệu demo cũ tháng 3/2026 để seed lại cho sạch
DELETE FROM dbo.ChamCong
WHERE NgayLamViec BETWEEN '2026-03-01' AND '2026-03-31';

DELETE FROM dbo.DonLamThem
WHERE NgayLamThem BETWEEN '2026-03-01' AND '2026-03-31';

DELETE FROM dbo.DonNghiPhep
WHERE NgayBatDau <= '2026-03-31'
  AND NgayKetThuc >= '2026-03-01';

DELETE FROM dbo.PhieuLuong
WHERE Thang = 3 AND Nam = 2026
  AND TrangThai <> N'Paid';

------------------------------------------------------------
-- 1. Nghỉ phép demo
------------------------------------------------------------

-- Lan nghỉ phép có lương 1 ngày
INSERT INTO dbo.DonNghiPhep (
    MaNhanVienId, MaLoaiPhepId, NgayBatDau, NgayKetThuc,
    TongSoNgay, LyDo, TrangThai, NguoiDuyetId, NgayDuyet
)
VALUES
(2, 1, '2026-03-10', '2026-03-10', 1, N'Nghỉ việc gia đình', N'Approved', 1, GETDATE());

-- Bảo nghỉ không lương 1 ngày
INSERT INTO dbo.DonNghiPhep (
    MaNhanVienId, MaLoaiPhepId, NgayBatDau, NgayKetThuc,
    TongSoNgay, LyDo, TrangThai, NguoiDuyetId, NgayDuyet
)
VALUES
(5, 3, '2026-03-16', '2026-03-16', 1, N'Nghỉ việc cá nhân không lương', N'Approved', 1, GETDATE());

------------------------------------------------------------
-- 2. OT demo
------------------------------------------------------------

-- Hà OT ngày thường: 2 giờ * 1.5 = 3 giờ quy đổi
INSERT INTO dbo.DonLamThem (
    MaNhanVienId, NgayLamThem, GioBatDau, GioKetThuc,
    TongSoGio, LoaiOT, HeSoOT, LyDo, TrangThai, NguoiDuyetId
)
VALUES
(4, '2026-03-03', '18:00', '20:00', 2, N'NgayThuong', 1.50, N'Hoàn thành sprint', N'Approved', 3);

-- Khoa OT cuối tuần: 4 giờ * 2.0 = 8 giờ quy đổi
INSERT INTO dbo.DonLamThem (
    MaNhanVienId, NgayLamThem, GioBatDau, GioKetThuc,
    TongSoGio, LoaiOT, HeSoOT, LyDo, TrangThai, NguoiDuyetId
)
VALUES
(3, '2026-03-08', '08:00', '12:00', 4, N'CuoiTuan', 2.00, N'Hỗ trợ triển khai hệ thống', N'Approved', 1);

------------------------------------------------------------
-- 3. Chấm công demo tháng 3/2026
-- Lịch làm việc: T2-T6 = 8h, T7 = 4h, CN nghỉ
-- Tháng 3/2026 có 24 công chuẩn theo schema hiện tại
------------------------------------------------------------

DECLARE @d DATE = '2026-03-01';

WHILE @d <= '2026-03-31'
BEGIN
    -- Chỉ seed ngày làm việc: T2-T7, bỏ Chủ nhật
    IF DATEPART(WEEKDAY, @d) <> 1
    BEGIN
        DECLARE @standardHours FLOAT =
            CASE 
                WHEN DATEPART(WEEKDAY, @d) = 7 THEN 4
                ELSE 8
            END;

        -- Hùng: đi làm đủ gần full tháng
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

        -- Lan: nghỉ phép ngày 10/03 nên không chấm công ngày đó
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

        -- Khoa: đi làm đủ nhưng có vài ngày đi muộn
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

        -- Hà: đi làm đủ, có OT riêng ở DonLamThem
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

        -- Bảo: thiếu vài ngày để demo khấu trừ
        -- Bỏ 16/03 vì nghỉ không lương, bỏ 23/03 và 24/03 như nghỉ không lý do
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

COMMIT TRANSACTION;
GO

PRINT N'Đã seed dữ liệu demo chấm công tháng 3/2026';
GO