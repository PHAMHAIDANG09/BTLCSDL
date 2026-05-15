import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoaiNghiPhep } from './entities/loai-nghi-phep.entity';
import { SoDuPhep } from './entities/so-du-phep.entity';
import { DonNghiPhep } from './entities/don-nghi-phep.entity';
import { NhanVien } from '../auth/entities/nhan-vien.entity';
import { LeaveService } from './leave.service';
import { LeaveController } from './leave.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([LoaiNghiPhep, SoDuPhep, DonNghiPhep, NhanVien]),
  ],
  controllers: [LeaveController],
  providers: [LeaveService],
  exports: [LeaveService],
})
export class LeaveModule {}
