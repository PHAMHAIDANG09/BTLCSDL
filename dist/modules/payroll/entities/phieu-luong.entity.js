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
exports.PhieuLuong = void 0;
const typeorm_1 = require("typeorm");
const nhan_vien_entity_1 = require("../../auth/entities/nhan-vien.entity");
let PhieuLuong = class PhieuLuong {
    Id;
    MaNhanVienId;
    Thang;
    Nam;
    SoNgayCongChuan;
    SoNgayCongThucTe;
    SoNgayNghiHuongLuong;
    SoGioLamThem;
    LuongCoBan;
    PhuCap;
    TienLamThem;
    KhauTruDiMuon;
    BaoHiemXaHoi;
    BaoHiemYTe;
    BaoHiemThatNghiep;
    ThueTNCN;
    CacKhoanKhauTruKhac;
    TongLuongGop;
    LuongThucNhan;
    TrangThai;
    NgayThanhToan;
    GhiChu;
    NguoiTaoId;
    NgayTao;
    nhanVien;
    nguoiTao;
};
exports.PhieuLuong = PhieuLuong;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], PhieuLuong.prototype, "Id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int' }),
    __metadata("design:type", Number)
], PhieuLuong.prototype, "MaNhanVienId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int' }),
    __metadata("design:type", Number)
], PhieuLuong.prototype, "Thang", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int' }),
    __metadata("design:type", Number)
], PhieuLuong.prototype, "Nam", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int' }),
    __metadata("design:type", Number)
], PhieuLuong.prototype, "SoNgayCongChuan", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'float' }),
    __metadata("design:type", Number)
], PhieuLuong.prototype, "SoNgayCongThucTe", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'float', default: 0 }),
    __metadata("design:type", Number)
], PhieuLuong.prototype, "SoNgayNghiHuongLuong", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'float', default: 0 }),
    __metadata("design:type", Number)
], PhieuLuong.prototype, "SoGioLamThem", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 18, scale: 2 }),
    __metadata("design:type", Number)
], PhieuLuong.prototype, "LuongCoBan", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 18, scale: 2 }),
    __metadata("design:type", Number)
], PhieuLuong.prototype, "PhuCap", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 18, scale: 2 }),
    __metadata("design:type", Number)
], PhieuLuong.prototype, "TienLamThem", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 18, scale: 2 }),
    __metadata("design:type", Number)
], PhieuLuong.prototype, "KhauTruDiMuon", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 18, scale: 2 }),
    __metadata("design:type", Number)
], PhieuLuong.prototype, "BaoHiemXaHoi", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 18, scale: 2 }),
    __metadata("design:type", Number)
], PhieuLuong.prototype, "BaoHiemYTe", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 18, scale: 2 }),
    __metadata("design:type", Number)
], PhieuLuong.prototype, "BaoHiemThatNghiep", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 18, scale: 2 }),
    __metadata("design:type", Number)
], PhieuLuong.prototype, "ThueTNCN", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 18, scale: 2 }),
    __metadata("design:type", Number)
], PhieuLuong.prototype, "CacKhoanKhauTruKhac", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 18, scale: 2 }),
    __metadata("design:type", Number)
], PhieuLuong.prototype, "TongLuongGop", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 18, scale: 2 }),
    __metadata("design:type", Number)
], PhieuLuong.prototype, "LuongThucNhan", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'nvarchar', length: 20, default: 'Draft' }),
    __metadata("design:type", String)
], PhieuLuong.prototype, "TrangThai", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'datetime', nullable: true }),
    __metadata("design:type", Date)
], PhieuLuong.prototype, "NgayThanhToan", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'nvarchar', length: 500, nullable: true }),
    __metadata("design:type", String)
], PhieuLuong.prototype, "GhiChu", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int' }),
    __metadata("design:type", Number)
], PhieuLuong.prototype, "NguoiTaoId", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: 'datetime' }),
    __metadata("design:type", Date)
], PhieuLuong.prototype, "NgayTao", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => nhan_vien_entity_1.NhanVien),
    (0, typeorm_1.JoinColumn)({ name: 'MaNhanVienId' }),
    __metadata("design:type", nhan_vien_entity_1.NhanVien)
], PhieuLuong.prototype, "nhanVien", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => nhan_vien_entity_1.NhanVien),
    (0, typeorm_1.JoinColumn)({ name: 'NguoiTaoId' }),
    __metadata("design:type", nhan_vien_entity_1.NhanVien)
], PhieuLuong.prototype, "nguoiTao", void 0);
exports.PhieuLuong = PhieuLuong = __decorate([
    (0, typeorm_1.Entity)('PhieuLuong'),
    (0, typeorm_1.Unique)('UQ_PhieuLuong_KyLuong', ['MaNhanVienId', 'Thang', 'Nam'])
], PhieuLuong);
//# sourceMappingURL=phieu-luong.entity.js.map