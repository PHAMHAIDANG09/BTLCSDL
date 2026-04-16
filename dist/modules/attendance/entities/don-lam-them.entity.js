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
exports.DonLamThem = void 0;
const typeorm_1 = require("typeorm");
const nhan_vien_entity_1 = require("../../auth/entities/nhan-vien.entity");
let DonLamThem = class DonLamThem {
    Id;
    MaNhanVienId;
    NgayLamThem;
    GioBatDau;
    GioKetThuc;
    TongSoGio;
    LoaiOT;
    HeSoOT;
    LyDo;
    TrangThai;
    NguoiDuyetId;
    NgayTao;
    nhanVien;
    nguoiDuyet;
};
exports.DonLamThem = DonLamThem;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], DonLamThem.prototype, "Id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int' }),
    __metadata("design:type", Number)
], DonLamThem.prototype, "MaNhanVienId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date' }),
    __metadata("design:type", Date)
], DonLamThem.prototype, "NgayLamThem", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'time' }),
    __metadata("design:type", String)
], DonLamThem.prototype, "GioBatDau", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'time' }),
    __metadata("design:type", String)
], DonLamThem.prototype, "GioKetThuc", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'float' }),
    __metadata("design:type", Number)
], DonLamThem.prototype, "TongSoGio", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'nvarchar', length: 20, default: 'NgayThuong' }),
    __metadata("design:type", String)
], DonLamThem.prototype, "LoaiOT", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 4, scale: 2, default: 1.5 }),
    __metadata("design:type", Number)
], DonLamThem.prototype, "HeSoOT", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'nvarchar', length: 500, nullable: true }),
    __metadata("design:type", String)
], DonLamThem.prototype, "LyDo", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'nvarchar', length: 20, default: 'Pending' }),
    __metadata("design:type", String)
], DonLamThem.prototype, "TrangThai", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', nullable: true }),
    __metadata("design:type", Number)
], DonLamThem.prototype, "NguoiDuyetId", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: 'datetime' }),
    __metadata("design:type", Date)
], DonLamThem.prototype, "NgayTao", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => nhan_vien_entity_1.NhanVien),
    (0, typeorm_1.JoinColumn)({ name: 'MaNhanVienId' }),
    __metadata("design:type", nhan_vien_entity_1.NhanVien)
], DonLamThem.prototype, "nhanVien", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => nhan_vien_entity_1.NhanVien),
    (0, typeorm_1.JoinColumn)({ name: 'NguoiDuyetId' }),
    __metadata("design:type", nhan_vien_entity_1.NhanVien)
], DonLamThem.prototype, "nguoiDuyet", void 0);
exports.DonLamThem = DonLamThem = __decorate([
    (0, typeorm_1.Entity)('DonLamThem')
], DonLamThem);
//# sourceMappingURL=don-lam-them.entity.js.map