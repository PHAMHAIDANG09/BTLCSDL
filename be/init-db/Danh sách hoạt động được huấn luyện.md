Dựa trên toàn bộ 2 script (Simulator + IndexOptimization), đây là danh sách đầy đủ:

---

## 📋 Danh sách hoạt động được huấn luyện trong NextHR Simulator 5 năm

---

### 🗂️ NHÓM 1 — DANH MỤC & CẤU HÌNH (Seed tĩnh)

| # | Hoạt động | Bảng liên quan | Index kích hoạt |
|---|-----------|---------------|-----------------|
| 1 | Seed Vai Trò hệ thống (Admin/Manager/Staff) | `VaiTro` | `UQ_VaiTro_TenVaiTro` |
| 2 | Seed Chức Vụ 4 cấp độ | `ChucVu` | `PK_ChucVu` |
| 3 | Seed Loại Nghỉ Phép (5 loại) | `LoaiNghiPhep` | `UQ_LoaiNghiPhep_TenLoaiPhep` |
| 4 | Seed Ngày Lễ 5 năm (2022-2026) | `NgayLe` | `UQ_NgayLe_NgayLe`, `IDX_NgayLe_Ngay` |
| 5 | Seed Phòng Ban cây 2 cấp (12 phòng) | `PhongBan` | `UQ_PhongBan_MaPhong`, `IDX_PhongBan_MaPhongCha_Covered` |
| 6 | Tra cứu cây phòng ban (MaPhongCha IS NULL) | `PhongBan` | `IDX_PhongBan_MaPhongCha_Covered` |
| 7 | Kiểm tra ngày có phải ngày lễ không | `NgayLe` | `IDX_NgayLe_Ngay` |

---

### 👤 NHÓM 2 — VÒNG ĐỜI NHÂN VIÊN

| # | Hoạt động | Bảng liên quan | Index kích hoạt |
|---|-----------|---------------|-----------------|
| 8 | Tuyển dụng 100 nhân viên (đa phòng ban, đa chức vụ) | `NhanVien` | `PK_NhanVien`, `UQ_NhanVien_MaNhanVien`, `UQ_NhanVien_Email` |
| 9 | Login bằng Email | `NhanVien` | `UQ_NhanVien_Email` |
| 10 | Tra cứu bằng Mã nhân viên | `NhanVien` | `UQ_NhanVien_MaNhanVien` |
| 11 | Tìm kiếm nhân viên theo tên (LIKE prefix) | `NhanVien` | `IDX_NhanVien_HoTen` |
| 12 | Lọc nhân viên theo Phòng Ban + Trạng thái | `NhanVien` | `IDX_NhanVien_PhongBan_TrangThai` |
| 13 | Lọc nhân viên đang Active (Dashboard) | `NhanVien` | `IDX_NhanVien_Active_Filtered` |
| 14 | Lọc Manager đang Active (phân quyền) | `NhanVien` | `IDX_NhanVien_VaiTro_TrangThai` |
| 15 | Báo cáo Turnover — nhân viên đã nghỉ việc | `NhanVien` | `IDX_NhanVien_NgayNghiViec_Filtered` |
| 16 | Đánh dấu nghỉ việc (Terminated) ~5%/năm | `NhanVien` | `IDX_NhanVien_NgayNghiViec_Filtered` |

---

### 📄 NHÓM 3 — HỢP ĐỒNG LAO ĐỘNG

| # | Hoạt động | Bảng liên quan | Index kích hoạt |
|---|-----------|---------------|-----------------|
| 17 | Ký hợp đồng ban đầu (Thử việc / Xác định / Vô thời hạn) | `HopDong` | `UQ_HopDong_SoHopDong` |
| 18 | Xem hợp đồng hiện hành của nhân viên | `HopDong` | `IDX_HopDong_NhanVien_TrangThai` |
| 19 | Kiểm tra hợp đồng đang Active | `HopDong` | `IDX_HopDong_Active_Filtered` |
| 20 | Cảnh báo hợp đồng sắp hết hạn (30 ngày) | `HopDong` | `IDX_HopDong_NgayHetHan` |
| 21 | Hết hạn hợp đồng Thử việc → Expired | `HopDong` | `IDX_HopDong_NgayHetHan` |
| 22 | Gia hạn hợp đồng → tạo HĐ mới Vô thời hạn | `HopDong` | `IDX_HopDong_NhanVien_TrangThai` |
| 23 | Chấm dứt hợp đồng khi nghỉ việc → Terminated | `HopDong` | `IDX_HopDong_NhanVien_TrangThai` |

---

### 💰 NHÓM 4 — LỊCH SỬ LƯƠNG & TĂNG LƯƠNG

| # | Hoạt động | Bảng liên quan | Index kích hoạt |
|---|-----------|---------------|-----------------|
| 24 | Ghi lương khởi điểm khi tuyển dụng | `LichSuLuong` | `PK_LichSuLuong` |
| 25 | Tăng lương định kỳ 8%/năm (2023-2026) | `LichSuLuong` | `IDX_LichSuLuong_HienTai_Covered` |
| 26 | Lấy lương đang hiệu lực để tính phiếu lương | `LichSuLuong` | `IDX_LichSuLuong_DangHieuLuc_Filtered` |
| 27 | Thống kê toàn bộ lương hiệu lực (kế toán) | `LichSuLuong` | `IDX_LichSuLuong_DangHieuLuc_Filtered` |
| 28 | Đóng bản ghi lương khi nhân viên nghỉ việc | `LichSuLuong` | `IDX_LichSuLuong_HienTai_Covered` |

---

### 🔀 NHÓM 5 — ĐIỀU CHUYỂN NHÂN SỰ

| # | Hoạt động | Bảng liên quan | Index kích hoạt |
|---|-----------|---------------|-----------------|
| 29 | Điều chuyển sang phòng ban mới (12 lần, có story thực tế) | `LichSuDieuChuyen` | `IDX_LichSuDieuChuyen_NhanVien` |
| 30 | Xem lịch sử điều chuyển của nhân viên | `LichSuDieuChuyen` | `IDX_LichSuDieuChuyen_NhanVien` |
| 31 | Xem ai đã đến / rời một phòng ban | `LichSuDieuChuyen` | `IDX_LichSuDieuChuyen_PhongBanMoi` |
| 32 | Thăng cấp (ChucVuMoiId > ChucVuCuId) | `LichSuDieuChuyen`, `NhanVien` | `IDX_LichSuDieuChuyen_NhanVien` |

---

### 🕐 NHÓM 6 — CHẤM CÔNG HÀNG NGÀY

| # | Hoạt động | Bảng liên quan | Index kích hoạt |
|---|-----------|---------------|-----------------|
| 33 | Chấm công đến (GioVao) — đa nguồn: Manual/Machine/MobileApp | `ChamCong` | `IDX_ChamCong_NhanVien_Ngay` |
| 34 | Chấm công về (GioRa + tính SoGioLam) | `ChamCong` | `IDX_ChamCong_NhanVien_Ngay` |
| 35 | Phát hiện và ghi nhận đi muộn (10% tỷ lệ) | `ChamCong` | `IDX_ChamCong_DiMuon_Filtered` |
| 36 | Màn hình điểm danh ngày — toàn bộ nhân viên | `ChamCong` | `IDX_ChamCong_Ngay_NhanVien` |
| 37 | Thống kê đi muộn trong tháng (báo cáo kỷ luật) | `ChamCong` | `IDX_ChamCong_DiMuon_Filtered` |
| 38 | Phân tích theo nguồn chấm công (audit) | `ChamCong` | `IDX_ChamCong_NguonChamCong` |
| 39 | Đếm ngày công thực tế để tính lương | `ChamCong` | `IDX_ChamCong_NhanVien_Ngay` |

---

### 🌴 NHÓM 7 — ĐƠN NGHỈ PHÉP

| # | Hoạt động | Bảng liên quan | Index kích hoạt |
|---|-----------|---------------|-----------------|
| 40 | Nhân viên nộp đơn nghỉ phép (3%/ngày) | `DonNghiPhep` | `PK_DonNghiPhep` |
| 41 | Kiểm tra số dư phép trước khi nộp đơn | `SoDuPhep` | `PK_SoDuPhep`, `IDX_SoDuPhep_Nam_NhanVien` |
| 42 | Xem "Đơn của tôi" — lịch sử phép theo nhân viên | `DonNghiPhep` | `IDX_DonNghiPhep_NhanVien_Ngay` |
| 43 | Manager xem danh sách đơn chờ duyệt | `DonNghiPhep` | `IDX_DonNghiPhep_Pending_Filtered` |
| 44 | Duyệt đơn nghỉ phép → Approved | `DonNghiPhep` | `IDX_DonNghiPhep_Pending_Filtered` |
| 45 | Từ chối đơn nghỉ phép → Rejected (~15%) | `DonNghiPhep` | `IDX_DonNghiPhep_Pending_Filtered` |
| 46 | Thống kê nghỉ phép theo loại + khoảng thời gian | `DonNghiPhep` | `IDX_DonNghiPhep_LoaiPhep_Ngay` |
| 47 | Trừ số dư phép sau khi duyệt (cuối tháng) | `SoDuPhep` | `PK_SoDuPhep` |
| 48 | Reset số dư phép đầu năm mới | `SoDuPhep` | `IDX_SoDuPhep_Nam_NhanVien` |

---

### ⏰ NHÓM 8 — ĐƠN LÀM THÊM GIỜ (OT)

| # | Hoạt động | Bảng liên quan | Index kích hoạt |
|---|-----------|---------------|-----------------|
| 49 | Nhân viên tạo đơn OT (10%/ngày) | `DonLamThem` | `PK_DonLamThem` |
| 50 | Xem lịch sử OT của nhân viên | `DonLamThem` | `IDX_DonLamThem_NhanVien_Ngay` |
| 51 | Manager xem OT chờ duyệt | `DonLamThem` | `IDX_DonLamThem_Pending_Filtered` |
| 52 | Duyệt OT → Approved (cuối ngày) | `DonLamThem` | `IDX_DonLamThem_Pending_Filtered` |
| 53 | Từ chối OT → Rejected (~5%) | `DonLamThem` | `IDX_DonLamThem_Pending_Filtered` |
| 54 | Tổng hợp OT đã duyệt trong tháng để tính tiền | `DonLamThem` | `IDX_DonLamThem_Approved_Thang` |

---

### 💵 NHÓM 9 — BẢNG LƯƠNG HÀNG THÁNG

| # | Hoạt động | Bảng liên quan | Index kích hoạt |
|---|-----------|---------------|-----------------|
| 55 | Tạo phiếu lương tự động ngày 28 hàng tháng | `PhieuLuong` | `UQ_PhieuLuong_KyLuong` |
| 56 | Tính công thức đầy đủ: BHXH 8%, BHYT 1.5%, BHTN 1%, Thuế TNCN | `PhieuLuong`, `LichSuLuong` | `IDX_LichSuLuong_DangHieuLuc_Filtered` |
| 57 | Tính tiền OT cộng vào lương | `PhieuLuong`, `DonLamThem` | `IDX_DonLamThem_Approved_Thang` |
| 58 | Khấu trừ đi muộn (100K/lần) | `PhieuLuong`, `ChamCong` | `IDX_ChamCong_DiMuon_Filtered` |
| 59 | Phê duyệt phiếu lương → Approved | `PhieuLuong` | `IDX_PhieuLuong_KyLuong_TrangThai` |
| 60 | Thanh toán lương ngày 30 → Paid | `PhieuLuong` | `IDX_PhieuLuong_KyLuong_TrangThai` |
| 61 | Kế toán xem phiếu lương chưa thanh toán | `PhieuLuong` | `IDX_PhieuLuong_ChuaThanhToan` |
| 62 | Xem lịch sử phiếu lương theo nhân viên | `PhieuLuong` | `IDX_PhieuLuong_NhanVien_KyLuong` |
| 63 | Thống kê tổng chi lương theo tháng/phòng ban | `PhieuLuong` | `IDX_PhieuLuong_Nam_Thang` |

---

### 📋 NHÓM 10 — AUDIT LOG & BẢO MẬT

| # | Hoạt động | Bảng liên quan | Index kích hoạt |
|---|-----------|---------------|-----------------|
| 64 | Ghi log LOGIN mỗi ngày | `NhatKyHeThong` | `IDX_NhatKy_NguoiThucHien_Ngay` |
| 65 | Ghi log INSERT (tạo phiếu lương) | `NhatKyHeThong` | `IDX_NhatKy_Bang_HanhDong_Ngay` |
| 66 | Ghi log UPDATE (duyệt đơn, điều chỉnh) | `NhatKyHeThong` | `IDX_NhatKy_Bang_HanhDong_Ngay` |
| 67 | Ghi log APPROVE (duyệt OT/phép) | `NhatKyHeThong` | `IDX_NhatKy_Bang_HanhDong_Ngay` |
| 68 | Ghi log EXPORT (xuất báo cáo) | `NhatKyHeThong` | `IDX_NhatKy_NguoiThucHien_Ngay` |
| 69 | Ghi log DELETE (xóa hợp đồng) | `NhatKyHeThong` | `IDX_NhatKy_Bang_MaBanGhi` |
| 70 | Audit: tìm lịch sử thay đổi của 1 record | `NhatKyHeThong` | `IDX_NhatKy_Bang_MaBanGhi` |
| 71 | Audit: ai đã làm gì trong khoảng thời gian | `NhatKyHeThong` | `IDX_NhatKy_NguoiThucHien_Ngay` |

---

### 🔧 NHÓM 11 — BẢO TRÌ INDEX (Tự động)

| # | Hoạt động | Cơ chế |
|---|-----------|--------|
| 72 | AUTO-REORGANIZE khi fragmentation 5-30% | Script cursor Phần 4.1 |
| 73 | AUTO-REBUILD khi fragmentation > 30% | Script cursor Phần 4.1 |
| 74 | UPDATE STATISTICS FULLSCAN sau rebuild | Phần 4.2 |
| 75 | UPDATE STATISTICS SAMPLE 30% cho bảng lớn (NhatKy) | Phần 4.2 |

---

**Tổng kết:**

| Nhóm | Số hoạt động | Bảng phủ |
|------|-------------|----------|
| Danh mục & Cấu hình | 7 | VaiTro, ChucVu, LoaiNghiPhep, NgayLe, PhongBan |
| Vòng đời nhân viên | 9 | NhanVien |
| Hợp đồng | 7 | HopDong |
| Lịch sử lương | 5 | LichSuLuong |
| Điều chuyển | 4 | LichSuDieuChuyen |
| Chấm công | 7 | ChamCong |
| Nghỉ phép | 9 | DonNghiPhep, SoDuPhep |
| Làm thêm giờ | 6 | DonLamThem |
| Bảng lương | 9 | PhieuLuong |
| Audit Log | 8 | NhatKyHeThong |
| Bảo trì Index | 4 | Toàn bộ DB |
| **Tổng** | **75 hoạt động** | **12/12 bảng** |