import { Repository, DataSource } from 'typeorm';
import { DonNghiPhep } from './entities/don-nghi-phep.entity';
import { SoDuPhep } from './entities/so-du-phep.entity';
import { LoaiNghiPhep } from './entities/loai-nghi-phep.entity';
import { NhanVien } from '../auth/entities/nhan-vien.entity';
import { CreateLoaiNghiPhepDto, UpdateLoaiNghiPhepDto } from './dto/loai-nghi-phep.dto';
export declare class LeaveService {
    private donNghiPhepRepository;
    private soDuPhepRepository;
    private loaiNghiPhepRepository;
    private nhanVienRepository;
    private dataSource;
    constructor(donNghiPhepRepository: Repository<DonNghiPhep>, soDuPhepRepository: Repository<SoDuPhep>, loaiNghiPhepRepository: Repository<LoaiNghiPhep>, nhanVienRepository: Repository<NhanVien>, dataSource: DataSource);
    grantAnnualLeave(): Promise<void>;
    createLeaveRequest(dto: any, userId: number): Promise<DonNghiPhep[]>;
    approveLeave(requestId: number, approverId: number): Promise<{
        message: string;
    }>;
    createLeaveType(dto: CreateLoaiNghiPhepDto): Promise<LoaiNghiPhep>;
    findAllLeaveTypes(): Promise<LoaiNghiPhep[]>;
    findOneLeaveType(id: number): Promise<LoaiNghiPhep>;
    updateLeaveType(id: number, dto: UpdateLoaiNghiPhepDto): Promise<LoaiNghiPhep>;
    deleteLeaveType(id: number): Promise<LoaiNghiPhep>;
    getBalances(employeeId: number, year: number): Promise<SoDuPhep[]>;
    getLeaveHistory(employeeId: number): Promise<DonNghiPhep[]>;
    getAllLeaveRequests(status?: string): Promise<DonNghiPhep[]>;
}
