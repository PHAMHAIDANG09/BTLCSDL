import { NhanVien } from '../../auth/entities/nhan-vien.entity';
export declare class ChamCong {
    Id: number;
    MaNhanVienId: number;
    NgayLamViec: Date;
    GioVao: Date;
    GioRa: Date;
    SoGioLam: number;
    SoPhutDiMuon: number;
    TrangThai: string;
    NguonChamCong: string;
    nhanVien: NhanVien;
}
