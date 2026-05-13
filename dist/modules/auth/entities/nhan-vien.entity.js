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
exports.NhanVien = void 0;
const typeorm_1 = require("typeorm");
const phong_ban_entity_1 = require("../../organization/entities/phong-ban.entity");
const chuc_vu_entity_1 = require("../../organization/entities/chuc-vu.entity");
const vai_tro_entity_1 = require("./vai-tro.entity");
let NhanVien = class NhanVien {
    Id;
    MaNhanVien;
    HoTen;
    Email;
    MatKhauHash;
    SoDienThoai;
    GioiTinh;
    NgaySinh;
    SoCCCD;
    DiaChi;
    MaSoThue;
    SoNguoiPhuThuoc;
    SoTaiKhoan;
    TenNganHang;
    ChiNhanhNganHang;
    MaPhongId;
    MaChucVuId;
    MaVaiTroId;
    NgayVaoLam;
    NgayNghiViec;
    TrangThai;
    NgayTao;
    NgayCapNhat;
    phongBan;
    chucVu;
    vaiTro;
};
exports.NhanVien = NhanVien;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], NhanVien.prototype, "Id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 20, unique: true }),
    __metadata("design:type", String)
], NhanVien.prototype, "MaNhanVien", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'nvarchar', length: 100 }),
    __metadata("design:type", String)
], NhanVien.prototype, "HoTen", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 100, unique: true }),
    __metadata("design:type", String)
], NhanVien.prototype, "Email", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, select: false }),
    __metadata("design:type", String)
], NhanVien.prototype, "MatKhauHash", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 15, nullable: true }),
    __metadata("design:type", Object)
], NhanVien.prototype, "SoDienThoai", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'nvarchar', length: 10, nullable: true }),
    __metadata("design:type", Object)
], NhanVien.prototype, "GioiTinh", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date', nullable: true }),
    __metadata("design:type", Object)
], NhanVien.prototype, "NgaySinh", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 20, nullable: true }),
    __metadata("design:type", Object)
], NhanVien.prototype, "SoCCCD", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'nvarchar', length: 300, nullable: true }),
    __metadata("design:type", Object)
], NhanVien.prototype, "DiaChi", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 20, nullable: true }),
    __metadata("design:type", Object)
], NhanVien.prototype, "MaSoThue", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', default: 0 }),
    __metadata("design:type", Number)
], NhanVien.prototype, "SoNguoiPhuThuoc", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 30, nullable: true }),
    __metadata("design:type", Object)
], NhanVien.prototype, "SoTaiKhoan", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'nvarchar', length: 100, nullable: true }),
    __metadata("design:type", Object)
], NhanVien.prototype, "TenNganHang", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'nvarchar', length: 100, nullable: true }),
    __metadata("design:type", Object)
], NhanVien.prototype, "ChiNhanhNganHang", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', nullable: true }),
    (0, typeorm_1.Index)('IDX_NhanVien_MaPhong'),
    __metadata("design:type", Object)
], NhanVien.prototype, "MaPhongId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', nullable: true }),
    __metadata("design:type", Object)
], NhanVien.prototype, "MaChucVuId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int' }),
    __metadata("design:type", Number)
], NhanVien.prototype, "MaVaiTroId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date' }),
    __metadata("design:type", Date)
], NhanVien.prototype, "NgayVaoLam", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date', nullable: true }),
    __metadata("design:type", Object)
], NhanVien.prototype, "NgayNghiViec", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'nvarchar', length: 20, default: 'Active' }),
    (0, typeorm_1.Index)('IDX_NhanVien_TrangThai'),
    __metadata("design:type", String)
], NhanVien.prototype, "TrangThai", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: 'datetime' }),
    __metadata("design:type", Date)
], NhanVien.prototype, "NgayTao", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ type: 'datetime', nullable: true }),
    __metadata("design:type", Object)
], NhanVien.prototype, "NgayCapNhat", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => phong_ban_entity_1.PhongBan, (pb) => pb.nhanViens),
    (0, typeorm_1.JoinColumn)({ name: 'MaPhongId' }),
    __metadata("design:type", phong_ban_entity_1.PhongBan)
], NhanVien.prototype, "phongBan", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => chuc_vu_entity_1.ChucVu, (cv) => cv.nhanViens),
    (0, typeorm_1.JoinColumn)({ name: 'MaChucVuId' }),
    __metadata("design:type", chuc_vu_entity_1.ChucVu)
], NhanVien.prototype, "chucVu", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => vai_tro_entity_1.VaiTro, (vt) => vt.nhanViens),
    (0, typeorm_1.JoinColumn)({ name: 'MaVaiTroId' }),
    __metadata("design:type", vai_tro_entity_1.VaiTro)
], NhanVien.prototype, "vaiTro", void 0);
exports.NhanVien = NhanVien = __decorate([
    (0, typeorm_1.Entity)('NhanVien')
], NhanVien);
//# sourceMappingURL=nhan-vien.entity.js.map