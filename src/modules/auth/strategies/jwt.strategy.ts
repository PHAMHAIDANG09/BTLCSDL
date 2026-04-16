import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NhanVien } from '../entities/nhan-vien.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    @InjectRepository(NhanVien)
    private nhanVienRepository: Repository<NhanVien>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET')!,
    });
  }

  async validate(payload: any) {
    const { sub: id } = payload;
    const user = await this.nhanVienRepository.findOne({
      where: { Id: id },
      relations: ['vaiTro', 'phongBan', 'chucVu'],
    });

    if (!user || user.TrangThai !== 'Active') {
      throw new UnauthorizedException('User not found or inactive');
    }

    return user;
  }
}
