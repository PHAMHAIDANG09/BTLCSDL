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
exports.JwtStrategy = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const passport_jwt_1 = require("passport-jwt");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const nhan_vien_entity_1 = require("../entities/nhan-vien.entity");
const redis_service_1 = require("../../redis/redis.service");
let JwtStrategy = class JwtStrategy extends (0, passport_1.PassportStrategy)(passport_jwt_1.Strategy) {
    configService;
    nhanVienRepository;
    redisService;
    constructor(configService, nhanVienRepository, redisService) {
        super({
            jwtFromRequest: passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.get('JWT_SECRET'),
        });
        this.configService = configService;
        this.nhanVienRepository = nhanVienRepository;
        this.redisService = redisService;
    }
    async validate(payload) {
        const cacheKey = `user:${payload.sub}`;
        const cached = await this.redisService.get(cacheKey);
        if (cached)
            return JSON.parse(cached);
        const user = await this.nhanVienRepository.findOne({
            where: { Id: payload.sub },
            relations: ['vaiTro', 'phongBan', 'chucVu'],
        });
        if (!user || user.TrangThai !== 'Active') {
            throw new common_1.UnauthorizedException('User not found or inactive');
        }
        await this.redisService.set(cacheKey, JSON.stringify(user), 300);
        return user;
    }
};
exports.JwtStrategy = JwtStrategy;
exports.JwtStrategy = JwtStrategy = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, typeorm_1.InjectRepository)(nhan_vien_entity_1.NhanVien)),
    __metadata("design:paramtypes", [config_1.ConfigService,
        typeorm_2.Repository,
        redis_service_1.RedisService])
], JwtStrategy);
//# sourceMappingURL=jwt.strategy.js.map