import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReportService } from './report.service';
import { ReportController } from './report.controller';
import { ChamCong } from '../attendance/entities/cham-cong.entity';
import { PhieuLuong } from '../payroll/entities/phieu-luong.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ChamCong, PhieuLuong])],
  controllers: [ReportController],
  providers: [ReportService],
})
export class ReportModule {}
