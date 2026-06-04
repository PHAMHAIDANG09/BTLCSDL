import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HopDong } from './entities/hop-dong.entity';
import { LichSuDieuChuyen } from './entities/lich-su-dieu-chuyen.entity';
import { NhanVien } from '../auth/entities/nhan-vien.entity';
import { EmployeeService } from './employee.service';
import { EmployeeController } from './employee.controller';

@Module({
  imports: [TypeOrmModule.forFeature([HopDong, LichSuDieuChuyen, NhanVien])],
  controllers: [EmployeeController],
  providers: [EmployeeService],
  exports: [EmployeeService],
})
export class EmployeeModule { }
