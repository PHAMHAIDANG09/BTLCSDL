import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NgayLe } from './entities/ngay-le.entity';
import { NhatKyHeThong } from './entities/nhat-ky-he-thong.entity';

import { SystemService } from './system.service';
import { SystemController } from './system.controller';

@Module({
  imports: [TypeOrmModule.forFeature([NgayLe, NhatKyHeThong])],
  controllers: [SystemController],
  providers: [SystemService],
  exports: [TypeOrmModule, SystemService],
})
export class SystemModule {}
