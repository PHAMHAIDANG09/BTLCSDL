import { NhanVien } from '../../auth/entities/nhan-vien.entity';
export declare class PhongBan {
    Id: number;
    TenPhong: string;
    MaPhong: string;
    MaPhongCha: number;
    MaQuanLy: number;
    DangHoatDong: boolean;
    NgayTao: Date;
    parentDepartment: PhongBan;
    subDepartments: PhongBan[];
    manager: NhanVien;
    nhanViens: NhanVien[];
}
