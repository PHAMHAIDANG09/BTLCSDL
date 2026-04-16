"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LeaveModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const loai_nghi_phep_entity_1 = require("./entities/loai-nghi-phep.entity");
const so_du_phep_entity_1 = require("./entities/so-du-phep.entity");
const don_nghi_phep_entity_1 = require("./entities/don-nghi-phep.entity");
const nhan_vien_entity_1 = require("../auth/entities/nhan-vien.entity");
const leave_service_1 = require("./leave.service");
const leave_controller_1 = require("./leave.controller");
let LeaveModule = class LeaveModule {
};
exports.LeaveModule = LeaveModule;
exports.LeaveModule = LeaveModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([loai_nghi_phep_entity_1.LoaiNghiPhep, so_du_phep_entity_1.SoDuPhep, don_nghi_phep_entity_1.DonNghiPhep, nhan_vien_entity_1.NhanVien]),
        ],
        controllers: [leave_controller_1.LeaveController],
        providers: [leave_service_1.LeaveService],
        exports: [leave_service_1.LeaveService],
    })
], LeaveModule);
//# sourceMappingURL=leave.module.js.map