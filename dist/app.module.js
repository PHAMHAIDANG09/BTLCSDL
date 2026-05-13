"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const schedule_1 = require("@nestjs/schedule");
const database_config_1 = __importDefault(require("./config/database.config"));
const redis_config_1 = __importDefault(require("./config/redis.config"));
const control_api_config_1 = __importDefault(require("./config/control-api.config"));
const mail_config_1 = __importDefault(require("./config/mail.config"));
const redis_module_1 = require("./modules/redis/redis.module");
const control_api_module_1 = require("./modules/control-api/control-api.module");
const mail_module_1 = require("./modules/mail/mail.module");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const auth_module_1 = require("./modules/auth/auth.module");
const organization_module_1 = require("./modules/organization/organization.module");
const employee_module_1 = require("./modules/employee/employee.module");
const attendance_module_1 = require("./modules/attendance/attendance.module");
const leave_module_1 = require("./modules/leave/leave.module");
const payroll_module_1 = require("./modules/payroll/payroll.module");
const system_module_1 = require("./modules/system/system.module");
const report_module_1 = require("./modules/report/report.module");
const dashboard_module_1 = require("./modules/dashboard/dashboard.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                load: [database_config_1.default, redis_config_1.default, control_api_config_1.default, mail_config_1.default],
            }),
            schedule_1.ScheduleModule.forRoot(),
            typeorm_1.TypeOrmModule.forRootAsync({
                inject: [config_1.ConfigService],
                useFactory: (config) => config.get('database'),
            }),
            redis_module_1.RedisModule,
            control_api_module_1.ControlApiModule,
            mail_module_1.MailModule,
            auth_module_1.AuthModule,
            organization_module_1.OrganizationModule,
            employee_module_1.EmployeeModule,
            attendance_module_1.AttendanceModule,
            leave_module_1.LeaveModule,
            payroll_module_1.PayrollModule,
            system_module_1.SystemModule,
            report_module_1.ReportModule,
            dashboard_module_1.DashboardModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map