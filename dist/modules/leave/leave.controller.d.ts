import { LeaveService } from './leave.service';
import { CreateLoaiNghiPhepDto, UpdateLoaiNghiPhepDto } from './dto/loai-nghi-phep.dto';
import { CreateDonNghiPhepDto } from './dto/don-nghi-phep.dto';
export declare class LeaveController {
    private readonly leaveService;
    constructor(leaveService: LeaveService);
    applyLeave(dto: CreateDonNghiPhepDto, req: any): Promise<import("./entities/don-nghi-phep.entity").DonNghiPhep[]>;
    approveLeave(id: string, req: any): Promise<{
        message: string;
    }>;
    getBalances(req: any, year?: string): Promise<import("./entities/so-du-phep.entity").SoDuPhep[]>;
    getHistory(req: any): Promise<import("./entities/don-nghi-phep.entity").DonNghiPhep[]>;
    getAll(status?: string): Promise<import("./entities/don-nghi-phep.entity").DonNghiPhep[]>;
    findAllTypes(): Promise<import("./entities/loai-nghi-phep.entity").LoaiNghiPhep[]>;
    createType(dto: CreateLoaiNghiPhepDto): Promise<import("./entities/loai-nghi-phep.entity").LoaiNghiPhep>;
    updateType(id: string, dto: UpdateLoaiNghiPhepDto): Promise<import("./entities/loai-nghi-phep.entity").LoaiNghiPhep>;
    deleteType(id: string): Promise<import("./entities/loai-nghi-phep.entity").LoaiNghiPhep>;
}
