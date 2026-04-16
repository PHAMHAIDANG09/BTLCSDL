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
exports.AttendanceService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const cham_cong_entity_1 = require("./entities/cham-cong.entity");
const don_lam_them_entity_1 = require("./entities/don-lam-them.entity");
let AttendanceService = class AttendanceService {
    chamCongRepository;
    donLamThemRepository;
    constructor(chamCongRepository, donLamThemRepository) {
        this.chamCongRepository = chamCongRepository;
        this.donLamThemRepository = donLamThemRepository;
    }
    async checkInOut(userId) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        let attendance = await this.chamCongRepository.findOne({
            where: { MaNhanVienId: userId, NgayLamViec: today },
        });
        if (!attendance) {
            attendance = this.chamCongRepository.create({
                MaNhanVienId: userId,
                NgayLamViec: today,
                GioVao: new Date(),
                TrangThai: 'CoMat',
            });
            const startTime = new Date(today);
            startTime.setHours(8, 30, 0, 0);
            if (attendance.GioVao > startTime) {
                const diff = attendance.GioVao.getTime() - startTime.getTime();
                attendance.SoPhutDiMuon = Math.floor(diff / 60000);
                attendance.TrangThai = 'DiMuon';
            }
        }
        else {
            if (attendance.GioRa)
                throw new common_1.BadRequestException('Already checked out');
            attendance.GioRa = new Date();
            const diffHours = (attendance.GioRa.getTime() - attendance.GioVao.getTime()) / 3600000;
            attendance.SoGioLam = parseFloat(diffHours.toFixed(2));
            const endTime = new Date(today);
            endTime.setHours(17, 30, 0, 0);
            if (attendance.GioRa < endTime && attendance.TrangThai !== 'DiMuon') {
                attendance.TrangThai = 'VeSom';
            }
        }
        return this.chamCongRepository.save(attendance);
    }
    async approveOT(otId, approverId, status) {
        const ot = await this.donLamThemRepository.findOne({ where: { Id: otId } });
        if (!ot)
            throw new common_1.BadRequestException('OT Request not found');
        ot.TrangThai = status;
        ot.NguoiDuyetId = approverId;
        return this.donLamThemRepository.save(ot);
    }
    async createOTRequest(userId, dto) {
        const ot = this.donLamThemRepository.create({
            ...dto,
            MaNhanVienId: userId,
            TrangThai: 'Pending',
        });
        return this.donLamThemRepository.save(ot);
    }
    async getHistory(employeeId, startDate, endDate) {
        const where = { MaNhanVienId: employeeId };
        if (startDate && endDate) {
            where.NgayLamViec = (0, typeorm_2.Between)(startDate, endDate);
        }
        return this.chamCongRepository.find({
            where,
            order: { NgayLamViec: 'DESC' },
        });
    }
    async getAllHistory(startDate, endDate) {
        return this.chamCongRepository.find({
            where: { NgayLamViec: (0, typeorm_2.Between)(startDate, endDate) },
            relations: ['nhanVien'],
            order: { NgayLamViec: 'DESC' },
        });
    }
    async getAllOTRequests(status) {
        const where = {};
        if (status)
            where.TrangThai = status;
        return this.donLamThemRepository.find({
            where,
            relations: ['nhanVien'],
            order: { NgayTao: 'DESC' },
        });
    }
};
exports.AttendanceService = AttendanceService;
exports.AttendanceService = AttendanceService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(cham_cong_entity_1.ChamCong)),
    __param(1, (0, typeorm_1.InjectRepository)(don_lam_them_entity_1.DonLamThem)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], AttendanceService);
//# sourceMappingURL=attendance.service.js.map