import { Controller, Get, Post, Body, UseGuards, Query, BadRequestException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { SystemService } from './system.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CreateNgayLeDto } from './dto/create-ngay-le.dto';

@ApiTags('System')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('system')
export class SystemController {
  constructor(private readonly systemService: SystemService) { }

  @Get('logs')
  @Roles('Admin')
  @ApiOperation({ summary: 'Lấy danh sách nhật ký hệ thống (Chỉ Admin)' })
  getLogs(@Query('limit') limit?: string) {
    return this.systemService.getLogs(limit ? +limit : 100);
  }

  @Get('holidays')
  @ApiOperation({ summary: 'Lấy danh sách các ngày nghỉ lễ' })
  getHolidays() {
    return this.systemService.getHolidays();
  }

  @Post('holidays')
  @Roles('Admin')
  @ApiOperation({ summary: 'Tạo mới ngày nghỉ lễ' })
  async createHoliday(@Body() data: CreateNgayLeDto) {
    try {
      return await this.systemService.createHoliday(data);
    } catch (e: any) {
      console.error("CREATE HOLIDAY ERROR:", e);
      throw new BadRequestException(e.message || 'Lỗi thêm ngày lễ');
    }
  }
}
