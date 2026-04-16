import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsString,
  IsDateString,
  IsOptional,
} from 'class-validator';

export class CreateDonNghiPhepDto {
  @ApiProperty({ example: 1, description: 'MaLoaiPhepId' })
  @IsNumber()
  @IsNotEmpty()
  MaLoaiPhepId: number;

  @ApiProperty({ example: '2026-05-10' })
  @IsDateString()
  @IsNotEmpty()
  NgayBatDau: string;

  @ApiProperty({ example: '2026-05-12' })
  @IsDateString()
  @IsNotEmpty()
  NgayKetThuc: string;

  @ApiProperty({ example: 3 })
  @IsNumber()
  @IsNotEmpty()
  TongSoNgay: number;

  @ApiProperty({ example: 'Nghỉ gia đình', required: false })
  @IsString()
  @IsOptional()
  LyDo?: string;
}
