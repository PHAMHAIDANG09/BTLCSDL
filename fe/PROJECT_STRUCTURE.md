# NextHR - Hệ Thống Quản Trị Nhân Sự
## Cấu Trúc Dự Án

---

## 📁 BACKEND (NestJS) - Cấu Trúc Hiện Tại

```
BTLCSDL/
├── src/
│   ├── main.ts                              # Entry point ứng dụng
│   ├── app.module.ts                        # Root module
│   ├── app.controller.ts                    # Root controller
│   ├── app.service.ts                       # Root service
│   ├── app.controller.spec.ts               # Unit test
│   │
│   ├── common/                              # Shared utilities
│   │   └── filters/
│   │       └── all-exceptions.filter.ts     # Global exception handler
│   │
│   ├── config/                              # Configuration
│   │   ├── database.config.ts               # SQL Server config
│   │   ├── redis.config.ts                  # Redis config
│   │   └── control-api.config.ts            # External API config
│   │
│   └── modules/                             # Feature modules
│       ├── auth/                            # Authentication & Authorization
│       │   ├── auth.controller.ts
│       │   ├── auth.module.ts
│       │   ├── auth.service.ts
│       │   ├── decorators/
│       │   │   └── roles.decorator.ts
│       │   ├── dto/
│       │   │   └── login.dto.ts
│       │   ├── entities/
│       │   │   ├── nhan-vien.entity.ts
│       │   │   └── vai-tro.entity.ts
│       │   ├── guards/
│       │   │   ├── jwt-auth.guard.ts
│       │   │   └── roles.guard.ts
│       │   └── strategies/
│       │       └── jwt.strategy.ts
│       │
│       ├── dashboard/                      # Dashboard
│       │   ├── dashboard.controller.ts
│       │   ├── dashboard.module.ts
│       │   └── dashboard.service.ts
│       │
│       ├── employee/                       # Quản lý nhân viên
│       │   ├── employee.controller.ts
│       │   ├── employee.module.ts
│       │   ├── employee.service.ts
│       │   ├── dto/
│       │   │   ├── nhan-vien.dto.ts
│       │   │   ├── hop-dong.dto.ts
│       │   │   └── transfer.dto.ts
│       │   └── entities/
│       │       ├── nhan-vien.entity.ts
│       │       ├── hop-dong.entity.ts
│       │       └── lich-su-dieu-chuyen.entity.ts
│       │
│       ├── attendance/                     # Chấm công
│       │   ├── attendance.controller.ts
│       │   ├── attendance.module.ts
│       │   ├── attendance.service.ts
│       │   ├── dto/
│       │   │   ├── don-lam-them.dto.ts
│       │   │   └── update-ot.dto.ts
│       │   └── entities/
│       │       ├── cham-cong.entity.ts
│       │       └── don-lam-them.entity.ts
│       │
│       ├── leave/                         # Quản lý phép
│       │   ├── leave.controller.ts
│       │   ├── leave.module.ts
│       │   ├── leave.service.ts
│       │   ├── dto/
│       │   │   ├── don-nghi-phep.dto.ts
│       │   │   └── loai-nghi-phep.dto.ts
│       │   └── entities/
│       │       ├── don-nghi-phep.entity.ts
│       │       ├── loai-nghi-phep.entity.ts
│       │       └── so-du-phep.entity.ts
│       │
│       ├── payroll/                       # Tính lương
│       │   ├── payroll.controller.ts
│       │   ├── payroll.module.ts
│       │   ├── payroll.service.ts
│       │   ├── dto/
│       │   └── entities/
│       │
│       ├── report/                        # Báo cáo
│       │   ├── report.controller.ts
│       │   ├── report.module.ts
│       │   └── report.service.ts
│       │
│       ├── organization/                  # Cấu trúc tổ chức
│       │   ├── organization.controller.ts
│       │   ├── organization.module.ts
│       │   ├── organization.service.ts
│       │   ├── dto/
│       │   └── entities/
│       │
│       ├── system/                        # System management
│       │   ├── system.controller.ts
│       │   ├── system.module.ts
│       │   ├── system.service.ts
│       │   ├── audit.subscriber.ts        # Audit log
│       │   ├── dto/
│       │   └── entities/
│       │
│       ├── redis/                         # Redis service
│       │   ├── redis.module.ts
│       │   └── redis.service.ts
│       │
│       └── control-api/                   # External API integration
│           ├── control-api.module.ts
│           └── control-api.service.ts
│
├── init-db/                                # Database initialization
│   └── SchemaNEXTHR.sql                    # SQL Server schema & seed data
│
├── test/                                   # E2E tests
│   ├── app.e2e-spec.ts
│   └── jest-e2e.json
│
├── docker-compose.yml                      # Docker services (SQL Server + Redis)
├── package.json                            # Dependencies
├── tsconfig.json                           # TypeScript config
├── nest-cli.json                           # NestJS CLI config
├── .env                                    # Environment variables
└── README.md                               # Documentation
```

---

## 🔌 API Endpoints (Backend)

### Module Xác thực (Authentication)
```
POST   /xac-thuc/dang-nhap        # Đăng nhập
POST   /xac-thuc/dang-xuat        # Đăng xuất
GET    /xac-thuc/ho-so           # Lấy thông tin user hiện tại (JWT)
POST   /xac-thuc/lam-moi         # Refresh token
```

### Module Nhân viên (Employee)
```
GET    /nhan-vien                 # Danh sách nhân viên
GET    /nhan-vien/:id             # Chi tiết nhân viên
POST   /nhan-vien                 # Thêm nhân viên
PUT    /nhan-vien/:id             # Cập nhật nhân viên
DELETE /nhan-vien/:id             # Xóa nhân viên
POST   /nhan-vien/:id/dieu-chuyen # Điều chuyển công tác
```

### Module Chấm công (Attendance)
```
GET    /cham-cong                 # Danh sách chấm công
POST   /cham-cong                 # Thêm chấm công (Check-in/out)
GET    /cham-cong/:id/tang-ca     # Lấy đơn làm thêm giờ
POST   /cham-cong/:id/tang-ca     # Tạo đơn làm thêm giờ
```

### Module Nghỉ phép (Leave)
```
GET    /nghi-phep/loai            # Danh sách loại phép
POST   /nghi-phep/yeu-cau         # Gửi đơn xin phép
GET    /nghi-phep/danh-sach-yeu-cau # Danh sách đơn phép
PUT    /nghi-phep/yeu-cau/:id     # Cập nhật đơn phép
GET    /nghi-phep/so-du           # Số dư phép cá nhân
```

### Module Bảng điều khiển (Dashboard)
```
GET    /bang-dieu-khien/thong-ke  # Thống kê chung (cards)
GET    /bang-dieu-khien/bieu-do   # Dữ liệu biểu đồ (charts)
GET    /bang-dieu-khien/phan-tich # Phân tích dữ liệu chuyên sâu
```

### Module Lương (Payroll)
```
GET    /luong                     # Danh sách bảng lương
GET    /luong/:id                 # Chi tiết phiếu lương
POST   /luong/tinh-luong          # Tính lương (trigger proc)
```

### Module Phê duyệt (Approval)
```
GET    /phe-duyet/cho-duyet       # Danh sách đơn chờ duyệt
PUT    /phe-duyet/:id/dong-y      # Đồng ý đơn
PUT    /phe-duyet/:id/tu-choi     # Từ chối đơn
```

### Module Báo cáo (Report)
```
GET    /bao-cao/nhan-vien         # Báo cáo nhân sự
GET    /bao-cao/cham-cong         # Báo cáo chấm công
GET    /bao-cao/luong             # Báo cáo lương
```

### Module Tổ chức & Thông báo
```
GET    /co-cau-to-chuc/so-do      # Sơ đồ tổ chức (tree)
GET    /thong-bao                 # Danh sách thông báo
PUT    /thong-bao/:id/da-doc      # Đánh dấu đã đọc
```

---

## 🗄️ Database Schema (SQL Server)

### Các Bảng Chính:
- **NhanVien** - Nhân viên
- **VaiTro** - Vai trò (Admin, Manager, Staff)
- **ChucVu** - Chức vụ
- **ChamCong** - Chấm công
- **DonLamThem** - Đơn làm thêm giờ
- **DonNghiPhep** - Đơn xin phép
- **LoaiNghiPhep** - Loại phép
- **SoDuPhep** - Số dư phép
- **HopDong** - Hợp đồng lao động
- **LichSuDieuChuyen** - Lịch sử điều chuyển

**Kết nối Database:**
- Server: `localhost,1435`
- Username: `sa`
- Password: `Dang@12345`
- Database: `NextHR`

---

## 🎨 Frontend (Next.js + Ant Design + Zustand)

### Stack Công Nghệ:
- **Framework**: Next.js 15 (React)
- **UI Library**: Ant Design 5
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios + Interceptors (JWT)
- **State Management**: Zustand
- **Charts**: Chart.js / Recharts
- **Form**: React Hook Form + Ant Design Form
- **Validation**: Zod
- **Real-time**: Socket.io (nếu cần)

### Cấu Trúc Frontend Chi Tiết:

```
FE/
├── public/
│   ├── images/
│   ├── icons/
│   └── logo.svg
│
├── src/
│   ├── app/
│   │   ├── layout.tsx                       # Root layout
│   │   ├── page.tsx                         # Home redirect
│   │   ├── error.tsx
│   │   └── not-found.tsx
│   │
│   ├── (auth)/
│   │   ├── login/
│   │   │   └── page.tsx                     # Login Page
│   │   ├── logout/
│   │   │   └── page.tsx
│   │   └── layout.tsx
│   │
│   ├── admin/
│   │   ├── layout.tsx                       # Admin Layout (Sidebar + Header)
│   │   │
│   │   ├── dashboard/
│   │   │   ├── page.tsx                     # Dashboard chính (Charts, Stats)
│   │   │   ├── _components/
│   │   │   │   ├── EmployeeChart.tsx        # Biểu đồ cột (Nhân sự/Phòng ban)
│   │   │   │   ├── PayrollChart.tsx         # Biểu đồ đường (Chi phí lương)
│   │   │   │   ├── StatCard.tsx
│   │   │   │   └── QuickStats.tsx
│   │   │   └── page.module.css
│   │   │
│   │   ├── employee/                        # Quản lý nhân viên (/admin/nhan-vien)
│   │   │   ├── page.tsx                     # Danh sách nhân viên (Table)
│   │   │   ├── [id]/
│   │   │   │   ├── page.tsx                 # Chi tiết nhân viên
│   │   │   │   └── edit/
│   │   │   │       └── page.tsx             # Sửa nhân viên (Form)
│   │   │   └── _components/
│   │   │       ├── EmployeeTable.tsx        # Table với Search, Filter
│   │   │       ├── EmployeeForm.tsx         # Form (thêm/sửa)
│   │   │       ├── EmployeeDetail.tsx       # Modal chi tiết
│   │   │       ├── SearchFilter.tsx         # Search & Filter
│   │   │       ├── DeleteConfirm.tsx        # Xác nhận xóa
│   │   │       └── BulkActions.tsx          # Action hàng loạt
│   │   │
│   │   ├── structure/                       # Cơ cấu tổ chức (/admin/co-cau-to-chuc)
│   │   │   ├── page.tsx                     # Sơ đồ tổ chức Visualization
│   │   │   └── _components/
│   │   │       ├── OrgChart.tsx             # Tree View phân cấp
│   │   │       ├── OrgNode.tsx
│   │   │       └── OrgSearch.tsx
│   │   │
│   │   ├── contract/                        # Quản lý hợp đồng (/admin/hop-dong)
│   │   │   └── page.tsx
│   │   │
│   │   ├── attendance/                      # Chấm công (/admin/cham-cong)
│   │   │   ├── page.tsx                     # Theo dõi chấm công toàn công ty
│   │   │   ├── [id]/
│   │   │   │   └── page.tsx                 # Chi tiết chấm công nhân viên
│   │   │   └── _components/
│   │   │       ├── AttendanceTable.tsx      # Table chấm công
│   │   │       ├── LateAlert.tsx            # Cảnh báo đi muộn/về sớm
│   │   │       ├── AttendanceFilter.tsx     # Bộ lọc (ngày, phòng ban)
│   │   │       └── AttendanceStats.tsx      # Thống kê chấm công
│   │   │
│   │   ├── leave/                           # Quản lý nghỉ phép (/admin/nghi-phep)
│   │   │   ├── page.tsx                     # Danh sách đơn phép cần duyệt
│   │   │   └── _components/
│   │   │       ├── LeaveApprovalTable.tsx
│   │   │       └── LeaveActionButtons.tsx
│   │   │
│   │   ├── overtime/                        # Làm thêm giờ (/admin/lam-them-gio)
│   │   │   └── page.tsx
│   │   │
│   │   ├── payroll/                         # Quản lý lương (/admin/luong)
│   │   │   ├── page.tsx                     # Danh sách bảng lương
│   │   │   ├── [id]/
│   │   │   │   └── page.tsx                 # Chi tiết bảng lương
│   │   │   └── _components/
│   │   │       ├── PayrollTable.tsx         # Table kết quả tính lương
│   │   │       ├── PayrollRunBtn.tsx        # Nút "Tính lương tháng"
│   │   │       ├── PayrollForm.tsx          # Form tính lương
│   │   │       └── PayrollDetail.tsx        # Chi tiết bảng lương
│   │   │
│   │   ├── approval/                        # Duyệt đơn tổng hợp
│   │   │   ├── page.tsx                     # Danh sách đơn chờ duyệt
│   │   │   └── _components/
│   │   │       ├── ApprovalTable.tsx
│   │   │       └── ApprovalDetail.tsx
│   │   │
│   │   ├── salary-history/                  # Lịch sử lương (/admin/lich-su-luong)
│   │   │   └── page.tsx
│   │   │
│   │   ├── report/                          # Báo cáo (/admin/bao-cao)
│   │   │   ├── employees/
│   │   │   │   └── page.tsx                 # Báo cáo nhân sự
│   │   │   ├── attendance/
│   │   │   │   └── page.tsx                 # Báo cáo chấm công
│   │   │   ├── payroll/
│   │   │   │   └── page.tsx                 # Báo cáo lương
│   │   │   └── _components/
│   │   │       ├── ReportTable.tsx
│   │   │       └── ReportFilter.tsx
│   │   │
│   │   ├── holiday/                         # Ngày lễ (/admin/ngay-le)
│   │   │   └── page.tsx
│   │   │
│   │   ├── log/                             # Nhật ký hệ thống (/admin/nhat-ky)
│   │   │   └── page.tsx
│   │   │
│   │   ├── settings/                        # Cài đặt (/admin/cai-dat)
│   │   │   ├── page.tsx
│   │   │   └── _components/
│   │   │       ├── GeneralSettings.tsx
│   │   │       ├── UserManagement.tsx
│   │   │       └── SystemLogs.tsx
│   │   │
│   │   └── profile/                         # Hồ sơ cá nhân (/admin/ho-so)
│   │       └── page.tsx
│   │
│   ├── staff/                             # Staff Portal
│   │   ├── layout.tsx                       # Staff Layout
│   │   │
│   │   ├── home/
│   │   │   ├── page.tsx                     # Trang chủ nhân viên
│   │   │   ├── _components/
│   │   │   │   ├── CheckInWidget.tsx        # Widget Check-in/Check-out
│   │   │   │   ├── RealtimeClock.tsx        # Đồng hồ thời gian thực
│   │   │   │   ├── TodayStats.tsx           # Thống kê hôm nay
│   │   │   │   └── QuickActions.tsx         # Nút hành động nhanh
│   │   │   └── page.module.css
│   │   │
│   │   ├── profile/
│   │   │   ├── page.tsx                     # Thông tin cá nhân
│   │   │   ├── edit/
│   │   │   │   └── page.tsx                 # Sửa thông tin
│   │   │   └── _components/
│   │   │       ├── ProfileDetail.tsx        # Chi tiết hồ sơ
│   │   │       ├── ContractInfo.tsx         # Thông tin hợp đồng
│   │   │       ├── SalaryHistory.tsx        # Lịch sử lương
│   │   │       └── ProfileForm.tsx          # Form sửa thông tin
│   │   │
│   │   ├── attendance/
│   │   │   ├── page.tsx                     # Lịch chấm công cá nhân
│   │   │   └── _components/
│   │   │       ├── AttendanceCalendar.tsx   # Calendar component
│   │   │       ├── AttendanceList.tsx       # Danh sách chấm công
│   │   │       └── AttendanceDetail.tsx     # Chi tiết ngày
│   │   │
│   │   ├── leave/
│   │   │   ├── page.tsx                     # Danh sách đơn phép
│   │   │   ├── request/
│   │   │   │   └── page.tsx                 # Tạo đơn xin phép
│   │   │   └── _components/
│   │   │       ├── LeaveForm.tsx            # Form xin phép
│   │   │       ├── LeaveTable.tsx           # Danh sách đơn
│   │   │       ├── LeaveBalance.tsx         # Số dư phép
│   │   │       ├── DateRangePicker.tsx      # Chọn ngày phép
│   │   │       └── LeaveReasonSelect.tsx    # Chọn loại phép
│   │   │
│   │   ├── payslip/
│   │   │   ├── page.tsx                     # Danh sách phiếu lương
│   │   │   ├── [id]/
│   │   │   │   └── page.tsx                 # Chi tiết phiếu lương
│   │   │   └── _components/
│   │   │       ├── PayslipList.tsx          # Danh sách phiếu lương
│   │   │       ├── PayslipDetail.tsx        # Chi tiết phiếu lương
│   │   │       └── PayslipPDF.tsx           # Export PDF
│   │   │
│   │   ├── notifications/
│   │   │   ├── page.tsx                     # Danh sách thông báo
│   │   │   └── _components/
│   │   │       ├── NotificationBell.tsx     # Bell icon
│   │   │       ├── NotificationList.tsx     # Danh sách thông báo
│   │   │       └── NotificationToast.tsx    # Toast notification
│   │   │
│   │   └── my-requests/
│   │       ├── page.tsx                     # Các đơn của tôi
│   │       └── _components/
│   │           ├── RequestTable.tsx
│   │           └── RequestStatus.tsx
│   │
│   ├── components/                          # Thành phần UI dùng chung
│   │   ├── shared/                          # Các UI Component cơ bản (Atom/Molecule)
│   │   │   ├── Button/
│   │   │   │   ├── Button.tsx               # Nút bấm tùy chỉnh (Primary, Danger, Ghost,...)
│   │   │   │   ├── Button.module.css        # Style riêng cho Button
│   │   │   │   └── Button.stories.tsx       # Storybook demo component
│   │   │   ├── Modal/
│   │   │   │   ├── Modal.tsx                # Hộp thoại Modal (Popup)
│   │   │   │   └── Modal.module.css
│   │   │   ├── Table/
│   │   │   │   ├── Table.tsx                # Bảng dữ liệu chuẩn (Antd based)
│   │   │   │   ├── TablePagination.tsx      # Phân trang cho bảng
│   │   │   │   └── TableActions.tsx         # Các nút hành động trên dòng (Sửa, Xóa)
│   │   │   ├── Form/
│   │   │   │   ├── FormInput.tsx            # Ô nhập liệu Text
│   │   │   │   ├── FormSelect.tsx           # Ô chọn Dropdown
│   │   │   │   ├── FormDatePicker.tsx       # Ô chọn ngày tháng
│   │   │   │   ├── FormCheckbox.tsx         # Ô tích chọn
│   │   │   │   ├── FormRadio.tsx            # Ô chọn một
│   │   │   │   └── FormFile.tsx             # Ô tải lên file
│   │   │   ├── Toast/
│   │   │   │   ├── Toast.tsx                # Thông báo nổi (Snackbar)
│   │   │   │   └── useToast.ts              # Hook điều khiển thông báo
│   │   │   ├── Loading/
│   │   │   │   ├── Spinner.tsx              # Biểu tượng đang tải (Loading)
│   │   │   │   └── Skeleton.tsx             # Khung xương chờ tải dữ liệu
│   │   │   ├── Breadcrumb/
│   │   │   │   └── Breadcrumb.tsx           # Thanh điều hướng đường dẫn
│   │   │   ├── Avatar/
│   │   │   │   └── Avatar.tsx               # Ảnh đại diện người dùng
│   │   │   ├── Badge/
│   │   │   │   └── Badge.tsx                # Nhãn trạng thái (Status badge)
│   │   │   ├── Tag/
│   │   │   │   └── Tag.tsx                  # Thẻ phân loại
│   │   │   ├── Card/
│   │   │   │   └── Card.tsx                 # Khung nội dung (Card container)
│   │   │   └── Empty/
│   │   │       └── Empty.tsx                # Hiển thị khi không có dữ liệu
│   │   │
│   │   ├── layout/
│   │   │   ├── AdminLayout.tsx              # Khung giao diện Admin (Sidebar trái)
│   │   │   ├── StaffLayout.tsx              # Khung giao diện Nhân viên
│   │   │   ├── Header.tsx                   # Thanh đầu trang (Avatar, Profile, Notify)
│   │   │   ├── Sidebar.tsx                  # Thanh menu điều hướng chính
│   │   │   ├── Footer.tsx                   # Thanh chân trang
│   │   │   └── Navigation.tsx               # Logic điều hướng phụ
│   │   │
│   │   └── auth/
│   │       ├── ProtectedRoute.tsx           # Kiểm tra đăng nhập mới cho vào
│   │       ├── PrivateRoute.tsx             # Route bảo mật cao
│   │       └── RoleGuard.tsx                # Chặn quyền truy cập theo vai trò (Role)
│   │
│   ├── services/                            # Tầng gọi API (Backend Integration)
│   │   ├── api.ts                           # Cấu hình Axios, Header JWT, Interceptors
│   │   ├── auth.service.ts                  # Xử lý Đăng nhập, Đăng xuất, Profile
│   │   ├── employee.service.ts              # Gọi API Quản lý nhân viên
│   │   ├── attendance.service.ts            # Gọi API Chấm công
│   │   ├── leave.service.ts                 # Gọi API Nghỉ phép
│   │   ├── payroll.service.ts               # Gọi API Lương
│   │   ├── approval.service.ts              # Gọi API Phê duyệt đơn từ
│   │   ├── report.service.ts                # Gọi API Xuất báo cáo
│   │   ├── dashboard.service.ts             # Gọi API Thống kê Dashboard
│   │   ├── notification.service.ts          # Gọi API Thông báo hệ thống
│   │   └── upload.service.ts                # Xử lý tải ảnh/file lên Server
│   │
│   ├── store/                               # Quản lý trạng thái (Zustand)
│   │   ├── authStore.ts                     # Lưu thông tin đăng nhập, token, role
│   │   ├── appStore.ts                      # Lưu trạng thái giao diện (Đóng/mở sidebar)
│   │   ├── notificationStore.ts             # Quản lý danh sách thông báo realtime
│   │   └── userStore.ts                     # Lưu cài đặt cá nhân của người dùng
│   │
│   ├── hooks/                               # Các hàm React Hook tùy chỉnh
│   │   ├── useAuth.ts                       # Hook lấy thông tin user hiện tại nhanh
│   │   ├── useUser.ts                       # Hook xử lý logic user
│   │   ├── useApi.ts                        # Hook bọc gọi API có trạng thái loading/error
│   │   ├── useForm.ts                       # Hook xử lý Form phức tạp
│   │   ├── useLocalStorage.ts               # Hook làm việc với LocalStorage
│   │   ├── usePagination.ts                 # Hook tính toán phân trang
│   │   ├── useNotification.ts               # Hook hiển thị thông báo Toast
│   │   └── useDebounce.ts                   # Hook trì hoãn xử lý (Search input)
│   │
│   ├── utils/                               # Các hàm tiện ích bổ trợ
│   │   ├── validators.ts                    # Các quy tắc kiểm tra dữ liệu (Zod)
│   │   ├── constants.ts                     # Các hằng số dùng chung toàn app
│   │   ├── helpers.ts                       # Các hàm xử lý logic vặt
│   │   ├── date-utils.ts                    # Định dạng ngày tháng (dd/mm/yyyy)
│   │   ├── currency-utils.ts                # Định dạng tiền tệ (VND)
│   │   ├── permission.ts                    # Hàm kiểm tra quyền (isAdmin, isStaff)
│   │   └── error-handler.ts                 # Xử lý lỗi API tập trung
│   │
│   ├── types/                               # Định nghĩa kiểu dữ liệu (TypeScript)
│   │   ├── index.ts                         # File export tổng hợp các types
│   │   ├── auth.ts                          # Kiểu dữ liệu Đăng nhập/User
│   │   ├── employee.ts                      # Kiểu dữ liệu Nhân viên
│   │   ├── attendance.ts                    # Kiểu dữ liệu Chấm công
│   │   ├── leave.ts                         # Kiểu dữ liệu Đơn nghỉ phép
│   │   ├── payroll.ts                       # Kiểu dữ liệu Bảng lương
│   │   ├── approval.ts                      # Kiểu dữ liệu Phê duyệt
│   │   ├── api.ts                           # Kiểu dữ liệu Response từ Backend
│   │   └── common.ts                        # Các kiểu dữ liệu dùng chung (Pagination, Modal)
│   │
│   ├── config/                              # Cấu hình hệ thống
│   │   ├── api.config.ts                    # Base URL, Timeout
│   │   ├── menu.config.ts                   # Cấu hình danh mục Menu Sidebar
│   │   ├── theme.config.ts                  # Cấu hình màu sắc, font Ant Design
│   │   └── permissions.config.ts            # Định nghĩa bảng phân quyền
│   │
│   ├── middleware/                          # Next.js Middleware (Chặn Route)
│   │   ├── auth.ts                          # Middleware kiểm tra Login
│   │   ├── logger.ts                        # Middleware ghi nhật ký truy cập
│   │   └── errorHandler.ts                  # Middleware xử lý lỗi
│   │
│   ├── styles/                              # Giao diện và CSS
│   │   ├── globals.css                      # CSS toàn cục
│   │   ├── variables.css                    # Khai báo biến màu sắc, spacing
│   │   ├── antd-override.css                # Ghi đè style mặc định của Ant Design
│   │   └── tailwind.css                     # Cấu hình Tailwind CSS
│   │
│   └── constants/                           # Hằng số cố định
│       ├── http-status.ts                   # Mã lỗi 200, 400, 401, 500,...
│       ├── role.ts                          # Định nghĩa ADMIN, MANAGER, STAFF
│       └── api-endpoints.ts                 # Toàn bộ đường dẫn API Backend (/nhan-vien,...)
│
├── public/
│   ├── favicon.ico
│   └── manifest.json
│
├── .env.example
├── .env.local                               # Local config
├── .env.production                          # Production config
├── .eslintrc.json
├── .prettierrc
├── tsconfig.json
├── next.config.js
├── tailwind.config.js
├── postcss.config.js
├── package.json
└── README.md
```

### 📦 Package.json Dependencies:

```json
{
  "dependencies": {
    "next": "^15.0.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "antd": "^5.15.0",
    "tailwindcss": "^3.4.0",
    "axios": "^1.6.0",
    "zustand": "^4.4.0",
    "react-hook-form": "^7.50.0",
    "zod": "^3.22.0",
    "date-fns": "^3.3.0",
    "recharts": "^2.10.0",
    "chart.js": "^4.4.0",
    "react-chartjs-2": "^5.2.0",
    "jspdf": "^2.5.1",
    "xlsx": "^0.18.5",
    "clsx": "^2.0.0",
    "classnames": "^2.3.2"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "typescript": "^5.3.0",
    "eslint": "^8.55.0",
    "eslint-config-next": "^15.0.0",
    "prettier": "^3.1.0",
    "@storybook/react": "^7.6.0"
  }
}
```

---



## 🚀 Hướng Dẫn Chạy Dự Án

### 1. Backend (NestJS)
```bash
# Cài dependencies
npm install

# Khởi động Docker (SQL Server + Redis)
docker compose up -d

# Chạy development server
npm run start:dev

# Server sẽ chạy tại: http://localhost:3000
```

### 2. Frontend (Next.js)
```bash
# Di chuyển vào thư mục FE
cd FE

# Cài dependencies
npm install

# Tạo file .env.local (copy từ .env.example)
# Cấu hình NEXT_PUBLIC_API_URL=http://localhost:3000

# Chạy development server
npm run dev

# Frontend sẽ chạy tại: http://localhost:3001 (hoặc port khác nếu 3001 bị dùng)
```

### 3. Tài khoản Demo
- **Admin**: admin@nexthr.com / 123456
- **Manager**: lan.tran@nexthr.vn / 123456
- **Staff**: ha.pham@nexthr.vn / 123456

### 4. Quy Trình Phát Triển
**Frontend Developer A (Admin Portal):**
1. Tạo layout (Sidebar, Header, AdminLayout)
2. Tạo shared components
3. Xây dựng Admin Dashboard + Charts
4. Xây dựng Employee Management
5. Xây dựng Org Chart, Attendance Monitor
6. Xây dựng Payroll Run, Approval Workflow

**Frontend Developer B (Staff Portal):**
1. Tạo Authentication (Login page)
2. Tạo Staff Layout + Navigation
3. Xây dựng Staff Home (Check-in/Check-out widget)
4. Xây dựng Employee Profile Page
5. Xây dựng Leave Request Form
6. Xây dựng Personal Payslip
7. Xây dựng Attendance Calendar
8. Xây dựng Notification System
9. Tích hợp Form Validation
10. Testing + Polish UI

---

## 📝 Ghi Chú Quan Trọng

1. **TypeORM không tự tạo schema**: Dùng file `SchemaNEXTHR.sql` - TypeORM chỉ dùng để map entity
2. **JWT Authentication**: Lưu token trong localStorage + cookies, gửi kèm header `Authorization: Bearer <token>`
3. **CORS**: Backend cần bật CORS cho frontend origin (localhost:3001)
4. **Environment Variables**: 
   - Backend: `.env` (DB_HOST, DB_PORT, JWT_SECRET, v.v.)
   - Frontend: `.env.local` (NEXT_PUBLIC_API_URL)
5. **Axios Interceptors**: Tự động append token vào request, handle 401 error (redirect login)
6. **Error Handling**: Catch API errors, show toast notification, log error
7. **Loading States**: Hiển thị loading khi fetch data, disable button khi submitting form
8. **Responsive Design**: Test mobile (375px), tablet (768px), desktop (1920px)

---

## 🔌 API Integration Checklist

### Authentication (Module Xác thực)
- [ ] POST /xac-thuc/dang-nhap → lưu token, redirect dashboard
- [ ] GET /xac-thuc/ho-so → lấy user info
- [ ] POST /xac-thuc/dang-xuat → clear token, redirect login

### Employee Management (Nhân viên)
- [ ] GET /nhan-vien → Danh sách (pagination, filter, search)
- [ ] GET /nhan-vien/:id → Chi tiết
- [ ] POST /nhan-vien → Thêm
- [ ] PUT /nhan-vien/:id → Sửa
- [ ] DELETE /nhan-vien/:id → Xóa

### Attendance (Chấm công)
- [ ] POST /cham-cong → Check-in/Check-out
- [ ] GET /cham-cong → Danh sách
- [ ] GET /cham-cong/:id → Chi tiết

### Leave (Nghỉ phép)
- [ ] GET /nghi-phep/loai → Loại phép
- [ ] POST /nghi-phep/yeu-cau → Gửi đơn
- [ ] GET /nghi-phep/so-du → Số dư phép
- [ ] GET /nghi-phep/danh-sach-yeu-cau → Danh sách đơn
- [ ] PUT /nghi-phep/yeu-cau/:id → Update (approve/reject)

### Payroll (Lương)
- [ ] POST /luong/tinh-luong → Tính lương tháng
- [ ] GET /luong → Danh sách
- [ ] GET /luong/:id → Chi tiết

### Approval (Phê duyệt)
- [ ] GET /phe-duyet/cho-duyet → Danh sách đơn chờ
- [ ] PUT /phe-duyet/:id/dong-y → Phê duyệt
- [ ] PUT /phe-duyet/:id/tu-choi → Từ chối

### Dashboard (Bảng điều khiển)
- [ ] GET /bang-dieu-khien/thong-ke → Thống kê chung
- [ ] GET /bang-dieu-khien/bieu-do → Dữ liệu biểu đồ

### Organization (Tổ chức)
- [ ] GET /co-cau-to-chuc/so-do → Sơ đồ tổ chức

### Notification (Thông báo)
- [ ] GET /thong-bao → Danh sách thông báo
- [ ] PUT /thong-bao/:id/da-doc → Đã đọc
- [ ] DELETE /thong-bao/:id → Xóa đơn lẻ

---

## 🎨 Design Guidelines

### Color Scheme
- Primary: #1890ff (Ant Design Blue)
- Success: #52c41a (Green)
- Warning: #faad14 (Orange)
- Error: #f5222d (Red)
- Background: #fafafa
- Text: #000000

### Typography
- H1: 32px, Bold
- H2: 24px, Bold
- H3: 18px, Bold
- Body: 14px, Regular
- Small: 12px, Regular

### Spacing
- xs: 4px
- sm: 8px
- md: 16px
- lg: 24px
- xl: 32px

---

---

## 📅 KẾ HOẠCH PHÂN CÔNG ĐIỀU CHỈNH (DETAILED)

### 👤 THÀNH VIÊN 4 – BẠN (Ưu tiên làm trước)

**✅ Đã xong (không cần làm lại):**
- **Frontend Foundation:** Next.js setup, Ant Design, Tailwind, CSS variables.
- **Layouts:** Admin Layout (Sidebar, Header, Breadcrumbs), Staff Layout.
- **Shared Components:** `Button`, `Table`, `Modal`, `Toast`, `ConfirmDialog`, `StatsCard`.
- **Admin Dashboard:** Các thẻ thống kê (Stats cards) tổng quan.
- **Admin Employee Management:** Toàn bộ Module (Danh sách, Thêm/Sửa nhiều tab, Chi tiết, Xóa).
- **Admin Attendance Monitor:** Theo dõi chấm công toàn công ty, lọc, thống kê, cảnh báo.
- **Core Pages:** Admin Profile, Staff Home (cơ bản), Staff Attendance (bảng danh sách).
- **Infrastructure:** Axios Instance (`api.ts`), App Store (Zustand), API Endpoints.
- **Localization:** Cấu hình Rewrites tiếng Việt cho toàn bộ đường dẫn.
- **Admin – Contract Management:** Toàn bộ module Quản lý hợp đồng (Danh sách, Thêm mới, In ấn).

**🔜 PHẢI LÀM (Theo thứ tự ưu tiên):**

1. **🔐 Login Page + Auth Flow (Làm đầu tiên – unblock tất cả)**
   - *Cơ sở:* Bảng `NhanVien.MatKhauHash` + `VaiTro.TenVaiTro` (Admin | Manager | Staff).
   - *Trang `/login`:* Form Email + Password, validate chuẩn (Required, Email format).
   - *Logic:* Gọi API `POST /xac-thuc/dang-nhap`.
   - *State:* Tạo `authStore.ts` (Zustand) lưu `{ user, token, role }`.
   - *Redirect:* Sau login điều hướng theo role:
     - `Admin / Manager` → `/admin/bang-dieu-khien`
     - `Staff` → `/staff/trang-chu`

2. **🛡️ Auth Middleware + RoleGuard**
   - *Middleware:* File `src/middleware.ts` kiểm tra token, nếu không có → redirect về `/login`.
   - *Component RoleGuard:* Chặn quyền truy cập (ví dụ: Staff không được vào `/admin/**`).
   - *Tích hợp:* Áp dụng vào `AdminLayout.tsx` và `StaffLayout.tsx`.

3. **🔌 Tích hợp API thật (Employee + Attendance)**
   - Thay thế toàn bộ `MOCK_DATA` của Nhân viên và Chấm công bằng gọi API Axios thật.
   - Xử lý các trạng thái Loading, Empty và Error handling chuyên nghiệp.
   - *Mục tiêu:* Để các module sau có dữ liệu thật để tính toán.

4. **💰 Admin – Payroll UI**
   - *Cơ sở:* Bảng `PhieuLuong` trong CSDL.
   - *Trang `/admin/luong`:* Table danh sách (Nhân viên, Tháng/Năm, Lương cơ bản, Thực lĩnh, Trạng thái).
   - *Tính năng:* Nút **"Tính lương tháng"** → gọi `POST /luong/tinh-luong` kèm loading spinner.
   - *Detail:* Modal chi tiết 1 phiếu lương (breakdown: BHXH, BHYT, BHTN, Thuế TNCN).
   - *Export:* Nút Xuất Excel bảng lương.

5. **💵 Staff – Payslip chi tiết + PDF**
   - *Cơ sở:* Bảng `PhieuLuong` (sau khi Admin đã tính lương).
   - *Trang:* Danh sách phiếu lương theo từng tháng của cá nhân.
   - *Detail:* Hiển thị chi tiết tất cả các khoản thu nhập và khấu trừ.
   - *Export:* Tích hợp nút **Tải file PDF** phiếu lương.

6. **📅 Staff – Calendar Chấm công**
   - *Cơ sở:* Bảng `ChamCong.TrangThai` (CoMat | DiMuon | Vang | NghiPhep).
   - *UI:* Dùng Ant Design Calendar, tô màu các ngày theo trạng thái đi làm.
   - *Detail:* Click vào ngày xem chi tiết giờ vào, giờ ra và tổng giờ làm.

7. **✅ Admin/Staff – Widget Check-in/Check-out**
   - *Cơ sở:* Bảng `ChamCong` (GioVao, GioRa, TrangThai).
   - *UI:* Đồng hồ thời gian thực (HH:MM:SS) sống động.
   - *Action:* Nút **Check In** / **Check Out** linh hoạt.
   - *Status:* Hiển thị trạng thái hiện tại (VD: "Đã check in lúc 08:15").

8. **📈 Admin – Reporting Center (Xây dựng khung báo cáo)**
   - *Cơ sở:* View thống kê từ SQL Server dựa trên dữ liệu thật đã tích hợp.
   - *Báo cáo:* Nhân sự (Biến động), Chấm công (Tỷ lệ đi muộn), Lương (Quỹ lương).
   - *Tính năng:* Lọc theo thời gian, Xuất Excel/PDF.
---

### 👤 THÀNH VIÊN 5 – BẠN CỦA BẠN

**Kế thừa từ Member 4:**
- Toàn bộ khung giao diện, layout, components dùng chung và các trang cơ bản đã được setup sẵn.

**🔜 PHẢI LÀM:**

1. **✅ Admin – Approval Workflow UI (Phê duyệt đơn từ)**
   - *Cơ sở:* Bảng `DonNghiPhep` + `DonLamThem` trong CSDL.
   - *Trang `/admin/duyet-don`:* Table danh sách đơn đang ở trạng thái `Pending`.
   - *Hiển thị:* Nhân viên, Loại phép, Từ-Đến ngày, Số ngày, Lý do, Badge trạng thái.
   - *Action:* 2 nút **Duyệt** / **Từ chối** (modal nhập lý do từ chối).
   - *Phân loại:* 2 tab (Đơn nghỉ phép | Đơn làm thêm giờ).

2. **📊 Admin Dashboard – Biểu đồ Chart.js**
   - *Dữ liệu:* Bảng `NhanVien` (nhóm theo `MaPhongId`) + `PhieuLuong` (nhóm theo `Thang/Nam`).
   - *Biểu đồ cột:* Số lượng nhân viên theo từng phòng ban.
   - *Biểu đồ đường:* Biến động chi phí lương trong 6 tháng gần nhất.
   - *Tích hợp:* Nhúng vào trang `/admin/bang-dieu-khien` đã có.

3. **🌳 Admin – Org Chart**
   - *Dữ liệu:* Bảng `PhongBan.MaPhongCha` (đệ quy) + `NhanVien`.
   - *UI:* Hiển thị sơ đồ tổ chức dạng cây phân cấp trực quan.
   - *Interaction:* Hover hiện popup thông tin nhân viên, Search tìm nhanh vị trí nhân viên trong cây.

4. **📝 Staff – Leave Request Form**
   - *Cơ sở:* Bảng `DonNghiPhep` + `SoDuPhep` + `LoaiNghiPhep`.
   - *Features:* Chọn loại phép, hiển thị số ngày phép còn lại theo thời gian thực.
   - *Logic:* Dùng DateRangePicker, tự động tính số ngày nghỉ, validate không chọn ngày quá khứ.

5. **📋 Staff – Leave List + My Requests**
   - *UI:* Bảng theo dõi các đơn từ đã gửi (`DonNghiPhep`, `DonLamThem`).
   - *Status:* Hiển thị Badge màu sắc sinh động (Chờ duyệt, Đã duyệt, Bị từ chối).

6. **🔔 Staff – Notification System**
   - *UI:* Popup thông báo ở Header + Trang danh sách thông báo chi tiết.
   - *Logic:* Đánh dấu đã đọc, xóa thông báo, điều hướng nhanh đến đơn từ liên quan.

7. **📊 Admin – Salary History (Lịch sử biến động lương)**
   - *UI:* Trang theo dõi quá trình tăng/giảm lương của từng nhân viên.
   - *Dữ liệu:* Bảng `LichSuThayDoiLuong`.

8. **🛡️ Admin – System Audit Logs & Holidays**
   - *Audit Logs:* Xem nhật ký thao tác (Ai làm gì, lúc nào) – Bảng `NhatKyHeThong`.
   - *Holidays:* Quản lý danh mục ngày lễ trong năm – Bảng `NgayLe`.