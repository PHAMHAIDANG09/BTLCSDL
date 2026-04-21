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
exports.AppService = void 0;
const common_1 = require("@nestjs/common");
const control_api_service_1 = require("./modules/control-api/control-api.service");
const redis_service_1 = require("./modules/redis/redis.service");
let AppService = class AppService {
    redisService;
    controlApiService;
    constructor(redisService, controlApiService) {
        this.redisService = redisService;
        this.controlApiService = controlApiService;
    }
    getHello() {
        return 'Hello World!';
    }
    async getSystemStatus() {
        const [redisPing, controlApi] = await Promise.all([
            this.redisService
                .healthCheck()
                .then((result) => ({ connected: result === 'PONG' }))
                .catch((error) => ({
                connected: false,
                message: error.message,
            })),
            this.controlApiService.healthCheck(),
        ]);
        return {
            message: 'NextHR API is running',
            database: {
                type: process.env.DB_TYPE || 'mssql',
                host: process.env.DB_HOST || 'localhost',
                port: Number(process.env.DB_PORT || 1435),
                database: process.env.DB_DATABASE || 'NextHR',
                synchronize: process.env.DB_SYNCHRONIZE === 'true',
            },
            redis: redisPing,
            controlApi,
        };
    }
};
exports.AppService = AppService;
exports.AppService = AppService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [redis_service_1.RedisService,
        control_api_service_1.ControlApiService])
], AppService);
//# sourceMappingURL=app.service.js.map