import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NhanVien } from '../entities/nhan-vien.entity';
import { RedisService } from '../../redis/redis.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    @InjectRepository(NhanVien)
    private nhanVienRepository: Repository<NhanVien>,
    private redisService: RedisService, // ✅ thêm
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET')!,
    });
  }

  async validate(payload: any) {
    const cacheKey = `user:${payload.sub}`;
    
    // Check cache trước
    const cached = await this.redisService.get(cacheKey);
    if (cached) return JSON.parse(cached);
    
    const user = await this.nhanVienRepository.findOne({
      where: { Id: payload.sub },
      relations: ['vaiTro', 'phongBan', 'chucVu'],
    });
    
    if (!user || user.TrangThai !== 'Active') {
      throw new UnauthorizedException('User not found or inactive');
    }
    
    // Cache 5 phút
    await this.redisService.set(cacheKey, JSON.stringify(user), 300);
    return user;
  }
}
