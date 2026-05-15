import { ApiProperty } from '@nestjs/swagger';
import {
  IsNumber,
  IsNotEmpty,
  IsString,
  IsOptional,
  IsDateString,
} from 'class-validator';

export class TransferEmployeeDto {
  @ApiProperty({ example: 2 })
  @IsNumber()
  @IsNotEmpty()
  PhongBanMoiId: number;

  @ApiProperty({ example: 3 })
  @IsNumber()
  @IsNotEmpty()
  ChucVuMoiId: number;

  @ApiProperty({ example: '2026-05-01' })
  @IsDateString()
  @IsNotEmpty()
  NgayHieuLuc: string;

  @ApiProperty({ example: 'Thăng chức lên trưởng phòng' })
  @IsString()
  @IsNotEmpty()
  LyDo: string;
}
