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

### Authentication Module
```
POST   /auth/login              # Đăng nhập
POST   /auth/logout             # Đăng xuất
GET    /auth/profile            # Lấy thông tin user hiện tại (JWT)
```

### Employee Module
```
GET    /employee                # Danh sách nhân viên
GET    /employee/:id            # Chi tiết nhân viên
POST   /employee                # Thêm nhân viên
PUT    /employee/:id            # Cập nhật nhân viên
DELETE /employee/:id            # Xóa nhân viên
POST   /employee/:id/transfer   # Điều chuyển
```

### Attendance Module
```
GET    /attendance              # Danh sách chấm công
POST   /attendance              # Thêm chấm công
GET    /attendance/:id/ot       # Lấy đơn làm thêm giờ
POST   /attendance/:id/ot       # Tạo đơn làm thêm giờ
```

### Leave Module
```
GET    /leave/types             # Danh sách loại phép
POST   /leave/request           # Gửi đơn xin phép
GET    /leave/requests          # Danh sách đơn phép
PUT    /leave/requests/:id      # Cập nhật đơn phép
GET    /leave/balance           # Số dư phép
```

### Dashboard Module
```
GET    /dashboard/stats         # Thống kê chung
GET    /dashboard/analytics     # Phân tích dữ liệu
```

### Payroll Module
```
GET    /payroll                 # Danh sách bảng lương
POST   /payroll/calculate       # Tính lương
```

### Report Module
```
GET    /report/employees        # Báo cáo nhân viên
GET    /report/attendance       # Báo cáo chấm công
GET    /report/payroll          # Báo cáo lương
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
│   ├── (admin)/
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
│   │   ├── employee/                        # Quản lý nhân viên
│   │   │   ├── page.tsx                     # Danh sách nhân viên (Table)
│   │   │   ├── [id]/
│   │   │   │   ├── page.tsx                 # Chi tiết nhân viên
│   │   │   │   └── edit/
│   │   │   │       └── page.tsx             # Sửa nhân viên (Form)
│   │   │   ├── add/
│   │   │   │   └── page.tsx                 # Thêm nhân viên (Form)
│   │   │   └── _components/
│   │   │       ├── EmployeeTable.tsx        # Table với Search, Filter
│   │   │       ├── EmployeeForm.tsx         # Form (thêm/sửa)
│   │   │       ├── EmployeeDetail.tsx       # Modal chi tiết
│   │   │       ├── SearchFilter.tsx         # Search & Filter
│   │   │       ├── DeleteConfirm.tsx        # Xác nhận xóa
│   │   │       └── BulkActions.tsx          # Action hàng loạt
│   │   │
│   │   ├── organization/                    # Sơ đồ tổ chức
│   │   │   ├── page.tsx                     # Org Chart Visualization
│   │   │   └── _components/
│   │   │       ├── OrgChart.tsx             # Tree View phân cấp
│   │   │       ├── OrgNode.tsx
│   │   │       └── OrgSearch.tsx
│   │   │
│   │   ├── attendance/                      # Chấm công (Admin view)
│   │   │   ├── page.tsx                     # Danh sách chấm công toàn công ty
│   │   │   ├── [id]/
│   │   │   │   └── page.tsx                 # Chi tiết chấm công nhân viên
│   │   │   └── _components/
│   │   │       ├── AttendanceTable.tsx      # Table chấm công
│   │   │       ├── LateAlert.tsx            # Cảnh báo đi muộn/về sớm
│   │   │       ├── AttendanceFilter.tsx     # Bộ lọc (ngày, phòng ban)
│   │   │       └── AttendanceStats.tsx      # Thống kê chấm công
│   │   │
│   │   ├── payroll/                         # Quản lý lương
│   │   │   ├── page.tsx                     # Danh sách bảng lương
│   │   │   ├── [id]/
│   │   │   │   └── page.tsx                 # Chi tiết bảng lương
│   │   │   └── _components/
│   │   │       ├── PayrollTable.tsx         # Table kết quả tính lương
│   │   │       ├── PayrollRunBtn.tsx        # Nút "Tính lương tháng"
│   │   │       ├── PayrollForm.tsx          # Form tính lương (tháng, năm)
│   │   │       ├── PayrollDetail.tsx        # Chi tiết bảng lương
│   │   │       └── PayrollExport.tsx        # Export Excel/PDF
│   │   │
│   │   ├── approval/                        # Duyệt đơn
│   │   │   ├── page.tsx                     # Danh sách đơn chờ duyệt
│   │   │   ├── _components/
│   │   │   │   ├── ApprovalTable.tsx        # Table các đơn chờ
│   │   │   │   ├── ApprovalButtons.tsx      # Nút Approve/Reject
│   │   │   │   ├── ApprovalDetail.tsx       # Modal chi tiết đơn
│   │   │   │   ├── ApprovalNotes.tsx        # Ghi chú phê duyệt
│   │   │   │   └── ApprovalHistory.tsx      # Lịch sử phê duyệt
│   │   │   └── page.module.css
│   │   │
│   │   ├── report/                          # Báo cáo
│   │   │   ├── employees/
│   │   │   │   └── page.tsx                 # Báo cáo nhân sự
│   │   │   ├── attendance/
│   │   │   │   └── page.tsx                 # Báo cáo chấm công
│   │   │   ├── payroll/
│   │   │   │   └── page.tsx                 # Báo cáo lương
│   │   │   └── _components/
│   │   │       ├── ReportTable.tsx
│   │   │       ├── ReportFilter.tsx
│   │   │       └── ReportExport.tsx
│   │   │
│   │   └── settings/
│   │       ├── page.tsx                     # Cài đặt hệ thống
│   │       └── _components/
│   │           ├── GeneralSettings.tsx
│   │           ├── UserManagement.tsx
│   │           └── SystemLogs.tsx
│   │
│   ├── (staff)/                             # Staff Portal
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
│   ├── components/                          # Shared Components (Centralized)
│   │   ├── shared/                          # Reusable UI Components
│   │   │   ├── Button/
│   │   │   │   ├── Button.tsx
│   │   │   │   ├── Button.module.css
│   │   │   │   └── Button.stories.tsx       # Storybook
│   │   │   ├── Modal/
│   │   │   │   ├── Modal.tsx
│   │   │   │   └── Modal.module.css
│   │   │   ├── Table/
│   │   │   │   ├── Table.tsx
│   │   │   │   ├── TablePagination.tsx
│   │   │   │   └── TableActions.tsx
│   │   │   ├── Form/
│   │   │   │   ├── FormInput.tsx
│   │   │   │   ├── FormSelect.tsx
│   │   │   │   ├── FormDatePicker.tsx
│   │   │   │   ├── FormCheckbox.tsx
│   │   │   │   ├── FormRadio.tsx
│   │   │   │   └── FormFile.tsx
│   │   │   ├── Toast/
│   │   │   │   ├── Toast.tsx
│   │   │   │   └── useToast.ts
│   │   │   ├── Loading/
│   │   │   │   ├── Spinner.tsx
│   │   │   │   └── Skeleton.tsx
│   │   │   ├── Breadcrumb/
│   │   │   │   └── Breadcrumb.tsx
│   │   │   ├── Avatar/
│   │   │   │   └── Avatar.tsx
│   │   │   ├── Badge/
│   │   │   │   └── Badge.tsx
│   │   │   ├── Tag/
│   │   │   │   └── Tag.tsx
│   │   │   ├── Card/
│   │   │   │   └── Card.tsx
│   │   │   └── Empty/
│   │   │       └── Empty.tsx
│   │   │
│   │   ├── layout/
│   │   │   ├── AdminLayout.tsx              # Admin Layout wrapper
│   │   │   ├── StaffLayout.tsx              # Staff Layout wrapper
│   │   │   ├── Header.tsx                   # Header (User Profile, Notifications)
│   │   │   ├── Sidebar.tsx                  # Sidebar Menu
│   │   │   ├── Footer.tsx
│   │   │   └── Navigation.tsx
│   │   │
│   │   └── auth/
│   │       ├── ProtectedRoute.tsx           # Route protection
│   │       ├── PrivateRoute.tsx
│   │       └── RoleGuard.tsx
│   │
│   ├── services/
│   │   ├── api.ts                           # Axios instance + Interceptors
│   │   ├── auth.service.ts                  # Authentication API
│   │   ├── employee.service.ts              # Employee API
│   │   ├── attendance.service.ts            # Attendance API
│   │   ├── leave.service.ts                 # Leave API
│   │   ├── payroll.service.ts               # Payroll API
│   │   ├── approval.service.ts              # Approval API
│   │   ├── report.service.ts                # Report API
│   │   ├── dashboard.service.ts             # Dashboard API
│   │   ├── notification.service.ts          # Notification API
│   │   └── upload.service.ts                # File upload API
│   │
│   ├── store/
│   │   ├── authStore.ts                     # Zustand - Auth (user, token, roles)
│   │   ├── appStore.ts                      # Zustand - App (theme, sidebar state)
│   │   ├── notificationStore.ts             # Zustand - Notifications
│   │   └── userStore.ts                     # Zustand - User preferences
│   │
│   ├── hooks/
│   │   ├── useAuth.ts                       # Auth hook
│   │   ├── useUser.ts                       # User hook
│   │   ├── useApi.ts                        # API hook
│   │   ├── useForm.ts                       # Form hook
│   │   ├── useLocalStorage.ts               # LocalStorage hook
│   │   ├── usePagination.ts                 # Pagination hook
│   │   ├── useNotification.ts               # Toast notification hook
│   │   └── useDebounce.ts                   # Debounce hook
│   │
│   ├── utils/
│   │   ├── validators.ts                    # Validation functions (Zod schemas)
│   │   ├── constants.ts                     # App constants
│   │   ├── helpers.ts                       # Helper functions
│   │   ├── date-utils.ts                    # Date formatting
│   │   ├── currency-utils.ts                # Currency formatting
│   │   ├── permission.ts                    # Permission checking
│   │   └── error-handler.ts                 # Error handling
│   │
│   ├── types/
│   │   ├── index.ts                         # Exported types
│   │   ├── auth.ts                          # Auth types
│   │   ├── employee.ts                      # Employee types
│   │   ├── attendance.ts                    # Attendance types
│   │   ├── leave.ts                         # Leave types
│   │   ├── payroll.ts                       # Payroll types
│   │   ├── approval.ts                      # Approval types
│   │   ├── api.ts                           # API response types
│   │   └── common.ts                        # Common types
│   │
│   ├── config/
│   │   ├── api.config.ts                    # API configuration
│   │   ├── menu.config.ts                   # Menu configuration
│   │   ├── theme.config.ts                  # Ant Design theme config
│   │   └── permissions.config.ts            # Role-based permissions
│   │
│   ├── middleware/
│   │   ├── auth.ts                          # Auth middleware
│   │   ├── logger.ts                        # Logging middleware
│   │   └── errorHandler.ts                  # Error handler middleware
│   │
│   ├── styles/
│   │   ├── globals.css                      # Global styles
│   │   ├── variables.css                    # CSS variables
│   │   ├── antd-override.css                # Ant Design overrides
│   │   └── tailwind.css                     # Tailwind imports
│   │
│   └── constants/
│       ├── http-status.ts
│       ├── role.ts
│       └── api-endpoints.ts
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

## 🎯 Công Việc Frontend Chi Tiết (2 Thành Viên)

### **THÀNH VIÊN 4: FRONTEND DEVELOPER A**
**Trọng tâm**: Setup Core, Module Quản lý Nhân sự & Hệ thống Chấm công (Cả Admin & Staff)

1. **Frontend Foundation & Admin Layout (Core)**
   - Khởi tạo Next.js 15 project
   - Cài Ant Design + Tailwind CSS
   - Setup Axios Instance với Interceptors (JWT, error handling, BaseURL)
   - Cấu hình theme Ant Design
   - Thiết kế khung giao diện Admin (Sidebar, Header, Breadcrumbs, Responsive)

2. **Shared Components & Form Validation (Core)**
   - Viết các Component dùng chung: Button, Modal, Table, Toast, Form Input, Select, DatePicker, Upload, Spinner, Badge, Tag, Card, Empty
   - Triển khai logic Validate form chuẩn hóa (Required, Email, Phone, Date Range)
   - Sử dụng Zod + React Hook Form
   - Tạo các wrapper components có thể tái sử dụng cho cả Admin & Staff

3. **Complex Employee Form (Admin/Staff)**
   - Làm Form thêm/sửa nhân viên (nhiều tab/nhiều bước)
   - Tab 1: Thông tin cơ bản (Tên, Email, SĐT, Địa chỉ)
   - Tab 2: Thông tin công tác (Phòng ban, Chức vụ, Ngày bắt đầu)
   - Tab 3: Hợp đồng (Loại HĐ, Mức lương, Ngày ký)
   - Tab 4: Upload ảnh đại diện (preview + crop)
   - Validation tất cả trước khi submit
   - Dùng chung cho Admin thêm người & Staff cập nhật hồ sơ

4. **Employee Management (Admin)**
   - Làm màn hình danh sách nhân viên dạng Table
   - Tính năng Search (tên, email, phòng ban)
   - Filter theo trạng thái, chức vụ
   - Pagination, Sorting
   - Nút Edit, Delete, View Detail
   - Modal xác nhận xóa

5. **Profile & Org Chart (Staff/Admin)**
   - Profile giao diện xem thông tin cá nhân chi tiết cho nhân viên (Staff):
     - Hồ sơ (Tên, Email, SĐT, Địa chỉ, Avatar)
     - Hợp đồng (Ngày ký, Loại HĐ, Mức lương)
     - Lịch sử lương (Table các tháng)
     - Nút Edit Profile
   - Org Chart (Tree View) cho cấp quản lý (Admin):
     - Hiển thị sơ đồ tổ chức dạng cây phân cấp
     - Hover hiển thị thông tin nhân viên
     - Click để xem chi tiết
     - Search tìm nhân viên

6. **Attendance Action UI (Staff)**
   - Widget Check-in/Check-out tại trang chủ nhân viên
   - Nút "Check In" (sau hôm nay)
   - Nút "Check Out" (khi đã Check In)
   - Đồng hồ thời gian thực (HH:MM:SS)
   - Hiển thị giờ Check In/Out gần nhất
   - Status: "Chưa check in", "Đã check in lúc XX:XX"
   - Nơi tạo dữ liệu chấm công

7. **Staff Attendance Calendar (Staff)**
   - Calendar component hiển thị lịch làm việc cá nhân
   - Mỗi ngày hiển thị:
     - Xanh: Đi làm đầy đủ
     - Vàng: Muộn/Sớm
     - Đỏ: Vắng/Phép
   - Click ngày → Xem chi tiết giờ check in/out
   - Chọn tháng/năm để xem lịch sử

8. **Attendance Monitor UI (Admin)**
   - Trang theo dõi chấm công toàn công ty
   - Table danh sách với cột: Nhân viên, Giờ Vào, Giờ Ra, Trạng thái (Đúng giờ/Muộn/Sớm)
   - Filter theo ngày, phòng ban
   - Badge cảnh báo (muộn, sớm, vắng)
   - Nơi Admin kiểm tra dữ liệu từ Widget Check-in

9. **State Management (Core)**
   - Thiết lập Zustand/Context API để quản lý UI State chung:
     - `authStore`: User info, token, roles
     - `appStore`: Theme (light/dark), sidebar state
     - `uiStore`: Modal state, Toast messages

10. **Responsive (Part 1)**
    - Tối ưu hóa hiển thị trên Mobile (375px, 768px)
    - Sidebar collapse trên mobile
    - Table scroll horizontal trên mobile
    - Form stacking trên mobile

---

### **THÀNH VIÊN 5: FRONTEND DEVELOPER B**
**Trọng tâm**: Module Xác thực, Quy trình duyệt Đơn từ, Quản lý Lương & Đóng gói dự án (Cả Admin & Staff)

1. **Auth Pages & User State (Core)**
   - Làm trang Login (email + password)
   - Form validation (email format, required)
   - Lưu JWT token vào Cookies + LocalStorage
   - Redirect tới dashboard sau login thành công
   - Error message từ backend
   - Dùng Zustand/Context API để lưu Global State (User Info, Roles)
   - Điều hướng quyền Admin/Staff

2. **Leave Request UI (Staff)**
   - Làm Form xin nghỉ phép/OT gồm:
     - Select loại phép (Phép năm, Phép không lương, v.v.)
     - DateRangePicker (từ ngày - đến ngày)
     - Hiển thị số ngày chọn tự động
     - TextArea nhập lý do
     - Validation: Kiểm tra số phép còn lại
   - Nút Submit + Cancel
   - Success message sau khi gửi
   - Nơi tạo dữ liệu đơn từ

3. **Approval Workflow UI (Admin)**
   - Làm trang danh sách các đơn nghỉ phép/OT đang chờ duyệt
   - Table với cột: Nhân viên, Loại phép, Từ ngày, Đến ngày, Lý do, Trạng thái
   - 2 nút: Approve + Reject
   - Modal thêm ghi chú khi phê duyệt
   - Status badge (Pending, Approved, Rejected)
   - Lịch sử phê duyệt
   - Nơi Admin duyệt đơn từ từ Staff

4. **Notification System (Staff)**
   - UI danh sách thông báo (Bell Icon ở Header)
   - Hiển thị số notification chưa đọc
   - Click bell → Dropdown danh sách thông báo
   - Loại thông báo:
     - Đơn phép được phê duyệt/từ chối
     - Thông báo từ admin
     - Nhắc nhở hết phép, hết hợp đồng
   - Toast notification (push) khi có thông báo mới
   - Mark as read / Delete notification

5. **Payroll Run UI (Admin)**
   - Làm trang quản lý lương cho Admin
   - Nút "Tính lương tháng" gọi Backend/Stored Proc
   - Table kết quả tính lương (Cơ bản, Phụ cấp, Khấu trừ, Net)
   - Loading indicator khi tính
   - Export Excel bảng lương
   - Xem chi tiết bảng lương từng nhân viên
   - Nơi tạo dữ liệu lương

6. **Personal Payslip UI (Staff)**
   - Làm trang danh sách phiếu lương theo tháng cho nhân viên
   - Table: Tháng, Năm, Trạng thái
   - Pagination (12 tháng gần nhất)
   - Click vào hàng → Hiển thị chi tiết phiếu lương
   - Modal/Page chi tiết:
     - Hiển thị: Mức lương cơ bản, Phụ cấp, Khấu trừ, Lương ròng
     - Nút "Tải PDF" để download phiếu lương
   - Nơi Staff xem dữ liệu lương từ Admin

7. **Admin Dashboard (Admin)**
   - Viết trang chủ quản trị
   - Stats Cards (Tổng nhân viên, Hôm nay vắng, Tháng này lương)
   - Chart.js - Biểu đồ cột: Nhân sự theo phòng ban
   - Chart.js - Biểu đồ đường: Chi phí lương theo tháng
   - Gắn liền với module lương

8. **Role-based Routing (Core)**
   - Thiết lập Private Routes
   - Chặn quyền truy cập giữa Staff Portal & Admin Portal dựa trên Role từ Token
   - ProtectedRoute, RoleGuard components
   - Redirect nếu không có quyền

9. **Responsive (Part 2)**
   - Tối ưu hóa hiển thị trên Mobile (375px, 768px)
   - Các màn hình Đơn từ, Lương & Dashboard
   - Sidebar collapse trên mobile
   - Form stacking trên mobile

10. **Final Integration & Docs**
    - Đóng gói thư mục dự án
    - Test chéo giao diện 2 người ghép lại
    - Kiểm tra tất cả routes, auth flow, API integration
    - Viết file README.md hướng dẫn chạy frontend
    - Setup environment variables (.env.local)
    - Testing trên Chrome, Firefox, Safari

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

### Authentication
- [ ] POST /auth/login → lưu token, redirect dashboard
- [ ] GET /auth/profile → lấy user info
- [ ] POST /auth/logout → clear token, redirect login

### Employee Management
- [ ] GET /employee → Danh sách (pagination, filter, search)
- [ ] GET /employee/:id → Chi tiết
- [ ] POST /employee → Thêm
- [ ] PUT /employee/:id → Sửa
- [ ] DELETE /employee/:id → Xóa

### Attendance
- [ ] POST /attendance → Check-in/Check-out
- [ ] GET /attendance → Danh sách
- [ ] GET /attendance/:id → Chi tiết

### Leave
- [ ] GET /leave/types → Loại phép
- [ ] POST /leave/request → Gửi đơn
- [ ] GET /leave/balance → Số dư phép
- [ ] GET /leave/requests → Danh sách đơn
- [ ] PUT /leave/requests/:id → Update (approve/reject)

### Payroll
- [ ] POST /payroll/calculate → Tính lương tháng
- [ ] GET /payroll → Danh sách
- [ ] GET /payroll/:id → Chi tiết

### Approval
- [ ] GET /approval/pending → Danh sách đơn chờ
- [ ] PUT /approval/:id/approve → Phê duyệt
- [ ] PUT /approval/:id/reject → Từ chối

### Dashboard
- [ ] GET /dashboard/stats → Thống kê chung
- [ ] GET /dashboard/charts → Dữ liệu biểu đồ

### Organization
- [ ] GET /organization/tree → Sơ đồ tổ chức

### Notification
- [ ] GET /notification → Danh sách thông báo
- [ ] PUT /notification/:id/read → Mark as read
- [ ] DELETE /notification/:id → Delete

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

## 📚 Tiếp Theo

Khi bạn sẵn sàng:
1. Frontend Developer A: Bắt đầu với `next create-app FE` và cấu hình Ant Design
2. Frontend Developer B: Chờ Admin Layout xong rồi tạo Staff Layout
3. Định kỳ sync giữa 2 dev để tránh conflict components
4. Code review & merge PR trước khi deploy

**Bạn muốn bắt đầu tạo Frontend project bây giờ?**
