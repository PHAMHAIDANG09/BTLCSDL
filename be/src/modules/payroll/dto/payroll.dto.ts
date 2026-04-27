import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateSalaryDto {
  @ApiProperty({ example: 1 })
  @IsNumber()
  @IsNotEmpty()
  MaNhanVienId: number;

  @ApiProperty({ example: 15000000 })
  @IsNumber()
  @IsNotEmpty()
  LuongCoBan: number;

  @ApiProperty({ example: 2000000 })
  @IsNumber()
  @IsNotEmpty()
  PhuCap: number;

  @ApiProperty({ example: 'Tăng lương hàng năm', required: false })
  @IsString()
  @IsOptional()
  GhiChu?: string;
}

export class CalculatePayrollDto {
  @ApiProperty({ example: 4 })
  @IsNumber()
  @IsNotEmpty()
  Thang: number;

  @ApiProperty({ example: 2026 })
  @IsNumber()
  @IsNotEmpty()
  Nam: number;
}
