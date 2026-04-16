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
exports.LichSuLuong = void 0;
const typeorm_1 = require("typeorm");
const nhan_vien_entity_1 = require("../../auth/entities/nhan-vien.entity");
let LichSuLuong = class LichSuLuong {
    Id;
    MaNhanVienId;
    LuongCoBan;
    PhuCap;
    NgayBatDau;
    NgayKetThuc;
    DangHieuLuc;
    NguoiThayDoiId;
    GhiChu;
    NgayTao;
    nhanVien;
    nguoiThayDoi;
};
exports.LichSuLuong = LichSuLuong;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], LichSuLuong.prototype, "Id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int' }),
    __metadata("design:type", Number)
], LichSuLuong.prototype, "MaNhanVienId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 18, scale: 2 }),
    __metadata("design:type", Number)
], LichSuLuong.prototype, "LuongCoBan", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 18, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], LichSuLuong.prototype, "PhuCap", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date' }),
    __metadata("design:type", Date)
], LichSuLuong.prototype, "NgayBatDau", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date', nullable: true }),
    __metadata("design:type", Date)
], LichSuLuong.prototype, "NgayKetThuc", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'bit', default: 1 }),
    __metadata("design:type", Boolean)
], LichSuLuong.prototype, "DangHieuLuc", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int' }),
    __metadata("design:type", Number)
], LichSuLuong.prototype, "NguoiThayDoiId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'nvarchar', length: 500, nullable: true }),
    __metadata("design:type", String)
], LichSuLuong.prototype, "GhiChu", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: 'datetime' }),
    __metadata("design:type", Date)
], LichSuLuong.prototype, "NgayTao", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => nhan_vien_entity_1.NhanVien),
    (0, typeorm_1.JoinColumn)({ name: 'MaNhanVienId' }),
    __metadata("design:type", nhan_vien_entity_1.NhanVien)
], LichSuLuong.prototype, "nhanVien", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => nhan_vien_entity_1.NhanVien),
    (0, typeorm_1.JoinColumn)({ name: 'NguoiThayDoiId' }),
    __metadata("design:type", nhan_vien_entity_1.NhanVien)
], LichSuLuong.prototype, "nguoiThayDoi", void 0);
exports.LichSuLuong = LichSuLuong = __decorate([
    (0, typeorm_1.Entity)('LichSuLuong'),
    (0, typeorm_1.Index)('IDX_LichSuLuong_HienTai', ['MaNhanVienId', 'DangHieuLuc'])
], LichSuLuong);
//# sourceMappingURL=lich-su-luong.entity.js.map