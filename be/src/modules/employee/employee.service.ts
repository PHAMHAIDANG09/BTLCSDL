import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { NhanVien } from '../auth/entities/nhan-vien.entity';
import { HopDong } from './entities/hop-dong.entity';
import { LichSuDieuChuyen } from './entities/lich-su-dieu-chuyen.entity';
import { CreateNhanVienDto, UpdateNhanVienDto } from './dto/nhan-vien.dto';
import { CreateHopDongDto, UpdateHopDongDto } from './dto/hop-dong.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class EmployeeService {
  constructor(
    @InjectRepository(NhanVien)
    private nhanVienRepository: Repository<NhanVien>,
    @InjectRepository(HopDong)
    private hopDongRepository: Repository<HopDong>,
    private dataSource: DataSource,
  ) {}

  async findAll() {
    return this.nhanVienRepository.find({
      relations: ['phongBan', 'chucVu', 'vaiTro'],
    });
  }

  async findOne(id: number) {
    const nv = await this.nhanVienRepository.findOne({
      where: { Id: id },
      relations: ['phongBan', 'chucVu', 'vaiTro'],
    });
    if (!nv) throw new BadRequestException('Employee not found');
    return nv;
  }

  async updateEmployee(id: number, dto: UpdateNhanVienDto) {
    const nv = await this.findOne(id);
    Object.assign(nv, dto);
    return this.nhanVienRepository.save(nv);
  }

  async deleteEmployee(id: number) {
    const nv = await this.findOne(id);
    nv.TrangThai = 'Inactive'; // Soft delete
    return this.nhanVienRepository.save(nv);
  }

  async createEmployee(dto: CreateNhanVienDto) {
    // 1. Generate MaNhanVien
    const year = new Date().getFullYear();
    const count = await this.nhanVienRepository.count();
    const maNhanVien = `EMP-${year}-${(count + 1).toString().padStart(3, '0')}`;

    // 2. Hash password
    const hashedPassword = await bcrypt.hash(dto.MatKhau, 10);

    // 3. Create entity
    const nv = this.nhanVienRepository.create({
      ...dto,
      MaNhanVien: maNhanVien,
      MatKhauHash: hashedPassword,
    });

    return this.nhanVienRepository.save(nv);
  }

  // API thuyên chuyển công tác (Transaction)
  async transferEmployee(
    id: number,
    data: {
      PhongBanMoiId: number;
      ChucVuMoiId: number;
      LyDo: string;
      NgayHieuLuc: Date;
      NguoiDuyetId: number;
    },
  ) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const nv = await queryRunner.manager.findOne(NhanVien, { where: { Id: id } });
      if (!nv) throw new BadRequestException('Employee not found');

      // Save History
      const history = queryRunner.manager.create(LichSuDieuChuyen, {
        MaNhanVienId: id,
        PhongBanCuId: nv.MaPhongId,
        PhongBanMoiId: data.PhongBanMoiId,
        ChucVuCuId: nv.MaChucVuId,
        ChucVuMoiId: data.ChucVuMoiId,
        NgayHieuLuc: data.NgayHieuLuc,
        LyDo: data.LyDo,
        NguoiDuyetId: data.NguoiDuyetId,
      });
      await queryRunner.manager.save(history);

      // Update Employee
      nv.MaPhongId = data.PhongBanMoiId;
      nv.MaChucVuId = data.ChucVuMoiId;
      await queryRunner.manager.save(nv);

      await queryRunner.commitTransaction();
      return { message: 'Transfer successful' };
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  // --- Hop Dong APIs ---
  async createContract(dto: CreateHopDongDto) {
    const hd = this.hopDongRepository.create(dto);
    return this.hopDongRepository.save(hd);
  }

  async findContractsByEmployee(employeeId: number) {
    return this.hopDongRepository.find({
      where: { MaNhanVienId: employeeId },
      order: { NgayKy: 'DESC' },
    });
  }

  async findOneContract(id: number) {
    const hd = await this.hopDongRepository.findOne({
      where: { Id: id },
      relations: ['nhanVien'],
    });
    if (!hd) throw new NotFoundException('Contract not found');
    return hd;
  }

  async updateContract(id: number, dto: UpdateHopDongDto) {
    const hd = await this.findOneContract(id);
    Object.assign(hd, dto);
    return this.hopDongRepository.save(hd);
  }

  async deleteContract(id: number) {
    const hd = await this.findOneContract(id);
    return this.hopDongRepository.remove(hd);
  }

  async getExpiringContracts() {
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

    return this.hopDongRepository.find({
      where: {
        NgayKetThuc: thirtyDaysFromNow, // simplified logic, usually between now and 30 days
        TrangThai: 'Active',
      },
      relations: ['nhanVien'],
    });
  }
}
