import { Repository } from 'typeorm';
import { ChamCong } from './entities/cham-cong.entity';
import { DonLamThem } from './entities/don-lam-them.entity';
import { CreateDonLamThemDto } from './dto/don-lam-them.dto';
export declare class AttendanceService {
    private chamCongRepository;
    private donLamThemRepository;
    constructor(chamCongRepository: Repository<ChamCong>, donLamThemRepository: Repository<DonLamThem>);
    checkInOut(userId: number): Promise<ChamCong>;
    approveOT(otId: number, approverId: number, status: 'Approved' | 'Rejected'): Promise<DonLamThem>;
    createOTRequest(userId: number, dto: CreateDonLamThemDto): Promise<DonLamThem>;
    getHistory(employeeId: number, startDate?: Date, endDate?: Date): Promise<ChamCong[]>;
    getAllHistory(startDate: Date, endDate: Date): Promise<ChamCong[]>;
    getAllOTRequests(status?: string): Promise<DonLamThem[]>;
}
