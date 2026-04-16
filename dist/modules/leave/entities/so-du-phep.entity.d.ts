import { NhanVien } from '../../auth/entities/nhan-vien.entity';
import { LoaiNghiPhep } from './loai-nghi-phep.entity';
export declare class SoDuPhep {
    MaNhanVienId: number;
    MaLoaiPhepId: number;
    Nam: number;
    TongNgayPhep: number;
    DaSuDung: number;
    nhanVien: NhanVien;
    loaiNghiPhep: LoaiNghiPhep;
}
