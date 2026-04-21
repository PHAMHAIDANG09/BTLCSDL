import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { NhanVien } from './entities/nhan-vien.entity';
import { LoginDto } from './dto/login.dto';
import { AuditService } from '../../system/audit.service';
export declare class AuthService {
    private nhanVienRepository;
    private jwtService;
    private auditService;
    constructor(nhanVienRepository: Repository<NhanVien>, jwtService: JwtService, auditService: AuditService);
    login(loginDto: LoginDto): Promise<{
        access_token: string;
        user: {
            id: number;
            hoTen: string;
            email: string;
            maNhanVien: string;
            role: string;
        };
        getProfile(userId: number): Promise<any>;
    }>;
}
