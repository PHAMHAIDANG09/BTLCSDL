import { SystemService } from './system.service';
import { NgayLe } from './entities/ngay-le.entity';
import { CreateNgayLeDto } from './dto/create-ngay-le.dto';
export declare class SystemController {
    private readonly systemService;
    constructor(systemService: SystemService);
    getLogs(limit?: string): Promise<import("./entities/nhat-ky-he-thong.entity").NhatKyHeThong[]>;
    getHolidays(): Promise<NgayLe[]>;
    createHoliday(data: CreateNgayLeDto): Promise<NgayLe>;
}
