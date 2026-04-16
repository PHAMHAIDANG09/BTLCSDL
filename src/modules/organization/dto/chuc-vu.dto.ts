import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumber, IsOptional } from 'class-validator';

export class CreateChucVuDto {
  @ApiProperty({ example: 'Lập trình viên' })
  @IsString()
  @IsNotEmpty()
  TenChucVu: string;

  @ApiProperty({ example: 1, description: 'Cấp độ chức vụ (1-10)' })
  @IsNumber()
  CapDo: number;

  @ApiProperty({ example: 'Mô tả công việc...', required: false })
  @IsString()
  @IsOptional()
  MoTa?: string;
}

export class UpdateChucVuDto {
  @IsString()
  @IsOptional()
  TenChucVu?: string;

  @IsNumber()
  @IsOptional()
  CapDo?: number;

  @IsString()
  @IsOptional()
  MoTa?: string;
}
