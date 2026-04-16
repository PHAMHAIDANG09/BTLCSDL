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
var AuditSubscriber_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuditSubscriber = void 0;
const typeorm_1 = require("typeorm");
const common_1 = require("@nestjs/common");
const nhat_ky_he_thong_entity_1 = require("./entities/nhat-ky-he-thong.entity");
let AuditSubscriber = AuditSubscriber_1 = class AuditSubscriber {
    dataSource;
    logger = new common_1.Logger(AuditSubscriber_1.name);
    constructor(dataSource) {
        this.dataSource = dataSource;
        this.dataSource.subscribers.push(this);
    }
    afterInsert(event) {
        this.logAction(event, 'INSERT', null, event.entity);
    }
    afterUpdate(event) {
        this.logAction(event, 'UPDATE', event.databaseEntity, event.entity);
    }
    async logAction(event, action, oldVal, newVal) {
        const tableName = event.metadata.tableName;
        if (tableName === 'NhatKyHeThong')
            return;
        try {
            const logRepo = event.manager.getRepository(nhat_ky_he_thong_entity_1.NhatKyHeThong);
            const log = logRepo.create({
                TenBang: tableName,
                MaBanGhi: newVal?.Id || oldVal?.Id || 0,
                HanhDong: action,
                GiaTriCu: oldVal ? JSON.stringify(oldVal) : null,
                GiaTriMoi: newVal ? JSON.stringify(newVal) : null,
                MaNguoiThucHienId: 1,
                NgayThucHien: new Date(),
            });
            await logRepo.save(log);
        }
        catch (err) {
            this.logger.error(`Failed to log audit for ${tableName}: ${err.message}`);
        }
    }
};
exports.AuditSubscriber = AuditSubscriber;
exports.AuditSubscriber = AuditSubscriber = AuditSubscriber_1 = __decorate([
    (0, common_1.Injectable)(),
    (0, typeorm_1.EventSubscriber)(),
    __metadata("design:paramtypes", [typeorm_1.DataSource])
], AuditSubscriber);
//# sourceMappingURL=audit.subscriber.js.map