import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsEmail,
  IsOptional,
  IsNumber,
  IsDateString,
  MinLength,
} from 'class-validator';

export class CreateNhanVienDto {
  @ApiProperty({ example: 'Nguyễn Văn A' })
  @IsString()
  @IsNotEmpty()
  HoTen: string;

  @ApiProperty({ example: 'nv_a@nexthr.com' })
  @IsEmail()
  Email: string;

  @ApiProperty({ example: 'Admin123!', description: 'Initial password' })
  @IsString()
  @MinLength(6)
  MatKhau: string;

  @ApiProperty({ example: 1, description: 'MaPhongId' })
  @IsNumber()
  MaPhongId: number;

  @ApiProperty({ example: 1, description: 'MaChucVuId' })
  @IsNumber()
  MaChucVuId: number;

  @ApiProperty({ example: 3, description: 'MaVaiTroId (Staff)' })
  @IsNumber()
  MaVaiTroId: number;

  @ApiProperty({ example: '2025-01-01' })
  @IsDateString()
  NgayVaoLam: string;
}

export class UpdateNhanVienDto {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  HoTen?: string;

  @ApiProperty({ required: false })
  @IsEmail()
  @IsOptional()
  Email?: string;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  MaPhongId?: number;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  MaChucVuId?: number;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  MaVaiTroId?: number;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  SoDienThoai?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  DiaChi?: string;
}
