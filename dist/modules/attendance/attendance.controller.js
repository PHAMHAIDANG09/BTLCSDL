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
exports.AttendanceController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const attendance_service_1 = require("./attendance.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const don_lam_them_dto_1 = require("./dto/don-lam-them.dto");
const update_ot_dto_1 = require("./dto/update-ot.dto");
let AttendanceController = class AttendanceController {
    attendanceService;
    constructor(attendanceService) {
        this.attendanceService = attendanceService;
    }
    checkInOut(req) {
        return this.attendanceService.checkInOut(req.user.Id);
    }
    getHistory(req, start, end) {
        return this.attendanceService.getHistory(req.user.Id, start ? new Date(start) : undefined, end ? new Date(end) : undefined);
    }
    getAllHistory(start, end) {
        return this.attendanceService.getAllHistory(new Date(start), new Date(end));
    }
    registerOT(dto, req) {
        return this.attendanceService.createOTRequest(req.user.Id, dto);
    }
    approveOT(id, dto, req) {
        return this.attendanceService.approveOT(+id, req.user.Id, dto.status);
    }
    getAllOT(status) {
        return this.attendanceService.getAllOTRequests(status);
    }
};
exports.AttendanceController = AttendanceController;
__decorate([
    (0, common_1.Post)('check-in-out'),
    (0, swagger_1.ApiOperation)({ summary: 'Điểm danh vào/ra hằng ngày' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AttendanceController.prototype, "checkInOut", null);
__decorate([
    (0, common_1.Get)('history'),
    (0, swagger_1.ApiOperation)({ summary: 'Lấy lịch sử chấm công cá nhân' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('startDate')),
    __param(2, (0, common_1.Query)('endDate')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", void 0)
], AttendanceController.prototype, "getHistory", null);
__decorate([
    (0, common_1.Get)('all-history'),
    (0, roles_decorator_1.Roles)('Admin', 'Manager'),
    (0, swagger_1.ApiOperation)({
        summary: 'Lấy lịch sử chấm công toàn bộ nhân viên (Admin/Manager)',
    }),
    __param(0, (0, common_1.Query)('startDate')),
    __param(1, (0, common_1.Query)('endDate')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], AttendanceController.prototype, "getAllHistory", null);
__decorate([
    (0, common_1.Post)('ot'),
    (0, swagger_1.ApiOperation)({ summary: 'Đăng ký làm thêm giờ (OT)' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [don_lam_them_dto_1.CreateDonLamThemDto, Object]),
    __metadata("design:returntype", void 0)
], AttendanceController.prototype, "registerOT", null);
__decorate([
    (0, common_1.Put)('ot/:id/approve'),
    (0, roles_decorator_1.Roles)('Admin', 'Manager'),
    (0, swagger_1.ApiOperation)({ summary: 'Phê duyệt hoặc từ chối yêu cầu làm thêm' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_ot_dto_1.UpdateOTStatusDto, Object]),
    __metadata("design:returntype", void 0)
], AttendanceController.prototype, "approveOT", null);
__decorate([
    (0, common_1.Get)('ot'),
    (0, roles_decorator_1.Roles)('Admin', 'Manager'),
    (0, swagger_1.ApiOperation)({ summary: 'Lấy tất cả yêu cầu làm thêm (Admin/Manager)' }),
    __param(0, (0, common_1.Query)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AttendanceController.prototype, "getAllOT", null);
exports.AttendanceController = AttendanceController = __decorate([
    (0, swagger_1.ApiTags)('Attendance'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, common_1.Controller)('attendance'),
    __metadata("design:paramtypes", [attendance_service_1.AttendanceService])
], AttendanceController);
//# sourceMappingURL=attendance.controller.js.map