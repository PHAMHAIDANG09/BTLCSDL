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

  // Nghiệp vụ tính lương (Payroll Calculation)
  async calculatePayroll(thang: number, nam: number, adminId: number) {
    const employees = await this.nhanVienRepository.find({
      where: { TrangThai: 'Active' },
    });
    const results = [];

    for (const emp of employees) {
      const queryRunner = this.dataSource.createQueryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction();

      try {
        // 1. Lấy lương cơ bản hiện tại
        const currentSalary = await this.lichSuLuongRepository.findOne({
          where: { MaNhanVienId: emp.Id, DangHieuLuc: true },
        });
        if (!currentSalary) continue;

        // 2. Tính số ngày công
        const startDate = new Date(nam, thang - 1, 1);
        const endDate = new Date(nam, thang, 0);
        const attendances = await this.chamCongRepository.find({
          where: {
            MaNhanVienId: emp.Id,
            NgayLamViec:
              MoreThanOrEqual(startDate) && (LessThanOrEqual(endDate) as any), // Mocking range check for simplification
          },
        });
        // Filtering manually as TypeORM Date range query needs Between or manual Raw
        const filteredAttendances = attendances.filter(
          (a) => a.NgayLamViec >= startDate && a.NgayLamViec <= endDate,
        );
        const soNgayCongThucTe = filteredAttendances.length;

        // 3. Tính OT
        const ots = await this.donLamThemRepository.find({
          where: { MaNhanVienId: emp.Id, TrangThai: 'Approved' },
        });
        const filteredOts = ots.filter(
          (o) => o.NgayLamThem >= startDate && o.NgayLamThem <= endDate,
        );
        const tongGioOT = filteredOts.reduce(
          (sum, o) => sum + o.TongSoGio * Number(o.HeSoOT),
          0,
        );
        const tienLamThem = (currentSalary.LuongCoBan / 26 / 8) * tongGioOT;

        // 4. Tính Bảo hiểm & Thuế (Simplified VN Standard)
        const luongGop =
          currentSalary.LuongCoBan + currentSalary.PhuCap + tienLamThem;
        const bhxh = currentSalary.LuongCoBan * 0.08;
        const bhyt = currentSalary.LuongCoBan * 0.015;
        const bhtn = currentSalary.LuongCoBan * 0.01;

        // Thuế TNCN (Simplified calculation after Deductions)
        const giamTruGiaCanh = 11000000;
        const giamTruPhuThuoc = emp.SoNguoiPhuThuoc * 4400000;
        const thuNhapTinhThue = Math.max(
          0,
          luongGop - bhxh - bhyt - bhtn - giamTruGiaCanh - giamTruPhuThuoc,
        );
        let thueTNCN = 0;
        if (thuNhapTinhThue > 0) thueTNCN = thuNhapTinhThue * 0.1; // Flat 10% for simplicity

        const luongThucNhan = luongGop - bhxh - bhyt - bhtn - thueTNCN;

        // 5. Lưu phiếu lương
        const phieu = queryRunner.manager.create(PhieuLuong, {
          MaNhanVienId: emp.Id,
          Thang: thang,
          Nam: nam,
          SoNgayCongChuan: 26,
          SoNgayCongThucTe: soNgayCongThucTe,
          LuongCoBan: currentSalary.LuongCoBan,
          PhuCap: currentSalary.PhuCap,
          TienLamThem: tienLamThem,
          BaoHiemXaHoi: bhxh,
          BaoHiemYTe: bhyt,
          BaoHiemThatNghiep: bhtn,
          ThueTNCN: thueTNCN,
          KhauTruDiMuon: 0,
          CacKhoanKhauTruKhac: 0,
          TongLuongGop: luongGop,
          LuongThucNhan: luongThucNhan,
          NguoiTaoId: adminId,
        });

        await queryRunner.manager.save(phieu);
        await queryRunner.commitTransaction();
        results.push(phieu);
      } catch (err) {
        await queryRunner.rollbackTransaction();
      } finally {
        await queryRunner.release();
      }
    }
    return results;
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
