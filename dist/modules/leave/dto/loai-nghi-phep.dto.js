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
exports.UpdateLoaiNghiPhepDto = exports.CreateLoaiNghiPhepDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class CreateLoaiNghiPhepDto {
    TenLoaiPhep;
    CoHuongLuong;
    SoNgayToiDaNam;
    MoTa;
}
exports.CreateLoaiNghiPhepDto = CreateLoaiNghiPhepDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Nghỉ phép năm' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateLoaiNghiPhepDto.prototype, "TenLoaiPhep", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: true }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], CreateLoaiNghiPhepDto.prototype, "CoHuongLuong", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 12 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Number)
], CreateLoaiNghiPhepDto.prototype, "SoNgayToiDaNam", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Mô tả...' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateLoaiNghiPhepDto.prototype, "MoTa", void 0);
class UpdateLoaiNghiPhepDto {
    TenLoaiPhep;
    CoHuongLuong;
    SoNgayToiDaNam;
    MoTa;
}
exports.UpdateLoaiNghiPhepDto = UpdateLoaiNghiPhepDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateLoaiNghiPhepDto.prototype, "TenLoaiPhep", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], UpdateLoaiNghiPhepDto.prototype, "CoHuongLuong", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], UpdateLoaiNghiPhepDto.prototype, "SoNgayToiDaNam", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateLoaiNghiPhepDto.prototype, "MoTa", void 0);
//# sourceMappingURL=loai-nghi-phep.dto.js.map