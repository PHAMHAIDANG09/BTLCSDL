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
exports.EmployeeController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const swagger_1 = require("@nestjs/swagger");
const employee_service_1 = require("./employee.service");
const nhan_vien_dto_1 = require("./dto/nhan-vien.dto");
const hop_dong_dto_1 = require("./dto/hop-dong.dto");
const transfer_dto_1 = require("./dto/transfer.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
let EmployeeController = class EmployeeController {
    employeeService;
    constructor(employeeService) {
        this.employeeService = employeeService;
    }
    async importEmployees(file) {
        const message = await this.employeeService.importEmployeesFromExcel(file);
        return { message };
    }
    findAll() {
        return this.employeeService.findAll();
    }
    findOne(id) {
        return this.employeeService.findOne(+id);
    }
    create(dto) {
        return this.employeeService.createEmployee(dto);
    }
    update(id, dto) {
        return this.employeeService.updateEmployee(+id, dto);
    }
    remove(id) {
        return this.employeeService.deleteEmployee(+id);
    }
    transfer(id, data, req) {
        return this.employeeService.transferEmployee(+id, {
            ...data,
            NgayHieuLuc: new Date(data.NgayHieuLuc),
            NguoiDuyetId: req.user.Id,
        });
    }
    getExpiring() {
        return this.employeeService.getExpiringContracts();
    }
    findContractsByEmployee(employeeId) {
        return this.employeeService.findContractsByEmployee(+employeeId);
    }
    findOneContract(id) {
        return this.employeeService.findOneContract(+id);
    }
    createContract(dto) {
        return this.employeeService.createContract(dto);
    }
    updateContract(id, dto) {
        return this.employeeService.updateContract(+id, dto);
    }
    deleteContract(id) {
        return this.employeeService.deleteContract(+id);
    }
};
exports.EmployeeController = EmployeeController;
__decorate([
    (0, common_1.Post)('import'),
    (0, roles_decorator_1.Roles)('Admin'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    (0, swagger_1.ApiOperation)({ summary: 'Import nhân viên từ file Excel' }),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: {
                file: {
                    type: 'string',
                    format: 'binary',
                },
            },
        },
    }),
    __param(0, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], EmployeeController.prototype, "importEmployees", null);
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)('Admin', 'Manager'),
    (0, swagger_1.ApiOperation)({ summary: 'Lấy danh sách tất cả nhân viên' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], EmployeeController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, roles_decorator_1.Roles)('Admin', 'Manager'),
    (0, swagger_1.ApiOperation)({ summary: 'Lấy thông tin chi tiết nhân viên' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], EmployeeController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)('Admin', 'Manager'),
    (0, swagger_1.ApiOperation)({ summary: 'Tạo mới nhân viên' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [nhan_vien_dto_1.CreateNhanVienDto]),
    __metadata("design:returntype", void 0)
], EmployeeController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, roles_decorator_1.Roles)('Admin', 'Manager'),
    (0, swagger_1.ApiOperation)({ summary: 'Cập nhật thông tin nhân viên' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, nhan_vien_dto_1.UpdateNhanVienDto]),
    __metadata("design:returntype", void 0)
], EmployeeController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.Roles)('Admin'),
    (0, swagger_1.ApiOperation)({ summary: 'Xóa nhân viên (Soft delete)' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], EmployeeController.prototype, "remove", null);
__decorate([
    (0, common_1.Post)(':id/transfer'),
    (0, roles_decorator_1.Roles)('Admin'),
    (0, swagger_1.ApiOperation)({ summary: 'Điều chuyển công tác nhân viên' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, transfer_dto_1.TransferEmployeeDto, Object]),
    __metadata("design:returntype", void 0)
], EmployeeController.prototype, "transfer", null);
__decorate([
    (0, common_1.Get)('contracts/expiring'),
    (0, roles_decorator_1.Roles)('Admin', 'Manager'),
    (0, swagger_1.ApiOperation)({ summary: 'Lấy các hợp đồng sắp hết hạn (trong 30 ngày)' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], EmployeeController.prototype, "getExpiring", null);
__decorate([
    (0, common_1.Get)(':employeeId/contracts'),
    (0, roles_decorator_1.Roles)('Admin', 'Manager'),
    (0, swagger_1.ApiOperation)({ summary: 'Lấy danh sách hợp đồng của nhân viên' }),
    __param(0, (0, common_1.Param)('employeeId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], EmployeeController.prototype, "findContractsByEmployee", null);
__decorate([
    (0, common_1.Get)('contracts/:id'),
    (0, roles_decorator_1.Roles)('Admin', 'Manager'),
    (0, swagger_1.ApiOperation)({ summary: 'Lấy chi tiết hợp đồng' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], EmployeeController.prototype, "findOneContract", null);
__decorate([
    (0, common_1.Post)('contracts'),
    (0, roles_decorator_1.Roles)('Admin'),
    (0, swagger_1.ApiOperation)({ summary: 'Tạo mới hợp đồng lao động' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [hop_dong_dto_1.CreateHopDongDto]),
    __metadata("design:returntype", void 0)
], EmployeeController.prototype, "createContract", null);
__decorate([
    (0, common_1.Put)('contracts/:id'),
    (0, roles_decorator_1.Roles)('Admin'),
    (0, swagger_1.ApiOperation)({ summary: 'Cập nhật hợp đồng' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, hop_dong_dto_1.UpdateHopDongDto]),
    __metadata("design:returntype", void 0)
], EmployeeController.prototype, "updateContract", null);
__decorate([
    (0, common_1.Delete)('contracts/:id'),
    (0, roles_decorator_1.Roles)('Admin'),
    (0, swagger_1.ApiOperation)({ summary: 'Xóa hợp đồng' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], EmployeeController.prototype, "deleteContract", null);
exports.EmployeeController = EmployeeController = __decorate([
    (0, swagger_1.ApiTags)('Employees'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, common_1.Controller)('employees'),
    __metadata("design:paramtypes", [employee_service_1.EmployeeService])
], EmployeeController);
//# sourceMappingURL=employee.controller.js.map