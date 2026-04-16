import { NhanVien } from '../../auth/entities/nhan-vien.entity';
import { LoaiNghiPhep } from './loai-nghi-phep.entity';
export declare class DonNghiPhep {
    Id: number;
    MaNhanVienId: number;
    MaLoaiPhepId: number;
    NgayBatDau: Date;
    NgayKetThuc: Date;
    TongSoNgay: number;
    LyDo: string;
    TrangThai: string;
    NguoiDuyetId: number;
    NgayDuyet: Date;
    LyDoTuChoi: string;
    NgayTao: Date;
    nhanVien: NhanVien;
    loaiNghiPhep: LoaiNghiPhep;
    nguoiDuyet: NhanVien;
}
