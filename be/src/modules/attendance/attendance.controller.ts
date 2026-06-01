// code file attendance.controller.ts
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
  Delete,
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
@Controller('cham-cong')
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Post('diem-danh')
  @ApiOperation({ summary: 'Điểm danh vào/ra hằng ngày' })
  checkInOut(@Request() req: any) {
    return this.attendanceService.checkInOut(req.user.Id);
  }

  @Get('hom-nay')
  @ApiOperation({ summary: 'Lấy trạng thái chấm công hôm nay' })
  getTodayStatus(@Request() req: any) {
    return this.attendanceService.getTodayAttendance(req.user.Id);
  }

  @Get('lich-su')
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

  @Get('tat-ca-lich-su')
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

  @Post('lam-them')
  @ApiOperation({ summary: 'Đăng ký làm thêm giờ (OT)' })
  registerOT(@Body() dto: CreateDonLamThemDto, @Request() req: any) {
    return this.attendanceService.createOTRequest(req.user.Id, dto);
  }

  @Put('lam-them/:id/duyet')
  @Roles('Admin', 'Manager')
  @ApiOperation({ summary: 'Phê duyệt hoặc từ chối yêu cầu làm thêm' })
  approveOT(
    @Param('id') id: string,
    @Body() dto: UpdateOTStatusDto,
    @Request() req: any,
  ) {
    return this.attendanceService.approveOT(+id, req.user.Id, dto.status);
  }

  @Get('lam-them')
  @Roles('Admin', 'Manager')
  @ApiOperation({ summary: 'Lấy tất cả yêu cầu làm thêm (Admin/Manager)' })
  getAllOT(@Query('status') status?: string) {
    return this.attendanceService.getAllOTRequests(status);
  }

  @Get('lam-them/lich-su')
  @ApiOperation({ summary: 'Lấy lịch sử yêu cầu làm thêm cá nhân' })
  getOTHistory(@Request() req: any) {
    return this.attendanceService.getOTHistory(req.user.Id);
  }

  @Delete(':id')
  @Roles('Admin')
  @ApiOperation({ summary: 'Xóa bản ghi chấm công (Admin)' })
  deleteAttendance(@Param('id') id: string) {
    return this.attendanceService.deleteAttendance(+id);
  }

  @Put(':id')
  @Roles('Admin')
  @ApiOperation({ summary: 'Cập nhật bản ghi chấm công (Admin)' })
  updateAttendance(@Param('id') id: string, @Body() data: any) {
    return this.attendanceService.updateAttendance(+id, data);
  }

  @Get('tong-hop')
  @Roles('Admin')
  @ApiOperation({ summary: 'Lấy báo cáo tổng hợp tháng (Admin)' })
  getSummary(@Query('month') month: number, @Query('year') year: number) {
    return this.attendanceService.getMonthlySummary(month, year);
  }
}
