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
exports.LeaveController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const leave_service_1 = require("./leave.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const loai_nghi_phep_dto_1 = require("./dto/loai-nghi-phep.dto");
const don_nghi_phep_dto_1 = require("./dto/don-nghi-phep.dto");
let LeaveController = class LeaveController {
    leaveService;
    constructor(leaveService) {
        this.leaveService = leaveService;
    }
    applyLeave(dto, req) {
        return this.leaveService.createLeaveRequest(dto, req.user.Id);
    }
    approveLeave(id, req) {
        return this.leaveService.approveLeave(+id, req.user.Id);
    }
    getBalances(req, year) {
        const y = year ? +year : new Date().getFullYear();
        return this.leaveService.getBalances(req.user.Id, y);
    }
    getHistory(req) {
        return this.leaveService.getLeaveHistory(req.user.Id);
    }
    getAll(status) {
        return this.leaveService.getAllLeaveRequests(status);
    }
    findAllTypes() {
        return this.leaveService.findAllLeaveTypes();
    }
    createType(dto) {
        return this.leaveService.createLeaveType(dto);
    }
    updateType(id, dto) {
        return this.leaveService.updateLeaveType(+id, dto);
    }
    deleteType(id) {
        return this.leaveService.deleteLeaveType(+id);
    }
};
exports.LeaveController = LeaveController;
__decorate([
    (0, common_1.Post)('apply'),
    (0, swagger_1.ApiOperation)({ summary: 'Gửi đơn xin nghỉ phép' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [don_nghi_phep_dto_1.CreateDonNghiPhepDto, Object]),
    __metadata("design:returntype", void 0)
], LeaveController.prototype, "applyLeave", null);
__decorate([
    (0, common_1.Put)(':id/approve'),
    (0, roles_decorator_1.Roles)('Admin', 'Manager'),
    (0, swagger_1.ApiOperation)({ summary: 'Phê duyệt đơn nghỉ phép và trừ số dư phép' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], LeaveController.prototype, "approveLeave", null);
__decorate([
    (0, common_1.Get)('balances'),
    (0, swagger_1.ApiOperation)({ summary: 'Lấy số dư phép cá nhân' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('year')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], LeaveController.prototype, "getBalances", null);
__decorate([
    (0, common_1.Get)('history'),
    (0, swagger_1.ApiOperation)({ summary: 'Lấy lịch sử nghỉ phép cá nhân' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], LeaveController.prototype, "getHistory", null);
__decorate([
    (0, common_1.Get)('all'),
    (0, roles_decorator_1.Roles)('Admin', 'Manager'),
    (0, swagger_1.ApiOperation)({ summary: 'Lấy tất cả đơn nghỉ phép (Admin/Manager)' }),
    __param(0, (0, common_1.Query)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], LeaveController.prototype, "getAll", null);
__decorate([
    (0, common_1.Get)('types'),
    (0, swagger_1.ApiOperation)({ summary: 'Lấy danh sách các loại nghỉ phép' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], LeaveController.prototype, "findAllTypes", null);
__decorate([
    (0, common_1.Post)('types'),
    (0, roles_decorator_1.Roles)('Admin'),
    (0, swagger_1.ApiOperation)({ summary: 'Tạo mới loại nghỉ phép' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [loai_nghi_phep_dto_1.CreateLoaiNghiPhepDto]),
    __metadata("design:returntype", void 0)
], LeaveController.prototype, "createType", null);
__decorate([
    (0, common_1.Put)('types/:id'),
    (0, roles_decorator_1.Roles)('Admin'),
    (0, swagger_1.ApiOperation)({ summary: 'Cập nhật loại nghỉ phép' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, loai_nghi_phep_dto_1.UpdateLoaiNghiPhepDto]),
    __metadata("design:returntype", void 0)
], LeaveController.prototype, "updateType", null);
__decorate([
    (0, common_1.Delete)('types/:id'),
    (0, roles_decorator_1.Roles)('Admin'),
    (0, swagger_1.ApiOperation)({ summary: 'Xóa loại nghỉ phép' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], LeaveController.prototype, "deleteType", null);
exports.LeaveController = LeaveController = __decorate([
    (0, swagger_1.ApiTags)('Leave Management'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, common_1.Controller)('leave'),
    __metadata("design:paramtypes", [leave_service_1.LeaveService])
], LeaveController);
//# sourceMappingURL=leave.controller.js.map