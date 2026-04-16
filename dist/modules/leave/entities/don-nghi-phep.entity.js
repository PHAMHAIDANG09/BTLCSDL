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
exports.DonNghiPhep = void 0;
const typeorm_1 = require("typeorm");
const nhan_vien_entity_1 = require("../../auth/entities/nhan-vien.entity");
const loai_nghi_phep_entity_1 = require("./loai-nghi-phep.entity");
let DonNghiPhep = class DonNghiPhep {
    Id;
    MaNhanVienId;
    MaLoaiPhepId;
    NgayBatDau;
    NgayKetThuc;
    TongSoNgay;
    LyDo;
    TrangThai;
    NguoiDuyetId;
    NgayDuyet;
    LyDoTuChoi;
    NgayTao;
    nhanVien;
    loaiNghiPhep;
    nguoiDuyet;
};
exports.DonNghiPhep = DonNghiPhep;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], DonNghiPhep.prototype, "Id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int' }),
    __metadata("design:type", Number)
], DonNghiPhep.prototype, "MaNhanVienId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int' }),
    __metadata("design:type", Number)
], DonNghiPhep.prototype, "MaLoaiPhepId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date' }),
    __metadata("design:type", Date)
], DonNghiPhep.prototype, "NgayBatDau", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date' }),
    __metadata("design:type", Date)
], DonNghiPhep.prototype, "NgayKetThuc", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'float' }),
    __metadata("design:type", Number)
], DonNghiPhep.prototype, "TongSoNgay", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'nvarchar', length: 500, nullable: true }),
    __metadata("design:type", String)
], DonNghiPhep.prototype, "LyDo", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'nvarchar', length: 20, default: 'Pending' }),
    __metadata("design:type", String)
], DonNghiPhep.prototype, "TrangThai", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', nullable: true }),
    __metadata("design:type", Number)
], DonNghiPhep.prototype, "NguoiDuyetId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'datetime', nullable: true }),
    __metadata("design:type", Date)
], DonNghiPhep.prototype, "NgayDuyet", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'nvarchar', length: 500, nullable: true }),
    __metadata("design:type", String)
], DonNghiPhep.prototype, "LyDoTuChoi", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: 'datetime' }),
    __metadata("design:type", Date)
], DonNghiPhep.prototype, "NgayTao", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => nhan_vien_entity_1.NhanVien),
    (0, typeorm_1.JoinColumn)({ name: 'MaNhanVienId' }),
    __metadata("design:type", nhan_vien_entity_1.NhanVien)
], DonNghiPhep.prototype, "nhanVien", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => loai_nghi_phep_entity_1.LoaiNghiPhep, (lnp) => lnp.donNghiPheps),
    (0, typeorm_1.JoinColumn)({ name: 'MaLoaiPhepId' }),
    __metadata("design:type", loai_nghi_phep_entity_1.LoaiNghiPhep)
], DonNghiPhep.prototype, "loaiNghiPhep", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => nhan_vien_entity_1.NhanVien),
    (0, typeorm_1.JoinColumn)({ name: 'NguoiDuyetId' }),
    __metadata("design:type", nhan_vien_entity_1.NhanVien)
], DonNghiPhep.prototype, "nguoiDuyet", void 0);
exports.DonNghiPhep = DonNghiPhep = __decorate([
    (0, typeorm_1.Entity)('DonNghiPhep')
], DonNghiPhep);
//# sourceMappingURL=don-nghi-phep.entity.js.map