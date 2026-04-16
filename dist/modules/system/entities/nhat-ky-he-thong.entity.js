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
exports.NhatKyHeThong = void 0;
const typeorm_1 = require("typeorm");
const nhan_vien_entity_1 = require("../../auth/entities/nhan-vien.entity");
let NhatKyHeThong = class NhatKyHeThong {
    Id;
    TenBang;
    MaBanGhi;
    HanhDong;
    GiaTriCu;
    GiaTriMoi;
    MaNguoiThucHienId;
    NgayThucHien;
    nguoiThucHien;
};
exports.NhatKyHeThong = NhatKyHeThong;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], NhatKyHeThong.prototype, "Id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 100 }),
    __metadata("design:type", String)
], NhatKyHeThong.prototype, "TenBang", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int' }),
    __metadata("design:type", Number)
], NhatKyHeThong.prototype, "MaBanGhi", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'nvarchar', length: 20 }),
    __metadata("design:type", String)
], NhatKyHeThong.prototype, "HanhDong", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'nvarchar', length: 'max', nullable: true }),
    __metadata("design:type", String)
], NhatKyHeThong.prototype, "GiaTriCu", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'nvarchar', length: 'max', nullable: true }),
    __metadata("design:type", String)
], NhatKyHeThong.prototype, "GiaTriMoi", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int' }),
    __metadata("design:type", Number)
], NhatKyHeThong.prototype, "MaNguoiThucHienId", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: 'datetime' }),
    __metadata("design:type", Date)
], NhatKyHeThong.prototype, "NgayThucHien", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => nhan_vien_entity_1.NhanVien),
    (0, typeorm_1.JoinColumn)({ name: 'MaNguoiThucHienId' }),
    __metadata("design:type", nhan_vien_entity_1.NhanVien)
], NhatKyHeThong.prototype, "nguoiThucHien", void 0);
exports.NhatKyHeThong = NhatKyHeThong = __decorate([
    (0, typeorm_1.Entity)('NhatKyHeThong')
], NhatKyHeThong);
//# sourceMappingURL=nhat-ky-he-thong.entity.js.map