import { StreamableFile } from '@nestjs/common';
import { Repository } from 'typeorm';
import { ChamCong } from '../attendance/entities/cham-cong.entity';
import { PhieuLuong } from '../payroll/entities/phieu-luong.entity';
export declare class ReportService {
    private chamCongRepository;
    private phieuLuongRepository;
    constructor(chamCongRepository: Repository<ChamCong>, phieuLuongRepository: Repository<PhieuLuong>);
    exportAttendance(thang: number, nam: number): Promise<StreamableFile>;
    exportPayroll(thang: number, nam: number): Promise<StreamableFile>;
}
