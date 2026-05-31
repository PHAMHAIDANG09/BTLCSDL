import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  Param,
  Put,
  Get,
  Delete,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { LeaveService } from './leave.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import {
  CreateLoaiNghiPhepDto,
  UpdateLoaiNghiPhepDto,
} from './dto/loai-nghi-phep.dto';
import { CreateDonNghiPhepDto } from './dto/don-nghi-phep.dto';

@ApiTags('Leave Management')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('nghi-phep')
export class LeaveController {
  constructor(private readonly leaveService: LeaveService) {}

  @Post('gui-don')
  @ApiOperation({ summary: 'Gửi đơn xin nghỉ phép' })
  applyLeave(@Body() dto: CreateDonNghiPhepDto, @Request() req: any) {
    return this.leaveService.createLeaveRequest(dto, req.user.Id);
  }

  @Put(':id/duyet')
  @Roles('Admin', 'Manager')
  @ApiOperation({ summary: 'Phê duyệt hoặc từ chối đơn nghỉ phép' })
  approveLeave(
    @Param('id') id: string, 
    @Body('status') status: 'Approved' | 'Rejected',
    @Body('reason') reason: string,
    @Request() req: any
  ) {
    return this.leaveService.approveLeave(+id, req.user.Id, status, reason);
  }

  @Get('so-du')
  @ApiOperation({ summary: 'Lấy số dư phép cá nhân' })
  getBalances(@Request() req: any, @Query('year') year?: string) {
    const y = year ? +year : new Date().getFullYear();
    return this.leaveService.getBalances(req.user.Id, y);
  }

  @Get('lich-su')
  @ApiOperation({ summary: 'Lấy lịch sử nghỉ phép cá nhân' })
  getHistory(@Request() req: any) {
    return this.leaveService.getLeaveHistory(req.user.Id);
  }

  @Get('tat-ca')
  @Roles('Admin', 'Manager')
  @ApiOperation({ summary: 'Lấy tất cả đơn nghỉ phép (Admin/Manager)' })
  getAll(@Query('status') status?: string) {
    return this.leaveService.getAllLeaveRequests(status);
  }

  // --- Leave Type Endpoints ---
  @Get('loai-phep')
  @ApiOperation({ summary: 'Lấy danh sách các loại nghỉ phép' })
  findAllTypes() {
    return this.leaveService.findAllLeaveTypes();
  }

  @Post('loai-phep')
  @Roles('Admin')
  @ApiOperation({ summary: 'Tạo mới loại nghỉ phép' })
  createType(@Body() dto: CreateLoaiNghiPhepDto) {
    return this.leaveService.createLeaveType(dto);
  }

  @Put('loai-phep/:id')
  @Roles('Admin')
  @ApiOperation({ summary: 'Cập nhật loại nghỉ phép' })
  updateType(@Param('id') id: string, @Body() dto: UpdateLoaiNghiPhepDto) {
    return this.leaveService.updateLeaveType(+id, dto);
  }

  @Delete('loai-phep/:id')
  @Roles('Admin')
  @ApiOperation({ summary: 'Xóa loại nghỉ phép' })
  deleteType(@Param('id') id: string) {
    return this.leaveService.deleteLeaveType(+id);
  }
}
