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
exports.LeaveService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const schedule_1 = require("@nestjs/schedule");
const don_nghi_phep_entity_1 = require("./entities/don-nghi-phep.entity");
const so_du_phep_entity_1 = require("./entities/so-du-phep.entity");
const loai_nghi_phep_entity_1 = require("./entities/loai-nghi-phep.entity");
const nhan_vien_entity_1 = require("../auth/entities/nhan-vien.entity");
let LeaveService = class LeaveService {
    donNghiPhepRepository;
    soDuPhepRepository;
    loaiNghiPhepRepository;
    nhanVienRepository;
    dataSource;
    constructor(donNghiPhepRepository, soDuPhepRepository, loaiNghiPhepRepository, nhanVienRepository, dataSource) {
        this.donNghiPhepRepository = donNghiPhepRepository;
        this.soDuPhepRepository = soDuPhepRepository;
        this.loaiNghiPhepRepository = loaiNghiPhepRepository;
        this.nhanVienRepository = nhanVienRepository;
        this.dataSource = dataSource;
    }
    async grantAnnualLeave() {
        const year = new Date().getFullYear();
        const employees = await this.nhanVienRepository.find({
            where: { TrangThai: 'Active' },
        });
        const leaveTypes = await this.loaiNghiPhepRepository.find();
        for (const employee of employees) {
            for (const lt of leaveTypes) {
                const balance = this.soDuPhepRepository.create({
                    MaNhanVienId: employee.Id,
                    MaLoaiPhepId: lt.Id,
                    Nam: year,
                    TongNgayPhep: lt.SoNgayToiDaNam,
                    DaSuDung: 0,
                });
                await this.soDuPhepRepository.save(balance);
            }
        }
    }
    async createLeaveRequest(dto, userId) {
        const balance = await this.soDuPhepRepository.findOne({
            where: {
                MaNhanVienId: userId,
                MaLoaiPhepId: dto.MaLoaiPhepId,
                Nam: new Date().getFullYear(),
            },
        });
        if (!balance || balance.TongNgayPhep - balance.DaSuDung < dto.TongSoNgay) {
            throw new common_1.BadRequestException('Insufficient leave balance');
        }
        const request = this.donNghiPhepRepository.create({
            ...dto,
            MaNhanVienId: userId,
            TrangThai: 'Pending',
        });
        return this.donNghiPhepRepository.save(request);
    }
    async approveLeave(requestId, approverId) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const request = await queryRunner.manager.findOne(don_nghi_phep_entity_1.DonNghiPhep, {
                where: { Id: requestId },
            });
            if (!request || request.TrangThai !== 'Pending') {
                throw new common_1.BadRequestException('Invalid request');
            }
            const balance = await queryRunner.manager.findOne(so_du_phep_entity_1.SoDuPhep, {
                where: {
                    MaNhanVienId: request.MaNhanVienId,
                    MaLoaiPhepId: request.MaLoaiPhepId,
                    Nam: request.NgayBatDau.getFullYear(),
                },
            });
            if (balance) {
                balance.DaSuDung += request.TongSoNgay;
                await queryRunner.manager.save(balance);
            }
            request.TrangThai = 'Approved';
            request.NguoiDuyetId = approverId;
            request.NgayDuyet = new Date();
            await queryRunner.manager.save(request);
            await queryRunner.commitTransaction();
            return { message: 'Leave approved' };
        }
        catch (err) {
            await queryRunner.rollbackTransaction();
            throw err;
        }
        finally {
            await queryRunner.release();
        }
    }
    async createLeaveType(dto) {
        const lt = this.loaiNghiPhepRepository.create(dto);
        return this.loaiNghiPhepRepository.save(lt);
    }
    async findAllLeaveTypes() {
        return this.loaiNghiPhepRepository.find();
    }
    async findOneLeaveType(id) {
        const lt = await this.loaiNghiPhepRepository.findOne({ where: { Id: id } });
        if (!lt)
            throw new common_1.NotFoundException('Leave type not found');
        return lt;
    }
    async updateLeaveType(id, dto) {
        const lt = await this.findOneLeaveType(id);
        Object.assign(lt, dto);
        return this.loaiNghiPhepRepository.save(lt);
    }
    async deleteLeaveType(id) {
        const lt = await this.findOneLeaveType(id);
        return this.loaiNghiPhepRepository.remove(lt);
    }
    async getBalances(employeeId, year) {
        return this.soDuPhepRepository.find({
            where: { MaNhanVienId: employeeId, Nam: year },
            relations: ['loaiNghiPhep'],
        });
    }
    async getLeaveHistory(employeeId) {
        return this.donNghiPhepRepository.find({
            where: { MaNhanVienId: employeeId },
            relations: ['loaiNghiPhep', 'nguoiDuyet'],
            order: { NgayTao: 'DESC' },
        });
    }
    async getAllLeaveRequests(status) {
        const where = {};
        if (status)
            where.TrangThai = status;
        return this.donNghiPhepRepository.find({
            where,
            relations: ['nhanVien', 'loaiNghiPhep'],
            order: { NgayTao: 'DESC' },
        });
    }
};
exports.LeaveService = LeaveService;
__decorate([
    (0, schedule_1.Cron)('0 0 1 1 *'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], LeaveService.prototype, "grantAnnualLeave", null);
exports.LeaveService = LeaveService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(don_nghi_phep_entity_1.DonNghiPhep)),
    __param(1, (0, typeorm_1.InjectRepository)(so_du_phep_entity_1.SoDuPhep)),
    __param(2, (0, typeorm_1.InjectRepository)(loai_nghi_phep_entity_1.LoaiNghiPhep)),
    __param(3, (0, typeorm_1.InjectRepository)(nhan_vien_entity_1.NhanVien)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.DataSource])
], LeaveService);
//# sourceMappingURL=leave.service.js.map