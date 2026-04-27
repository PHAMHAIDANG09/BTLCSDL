import { Injectable } from '@nestjs/common';
import { ControlApiService } from './modules/control-api/control-api.service';
import { RedisService } from './modules/redis/redis.service';

@Injectable()
export class AppService {
  constructor(
    private readonly redisService: RedisService,
    private readonly controlApiService: ControlApiService,
  ) {}
  getHello(): string {
    return 'Hello World!';
  }

  async getSystemStatus() {
    const [redisPing, controlApi] = await Promise.all([
      this.redisService
        .healthCheck()
        .then((result) => ({ connected: result === 'PONG' }))
        .catch((error: Error) => ({
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
}
