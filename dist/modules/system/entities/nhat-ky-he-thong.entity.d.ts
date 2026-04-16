import { NhanVien } from '../../auth/entities/nhan-vien.entity';
export declare class NhatKyHeThong {
    Id: number;
    TenBang: string;
    MaBanGhi: number;
    HanhDong: string;
    GiaTriCu: string;
    GiaTriMoi: string;
    MaNguoiThucHienId: number;
    NgayThucHien: Date;
    nguoiThucHien: NhanVien;
}
