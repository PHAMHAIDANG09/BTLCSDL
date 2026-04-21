import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class ControlApiService {
  private readonly logger = new Logger(ControlApiService.name);

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  getBaseUrl() {
    return this.configService.get<string>(
      'controlApi.baseUrl',
      'http://localhost:3001',
    );
  }

  async get<T = unknown>(path: string, params?: Record<string, unknown>) {
    const response = await firstValueFrom(
      this.httpService.get<T>(path, { params }),
    );
    return response.data;
  }

  async post<T = unknown>(path: string, data?: unknown) {
    const response = await firstValueFrom(this.httpService.post<T>(path, data));
    return response.data;
  }

  async healthCheck() {
    const baseUrl = this.getBaseUrl();

    try {
      const response = await firstValueFrom(this.httpService.get('/health'));
      return {
        connected: true,
        baseUrl,
        statusCode: response.status,
      };
    } catch (error) {
      this.logger.warn(
        `Control API chưa phản hồi: ${(error as Error).message}`,
      );
      return {
        connected: false,
        baseUrl,
        message: (error as Error).message,
      };
    }
  }
}