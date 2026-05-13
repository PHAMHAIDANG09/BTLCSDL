import { Repository, DataSource } from 'typeorm';
import { NhanVien } from '../auth/entities/nhan-vien.entity';
import { HopDong } from './entities/hop-dong.entity';
import { CreateNhanVienDto, UpdateNhanVienDto } from './dto/nhan-vien.dto';
import { CreateHopDongDto, UpdateHopDongDto } from './dto/hop-dong.dto';
export declare class EmployeeService {
    private nhanVienRepository;
    private hopDongRepository;
    private dataSource;
    constructor(nhanVienRepository: Repository<NhanVien>, hopDongRepository: Repository<HopDong>, dataSource: DataSource);
    findAll(): Promise<NhanVien[]>;
    findOne(id: number): Promise<NhanVien>;
    updateEmployee(id: number, dto: UpdateNhanVienDto): Promise<NhanVien>;
    deleteEmployee(id: number): Promise<NhanVien>;
    createEmployee(dto: CreateNhanVienDto): Promise<NhanVien>;
    transferEmployee(id: number, data: {
        PhongBanMoiId: number;
        ChucVuMoiId: number;
        LyDo: string;
        NgayHieuLuc: Date;
        NguoiDuyetId: number;
    }): Promise<{
        message: string;
    }>;
    createContract(dto: CreateHopDongDto): Promise<HopDong>;
    findContractsByEmployee(employeeId: number): Promise<HopDong[]>;
    findOneContract(id: number): Promise<HopDong>;
    updateContract(id: number, dto: UpdateHopDongDto): Promise<HopDong>;
    deleteContract(id: number): Promise<HopDong>;
    getExpiringContracts(): Promise<HopDong[]>;
    importEmployeesFromExcel(file: Express.Multer.File): Promise<string>;
    private getCellValue;
}
