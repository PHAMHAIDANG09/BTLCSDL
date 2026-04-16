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
exports.PhongBan = void 0;
const typeorm_1 = require("typeorm");
const nhan_vien_entity_1 = require("../../auth/entities/nhan-vien.entity");
let PhongBan = class PhongBan {
    Id;
    TenPhong;
    MaPhong;
    MaPhongCha;
    MaQuanLy;
    DangHoatDong;
    NgayTao;
    parentDepartment;
    subDepartments;
    manager;
    nhanViens;
};
exports.PhongBan = PhongBan;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], PhongBan.prototype, "Id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'nvarchar', length: 100 }),
    __metadata("design:type", String)
], PhongBan.prototype, "TenPhong", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 20, unique: true }),
    __metadata("design:type", String)
], PhongBan.prototype, "MaPhong", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', nullable: true }),
    (0, typeorm_1.Index)('IDX_PhongBan_MaPhongCha'),
    __metadata("design:type", Number)
], PhongBan.prototype, "MaPhongCha", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', nullable: true }),
    __metadata("design:type", Number)
], PhongBan.prototype, "MaQuanLy", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'bit', default: 1 }),
    __metadata("design:type", Boolean)
], PhongBan.prototype, "DangHoatDong", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: 'datetime' }),
    __metadata("design:type", Date)
], PhongBan.prototype, "NgayTao", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => PhongBan, (pb) => pb.subDepartments),
    (0, typeorm_1.JoinColumn)({ name: 'MaPhongCha' }),
    __metadata("design:type", PhongBan)
], PhongBan.prototype, "parentDepartment", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => PhongBan, (pb) => pb.parentDepartment),
    __metadata("design:type", Array)
], PhongBan.prototype, "subDepartments", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => nhan_vien_entity_1.NhanVien),
    (0, typeorm_1.JoinColumn)({ name: 'MaQuanLy' }),
    __metadata("design:type", nhan_vien_entity_1.NhanVien)
], PhongBan.prototype, "manager", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => nhan_vien_entity_1.NhanVien, (nv) => nv.phongBan),
    __metadata("design:type", Array)
], PhongBan.prototype, "nhanViens", void 0);
exports.PhongBan = PhongBan = __decorate([
    (0, typeorm_1.Entity)('PhongBan')
], PhongBan);
//# sourceMappingURL=phong-ban.entity.js.map