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
exports.OrganizationController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const organization_service_1 = require("./organization.service");
const phong_ban_dto_1 = require("./dto/phong-ban.dto");
const chuc_vu_dto_1 = require("./dto/chuc-vu.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
let OrganizationController = class OrganizationController {
    orgService;
    constructor(orgService) {
        this.orgService = orgService;
    }
    createPhongBan(dto) {
        return this.orgService.createPhongBan(dto);
    }
    getTree() {
        return this.orgService.getDepartmentTree();
    }
    findAll() {
        return this.orgService.findAllPhongBan();
    }
    findOne(id) {
        return this.orgService.findOnePhongBan(+id);
    }
    updatePhongBan(id, dto) {
        return this.orgService.updatePhongBan(+id, dto);
    }
    deletePhongBan(id) {
        return this.orgService.deletePhongBan(+id);
    }
    findAllChucVu() {
        return this.orgService.findAllChucVu();
    }
    findOneChucVu(id) {
        return this.orgService.findOneChucVu(+id);
    }
    createChucVu(dto) {
        return this.orgService.createChucVu(dto);
    }
    updateChucVu(id, dto) {
        return this.orgService.updateChucVu(+id, dto);
    }
    deleteChucVu(id) {
        return this.orgService.deleteChucVu(+id);
    }
};
exports.OrganizationController = OrganizationController;
__decorate([
    (0, common_1.Post)('phong-ban'),
    (0, roles_decorator_1.Roles)('Admin'),
    (0, swagger_1.ApiOperation)({ summary: 'Tạo mới phòng ban' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [phong_ban_dto_1.CreatePhongBanDto]),
    __metadata("design:returntype", void 0)
], OrganizationController.prototype, "createPhongBan", null);
__decorate([
    (0, common_1.Get)('phong-ban/tree'),
    (0, swagger_1.ApiOperation)({ summary: 'Lấy sơ đồ tổ chức phòng ban (cây)' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], OrganizationController.prototype, "getTree", null);
__decorate([
    (0, common_1.Get)('phong-ban'),
    (0, swagger_1.ApiOperation)({ summary: 'Lấy danh sách tất cả phòng ban' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], OrganizationController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('phong-ban/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Lấy thông tin chi tiết phòng ban' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], OrganizationController.prototype, "findOne", null);
__decorate([
    (0, common_1.Put)('phong-ban/:id'),
    (0, roles_decorator_1.Roles)('Admin'),
    (0, swagger_1.ApiOperation)({ summary: 'Cập nhật phòng ban' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, phong_ban_dto_1.UpdatePhongBanDto]),
    __metadata("design:returntype", void 0)
], OrganizationController.prototype, "updatePhongBan", null);
__decorate([
    (0, common_1.Delete)('phong-ban/:id'),
    (0, roles_decorator_1.Roles)('Admin'),
    (0, swagger_1.ApiOperation)({ summary: 'Xóa phòng ban' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], OrganizationController.prototype, "deletePhongBan", null);
__decorate([
    (0, common_1.Get)('chuc-vu'),
    (0, swagger_1.ApiOperation)({ summary: 'Lấy danh sách tất cả chức vụ' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], OrganizationController.prototype, "findAllChucVu", null);
__decorate([
    (0, common_1.Get)('chuc-vu/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Lấy thông tin chi tiết chức vụ' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], OrganizationController.prototype, "findOneChucVu", null);
__decorate([
    (0, common_1.Post)('chuc-vu'),
    (0, roles_decorator_1.Roles)('Admin'),
    (0, swagger_1.ApiOperation)({ summary: 'Tạo mới chức vụ' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [chuc_vu_dto_1.CreateChucVuDto]),
    __metadata("design:returntype", void 0)
], OrganizationController.prototype, "createChucVu", null);
__decorate([
    (0, common_1.Put)('chuc-vu/:id'),
    (0, roles_decorator_1.Roles)('Admin'),
    (0, swagger_1.ApiOperation)({ summary: 'Cập nhật chức vụ' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, chuc_vu_dto_1.UpdateChucVuDto]),
    __metadata("design:returntype", void 0)
], OrganizationController.prototype, "updateChucVu", null);
__decorate([
    (0, common_1.Delete)('chuc-vu/:id'),
    (0, roles_decorator_1.Roles)('Admin'),
    (0, swagger_1.ApiOperation)({ summary: 'Xóa chức vụ' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], OrganizationController.prototype, "deleteChucVu", null);
exports.OrganizationController = OrganizationController = __decorate([
    (0, swagger_1.ApiTags)('Organization'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, common_1.Controller)('organization'),
    __metadata("design:paramtypes", [organization_service_1.OrganizationService])
], OrganizationController);
//# sourceMappingURL=organization.controller.js.map