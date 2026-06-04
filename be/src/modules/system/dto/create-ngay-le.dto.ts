import { IsString, IsNotEmpty, IsBoolean, IsOptional, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateNgayLeDto {
  @ApiProperty({ example: '2026-01-01', description: 'Ngày lễ' })
  @IsNotEmpty()
  @IsDateString()
  NgayLe: string;

  @ApiProperty({ example: 'Tết Dương Lịch', description: 'Tên ngày lễ' })
  @IsNotEmpty()
  @IsString()
  TenNgayLe: string;

  @ApiProperty({ example: false, description: 'Lặp lại hằng năm' })
  @IsOptional()
  @IsBoolean()
  LapLaiHangNam?: boolean;
}
