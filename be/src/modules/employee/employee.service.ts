import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource, Between } from 'typeorm';
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
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      console.log('Đang thực hiện xóa nhân viên (SQL RAW) ID:', id);
      
      // Chạy lệnh SQL trực tiếp
      const result = await queryRunner.manager.query(
        `UPDATE NhanVien SET TrangThai = 'Inactive' WHERE Id = @0`,
        [id]
      );
      
      console.log('Kết quả SQL:', result);
      
      await queryRunner.commitTransaction();
      return { message: 'Xóa thành công' };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.error('Lỗi SQL khi xóa:', error);
      throw new BadRequestException('Không thể xóa nhân viên này. Lỗi hệ thống.');
    } finally {
      await queryRunner.release();
    }
  }

  async createEmployee(dto: CreateNhanVienDto) {
    // 1. Check duplicate Email
    const existingUser = await this.nhanVienRepository.findOne({ where: { Email: dto.Email } });
    if (existingUser) {
      throw new BadRequestException('Email đã tồn tại trong hệ thống');
    }

    // 2. Generate MaNhanVien (Find max ID to be safer)
    const year = new Date().getFullYear();
    const lastEmp = await this.nhanVienRepository.find({
      order: { Id: 'DESC' },
      take: 1,
    });
    const nextId = lastEmp.length > 0 ? lastEmp[0].Id + 1 : 1;
    const maNhanVien = `EMP-${year}-${nextId.toString().padStart(3, '0')}`;

    // 3. Hash password
    const hashedPassword = await bcrypt.hash(dto.MatKhau, 10);

    // 4. Create entity
    const { MatKhau, ...restDto } = dto;
    const nv = this.nhanVienRepository.create({
      ...restDto,
      MaNhanVien: maNhanVien,
      MatKhauHash: hashedPassword,
      TrangThai: 'Active',
    });

    try {
      return await this.nhanVienRepository.save(nv);
    } catch (error) {
      console.error('Lỗi khi lưu nhân viên:', error);
      throw new BadRequestException('Không thể lưu nhân viên. Vui lòng kiểm tra lại dữ liệu.');
    }
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
  async findAllContracts() {
    return this.hopDongRepository.find({
      relations: ['nhanVien'],
      order: { NgayKy: 'DESC' },
    });
  }

  async createContract(dto: CreateHopDongDto) {
    // Tự động sinh mã hợp đồng nếu không có
    if (!dto.MaHopDong) {
      const year = new Date().getFullYear();
      const lastHD = await this.hopDongRepository.find({
        order: { Id: 'DESC' },
        take: 1,
      });
      const nextId = lastHD.length > 0 ? lastHD[0].Id + 1 : 1;
      dto.MaHopDong = `HDLD-${year}-${nextId.toString().padStart(3, '0')}`;
    }
    
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
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
    thirtyDaysFromNow.setHours(0, 0, 0, 0);

    return this.hopDongRepository.find({
      where: {
        NgayKetThuc: Between(today, thirtyDaysFromNow),
        TrangThai: 'Active',
      },
      relations: ['nhanVien'],
    });
  }
}
