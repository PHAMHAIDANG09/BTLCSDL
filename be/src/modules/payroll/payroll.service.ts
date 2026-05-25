import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Repository,
  DataSource,
} from 'typeorm';
import { Cron } from '@nestjs/schedule';
import { PhieuLuong } from './entities/phieu-luong.entity';
import { LichSuLuong } from './entities/lich-su-luong.entity';
import { ChamCong } from '../attendance/entities/cham-cong.entity';
import { DonLamThem } from '../attendance/entities/don-lam-them.entity';
import { NhanVien } from '../auth/entities/nhan-vien.entity';

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
  ) {}

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

  // Nghiệp vụ tính lương (Payroll Calculation)
  async calculatePayroll(thang: number, nam: number, adminId: number) {
    try {
      // Gọi Stored Procedure để tính lương tự động
      // Sử dụng truyền tham số an toàn (@0, @1, @2) để tránh SQL Injection
      await this.dataSource.query(
        'EXEC dbo.sp_CalculatePayroll @Month = @0, @Year = @1, @NguoiTaoId = @2',
        [thang, nam, adminId],
      );

      // Truy vấn lại kết quả vừa tính để trả về cho Client
      return this.phieuLuongRepository.find({
        where: { Thang: thang, Nam: nam },
        relations: ['nhanVien'], // Entity hỗ trợ relation NhanVien
        order: { Nam: 'DESC', Thang: 'DESC' },
      });
    } catch (error) {
      // Bắt lỗi từ SQL Server (ví dụ: thiếu cấu hình, lỗi logic trong Proc)
      throw new BadRequestException(
        `Lỗi khi tính lương: ${error.message || 'Vui lòng kiểm tra lại cấu hình hệ thống'}`,
      );
    }
  }

  @Cron('59 23 28-31 * *') // Run at end of month days 28-31
  async autoPayrollCron() {
    const today = new Date();
    const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);

    if (today.getDate() === lastDay.getDate()) {
      // It's the last day of the month
      await this.calculatePayroll(today.getMonth() + 1, today.getFullYear(), 1); // System Admin ID = 1
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
