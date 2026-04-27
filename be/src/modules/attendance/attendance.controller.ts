import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  Param,
  Put,
  Get,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AttendanceService } from './attendance.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CreateDonLamThemDto } from './dto/don-lam-them.dto';
import { UpdateOTStatusDto } from './dto/update-ot.dto';

@ApiTags('Attendance')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('attendance')
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) { }

  @Post('check-in-out')
  @ApiOperation({ summary: 'Điểm danh vào/ra hằng ngày' })
  checkInOut(@Request() req: any) {
    return this.attendanceService.checkInOut(req.user.Id);
  }

  @Get('history')
  @ApiOperation({ summary: 'Lấy lịch sử chấm công cá nhân' })
  getHistory(
    @Request() req: any,
    @Query('startDate') start?: string,
    @Query('endDate') end?: string,
  ) {
    return this.attendanceService.getHistory(
      req.user.Id,
      start ? new Date(start) : undefined,
      end ? new Date(end) : undefined,
    );
  }

  @Get('all-history')
  @Roles('Admin', 'Manager')
  @ApiOperation({
    summary: 'Lấy lịch sử chấm công toàn bộ nhân viên (Admin/Manager)',
  })
  getAllHistory(
    @Query('startDate') start: string,
    @Query('endDate') end: string,
  ) {
    return this.attendanceService.getAllHistory(new Date(start), new Date(end));
  }

  @Post('ot')
  @ApiOperation({ summary: 'Đăng ký làm thêm giờ (OT)' })
  registerOT(@Body() dto: CreateDonLamThemDto, @Request() req: any) {
    return this.attendanceService.createOTRequest(req.user.Id, dto);
  }

  @Put('ot/:id/approve')
  @Roles('Admin', 'Manager')
  @ApiOperation({ summary: 'Phê duyệt hoặc từ chối yêu cầu làm thêm' })
  approveOT(
    @Param('id') id: string,
    @Body() dto: UpdateOTStatusDto,
    @Request() req: any,
  ) {
    return this.attendanceService.approveOT(+id, req.user.Id, dto.status);
  }

  @Get('ot')
  @Roles('Admin', 'Manager')
  @ApiOperation({ summary: 'Lấy tất cả yêu cầu làm thêm (Admin/Manager)' })
  getAllOT(@Query('status') status?: string) {
    return this.attendanceService.getAllOTRequests(status);
  }
}
