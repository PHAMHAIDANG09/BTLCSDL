import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { NhanVien } from './entities/nhan-vien.entity';
import { LoginDto } from './dto/login.dto';
import { AuditService } from '../../system/audit.service';
import { NotFoundException } from '@nestjs/common';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(NhanVien)
    private nhanVienRepository: Repository<NhanVien>,
    private jwtService: JwtService,
    private auditService: AuditService,
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
      throw new UnauthorizedException('Invalid credentials');
    }

    if (user.TrangThai !== 'Active') {
      throw new UnauthorizedException('User account is not active');
    }

    const isPasswordValid = await bcrypt.compare(password, user.MatKhauHash);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = {
      sub: user.Id,
      email: user.Email,
      role: user.vaiTro?.TenVaiTro,
      maNhanVien: user.MaNhanVien,
    };

    const token = this.jwtService.sign(payload);
    await this.auditService.log({
      tenBang: 'NhanVien',
      maBanGhi: user.Id,
      hanhDong: 'LOGIN',
      giaTriMoi: JSON.stringify({ ip: 'unknown', time: new Date() }),
      nguoiThucHienId: user.Id,
    });
    return {
      access_token: token,
      user: {
        id: user.Id,
        hoTen: user.HoTen,
        email: user.Email,
        maNhanVien: user.MaNhanVien,
        role: user.vaiTro?.TenVaiTro
  }

  async getProfile(userId: number) {
    const user = await this.nhanVienRepository.findOne({
      where: { Id: userId },
      relations: ['phongBan', 'chucVu', 'vaiTro'],
    });
    if (!user) return null;
    const { MatKhauHash, ...result } = user;
    return result;
  }
}
