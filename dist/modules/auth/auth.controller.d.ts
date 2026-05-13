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
