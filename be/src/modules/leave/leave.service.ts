import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource, Between } from 'typeorm';
import { Cron, CronExpression } from '@nestjs/schedule';
import { DonNghiPhep } from './entities/don-nghi-phep.entity';
import { SoDuPhep } from './entities/so-du-phep.entity';
import { LoaiNghiPhep } from './entities/loai-nghi-phep.entity';
import { NhanVien } from '../auth/entities/nhan-vien.entity';
import {
  CreateLoaiNghiPhepDto,
  UpdateLoaiNghiPhepDto,
} from './dto/loai-nghi-phep.dto';

@Injectable()
export class LeaveService {
  constructor(
    @InjectRepository(DonNghiPhep)
    private donNghiPhepRepository: Repository<DonNghiPhep>,
    @InjectRepository(SoDuPhep)
    private soDuPhepRepository: Repository<SoDuPhep>,
    @InjectRepository(LoaiNghiPhep)
    private loaiNghiPhepRepository: Repository<LoaiNghiPhep>,
    @InjectRepository(NhanVien)
    private nhanVienRepository: Repository<NhanVien>,
    private dataSource: DataSource,
  ) {}

  // Cronjob: Chạy vào mùng 1 đầu năm để cấp phép năm
  @Cron('0 0 1 1 *')
  async grantAnnualLeave() {
    const year = new Date().getFullYear();
    const employees = await this.nhanVienRepository.find({
      where: { TrangThai: 'Active' },
    });
    const leaveTypes = await this.loaiNghiPhepRepository.find();

    for (const employee of employees) {
      for (const lt of leaveTypes) {
        const balance = this.soDuPhepRepository.create({
          MaNhanVienId: employee.Id,
          MaLoaiPhepId: lt.Id,
          Nam: year,
          TongNgayPhep: lt.SoNgayToiDaNam,
          DaSuDung: 0,
        });
        await this.soDuPhepRepository.save(balance);
      }
    }
  }

  async createLeaveRequest(dto: any, userId: number) {
    // 1. Check Balance
    const balance = await this.soDuPhepRepository.findOne({
      where: {
        MaNhanVienId: userId,
        MaLoaiPhepId: dto.MaLoaiPhepId,
        Nam: new Date().getFullYear(),
      },
    });

    // 2. Tạm thời nới lỏng logic: Nếu không có bản ghi SoDuPhep, hoặc số ngày yêu cầu lớn hơn số dư,
    // ta vẫn cho phép tạo đơn (phục vụ test các loại phép như Nghỉ đẻ, Thai sản không có sẵn số dư).
    // Trong thực tế, có thể tùy chỉnh cờ 'CoHuongLuong' hoặc 'LoaiNghiPhep' để quyết định có check hay không.
    /*
    if (!balance || balance.TongNgayPhep - balance.DaSuDung < dto.TongSoNgay) {
      const available = balance ? balance.TongNgayPhep - balance.DaSuDung : 0;
      throw new BadRequestException(`Insufficient leave balance. Requested: ${dto.TongSoNgay}, Available: ${available}`);
    }
    */

    const request = this.donNghiPhepRepository.create({
      ...dto,
      MaNhanVienId: userId,
      TrangThai: 'Pending',
    });

    return this.donNghiPhepRepository.save(request);
  }

  async approveLeave(requestId: number, approverId: number, status: 'Approved' | 'Rejected', reason?: string) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const request = await queryRunner.manager.findOne(DonNghiPhep, {
        where: { Id: requestId },
      });
      if (!request || request.TrangThai !== 'Pending') {
        throw new BadRequestException('Invalid request');
      }

      const ngayBatDau = new Date(request.NgayBatDau);
      if (Number.isNaN(ngayBatDau.getTime())) {
        throw new BadRequestException('NgayBatDau của đơn nghỉ phép không hợp lệ');
      }
      const nam = ngayBatDau.getFullYear();

      // Update balance
      const balance = await queryRunner.manager.findOne(SoDuPhep, {
        where: {
          MaNhanVienId: request.MaNhanVienId,
          MaLoaiPhepId: request.MaLoaiPhepId,
          Nam: nam,
        },
      });

        if (balance) {
          balance.DaSuDung += request.TongSoNgay;
          await queryRunner.manager.save(balance);
        }
      }

      // Update Request
      request.TrangThai = status;
      request.NguoiDuyetId = approverId;
      request.NgayDuyet = new Date();
      if (status === 'Rejected' && reason) {
        request.LyDoTuChoi = reason;
      }
      await queryRunner.manager.save(request);

      await queryRunner.commitTransaction();
      return { message: `Leave request ${status.toLowerCase()}` };
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  // --- Leave Type APIs ---
  async createLeaveType(dto: CreateLoaiNghiPhepDto) {
    const lt = this.loaiNghiPhepRepository.create(dto);
    return this.loaiNghiPhepRepository.save(lt);
  }

  async findAllLeaveTypes() {
    return this.loaiNghiPhepRepository.find();
  }

  async findOneLeaveType(id: number) {
    const lt = await this.loaiNghiPhepRepository.findOne({ where: { Id: id } });
    if (!lt) throw new NotFoundException('Leave type not found');
    return lt;
  }

  async updateLeaveType(id: number, dto: UpdateLoaiNghiPhepDto) {
    const lt = await this.findOneLeaveType(id);
    Object.assign(lt, dto);
    return this.loaiNghiPhepRepository.save(lt);
  }

  async deleteLeaveType(id: number) {
    const lt = await this.findOneLeaveType(id);
    return this.loaiNghiPhepRepository.remove(lt);
  }

  // --- Balance & History ---
  async getBalances(employeeId: number, year: number) {
    return this.soDuPhepRepository.find({
      where: { MaNhanVienId: employeeId, Nam: year },
      relations: ['loaiNghiPhep'],
    });
  }

  async getLeaveHistory(employeeId: number) {
    return this.donNghiPhepRepository.find({
      where: { MaNhanVienId: employeeId },
      relations: ['loaiNghiPhep', 'nguoiDuyet'],
      order: { NgayTao: 'DESC' },
    });
  }

  async getAllLeaveRequests(status?: string) {
    const where: any = {};
    if (status) where.TrangThai = status;
    return this.donNghiPhepRepository.find({
      where,
      relations: ['nhanVien', 'loaiNghiPhep'],
      order: { NgayTao: 'DESC' },
    });
  }
}
