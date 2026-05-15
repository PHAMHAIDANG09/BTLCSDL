import { Global, Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ControlApiService } from './control-api.service';

@Global()
@Module({
  imports: [
    HttpModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        baseURL: configService.get<string>(
          'controlApi.baseUrl',
          'http://localhost:3001',
        ),
        timeout: configService.get<number>('controlApi.timeout', 5000),
      }),
    }),
  ],
  providers: [ControlApiService],
  exports: [ControlApiService],
})
export class ControlApiModule {}
