// DỰ ÁN: NEXTHR - HỆ THỐNG QUẢN TRỊ NHÂN SỰ & TÍNH LƯƠNG
// Ngôn ngữ: Tiếng Việt (Vietnamese)

Table PhongBan {
  Id int [pk, increment]
  TenPhong nvarchar(100) [not null]
  MaPhong varchar(20) [unique, not null, note: 'VD: DEV, HR, ACC']
  MaPhongCha int [null, note: 'Dùng cho Sơ đồ tổ chức đa cấp']
  MaQuanLy int [null, note: 'Mã nhân viên quản lý phòng này']
  DangHoatDong bit [not null, default: 1]
  NgayTao datetime [not null, default: `getdate()`]

  indexes {
    MaPhongCha [name: 'IDX_PhongBan_MaPhongCha']
  }
}

Table ChucVu {
  Id int [pk, increment]
  TenChucVu nvarchar(100) [not null]
  CapDo int [not null, default: 1, note: '1=Nhân viên | 2=Trưởng nhóm | 3=Trưởng phòng | 4=Giám đốc']
  MoTa nvarchar(500) [null]
}

Table VaiTro {
  Id int [pk, increment]
  TenVaiTro nvarchar(50) [not null, unique, note: 'Admin | Manager | Staff']
  MoTa nvarchar(255) [null]
}

Table NhanVien {
  Id int [pk, increment]
  MaNhanVien varchar(20) [unique, not null, note: 'VD: EMP-2025-001']
  HoTen nvarchar(100) [not null]
  Email varchar(100) [unique, not null]
  MatKhauHash varchar(255) [not null]
  SoDienThoai varchar(15) [null]
  GioiTinh nvarchar(10) [null, note: 'Nam | Nữ | Khác']
  NgaySinh date [null]
  SoCCCD varchar(20) [null]
  DiaChi nvarchar(300) [null]
  MaSoThue varchar(20) [null]
  SoNguoiPhuThuoc int [not null, default: 0, note: 'Dùng để tính giảm trừ thuế']
  SoTaiKhoan varchar(30) [null]
  TenNganHang nvarchar(100) [null]
  ChiNhanhNganHang nvarchar(100) [null]
  MaPhongId int [null]
  MaChucVuId int [null]
  MaVaiTroId int [not null]
  NgayVaoLam date [not null]
  NgayNghiViec date [null]
  TrangThai nvarchar(20) [not null, default: 'Active', note: 'Active | Inactive | Terminated']
  NgayTao datetime [not null, default: `getdate()`]
  NgayCapNhat datetime [null]

  indexes {
    MaPhongId [name: 'IDX_NhanVien_MaPhong']
    TrangThai [name: 'IDX_NhanVien_TrangThai']
  }
}

Table HopDong {
  Id int [pk, increment]
  MaNhanVienId int [not null]
  SoHopDong varchar(50) [unique, not null]
  LoaiHopDong nvarchar(50) [not null, note: 'Thử việc | Xác định thời hạn | Không xác định thời hạn']
  NgayBatDau date [not null]
  NgayKetThuc date [null]
  NgayKy date [not null]
  DuongDanFile nvarchar(500) [null]
  TrangThai nvarchar(20) [not null, default: 'Active']
  NgayTao datetime [not null, default: `getdate()`]

  indexes {
    MaNhanVienId [name: 'IDX_HopDong_NhanVien']
  }
}

Table LichSuDieuChuyen {
  Id int [pk, increment]
  MaNhanVienId int [not null]
  PhongBanCuId int [null]
  PhongBanMoiId int [not null]
  ChucVuCuId int [null]
  ChucVuMoiId int [not null]
  NgayHieuLuc date [not null]
  LyDo nvarchar(500) [null]
  NguoiDuyetId int [not null]
  NgayTao datetime [not null, default: `getdate()`]
}

Table LichSuLuong {
  Id int [pk, increment]
  MaNhanVienId int [not null]
  LuongCoBan decimal(18,2) [not null]
  PhuCap decimal(18,2) [not null, default: 0]
  NgayBatDau date [not null]
  NgayKetThuc date [null]
  DangHieuLuc bit [not null, default: 1, note: 'SCD Type 2 Flag']
  NguoiThayDoiId int [not null]
  GhiChu nvarchar(500) [null]
  NgayTao datetime [not null, default: `getdate()`]

  indexes {
    (MaNhanVienId, DangHieuLuc) [name: 'IDX_LichSuLuong_HienTai']
  }
}

Table ChamCong {
  Id int [pk, increment]
  MaNhanVienId int [not null]
  NgayLamViec date [not null]
  GioVao datetime [null]
  GioRa datetime [null]
  SoGioLam float [null]
  SoPhutDiMuon int [not null, default: 0]
  TrangThai nvarchar(20) [not null, note: 'CoMat | DiMuon | VeSom | Vang | NghiPhep']
  NguonChamCong nvarchar(20) [not null, default: 'Manual']

  indexes {
    (MaNhanVienId, NgayLamViec) [unique, name: 'UQ_ChamCong_NhanVienNgay']
  }
}

Table LoaiNghiPhep {
  Id int [pk, increment]
  TenLoaiPhep nvarchar(50) [not null, unique, note: 'Phép năm | Nghỉ ốm | Thai sản...']
  CoHuongLuong bit [not null, default: 1]
  SoNgayToiDaNam int [not null, default: 12]
  MoTa nvarchar(255) [null]
}

Table SoDuPhep {
  MaNhanVienId int [not null]
  MaLoaiPhepId int [not null]
  Nam int [not null]
  TongNgayPhep int [not null, default: 12]
  DaSuDung int [not null, default: 0]

  indexes {
    (MaNhanVienId, MaLoaiPhepId, Nam) [pk, name: 'PK_SoDuPhep']
  }
}

Table DonNghiPhep {
  Id int [pk, increment]
  MaNhanVienId int [not null]
  MaLoaiPhepId int [not null]
  NgayBatDau date [not null]
  NgayKetThuc date [not null]
  TongSoNgay float [not null]
  LyDo nvarchar(500) [null]
  TrangThai nvarchar(20) [not null, default: 'Pending']
  NguoiDuyetId int [null]
  NgayDuyet datetime [null]
  LyDoTuChoi nvarchar(500) [null]
  NgayTao datetime [not null, default: `getdate()`]
}

Table DonLamThem {
  Id int [pk, increment]
  MaNhanVienId int [not null]
  NgayLamThem date [not null]
  GioBatDau time [not null]
  GioKetThuc time [not null]
  TongSoGio float [not null]
  LoaiOT nvarchar(20) [not null, default: 'NgayThuong']
  HeSoOT decimal(4,2) [not null, default: 1.5]
  LyDo nvarchar(500) [null]
  TrangThai nvarchar(20) [not null, default: 'Pending']
  NguoiDuyetId int [null]
  NgayTao datetime [not null, default: `getdate()`]
}

Table PhieuLuong {
  Id int [pk, increment]
  MaNhanVienId int [not null]
  Thang int [not null]
  Nam int [not null]
  SoNgayCongChuan int [not null]
  SoNgayCongThucTe float [not null]
  SoNgayNghiHuongLuong float [not null, default: 0]
  SoGioLamThem float [not null, default: 0]
  LuongCoBan decimal(18,2) [not null]
  PhuCap decimal(18,2) [not null]
  TienLamThem decimal(18,2) [not null]
  KhauTruDiMuon decimal(18,2) [not null]
  BaoHiemXaHoi decimal(18,2) [not null]
  BaoHiemYTe decimal(18,2) [not null]
  BaoHiemThatNghiep decimal(18,2) [not null]
  ThueTNCN decimal(18,2) [not null]
  CacKhoanKhauTruKhac decimal(18,2) [not null]
  TongLuongGop decimal(18,2) [not null]
  LuongThucNhan decimal(18,2) [not null]
  TrangThai nvarchar(20) [not null, default: 'Draft']
  NgayThanhToan datetime [null]
  GhiChu nvarchar(500) [null]
  NguoiTaoId int [not null]

  indexes {
    (MaNhanVienId, Thang, Nam) [unique, name: 'UQ_PhieuLuong_KyLuong']
  }
}

Table NgayLe {
  Id int [pk, increment]
  NgayLe date [not null, unique]
  TenNgayLe nvarchar(100) [not null]
  LapLaiHangNam bit [not null, default: 0]
}

Table NhatKyHeThong {
  Id int [pk, increment]
  TenBang varchar(100) [not null]
  MaBanGhi int [not null]
  HanhDong nvarchar(20) [not null]
  GiaTriCu nvarchar(max) [null]
  GiaTriMoi nvarchar(max) [null]
  MaNguoiThucHienId int [not null]
  NgayThucHien datetime [not null, default: `getdate()`]
}

// ---- THIẾT LẬP QUAN HỆ (REFERENCES) ----

Ref: PhongBan.MaPhongCha > PhongBan.Id
Ref: PhongBan.MaQuanLy - NhanVien.Id

Ref: NhanVien.MaPhongId > PhongBan.Id
Ref: NhanVien.MaChucVuId > ChucVu.Id
Ref: NhanVien.MaVaiTroId > VaiTro.Id

Ref: HopDong.MaNhanVienId > NhanVien.Id

Ref: LichSuDieuChuyen.MaNhanVienId > NhanVien.Id
Ref: LichSuDieuChuyen.PhongBanCuId > PhongBan.Id
Ref: LichSuDieuChuyen.PhongBanMoiId > PhongBan.Id
Ref: LichSuDieuChuyen.ChucVuCuId > ChucVu.Id
Ref: LichSuDieuChuyen.ChucVuMoiId > ChucVu.Id
Ref: LichSuDieuChuyen.NguoiDuyetId > NhanVien.Id

Ref: LichSuLuong.MaNhanVienId > NhanVien.Id
Ref: LichSuLuong.NguoiThayDoiId > NhanVien.Id

Ref: ChamCong.MaNhanVienId > NhanVien.Id

Ref: DonNghiPhep.MaNhanVienId > NhanVien.Id
Ref: DonNghiPhep.MaLoaiPhepId > LoaiNghiPhep.Id
Ref: DonNghiPhep.NguoiDuyetId > NhanVien.Id

Ref: SoDuPhep.MaNhanVienId > NhanVien.Id
Ref: SoDuPhep.MaLoaiPhepId > LoaiNghiPhep.Id

Ref: DonLamThem.MaNhanVienId > NhanVien.Id
Ref: DonLamThem.NguoiDuyetId > NhanVien.Id

Ref: PhieuLuong.MaNhanVienId > NhanVien.Id
Ref: PhieuLuong.NguoiTaoId > NhanVien.Id

Ref: NhatKyHeThong.MaNguoiThucHienId > NhanVien.Id