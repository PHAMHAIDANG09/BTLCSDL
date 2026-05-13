import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
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
  ) { }

  async checkInOut(userId: number) {
    try {
      const now = new Date();
      // Lấy ngày hiện tại theo giờ địa phương (YYYY-MM-DD)
      const dateStr = now.toLocaleDateString('sv-SE');
      console.log(`[ATTENDANCE DEBUG] UserId: ${userId}, Date: ${dateStr}`);
      
      // Tìm bản ghi hôm nay - Dùng CAST để đảm bảo so sánh chính xác trên SQL Server
      let attendance = await this.chamCongRepository.createQueryBuilder('cc')
        .where('cc.MaNhanVienId = :userId', { userId })
        .andWhere('CAST(cc.NgayLamViec AS DATE) = :date', { date: dateStr })
        .getOne();

      console.log(`[ATTENDANCE DEBUG] Found Record:`, attendance ? 'Yes, ID: ' + attendance.Id : 'No');

      if (!attendance) {
        console.log('[ATTENDANCE DEBUG] Action: Create New');
        attendance = this.chamCongRepository.create({
          MaNhanVienId: userId,
          NgayLamViec: now, // SQL Server sẽ tự lấy phần ngày
          GioVao: now,
          TrangThai: 'CoMat',
          NguonChamCong: 'Manual',
          SoPhutDiMuon: 0
        });

        // Tính phút đi muộn (Giả định 8:30 AM là mốc)
        const startTime = new Date();
        startTime.setHours(8, 30, 0, 0);
        
        if (now > startTime) {
          const diff = now.getTime() - startTime.getTime();
          attendance.SoPhutDiMuon = Math.floor(diff / 60000);
          attendance.TrangThai = 'DiMuon';
        }
      } else {
        console.log('[ATTENDANCE DEBUG] Action: Update Check-out');
        if (attendance.GioRa) {
          throw new BadRequestException('Bạn đã điểm danh ra cho ngày hôm nay rồi!');
        }

        attendance.GioRa = now;
        const start = new Date(attendance.GioVao);
        const diffHours = (now.getTime() - start.getTime()) / 3600000;
        attendance.SoGioLam = parseFloat(diffHours.toFixed(2));

        const endTime = new Date();
        endTime.setHours(17, 30, 0, 0);
        if (now < endTime && attendance.TrangThai !== 'DiMuon') {
          attendance.TrangThai = 'VeSom';
        }
      }

      const saved = await this.chamCongRepository.save(attendance);
      console.log('[ATTENDANCE DEBUG] Save Success:', saved.Id);
      return saved;
    } catch (error) {
      console.error('[ATTENDANCE FATAL ERROR]', error);
      if (error instanceof BadRequestException) throw error;
      throw new BadRequestException(`Lỗi: ${error.message || 'Không xác định'}`);
    }
  }

  async getTodayAttendance(userId: number) {
    const dateStr = new Date().toLocaleDateString('sv-SE');
    return this.chamCongRepository.createQueryBuilder('cc')
      .where('cc.MaNhanVienId = :userId', { userId })
      .andWhere('CAST(cc.NgayLamViec AS DATE) = :date', { date: dateStr })
      .getOne();
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
    return this.chamCongRepository.createQueryBuilder('cc')
      .leftJoinAndSelect('cc.nhanVien', 'nv')
      .leftJoinAndSelect('nv.phongBan', 'pb')
      .where('cc.NgayLamViec BETWEEN :start AND :end', { start: startDate, end: endDate })
      .orderBy('cc.NgayLamViec', 'DESC')
      .getMany();
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

  async deleteAttendance(id: number) {
    const record = await this.chamCongRepository.findOne({ where: { Id: id } });
    if (!record) throw new NotFoundException('Bản ghi chấm công không tồn tại');
    return this.chamCongRepository.remove(record);
  }

  async updateAttendance(id: number, data: any) {
    const record = await this.chamCongRepository.findOne({ where: { Id: id } });
    if (!record) throw new NotFoundException('Bản ghi chấm công không tồn tại');

    // Update fields
    if (data.GioVao) record.GioVao = new Date(data.GioVao);
    if (data.GioRa) record.GioRa = new Date(data.GioRa);
    if (data.TrangThai) record.TrangThai = data.TrangThai;

    // Recalculate hours
    if (record.GioVao && record.GioRa) {
      const diffHours = (record.GioRa.getTime() - record.GioVao.getTime()) / 3600000;
      record.SoGioLam = parseFloat(diffHours.toFixed(2));
    }

    // Recalculate late minutes
    if (record.GioVao) {
      const startTime = new Date(record.NgayLamViec);
      startTime.setHours(8, 30, 0, 0);
      if (record.GioVao > startTime) {
        const diff = record.GioVao.getTime() - startTime.getTime();
        record.SoPhutDiMuon = Math.floor(diff / 60000);
      } else {
        record.SoPhutDiMuon = 0;
      }
    }

    return this.chamCongRepository.save(record);
  }

  async getMonthlySummary(month: number, year: number) {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

    const records = await this.chamCongRepository.find({
      where: { NgayLamViec: Between(startDate, endDate) },
      relations: ['nhanVien', 'nhanVien.phongBan'],
    });

    const summaryMap = new Map();

    records.forEach(record => {
      const empId = record.MaNhanVienId;
      if (!summaryMap.has(empId)) {
        summaryMap.set(empId, {
          employeeId: empId,
          employeeName: record.nhanVien?.HoTen || 'N/A',
          employeeCode: record.nhanVien?.MaNhanVien || 'N/A',
          department: record.nhanVien?.phongBan?.TenPhong || 'N/A',
          totalWorkHours: 0,
          totalLateMinutes: 0,
          lateDays: 0,
          earlyLeaveDays: 0,
          totalDays: 0
        });
      }

      const stats = summaryMap.get(empId);
      stats.totalWorkHours += record.SoGioLam || 0;
      stats.totalLateMinutes += record.SoPhutDiMuon || 0;
      if (record.TrangThai === 'DiMuon') stats.lateDays += 1;
      if (record.TrangThai === 'VeSom') stats.earlyLeaveDays += 1;
      stats.totalDays += 1;
    });

    return Array.from(summaryMap.values());
  }
}
