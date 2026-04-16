import { Repository } from 'typeorm';
import { PhongBan } from './entities/phong-ban.entity';
import { ChucVu } from './entities/chuc-vu.entity';
import { CreatePhongBanDto, UpdatePhongBanDto } from './dto/phong-ban.dto';
import { CreateChucVuDto, UpdateChucVuDto } from './dto/chuc-vu.dto';
export declare class OrganizationService {
    private phongBanRepository;
    private chucVuRepository;
    constructor(phongBanRepository: Repository<PhongBan>, chucVuRepository: Repository<ChucVu>);
    createPhongBan(dto: CreatePhongBanDto): Promise<PhongBan>;
    findAllPhongBan(): Promise<PhongBan[]>;
    findOnePhongBan(id: number): Promise<PhongBan>;
    updatePhongBan(id: number, dto: UpdatePhongBanDto): Promise<PhongBan>;
    deletePhongBan(id: number): Promise<PhongBan>;
    createChucVu(dto: CreateChucVuDto): Promise<ChucVu>;
    findAllChucVu(): Promise<ChucVu[]>;
    findOneChucVu(id: number): Promise<ChucVu>;
    updateChucVu(id: number, dto: UpdateChucVuDto): Promise<ChucVu>;
    deleteChucVu(id: number): Promise<ChucVu>;
    getDepartmentTree(): Promise<any[]>;
    private buildTree;
}
