import { NhanVien } from '../../auth/entities/nhan-vien.entity';
import { PhongBan } from '../../organization/entities/phong-ban.entity';
import { ChucVu } from '../../organization/entities/chuc-vu.entity';
export declare class LichSuDieuChuyen {
    Id: number;
    MaNhanVienId: number;
    PhongBanCuId: number;
    PhongBanMoiId: number;
    ChucVuCuId: number;
    ChucVuMoiId: number;
    NgayHieuLuc: Date;
    LyDo: string;
    NguoiDuyetId: number;
    NgayTao: Date;
    nhanVien: NhanVien;
    phongBanCu: PhongBan;
    phongBanMoi: PhongBan;
    chucVuCu: ChucVu;
    chucVuMoi: ChucVu;
    nguoiDuyet: NhanVien;
}
