import { EmployeeService } from './employee.service';
import { CreateNhanVienDto, UpdateNhanVienDto } from './dto/nhan-vien.dto';
import { CreateHopDongDto, UpdateHopDongDto } from './dto/hop-dong.dto';
import { TransferEmployeeDto } from './dto/transfer.dto';
export declare class EmployeeController {
    private readonly employeeService;
    constructor(employeeService: EmployeeService);
    findAll(): Promise<import("../auth/entities/nhan-vien.entity").NhanVien[]>;
    findOne(id: string): Promise<import("../auth/entities/nhan-vien.entity").NhanVien>;
    create(dto: CreateNhanVienDto): Promise<import("../auth/entities/nhan-vien.entity").NhanVien>;
    update(id: string, dto: UpdateNhanVienDto): Promise<import("../auth/entities/nhan-vien.entity").NhanVien>;
    remove(id: string): Promise<import("../auth/entities/nhan-vien.entity").NhanVien>;
    transfer(id: string, data: TransferEmployeeDto, req: any): Promise<{
        message: string;
    }>;
    getExpiring(): Promise<import("./entities/hop-dong.entity").HopDong[]>;
    findContractsByEmployee(employeeId: string): Promise<import("./entities/hop-dong.entity").HopDong[]>;
    findOneContract(id: string): Promise<import("./entities/hop-dong.entity").HopDong>;
    createContract(dto: CreateHopDongDto): Promise<import("./entities/hop-dong.entity").HopDong>;
    updateContract(id: string, dto: UpdateHopDongDto): Promise<import("./entities/hop-dong.entity").HopDong>;
    deleteContract(id: string): Promise<import("./entities/hop-dong.entity").HopDong>;
}
