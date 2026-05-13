import { NhanVien } from '../../auth/entities/nhan-vien.entity';
export declare class HopDong {
    Id: number;
    MaNhanVienId: number;
    SoHopDong: string;
    LoaiHopDong: string;
    NgayBatDau: Date;
    NgayKetThuc: Date | null;
    NgayKy: Date;
    DuongDanFile: string | null;
    TrangThai: string;
    NgayTao: Date;
    nhanVien: NhanVien;
}
