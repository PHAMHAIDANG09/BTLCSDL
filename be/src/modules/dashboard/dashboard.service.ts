import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThanOrEqual, LessThanOrEqual } from 'typeorm';
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

    const [totalEmployees, presentToday, pendingLeaves, expiringContracts] =
      await Promise.all([
        this.nhanVienRepo.count({ where: { TrangThai: 'Active' } }),
        this.chamCongRepo.count({ where: { NgayLamViec: today } }),
        this.nghiPhepRepo.count({ where: { TrangThai: 'Pending' } }),
        this.hopDongRepo.count({
          where: {
            TrangThai: 'Active',
            NgayKetThuc: LessThanOrEqual(
              new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
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
