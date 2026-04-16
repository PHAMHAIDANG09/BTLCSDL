"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrganizationService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const phong_ban_entity_1 = require("./entities/phong-ban.entity");
const chuc_vu_entity_1 = require("./entities/chuc-vu.entity");
let OrganizationService = class OrganizationService {
    phongBanRepository;
    chucVuRepository;
    constructor(phongBanRepository, chucVuRepository) {
        this.phongBanRepository = phongBanRepository;
        this.chucVuRepository = chucVuRepository;
    }
    async createPhongBan(dto) {
        const pb = this.phongBanRepository.create(dto);
        return this.phongBanRepository.save(pb);
    }
    async findAllPhongBan() {
        return this.phongBanRepository.find({ relations: ['manager'] });
    }
    async findOnePhongBan(id) {
        const pb = await this.phongBanRepository.findOne({
            where: { Id: id },
            relations: ['manager', 'parentDepartment'],
        });
        if (!pb)
            throw new common_1.NotFoundException('Phong ban not found');
        return pb;
    }
    async updatePhongBan(id, dto) {
        const pb = await this.findOnePhongBan(id);
        Object.assign(pb, dto);
        return this.phongBanRepository.save(pb);
    }
    async deletePhongBan(id) {
        const pb = await this.findOnePhongBan(id);
        return this.phongBanRepository.remove(pb);
    }
    async createChucVu(dto) {
        const cv = this.chucVuRepository.create(dto);
        return this.chucVuRepository.save(cv);
    }
    async findAllChucVu() {
        return this.chucVuRepository.find();
    }
    async findOneChucVu(id) {
        const cv = await this.chucVuRepository.findOne({ where: { Id: id } });
        if (!cv)
            throw new common_1.NotFoundException('Chuc vu not found');
        return cv;
    }
    async updateChucVu(id, dto) {
        const cv = await this.findOneChucVu(id);
        Object.assign(cv, dto);
        return this.chucVuRepository.save(cv);
    }
    async deleteChucVu(id) {
        const cv = await this.findOneChucVu(id);
        return this.chucVuRepository.remove(cv);
    }
    async getDepartmentTree() {
        const allDepts = await this.phongBanRepository.find();
        return this.buildTree(allDepts, null);
    }
    buildTree(departments, parentId) {
        return departments
            .filter((dept) => dept.MaPhongCha === parentId)
            .map((dept) => ({
            ...dept,
            children: this.buildTree(departments, dept.Id),
        }));
    }
};
exports.OrganizationService = OrganizationService;
exports.OrganizationService = OrganizationService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(phong_ban_entity_1.PhongBan)),
    __param(1, (0, typeorm_1.InjectRepository)(chuc_vu_entity_1.ChucVu)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], OrganizationService);
//# sourceMappingURL=organization.service.js.map