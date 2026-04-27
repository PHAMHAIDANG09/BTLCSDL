import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';

export class UpdateOTStatusDto {
  @ApiProperty({ example: 'Approved', enum: ['Approved', 'Rejected'] })
  @IsEnum(['Approved', 'Rejected'])
  @IsNotEmpty()
  status: 'Approved' | 'Rejected';
}
