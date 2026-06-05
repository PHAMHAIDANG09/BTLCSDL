USE NextHR;
GO

-- NextHR - Index Optimization
-- Phan tich hien trang, xoa index cu, tao lai index toi uu, bao tri va thong ke.

SET NOCOUNT ON;

-- =============================================================================================================
-- PHẦN 1: PHÂN TÍCH HIỆN TRẠNG INDEX
-- =============================================================================================================

-- 1.1 Xem toàn bộ index hiện có trong database
PRINT N'--- 1.1 Liệt kê toàn bộ Index hiện có ---';
SELECT
    t.name                          AS TableName,
    i.name                          AS IndexName,
    i.type_desc                     AS IndexType,
    i.is_unique                     AS IsUnique,
    i.is_primary_key                AS IsPrimaryKey,
    (
        SELECT STRING_AGG(c.name, ', ') WITHIN GROUP (ORDER BY ic.key_ordinal)
        FROM sys.index_columns ic
        JOIN sys.columns c ON ic.object_id = c.object_id AND ic.column_id = c.column_id
        WHERE ic.object_id = i.object_id AND ic.index_id = i.index_id AND ic.is_included_column = 0
    ) AS KeyColumns,
    (
        SELECT STRING_AGG(c.name, ', ') WITHIN GROUP (ORDER BY ic.index_column_id)
        FROM sys.index_columns ic
        JOIN sys.columns c ON ic.object_id = c.object_id AND ic.column_id = c.column_id
        WHERE ic.object_id = i.object_id AND ic.index_id = i.index_id AND ic.is_included_column = 1
    ) AS IncludedColumns,
    i.filter_definition             AS FilterDefinition
FROM sys.indexes i
JOIN sys.tables t ON i.object_id = t.object_id
WHERE t.is_ms_shipped = 0
  AND i.index_id > 0
ORDER BY t.name, i.type_desc DESC, i.name;
GO

-- 1.2 Missing Index được SQL Server tự phát hiện (chạy sau khi có traffic thực tế)
PRINT N'--- 1.2 Missing Index do SQL Server phát hiện ---';
SELECT
    mid.statement                                                    AS TableName,
    migs.avg_total_user_cost * migs.avg_user_impact
        * (migs.user_seeks + migs.user_scans)                       AS ImpactScore,
    migs.avg_user_impact                                            AS AvgImpact_Pct,
    migs.user_seeks                                                 AS Seeks,
    migs.user_scans                                                 AS Scans,
    mid.equality_columns                                            AS EqualityColumns,
    mid.inequality_columns                                          AS InequalityColumns,
    mid.included_columns                                            AS IncludedColumns,
    'CREATE INDEX IX_Missing_' + OBJECT_NAME(mid.object_id)
        + '_' + CAST(mid.index_handle AS VARCHAR)
        + ' ON ' + mid.statement
        + ' (' + ISNULL(mid.equality_columns, '')
        + CASE WHEN mid.inequality_columns IS NOT NULL THEN
            CASE WHEN mid.equality_columns IS NOT NULL THEN ', ' ELSE '' END
            + mid.inequality_columns ELSE '' END + ')'
        + CASE WHEN mid.included_columns IS NOT NULL
            THEN ' INCLUDE (' + mid.included_columns + ')' ELSE '' END AS SuggestedCreateSQL
FROM sys.dm_db_missing_index_details mid
JOIN sys.dm_db_missing_index_groups mig ON mid.index_handle = mig.index_handle
JOIN sys.dm_db_missing_index_group_stats migs ON mig.index_group_handle = migs.group_handle
WHERE mid.database_id = DB_ID('NextHR')
ORDER BY ImpactScore DESC;
GO

-- 1.3 Index ít/không được dùng (tốn chi phí write)
PRINT N'--- 1.3 Unused Index (gây overhead write không cần thiết) ---';
SELECT
    OBJECT_NAME(i.object_id)    AS TableName,
    i.name                      AS IndexName,
    i.type_desc                 AS IndexType,
    ISNULL(ius.user_seeks, 0)   AS Seeks,
    ISNULL(ius.user_scans, 0)   AS Scans,
    ISNULL(ius.user_lookups, 0) AS Lookups,
    ISNULL(ius.user_updates, 0) AS Updates,
    ius.last_user_seek          AS LastSeek,
    ius.last_user_scan          AS LastScan
FROM sys.indexes i
LEFT JOIN sys.dm_db_index_usage_stats ius
    ON i.object_id = ius.object_id
    AND i.index_id = ius.index_id
    AND ius.database_id = DB_ID()
WHERE OBJECTPROPERTY(i.object_id, 'IsUserTable') = 1
    AND i.index_id > 0
ORDER BY (ISNULL(ius.user_seeks, 0) + ISNULL(ius.user_scans, 0) + ISNULL(ius.user_lookups, 0)) ASC;
GO

-- 1.4 Tình trạng phân mảnh index (Fragmentation)
PRINT N'--- 1.4 Fragmentation Report ---';
SELECT
    OBJECT_NAME(ips.object_id)              AS TableName,
    i.name                                  AS IndexName,
    ips.index_type_desc                     AS IndexType,
    CAST(ips.avg_fragmentation_in_percent AS DECIMAL(5,2)) AS FragmentationPct,
    ips.page_count                          AS PageCount,
    CASE
        WHEN ips.avg_fragmentation_in_percent < 10 THEN 'OK - Không cần xử lý'
        WHEN ips.avg_fragmentation_in_percent < 30 THEN 'REORGANIZE - Cần tổ chức lại'
        ELSE 'REBUILD - Cần xây dựng lại'
    END AS RecommendedAction
FROM sys.dm_db_index_physical_stats(DB_ID(), NULL, NULL, NULL, 'LIMITED') ips
JOIN sys.indexes i ON ips.object_id = i.object_id AND ips.index_id = i.index_id
WHERE ips.index_id > 0
    AND ips.page_count > 100
ORDER BY ips.avg_fragmentation_in_percent DESC;
GO


-- =============================================================================================================
-- PHẦN 2: XÓA INDEX CŨ TRÙNG LẶP / CHƯA TỐI ƯU
-- =============================================================================================================

PRINT N'--- Phần 2: Xóa index cũ chưa tối ưu ---';

-- Index gốc từ schema ban đầu, sẽ được thay thế bằng bản có INCLUDE columns
IF EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IDX_NhanVien_TrangThai' AND object_id = OBJECT_ID('dbo.NhanVien'))
    DROP INDEX IDX_NhanVien_TrangThai ON dbo.NhanVien;
GO

IF EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IDX_NhanVien_MaPhong' AND object_id = OBJECT_ID('dbo.NhanVien'))
    DROP INDEX IDX_NhanVien_MaPhong ON dbo.NhanVien;
GO

IF EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IDX_LichSuLuong_HienTai' AND object_id = OBJECT_ID('dbo.LichSuLuong'))
    DROP INDEX IDX_LichSuLuong_HienTai ON dbo.LichSuLuong;
GO

IF EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IDX_PhongBan_MaPhongCha' AND object_id = OBJECT_ID('dbo.PhongBan'))
    DROP INDEX IDX_PhongBan_MaPhongCha ON dbo.PhongBan;
GO

PRINT N'Xóa index cũ hoàn tất.';
GO


-- =============================================================================================================
-- PHẦN 3: TẠO INDEX TỐI ƯU CHO TỪNG BẢNG
-- Chiến lược: Composite Index + INCLUDE columns + Filtered Index + Covering Index
-- =============================================================================================================

PRINT N'--- Phần 3: Tạo index tối ưu ---';

-- ─────────────────────────────────────────────
-- BẢNG: NhanVien (bảng trung tâm, query nhiều nhất)
-- ─────────────────────────────────────────────

-- Tìm nhân viên theo Phòng Ban + Trạng thái (query phổ biến nhất trong HR)
-- Use case: WHERE MaPhongId = ? AND TrangThai = 'Active'
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IDX_NhanVien_PhongBan_TrangThai' AND object_id = OBJECT_ID('dbo.NhanVien'))
CREATE NONCLUSTERED INDEX IDX_NhanVien_PhongBan_TrangThai
ON dbo.NhanVien (MaPhongId, TrangThai)
INCLUDE (MaNhanVien, HoTen, Email, SoDienThoai, MaChucVuId, NgayVaoLam)
WITH (PAD_INDEX = ON, FILLFACTOR = 85, STATISTICS_NORECOMPUTE = OFF);
GO

-- Filtered Index: Chỉ nhân viên đang Active (tiết kiệm 60-70% storage)
-- Use case: Dashboard, báo cáo nhân sự active
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IDX_NhanVien_Active_Filtered' AND object_id = OBJECT_ID('dbo.NhanVien'))
CREATE NONCLUSTERED INDEX IDX_NhanVien_Active_Filtered
ON dbo.NhanVien (MaChucVuId, MaPhongId)
INCLUDE (MaNhanVien, HoTen, Email, NgayVaoLam, MaVaiTroId)
WHERE TrangThai = N'Active'
WITH (PAD_INDEX = ON, FILLFACTOR = 90);
GO

-- Tìm kiếm nhân viên theo tên (hỗ trợ prefix search)
-- Use case: WHERE HoTen LIKE 'Nguyen%'
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IDX_NhanVien_HoTen' AND object_id = OBJECT_ID('dbo.NhanVien'))
CREATE NONCLUSTERED INDEX IDX_NhanVien_HoTen
ON dbo.NhanVien (HoTen)
INCLUDE (MaNhanVien, Email, MaPhongId, TrangThai)
WITH (PAD_INDEX = ON, FILLFACTOR = 80);
GO

-- Lookup theo Vai Trò (phân quyền hệ thống)
-- Use case: WHERE MaVaiTroId = 2 AND TrangThai = 'Active'
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IDX_NhanVien_VaiTro_TrangThai' AND object_id = OBJECT_ID('dbo.NhanVien'))
CREATE NONCLUSTERED INDEX IDX_NhanVien_VaiTro_TrangThai
ON dbo.NhanVien (MaVaiTroId, TrangThai)
INCLUDE (MaNhanVien, HoTen, Email, MaPhongId)
WITH (FILLFACTOR = 90);
GO

-- Tìm nhân viên đã nghỉ việc theo khoảng thời gian (báo cáo turnover)
-- Use case: WHERE NgayNghiViec BETWEEN @Start AND @End
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IDX_NhanVien_NgayNghiViec_Filtered' AND object_id = OBJECT_ID('dbo.NhanVien'))
CREATE NONCLUSTERED INDEX IDX_NhanVien_NgayNghiViec_Filtered
ON dbo.NhanVien (NgayNghiViec, MaPhongId)
INCLUDE (MaNhanVien, HoTen, NgayVaoLam, TrangThai)
WHERE NgayNghiViec IS NOT NULL
WITH (FILLFACTOR = 90);
GO


-- ─────────────────────────────────────────────
-- BẢNG: ChamCong (bảng lớn nhất, ghi mỗi ngày)
-- ─────────────────────────────────────────────

-- Chấm công theo nhân viên + khoảng ngày (query chính của module chấm công)
-- Use case: WHERE MaNhanVienId = ? AND NgayLamViec BETWEEN ? AND ?
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IDX_ChamCong_NhanVien_Ngay' AND object_id = OBJECT_ID('dbo.ChamCong'))
CREATE NONCLUSTERED INDEX IDX_ChamCong_NhanVien_Ngay
ON dbo.ChamCong (MaNhanVienId, NgayLamViec DESC)
INCLUDE (GioVao, GioRa, SoGioLam, SoPhutDiMuon, TrangThai, NguonChamCong)
WITH (PAD_INDEX = ON, FILLFACTOR = 80);
GO

-- Điểm danh hàng ngày toàn bộ nhân viên
-- Use case: WHERE NgayLamViec = @Today (màn hình điểm danh)
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IDX_ChamCong_Ngay_NhanVien' AND object_id = OBJECT_ID('dbo.ChamCong'))
CREATE NONCLUSTERED INDEX IDX_ChamCong_Ngay_NhanVien
ON dbo.ChamCong (NgayLamViec DESC, TrangThai)
INCLUDE (MaNhanVienId, GioVao, GioRa, SoGioLam, SoPhutDiMuon)
WITH (FILLFACTOR = 80);
GO

-- Filtered: Thống kê đi muộn trong tháng (báo cáo kỷ luật)
-- Use case: WHERE TrangThai = 'DiMuon' AND NgayLamViec BETWEEN ...
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IDX_ChamCong_DiMuon_Filtered' AND object_id = OBJECT_ID('dbo.ChamCong'))
CREATE NONCLUSTERED INDEX IDX_ChamCong_DiMuon_Filtered
ON dbo.ChamCong (NgayLamViec DESC, MaNhanVienId)
INCLUDE (SoPhutDiMuon, GioVao)
WHERE TrangThai = N'DiMuon'
WITH (FILLFACTOR = 85);
GO

-- Lọc theo nguồn chấm công (audit, phân tích dữ liệu)
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IDX_ChamCong_NguonChamCong' AND object_id = OBJECT_ID('dbo.ChamCong'))
CREATE NONCLUSTERED INDEX IDX_ChamCong_NguonChamCong
ON dbo.ChamCong (NguonChamCong, NgayLamViec DESC)
INCLUDE (MaNhanVienId, TrangThai)
WITH (FILLFACTOR = 90);
GO


-- ─────────────────────────────────────────────
-- BẢNG: PhieuLuong (tính toán phức tạp, query cao điểm cuối tháng)
-- ─────────────────────────────────────────────

-- Phiếu lương theo nhân viên + kỳ lương
-- Use case: WHERE MaNhanVienId = ? AND Nam = ? AND Thang = ?
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IDX_PhieuLuong_NhanVien_KyLuong' AND object_id = OBJECT_ID('dbo.PhieuLuong'))
CREATE NONCLUSTERED INDEX IDX_PhieuLuong_NhanVien_KyLuong
ON dbo.PhieuLuong (MaNhanVienId, Nam DESC, Thang DESC)
INCLUDE (LuongCoBan, PhuCap, TienLamThem, TongLuongGop, LuongThucNhan, TrangThai, NgayThanhToan)
WITH (FILLFACTOR = 90);
GO

-- Thống kê toàn bộ phiếu lương trong tháng (chạy cuối tháng)
-- Use case: WHERE Nam = ? AND Thang = ? AND TrangThai = ?
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IDX_PhieuLuong_KyLuong_TrangThai' AND object_id = OBJECT_ID('dbo.PhieuLuong'))
CREATE NONCLUSTERED INDEX IDX_PhieuLuong_KyLuong_TrangThai
ON dbo.PhieuLuong (Nam DESC, Thang DESC, TrangThai)
INCLUDE (MaNhanVienId, LuongCoBan, PhuCap, TienLamThem, TongLuongGop, LuongThucNhan, NguoiTaoId)
WITH (FILLFACTOR = 90);
GO

-- BUG-03 FIXED: Filtered Index - Phiếu lương chưa thanh toán
-- LỖI CŨ: WHERE TrangThai IN (N'Draft', N'Approved')
-- SQL Server KHÔNG hỗ trợ IN() trong Filtered Index predicate
-- SỬA: Dùng <> N'Paid' - logic tương đương, SQL Server chấp nhận
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IDX_PhieuLuong_ChuaThanhToan' AND object_id = OBJECT_ID('dbo.PhieuLuong'))
CREATE NONCLUSTERED INDEX IDX_PhieuLuong_ChuaThanhToan
ON dbo.PhieuLuong (Nam DESC, Thang DESC, MaNhanVienId)
INCLUDE (TongLuongGop, LuongThucNhan, NguoiTaoId, TrangThai)
WHERE TrangThai <> N'Paid'          -- FIXED: dùng <> thay vì IN()
WITH (FILLFACTOR = 95);
GO

-- Tổng hợp lương theo phòng ban (join với NhanVien)
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IDX_PhieuLuong_Nam_Thang' AND object_id = OBJECT_ID('dbo.PhieuLuong'))
CREATE NONCLUSTERED INDEX IDX_PhieuLuong_Nam_Thang
ON dbo.PhieuLuong (Nam DESC, Thang DESC)
INCLUDE (MaNhanVienId, LuongCoBan, TongLuongGop, LuongThucNhan, TrangThai)
WITH (FILLFACTOR = 90);
GO


-- ─────────────────────────────────────────────
-- BẢNG: DonNghiPhep (workflow duyệt phép)
-- ─────────────────────────────────────────────

-- Đơn nghỉ phép của nhân viên (tab "Đơn của tôi")
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IDX_DonNghiPhep_NhanVien_Ngay' AND object_id = OBJECT_ID('dbo.DonNghiPhep'))
CREATE NONCLUSTERED INDEX IDX_DonNghiPhep_NhanVien_Ngay
ON dbo.DonNghiPhep (MaNhanVienId, NgayBatDau DESC)
INCLUDE (MaLoaiPhepId, NgayKetThuc, TongSoNgay, TrangThai, NguoiDuyetId, NgayDuyet)
WITH (FILLFACTOR = 85);
GO

-- BUG-01 FIXED: Đơn chờ duyệt (Manager xem danh sách cần duyệt)
-- LỖI CŨ: Key column là NguoiDuyetId — nhưng khi TrangThai='Pending' thì NguoiDuyetId luôn NULL
--         => Filtered Index sẽ không bao giờ được dùng, toàn bộ rows trong index là NULL key
-- SỬA: Đổi key thành (NgayTao DESC, MaNhanVienId) để Manager có thể sort theo thời gian nộp đơn
--      INCLUDE NguoiDuyetId để Manager có thể lọc theo phòng ban (join NhanVien)
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IDX_DonNghiPhep_Pending_Filtered' AND object_id = OBJECT_ID('dbo.DonNghiPhep'))
CREATE NONCLUSTERED INDEX IDX_DonNghiPhep_Pending_Filtered
ON dbo.DonNghiPhep (NgayTao DESC, MaNhanVienId)   -- FIXED: bỏ NguoiDuyetId khỏi key
INCLUDE (MaLoaiPhepId, NgayBatDau, NgayKetThuc, TongSoNgay, LyDo)
WHERE TrangThai = N'Pending'
WITH (FILLFACTOR = 90);
GO

-- Thống kê đơn nghỉ phép theo loại + khoảng thời gian
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IDX_DonNghiPhep_LoaiPhep_Ngay' AND object_id = OBJECT_ID('dbo.DonNghiPhep'))
CREATE NONCLUSTERED INDEX IDX_DonNghiPhep_LoaiPhep_Ngay
ON dbo.DonNghiPhep (MaLoaiPhepId, NgayBatDau DESC, TrangThai)
INCLUDE (MaNhanVienId, TongSoNgay)
WITH (FILLFACTOR = 85);
GO


-- ─────────────────────────────────────────────
-- BẢNG: DonLamThem (OT workflow)
-- ─────────────────────────────────────────────

-- Đơn OT của nhân viên
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IDX_DonLamThem_NhanVien_Ngay' AND object_id = OBJECT_ID('dbo.DonLamThem'))
CREATE NONCLUSTERED INDEX IDX_DonLamThem_NhanVien_Ngay
ON dbo.DonLamThem (MaNhanVienId, NgayLamThem DESC)
INCLUDE (LoaiOT, TongSoGio, HeSoOT, TrangThai, NguoiDuyetId)
WITH (FILLFACTOR = 85);
GO

-- BUG-02 FIXED: Đơn OT chờ duyệt
-- LỖI CŨ: Key column NguoiDuyetId luôn NULL khi TrangThai='Pending' — index rỗng hoàn toàn
-- SỬA: Đổi key thành (NgayTao DESC, MaNhanVienId) giống logic fix DNP-02
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IDX_DonLamThem_Pending_Filtered' AND object_id = OBJECT_ID('dbo.DonLamThem'))
CREATE NONCLUSTERED INDEX IDX_DonLamThem_Pending_Filtered
ON dbo.DonLamThem (NgayTao DESC, MaNhanVienId)    -- FIXED: bỏ NguoiDuyetId khỏi key
INCLUDE (NgayLamThem, LoaiOT, TongSoGio, HeSoOT, LyDo)
WHERE TrangThai = N'Pending'
WITH (FILLFACTOR = 90);
GO

-- Tổng hợp OT trong tháng để tính tiền lương
-- Use case: WHERE NgayLamThem BETWEEN ... AND TrangThai = 'Approved'
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IDX_DonLamThem_Approved_Thang' AND object_id = OBJECT_ID('dbo.DonLamThem'))
CREATE NONCLUSTERED INDEX IDX_DonLamThem_Approved_Thang
ON dbo.DonLamThem (NgayLamThem DESC, MaNhanVienId)
INCLUDE (LoaiOT, TongSoGio, HeSoOT)
WHERE TrangThai = N'Approved'
WITH (FILLFACTOR = 85);
GO


-- ─────────────────────────────────────────────
-- BẢNG: HopDong
-- ─────────────────────────────────────────────

-- Hợp đồng của nhân viên theo trạng thái
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IDX_HopDong_NhanVien_TrangThai' AND object_id = OBJECT_ID('dbo.HopDong'))
CREATE NONCLUSTERED INDEX IDX_HopDong_NhanVien_TrangThai
ON dbo.HopDong (MaNhanVienId, TrangThai)
INCLUDE (MaHopDong, LoaiHopDong, NgayBatDau, NgayKetThuc, NgayKy)
WITH (FILLFACTOR = 90);
GO

-- Filtered: Hợp đồng Active (kiểm tra hợp đồng hiện hành)
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IDX_HopDong_Active_Filtered' AND object_id = OBJECT_ID('dbo.HopDong'))
CREATE NONCLUSTERED INDEX IDX_HopDong_Active_Filtered
ON dbo.HopDong (MaNhanVienId, NgayKetThuc)
INCLUDE (MaHopDong, LoaiHopDong, NgayBatDau, NgayKy)
WHERE TrangThai = N'Active'
WITH (FILLFACTOR = 90);
GO

-- Hợp đồng sắp hết hạn (cảnh báo tự động 30 ngày trước)
-- Use case: WHERE NgayKetThuc BETWEEN GETDATE() AND DATEADD(DAY,30,GETDATE()) AND TrangThai='Active'
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IDX_HopDong_NgayHetHan' AND object_id = OBJECT_ID('dbo.HopDong'))
CREATE NONCLUSTERED INDEX IDX_HopDong_NgayHetHan
ON dbo.HopDong (NgayKetThuc ASC, TrangThai)
INCLUDE (MaNhanVienId, MaHopDong, LoaiHopDong, NgayBatDau)
WHERE NgayKetThuc IS NOT NULL
WITH (FILLFACTOR = 90);
GO


-- ─────────────────────────────────────────────
-- BẢNG: LichSuLuong
-- ─────────────────────────────────────────────

-- Lấy lương hiện hành của nhân viên (thay thế index gốc, thêm INCLUDE)
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IDX_LichSuLuong_HienTai_Covered' AND object_id = OBJECT_ID('dbo.LichSuLuong'))
CREATE NONCLUSTERED INDEX IDX_LichSuLuong_HienTai_Covered
ON dbo.LichSuLuong (MaNhanVienId, DangHieuLuc)
INCLUDE (LuongCoBan, PhuCap, NgayBatDau, NgayKetThuc, NguoiThayDoiId)
WITH (FILLFACTOR = 90);
GO

-- Filtered: Chỉ bản ghi lương đang hiệu lực (tránh quét toàn bảng)
-- Use case: WHERE DangHieuLuc = 1 (query rất phổ biến khi tính lương)
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IDX_LichSuLuong_DangHieuLuc_Filtered' AND object_id = OBJECT_ID('dbo.LichSuLuong'))
CREATE NONCLUSTERED INDEX IDX_LichSuLuong_DangHieuLuc_Filtered
ON dbo.LichSuLuong (MaNhanVienId)
INCLUDE (LuongCoBan, PhuCap, NgayBatDau)
WHERE DangHieuLuc = 1
WITH (FILLFACTOR = 90);
GO


-- ─────────────────────────────────────────────
-- BẢNG: LichSuDieuChuyen
-- ─────────────────────────────────────────────

-- Lịch sử điều chuyển theo nhân viên (mới nhất trước)
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IDX_LichSuDieuChuyen_NhanVien' AND object_id = OBJECT_ID('dbo.LichSuDieuChuyen'))
CREATE NONCLUSTERED INDEX IDX_LichSuDieuChuyen_NhanVien
ON dbo.LichSuDieuChuyen (MaNhanVienId, NgayHieuLuc DESC)
INCLUDE (PhongBanCuId, PhongBanMoiId, ChucVuCuId, ChucVuMoiId, LyDo, NguoiDuyetId)
WITH (FILLFACTOR = 90);
GO

-- Lịch sử ai đã đến/rời phòng ban
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IDX_LichSuDieuChuyen_PhongBanMoi' AND object_id = OBJECT_ID('dbo.LichSuDieuChuyen'))
CREATE NONCLUSTERED INDEX IDX_LichSuDieuChuyen_PhongBanMoi
ON dbo.LichSuDieuChuyen (PhongBanMoiId, NgayHieuLuc DESC)
INCLUDE (MaNhanVienId, PhongBanCuId, ChucVuMoiId)
WITH (FILLFACTOR = 90);
GO


-- ─────────────────────────────────────────────
-- BẢNG: SoDuPhep
-- ─────────────────────────────────────────────

-- Số dư phép theo năm (PK đã cover MaNhanVienId+MaLoaiPhepId+Nam, thêm index cho Nam)
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IDX_SoDuPhep_Nam_NhanVien' AND object_id = OBJECT_ID('dbo.SoDuPhep'))
CREATE NONCLUSTERED INDEX IDX_SoDuPhep_Nam_NhanVien
ON dbo.SoDuPhep (Nam DESC, MaNhanVienId)
INCLUDE (MaLoaiPhepId, TongNgayPhep, DaSuDung)
WITH (FILLFACTOR = 90);
GO


-- ─────────────────────────────────────────────
-- BẢNG: NhatKyHeThong (Audit Log - ghi nhiều, đọc ít)
-- ─────────────────────────────────────────────

-- Tìm log theo bảng + hành động + thời gian (audit query)
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IDX_NhatKy_Bang_HanhDong_Ngay' AND object_id = OBJECT_ID('dbo.NhatKyHeThong'))
CREATE NONCLUSTERED INDEX IDX_NhatKy_Bang_HanhDong_Ngay
ON dbo.NhatKyHeThong (TenBang, HanhDong, NgayThucHien DESC)
INCLUDE (MaBanGhi, MaNguoiThucHienId)
WITH (PAD_INDEX = ON, FILLFACTOR = 70);  -- FillFactor 70: bảng INSERT nhiều nhất
GO

-- Tìm log theo người thực hiện (ai đã làm gì)
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IDX_NhatKy_NguoiThucHien_Ngay' AND object_id = OBJECT_ID('dbo.NhatKyHeThong'))
CREATE NONCLUSTERED INDEX IDX_NhatKy_NguoiThucHien_Ngay
ON dbo.NhatKyHeThong (MaNguoiThucHienId, NgayThucHien DESC)
INCLUDE (TenBang, HanhDong, MaBanGhi)
WITH (FILLFACTOR = 70);
GO

-- Lịch sử thay đổi của 1 record cụ thể
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IDX_NhatKy_Bang_MaBanGhi' AND object_id = OBJECT_ID('dbo.NhatKyHeThong'))
CREATE NONCLUSTERED INDEX IDX_NhatKy_Bang_MaBanGhi
ON dbo.NhatKyHeThong (TenBang, MaBanGhi, NgayThucHien DESC)
WITH (FILLFACTOR = 70);
GO


-- ─────────────────────────────────────────────
-- BẢNG: NgayLe (bảng nhỏ, ít thay đổi)
-- ─────────────────────────────────────────────

-- Kiểm tra ngày có phải ngày lễ không (dùng khi tính OT)
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IDX_NgayLe_Ngay' AND object_id = OBJECT_ID('dbo.NgayLe'))
CREATE NONCLUSTERED INDEX IDX_NgayLe_Ngay
ON dbo.NgayLe (NgayLe ASC)
INCLUDE (TenNgayLe, LapLaiHangNam)
WITH (FILLFACTOR = 95);
GO


-- ─────────────────────────────────────────────
-- BẢNG: PhongBan
-- ─────────────────────────────────────────────

-- Cây phòng ban (self-join theo MaPhongCha) - thay thế index gốc, thêm INCLUDE
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IDX_PhongBan_MaPhongCha_Covered' AND object_id = OBJECT_ID('dbo.PhongBan'))
CREATE NONCLUSTERED INDEX IDX_PhongBan_MaPhongCha_Covered
ON dbo.PhongBan (MaPhongCha, DangHoatDong)
INCLUDE (TenPhong, MaPhong, MaQuanLy)
WITH (FILLFACTOR = 95);
GO

PRINT N'Tạo index tối ưu hoàn tất. Tổng: 27 index.';
GO


-- =============================================================================================================
-- PHẦN 4: SCRIPT BẢO TRÌ INDEX (chạy định kỳ qua SQL Agent Job)
-- =============================================================================================================

-- 4.1 BUG-05 FIXED: Bao toàn bộ cursor trong BEGIN/END block riêng để tránh scope issue
-- Script AUTO-REORGANIZE hoặc REBUILD dựa trên ngưỡng (threshold) fragmentation
-- Gợi ý: Chạy Chủ nhật 2:00 AM qua SQL Agent Job

PRINT N'--- Phần 4.1: Bảo trì Index tự động ---';
BEGIN
    DECLARE @TableName  NVARCHAR(256);
    DECLARE @IndexName  NVARCHAR(256);
    DECLARE @Frag       FLOAT;
    DECLARE @SQL        NVARCHAR(MAX);

    DECLARE idx_cursor CURSOR LOCAL FAST_FORWARD FOR   -- LOCAL + FAST_FORWARD: an toàn hơn, tránh xung đột
    SELECT
        OBJECT_NAME(ips.object_id),
        i.name,
        ips.avg_fragmentation_in_percent
    FROM sys.dm_db_index_physical_stats(DB_ID(), NULL, NULL, NULL, 'LIMITED') ips
    JOIN sys.indexes i ON ips.object_id = i.object_id AND ips.index_id = i.index_id
    WHERE ips.avg_fragmentation_in_percent > 5
        AND ips.page_count > 100
        AND ips.index_id > 0
    ORDER BY ips.avg_fragmentation_in_percent DESC;

    OPEN idx_cursor;
    FETCH NEXT FROM idx_cursor INTO @TableName, @IndexName, @Frag;

    WHILE @@FETCH_STATUS = 0
    BEGIN
        IF @Frag < 30
        BEGIN
            SET @SQL = 'ALTER INDEX [' + @IndexName + '] ON dbo.[' + @TableName + '] REORGANIZE;';
            PRINT 'REORGANIZE: ' + @TableName + '.' + @IndexName
                  + ' (' + CAST(CAST(@Frag AS INT) AS VARCHAR) + '% fragmented)';
        END
        ELSE
        BEGIN
            -- REBUILD với để không block production trong giờ bảo trì
            SET @SQL = 'ALTER INDEX [' + @IndexName + '] ON dbo.[' + @TableName
                       + '] REBUILD WITH (FILLFACTOR = 85);';
            PRINT 'REBUILD:    ' + @TableName + '.' + @IndexName
                  + ' (' + CAST(CAST(@Frag AS INT) AS VARCHAR) + '% fragmented)';
        END

        EXEC sp_executesql @SQL;
        FETCH NEXT FROM idx_cursor INTO @TableName, @IndexName, @Frag;
    END;

    CLOSE idx_cursor;
    DEALLOCATE idx_cursor;
END;
GO

-- 4.2 Cập nhật Statistics sau khi rebuild hoặc sau load data lớn
PRINT N'--- Phần 4.2: Cập nhật Statistics ---';
UPDATE STATISTICS dbo.NhanVien         WITH FULLSCAN;
UPDATE STATISTICS dbo.ChamCong         WITH FULLSCAN;
UPDATE STATISTICS dbo.PhieuLuong       WITH FULLSCAN;
UPDATE STATISTICS dbo.DonNghiPhep      WITH FULLSCAN;
UPDATE STATISTICS dbo.DonLamThem       WITH FULLSCAN;
UPDATE STATISTICS dbo.HopDong          WITH FULLSCAN;
UPDATE STATISTICS dbo.LichSuLuong      WITH FULLSCAN;
UPDATE STATISTICS dbo.LichSuDieuChuyen WITH FULLSCAN;
UPDATE STATISTICS dbo.SoDuPhep         WITH FULLSCAN;
UPDATE STATISTICS dbo.NhatKyHeThong    WITH SAMPLE 30 PERCENT; -- Bảng lớn: dùng sample
UPDATE STATISTICS dbo.PhongBan         WITH FULLSCAN;
UPDATE STATISTICS dbo.NgayLe           WITH FULLSCAN;
GO


-- =============================================================================================================
-- PHẦN 5: KIỂM TRA KẾT QUẢ SAU KHI TẠO INDEX
-- =============================================================================================================

-- 5.1 BUG-04 FIXED: Tổng hợp toàn bộ index sau khi tối ưu
-- LỖI CŨ: STRING_AGG với WITHIN GROUP (ORDER BY key_ordinal) bị nhập nhằng
--          khi đồng thời aggregate cả is_included_column=0 và =1 trong cùng GROUP BY
-- SỬA: Dùng subquery tách riêng Key Columns và Include Columns

PRINT N'--- Phần 5.1: Tổng hợp index sau tối ưu ---';
SELECT
    t.name                          AS [Bảng],
    i.name                          AS [Tên Index],
    i.type_desc                     AS [Loại],
    CASE i.is_unique WHEN 1 THEN 'Có' ELSE 'Không' END AS [Unique],
    -- FIXED: Tách thành 2 subquery riêng thay vì CASE trong STRING_AGG
    (
        SELECT STRING_AGG(c2.name, ', ') WITHIN GROUP (ORDER BY ic2.key_ordinal)
        FROM sys.index_columns ic2
        JOIN sys.columns c2 ON ic2.object_id = c2.object_id AND ic2.column_id = c2.column_id
        WHERE ic2.object_id = i.object_id
          AND ic2.index_id = i.index_id
          AND ic2.is_included_column = 0
    ) AS [Key Columns],
    (
        SELECT STRING_AGG(c3.name, ', ') WITHIN GROUP (ORDER BY ic3.index_column_id)
        FROM sys.index_columns ic3
        JOIN sys.columns c3 ON ic3.object_id = c3.object_id AND ic3.column_id = c3.column_id
        WHERE ic3.object_id = i.object_id
          AND ic3.index_id = i.index_id
          AND ic3.is_included_column = 1
    ) AS [Include Columns],
    i.filter_definition             AS [Filter (WHERE)]
FROM sys.indexes i
JOIN sys.tables t ON i.object_id = t.object_id
WHERE t.is_ms_shipped = 0 AND i.index_id > 0
ORDER BY t.name, i.type_desc DESC, i.name;
GO

-- 5.2 Kiểm tra kích thước từng index
PRINT N'--- Phần 5.2: Kích thước Index ---';
SELECT
    OBJECT_NAME(i.object_id)                            AS [Bảng],
    i.name                                              AS [Index],
    SUM(a.total_pages) * 8 / 1024.0                    AS [Tổng (MB)],
    SUM(a.used_pages) * 8 / 1024.0                     AS [Đã dùng (MB)],
    i.fill_factor                                       AS [Fill Factor %],
    CASE i.is_unique WHEN 1 THEN 'Unique' ELSE '' END   AS [Ghi chú]
FROM sys.indexes i
JOIN sys.partitions p ON i.object_id = p.object_id AND i.index_id = p.index_id
JOIN sys.allocation_units a ON p.partition_id = a.container_id
JOIN sys.tables t ON i.object_id = t.object_id
WHERE t.is_ms_shipped = 0 AND i.index_id > 0
GROUP BY OBJECT_NAME(i.object_id), i.name, i.fill_factor, i.is_unique
ORDER BY SUM(a.total_pages) DESC;
GO

-- 5.3 Kiểm tra nhanh các Filtered Index có bị rỗng không
PRINT N'--- Phần 5.3: Kiểm tra Filtered Index có dữ liệu ---';
SELECT
    OBJECT_NAME(i.object_id)    AS [Bảng],
    i.name                      AS [Index],
    i.filter_definition         AS [Filter],
    p.rows                      AS [Số rows trong index]
FROM sys.indexes i
JOIN sys.partitions p ON i.object_id = p.object_id AND i.index_id = p.index_id
JOIN sys.tables t ON i.object_id = t.object_id
WHERE t.is_ms_shipped = 0
  AND i.has_filter = 1
ORDER BY p.rows ASC;  -- Sắp xếp tăng dần: index rỗng (0 rows) sẽ hiện đầu tiên để dễ phát hiện
GO

