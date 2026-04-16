import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
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
    getProfile(req: any): Promise<{
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
