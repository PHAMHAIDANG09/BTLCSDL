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
exports.UpdateHopDongDto = exports.CreateHopDongDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class CreateHopDongDto {
    MaNhanVienId;
    SoHopDong;
    LoaiHopDong;
    NgayBatDau;
    NgayKetThuc;
    NgayKy;
}
exports.CreateHopDongDto = CreateHopDongDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Number)
], CreateHopDongDto.prototype, "MaNhanVienId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'HĐLĐ-2025-001' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateHopDongDto.prototype, "SoHopDong", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Chính thức' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateHopDongDto.prototype, "LoaiHopDong", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2025-01-01' }),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateHopDongDto.prototype, "NgayBatDau", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2026-01-01', required: false }),
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateHopDongDto.prototype, "NgayKetThuc", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2025-01-01' }),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateHopDongDto.prototype, "NgayKy", void 0);
class UpdateHopDongDto {
    SoHopDong;
    LoaiHopDong;
    NgayBatDau;
    NgayKetThuc;
    TrangThai;
}
exports.UpdateHopDongDto = UpdateHopDongDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateHopDongDto.prototype, "SoHopDong", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateHopDongDto.prototype, "LoaiHopDong", void 0);
__decorate([
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateHopDongDto.prototype, "NgayBatDau", void 0);
__decorate([
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateHopDongDto.prototype, "NgayKetThuc", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateHopDongDto.prototype, "TrangThai", void 0);
//# sourceMappingURL=hop-dong.dto.js.map