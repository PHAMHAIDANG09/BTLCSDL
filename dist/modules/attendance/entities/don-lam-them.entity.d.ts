import { NhanVien } from '../../auth/entities/nhan-vien.entity';
export declare class DonLamThem {
    Id: number;
    MaNhanVienId: number;
    NgayLamThem: Date;
    GioBatDau: string;
    GioKetThuc: string;
    TongSoGio: number;
    LoaiOT: string;
    HeSoOT: number;
    LyDo: string;
    TrangThai: string;
    NguoiDuyetId: number;
    NgayTao: Date;
    nhanVien: NhanVien;
    nguoiDuyet: NhanVien;
}
