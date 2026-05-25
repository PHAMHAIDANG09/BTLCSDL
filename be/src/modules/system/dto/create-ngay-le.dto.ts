import { PartialType } from '@nestjs/swagger';
import { NgayLe } from '../entities/ngay-le.entity';

export class CreateNgayLeDto extends PartialType(NgayLe) {}
