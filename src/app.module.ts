import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import databaseConfig from './config/database.config';
import redisConfig from './config/redis.config';
import controlApiConfig from './config/control-api.config';
import mailConfig from './config/mail.config';
import { RedisModule } from './modules/redis/redis.module';
import { ControlApiModule } from './modules/control-api/control-api.module';
import { MailModule } from './modules/mail/mail.module';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { OrganizationModule } from './modules/organization/organization.module';
import { EmployeeModule } from './modules/employee/employee.module';
import { AttendanceModule } from './modules/attendance/attendance.module';
import { LeaveModule } from './modules/leave/leave.module';
import { PayrollModule } from './modules/payroll/payroll.module';
import { SystemModule } from './modules/system/system.module';
import { ReportModule } from './modules/report/report.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig, redisConfig, controlApiConfig, mailConfig],
    }),

    ScheduleModule.forRoot(),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) =>
        config.get<TypeOrmModuleOptions>('database')!,
    }),
    RedisModule,
    ControlApiModule,
    MailModule,

    AuthModule,
    OrganizationModule,
    EmployeeModule,
    AttendanceModule,
    LeaveModule,
    PayrollModule,
    SystemModule,
    ReportModule,
    DashboardModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
