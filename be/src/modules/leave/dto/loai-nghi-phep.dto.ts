import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsOptional,
  IsBoolean,
} from 'class-validator';

export class CreateLoaiNghiPhepDto {
  @ApiProperty({ example: 'Nghỉ phép năm' })
  @IsString()
  @IsNotEmpty()
  TenLoaiPhep: string;

  @ApiProperty({ example: true })
  @IsBoolean()
  @IsOptional()
  CoHuongLuong?: boolean;

  @ApiProperty({ example: 12 })
  @IsNumber()
  @IsNotEmpty()
  SoNgayToiDaNam: number;

  @ApiProperty({ example: 'Mô tả...' })
  @IsString()
  @IsOptional()
  MoTa?: string;
}

export class UpdateLoaiNghiPhepDto {
  @IsString()
  @IsOptional()
  TenLoaiPhep?: string;

  @IsBoolean()
  @IsOptional()
  CoHuongLuong?: boolean;

  @IsNumber()
  @IsOptional()
  SoNgayToiDaNam?: number;

  @IsString()
  @IsOptional()
  MoTa?: string;
}
