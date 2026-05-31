import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { OrganizationService } from './organization.service';
import { CreatePhongBanDto, UpdatePhongBanDto } from './dto/phong-ban.dto';
import { CreateChucVuDto, UpdateChucVuDto } from './dto/chuc-vu.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('Organization')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('co-cau-to-chuc')
export class OrganizationController {
  constructor(private readonly orgService: OrganizationService) {}

  @Post('phong-ban')
  @Roles('Admin')
  @ApiOperation({ summary: 'Tạo mới phòng ban' })
  createPhongBan(@Body() dto: CreatePhongBanDto) {
    return this.orgService.createPhongBan(dto);
  }

  @Get('phong-ban/tree')
  @ApiOperation({ summary: 'Lấy sơ đồ tổ chức phòng ban (cây)' })
  getTree() {
    return this.orgService.getDepartmentTree();
  }

  @Get('phong-ban')
  @ApiOperation({ summary: 'Lấy danh sách tất cả phòng ban' })
  findAll() {
    return this.orgService.findAllPhongBan();
  }

  @Get('phong-ban/:id')
  @ApiOperation({ summary: 'Lấy thông tin chi tiết phòng ban' })
  findOne(@Param('id') id: string) {
    return this.orgService.findOnePhongBan(+id);
  }

  @Put('phong-ban/:id')
  @Roles('Admin')
  @ApiOperation({ summary: 'Cập nhật phòng ban' })
  updatePhongBan(@Param('id') id: string, @Body() dto: UpdatePhongBanDto) {
    return this.orgService.updatePhongBan(+id, dto);
  }

  @Delete('phong-ban/:id')
  @Roles('Admin')
  @ApiOperation({ summary: 'Xóa phòng ban' })
  deletePhongBan(@Param('id') id: string) {
    return this.orgService.deletePhongBan(+id);
  }

  // --- Chuc Vu Endpoints ---
  @Get('chuc-vu')
  @ApiOperation({ summary: 'Lấy danh sách tất cả chức vụ' })
  findAllChucVu() {
    return this.orgService.findAllChucVu();
  }

  @Get('chuc-vu/:id')
  @ApiOperation({ summary: 'Lấy thông tin chi tiết chức vụ' })
  findOneChucVu(@Param('id') id: string) {
    return this.orgService.findOneChucVu(+id);
  }

  @Post('chuc-vu')
  @Roles('Admin')
  @ApiOperation({ summary: 'Tạo mới chức vụ' })
  createChucVu(@Body() dto: CreateChucVuDto) {
    return this.orgService.createChucVu(dto);
  }

  @Put('chuc-vu/:id')
  @Roles('Admin')
  @ApiOperation({ summary: 'Cập nhật chức vụ' })
  updateChucVu(@Param('id') id: string, @Body() dto: UpdateChucVuDto) {
    return this.orgService.updateChucVu(+id, dto);
  }

  @Delete('chuc-vu/:id')
  @Roles('Admin')
  @ApiOperation({ summary: 'Xóa chức vụ' })
  deleteChucVu(@Param('id') id: string) {
    return this.orgService.deleteChucVu(+id);
  }
}
