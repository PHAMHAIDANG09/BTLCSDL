"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PayrollModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const phieu_luong_entity_1 = require("./entities/phieu-luong.entity");
const lich_su_luong_entity_1 = require("./entities/lich-su-luong.entity");
const cham_cong_entity_1 = require("../attendance/entities/cham-cong.entity");
const don_lam_them_entity_1 = require("../attendance/entities/don-lam-them.entity");
const nhan_vien_entity_1 = require("../auth/entities/nhan-vien.entity");
const payroll_service_1 = require("./payroll.service");
const payroll_controller_1 = require("./payroll.controller");
const mail_module_1 = require("../mail/mail.module");
let PayrollModule = class PayrollModule {
};
exports.PayrollModule = PayrollModule;
exports.PayrollModule = PayrollModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                phieu_luong_entity_1.PhieuLuong,
                lich_su_luong_entity_1.LichSuLuong,
                cham_cong_entity_1.ChamCong,
                don_lam_them_entity_1.DonLamThem,
                nhan_vien_entity_1.NhanVien,
            ]),
            mail_module_1.MailModule,
        ],
        controllers: [payroll_controller_1.PayrollController],
        providers: [payroll_service_1.PayrollService],
        exports: [payroll_service_1.PayrollService],
    })
], PayrollModule);
//# sourceMappingURL=payroll.module.js.map