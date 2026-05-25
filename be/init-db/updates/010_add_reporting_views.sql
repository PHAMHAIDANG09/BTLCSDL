USE NextHR;
GO

CREATE OR ALTER VIEW dbo.vw_BangLuongTongHop
AS
SELECT
    pl.Id AS PhieuLuongId,
    pl.MaNhanVienId,
    nv.MaNhanVien,
    nv.HoTen,
    nv.Email,
    pb.Id AS PhongBanId,
    pb.MaPhong,
    pb.TenPhong,
    cv.Id AS ChucVuId,
    cv.TenChucVu,
    pl.Thang,
    pl.Nam,
    pl.SoNgayCongChuan,
    pl.SoNgayCongThucTe,
    pl.SoNgayNghiHuongLuong,
    pl.SoGioLamThem,
    pl.LuongCoBan,
    pl.PhuCap,
    pl.TienLamThem,
    pl.KhauTruDiMuon,
    pl.BaoHiemXaHoi,
    pl.BaoHiemYTe,
    pl.BaoHiemThatNghiep,
    pl.ThueTNCN,
    pl.CacKhoanKhauTruKhac,
    pl.TongLuongGop,
    pl.BaoHiemXaHoi + pl.BaoHiemYTe + pl.BaoHiemThatNghiep AS TongBaoHiem,
    pl.KhauTruDiMuon + pl.BaoHiemXaHoi + pl.BaoHiemYTe + pl.BaoHiemThatNghiep + pl.ThueTNCN + pl.CacKhoanKhauTruKhac AS TongKhauTru,
    pl.LuongThucNhan,
    pl.TrangThai,
    pl.NgayThanhToan,
    pl.NgayTao
FROM dbo.PhieuLuong pl
INNER JOIN dbo.NhanVien nv ON nv.Id = pl.MaNhanVienId
LEFT JOIN dbo.PhongBan pb ON pb.Id = nv.MaPhongId
LEFT JOIN dbo.ChucVu cv ON cv.Id = nv.MaChucVuId;
GO

CREATE OR ALTER VIEW dbo.vw_ChamCongThang
AS
SELECT
    cc.MaNhanVienId,
    nv.MaNhanVien,
    nv.HoTen,
    pb.Id AS PhongBanId,
    pb.MaPhong,
    pb.TenPhong,
    cv.Id AS ChucVuId,
    cv.TenChucVu,
    MONTH(cc.NgayLamViec) AS Thang,
    YEAR(cc.NgayLamViec) AS Nam,
    COUNT(*) AS SoNgayChamCong,
    SUM(CASE WHEN cc.TrangThai IN (N'CoMat', N'DiMuon', N'VeSom') THEN 1 ELSE 0 END) AS SoNgayCoMat,
    SUM(CASE WHEN cc.TrangThai = N'DiMuon' THEN 1 ELSE 0 END) AS SoNgayDiMuon,
    SUM(CASE WHEN cc.TrangThai = N'VeSom' THEN 1 ELSE 0 END) AS SoNgayVeSom,
    SUM(ISNULL(cc.SoGioLam, 0)) AS TongGioLam,
    SUM(ISNULL(cc.SoPhutDiMuon, 0)) AS TongPhutDiMuon,
    MIN(cc.GioVao) AS GioVaoSomNhat,
    MAX(cc.GioRa) AS GioRaMuonNhat
FROM dbo.ChamCong cc
INNER JOIN dbo.NhanVien nv ON nv.Id = cc.MaNhanVienId
LEFT JOIN dbo.PhongBan pb ON pb.Id = nv.MaPhongId
LEFT JOIN dbo.ChucVu cv ON cv.Id = nv.MaChucVuId
GROUP BY
    cc.MaNhanVienId,
    nv.MaNhanVien,
    nv.HoTen,
    pb.Id,
    pb.MaPhong,
    pb.TenPhong,
    cv.Id,
    cv.TenChucVu,
    MONTH(cc.NgayLamViec),
    YEAR(cc.NgayLamViec);
GO

CREATE OR ALTER VIEW dbo.vw_ThongKeNghiPhep
AS
SELECT
    dnp.MaNhanVienId,
    nv.MaNhanVien,
    nv.HoTen,
    pb.Id AS PhongBanId,
    pb.MaPhong,
    pb.TenPhong,
    cv.Id AS ChucVuId,
    cv.TenChucVu,
    dnp.MaLoaiPhepId,
    lnp.TenLoaiPhep,
    lnp.CoHuongLuong,
    MONTH(dnp.NgayBatDau) AS Thang,
    YEAR(dnp.NgayBatDau) AS Nam,
    dnp.TrangThai,
    COUNT(*) AS SoDon,
    SUM(dnp.TongSoNgay) AS TongSoNgay,
    SUM(CASE WHEN dnp.TrangThai = N'Approved' THEN dnp.TongSoNgay ELSE 0 END) AS SoNgayApproved,
    SUM(CASE WHEN dnp.TrangThai = N'Pending' THEN dnp.TongSoNgay ELSE 0 END) AS SoNgayPending,
    SUM(CASE WHEN dnp.TrangThai = N'Rejected' THEN dnp.TongSoNgay ELSE 0 END) AS SoNgayRejected,
    SUM(CASE WHEN dnp.TrangThai = N'Cancelled' THEN dnp.TongSoNgay ELSE 0 END) AS SoNgayCancelled
FROM dbo.DonNghiPhep dnp
INNER JOIN dbo.NhanVien nv ON nv.Id = dnp.MaNhanVienId
INNER JOIN dbo.LoaiNghiPhep lnp ON lnp.Id = dnp.MaLoaiPhepId
LEFT JOIN dbo.PhongBan pb ON pb.Id = nv.MaPhongId
LEFT JOIN dbo.ChucVu cv ON cv.Id = nv.MaChucVuId
GROUP BY
    dnp.MaNhanVienId,
    nv.MaNhanVien,
    nv.HoTen,
    pb.Id,
    pb.MaPhong,
    pb.TenPhong,
    cv.Id,
    cv.TenChucVu,
    dnp.MaLoaiPhepId,
    lnp.TenLoaiPhep,
    lnp.CoHuongLuong,
    MONTH(dnp.NgayBatDau),
    YEAR(dnp.NgayBatDau),
    dnp.TrangThai;
GO

SELECT TOP 20 * FROM dbo.vw_BangLuongTongHop WHERE Thang = 3 AND Nam = 2026;
SELECT TOP 20 * FROM dbo.vw_ChamCongThang WHERE Thang = 3 AND Nam = 2026;
SELECT TOP 20 * FROM dbo.vw_ThongKeNghiPhep WHERE Thang = 3 AND Nam = 2026;
GO
