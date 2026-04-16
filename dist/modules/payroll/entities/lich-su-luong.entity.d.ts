import { NhanVien } from '../../auth/entities/nhan-vien.entity';
export declare class LichSuLuong {
    Id: number;
    MaNhanVienId: number;
    LuongCoBan: number;
    PhuCap: number;
    NgayBatDau: Date;
    NgayKetThuc: Date;
    DangHieuLuc: boolean;
    NguoiThayDoiId: number;
    GhiChu: string;
    NgayTao: Date;
    nhanVien: NhanVien;
    nguoiThayDoi: NhanVien;
}
