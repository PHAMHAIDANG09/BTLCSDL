export interface NgayLe {
  Id: number;
  NgayLe: string;
  TenNgayLe: string;
  LapLaiHangNam: boolean;
}

export interface CreateNgayLeDto {
  NgayLe: string;
  TenNgayLe: string;
  LapLaiHangNam: boolean;
}

export interface NhatKyHeThong {
  Id: number;
  TenBang: string;
  MaBanGhi: number;
  HanhDong: string;
  GiaTriCu: string | null;
  GiaTriMoi: string | null;
  MaNguoiThucHienId: number;
  NgayThucHien: string;
}
