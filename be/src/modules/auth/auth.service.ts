import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { NhanVien } from './entities/nhan-vien.entity';
import { LoginDto } from './dto/login.dto';
import { NhatKyHeThong } from '../system/entities/nhat-ky-he-thong.entity';
import { NotFoundException } from '@nestjs/common';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(NhanVien)
    private nhanVienRepository: Repository<NhanVien>,
    @InjectRepository(NhatKyHeThong)
    private logRepository: Repository<NhatKyHeThong>,
    private jwtService: JwtService,
  ) { }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    const user = await this.nhanVienRepository.findOne({
      where: { Email: email },
      relations: ['vaiTro'],
      select: [
        'Id',
        'HoTen',
        'Email',
        'MatKhauHash',
        'TrangThai',
        'MaNhanVien',
      ],
    });

    if (!user) {
      const log = new NhatKyHeThong();
      log.TenBang = 'NhanVien';
      log.MaBanGhi = 0; // Use 0 instead of null to avoid DB constraint error
      log.HanhDong = 'LOGIN';
      log.GiaTriMoi = JSON.stringify({
        email,
        ip: '...',
        time: new Date(),
        status: 'FAILED',
        reason: 'User not found',
      });
      log.MaNguoiThucHienId = 1; // Default to Admin ID since it's NOT NULL in DB
      log.NgayThucHien = new Date();
      await this.logRepository.save(log);
      throw new UnauthorizedException('Invalid credentials');
    }

    if (user.TrangThai !== 'Active') {
      const log = new NhatKyHeThong();
      log.TenBang = 'NhanVien';
      log.MaBanGhi = user.Id;
      log.HanhDong = 'LOGIN';
      log.GiaTriMoi = JSON.stringify({
        ip: '...',
        time: new Date(),
        status: 'FAILED',
        reason: 'Account inactive',
      });
      log.MaNguoiThucHienId = user.Id;
      log.NgayThucHien = new Date();
      await this.logRepository.save(log);
      throw new UnauthorizedException('User account is not active');
    }

    const isPasswordValid = await bcrypt.compare(password, user.MatKhauHash);
    if (!isPasswordValid) {
      const log = new NhatKyHeThong();
      log.TenBang = 'NhanVien';
      log.MaBanGhi = user.Id;
      log.HanhDong = 'LOGIN';
      log.GiaTriMoi = JSON.stringify({
        ip: '...',
        time: new Date(),
        status: 'FAILED',
        reason: 'Invalid password',
      });
      log.MaNguoiThucHienId = user.Id;
      log.NgayThucHien = new Date();
      await this.logRepository.save(log);
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = {
      sub: user.Id,
      email: user.Email,
      role: user.vaiTro?.TenVaiTro,
      maNhanVien: user.MaNhanVien,
    };

    // Log successful login
    const log = new NhatKyHeThong();
    log.TenBang = 'NhanVien';
    log.MaBanGhi = user.Id;
    log.HanhDong = 'LOGIN';
    log.GiaTriMoi = JSON.stringify({
      ip: '...',
      time: new Date(),
    });
    log.MaNguoiThucHienId = user.Id;
    log.NgayThucHien = new Date();
    await this.logRepository.save(log);

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.Id,
        hoTen: user.HoTen,
        email: user.Email,
        maNhanVien: user.MaNhanVien,
        role: user.vaiTro?.TenVaiTro,
      },
    };
  }

  async getProfile(userId: number) {
    const user = await this.nhanVienRepository.findOne({
      where: { Id: userId },
      relations: ['phongBan', 'chucVu', 'vaiTro'],
    });
    if (!user) throw new NotFoundException('Không tìm thấy người dùng');
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { MatKhauHash, ...result } = user;
    return result;
  }

  async changePassword(userId: number, changePasswordDto: any) {
    const { oldPassword, newPassword } = changePasswordDto;
    const user = await this.nhanVienRepository.findOne({
      where: { Id: userId },
      select: ['Id', 'MatKhauHash'],
    });

    const isMatch = await bcrypt.compare(oldPassword, user.MatKhauHash);
    if (!isMatch) {
      throw new BadRequestException('Mật khẩu cũ không chính xác');
    }

    const salt = await bcrypt.genSalt();
    user.MatKhauHash = await bcrypt.hash(newPassword, salt);
    await this.nhanVienRepository.save(user);

    return { message: 'Đổi mật khẩu thành công' };
  }

  async updateProfile(userId: number, updateDto: any) {
    // Chỉ cho phép cập nhật một số trường nhất định
    const allowedFields = [
      'HoTen', 'SoDienThoai', 'GioiTinh', 'NgaySinh', 
      'SoCCCD', 'DiaChi', 'MaSoThue', 'SoNguoiPhuThuoc', 
      'SoTaiKhoan', 'TenNganHang', 'ChiNhanhNganHang'
    ];
    
    const updateData = {};
    Object.keys(updateDto).forEach(key => {
      if (allowedFields.includes(key)) {
        updateData[key] = updateDto[key];
      }
    });

    await this.nhanVienRepository.update(userId, updateData);
    return this.getProfile(userId);
  }

  async refreshToken(userId: number) {
    const user = await this.nhanVienRepository.findOne({
      where: { Id: userId },
      relations: ['vaiTro'],
    });

    if (!user || user.TrangThai !== 'Active') {
      throw new UnauthorizedException('Tài khoản không hợp lệ hoặc đã bị khóa');
    }

    const payload = {
      sub: user.Id,
      email: user.Email,
      role: user.vaiTro?.TenVaiTro,
      maNhanVien: user.MaNhanVien,
    };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
