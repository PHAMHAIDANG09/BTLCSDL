import { Repository } from 'typeorm';
import { NhanVien } from '../auth/entities/nhan-vien.entity';
import { ChamCong } from '../attendance/entities/cham-cong.entity';
import { DonNghiPhep } from '../leave/entities/don-nghi-phep.entity';
import { HopDong } from '../employee/entities/hop-dong.entity';
export declare class DashboardService {
    private nhanVienRepo;
    private chamCongRepo;
    private nghiPhepRepo;
    private hopDongRepo;
    constructor(nhanVienRepo: Repository<NhanVien>, chamCongRepo: Repository<ChamCong>, nghiPhepRepo: Repository<DonNghiPhep>, hopDongRepo: Repository<HopDong>);
    getStats(): Promise<{
        totalEmployees: number;
        presentToday: number;
        pendingLeaves: number;
        expiringContracts: number;
    }>;
}
