import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsOptional,
  IsDateString,
} from 'class-validator';

export class CreateDonLamThemDto {
  @ApiProperty({ example: '2025-04-16' })
  @IsDateString()
  @IsNotEmpty()
  NgayLamThem: string;

  @ApiProperty({ example: '18:00' })
  @IsString()
  @IsNotEmpty()
  GioBatDau: string;

  @ApiProperty({ example: '20:00' })
  @IsString()
  @IsNotEmpty()
  GioKetThuc: string;

  @ApiProperty({ example: 2.0 })
  @IsNumber()
  @IsNotEmpty()
  TongSoGio: number;

  @ApiProperty({ example: 'Lý do làm thêm...' })
  @IsString()
  @IsOptional()
  LyDo?: string;
}
