import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PhieuLuong } from './entities/phieu-luong.entity';
import { LichSuLuong } from './entities/lich-su-luong.entity';
import { ChamCong } from '../attendance/entities/cham-cong.entity';
import { DonLamThem } from '../attendance/entities/don-lam-them.entity';
import { NhanVien } from '../auth/entities/nhan-vien.entity';
import { PayrollService } from './payroll.service';
import { PayrollController } from './payroll.controller';
import { MailModule } from '../mail/mail.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      PhieuLuong,
      LichSuLuong,
      ChamCong,
      DonLamThem,
      NhanVien,
    ]),
    MailModule,
  ],

  controllers: [PayrollController],
  providers: [PayrollService],
  exports: [PayrollService],
})
export class PayrollModule {}
