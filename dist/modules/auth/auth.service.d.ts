import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { NhanVien } from './entities/nhan-vien.entity';
import { LoginDto } from './dto/login.dto';
export declare class AuthService {
    private nhanVienRepository;
    private jwtService;
    constructor(nhanVienRepository: Repository<NhanVien>, jwtService: JwtService);
    login(loginDto: LoginDto): Promise<{
        access_token: string;
        user: {
            id: number;
            hoTen: string;
            email: string;
            maNhanVien: string;
            role: string;
        };
    }>;
    getProfile(userId: number): Promise<{
        Id: number;
        MaNhanVien: string;
        HoTen: string;
        Email: string;
        SoDienThoai: string;
        GioiTinh: string;
        NgaySinh: Date;
        SoCCCD: string;
        DiaChi: string;
        MaSoThue: string;
        SoNguoiPhuThuoc: number;
        SoTaiKhoan: string;
        TenNganHang: string;
        ChiNhanhNganHang: string;
        MaPhongId: number;
        MaChucVuId: number;
        MaVaiTroId: number;
        NgayVaoLam: Date;
        NgayNghiViec: Date;
        TrangThai: string;
        NgayTao: Date;
        NgayCapNhat: Date;
        phongBan: import("../organization/entities/phong-ban.entity").PhongBan;
        chucVu: import("../organization/entities/chuc-vu.entity").ChucVu;
        vaiTro: import("./entities/vai-tro.entity").VaiTro;
    } | null>;
}
