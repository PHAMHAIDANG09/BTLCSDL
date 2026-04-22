import { Injectable, UnauthorizedException } from '@nestjs/common';
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
      log.MaBanGhi = null;
      log.HanhDong = 'LOGIN_FAILED';
      log.GiaTriMoi = JSON.stringify({
        email,
        ip: '...',
        time: new Date(),
        reason: 'User not found',
      });
      log.MaNguoiThucHienId = null;
      log.NgayThucHien = new Date();
      await this.logRepository.save(log);
      throw new UnauthorizedException('Invalid credentials');
    }

    if (user.TrangThai !== 'Active') {
      const log = new NhatKyHeThong();
      log.TenBang = 'NhanVien';
      log.MaBanGhi = user.Id;
      log.HanhDong = 'LOGIN_FAILED';
      log.GiaTriMoi = JSON.stringify({
        ip: '...',
        time: new Date(),
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
      log.HanhDong = 'LOGIN_FAILED';
      log.GiaTriMoi = JSON.stringify({
        ip: '...',
        time: new Date(),
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
}
