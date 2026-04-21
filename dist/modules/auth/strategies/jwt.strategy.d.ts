import { Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { Repository } from 'typeorm';
import { NhanVien } from '../entities/nhan-vien.entity';
import { RedisService } from '../../redis/redis.service';
declare const JwtStrategy_base: new (...args: [opt: import("passport-jwt").StrategyOptionsWithRequest] | [opt: import("passport-jwt").StrategyOptionsWithoutRequest]) => Strategy & {
    validate(...args: any[]): unknown;
};
export declare class JwtStrategy extends JwtStrategy_base {
    private configService;
    private nhanVienRepository;
    private redisService;
    constructor(configService: ConfigService, nhanVienRepository: Repository<NhanVien>, redisService: RedisService);
    validate(payload: any): Promise<any>;
}
export {};
