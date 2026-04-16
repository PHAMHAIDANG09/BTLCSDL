import { NhanVien } from '../../auth/entities/nhan-vien.entity';
export declare class HopDong {
    Id: number;
    MaNhanVienId: number;
    SoHopDong: string;
    LoaiHopDong: string;
    NgayBatDau: Date;
    NgayKetThuc: Date;
    NgayKy: Date;
    DuongDanFile: string;
    TrangThai: string;
    NgayTao: Date;
    nhanVien: NhanVien;
}
