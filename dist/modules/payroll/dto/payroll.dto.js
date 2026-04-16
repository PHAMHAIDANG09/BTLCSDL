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
exports.CalculatePayrollDto = exports.UpdateSalaryDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class UpdateSalaryDto {
    MaNhanVienId;
    LuongCoBan;
    PhuCap;
    GhiChu;
}
exports.UpdateSalaryDto = UpdateSalaryDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Number)
], UpdateSalaryDto.prototype, "MaNhanVienId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 15000000 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Number)
], UpdateSalaryDto.prototype, "LuongCoBan", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 2000000 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Number)
], UpdateSalaryDto.prototype, "PhuCap", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Tăng lương hàng năm', required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateSalaryDto.prototype, "GhiChu", void 0);
class CalculatePayrollDto {
    Thang;
    Nam;
}
exports.CalculatePayrollDto = CalculatePayrollDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 4 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Number)
], CalculatePayrollDto.prototype, "Thang", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 2026 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Number)
], CalculatePayrollDto.prototype, "Nam", void 0);
//# sourceMappingURL=payroll.dto.js.map