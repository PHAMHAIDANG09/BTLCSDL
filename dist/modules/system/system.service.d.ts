import { Repository } from 'typeorm';
import { NhatKyHeThong } from './entities/nhat-ky-he-thong.entity';
import { NgayLe } from './entities/ngay-le.entity';
import { CreateNgayLeDto } from './dto/create-ngay-le.dto';
export declare class SystemService {
    private logRepository;
    private ngayLeRepository;
    constructor(logRepository: Repository<NhatKyHeThong>, ngayLeRepository: Repository<NgayLe>);
    getLogs(limit?: number): Promise<NhatKyHeThong[]>;
    getHolidays(): Promise<NgayLe[]>;
    createHoliday(data: CreateNgayLeDto): Promise<NgayLe>;
}
