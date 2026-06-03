export interface PhieuLuong {
  Id: number;
  MaNhanVienId: number;
  Thang: number;
  Nam: number;
  SoNgayCongChuan: number;
  SoNgayCongThucTe: number;
  SoNgayNghiHuongLuong: number;
  SoGioLamThem: number;
  LuongCoBan: number;
  PhuCap: number;
  TienLamThem: number;
  KhauTruDiMuon: number;
  BaoHiemXaHoi: number;
  BaoHiemYTe: number;
  BaoHiemThatNghiep: number;
  ThueTNCN: number;
  CacKhoanKhauTruKhac: number;
  TongLuongGop: number;
  LuongThucNhan: number;
  TrangThai: 'Draft' | 'Approved' | 'Paid';
  NgayThanhToan?: string;
  GhiChu?: string;
  nhanVien?: {
    MaNhanVien: string;
    HoTen: string;
  };
}

export interface CalculatePayrollDto {
  Thang: number;
  Nam: number;
}

export interface LichSuLuong {
  Id: number;
  MaNhanVienId: number;
  LuongCoBan: number;
  PhuCap: number;
  NgayBatDau: string;
  NgayKetThuc?: string;
  DangHieuLuc: boolean;
  NguoiThayDoiId: number;
  GhiChu?: string;
  NgayTao: string;
  nguoiThayDoi?: {
    MaNhanVien: string;
    HoTen: string;
  };
}

export interface UpdateSalaryDto {
  MaNhanVienId: number;
  LuongCoBan: number;
  PhuCap: number;
  GhiChu?: string;
}
