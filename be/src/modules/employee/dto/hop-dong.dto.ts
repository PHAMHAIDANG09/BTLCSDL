import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumber, IsOptional, IsDateString } from 'class-validator';

export class CreateHopDongDto {
  @ApiProperty({ example: 1 })
  @IsNumber()
  @IsNotEmpty()
  MaNhanVienId: number;

  @ApiProperty({ example: 'HĐLĐ-2025-001' })
  @IsString()
  @IsNotEmpty()
  MaHopDong: string;

  @ApiProperty({ example: 'Chính thức' })
  @IsString()
  @IsNotEmpty()
  LoaiHopDong: string;

  @ApiProperty({ example: '2025-01-01' })
  @IsDateString()
  @IsNotEmpty()
  NgayKy: string;

  @ApiProperty({ example: '2025-01-01' })
  @IsDateString()
  @IsNotEmpty()
  NgayBatDau: string;

  @ApiProperty({ example: '2026-01-01', required: false })
  @IsDateString()
  @IsOptional()
  NgayKetThuc?: string;

  @ApiProperty({ example: 15000000 })
  @IsNumber()
  @IsOptional()
  LuongCoBan?: number;

  @ApiProperty({ example: 'Active' })
  @IsString()
  @IsOptional()
  TrangThai?: string;
}

export class UpdateHopDongDto {
  @IsString()
  @IsOptional()
  MaHopDong?: string;

  @IsString()
  @IsOptional()
  LoaiHopDong?: string;

  @IsDateString()
  @IsOptional()
  NgayKy?: string;

  @IsDateString()
  @IsOptional()
  NgayBatDau?: string;

  @IsDateString()
  @IsOptional()
  NgayKetThuc?: string;

  @IsNumber()
  @IsOptional()
  LuongCoBan?: number;

  @IsString()
  @IsOptional()
  TrangThai?: string;
}
