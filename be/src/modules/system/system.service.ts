import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NhatKyHeThong } from './entities/nhat-ky-he-thong.entity';
import { NgayLe } from './entities/ngay-le.entity';
import { CreateNgayLeDto } from './dto/create-ngay-le.dto';

@Injectable()
export class SystemService {
  constructor(
    @InjectRepository(NhatKyHeThong)
    private logRepository: Repository<NhatKyHeThong>,
    @InjectRepository(NgayLe)
    private ngayLeRepository: Repository<NgayLe>,
  ) { }

  async getLogs(limit: number = 100) {
    return this.logRepository.find({
      relations: ['nguoiThucHien'],
      order: { NgayThucHien: 'DESC' },
      take: limit,
    });
  }

  async getHolidays() {
    return this.ngayLeRepository.find();
  }

  async createHoliday(data: CreateNgayLeDto) {
    const hl = this.ngayLeRepository.create(data);
    return this.ngayLeRepository.save(hl);
  }
}
