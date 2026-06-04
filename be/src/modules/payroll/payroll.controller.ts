import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  Get,
  Query,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { PayrollService } from './payroll.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UpdateSalaryDto, CalculatePayrollDto, UpdatePaySlipStatusDto } from './dto/payroll.dto';

@ApiTags('Payroll')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('luong')
export class PayrollController {
  constructor(private readonly payrollService: PayrollService) {}

  @Post('cap-nhat-luong')
  @Roles('Admin')
  @ApiOperation({ summary: 'Cập nhật mức lương nhân viên (SCD Loại 2)' })
  updateSalary(@Body() data: UpdateSalaryDto, @Request() req: any) {
    return this.payrollService.updateSalary(data.MaNhanVienId, {
      ...data,
      NguoiThayDoiId: req.user.Id,
    });
  }

  @Post('tinh-luong')
  @Roles('Admin')
  @ApiOperation({ summary: 'Kích hoạt tính toán bảng lương thủ công' })
  calculate(@Body() data: CalculatePayrollDto, @Request() req: any) {
    return this.payrollService.calculatePayroll(
      data.Thang,
      data.Nam,
      req.user.Id,
    );
  }

  @Get('phieu-luong-cua-toi')
  @ApiOperation({ summary: 'Lấy danh sách phiếu lương cá nhân' })
  getMyPaySlips(@Request() req: any) {
    return this.payrollService.getMyPaySlips(req.user.Id);
  }

  @Get('lich-su-luong-cua-toi')
  @ApiOperation({ summary: 'Lấy lịch sử thay đổi lương cá nhân' })
  getMySalaryHistory(@Request() req: any) {
    return this.payrollService.getSalaryHistory(req.user.Id);
  }

  @Get('tat-ca-phieu-luong')
  @Roles('Admin', 'Manager')
  @ApiOperation({ summary: 'Lấy toàn bộ phiếu lương (Admin/Manager)' })
  getAllPaySlips(@Query('thang') thang?: string, @Query('nam') nam?: string) {
    return this.payrollService.getAllPaySlips(
      thang ? +thang : undefined,
      nam ? +nam : undefined,
    );
  }

  @Get('lich-su-tat-ca')
  @Roles('Admin', 'Manager')
  @ApiOperation({ summary: 'Lấy toàn bộ lịch sử lương tất cả nhân viên (Admin/Manager)' })
  getAllSalaryHistory() {
    return this.payrollService.getSalaryHistory(); // không truyền arg → lấy tất cả
  }

  @Get('lich-su/:employeeId')
  @Roles('Admin', 'Manager')
  @ApiOperation({ summary: 'Lấy lịch sử lương của nhân viên cụ thể' })
  getEmployeeSalaryHistory(@Param('employeeId') employeeId: string) {
    return this.payrollService.getSalaryHistory(+employeeId);
  }

  @Get('phieu-luong-nhan-vien/:employeeId')
  @Roles('Admin', 'Manager')
  @ApiOperation({ summary: 'Lấy danh sách phiếu lương của nhân viên cụ thể' })
  getEmployeePaySlips(@Param('employeeId') employeeId: string) {
    return this.payrollService.getMyPaySlips(+employeeId);
  }

  @Put(':id')
  @Roles('Admin')
  @ApiOperation({ summary: 'Cập nhật trạng thái phiếu lương' })
  updateStatus(@Param('id') id: string, @Body() dto: UpdatePaySlipStatusDto) {
    return this.payrollService.updatePaySlipStatus(+id, dto.TrangThai);
  }

  @Delete(':id')
  @Roles('Admin')
  @ApiOperation({ summary: 'Xóa phiếu lương' })
  remove(@Param('id') id: string) {
    return this.payrollService.deletePaySlip(+id);
  }
}
