import { ControlApiService } from './modules/control-api/control-api.service';
import { RedisService } from './modules/redis/redis.service';
export declare class AppService {
    private readonly redisService;
    private readonly controlApiService;
    constructor(redisService: RedisService, controlApiService: ControlApiService);
    getHello(): string;
    getSystemStatus(): Promise<{
        message: string;
        database: {
            type: string;
            host: string;
            port: number;
            database: string;
            synchronize: boolean;
        };
        redis: {
            connected: boolean;
        } | {
            connected: boolean;
            message: string;
        };
        controlApi: {
            connected: boolean;
            baseUrl: string;
            statusCode: number;
            message?: undefined;
        } | {
            connected: boolean;
            baseUrl: string;
            message: string;
            statusCode?: undefined;
        };
    }>;
}
