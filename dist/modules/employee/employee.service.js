"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmployeeService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const nhan_vien_entity_1 = require("../auth/entities/nhan-vien.entity");
const hop_dong_entity_1 = require("./entities/hop-dong.entity");
const lich_su_dieu_chuyen_entity_1 = require("./entities/lich-su-dieu-chuyen.entity");
const bcrypt = __importStar(require("bcrypt"));
let EmployeeService = class EmployeeService {
    nhanVienRepository;
    hopDongRepository;
    dataSource;
    constructor(nhanVienRepository, hopDongRepository, dataSource) {
        this.nhanVienRepository = nhanVienRepository;
        this.hopDongRepository = hopDongRepository;
        this.dataSource = dataSource;
    }
    async findAll() {
        return this.nhanVienRepository.find({
            relations: ['phongBan', 'chucVu', 'vaiTro'],
        });
    }
    async findOne(id) {
        const nv = await this.nhanVienRepository.findOne({
            where: { Id: id },
            relations: ['phongBan', 'chucVu', 'vaiTro'],
        });
        if (!nv)
            throw new common_1.BadRequestException('Employee not found');
        return nv;
    }
    async updateEmployee(id, dto) {
        const nv = await this.findOne(id);
        Object.assign(nv, dto);
        return this.nhanVienRepository.save(nv);
    }
    async deleteEmployee(id) {
        const nv = await this.findOne(id);
        nv.TrangThai = 'Inactive';
        return this.nhanVienRepository.save(nv);
    }
    async createEmployee(dto) {
        const year = new Date().getFullYear();
        const count = await this.nhanVienRepository.count();
        const maNhanVien = `EMP-${year}-${(count + 1).toString().padStart(3, '0')}`;
        const hashedPassword = await bcrypt.hash(dto.MatKhau, 10);
        const nv = this.nhanVienRepository.create({
            ...dto,
            MaNhanVien: maNhanVien,
            MatKhauHash: hashedPassword,
        });
        return this.nhanVienRepository.save(nv);
    }
    async transferEmployee(id, data) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const nv = await queryRunner.manager.findOne(nhan_vien_entity_1.NhanVien, { where: { Id: id } });
            if (!nv)
                throw new common_1.BadRequestException('Employee not found');
            const history = queryRunner.manager.create(lich_su_dieu_chuyen_entity_1.LichSuDieuChuyen, {
                MaNhanVienId: id,
                PhongBanCuId: nv.MaPhongId,
                PhongBanMoiId: data.PhongBanMoiId,
                ChucVuCuId: nv.MaChucVuId,
                ChucVuMoiId: data.ChucVuMoiId,
                NgayHieuLuc: data.NgayHieuLuc,
                LyDo: data.LyDo,
                NguoiDuyetId: data.NguoiDuyetId,
            });
            await queryRunner.manager.save(history);
            nv.MaPhongId = data.PhongBanMoiId;
            nv.MaChucVuId = data.ChucVuMoiId;
            await queryRunner.manager.save(nv);
            await queryRunner.commitTransaction();
            return { message: 'Transfer successful' };
        }
        catch (err) {
            await queryRunner.rollbackTransaction();
            throw err;
        }
        finally {
            await queryRunner.release();
        }
    }
    async createContract(dto) {
        const hd = this.hopDongRepository.create(dto);
        return this.hopDongRepository.save(hd);
    }
    async findContractsByEmployee(employeeId) {
        return this.hopDongRepository.find({
            where: { MaNhanVienId: employeeId },
            order: { NgayKy: 'DESC' },
        });
    }
    async findOneContract(id) {
        const hd = await this.hopDongRepository.findOne({
            where: { Id: id },
            relations: ['nhanVien'],
        });
        if (!hd)
            throw new common_1.NotFoundException('Contract not found');
        return hd;
    }
    async updateContract(id, dto) {
        const hd = await this.findOneContract(id);
        Object.assign(hd, dto);
        return this.hopDongRepository.save(hd);
    }
    async deleteContract(id) {
        const hd = await this.findOneContract(id);
        return this.hopDongRepository.remove(hd);
    }
    async getExpiringContracts() {
        const thirtyDaysFromNow = new Date();
        thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
        return this.hopDongRepository.find({
            where: {
                NgayKetThuc: thirtyDaysFromNow,
                TrangThai: 'Active',
            },
            relations: ['nhanVien'],
        });
    }
};
exports.EmployeeService = EmployeeService;
exports.EmployeeService = EmployeeService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(nhan_vien_entity_1.NhanVien)),
    __param(1, (0, typeorm_1.InjectRepository)(hop_dong_entity_1.HopDong)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.DataSource])
], EmployeeService);
//# sourceMappingURL=employee.service.js.map