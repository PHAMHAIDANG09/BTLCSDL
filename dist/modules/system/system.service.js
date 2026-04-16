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
exports.SystemService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const nhat_ky_he_thong_entity_1 = require("./entities/nhat-ky-he-thong.entity");
const ngay_le_entity_1 = require("./entities/ngay-le.entity");
let SystemService = class SystemService {
    logRepository;
    ngayLeRepository;
    constructor(logRepository, ngayLeRepository) {
        this.logRepository = logRepository;
        this.ngayLeRepository = ngayLeRepository;
    }
    async getLogs(limit = 100) {
        return this.logRepository.find({
            relations: ['nguoiThucHien'],
            order: { NgayThucHien: 'DESC' },
            take: limit,
        });
    }
    async getHolidays() {
        return this.ngayLeRepository.find();
    }
    async createHoliday(data) {
        const hl = this.ngayLeRepository.create(data);
        return this.ngayLeRepository.save(hl);
    }
};
exports.SystemService = SystemService;
exports.SystemService = SystemService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(nhat_ky_he_thong_entity_1.NhatKyHeThong)),
    __param(1, (0, typeorm_1.InjectRepository)(ngay_le_entity_1.NgayLe)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], SystemService);
//# sourceMappingURL=system.service.js.map