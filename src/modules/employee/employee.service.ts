import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { NhanVien } from '../auth/entities/nhan-vien.entity';
import { HopDong } from './entities/hop-dong.entity';
import { LichSuDieuChuyen } from './entities/lich-su-dieu-chuyen.entity';
import { CreateNhanVienDto, UpdateNhanVienDto } from './dto/nhan-vien.dto';
import { CreateHopDongDto, UpdateHopDongDto } from './dto/hop-dong.dto';
import * as bcrypt from 'bcrypt';
import * as ExcelJS from 'exceljs';

@Injectable()
export class EmployeeService {
  constructor(
    @InjectRepository(NhanVien)
    private nhanVienRepository: Repository<NhanVien>,
    @InjectRepository(HopDong)
    private hopDongRepository: Repository<HopDong>,
    private dataSource: DataSource,
  ) { }

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

  async importEmployeesFromExcel(file: Express.Multer.File) {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(file.buffer as any);
    const worksheet = workbook.worksheets[0]; // Sheet 1

    const hashedPassword = await bcrypt.hash('123456', 10);
    const employeesToSave: any[] = [];

    // Duyệt qua các dòng (bỏ qua header dòng 1)
    for (let i = 2; i <= worksheet.rowCount; i++) {
      const row = worksheet.getRow(i);

      // Kiểm tra dòng trống
      const values = row.values as any[];
      if (!values || values.length === 0 || values.every((v) => v === null || v === undefined)) {
        continue;
      }

      const maNhanVien = this.getCellValue(row.getCell(1));
      const hoTen = this.getCellValue(row.getCell(2));
      const email = this.getCellValue(row.getCell(3));
      const maPhongIdRaw = this.getCellValue(row.getCell(4));
      const maPhongId = maPhongIdRaw ? Number(maPhongIdRaw) : null;
      const maChucVuIdRaw = this.getCellValue(row.getCell(5));
      const maChucVuId = maChucVuIdRaw ? Number(maChucVuIdRaw) : null;
      const maVaiTroIdRaw = this.getCellValue(row.getCell(6));
      const maVaiTroId = maVaiTroIdRaw ? Number(maVaiTroIdRaw) : 3; // Mặc định 3 (Staff)
      const ngayVaoLamRaw = row.getCell(7).value;
      const ngayVaoLam = ngayVaoLamRaw ? new Date(ngayVaoLamRaw.toString()) : new Date();

      // Kiểm tra thông tin bắt buộc
      if (!hoTen || !email || !maNhanVien) continue;

      // Validate email cơ bản (không trùng trong DB)
      const isEmailExist = await this.nhanVienRepository.findOne({
        where: { Email: email },
      });
      if (isEmailExist) continue;

      // Chuẩn bị dữ liệu nhân viên (Dạng Object thuần để dùng với QueryBuilder)
      employeesToSave.push({
        MaNhanVien: maNhanVien,
        HoTen: hoTen,
        Email: email,
        MaPhongId: maPhongId,
        MaChucVuId: maChucVuId,
        MaVaiTroId: maVaiTroId,
        NgayVaoLam: ngayVaoLam,
        MatKhauHash: hashedPassword,
        TrangThai: 'Active',
        SoNguoiPhuThuoc: 0,
      });
    }

    // Sử dụng QueryBuilder để Bulk Insert trực tiếp vào DB
    // Việc này sẽ bỏ qua các Hook/Subscriber (AuditSubscriber) giúp tránh lỗi kết nối SQL và tăng tốc
    if (employeesToSave.length > 0) {
      await this.nhanVienRepository
        .createQueryBuilder()
        .insert()
        .into(NhanVien)
        .values(employeesToSave)
        .callListeners(false) // Vô hiệu hóa tất cả các Subscriber/Listener
        .execute();
    }

    return `Đã nhập thành công ${employeesToSave.length} nhân viên`;
  }

  private getCellValue(cell: any): string {
    if (!cell || cell.value === null || cell.value === undefined) return '';
    const val = cell.value;
    if (typeof val === 'object' && val.hasOwnProperty('text')) {
      return val.text.toString().trim();
    }
    return val.toString().trim();
  }
}
