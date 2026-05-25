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
