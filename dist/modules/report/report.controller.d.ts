import { ReportService } from './report.service';
export declare class ReportController {
    private readonly reportService;
    constructor(reportService: ReportService);
    exportAttendance(thang: number, nam: number): Promise<import("@nestjs/common").StreamableFile>;
    exportPayroll(thang: number, nam: number): Promise<import("@nestjs/common").StreamableFile>;
}
