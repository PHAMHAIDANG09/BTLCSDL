import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NhatKyHeThong } from './entities/nhat-ky-he-thong.entity';

@Injectable()
export class AuditService {
  constructor(
    @InjectRepository(NhatKyHeThong)
    private logRepo: Repository<NhatKyHeThong>,
  ) {}
  
  async log(data: {
    tenBang: string;
    maBanGhi: number;
    hanhDong: 'INSERT' | 'UPDATE' | 'DELETE' | 'APPROVE' | 'LOGIN' | 'EXPORT';
    giaTriCu?: object;
    giaTriMoi?: object;
    nguoiThucHienId: number;
  }) {
    const log = new NhatKyHeThong();
    log.TenBang = data.tenBang;
    log.MaBanGhi = data.maBanGhi;
    log.HanhDong = data.hanhDong;
    log.GiaTriCu = data.giaTriCu ? JSON.stringify(data.giaTriCu) : null;
    log.GiaTriMoi = data.giaTriMoi ? JSON.stringify(data.giaTriMoi) : null;
    log.MaNguoiThucHienId = data.nguoiThucHienId;
    log.NgayThucHien = new Date();
    await this.logRepo.save(log);
  }
}