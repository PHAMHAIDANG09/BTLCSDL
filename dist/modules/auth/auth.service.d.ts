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
        SoDienThoai: string | null;
        GioiTinh: string | null;
        NgaySinh: Date | null;
        SoCCCD: string | null;
        DiaChi: string | null;
        MaSoThue: string | null;
        SoNguoiPhuThuoc: number;
        SoTaiKhoan: string | null;
        TenNganHang: string | null;
        ChiNhanhNganHang: string | null;
        MaPhongId: number | null;
        MaChucVuId: number | null;
        MaVaiTroId: number;
        NgayVaoLam: Date;
        NgayNghiViec: Date | null;
        TrangThai: string;
        NgayTao: Date;
        NgayCapNhat: Date | null;
        phongBan: import("../organization/entities/phong-ban.entity").PhongBan;
        chucVu: import("../organization/entities/chuc-vu.entity").ChucVu;
        vaiTro: import("./entities/vai-tro.entity").VaiTro;
    } | null>;
}
