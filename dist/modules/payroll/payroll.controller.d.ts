import { PayrollService } from './payroll.service';
import { UpdateSalaryDto, CalculatePayrollDto } from './dto/payroll.dto';
export declare class PayrollController {
    private readonly payrollService;
    constructor(payrollService: PayrollService);
    updateSalary(data: UpdateSalaryDto, req: any): Promise<import("./entities/lich-su-luong.entity").LichSuLuong>;
    calculate(data: CalculatePayrollDto): Promise<{
        success: boolean;
        message: string;
        processedCount: any;
    }>;
    getMyPaySlips(req: any): Promise<import("./entities/phieu-luong.entity").PhieuLuong[]>;
    getMySalaryHistory(req: any): Promise<import("./entities/lich-su-luong.entity").LichSuLuong[]>;
    getAllPaySlips(thang?: string, nam?: string): Promise<import("./entities/phieu-luong.entity").PhieuLuong[]>;
}
