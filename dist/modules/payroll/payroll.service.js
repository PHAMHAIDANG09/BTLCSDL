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
exports.PayrollService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const schedule_1 = require("@nestjs/schedule");
const phieu_luong_entity_1 = require("./entities/phieu-luong.entity");
const lich_su_luong_entity_1 = require("./entities/lich-su-luong.entity");
const cham_cong_entity_1 = require("../attendance/entities/cham-cong.entity");
const don_lam_them_entity_1 = require("../attendance/entities/don-lam-them.entity");
const nhan_vien_entity_1 = require("../auth/entities/nhan-vien.entity");
let PayrollService = class PayrollService {
    phieuLuongRepository;
    lichSuLuongRepository;
    chamCongRepository;
    donLamThemRepository;
    nhanVienRepository;
    dataSource;
    constructor(phieuLuongRepository, lichSuLuongRepository, chamCongRepository, donLamThemRepository, nhanVienRepository, dataSource) {
        this.phieuLuongRepository = phieuLuongRepository;
        this.lichSuLuongRepository = lichSuLuongRepository;
        this.chamCongRepository = chamCongRepository;
        this.donLamThemRepository = donLamThemRepository;
        this.nhanVienRepository = nhanVienRepository;
        this.dataSource = dataSource;
    }
    async updateSalary(idNhanVien, data) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            await queryRunner.manager.update(lich_su_luong_entity_1.LichSuLuong, { MaNhanVienId: idNhanVien, DangHieuLuc: true }, { DangHieuLuc: false, NgayKetThuc: new Date() });
            const newSalary = queryRunner.manager.create(lich_su_luong_entity_1.LichSuLuong, {
                MaNhanVienId: idNhanVien,
                LuongCoBan: data.LuongCoBan,
                PhuCap: data.PhuCap,
                NgayBatDau: new Date(),
                DangHieuLuc: true,
                NguoiThayDoiId: data.NguoiThayDoiId,
                GhiChu: data.GhiChu,
            });
            await queryRunner.manager.save(newSalary);
            await queryRunner.commitTransaction();
            return newSalary;
        }
        catch (err) {
            await queryRunner.rollbackTransaction();
            throw err;
        }
        finally {
            await queryRunner.release();
        }
    }
    async calculatePayroll(thang, nam, adminId) {
        const employees = await this.nhanVienRepository.find({
            where: { TrangThai: 'Active' },
        });
        const results = [];
        for (const emp of employees) {
            const queryRunner = this.dataSource.createQueryRunner();
            await queryRunner.connect();
            await queryRunner.startTransaction();
            try {
                const currentSalary = await this.lichSuLuongRepository.findOne({
                    where: { MaNhanVienId: emp.Id, DangHieuLuc: true },
                });
                if (!currentSalary)
                    continue;
                const startDate = new Date(nam, thang - 1, 1);
                const endDate = new Date(nam, thang, 0);
                const attendances = await this.chamCongRepository.find({
                    where: {
                        MaNhanVienId: emp.Id,
                        NgayLamViec: (0, typeorm_2.MoreThanOrEqual)(startDate) && (0, typeorm_2.LessThanOrEqual)(endDate),
                    },
                });
                const filteredAttendances = attendances.filter((a) => a.NgayLamViec >= startDate && a.NgayLamViec <= endDate);
                const soNgayCongThucTe = filteredAttendances.length;
                const ots = await this.donLamThemRepository.find({
                    where: { MaNhanVienId: emp.Id, TrangThai: 'Approved' },
                });
                const filteredOts = ots.filter((o) => o.NgayLamThem >= startDate && o.NgayLamThem <= endDate);
                const tongGioOT = filteredOts.reduce((sum, o) => sum + o.TongSoGio * Number(o.HeSoOT), 0);
                const tienLamThem = (currentSalary.LuongCoBan / 26 / 8) * tongGioOT;
                const luongGop = currentSalary.LuongCoBan + currentSalary.PhuCap + tienLamThem;
                const bhxh = currentSalary.LuongCoBan * 0.08;
                const bhyt = currentSalary.LuongCoBan * 0.015;
                const bhtn = currentSalary.LuongCoBan * 0.01;
                const giamTruGiaCanh = 11000000;
                const giamTruPhuThuoc = emp.SoNguoiPhuThuoc * 4400000;
                const thuNhapTinhThue = Math.max(0, luongGop - bhxh - bhyt - bhtn - giamTruGiaCanh - giamTruPhuThuoc);
                let thueTNCN = 0;
                if (thuNhapTinhThue > 0)
                    thueTNCN = thuNhapTinhThue * 0.1;
                const luongThucNhan = luongGop - bhxh - bhyt - bhtn - thueTNCN;
                const phieu = queryRunner.manager.create(phieu_luong_entity_1.PhieuLuong, {
                    MaNhanVienId: emp.Id,
                    Thang: thang,
                    Nam: nam,
                    SoNgayCongChuan: 26,
                    SoNgayCongThucTe: soNgayCongThucTe,
                    LuongCoBan: currentSalary.LuongCoBan,
                    PhuCap: currentSalary.PhuCap,
                    TienLamThem: tienLamThem,
                    BaoHiemXaHoi: bhxh,
                    BaoHiemYTe: bhyt,
                    BaoHiemThatNghiep: bhtn,
                    ThueTNCN: thueTNCN,
                    KhauTruDiMuon: 0,
                    CacKhoanKhauTruKhac: 0,
                    TongLuongGop: luongGop,
                    LuongThucNhan: luongThucNhan,
                    NguoiTaoId: adminId,
                });
                await queryRunner.manager.save(phieu);
                await queryRunner.commitTransaction();
                results.push(phieu);
            }
            catch (err) {
                await queryRunner.rollbackTransaction();
            }
            finally {
                await queryRunner.release();
            }
        }
        return results;
    }
    async autoPayrollCron() {
        const today = new Date();
        const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        if (today.getDate() === lastDay.getDate()) {
            await this.calculatePayroll(today.getMonth() + 1, today.getFullYear(), 1);
        }
    }
    async getMyPaySlips(employeeId) {
        return this.phieuLuongRepository.find({
            where: { MaNhanVienId: employeeId },
            order: { Nam: 'DESC', Thang: 'DESC' },
        });
    }
    async getSalaryHistory(employeeId) {
        return this.lichSuLuongRepository.find({
            where: { MaNhanVienId: employeeId },
            relations: ['nguoiThayDoi'],
            order: { NgayBatDau: 'DESC' },
        });
    }
    async getAllPaySlips(thang, nam) {
        const where = {};
        if (thang)
            where.Thang = thang;
        if (nam)
            where.Nam = nam;
        return this.phieuLuongRepository.find({
            where,
            relations: ['nhanVien'],
            order: { Nam: 'DESC', Thang: 'DESC' },
        });
    }
};
exports.PayrollService = PayrollService;
__decorate([
    (0, schedule_1.Cron)('59 23 28-31 * *'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PayrollService.prototype, "autoPayrollCron", null);
exports.PayrollService = PayrollService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(phieu_luong_entity_1.PhieuLuong)),
    __param(1, (0, typeorm_1.InjectRepository)(lich_su_luong_entity_1.LichSuLuong)),
    __param(2, (0, typeorm_1.InjectRepository)(cham_cong_entity_1.ChamCong)),
    __param(3, (0, typeorm_1.InjectRepository)(don_lam_them_entity_1.DonLamThem)),
    __param(4, (0, typeorm_1.InjectRepository)(nhan_vien_entity_1.NhanVien)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.DataSource])
], PayrollService);
//# sourceMappingURL=payroll.service.js.map