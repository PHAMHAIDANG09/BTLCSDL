import { OrganizationService } from './organization.service';
import { CreatePhongBanDto, UpdatePhongBanDto } from './dto/phong-ban.dto';
import { CreateChucVuDto, UpdateChucVuDto } from './dto/chuc-vu.dto';
export declare class OrganizationController {
    private readonly orgService;
    constructor(orgService: OrganizationService);
    createPhongBan(dto: CreatePhongBanDto): Promise<import("./entities/phong-ban.entity").PhongBan>;
    getTree(): Promise<any[]>;
    findAll(): Promise<import("./entities/phong-ban.entity").PhongBan[]>;
    findOne(id: string): Promise<import("./entities/phong-ban.entity").PhongBan>;
    updatePhongBan(id: string, dto: UpdatePhongBanDto): Promise<import("./entities/phong-ban.entity").PhongBan>;
    deletePhongBan(id: string): Promise<import("./entities/phong-ban.entity").PhongBan>;
    findAllChucVu(): Promise<import("./entities/chuc-vu.entity").ChucVu[]>;
    findOneChucVu(id: string): Promise<import("./entities/chuc-vu.entity").ChucVu>;
    createChucVu(dto: CreateChucVuDto): Promise<import("./entities/chuc-vu.entity").ChucVu>;
    updateChucVu(id: string, dto: UpdateChucVuDto): Promise<import("./entities/chuc-vu.entity").ChucVu>;
    deleteChucVu(id: string): Promise<import("./entities/chuc-vu.entity").ChucVu>;
}
