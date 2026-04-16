import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { NhanVien } from '../auth/entities/nhan-vien.entity';
import { ChamCong } from '../attendance/entities/cham-cong.entity';
import { DonNghiPhep } from '../leave/entities/don-nghi-phep.entity';
import { HopDong } from '../employee/entities/hop-dong.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([NhanVien, ChamCong, DonNghiPhep, HopDong]),
  ],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
