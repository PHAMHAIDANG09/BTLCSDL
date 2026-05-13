import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Repository,
  DataSource,
  LessThanOrEqual,
  MoreThanOrEqual,
} from 'typeorm';
import { Cron } from '@nestjs/schedule';
import { PhieuLuong } from './entities/phieu-luong.entity';
import { LichSuLuong } from './entities/lich-su-luong.entity';
import { ChamCong } from '../attendance/entities/cham-cong.entity';
import { DonLamThem } from '../attendance/entities/don-lam-them.entity';
import { NhanVien } from '../auth/entities/nhan-vien.entity';
import { MailService } from '../mail/mail.service';

@Injectable()
export class PayrollService {
  constructor(
    @InjectRepository(PhieuLuong)
    private phieuLuongRepository: Repository<PhieuLuong>,
    @InjectRepository(LichSuLuong)
    private lichSuLuongRepository: Repository<LichSuLuong>,
    @InjectRepository(ChamCong)
    private chamCongRepository: Repository<ChamCong>,
    @InjectRepository(DonLamThem)
    private donLamThemRepository: Repository<DonLamThem>,
    @InjectRepository(NhanVien)
    private nhanVienRepository: Repository<NhanVien>,
    private dataSource: DataSource,
    private mailService: MailService,
  ) { }

  // Nghiệp vụ SCD Type 2 cho Lịch sử lương
  async updateSalary(
    idNhanVien: number,
    data: {
      LuongCoBan: number;
      PhuCap: number;
      NguoiThayDoiId: number;
      GhiChu?: string;
    },
  ) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 1. Set records cũ về Hết hiệu lực
      await queryRunner.manager.update(
        LichSuLuong,
        { MaNhanVienId: idNhanVien, DangHieuLuc: true },
        { DangHieuLuc: false, NgayKetThuc: new Date() },
      );

      // 2. Chèn bản ghi mới
      const newSalary = queryRunner.manager.create(LichSuLuong, {
        MaNhanVienId: idNhanVien,
        LuongCoBan: data.LuongCoBan,
        PhuCap: data.PhuCap,
        NgayBatDau: new Date(),
        DangHieuLuc: true,
        NguoiThayDoiId: data.NguoiThayDoiId,
        GhiChu: data.GhiChu,
      });
      await queryRunner.manager.save(newSalary);

      await queryRunner.commitTransaction();
      return newSalary;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  // Nghiệp vụ tính lương (Payroll Calculation) - Cải tiến dùng Stored Procedure & Mail
  async calculatePayroll(thang: number, nam: number) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();

    try {
      // 1. Thực thi Stored Procedure tính lương (đã tối ưu bằng CROSS APPLY)
      await queryRunner.query('EXEC dbo.sp_CalculatePayroll @0, @1', [
        thang,
        nam,
      ]);

      // 2. Truy vấn dữ liệu phiếu lương JOIN với nhân viên bằng SQL thuần
      const payslips = await this.dataSource.query(`
        SELECT 
          p.Thang, p.Nam, p.LuongCoBan, p.PhuCap, p.LuongThucNhan,
          nv.Email, nv.HoTen
        FROM dbo.PhieuLuong p
        JOIN dbo.NhanVien nv ON p.MaNhanVienId = nv.Id
        WHERE p.Thang = @0 AND p.Nam = @1
      `, [thang, nam]);

      console.log(`--- Bắt đầu gửi mail thông báo lương cho ${payslips.length} nhân viên ---`);

      // 3. Sử dụng vòng lặp for...of để gửi mail tuần tự và theo dõi quá trình
      let count = 0;
      for (const ps of payslips) {
        count++;
        console.log(`[${count}/${payslips.length}] Đang gửi mail tới: ${ps.Email}...`);

        await this.mailService.sendPayrollEmail({
          email: ps.Email,
          name: ps.HoTen,
          month: ps.Thang,
          year: ps.Nam,
          basicSalary: ps.LuongCoBan,
          allowance: ps.PhuCap,
          netSalary: ps.LuongThucNhan,
        });
      }

      console.log(`--- Hoàn thành gửi mail. Tổng số: ${count} ---`);


      return {
        success: true,
        message: `Đã tính lương và gửi thông báo cho ${payslips.length} nhân viên.`,
        processedCount: payslips.length,
      };
    } catch (error) {
      console.error('Lỗi khi tính lương:', error.message);
      throw new BadRequestException('Không thể hoàn thành tính lương.');
    } finally {
      await queryRunner.release();
    }
  }

  @Cron('59 23 28-31 * *') // Run at end of month days 28-31
  async autoPayrollCron() {
    const today = new Date();
    const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);

    if (today.getDate() === lastDay.getDate()) {
      // It's the last day of the month
      await this.calculatePayroll(today.getMonth() + 1, today.getFullYear()); // System Admin ID logic now handled by DB or default
    }
  }

  // --- PaySlip & Salary History APIs ---
  async getMyPaySlips(employeeId: number) {
    return this.phieuLuongRepository.find({
      where: { MaNhanVienId: employeeId },
      order: { Nam: 'DESC', Thang: 'DESC' },
    });
  }

  async getSalaryHistory(employeeId: number) {
    return this.lichSuLuongRepository.find({
      where: { MaNhanVienId: employeeId },
      relations: ['nguoiThayDoi'],
      order: { NgayBatDau: 'DESC' },
    });
  }

  async getAllPaySlips(thang?: number, nam?: number) {
    const where: any = {};
    if (thang) where.Thang = thang;
    if (nam) where.Nam = nam;
    return this.phieuLuongRepository.find({
      where,
      relations: ['nhanVien'],
      order: { Nam: 'DESC', Thang: 'DESC' },
    });
  }
}
