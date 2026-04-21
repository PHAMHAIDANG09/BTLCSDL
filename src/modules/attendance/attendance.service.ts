import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { SystemService } from '../system/system.service';
import { ChamCong } from './entities/cham-cong.entity';
import { DonLamThem } from './entities/don-lam-them.entity';
import { CreateDonLamThemDto } from './dto/don-lam-them.dto';

@Injectable()
export class AttendanceService {
  constructor(
    @InjectRepository(ChamCong)
    private chamCongRepository: Repository<ChamCong>,
    @InjectRepository(DonLamThem)
    private donLamThemRepository: Repository<DonLamThem>,
    private systemService: SystemService,
  ) { }

  async checkInOut(userId: number) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
  
    // Check cuối tuần
    const dayOfWeek = today.getDay();
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      throw new BadRequestException('Không chấm công vào cuối tuần');
    }
  
    // Check ngày lễ
    const todayStr = today.toISOString().split('T')[0];
    const holidays = await this.systemService.getHolidays();
    const isHoliday = holidays.some(h => 
      h.NgayLe.toISOString().split('T')[0] === todayStr
    );
    if (isHoliday) {
      throw new BadRequestException('Hôm nay là ngày lễ, không chấm công');
    }

    let attendance = await this.chamCongRepository.findOne({
      where: { MaNhanVienId: userId, NgayLamViec: today },
    });

    if (!attendance) {
      // Check-in logic
      attendance = this.chamCongRepository.create({
        MaNhanVienId: userId,
        NgayLamViec: today,
        GioVao: new Date(),
        TrangThai: 'CoMat',
      });

      // Calculate late minutes (Assume 8:30 AM start)
      const startTime = new Date(today);
      startTime.setHours(8, 30, 0, 0);
      if (attendance.GioVao > startTime) {
        const diff = attendance.GioVao.getTime() - startTime.getTime();
        attendance.SoPhutDiMuon = Math.floor(diff / 60000);
        attendance.TrangThai = 'DiMuon';
      }
    } else {
      // Check-out logic
      if (attendance.GioRa)
        throw new BadRequestException('Already checked out');

      attendance.GioRa = new Date();
      const diffHours =
        (attendance.GioRa.getTime() - attendance.GioVao.getTime()) / 3600000;
      attendance.SoGioLam = parseFloat(diffHours.toFixed(2));

      // Assume 5:30 PM end
      const endTime = new Date(today);
      endTime.setHours(17, 30, 0, 0);
      if (attendance.GioRa < endTime && attendance.TrangThai !== 'DiMuon') {
        attendance.TrangThai = 'VeSom';
      }
    }

    return this.chamCongRepository.save(attendance);
  }

  async approveOT(
    otId: number,
    approverId: number,
    status: 'Approved' | 'Rejected',
  ) {
    const ot = await this.donLamThemRepository.findOne({ where: { Id: otId } });
    if (!ot) throw new BadRequestException('OT Request not found');

    ot.TrangThai = status;
    ot.NguoiDuyetId = approverId;
    return this.donLamThemRepository.save(ot);
  }

  async createOTRequest(userId: number, dto: CreateDonLamThemDto) {
    const ot = this.donLamThemRepository.create({
      ...dto,
      MaNhanVienId: userId,
      TrangThai: 'Pending',
    });
    return this.donLamThemRepository.save(ot);
  }

  async getHistory(employeeId: number, startDate?: Date, endDate?: Date) {
    const where: any = { MaNhanVienId: employeeId };
    if (startDate && endDate) {
      where.NgayLamViec = Between(startDate, endDate);
    }
    return this.chamCongRepository.find({
      where,
      order: { NgayLamViec: 'DESC' },
    });
  }

  async getAllHistory(startDate: Date, endDate: Date) {
    return this.chamCongRepository.find({
      where: { NgayLamViec: Between(startDate, endDate) },
      relations: ['nhanVien'],
      order: { NgayLamViec: 'DESC' },
    });
  }

  async getAllOTRequests(status?: string) {
    const where: any = {};
    if (status) where.TrangThai = status;

    return this.donLamThemRepository.find({
      where,
      relations: ['nhanVien'],
      order: { NgayTao: 'DESC' },
    });
  }
}
