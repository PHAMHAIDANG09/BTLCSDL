import { AttendanceService } from './attendance.service';
import { CreateDonLamThemDto } from './dto/don-lam-them.dto';
import { UpdateOTStatusDto } from './dto/update-ot.dto';
export declare class AttendanceController {
    private readonly attendanceService;
    constructor(attendanceService: AttendanceService);
    checkInOut(req: any): Promise<import("./entities/cham-cong.entity").ChamCong>;
    getHistory(req: any, start?: string, end?: string): Promise<import("./entities/cham-cong.entity").ChamCong[]>;
    getAllHistory(start: string, end: string): Promise<import("./entities/cham-cong.entity").ChamCong[]>;
    registerOT(dto: CreateDonLamThemDto, req: any): Promise<import("./entities/don-lam-them.entity").DonLamThem>;
    approveOT(id: string, dto: UpdateOTStatusDto, req: any): Promise<import("./entities/don-lam-them.entity").DonLamThem>;
    getAllOT(status?: string): Promise<import("./entities/don-lam-them.entity").DonLamThem[]>;
}
