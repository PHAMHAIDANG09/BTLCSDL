import { Repository, DataSource } from 'typeorm';
import { PhieuLuong } from './entities/phieu-luong.entity';
import { LichSuLuong } from './entities/lich-su-luong.entity';
import { ChamCong } from '../attendance/entities/cham-cong.entity';
import { DonLamThem } from '../attendance/entities/don-lam-them.entity';
import { NhanVien } from '../auth/entities/nhan-vien.entity';
import { MailService } from '../mail/mail.service';
export declare class PayrollService {
    private phieuLuongRepository;
    private lichSuLuongRepository;
    private chamCongRepository;
    private donLamThemRepository;
    private nhanVienRepository;
    private dataSource;
    private mailService;
    constructor(phieuLuongRepository: Repository<PhieuLuong>, lichSuLuongRepository: Repository<LichSuLuong>, chamCongRepository: Repository<ChamCong>, donLamThemRepository: Repository<DonLamThem>, nhanVienRepository: Repository<NhanVien>, dataSource: DataSource, mailService: MailService);
    updateSalary(idNhanVien: number, data: {
        LuongCoBan: number;
        PhuCap: number;
        NguoiThayDoiId: number;
        GhiChu?: string;
    }): Promise<LichSuLuong>;
    calculatePayroll(thang: number, nam: number): Promise<{
        success: boolean;
        message: string;
        processedCount: any;
    }>;
    autoPayrollCron(): Promise<void>;
    getMyPaySlips(employeeId: number): Promise<PhieuLuong[]>;
    getSalaryHistory(employeeId: number): Promise<LichSuLuong[]>;
    getAllPaySlips(thang?: number, nam?: number): Promise<PhieuLuong[]>;
}
