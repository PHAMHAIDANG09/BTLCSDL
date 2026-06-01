import { Controller, Get, Query, UseGuards, Header } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ReportService } from './report.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('Reports')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('reports')
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  @Get('bang-cong/export')
  @Roles('Admin', 'Manager')
  @Header(
    'Content-Type',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  )
  @Header('Content-Disposition', 'attachment; filename="AttendanceReport.xlsx"')
  @ApiOperation({ summary: 'Xuất báo cáo bảng công ra file Excel' })
  exportAttendance(@Query('thang') thang: number, @Query('nam') nam: number) {
    return this.reportService.exportAttendance(thang, nam);
  }

  @Get('phieu-luong/export')
  @Roles('Admin', 'Manager')
  @Header(
    'Content-Type',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  )
  @Header('Content-Disposition', 'attachment; filename="PayrollReport.xlsx"')
  @ApiOperation({ summary: 'Xuất báo cáo bảng lương ra file Excel' })
  exportPayroll(@Query('thang') thang: number, @Query('nam') nam: number) {
    return this.reportService.exportPayroll(thang, nam);
  }

  @Get('thong-ke')
  @Roles('Admin', 'Manager')
  @ApiOperation({ summary: 'Lấy dữ liệu thống kê biểu đồ cho Reporting Center' })
  getChartStats() {
    return this.reportService.getChartStats();
  }
}
