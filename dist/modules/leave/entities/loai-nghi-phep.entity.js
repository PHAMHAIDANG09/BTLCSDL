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
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoaiNghiPhep = void 0;
const typeorm_1 = require("typeorm");
const so_du_phep_entity_1 = require("./so-du-phep.entity");
const don_nghi_phep_entity_1 = require("./don-nghi-phep.entity");
let LoaiNghiPhep = class LoaiNghiPhep {
    Id;
    TenLoaiPhep;
    CoHuongLuong;
    SoNgayToiDaNam;
    MoTa;
    soDuPheps;
    donNghiPheps;
};
exports.LoaiNghiPhep = LoaiNghiPhep;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], LoaiNghiPhep.prototype, "Id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'nvarchar', length: 50, unique: true }),
    __metadata("design:type", String)
], LoaiNghiPhep.prototype, "TenLoaiPhep", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'bit', default: 1 }),
    __metadata("design:type", Boolean)
], LoaiNghiPhep.prototype, "CoHuongLuong", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', default: 12 }),
    __metadata("design:type", Number)
], LoaiNghiPhep.prototype, "SoNgayToiDaNam", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'nvarchar', length: 255, nullable: true }),
    __metadata("design:type", String)
], LoaiNghiPhep.prototype, "MoTa", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => so_du_phep_entity_1.SoDuPhep, (sdp) => sdp.loaiNghiPhep),
    __metadata("design:type", Array)
], LoaiNghiPhep.prototype, "soDuPheps", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => don_nghi_phep_entity_1.DonNghiPhep, (dnp) => dnp.loaiNghiPhep),
    __metadata("design:type", Array)
], LoaiNghiPhep.prototype, "donNghiPheps", void 0);
exports.LoaiNghiPhep = LoaiNghiPhep = __decorate([
    (0, typeorm_1.Entity)('LoaiNghiPhep')
], LoaiNghiPhep);
//# sourceMappingURL=loai-nghi-phep.entity.js.map