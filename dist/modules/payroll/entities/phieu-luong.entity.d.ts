import { NhanVien } from '../../auth/entities/nhan-vien.entity';
export declare class PhieuLuong {
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
    TrangThai: string;
    NgayThanhToan: Date;
    GhiChu: string;
    NguoiTaoId: number;
    NgayTao: Date;
    nhanVien: NhanVien;
    nguoiTao: NhanVien;
}
