// code file attendance.service.ts
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
    try {
      // 1. Kiểm tra ngày lễ
      const holidays = await this.donLamThemRepository.query(
        `SELECT Id FROM dbo.NgayLe 
         WHERE (LapLaiHangNam = 1 
                AND MONTH(NgayLe) = MONTH(CAST(@0 AS DATE)) 
                AND DAY(NgayLe) = DAY(CAST(@0 AS DATE)))
            OR (LapLaiHangNam = 0 
                AND NgayLe = CAST(@0 AS DATE))`,
        [dto.NgayLamThem],
      );

      let calculatedLoaiOT: string;

      if (holidays && holidays.length > 0) {
        calculatedLoaiOT = 'NgayLe';
      } else {
        // 2. Xác định thứ trong tuần: Chủ nhật = 8, Thứ 2 = 2, ..., Thứ 7 = 7
        const parts = dto.NgayLamThem.split('-');
        const year = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10) - 1;
        const day = parseInt(parts[2], 10);

        const dateObj = new Date(year, month, day);
        const jsDay = dateObj.getDay(); // 0 = Chủ nhật, 1 = Thứ 2, ..., 6 = Thứ 7
        const thuTrongTuan = jsDay === 0 ? 8 : jsDay + 1;

        const workSchedule = await this.donLamThemRepository.query(
          `SELECT LaNgayLamViec 
           FROM dbo.CauHinhLichLamViec 
           WHERE ThuTrongTuan = @0`,
          [thuTrongTuan],
        );

        const isWorkingDay =
          workSchedule &&
          workSchedule.length > 0 &&
          (workSchedule[0].LaNgayLamViec === true ||
            workSchedule[0].LaNgayLamViec === 1);

        calculatedLoaiOT = isWorkingDay ? 'NgayThuong' : 'CuoiTuan';
      }

      // 3. Lấy hệ số OT từ bảng CauHinhOT
      const otConfig = await this.donLamThemRepository.query(
        `
  SELECT TOP 1 
    CAST(HeSoOT AS FLOAT) AS heSoOT
  FROM dbo.CauHinhOT
  WHERE LoaiOT = @0
    AND DangHieuLuc = 1
  ORDER BY Id ASC
  `,
        [calculatedLoaiOT],
      );

      if (!otConfig || otConfig.length === 0) {
        throw new BadRequestException(
          `Không tìm thấy cấu hình hệ số OT cho loại: ${calculatedLoaiOT}`,
        );
      }

      const heSoOT = Number(otConfig[0].heSoOT);

      console.log('[OT DEBUG]', {
        ngayLamThem: dto.NgayLamThem,
        calculatedLoaiOT,
        otConfig,
        heSoOT,
      });

      if (Number.isNaN(heSoOT)) {
        throw new BadRequestException(
          `Hệ số OT không hợp lệ cho loại: ${calculatedLoaiOT}`,
        );
      }

      console.log('[OT DEBUG]', {
        ngayLamThem: dto.NgayLamThem,
        calculatedLoaiOT,
        otConfig,
        heSoOT,
      });

      // 4. Tạo đơn OT, không dùng LoaiOT do user gửi lên
      const ot = this.donLamThemRepository.create({
        MaNhanVienId: userId,
        NgayLamThem: new Date(dto.NgayLamThem),
        GioBatDau: dto.GioBatDau,
        GioKetThuc: dto.GioKetThuc,
        TongSoGio: dto.TongSoGio,
        LyDo: dto.LyDo,
        LoaiOT: calculatedLoaiOT,
        HeSoOT: heSoOT,
        TrangThai: 'Pending',
      });

      const savedOT = await this.donLamThemRepository.save(ot);

      const result = await this.donLamThemRepository.query(
        `
  SELECT TOP 1
    Id,
    MaNhanVienId,
    NgayLamThem,
    CONVERT(VARCHAR(5), GioBatDau, 108) AS GioBatDau,
    CONVERT(VARCHAR(5), GioKetThuc, 108) AS GioKetThuc,
    TongSoGio,
    LoaiOT,
    CAST(HeSoOT AS FLOAT) AS HeSoOT,
    LyDo,
    TrangThai,
    NguoiDuyetId,
    NgayTao
  FROM dbo.DonLamThem
  WHERE Id = @0
  `,
        [savedOT.Id],
      );

      return result[0];
    } catch (error) {
      if (error instanceof BadRequestException) throw error;

      throw new BadRequestException(
        `Lỗi khi tạo đơn làm thêm: ${error.message || 'Không xác định'}`,
      );
    }
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
