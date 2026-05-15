import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  Get,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { PayrollService } from './payroll.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UpdateSalaryDto, CalculatePayrollDto } from './dto/payroll.dto';

@ApiTags('Payroll')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('payroll')
export class PayrollController {
  constructor(private readonly payrollService: PayrollService) {}

  @Post('update-salary')
  @Roles('Admin')
  @ApiOperation({ summary: 'Cập nhật mức lương nhân viên (SCD Loại 2)' })
  updateSalary(@Body() data: UpdateSalaryDto, @Request() req: any) {
    return this.payrollService.updateSalary(data.MaNhanVienId, {
      ...data,
      NguoiThayDoiId: req.user.Id,
    });
  }

  @Post('calculate')
  @Roles('Admin')
  @ApiOperation({ summary: 'Kích hoạt tính toán bảng lương thủ công' })
  calculate(@Body() data: CalculatePayrollDto, @Request() req: any) {
    return this.payrollService.calculatePayroll(
      data.Thang,
      data.Nam,
      req.user.Id,
    );
  }

  @Get('my-payslips')
  @ApiOperation({ summary: 'Lấy danh sách phiếu lương cá nhân' })
  getMyPaySlips(@Request() req: any) {
    return this.payrollService.getMyPaySlips(req.user.Id);
  }

  @Get('my-salary-history')
  @ApiOperation({ summary: 'Lấy lịch sử thay đổi lương cá nhân' })
  getMySalaryHistory(@Request() req: any) {
    return this.payrollService.getSalaryHistory(req.user.Id);
  }

  @Get('all-payslips')
  @Roles('Admin', 'Manager')
  @ApiOperation({ summary: 'Lấy toàn bộ phiếu lương (Admin/Manager)' })
  getAllPaySlips(@Query('thang') thang?: string, @Query('nam') nam?: string) {
    return this.payrollService.getAllPaySlips(
      thang ? +thang : undefined,
      nam ? +nam : undefined,
    );
  }
}
