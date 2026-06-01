import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { And, IsNull, LessThan, LessThanOrEqual, MoreThanOrEqual, Not, Repository } from 'typeorm';
import { NhanVien } from '../auth/entities/nhan-vien.entity';
import { ChamCong } from '../attendance/entities/cham-cong.entity';
import { DonNghiPhep } from '../leave/entities/don-nghi-phep.entity';
import { HopDong } from '../employee/entities/hop-dong.entity';

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(NhanVien)
    private nhanVienRepo: Repository<NhanVien>,
    @InjectRepository(ChamCong)
    private chamCongRepo: Repository<ChamCong>,
    @InjectRepository(DonNghiPhep)
    private nghiPhepRepo: Repository<DonNghiPhep>,
    @InjectRepository(HopDong)
    private hopDongRepo: Repository<HopDong>,
  ) {}

  async getStats() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const startOfTomorrow = new Date(today);
    startOfTomorrow.setDate(startOfTomorrow.getDate() + 1);
    const thirtyDaysFromNow = new Date(today);
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

    const [totalEmployees, presentToday, pendingLeaves, expiringContracts] = await Promise.all([
      this.nhanVienRepo.count({ where: { TrangThai: 'Active' } }),
      this.chamCongRepo.count({
        where: {
          NgayLamViec: And(MoreThanOrEqual(today), LessThan(startOfTomorrow)),
        },
      }),
      this.nghiPhepRepo.count({ where: { TrangThai: 'Pending' } }),
      this.hopDongRepo.count({
        where: {
          TrangThai: 'Active',
          NgayKetThuc: And(
            Not(IsNull()),
            MoreThanOrEqual(today),
            LessThanOrEqual(thirtyDaysFromNow),
          ),
        },
      }),
    ]);

    return {
      totalEmployees,
      presentToday,
      pendingLeaves,
      expiringContracts,
    };
  }
}
