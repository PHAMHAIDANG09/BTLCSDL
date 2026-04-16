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
exports.SoDuPhep = void 0;
const typeorm_1 = require("typeorm");
const nhan_vien_entity_1 = require("../../auth/entities/nhan-vien.entity");
const loai_nghi_phep_entity_1 = require("./loai-nghi-phep.entity");
let SoDuPhep = class SoDuPhep {
    MaNhanVienId;
    MaLoaiPhepId;
    Nam;
    TongNgayPhep;
    DaSuDung;
    nhanVien;
    loaiNghiPhep;
};
exports.SoDuPhep = SoDuPhep;
__decorate([
    (0, typeorm_1.PrimaryColumn)({ type: 'int' }),
    __metadata("design:type", Number)
], SoDuPhep.prototype, "MaNhanVienId", void 0);
__decorate([
    (0, typeorm_1.PrimaryColumn)({ type: 'int' }),
    __metadata("design:type", Number)
], SoDuPhep.prototype, "MaLoaiPhepId", void 0);
__decorate([
    (0, typeorm_1.PrimaryColumn)({ type: 'int' }),
    __metadata("design:type", Number)
], SoDuPhep.prototype, "Nam", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', default: 12 }),
    __metadata("design:type", Number)
], SoDuPhep.prototype, "TongNgayPhep", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', default: 0 }),
    __metadata("design:type", Number)
], SoDuPhep.prototype, "DaSuDung", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => nhan_vien_entity_1.NhanVien),
    (0, typeorm_1.JoinColumn)({ name: 'MaNhanVienId' }),
    __metadata("design:type", nhan_vien_entity_1.NhanVien)
], SoDuPhep.prototype, "nhanVien", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => loai_nghi_phep_entity_1.LoaiNghiPhep, (lnp) => lnp.soDuPheps),
    (0, typeorm_1.JoinColumn)({ name: 'MaLoaiPhepId' }),
    __metadata("design:type", loai_nghi_phep_entity_1.LoaiNghiPhep)
], SoDuPhep.prototype, "loaiNghiPhep", void 0);
exports.SoDuPhep = SoDuPhep = __decorate([
    (0, typeorm_1.Entity)('SoDuPhep')
], SoDuPhep);
//# sourceMappingURL=so-du-phep.entity.js.map