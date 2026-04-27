# 🎯 NextHR - Hệ Thống Quản Trị Nhân Sự

## 🚀 Hướng Dẫn Chạy Frontend

### 1️⃣ Cài Dependencies

```bash
npm install
```

### 2️⃣ Tạo File `.env.local`

Nếu chưa có, tạo file `.env.local` ở root folder:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000
```

### 3️⃣ Chạy Development Server

```bash
npm run dev
```

**Frontend sẽ chạy tại:** `http://localhost:3000`

---

## 📁 Cấu Trúc Dự Án

```
fe/
├── src/
│   ├── app/
│   │   ├── (admin)/
│   │   │   ├── layout.tsx                 # Admin Layout
│   │   │   ├── dashboard/
│   │   │   │   └── page.tsx              # Dashboard Page
│   │   │   ├── employee/
│   │   │   │   └── page.tsx              # Quản lý Nhân Viên
│   │   │   ├── attendance/
│   │   │   │   └── page.tsx              # Chấm Công
│   │   │   └── ...
│   │   ├── layout.tsx                    # Root Layout
│   │   ├── page.tsx                      # Home (Redirect)
│   │   └── globals.css
│   ├── components/
│   │   ├── layout/
│   │   │   ├── AdminLayout.tsx           # Admin Layout Wrapper
│   │   │   ├── Sidebar.tsx               # Menu Điều Hướng
│   │   │   └── Header.tsx                # Header + Breadcrumbs
│   │   ├── shared/
│   │   │   ├── Table/
│   │   │   │   └── Table.tsx             # Custom Table
│   │   │   └── Modal/
│   │   │       └── Modal.tsx             # Custom Modal
│   │   └── auth/
│   ├── services/
│   │   ├── api.ts                        # Axios Instance
│   │   └── ...
│   ├── store/
│   │   ├── appStore.ts                   # UI State (Zustand)
│   │   └── ...
│   ├── types/
│   │   └── ...
│   ├── utils/
│   │   └── ...
│   ├── constants/
│   │   ├── api-endpoints.ts              # API Endpoints
│   │   └── ...
│   └── config/
│       └── ...
├── package.json
├── tsconfig.json
├── next.config.ts
├── tailwind.config.ts
└── README.md
```

---

## 📖 Các Page Hiện Có

| Route | Tên | Mô Tả |
|-------|-----|-------|
| `/admin/dashboard` | Dashboard | Trang chủ quản trị |
| `/admin/employee` | Quản Lý Nhân Viên | Danh sách nhân viên với search |
| `/admin/attendance` | Chấm Công | Theo dõi giờ làm việc |

---

## 🔌 Kết Nối Backend

Ứng dụng frontend sẽ gọi API từ backend:

**Base URL:** `http://localhost:3000`

### Ví dụ:
- Login: `POST /auth/login`
- Danh sách nhân viên: `GET /employee`
- Chấm công: `GET /attendance`

---

## 🎨 Công Nghệ Sử Dụng

- **Framework**: Next.js 16 + React 19
- **UI Library**: Ant Design 6
- **Styling**: Tailwind CSS 4
- **State Management**: Zustand 5
- **HTTP Client**: Axios 1.15
- **Language**: TypeScript 5

---

## 💡 Features Hiện Tại

✅ **Sidebar Menu** - Điều hướng các page chính
✅ **Header** - Breadcrumbs, User Profile, Logout
✅ **Custom Table** - Với search bar tích hợp
✅ **Custom Modal** - Tái sử dụng trên toàn hệ thống
✅ **Zustand Store** - Quản lý UI state
✅ **Responsive Design** - Tối ưu cho mobile & desktop

---

## 📝 Ghi Chú Quan Trọng

1. **AntdRegistry** - Được cấu hình trong root layout để hỗ trợ Ant Design
2. **Tailwind + Ant Design** - Sử dụng cả hai, Ant Design là UI chính
3. **localStorage** - Token được lưu để maintain session
4. **CORS** - Backend cần bật CORS cho frontend origin

---

## 🐛 Troubleshooting

### Sidebar không hiển thị?
- Kiểm tra xem đang ở route `/admin/...`?
- Mở DevTools (F12) và kiểm tra Console có lỗi không?
- Restart dev server: `npm run dev`

### API không gọi được?
- Kiểm tra `.env.local` có đúng `NEXT_PUBLIC_API_URL`?
- Backend có chạy ở port 3000 không?
- Kiểm tra CORS header từ backend

### Styling lỗi?
- Clear cache: `rm -rf .next`
- Reinstall dependencies: `npm install`
- Restart dev server

---

## 🚀 Tiếp Theo

1. Tạo **Login Page** (`src/app/(auth)/login/page.tsx`)
2. Setup **Auth Service** (`src/services/auth.service.ts`)
3. Setup **Auth Store** (`src/store/authStore.ts`)
4. Tạo **Protected Routes** (`src/components/auth/ProtectedRoute.tsx`)
5. Tích hợp **API Calls** với Backend

---

## 📞 Support

Nếu gặp vấn đề, vui lòng check lại:
- Node.js version >= 18
- npm install đã đúng?
- `.env.local` đã setup?
- Backend có running ở port 3000?

**Happy Coding! 🎉**
