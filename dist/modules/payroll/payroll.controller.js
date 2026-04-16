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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PayrollController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const payroll_service_1 = require("./payroll.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const payroll_dto_1 = require("./dto/payroll.dto");
let PayrollController = class PayrollController {
    payrollService;
    constructor(payrollService) {
        this.payrollService = payrollService;
    }
    updateSalary(data, req) {
        return this.payrollService.updateSalary(data.MaNhanVienId, {
            ...data,
            NguoiThayDoiId: req.user.Id,
        });
    }
    calculate(data, req) {
        return this.payrollService.calculatePayroll(data.Thang, data.Nam, req.user.Id);
    }
    getMyPaySlips(req) {
        return this.payrollService.getMyPaySlips(req.user.Id);
    }
    getMySalaryHistory(req) {
        return this.payrollService.getSalaryHistory(req.user.Id);
    }
    getAllPaySlips(thang, nam) {
        return this.payrollService.getAllPaySlips(thang ? +thang : undefined, nam ? +nam : undefined);
    }
};
exports.PayrollController = PayrollController;
__decorate([
    (0, common_1.Post)('update-salary'),
    (0, roles_decorator_1.Roles)('Admin'),
    (0, swagger_1.ApiOperation)({ summary: 'Cập nhật mức lương nhân viên (SCD Loại 2)' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [payroll_dto_1.UpdateSalaryDto, Object]),
    __metadata("design:returntype", void 0)
], PayrollController.prototype, "updateSalary", null);
__decorate([
    (0, common_1.Post)('calculate'),
    (0, roles_decorator_1.Roles)('Admin'),
    (0, swagger_1.ApiOperation)({ summary: 'Kích hoạt tính toán bảng lương thủ công' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [payroll_dto_1.CalculatePayrollDto, Object]),
    __metadata("design:returntype", void 0)
], PayrollController.prototype, "calculate", null);
__decorate([
    (0, common_1.Get)('my-payslips'),
    (0, swagger_1.ApiOperation)({ summary: 'Lấy danh sách phiếu lương cá nhân' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], PayrollController.prototype, "getMyPaySlips", null);
__decorate([
    (0, common_1.Get)('my-salary-history'),
    (0, swagger_1.ApiOperation)({ summary: 'Lấy lịch sử thay đổi lương cá nhân' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], PayrollController.prototype, "getMySalaryHistory", null);
__decorate([
    (0, common_1.Get)('all-payslips'),
    (0, roles_decorator_1.Roles)('Admin', 'Manager'),
    (0, swagger_1.ApiOperation)({ summary: 'Lấy toàn bộ phiếu lương (Admin/Manager)' }),
    __param(0, (0, common_1.Query)('thang')),
    __param(1, (0, common_1.Query)('nam')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], PayrollController.prototype, "getAllPaySlips", null);
exports.PayrollController = PayrollController = __decorate([
    (0, swagger_1.ApiTags)('Payroll'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, common_1.Controller)('payroll'),
    __metadata("design:paramtypes", [payroll_service_1.PayrollService])
], PayrollController);
//# sourceMappingURL=payroll.controller.js.map