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
exports.VaiTro = void 0;
const typeorm_1 = require("typeorm");
const nhan_vien_entity_1 = require("./nhan-vien.entity");
let VaiTro = class VaiTro {
    Id;
    TenVaiTro;
    MoTa;
    nhanViens;
};
exports.VaiTro = VaiTro;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], VaiTro.prototype, "Id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'nvarchar', length: 50, unique: true }),
    __metadata("design:type", String)
], VaiTro.prototype, "TenVaiTro", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'nvarchar', length: 255, nullable: true }),
    __metadata("design:type", String)
], VaiTro.prototype, "MoTa", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => nhan_vien_entity_1.NhanVien, (nv) => nv.vaiTro),
    __metadata("design:type", Array)
], VaiTro.prototype, "nhanViens", void 0);
exports.VaiTro = VaiTro = __decorate([
    (0, typeorm_1.Entity)('VaiTro')
], VaiTro);
//# sourceMappingURL=vai-tro.entity.js.map