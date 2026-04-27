import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional, IsNumber } from 'class-validator';


export class CreatePhongBanDto {
  @ApiProperty({ example: 'Phòng Phát triển Phần mềm' })
  @IsString()
  @IsNotEmpty()
  TenPhong: string;

  @ApiProperty({ example: 'DEV' })
  @IsString()
  @IsNotEmpty()
  MaPhong: string;

  @ApiProperty({ example: 1, required: false })
  @IsNumber()
  @IsOptional()
  MaPhongCha?: number;

  @ApiProperty({ example: 5, required: false })
  @IsNumber()
  @IsOptional()
  MaQuanLy?: number;
}

export class UpdatePhongBanDto {
  @IsString()
  @IsOptional()
  TenPhong?: string;

  @IsString()
  @IsOptional()
  MaPhong?: string;

  @IsNumber()
  @IsOptional()
  MaPhongCha?: number;

  @IsNumber()
  @IsOptional()
  MaQuanLy?: number;
}
