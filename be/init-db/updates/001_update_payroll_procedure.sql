USE NextHR;
GO

IF OBJECT_ID('dbo.sp_CalculatePayroll', 'P') IS NOT NULL
    DROP PROCEDURE dbo.sp_CalculatePayroll;
GO

CREATE PROCEDURE dbo.sp_CalculatePayroll
    @Month INT,
    @Year INT,
    @NguoiTaoId INT = 1
AS
BEGIN
    SET NOCOUNT ON;
    SET XACT_ABORT ON;
    SET DATEFIRST 7; -- Chủ nhật = 1, Thứ 2 = 2, ..., Thứ 7 = 7 (Ổn định logic)

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

        -- 3. LẤY TỶ LỆ BẢO HIỂM HIỆN HÀNH
        DECLARE @TyLeBHXH DECIMAL(6,4), @TyLeBHYT DECIMAL(6,4), @TyLeBHTN DECIMAL(6,4);
        
        SELECT @TyLeBHXH = TyLeNhanVien FROM dbo.CauHinhBaoHiem WHERE LoaiBaoHiem = 'BHXH' AND DangHieuLuc = 1;
        SELECT @TyLeBHYT = TyLeNhanVien FROM dbo.CauHinhBaoHiem WHERE LoaiBaoHiem = 'BHYT' AND DangHieuLuc = 1;
        SELECT @TyLeBHTN = TyLeNhanVien FROM dbo.CauHinhBaoHiem WHERE LoaiBaoHiem = 'BHTN' AND DangHieuLuc = 1;

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
                -- SQL Server WEEKDAY: T2=2...T7=7, CN=1. Chuyển CN thành 8 để khớp CauHinhLichLamViec
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
                BaoHiemXaHoi = source.LuongCoBan * @TyLeBHXH,
                BaoHiemYTe = source.LuongCoBan * @TyLeBHYT,
                BaoHiemThatNghiep = source.LuongCoBan * @TyLeBHTN,
                CacKhoanKhauTruKhac = source.CacKhoanKhauTruKhac,
                TongLuongGop = source.LuongCoBan + source.PhuCap + source.TienLamThem,
                ThueTNCN = CASE 
                    WHEN (source.LuongCoBan + source.PhuCap + source.TienLamThem - (source.LuongCoBan * (@TyLeBHXH + @TyLeBHYT + @TyLeBHTN)) - @PersonalDeduction - source.SoNguoiPhuThuoc * @DependentDeduction) > 0 
                    THEN (source.LuongCoBan + source.PhuCap + source.TienLamThem - (source.LuongCoBan * (@TyLeBHXH + @TyLeBHYT + @TyLeBHTN)) - @PersonalDeduction - source.SoNguoiPhuThuoc * @DependentDeduction) * @TaxRate 
                    ELSE 0 END,
                LuongThucNhan = (source.LuongCoBan + source.PhuCap + source.TienLamThem) 
                                - (source.LuongCoBan * (@TyLeBHXH + @TyLeBHYT + @TyLeBHTN))
                                - (CASE 
                                    WHEN (source.LuongCoBan + source.PhuCap + source.TienLamThem - (source.LuongCoBan * (@TyLeBHXH + @TyLeBHYT + @TyLeBHTN)) - @PersonalDeduction - source.SoNguoiPhuThuoc * @DependentDeduction) > 0 
                                    THEN (source.LuongCoBan + source.PhuCap + source.TienLamThem - (source.LuongCoBan * (@TyLeBHXH + @TyLeBHYT + @TyLeBHTN)) - @PersonalDeduction - source.SoNguoiPhuThuoc * @DependentDeduction) * @TaxRate 
                                    ELSE 0 END) 
                                - source.KhauTruDiMuon
                                - source.CacKhoanKhauTruKhac,
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
                source.LuongCoBan * @TyLeBHXH, source.LuongCoBan * @TyLeBHYT, source.LuongCoBan * @TyLeBHTN,
                -- Tính Thuế TNCN
                CASE 
                    WHEN (source.LuongCoBan + source.PhuCap + source.TienLamThem - (source.LuongCoBan * (@TyLeBHXH + @TyLeBHYT + @TyLeBHTN)) - @PersonalDeduction - source.SoNguoiPhuThuoc * @DependentDeduction) > 0 
                    THEN (source.LuongCoBan + source.PhuCap + source.TienLamThem - (source.LuongCoBan * (@TyLeBHXH + @TyLeBHYT + @TyLeBHTN)) - @PersonalDeduction - source.SoNguoiPhuThuoc * @DependentDeduction) * @TaxRate 
                    ELSE 0 END,
                source.CacKhoanKhauTruKhac,
                source.LuongCoBan + source.PhuCap + source.TienLamThem,
                -- Tính Lương thực nhận
                (source.LuongCoBan + source.PhuCap + source.TienLamThem) 
                - (source.LuongCoBan * (@TyLeBHXH + @TyLeBHYT + @TyLeBHTN))
                - (CASE 
                    WHEN (source.LuongCoBan + source.PhuCap + source.TienLamThem - (source.LuongCoBan * (@TyLeBHXH + @TyLeBHYT + @TyLeBHTN)) - @PersonalDeduction - source.SoNguoiPhuThuoc * @DependentDeduction) > 0 
                    THEN (source.LuongCoBan + source.PhuCap + source.TienLamThem - (source.LuongCoBan * (@TyLeBHXH + @TyLeBHYT + @TyLeBHTN)) - @PersonalDeduction - source.SoNguoiPhuThuoc * @DependentDeduction) * @TaxRate 
                    ELSE 0 END) 
                - source.KhauTruDiMuon
                - source.CacKhoanKhauTruKhac,
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
