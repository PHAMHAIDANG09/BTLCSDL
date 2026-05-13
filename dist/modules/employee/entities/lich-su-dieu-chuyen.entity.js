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
exports.LichSuDieuChuyen = void 0;
const typeorm_1 = require("typeorm");
const nhan_vien_entity_1 = require("../../auth/entities/nhan-vien.entity");
const phong_ban_entity_1 = require("../../organization/entities/phong-ban.entity");
const chuc_vu_entity_1 = require("../../organization/entities/chuc-vu.entity");
let LichSuDieuChuyen = class LichSuDieuChuyen {
    Id;
    MaNhanVienId;
    PhongBanCuId;
    PhongBanMoiId;
    ChucVuCuId;
    ChucVuMoiId;
    NgayHieuLuc;
    LyDo;
    NguoiDuyetId;
    NgayTao;
    nhanVien;
    phongBanCu;
    phongBanMoi;
    chucVuCu;
    chucVuMoi;
    nguoiDuyet;
};
exports.LichSuDieuChuyen = LichSuDieuChuyen;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], LichSuDieuChuyen.prototype, "Id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int' }),
    __metadata("design:type", Number)
], LichSuDieuChuyen.prototype, "MaNhanVienId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', nullable: true }),
    __metadata("design:type", Object)
], LichSuDieuChuyen.prototype, "PhongBanCuId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int' }),
    __metadata("design:type", Number)
], LichSuDieuChuyen.prototype, "PhongBanMoiId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', nullable: true }),
    __metadata("design:type", Object)
], LichSuDieuChuyen.prototype, "ChucVuCuId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int' }),
    __metadata("design:type", Number)
], LichSuDieuChuyen.prototype, "ChucVuMoiId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date' }),
    __metadata("design:type", Date)
], LichSuDieuChuyen.prototype, "NgayHieuLuc", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'nvarchar', length: 500, nullable: true }),
    __metadata("design:type", Object)
], LichSuDieuChuyen.prototype, "LyDo", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int' }),
    __metadata("design:type", Number)
], LichSuDieuChuyen.prototype, "NguoiDuyetId", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: 'datetime' }),
    __metadata("design:type", Date)
], LichSuDieuChuyen.prototype, "NgayTao", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => nhan_vien_entity_1.NhanVien),
    (0, typeorm_1.JoinColumn)({ name: 'MaNhanVienId' }),
    __metadata("design:type", nhan_vien_entity_1.NhanVien)
], LichSuDieuChuyen.prototype, "nhanVien", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => phong_ban_entity_1.PhongBan),
    (0, typeorm_1.JoinColumn)({ name: 'PhongBanCuId' }),
    __metadata("design:type", phong_ban_entity_1.PhongBan)
], LichSuDieuChuyen.prototype, "phongBanCu", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => phong_ban_entity_1.PhongBan),
    (0, typeorm_1.JoinColumn)({ name: 'PhongBanMoiId' }),
    __metadata("design:type", phong_ban_entity_1.PhongBan)
], LichSuDieuChuyen.prototype, "phongBanMoi", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => chuc_vu_entity_1.ChucVu),
    (0, typeorm_1.JoinColumn)({ name: 'ChucVuCuId' }),
    __metadata("design:type", chuc_vu_entity_1.ChucVu)
], LichSuDieuChuyen.prototype, "chucVuCu", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => chuc_vu_entity_1.ChucVu),
    (0, typeorm_1.JoinColumn)({ name: 'ChucVuMoiId' }),
    __metadata("design:type", chuc_vu_entity_1.ChucVu)
], LichSuDieuChuyen.prototype, "chucVuMoi", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => nhan_vien_entity_1.NhanVien),
    (0, typeorm_1.JoinColumn)({ name: 'NguoiDuyetId' }),
    __metadata("design:type", nhan_vien_entity_1.NhanVien)
], LichSuDieuChuyen.prototype, "nguoiDuyet", void 0);
exports.LichSuDieuChuyen = LichSuDieuChuyen = __decorate([
    (0, typeorm_1.Entity)('LichSuDieuChuyen')
], LichSuDieuChuyen);
//# sourceMappingURL=lich-su-dieu-chuyen.entity.js.map