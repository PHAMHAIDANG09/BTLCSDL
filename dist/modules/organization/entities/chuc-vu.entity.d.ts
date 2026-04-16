import { NhanVien } from '../../auth/entities/nhan-vien.entity';
export declare class ChucVu {
    Id: number;
    TenChucVu: string;
    CapDo: number;
    MoTa: string;
    nhanViens: NhanVien[];
}
