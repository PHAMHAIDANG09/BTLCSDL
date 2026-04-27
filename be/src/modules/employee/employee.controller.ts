import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { EmployeeService } from './employee.service';
import { CreateNhanVienDto, UpdateNhanVienDto } from './dto/nhan-vien.dto';
import { CreateHopDongDto, UpdateHopDongDto } from './dto/hop-dong.dto';
import { TransferEmployeeDto } from './dto/transfer.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('Employees')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('employees')
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) { }

  @Get()
  @Roles('Admin', 'Manager')
  @ApiOperation({ summary: 'Lấy danh sách tất cả nhân viên' })
  findAll() {
    return this.employeeService.findAll();
  }

  @Get(':id')
  @Roles('Admin', 'Manager')
  @ApiOperation({ summary: 'Lấy thông tin chi tiết nhân viên' })
  findOne(@Param('id') id: string) {
    return this.employeeService.findOne(+id);
  }

  @Post()
  @Roles('Admin', 'Manager')
  @ApiOperation({ summary: 'Tạo mới nhân viên' })
  create(@Body() dto: CreateNhanVienDto) {
    return this.employeeService.createEmployee(dto);
  }

  @Put(':id')
  @Roles('Admin', 'Manager')
  @ApiOperation({ summary: 'Cập nhật thông tin nhân viên' })
  update(@Param('id') id: string, @Body() dto: UpdateNhanVienDto) {
    return this.employeeService.updateEmployee(+id, dto);
  }

  @Delete(':id')
  @Roles('Admin')
  @ApiOperation({ summary: 'Xóa nhân viên (Soft delete)' })
  remove(@Param('id') id: string) {
    return this.employeeService.deleteEmployee(+id);
  }

  @Post(':id/transfer')
  @Roles('Admin')
  @ApiOperation({ summary: 'Điều chuyển công tác nhân viên' })
  transfer(
    @Param('id') id: string,
    @Body() data: TransferEmployeeDto,
    @Request() req: any,
  ) {
    return this.employeeService.transferEmployee(+id, {
      ...data,
      NgayHieuLuc: new Date(data.NgayHieuLuc),
      NguoiDuyetId: req.user.Id,
    });
  }

  @Get('contracts/expiring')
  @Roles('Admin', 'Manager')
  @ApiOperation({ summary: 'Lấy các hợp đồng sắp hết hạn (trong 30 ngày)' })
  getExpiring() {
    return this.employeeService.getExpiringContracts();
  }

  // --- Contract Endpoints ---
  @Get(':employeeId/contracts')
  @Roles('Admin', 'Manager')
  @ApiOperation({ summary: 'Lấy danh sách hợp đồng của nhân viên' })
  findContractsByEmployee(@Param('employeeId') employeeId: string) {
    return this.employeeService.findContractsByEmployee(+employeeId);
  }

  @Get('contracts/:id')
  @Roles('Admin', 'Manager')
  @ApiOperation({ summary: 'Lấy chi tiết hợp đồng' })
  findOneContract(@Param('id') id: string) {
    return this.employeeService.findOneContract(+id);
  }

  @Post('contracts')
  @Roles('Admin')
  @ApiOperation({ summary: 'Tạo mới hợp đồng lao động' })
  createContract(@Body() dto: CreateHopDongDto) {
    return this.employeeService.createContract(dto);
  }

  @Put('contracts/:id')
  @Roles('Admin')
  @ApiOperation({ summary: 'Cập nhật hợp đồng' })
  updateContract(@Param('id') id: string, @Body() dto: UpdateHopDongDto) {
    return this.employeeService.updateContract(+id, dto);
  }

  @Delete('contracts/:id')
  @Roles('Admin')
  @ApiOperation({ summary: 'Xóa hợp đồng' })
  deleteContract(@Param('id') id: string) {
    return this.employeeService.deleteContract(+id);
  }
}
