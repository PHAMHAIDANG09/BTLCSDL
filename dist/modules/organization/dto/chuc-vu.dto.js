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
exports.UpdateChucVuDto = exports.CreateChucVuDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class CreateChucVuDto {
    TenChucVu;
    CapDo;
    MoTa;
}
exports.CreateChucVuDto = CreateChucVuDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Lập trình viên' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateChucVuDto.prototype, "TenChucVu", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1, description: 'Cấp độ chức vụ (1-10)' }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateChucVuDto.prototype, "CapDo", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Mô tả công việc...', required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateChucVuDto.prototype, "MoTa", void 0);
class UpdateChucVuDto {
    TenChucVu;
    CapDo;
    MoTa;
}
exports.UpdateChucVuDto = UpdateChucVuDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateChucVuDto.prototype, "TenChucVu", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], UpdateChucVuDto.prototype, "CapDo", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateChucVuDto.prototype, "MoTa", void 0);
//# sourceMappingURL=chuc-vu.dto.js.map