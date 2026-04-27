# BÁO CÁO LỖI & THIẾU SÓT - DỰ ÁN NextHR API
> Người review: AI Code Review | Ngày: 2026-04-21  
> Mức độ: 🔴 Critical | 🟠 High | 🟡 Medium | 🟢 Low

---

## MỤC LỤC
1. [Config & Infrastructure](#1-config--infrastructure)
2. [Auth Module](#2-auth-module)
3. [Employee Module](#3-employee-module)
4. [Leave Module](#4-leave-module)
5. [Attendance Module](#5-attendance-module)
6. [Payroll Module](#6-payroll-module)
7. [Organization Module](#7-organization-module)
8. [System Module](#8-system-module)
9. [Report Module](#9-report-module)
10. [Dashboard Module](#10-dashboard-module)
11. [Thiếu Module / API](#11-thiếu-module--api)
12. [Bảo mật chung](#12-bảo-mật-chung)

---

## 1. Config & Infrastructure

### 🟡 [CFG-01] `database.config.ts` — import sai đường dẫn

**File:** `src/config/database.config.ts`

```typescript
// ❌ SAI — import từ /dist, không nên dùng
import { registerAs } from '@nestjs/config/dist';

// ✅ ĐÚNG
import { registerAs } from '@nestjs/config';
```

---

### 🟡 [CFG-02] `database.config.ts` — Password hardcode trong code

**File:** `src/config/database.config.ts`

```typescript
// ❌ SAI — password hardcode trong source code
password: process.env.DB_PASSWORD || 'Dang@12345',

// ✅ ĐÚNG — bắt buộc phải có env var, throw error nếu thiếu
password: process.env.DB_PASSWORD,
// Và trong app.module.ts validate env:
```

```typescript
// app.module.ts — thêm validation
ConfigModule.forRoot({
  isGlobal: true,
  load: [databaseConfig, redisConfig, controlApiConfig],
  validationSchema: Joi.object({
    DB_PASSWORD: Joi.string().required(),
    JWT_SECRET: Joi.string().min(32).required(),
    // ...
  }),
}),
```

---

### 🟡 [CFG-03] `.env` — JWT_SECRET quá yếu

**File:** `.env`

```bash
# ❌ SAI — secret quá ngắn và dễ đoán
JWT_SECRET=dangdeptraiquadi

# ✅ ĐÚNG — tối thiểu 32 ký tự random
JWT_SECRET=your-super-secret-key-at-least-32-chars-long-random
```

---

### 🟢 [CFG-04] Thiếu CORS configuration

**File:** `src/main.ts`

```typescript
// ✅ Thêm vào main.ts trước app.listen()
app.enableCors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
});
```

---

### 🟢 [CFG-05] Thiếu Rate Limiting

```bash
npm install @nestjs/throttler
```

```typescript
// app.module.ts
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';

ThrottlerModule.forRoot([{ ttl: 60000, limit: 100 }]),

// app.module.ts providers
{ provide: APP_GUARD, useClass: ThrottlerGuard },
```

---

## 2. Auth Module

### 🔴 [AUTH-01] `auth.service.ts` — Không log audit khi login

**File:** `src/modules/auth/auth.service.ts`

Login thành công/thất bại không được ghi vào `NhatKyHeThong`. Kẻ tấn công có thể brute-force mà không bị phát hiện.

```typescript
// auth.service.ts — thêm audit log
async login(loginDto: LoginDto) {
  // ... existing code ...
  
  // ✅ Thêm sau khi login thành công
  await this.logRepository.save({
    TenBang: 'NhanVien',
    MaBanGhi: user.Id,
    HanhDong: 'LOGIN',
    GiaTriMoi: JSON.stringify({ ip: '...', time: new Date() }),
    MaNguoiThucHienId: user.Id,
    NgayThucHien: new Date(),
  });
}
```

---

### 🟠 [AUTH-02] `jwt.strategy.ts` — Thiếu cache, query DB mỗi request

**File:** `src/modules/auth/strategies/jwt.strategy.ts`

Mỗi API call đều query DB để validate user → bottleneck nghiêm trọng.

```typescript
// ✅ Inject RedisService và cache user
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    @InjectRepository(NhanVien)
    private nhanVienRepository: Repository<NhanVien>,
    private redisService: RedisService, // ✅ thêm
  ) { super(/*...*/); }

  async validate(payload: any) {
    const cacheKey = `user:${payload.sub}`;
    
    // Check cache trước
    const cached = await this.redisService.get(cacheKey);
    if (cached) return JSON.parse(cached);
    
    const user = await this.nhanVienRepository.findOne({
      where: { Id: payload.sub },
      relations: ['vaiTro', 'phongBan', 'chucVu'],
    });
    
    if (!user || user.TrangThai !== 'Active') {
      throw new UnauthorizedException('User not found or inactive');
    }
    
    // Cache 5 phút
    await this.redisService.set(cacheKey, JSON.stringify(user), 300);
    return user;
  }
}
```

---

### 🟠 [AUTH-03] Thiếu API đổi mật khẩu

**File:** `src/modules/auth/auth.controller.ts`

```typescript
// auth.controller.ts
@Put('change-password')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@ApiOperation({ summary: 'Đổi mật khẩu' })
changePassword(@Body() dto: ChangePasswordDto, @Request() req: any) {
  return this.authService.changePassword(req.user.Id, dto);
}
```

```typescript
// dto/change-password.dto.ts
export class ChangePasswordDto {
  @IsString() @IsNotEmpty() @MinLength(6)
  matKhauCu: string;

  @IsString() @IsNotEmpty() @MinLength(6)
  matKhauMoi: string;
}
```

```typescript
// auth.service.ts
async changePassword(userId: number, dto: ChangePasswordDto) {
  const user = await this.nhanVienRepository.findOne({
    where: { Id: userId },
    select: ['Id', 'MatKhauHash'],
  });
  
  const isValid = await bcrypt.compare(dto.matKhauCu, user.MatKhauHash);
  if (!isValid) throw new BadRequestException('Mật khẩu cũ không đúng');
  
  user.MatKhauHash = await bcrypt.hash(dto.matKhauMoi, 10);
  await this.nhanVienRepository.save(user);
  
  return { message: 'Đổi mật khẩu thành công' };
}
```

---

### 🟠 [AUTH-04] Thiếu API reset mật khẩu (Admin)

```typescript
// Cần thêm endpoint để Admin reset password cho nhân viên
@Put('users/:id/reset-password')
@Roles('Admin')
resetPassword(@Param('id') id: string) {
  return this.authService.resetPassword(+id);
}

// auth.service.ts
async resetPassword(userId: number) {
  const defaultPassword = 'Nexhr@123'; // hoặc generate random
  const hash = await bcrypt.hash(defaultPassword, 10);
  await this.nhanVienRepository.update(userId, { MatKhauHash: hash });
  return { message: 'Reset thành công', defaultPassword };
}
```

---

### 🟡 [AUTH-05] `auth.service.ts` — `getProfile` có thể trả null không xử lý

**File:** `src/modules/auth/auth.service.ts`

```typescript
// ❌ SAI — trả null nếu không tìm thấy user
async getProfile(userId: number) {
  const user = await this.nhanVienRepository.findOne({/*...*/});
  if (!user) return null; // ← controller không xử lý null
  const { MatKhauHash, ...result } = user;
  return result;
}

// ✅ ĐÚNG
async getProfile(userId: number) {
  const user = await this.nhanVienRepository.findOne({/*...*/});
  if (!user) throw new NotFoundException('Không tìm thấy người dùng');
  const { MatKhauHash, ...result } = user;
  return result;
}
```

---

### 🟡 [AUTH-06] Thiếu refresh token mechanism

JWT expires in `1d` — khi hết hạn user phải login lại. Cần implement refresh token.

```typescript
// Tối thiểu thêm endpoint check token còn hạn không:
@Get('verify')
@UseGuards(JwtAuthGuard)
verifyToken(@Request() req: any) {
  return { valid: true, user: req.user.Id };
}
```

---

## 3. Employee Module

### 🔴 [EMP-01] `employee.service.ts` — `getExpiringContracts()` query sai

**File:** `src/modules/employee/employee.service.ts`

```typescript
// ❌ SAI — tìm exact date, không phải khoảng thời gian
async getExpiringContracts() {
  const thirtyDaysFromNow = new Date();
  thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
  
  return this.hopDongRepository.find({
    where: {
      NgayKetThuc: thirtyDaysFromNow, // ← tìm đúng 1 ngày!
      TrangThai: 'Active',
    },
  });
}

// ✅ ĐÚNG — dùng Between
import { Between, MoreThanOrEqual, LessThanOrEqual } from 'typeorm';

async getExpiringContracts() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const thirtyDaysFromNow = new Date();
  thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
  thirtyDaysFromNow.setHours(23, 59, 59, 999);
  
  return this.hopDongRepository.find({
    where: {
      NgayKetThuc: Between(today, thirtyDaysFromNow),
      TrangThai: 'Active',
    },
    relations: ['nhanVien'],
    order: { NgayKetThuc: 'ASC' },
  });
}
```

---

### 🔴 [EMP-02] `employee.controller.ts` — Route conflict `/contracts/expiring`

**File:** `src/modules/employee/employee.controller.ts`

```typescript
// ❌ VẤN ĐỀ — NestJS sẽ match "expiring" như là :employeeId
@Get(':employeeId/contracts')     // ← route này bắt trước
findContractsByEmployee(...)

@Get('contracts/expiring')        // ← route này KHÔNG BAO GIỜ được gọi
getExpiring()

// ✅ ĐÚNG — đặt static route TRƯỚC dynamic route
@Get('contracts/expiring')        // ← static lên trước
getExpiring() { ... }

@Get(':employeeId/contracts')     // ← dynamic sau
findContractsByEmployee(...) { ... }
```

---

### 🟠 [EMP-03] `employee.service.ts` — `createEmployee` không check email trùng

**File:** `src/modules/employee/employee.service.ts`

```typescript
// ❌ SAI — sẽ throw DB error thay vì NestJS exception đẹp
async createEmployee(dto: CreateNhanVienDto) {
  // ... không check email duplicate ...
  return this.nhanVienRepository.save(nv); // ← DB throw duplicate key error
}

// ✅ ĐÚNG
async createEmployee(dto: CreateNhanVienDto) {
  const existing = await this.nhanVienRepository.findOne({
    where: { Email: dto.Email },
  });
  if (existing) throw new ConflictException(`Email ${dto.Email} đã tồn tại`);
  
  // ... rest of code ...
}
```

---

### 🟠 [EMP-04] `employee.service.ts` — MaNhanVien generation có race condition

**File:** `src/modules/employee/employee.service.ts`

```typescript
// ❌ SAI — race condition khi tạo đồng thời nhiều nhân viên
const count = await this.nhanVienRepository.count();
const maNhanVien = `EMP-${year}-${(count + 1).toString().padStart(3, '0')}`;
// Nếu 2 request đến cùng lúc → count giống nhau → duplicate MaNhanVien

// ✅ ĐÚNG — dùng transaction hoặc sequence
async createEmployee(dto: CreateNhanVienDto) {
  const queryRunner = this.dataSource.createQueryRunner();
  await queryRunner.connect();
  await queryRunner.startTransaction();
  
  try {
    const year = new Date().getFullYear();
    // Lock để đếm chính xác
    const count = await queryRunner.manager
      .createQueryBuilder(NhanVien, 'nv')
      .where('YEAR(nv.NgayVaoLam) = :year', { year })
      .setLock('pessimistic_write')
      .getCount();
    
    const maNhanVien = `EMP-${year}-${(count + 1).toString().padStart(3, '0')}`;
    // ... rest ...
    await queryRunner.commitTransaction();
  } catch(e) {
    await queryRunner.rollbackTransaction();
    throw e;
  } finally {
    await queryRunner.release();
  }
}
```

---

### 🟡 [EMP-05] `nhan-vien.dto.ts` — Thiếu validation field quan trọng

**File:** `src/modules/employee/dto/nhan-vien.dto.ts`

```typescript
// ✅ Thêm vào CreateNhanVienDto
export class CreateNhanVienDto {
  // ... existing fields ...
  
  @ApiProperty({ example: '0901234567' })
  @IsString()
  @IsOptional()
  @Matches(/^(0|\+84)[0-9]{9}$/, { message: 'Số điện thoại không hợp lệ' })
  SoDienThoai?: string;

  @ApiProperty({ example: '2025-01-01' })
  @IsDateString()
  @IsNotEmpty()
  NgayVaoLam: string; // ← thiếu trong DTO hiện tại

  @ApiProperty({ example: 'Nam', enum: ['Nam', 'Nữ', 'Khác'] })
  @IsIn(['Nam', 'Nữ', 'Khác'])
  @IsOptional()
  GioiTinh?: string;
}
```

---

### 🟡 [EMP-06] `hop-dong.dto.ts` — Thiếu validation LoaiHopDong enum

**File:** `src/modules/employee/dto/hop-dong.dto.ts`

```typescript
// ❌ SAI — chấp nhận bất kỳ string nào
@IsString()
@IsNotEmpty()
LoaiHopDong: string;

// ✅ ĐÚNG — validate enum khớp DB constraint
@IsIn(['Thử việc', 'Xác định thời hạn', 'Không xác định thời hạn'])
@IsNotEmpty()
LoaiHopDong: string;
```

---

### 🟡 [EMP-07] Thiếu API lấy lịch sử điều chuyển của nhân viên

```typescript
// employee.controller.ts — thêm endpoint
@Get(':id/transfer-history')
@Roles('Admin', 'Manager')
@ApiOperation({ summary: 'Lấy lịch sử điều chuyển của nhân viên' })
getTransferHistory(@Param('id') id: string) {
  return this.employeeService.getTransferHistory(+id);
}

// employee.service.ts
@InjectRepository(LichSuDieuChuyen)
private lichSuDieuChuyenRepository: Repository<LichSuDieuChuyen>,

async getTransferHistory(employeeId: number) {
  return this.lichSuDieuChuyenRepository.find({
    where: { MaNhanVienId: employeeId },
    relations: ['phongBanCu', 'phongBanMoi', 'chucVuCu', 'chucVuMoi', 'nguoiDuyet'],
    order: { NgayTao: 'DESC' },
  });
}
```

---

### 🟡 [EMP-08] `deleteEmployee` chỉ set Inactive, không xử lý session

```typescript
// ✅ Sau khi deactivate, cần invalidate cache JWT
async deleteEmployee(id: number) {
  const nv = await this.findOne(id);
  nv.TrangThai = 'Inactive';
  await this.nhanVienRepository.save(nv);
  
  // Xóa cache Redis nếu có
  // await this.redisService.del(`user:${id}`);
  
  return { message: 'Đã vô hiệu hóa nhân viên' };
}
```

---

## 4. Leave Module

### 🔴 [LEAVE-01] `leave.service.ts` — `approveLeave()` crash với Date

**File:** `src/modules/leave/leave.service.ts`

```typescript
// ❌ SAI — NgayBatDau từ DB date column trả về string hoặc Date tùy driver
// Nếu là string → .getFullYear() throw TypeError: request.NgayBatDau.getFullYear is not a function
const balance = await queryRunner.manager.findOne(SoDuPhep, {
  where: {
    Nam: request.NgayBatDau.getFullYear(), // ← CRASH!
  },
});

// ✅ ĐÚNG
Nam: new Date(request.NgayBatDau).getFullYear(),
```

---

### 🔴 [LEAVE-02] `leave.service.ts` — `approveLeave()` không kiểm tra balance đủ khi approve

**File:** `src/modules/leave/leave.service.ts`

```typescript
// ❌ SAI — approve không check balance đủ không
// Chỉ tạo đơn mới check, nhưng khi approve thì không re-check
// Có thể xảy ra: tạo 2 đơn cùng lúc → approve cả 2 → số dư âm

// ✅ ĐÚNG — thêm check trong approveLeave()
async approveLeave(requestId: number, approverId: number) {
  const queryRunner = this.dataSource.createQueryRunner();
  await queryRunner.connect();
  await queryRunner.startTransaction();

  try {
    const request = await queryRunner.manager.findOne(DonNghiPhep, {
      where: { Id: requestId },
      lock: { mode: 'pessimistic_write' }, // ✅ Lock row
    });
    
    if (!request || request.TrangThai !== 'Pending') {
      throw new BadRequestException('Đơn không hợp lệ hoặc đã xử lý');
    }

    const balance = await queryRunner.manager.findOne(SoDuPhep, {
      where: {
        MaNhanVienId: request.MaNhanVienId,
        MaLoaiPhepId: request.MaLoaiPhepId,
        Nam: new Date(request.NgayBatDau).getFullYear(), // ✅ Fix crash
      },
      lock: { mode: 'pessimistic_write' }, // ✅ Lock row
    });

    // ✅ Re-check balance khi approve
    const soNgayConLai = balance ? balance.TongNgayPhep - balance.DaSuDung : 0;
    if (soNgayConLai < request.TongSoNgay) {
      throw new BadRequestException(
        `Số dư phép không đủ. Còn lại: ${soNgayConLai} ngày`
      );
    }

    // ... rest of code ...
  }
}
```

---

### 🔴 [LEAVE-03] `leave.service.ts` — `grantAnnualLeave()` không check duplicate

**File:** `src/modules/leave/leave.service.ts`

```typescript
// ❌ SAI — nếu server restart đúng ngày 1/1, hoặc cron chạy 2 lần → duplicate
@Cron('0 0 1 1 *')
async grantAnnualLeave() {
  // ... tạo record mà không check tồn tại
  await this.soDuPhepRepository.save(balance); // ← duplicate!
}

// ✅ ĐÚNG — dùng upsert hoặc check trước
@Cron('0 0 1 1 *')
async grantAnnualLeave() {
  const year = new Date().getFullYear();
  const employees = await this.nhanVienRepository.find({
    where: { TrangThai: 'Active' },
  });
  const leaveTypes = await this.loaiNghiPhepRepository.find();

  for (const employee of employees) {
    for (const lt of leaveTypes) {
      // ✅ Check tồn tại trước
      const existing = await this.soDuPhepRepository.findOne({
        where: {
          MaNhanVienId: employee.Id,
          MaLoaiPhepId: lt.Id,
          Nam: year,
        },
      });
      
      if (!existing) {
        const balance = this.soDuPhepRepository.create({
          MaNhanVienId: employee.Id,
          MaLoaiPhepId: lt.Id,
          Nam: year,
          TongNgayPhep: lt.SoNgayToiDaNam,
          DaSuDung: 0,
        });
        await this.soDuPhepRepository.save(balance);
      }
    }
  }
}
```

---

### 🟠 [LEAVE-04] Thiếu API từ chối đơn nghỉ phép (reject)

**File:** `src/modules/leave/leave.controller.ts` và `leave.service.ts`

```typescript
// leave.controller.ts
@Put(':id/reject')
@Roles('Admin', 'Manager')
@ApiOperation({ summary: 'Từ chối đơn nghỉ phép' })
rejectLeave(
  @Param('id') id: string,
  @Body('lyDoTuChoi') lyDoTuChoi: string,
  @Request() req: any,
) {
  return this.leaveService.rejectLeave(+id, req.user.Id, lyDoTuChoi);
}
```

```typescript
// leave.service.ts
async rejectLeave(requestId: number, approverId: number, lyDoTuChoi: string) {
  const request = await this.donNghiPhepRepository.findOne({
    where: { Id: requestId },
  });
  
  if (!request) throw new NotFoundException('Không tìm thấy đơn');
  if (request.TrangThai !== 'Pending') {
    throw new BadRequestException('Đơn không ở trạng thái chờ duyệt');
  }
  
  request.TrangThai = 'Rejected';
  request.NguoiDuyetId = approverId;
  request.NgayDuyet = new Date();
  request.LyDoTuChoi = lyDoTuChoi;
  
  return this.donNghiPhepRepository.save(request);
}
```

---

### 🟠 [LEAVE-05] Thiếu API hủy đơn nghỉ phép (cancel by employee)

```typescript
// leave.controller.ts
@Put(':id/cancel')
@ApiOperation({ summary: 'Hủy đơn nghỉ phép (nhân viên tự hủy)' })
cancelLeave(@Param('id') id: string, @Request() req: any) {
  return this.leaveService.cancelLeave(+id, req.user.Id);
}
```

```typescript
// leave.service.ts
async cancelLeave(requestId: number, userId: number) {
  const request = await this.donNghiPhepRepository.findOne({
    where: { Id: requestId },
  });
  
  if (!request) throw new NotFoundException('Không tìm thấy đơn');
  if (request.MaNhanVienId !== userId) {
    throw new ForbiddenException('Không có quyền hủy đơn này');
  }
  if (request.TrangThai !== 'Pending') {
    throw new BadRequestException('Chỉ có thể hủy đơn đang chờ duyệt');
  }
  
  request.TrangThai = 'Cancelled';
  return this.donNghiPhepRepository.save(request);
}
```

---

### 🟠 [LEAVE-06] `createLeaveRequest` không validate ngày hợp lệ

```typescript
// leave.service.ts
async createLeaveRequest(dto: any, userId: number) {
  // ❌ Thiếu các validation:
  // 1. NgayBatDau không được là ngày quá khứ
  // 2. NgayKetThuc >= NgayBatDau  
  // 3. TongSoNgay phải khớp với NgayBatDau - NgayKetThuc
  // 4. Không được trùng với đơn đã approved khác

  // ✅ Thêm vào:
  const startDate = new Date(dto.NgayBatDau);
  const endDate = new Date(dto.NgayKetThuc);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  if (startDate < today) {
    throw new BadRequestException('Ngày bắt đầu không được là ngày quá khứ');
  }
  if (endDate < startDate) {
    throw new BadRequestException('Ngày kết thúc phải sau ngày bắt đầu');
  }
  
  // Check trùng đơn
  const overlapping = await this.donNghiPhepRepository
    .createQueryBuilder('don')
    .where('don.MaNhanVienId = :userId', { userId })
    .andWhere('don.TrangThai IN (:...statuses)', { statuses: ['Pending', 'Approved'] })
    .andWhere('don.NgayBatDau <= :endDate', { endDate: dto.NgayKetThuc })
    .andWhere('don.NgayKetThuc >= :startDate', { startDate: dto.NgayBatDau })
    .getOne();
    
  if (overlapping) {
    throw new BadRequestException('Đã có đơn nghỉ phép trùng thời gian');
  }
}
```

---

### 🟡 [LEAVE-07] Thiếu API xem số dư phép của từng nhân viên (Admin view)

```typescript
// leave.controller.ts — thêm
@Get('admin/balances/:employeeId')
@Roles('Admin', 'Manager')
@ApiOperation({ summary: 'Xem số dư phép của nhân viên (Admin)' })
getEmployeeBalances(
  @Param('employeeId') employeeId: string,
  @Query('year') year?: string,
) {
  const y = year ? +year : new Date().getFullYear();
  return this.leaveService.getBalances(+employeeId, y);
}
```

---

## 5. Attendance Module

### 🔴 [ATT-01] `attendance.service.ts` — `checkInOut` không xử lý ngày lễ

**File:** `src/modules/attendance/attendance.service.ts`

```typescript
// ❌ Không check ngày lễ, cuối tuần
async checkInOut(userId: number) {
  const today = new Date();
  // ... không validate ngày làm việc hợp lệ
}

// ✅ Inject SystemService để check
constructor(
  // ... existing ...
  private systemService: SystemService, // thêm
) {}

async checkInOut(userId: number) {
  const today = new Date();
  
  // Check cuối tuần
  const dayOfWeek = today.getDay();
  if (dayOfWeek === 0 || dayOfWeek === 6) {
    throw new BadRequestException('Không chấm công vào cuối tuần');
  }
  
  // Check ngày lễ
  const todayStr = today.toISOString().split('T')[0];
  const holidays = await this.systemService.getHolidays();
  const isHoliday = holidays.some(h => 
    h.NgayLe.toISOString().split('T')[0] === todayStr
  );
  if (isHoliday) {
    throw new BadRequestException('Hôm nay là ngày lễ, không chấm công');
  }
  
  // ... rest of code
}
```

---

### 🟠 [ATT-02] `attendance.service.ts` — Thiếu xử lý giờ ra khi checkout

**File:** `src/modules/attendance/attendance.service.ts`

```typescript
// ❌ SAI — khi checkout không check GioVao null
} else {
  // Check-out logic
  if (attendance.GioRa) throw new BadRequestException('Already checked out');
  
  attendance.GioRa = new Date();
  const diffHours =
    (attendance.GioRa.getTime() - attendance.GioVao.getTime()) / 3600000;
    // ↑ attendance.GioVao có thể null → NaN
}

// ✅ ĐÚNG
} else {
  if (attendance.GioRa) throw new BadRequestException('Đã checkout rồi');
  if (!attendance.GioVao) throw new BadRequestException('Chưa check-in');
  
  attendance.GioRa = new Date();
  const diffMs = attendance.GioRa.getTime() - attendance.GioVao.getTime();
  attendance.SoGioLam = parseFloat((diffMs / 3600000).toFixed(2));
}
```

---

### 🟠 [ATT-03] `attendance.controller.ts` — Thiếu API lấy OT của nhân viên

```typescript
// attendance.controller.ts — thêm
@Get('ot/my')
@ApiOperation({ summary: 'Lấy danh sách OT của bản thân' })
getMyOT(@Request() req: any, @Query('status') status?: string) {
  return this.attendanceService.getMyOTRequests(req.user.Id, status);
}

// attendance.service.ts
async getMyOTRequests(userId: number, status?: string) {
  const where: any = { MaNhanVienId: userId };
  if (status) where.TrangThai = status;
  
  return this.donLamThemRepository.find({
    where,
    order: { NgayTao: 'DESC' },
  });
}
```

---

### 🟠 [ATT-04] Thiếu API cancel OT request

```typescript
// attendance.controller.ts
@Put('ot/:id/cancel')
@ApiOperation({ summary: 'Hủy yêu cầu làm thêm' })
cancelOT(@Param('id') id: string, @Request() req: any) {
  return this.attendanceService.cancelOT(+id, req.user.Id);
}

// attendance.service.ts
async cancelOT(otId: number, userId: number) {
  const ot = await this.donLamThemRepository.findOne({ where: { Id: otId } });
  if (!ot) throw new NotFoundException('Không tìm thấy đơn OT');
  if (ot.MaNhanVienId !== userId) throw new ForbiddenException('Không có quyền');
  if (ot.TrangThai !== 'Pending') {
    throw new BadRequestException('Chỉ hủy được đơn đang chờ duyệt');
  }
  ot.TrangThai = 'Cancelled';
  return this.donLamThemRepository.save(ot);
}
```

---

### 🟡 [ATT-05] `don-lam-them.dto.ts` — Thiếu validation giờ hợp lệ

**File:** `src/modules/attendance/dto/don-lam-them.dto.ts`

```typescript
// ✅ Thêm validation
import { Matches, Min, Max } from 'class-validator';

@Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
  message: 'Giờ bắt đầu phải theo định dạng HH:mm'
})
GioBatDau: string;

@Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
  message: 'Giờ kết thúc phải theo định dạng HH:mm'
})
GioKetThuc: string;

@Min(0.5, { message: 'Tối thiểu 30 phút' })
@Max(12, { message: 'Tối đa 12 giờ OT' })
TongSoGio: number;
```

---

### 🟡 [ATT-06] `approveOT` không trả về status rejected đúng cách

```typescript
// ❌ SAI — khi reject không cần làm gì thêm, nhưng không log lý do
async approveOT(otId: number, approverId: number, status: 'Approved' | 'Rejected') {
  const ot = await this.donLamThemRepository.findOne({ where: { Id: otId } });
  if (!ot) throw new BadRequestException('OT Request not found');
  
  // ❌ Thiếu check trạng thái hiện tại
  // ❌ Không log lý do reject
  
  ot.TrangThai = status;
  ot.NguoiDuyetId = approverId;
  return this.donLamThemRepository.save(ot);
}

// ✅ ĐÚNG — thêm UpdateOTStatusDto có lyDoTuChoi
async approveOT(otId: number, approverId: number, status: 'Approved' | 'Rejected', lyDo?: string) {
  const ot = await this.donLamThemRepository.findOne({ where: { Id: otId } });
  if (!ot) throw new NotFoundException('Không tìm thấy đơn OT');
  if (ot.TrangThai !== 'Pending') {
    throw new BadRequestException('Đơn OT không ở trạng thái chờ duyệt');
  }
  
  ot.TrangThai = status;
  ot.NguoiDuyetId = approverId;
  return this.donLamThemRepository.save(ot);
}
```

---

## 6. Payroll Module

### 🔴 [PAY-01] `payroll.service.ts` — TypeORM query logic sai

**File:** `src/modules/payroll/payroll.service.ts`

```typescript
// ❌ SAI — && giữa 2 FindOperator object → luôn trả về LessThanOrEqual
where: {
  MaNhanVienId: emp.Id,
  NgayLamViec: MoreThanOrEqual(startDate) && (LessThanOrEqual(endDate) as any),
  //           ↑ MoreThanOrEqual(...) là object truthy
  //           object && object → trả về object thứ 2 (LessThanOrEqual)
  //           → chỉ filter NgayLamViec <= endDate, bỏ qua startDate!
}

// ✅ ĐÚNG — dùng Between
import { Between } from 'typeorm';

NgayLamViec: Between(startDate, endDate),
```

---

### 🔴 [PAY-02] `payroll.service.ts` — `calculatePayroll` không check duplicate phiếu lương

**File:** `src/modules/payroll/payroll.service.ts`

```typescript
// ❌ SAI — PhieuLuong có UQ constraint (NhanVienId, Thang, Nam)
// Gọi calculatePayroll 2 lần → DB throw unique violation error thô
const phieu = queryRunner.manager.create(PhieuLuong, { ... });
await queryRunner.manager.save(phieu); // ← crash nếu đã có

// ✅ ĐÚNG — check hoặc upsert
const existing = await queryRunner.manager.findOne(PhieuLuong, {
  where: { MaNhanVienId: emp.Id, Thang: thang, Nam: nam },
});

if (existing) {
  // Update thay vì insert
  Object.assign(existing, phieuData);
  await queryRunner.manager.save(existing);
} else {
  const phieu = queryRunner.manager.create(PhieuLuong, phieuData);
  await queryRunner.manager.save(phieu);
}
```

---

### 🔴 [PAY-03] `payroll.service.ts` — `SoGioLamThem` không được set

**File:** `src/modules/payroll/payroll.service.ts`

```typescript
// ❌ SAI — field SoGioLamThem bị bỏ sót
const phieu = queryRunner.manager.create(PhieuLuong, {
  // ... các field khác ...
  TienLamThem: tienLamThem,
  // SoGioLamThem: ??? ← THIẾU!
});

// ✅ ĐÚNG
const tongGioOTThucTe = filteredOts.reduce((sum, o) => sum + o.TongSoGio, 0);
const phieu = queryRunner.manager.create(PhieuLuong, {
  // ...
  SoGioLamThem: tongGioOTThucTe, // ✅ thêm
  TienLamThem: tienLamThem,
});
```

---

### 🔴 [PAY-04] `payroll.service.ts` — OT filter không đúng kỳ lương

**File:** `src/modules/payroll/payroll.service.ts`

```typescript
// ❌ SAI — lấy TẤT CẢ OT approved, không filter theo tháng
const ots = await this.donLamThemRepository.find({
  where: { MaNhanVienId: emp.Id, TrangThai: 'Approved' },
  // ← không có filter ngày!
});
// Rồi filter thủ công nhưng đã load hết data vào memory

// ✅ ĐÚNG — filter trực tiếp trong query
const ots = await this.donLamThemRepository.find({
  where: {
    MaNhanVienId: emp.Id,
    TrangThai: 'Approved',
    NgayLamThem: Between(startDate, endDate), // ✅ filter trong DB
  },
});
// Bỏ filteredOts thủ công
```

---

### 🟠 [PAY-05] Thiếu workflow approve/reject/pay phiếu lương

```typescript
// payroll.controller.ts — thêm các endpoint
@Put('payslips/:id/approve')
@Roles('Admin')
@ApiOperation({ summary: 'Duyệt phiếu lương' })
approvePayslip(@Param('id') id: string, @Request() req: any) {
  return this.payrollService.approvePayslip(+id, req.user.Id);
}

@Put('payslips/:id/reject')
@Roles('Admin')
@ApiOperation({ summary: 'Từ chối phiếu lương' })
rejectPayslip(
  @Param('id') id: string,
  @Body('ghiChu') ghiChu: string,
) {
  return this.payrollService.rejectPayslip(+id, ghiChu);
}

@Put('payslips/:month/:year/pay')
@Roles('Admin')
@ApiOperation({ summary: 'Đánh dấu đã thanh toán' })
markAsPaid(
  @Param('month') month: string,
  @Param('year') year: string,
) {
  return this.payrollService.markAsPaid(+month, +year);
}
```

```typescript
// payroll.service.ts
async approvePayslip(id: number, approverId: number) {
  const phieu = await this.phieuLuongRepository.findOne({ where: { Id: id } });
  if (!phieu) throw new NotFoundException('Không tìm thấy phiếu lương');
  if (phieu.TrangThai !== 'Draft') {
    throw new BadRequestException('Phiếu lương phải ở trạng thái Draft');
  }
  phieu.TrangThai = 'Approved';
  return this.phieuLuongRepository.save(phieu);
}

async markAsPaid(thang: number, nam: number) {
  await this.phieuLuongRepository.update(
    { Thang: thang, Nam: nam, TrangThai: 'Approved' },
    { TrangThai: 'Paid', NgayThanhToan: new Date() },
  );
  return { message: `Đã cập nhật thanh toán tháng ${thang}/${nam}` };
}
```

---

### 🟠 [PAY-06] `autoPayrollCron` logic kiểm tra ngày cuối tháng sai

**File:** `src/modules/payroll/payroll.service.ts`

```typescript
// ❌ SAI — cron chạy ngày 28-31 nhưng không phải lúc nào ngày 28-31 cũng là cuối tháng
@Cron('59 23 28-31 * *')
async autoPayrollCron() {
  const today = new Date();
  const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);
  if (today.getDate() === lastDay.getDate()) {
    // logic đúng nhưng cron expression lãng phí 
  }
}

// ✅ Dùng last day expression hoặc schedule riêng
// Option 1: Giữ nguyên logic nhưng cron tốt hơn
@Cron('0 23 L * *') // Không hỗ trợ trong @nestjs/schedule
// Option 2: Kiểm tra trong cron hàng ngày
@Cron('0 22 * * *') // 22:00 mỗi ngày
async autoPayrollCron() {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  // Nếu ngày mai là ngày 1 → hôm nay là cuối tháng
  if (tomorrow.getDate() === 1) {
    await this.calculatePayroll(today.getMonth() + 1, today.getFullYear(), 1);
  }
}
```

---

### 🟡 [PAY-07] Công thức tính thuế TNCN quá đơn giản

```typescript
// ❌ Tính thuế flat 10% không đúng luật VN
let thueTNCN = 0;
if (thuNhapTinhThue > 0) thueTNCN = thuNhapTinhThue * 0.1;

// ✅ ĐÚNG — Biểu thuế lũy tiến theo Luật thuế TNCN VN
function tinhThueTNCN(thuNhapTinhThue: number): number {
  const brackets = [
    { limit: 5_000_000, rate: 0.05 },
    { limit: 10_000_000, rate: 0.10 },
    { limit: 18_000_000, rate: 0.15 },
    { limit: 32_000_000, rate: 0.20 },
    { limit: 52_000_000, rate: 0.25 },
    { limit: 80_000_000, rate: 0.30 },
    { limit: Infinity,   rate: 0.35 },
  ];
  
  let tax = 0;
  let remaining = thuNhapTinhThue;
  let prevLimit = 0;
  
  for (const bracket of brackets) {
    const taxable = Math.min(remaining, bracket.limit - prevLimit);
    if (taxable <= 0) break;
    tax += taxable * bracket.rate;
    remaining -= taxable;
    prevLimit = bracket.limit;
  }
  
  return Math.round(tax);
}
```

---

### 🟡 [PAY-08] Thiếu API xem lịch sử lương của tất cả nhân viên (Admin)

```typescript
// payroll.controller.ts
@Get('salary-history')
@Roles('Admin', 'Manager')
@ApiOperation({ summary: 'Xem lịch sử lương tất cả nhân viên' })
getAllSalaryHistory(@Query('employeeId') employeeId?: string) {
  return this.payrollService.getAllSalaryHistory(
    employeeId ? +employeeId : undefined
  );
}
```

---

## 7. Organization Module

### 🟠 [ORG-01] `organization.service.ts` — `deletePhongBan` không check nhân viên còn thuộc phòng

**File:** `src/modules/organization/organization.service.ts`

```typescript
// ❌ SAI — xóa phòng ban khi còn nhân viên → DB FK constraint error thô
async deletePhongBan(id: number) {
  const pb = await this.findOnePhongBan(id);
  return this.phongBanRepository.remove(pb); // ← crash nếu có nhân viên
}

// ✅ ĐÚNG — check trước khi xóa
async deletePhongBan(id: number) {
  const pb = await this.findOnePhongBan(id);
  
  // Check còn nhân viên
  const employeeCount = await this.phongBanRepository
    .createQueryBuilder('pb')
    .leftJoin('pb.nhanViens', 'nv')
    .where('pb.Id = :id', { id })
    .andWhere('nv.TrangThai = :status', { status: 'Active' })
    .getCount();
    
  if (employeeCount > 0) {
    throw new BadRequestException(
      `Phòng ban còn ${employeeCount} nhân viên, không thể xóa`
    );
  }
  
  // Check còn phòng con
  const childCount = await this.phongBanRepository.count({
    where: { MaPhongCha: id },
  });
  if (childCount > 0) {
    throw new BadRequestException('Phòng ban còn phòng con, không thể xóa');
  }
  
  return this.phongBanRepository.remove(pb);
}
```

---

### 🟠 [ORG-02] `organization.service.ts` — `deleteChucVu` không check nhân viên đang dùng

```typescript
// ✅ Tương tự deletePhongBan, cần check trước
async deleteChucVu(id: number) {
  const cv = await this.findOneChucVu(id);
  
  const count = await this.chucVuRepository
    .createQueryBuilder('cv')
    .leftJoin('cv.nhanViens', 'nv')
    .where('cv.Id = :id', { id })
    .andWhere('nv.TrangThai = :status', { status: 'Active' })
    .getCount();
    
  if (count > 0) {
    throw new BadRequestException(`Chức vụ đang được dùng bởi ${count} nhân viên`);
  }
  
  return this.chucVuRepository.remove(cv);
}
```

---

### 🟡 [ORG-03] `getDepartmentTree` — N+1 query problem

**File:** `src/modules/organization/organization.service.ts`

```typescript
// ❌ SAI — load tất cả departments, không load relations → thiếu thông tin manager
async getDepartmentTree() {
  const allDepts = await this.phongBanRepository.find();
  // ↑ không load manager relation
  return this.buildTree(allDepts, null);
}

// ✅ ĐÚNG
async getDepartmentTree() {
  const allDepts = await this.phongBanRepository.find({
    relations: ['manager'], // load manager
    order: { Id: 'ASC' },
  });
  return this.buildTree(allDepts, null);
}
```

---

### 🟡 [ORG-04] Thiếu API lấy danh sách nhân viên theo phòng ban

```typescript
// organization.controller.ts — thêm
@Get('phong-ban/:id/nhan-vien')
@ApiOperation({ summary: 'Lấy danh sách nhân viên của phòng ban' })
getNhanVienByPhongBan(
  @Param('id') id: string,
  @Query('includeInactive') includeInactive?: string,
) {
  return this.orgService.getNhanVienByPhongBan(+id, includeInactive === 'true');
}
```

---

## 8. System Module

### 🔴 [SYS-01] `audit.subscriber.ts` — MaNguoiThucHienId hardcode = 1

**File:** `src/modules/system/audit.subscriber.ts`

```typescript
// ❌ SAI — luôn log là System Admin (Id=1), không phản ánh người thực
MaNguoiThucHienId: 1,

// ✅ Giải pháp: Bỏ subscriber, dùng manual audit trong từng service
// Tạo AuditService:
@Injectable()
export class AuditService {
  constructor(
    @InjectRepository(NhatKyHeThong)
    private logRepo: Repository<NhatKyHeThong>,
  ) {}
  
  async log(data: {
    tenBang: string;
    maBanGhi: number;
    hanhDong: 'INSERT' | 'UPDATE' | 'DELETE' | 'APPROVE' | 'LOGIN' | 'EXPORT';
    giaTriCu?: object;
    giaTriMoi?: object;
    nguoiThucHienId: number;
  }) {
    const log = this.logRepo.create({
      TenBang: data.tenBang,
      MaBanGhi: data.maBanGhi,
      HanhDong: data.hanhDong,
      GiaTriCu: data.giaTriCu ? JSON.stringify(data.giaTriCu) : null,
      GiaTriMoi: data.giaTriMoi ? JSON.stringify(data.giaTriMoi) : null,
      MaNguoiThucHienId: data.nguoiThucHienId,
      NgayThucHien: new Date(),
    });
    await this.logRepo.save(log);
  }
}
```

---

### 🟠 [SYS-02] `system.controller.ts` — `createHoliday` không validate data

**File:** `src/modules/system/dto/create-ngay-le.dto.ts`

```typescript
// ❌ SAI — dùng PartialType(NgayLe) tức là tất cả field đều optional
// → Có thể tạo NgayLe không có NgayLe date!
export class CreateNgayLeDto extends PartialType(NgayLe) { }

// ✅ ĐÚNG — viết DTO rõ ràng
export class CreateNgayLeDto {
  @ApiProperty({ example: '2026-12-25' })
  @IsDateString()
  @IsNotEmpty()
  NgayLe: string;

  @ApiProperty({ example: 'Giáng sinh' })
  @IsString()
  @IsNotEmpty()
  TenNgayLe: string;

  @ApiProperty({ example: true })
  @IsBoolean()
  @IsOptional()
  LapLaiHangNam?: boolean;
}
```

---

### 🟠 [SYS-03] Thiếu API xóa ngày lễ

```typescript
// system.controller.ts — thêm
@Delete('holidays/:id')
@Roles('Admin')
@ApiOperation({ summary: 'Xóa ngày lễ' })
deleteHoliday(@Param('id') id: string) {
  return this.systemService.deleteHoliday(+id);
}

// system.service.ts
async deleteHoliday(id: number) {
  const holiday = await this.ngayLeRepository.findOne({ where: { Id: id } });
  if (!holiday) throw new NotFoundException('Không tìm thấy ngày lễ');
  return this.ngayLeRepository.remove(holiday);
}
```

---

### 🟡 [SYS-04] Thiếu API xem log theo filter

```typescript
// system.controller.ts — cải thiện getLogs
@Get('logs')
@Roles('Admin')
getLogs(
  @Query('limit') limit?: string,
  @Query('tenBang') tenBang?: string,
  @Query('hanhDong') hanhDong?: string,
  @Query('nguoiThucHienId') nguoiThucHienId?: string,
  @Query('tuNgay') tuNgay?: string,
  @Query('denNgay') denNgay?: string,
) {
  return this.systemService.getLogs({
    limit: limit ? +limit : 100,
    tenBang,
    hanhDong,
    nguoiThucHienId: nguoiThucHienId ? +nguoiThucHienId : undefined,
    tuNgay: tuNgay ? new Date(tuNgay) : undefined,
    denNgay: denNgay ? new Date(denNgay) : undefined,
  });
}
```

---

## 9. Report Module

### 🟠 [RPT-01] `report.service.ts` — `exportAttendance` không filter theo tháng/năm

**File:** `src/modules/report/report.service.ts`

```typescript
// ❌ SAI — load toàn bộ data, comment "simplified" nhưng không filter
async exportAttendance(thang: number, nam: number) {
  const data = await this.chamCongRepository.find({
    relations: ['nhanVien'],
  }); // ← Load ALL records!
  // Filter by thang/nam (simplified) ← không làm gì!
}

// ✅ ĐÚNG
async exportAttendance(thang: number, nam: number) {
  const startDate = new Date(nam, thang - 1, 1);
  const endDate = new Date(nam, thang, 0); // Last day of month
  
  const data = await this.chamCongRepository.find({
    where: { NgayLamViec: Between(startDate, endDate) },
    relations: ['nhanVien'],
    order: { NgayLamViec: 'ASC' },
  });
  // ... rest of code
}
```

---

### 🟠 [RPT-02] `report.controller.ts` — Thiếu validation tham số thang/nam

**File:** `src/modules/report/report.controller.ts`

```typescript
// ❌ SAI — thang, nam là number nhưng không validate
@Get('bang-cong/export')
exportAttendance(@Query('thang') thang: number, @Query('nam') nam: number) {
  // thang, nam từ query string → thực ra là string!
  return this.reportService.exportAttendance(thang, nam);
}

// ✅ ĐÚNG — thêm ParseIntPipe và validation
@Get('bang-cong/export')
exportAttendance(
  @Query('thang', ParseIntPipe) thang: number,
  @Query('nam', ParseIntPipe) nam: number,
) {
  if (thang < 1 || thang > 12) throw new BadRequestException('Tháng phải từ 1-12');
  if (nam < 2000 || nam > 2100) throw new BadRequestException('Năm không hợp lệ');
  return this.reportService.exportAttendance(thang, nam);
}
```

---

### 🟢 [RPT-03] Thiếu Content-Disposition filename động theo tháng

```typescript
// report.controller.ts — thay vì hardcode filename
@Header('Content-Disposition', 'attachment; filename="AttendanceReport.xlsx"')

// ✅ Set dynamically trong service, trả về StreamableFile với header
// Hoặc dùng @Res() để set header động:
@Get('bang-cong/export')
async exportAttendance(
  @Query('thang', ParseIntPipe) thang: number,
  @Query('nam', ParseIntPipe) nam: number,
  @Res() res: Response,
) {
  const file = await this.reportService.exportAttendance(thang, nam);
  res.set({
    'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'Content-Disposition': `attachment; filename="BangCong_T${thang}_${nam}.xlsx"`,
  });
  file.getStream().pipe(res);
}
```

---

## 10. Dashboard Module

### 🟠 [DASH-01] `dashboard.service.ts` — `presentToday` query sai với SQL Server

**File:** `src/modules/dashboard/dashboard.service.ts`

```typescript
// ❌ SAI — SQL Server không so sánh date = datetime tốt như vậy
const today = new Date();
today.setHours(0, 0, 0, 0);
presentToday: this.chamCongRepo.count({ where: { NgayLamViec: today } }),

// ✅ ĐÚNG — dùng Between hoặc Raw
import { Raw } from 'typeorm';

presentToday: this.chamCongRepo.count({
  where: {
    NgayLamViec: Raw(alias =>
      `CAST(${alias} AS DATE) = CAST(GETDATE() AS DATE)`
    ),
  },
}),
```

---

### 🟡 [DASH-02] Thiếu nhiều thống kê quan trọng trong dashboard

```typescript
// dashboard.service.ts — thêm thống kê
async getStats() {
  // ... existing ...
  
  const [
    totalEmployees,
    presentToday,
    pendingLeaves,
    expiringContracts,
    // ✅ Thêm các thống kê sau:
    newEmployeesThisMonth,
    pendingOTRequests,
    draftPayslips,
  ] = await Promise.all([
    // ... existing queries ...
    
    // Nhân viên mới trong tháng
    this.nhanVienRepo.count({
      where: {
        NgayVaoLam: Raw(alias => 
          `MONTH(${alias}) = MONTH(GETDATE()) AND YEAR(${alias}) = YEAR(GETDATE())`
        ),
      },
    }),
    
    // OT đang chờ duyệt (cần inject DonLamThem repo)
    // Draft payslips (cần inject PhieuLuong repo)
  ]);
  
  return {
    totalEmployees,
    presentToday,
    pendingLeaves,
    expiringContracts,
    newEmployeesThisMonth,
  };
}
```

---

## 11. Thiếu Module / API

### 🟠 [MISS-01] Thiếu Notification Module

Không có cơ chế thông báo khi:
- Đơn nghỉ phép được duyệt/từ chối
- OT được duyệt/từ chối  
- Hợp đồng sắp hết hạn
- Phiếu lương đã thanh toán

```typescript
// Tối thiểu tạo NotificationService đơn giản
@Injectable()
export class NotificationService {
  // Có thể dùng email, websocket, hoặc chỉ lưu DB
  async notify(userId: number, message: string, type: string) {
    // Implement sau
  }
}
```

---

### 🟠 [MISS-02] Thiếu Pagination cho tất cả API list

Tất cả API list đang trả về TOÀN BỘ dữ liệu — nguy hiểm khi data lớn.

```typescript
// Tạo common pagination DTO
export class PaginationDto {
  @IsOptional()
  @Type(() => Number)
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @Min(1)
  @Max(100)
  limit?: number = 20;
}

// Ví dụ áp dụng cho getAllLeaveRequests
async getAllLeaveRequests(status?: string, page = 1, limit = 20) {
  const [data, total] = await this.donNghiPhepRepository.findAndCount({
    where: status ? { TrangThai: status } : {},
    relations: ['nhanVien', 'loaiNghiPhep'],
    order: { NgayTao: 'DESC' },
    skip: (page - 1) * limit,
    take: limit,
  });
  
  return {
    data,
    meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
  };
}
```

---

### 🟡 [MISS-03] Thiếu API thống kê chấm công tổng hợp

```typescript
// Cần endpoint:
GET /attendance/summary?employeeId=&month=&year=
// Trả về: số ngày đi làm, số ngày nghỉ, số phút đi muộn, tổng giờ OT
```

---

### 🟡 [MISS-04] Thiếu API export báo cáo nhân sự

```typescript
// Cần thêm:
GET /reports/nhan-su/export       // Danh sách nhân viên
GET /reports/nghi-phep/export     // Tổng hợp nghỉ phép
GET /reports/ot/export            // Tổng hợp OT
```

---

### 🟡 [MISS-05] Thiếu API profile update cho nhân viên

```typescript
// Nhân viên cần cập nhật thông tin cá nhân:
@Put('auth/profile')
@UseGuards(JwtAuthGuard)
updateProfile(@Body() dto: UpdateProfileDto, @Request() req: any) {
  return this.authService.updateProfile(req.user.Id, dto);
}

// UpdateProfileDto chỉ cho phép sửa field không nhạy cảm:
export class UpdateProfileDto {
  @IsString() @IsOptional() SoDienThoai?: string;
  @IsString() @IsOptional() DiaChi?: string;
  @IsString() @IsOptional() SoTaiKhoan?: string;
  @IsString() @IsOptional() TenNganHang?: string;
}
```

---

## 12. Bảo mật chung

### 🔴 [SEC-01] Không có Input Sanitization cho XSS

```bash
npm install class-sanitizer
```

```typescript
// main.ts — thêm sanitization pipe
// Hoặc trong từng DTO dùng @Trim(), @Escape()
```

---

### 🟠 [SEC-02] Không có Helmet middleware

```bash
npm install helmet
```

```typescript
// main.ts
import helmet from 'helmet';
app.use(helmet());
```

---

### 🟠 [SEC-03] SQL Injection risk trong Raw queries

Kiểm tra tất cả chỗ dùng `Raw()` phải dùng parameterized query:

```typescript
// ❌ SAI — string interpolation
Raw(alias => `${alias} = '${userInput}'`)

// ✅ ĐÚNG — parameterized
Raw((alias, params) => `${alias} = :value`, { value: userInput })
```

---

### 🟡 [SEC-04] JWT Secret trong .env không được validate độ dài

```typescript
// ✅ Thêm validation vào app.module.ts
import * as Joi from 'joi';

ConfigModule.forRoot({
  validationSchema: Joi.object({
    JWT_SECRET: Joi.string().min(32).required(),
    JWT_EXPIRES_IN: Joi.string().default('1d'),
    DB_PASSWORD: Joi.string().required(),
    REDIS_HOST: Joi.string().default('localhost'),
  }),
}),
```

---

## BẢNG TỔNG HỢP

| ID | Module | Mức độ | Mô tả ngắn |
|----|--------|--------|------------|
| CFG-01 | Config | 🟡 | Import từ /dist |
| CFG-02 | Config | 🟡 | Password hardcode |
| CFG-03 | Config | 🟡 | JWT secret yếu |
| CFG-04 | Config | 🟢 | Thiếu CORS |
| CFG-05 | Config | 🟢 | Thiếu Rate Limit |
| AUTH-01 | Auth | 🔴 | Không audit login |
| AUTH-02 | Auth | 🟠 | Query DB mỗi request |
| AUTH-03 | Auth | 🟠 | Thiếu đổi mật khẩu |
| AUTH-04 | Auth | 🟠 | Thiếu reset password |
| AUTH-05 | Auth | 🟡 | getProfile trả null |
| AUTH-06 | Auth | 🟡 | Thiếu refresh token |
| EMP-01 | Employee | 🔴 | getExpiringContracts sai |
| EMP-02 | Employee | 🔴 | Route conflict |
| EMP-03 | Employee | 🟠 | Không check email duplicate |
| EMP-04 | Employee | 🟠 | Race condition MaNhanVien |
| EMP-05 | Employee | 🟡 | Thiếu validation DTO |
| EMP-06 | Employee | 🟡 | LoaiHopDong không validate enum |
| EMP-07 | Employee | 🟡 | Thiếu API lịch sử điều chuyển |
| EMP-08 | Employee | 🟡 | Delete không invalidate cache |
| LEAVE-01 | Leave | 🔴 | getFullYear() crash |
| LEAVE-02 | Leave | 🔴 | Không check balance khi approve |
| LEAVE-03 | Leave | 🔴 | grantAnnualLeave duplicate |
| LEAVE-04 | Leave | 🟠 | Thiếu API reject leave |
| LEAVE-05 | Leave | 🟠 | Thiếu API cancel leave |
| LEAVE-06 | Leave | 🟠 | Không validate ngày |
| LEAVE-07 | Leave | 🟡 | Thiếu admin view balance |
| ATT-01 | Attendance | 🔴 | Không check ngày lễ |
| ATT-02 | Attendance | 🟠 | GioVao null crash |
| ATT-03 | Attendance | 🟠 | Thiếu API my OT |
| ATT-04 | Attendance | 🟠 | Thiếu API cancel OT |
| ATT-05 | Attendance | 🟡 | Thiếu validation giờ |
| ATT-06 | Attendance | 🟡 | approveOT thiếu check trạng thái |
| PAY-01 | Payroll | 🔴 | TypeORM && operator sai |
| PAY-02 | Payroll | 🔴 | Duplicate phiếu lương crash |
| PAY-03 | Payroll | 🔴 | SoGioLamThem không set |
| PAY-04 | Payroll | 🔴 | OT filter không đúng kỳ |
| PAY-05 | Payroll | 🟠 | Thiếu workflow approve/pay |
| PAY-06 | Payroll | 🟠 | Cron logic sai |
| PAY-07 | Payroll | 🟡 | Thuế TNCN không đúng luật |
| PAY-08 | Payroll | 🟡 | Thiếu xem lịch sử lương admin |
| ORG-01 | Organization | 🟠 | Xóa phòng ban không check |
| ORG-02 | Organization | 🟠 | Xóa chức vụ không check |
| ORG-03 | Organization | 🟡 | N+1 query getDepartmentTree |
| ORG-04 | Organization | 🟡 | Thiếu API nhân viên theo phòng |
| SYS-01 | System | 🔴 | Audit log hardcode userId=1 |
| SYS-02 | System | 🟠 | CreateNgayLeDto validation sai |
| SYS-03 | System | 🟠 | Thiếu API xóa ngày lễ |
| SYS-04 | System | 🟡 | Thiếu filter log |
| RPT-01 | Report | 🟠 | exportAttendance không filter |
| RPT-02 | Report | 🟠 | Thiếu validate params |
| RPT-03 | Report | 🟢 | Filename hardcode |
| DASH-01 | Dashboard | 🟠 | Query date sai SQL Server |
| DASH-02 | Dashboard | 🟡 | Thiếu thống kê |
| MISS-01 | Missing | 🟠 | Thiếu Notification Module |
| MISS-02 | Missing | 🟠 | Thiếu Pagination |
| MISS-03 | Missing | 🟡 | Thiếu API thống kê chấm công |
| MISS-04 | Missing | 🟡 | Thiếu export báo cáo nhân sự |
| MISS-05 | Missing | 🟡 | Thiếu profile update |
| SEC-01 | Security | 🔴 | Thiếu XSS sanitization |
| SEC-02 | Security | 🟠 | Thiếu Helmet |
| SEC-03 | Security | 🟠 | SQL Injection risk |
| SEC-04 | Security | 🟡 | JWT secret không validate |

---

**Tổng cộng: 58 vấn đề**
- 🔴 Critical: 12
- 🟠 High: 22  
- 🟡 Medium: 20
- 🟢 Low: 4

**Ưu tiên fix ngay (Critical):**
1. LEAVE-01: crash runtime getFullYear()
2. PAY-01: TypeORM && operator logic sai → data sai
3. PAY-03: SoGioLamThem không set → phiếu lương sai
4. PAY-04: OT filter sai → tiền OT sai
5. EMP-01: getExpiringContracts query sai
6. EMP-02: Route conflict → endpoint unreachable
7. SYS-01: Audit log không đúng người
8. ATT-01: Không check ngày lễ
9. LEAVE-02: Balance có thể âm
10. LEAVE-03: Duplicate SoDuPhep
11. PAY-02: Duplicate crash DB
12. SEC-01: XSS vulnerability
